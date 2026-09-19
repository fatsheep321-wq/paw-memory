import {
  Box3,
  BufferGeometry,
  ExtrudeGeometry,
  Path,
  Shape,
  TorusGeometry,
  Vector3,
} from "three";
import { getTagLayout, normalizeTagParameters, type TagParameters } from "./types";

export type FabricationGeometry = {
  base: BufferGeometry;
  panel: BufferGeometry;
  fasteners: BufferGeometry[];
  fabricLinks: BufferGeometry[];
};

function roundedRectangleShape(width: number, height: number, radius: number) {
  const x = -width / 2;
  const y = -height / 2;
  const shape = new Shape();
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  shape.closePath();
  return shape;
}

function plateGeometry(parameters: TagParameters, depth: number) {
  const shape = roundedRectangleShape(parameters.width, parameters.height, parameters.cornerRadius);
  const layout = getTagLayout(parameters);

  for (const [holeX, holeY] of layout.holeCenters) {
    const hole = new Path();
    hole.absarc(
      holeX - parameters.width / 2,
      holeY - parameters.height / 2,
      parameters.holeDiameter / 2,
      0,
      Math.PI * 2,
      true,
    );
    shape.holes.push(hole);
  }

  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 24,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

export function buildFabricationGeometry(input: TagParameters): FabricationGeometry {
  const parameters = normalizeTagParameters(input);
  const layout = getTagLayout(parameters);
  const base = plateGeometry(parameters, parameters.thickness);
  const panel = plateGeometry(parameters, parameters.panelThickness);

  const fasteners = layout.holeCenters.map(([x, y]) => {
    const geometry = new TorusGeometry(parameters.holeDiameter / 2 + 1.1, 0.75, 10, 28);
    geometry.translate(x - parameters.width / 2, y - parameters.height / 2, 0);
    return geometry;
  });

  const fabricLinks: BufferGeometry[] = [];
  const columns = 7;
  const rows = 4;
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const link = new TorusGeometry(4.1, 0.7, 8, 20);
      link.scale(1.25, 0.72, 1);
      if ((row + column) % 2 === 1) {
        link.rotateX(Math.PI / 4);
      }
      link.translate((column - (columns - 1) / 2) * 8, (row - (rows - 1) / 2) * 6.4, 0);
      fabricLinks.push(link);
    }
  }

  return { base, panel, fasteners, fabricLinks };
}

export function disposeFabricationGeometry(geometry: FabricationGeometry) {
  geometry.base.dispose();
  geometry.panel.dispose();
  geometry.fasteners.forEach((item) => item.dispose());
  geometry.fabricLinks.forEach((item) => item.dispose());
}

function quantizedVertex(geometry: BufferGeometry, index: number) {
  const position = geometry.getAttribute("position");
  const precision = 100_000;
  return [position.getX(index), position.getY(index), position.getZ(index)]
    .map((value) => Math.round(value * precision) / precision)
    .join(",");
}

export type GeometryValidation = {
  valid: boolean;
  dimensions: { width: number; height: number; depth: number };
  triangleCount: number;
  edgeCount: number;
  boundaryEdgeCount: number;
  nonManifoldEdgeCount: number;
  messages: string[];
};

export function validateClosedGeometry(geometry: BufferGeometry, expected: TagParameters): GeometryValidation {
  const source = geometry.index ? geometry.toNonIndexed() : geometry;
  const position = source.getAttribute("position");
  const edgeUses = new Map<string, number>();

  for (let index = 0; index < position.count; index += 3) {
    const vertices = [
      quantizedVertex(source, index),
      quantizedVertex(source, index + 1),
      quantizedVertex(source, index + 2),
    ];
    for (const [a, b] of [[0, 1], [1, 2], [2, 0]] as const) {
      const key = vertices[a] < vertices[b] ? `${vertices[a]}|${vertices[b]}` : `${vertices[b]}|${vertices[a]}`;
      edgeUses.set(key, (edgeUses.get(key) ?? 0) + 1);
    }
  }

  source.computeBoundingBox();
  const box = source.boundingBox!;
  const size = box.getSize(new Vector3());
  const tolerance = 0.02;
  const dimensions = { width: size.x, height: size.y, depth: size.z };
  const boundaryEdgeCount = [...edgeUses.values()].filter((uses) => uses === 1).length;
  const nonManifoldEdgeCount = [...edgeUses.values()].filter((uses) => uses > 2).length;
  const messages: string[] = [];
  if (Math.abs(size.x - expected.width) > tolerance) messages.push("STL 宽度与参数不匹配");
  if (Math.abs(size.y - expected.height) > tolerance) messages.push("STL 高度与参数不匹配");
  if (Math.abs(size.z - expected.thickness) > tolerance) messages.push("STL 厚度与参数不匹配");
  if (boundaryEdgeCount > 0) messages.push(`发现 ${boundaryEdgeCount} 条开放边`);
  if (nonManifoldEdgeCount > 0) messages.push(`发现 ${nonManifoldEdgeCount} 条非流形边`);

  if (source !== geometry) source.dispose();
  return {
    valid: messages.length === 0,
    dimensions,
    triangleCount: position.count / 3,
    edgeCount: edgeUses.size,
    boundaryEdgeCount,
    nonManifoldEdgeCount,
    messages,
  };
}

export function verifyHoleQrClearance(input: TagParameters) {
  const parameters = normalizeTagParameters(input);
  const { holeCenters, qr } = getTagLayout(parameters);
  const holeRadius = parameters.holeDiameter / 2;
  const clearance = 2;

  return holeCenters.every(([x, y]) => {
    const nearestX = Math.max(qr.x, Math.min(x, qr.x + qr.size));
    const nearestY = Math.max(qr.y, Math.min(y, qr.y + qr.size));
    return Math.hypot(x - nearestX, y - nearestY) >= holeRadius + clearance;
  });
}
