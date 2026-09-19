import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import JSZip from "jszip";
import jsQR from "jsqr";
import { PNG } from "pngjs";
import sharp from "sharp";
import { createBaseStl, createEngravingSvg, validateStlBytes, validateSvgStructure } from "../lib/fabrication/artifacts";
import { buildFabricationGeometry, disposeFabricationGeometry, validateClosedGeometry, verifyHoleQrClearance } from "../lib/fabrication/geometry";
import { DEFAULT_TAG_PARAMETERS, normalizeTagParameters } from "../lib/fabrication/types";

const outputDirectory = path.join(process.cwd(), "public", "fabrication");
const shareUrl = "https://paw-memory404.vercel.app/m/demo";
const stlPath = path.join(outputDirectory, "demo-base.stl");
const svgPath = path.join(outputDirectory, "demo-panel.svg");
const zipPath = path.join(outputDirectory, "demo-fabrication-kit.zip");

const [stlBuffer, svg, zipBuffer] = await Promise.all([
  readFile(stlPath),
  readFile(svgPath, "utf8"),
  readFile(zipPath),
]);

const stlBytes = new Uint8Array(stlBuffer.buffer, stlBuffer.byteOffset, stlBuffer.byteLength);
const stlResult = validateStlBytes(stlBytes, DEFAULT_TAG_PARAMETERS);
assert.equal(stlResult.valid, true, stlResult.messages.join("; "));
assert.equal(stlResult.boundaryEdgeCount, 0, "STL must have no open edges");
assert.equal(stlResult.nonManifoldEdgeCount, 0, "STL must be manifold");

const svgResult = validateSvgStructure(svg, DEFAULT_TAG_PARAMETERS, shareUrl);
assert.equal(svgResult.valid, true, "SVG dimensions, viewBox, layers, or URL do not match");
assert.equal(/<text\b/i.test(svg), false, "SVG engraving must not contain text elements");
assert.equal(verifyHoleQrClearance(DEFAULT_TAG_PARAMETERS), true, "Attachment holes intrude into QR clearance");

const defaultFabrication = buildFabricationGeometry(DEFAULT_TAG_PARAMETERS);
defaultFabrication.base.computeBoundingBox();
defaultFabrication.panel.computeBoundingBox();
const baseBox = defaultFabrication.base.boundingBox!;
const panelBox = defaultFabrication.panel.boundingBox!;
assert.equal(Number((baseBox.max.x - baseBox.min.x).toFixed(3)), Number((panelBox.max.x - panelBox.min.x).toFixed(3)), "Panel width must match base");
assert.equal(Number((baseBox.max.y - baseBox.min.y).toFixed(3)), Number((panelBox.max.y - panelBox.min.y).toFixed(3)), "Panel height must match base");
disposeFabricationGeometry(defaultFabrication);

const renderedPng = await sharp(Buffer.from(svg))
  .resize(1200, 840, { fit: "fill" })
  .flatten({ background: "#ffffff" })
  .png()
  .toBuffer();
const png = PNG.sync.read(renderedPng);
const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data ?? null;
assert.equal(decoded, shareUrl, "Rendered SVG QR must decode to the fixed demo memory URL");

const zip = await JSZip.loadAsync(zipBuffer);
for (const filename of ["pawstory-base.stl", "pawstory-laser-panel.svg", "scadqr-MIT-LICENSE.txt", "MODIFICATIONS.md"]) {
  assert.ok(zip.file(filename), `ZIP is missing ${filename}`);
}

for (const sample of [
  { width: 50, height: 36, thickness: 2 },
  { width: 67, height: 48, thickness: 3.5 },
  { width: 90, height: 65, thickness: 6 },
]) {
  const parameters = normalizeTagParameters({ ...DEFAULT_TAG_PARAMETERS, ...sample });
  const fabrication = buildFabricationGeometry(parameters);
  const result = validateClosedGeometry(fabrication.base, parameters);
  assert.equal(result.valid, true, `Shared geometry invariant failed for ${JSON.stringify(sample)}: ${result.messages.join("; ")}`);
  assert.equal(verifyHoleQrClearance(parameters), true, `QR clearance failed for ${JSON.stringify(sample)}`);
  const generatedSvg = createEngravingSvg(parameters, shareUrl, "PAW123");
  assert.equal(validateSvgStructure(generatedSvg, parameters, shareUrl).valid, true);
  const generatedStl = createBaseStl(parameters);
  assert.equal(validateStlBytes(generatedStl, parameters).valid, true);
  disposeFabricationGeometry(fabrication);
}

const manifest = {
  verified: true,
  generatedAt: new Date().toISOString(),
  shareUrl,
  stl: {
    dimensions: [
      Number(stlResult.dimensions.width.toFixed(3)),
      Number(stlResult.dimensions.height.toFixed(3)),
      Number(stlResult.dimensions.depth.toFixed(3)),
    ],
    triangleCount: stlResult.triangleCount,
    edgeCount: stlResult.edgeCount,
    boundaryEdgeCount: stlResult.boundaryEdgeCount,
    nonManifoldEdgeCount: stlResult.nonManifoldEdgeCount,
    reimportedWith: "Three.js STLLoader",
  },
  svg: {
    width: DEFAULT_TAG_PARAMETERS.width,
    height: DEFAULT_TAG_PARAMETERS.height,
    viewBox: `0 0 ${DEFAULT_TAG_PARAMETERS.width} ${DEFAULT_TAG_PARAMETERS.height}`,
    layers: ["cut-outline", "engraving-content"],
  },
  qrDecoded: decoded,
  panelMatchesBase: true,
  holeQrClearance: true,
};

await writeFile(path.join(outputDirectory, "demo-verification.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify(manifest, null, 2));
