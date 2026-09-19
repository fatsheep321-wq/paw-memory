import JSZip from "jszip";
import QRCode from "qrcode";
import { Mesh } from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { fabricationModifications, SCADQR_MIT_LICENSE } from "./attribution";
import {
  buildFabricationGeometry,
  disposeFabricationGeometry,
  validateClosedGeometry,
  verifyHoleQrClearance,
  type GeometryValidation,
} from "./geometry";
import { getTagLayout, normalizeTagParameters, type TagParameters } from "./types";

const GLYPHS: Record<string, readonly string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
};

export const ASCII_LABEL_PATTERN = /^[A-Z0-9]{1,12}$/;

function number(value: number) {
  return Number(value.toFixed(5));
}

function glyphPaths(label: string, width: number) {
  const cell = Math.min(0.72, (width - 22) / (label.length * 6));
  const glyphWidth = cell * 5;
  const gap = cell;
  const totalWidth = label.length * glyphWidth + (label.length - 1) * gap;
  const startX = (width - totalWidth) / 2;
  const startY = 2;
  const paths: string[] = [];

  [...label].forEach((character, characterIndex) => {
    GLYPHS[character].forEach((row, rowIndex) => {
      [...row].forEach((pixel, columnIndex) => {
        if (pixel === "1") {
          const x = startX + characterIndex * (glyphWidth + gap) + columnIndex * cell;
          const y = startY + rowIndex * cell;
          paths.push(`M${number(x)} ${number(y)}h${number(cell * 0.78)}v${number(cell * 0.78)}h-${number(cell * 0.78)}z`);
        }
      });
    });
  });

  return paths.join("");
}

function qrPath(shareUrl: string, parameters: TagParameters) {
  const qr = QRCode.create(shareUrl, { errorCorrectionLevel: "H" });
  const layout = getTagLayout(parameters);
  const quiet = parameters.qrQuietModules;
  const totalModules = qr.modules.size + quiet * 2;
  const moduleSize = layout.qr.size / totalModules;
  const paths: string[] = [];

  for (let row = 0; row < qr.modules.size; row += 1) {
    for (let column = 0; column < qr.modules.size; column += 1) {
      if (qr.modules.get(row, column)) {
        const x = layout.qr.x + (column + quiet) * moduleSize;
        const y = layout.qr.y + (row + quiet) * moduleSize;
        paths.push(`M${number(x)} ${number(y)}h${number(moduleSize)}v${number(moduleSize)}h-${number(moduleSize)}z`);
      }
    }
  }

  return paths.join("");
}

function escapeAttribute(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function createEngravingSvg(input: TagParameters, shareUrl: string, asciiLabel: string) {
  const parameters = normalizeTagParameters(input);
  const label = asciiLabel.trim().toUpperCase();
  if (!ASCII_LABEL_PATTERN.test(label)) {
    throw new Error("雕刻标签仅支持 1–12 个 ASCII A–Z 或 0–9 字符。");
  }
  if (!verifyHoleQrClearance(parameters)) {
    throw new Error("固定孔与 QR 安全区间距不足。");
  }
  const layout = getTagLayout(parameters);
  const holes = layout.holeCenters
    .map(([x, y]) => `<circle cx="${number(x)}" cy="${number(y)}" r="${number(parameters.holeDiameter / 2)}"/>`)
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${number(parameters.width)}mm" height="${number(parameters.height)}mm" viewBox="0 0 ${number(parameters.width)} ${number(parameters.height)}" data-share-url="${escapeAttribute(shareUrl)}">
  <title>PawStory laser panel for ${escapeAttribute(label)}</title>
  <desc>Red strokes are a cut-outline convention; black filled paths are engraving content. Verify settings on the target machine.</desc>
  <g id="cut-outline" fill="none" stroke="#ff0000" stroke-width="0.1">
    <rect x="0.05" y="0.05" width="${number(parameters.width - 0.1)}" height="${number(parameters.height - 0.1)}" rx="${number(parameters.cornerRadius)}"/>
    ${holes}
  </g>
  <g id="engraving-content" fill="#000000" stroke="none">
    <path id="engraving-label-outline" d="${glyphPaths(label, parameters.width)}"/>
    <path id="memory-qr" fill-rule="evenodd" d="${qrPath(shareUrl, parameters)}"/>
  </g>
</svg>`;
}

export function createBaseStl(input: TagParameters) {
  const parameters = normalizeTagParameters(input);
  const fabrication = buildFabricationGeometry(parameters);
  const mesh = new Mesh(fabrication.base);
  mesh.name = "pawstory-rounded-two-hole-base";
  mesh.updateMatrixWorld(true);
  const exported = new STLExporter().parse(mesh, { binary: true });
  const bytes = new Uint8Array(exported.buffer, exported.byteOffset, exported.byteLength).slice();
  disposeFabricationGeometry(fabrication);
  return bytes;
}

export function validateSvgStructure(svg: string, input: TagParameters, expectedUrl: string) {
  const parameters = normalizeTagParameters(input);
  const widthMatches = svg.includes(`width="${number(parameters.width)}mm"`);
  const heightMatches = svg.includes(`height="${number(parameters.height)}mm"`);
  const viewBoxMatches = svg.includes(`viewBox="0 0 ${number(parameters.width)} ${number(parameters.height)}"`);
  const layersMatch = svg.includes('id="cut-outline"') && svg.includes('id="engraving-content"');
  const urlMatches = svg.includes(`data-share-url="${escapeAttribute(expectedUrl)}"`);
  const usesText = /<text\b/i.test(svg);
  const valid = widthMatches && heightMatches && viewBoxMatches && layersMatch && urlMatches && !usesText && verifyHoleQrClearance(parameters);
  return { valid, widthMatches, heightMatches, viewBoxMatches, layersMatch, urlMatches, usesText };
}

export function validateStlBytes(bytes: Uint8Array, input: TagParameters): GeometryValidation {
  const copy = bytes.slice();
  const geometry = new STLLoader().parse(copy.buffer);
  const result = validateClosedGeometry(geometry, normalizeTagParameters(input));
  geometry.dispose();
  return result;
}

export async function createFabricationZip(
  parameters: TagParameters,
  shareUrl: string,
  asciiLabel: string,
  stlBytes: Uint8Array<ArrayBufferLike> = createBaseStl(parameters),
  svg = createEngravingSvg(parameters, shareUrl, asciiLabel),
) {
  const normalized = normalizeTagParameters(parameters);
  const zip = new JSZip();
  zip.file("pawstory-base.stl", stlBytes);
  zip.file("pawstory-laser-panel.svg", svg);
  zip.file("scadqr-MIT-LICENSE.txt", SCADQR_MIT_LICENSE);
  zip.file(
    "MODIFICATIONS.md",
    fabricationModifications(`${normalized.width} × ${normalized.height} × ${normalized.thickness} mm; panel ${normalized.panelThickness} mm`),
  );
  return zip.generateAsync({ type: "uint8array", compression: "DEFLATE", compressionOptions: { level: 6 } });
}
