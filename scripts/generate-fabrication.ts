import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createBaseStl, createEngravingSvg, createFabricationZip } from "../lib/fabrication/artifacts";
import { DEFAULT_TAG_PARAMETERS } from "../lib/fabrication/types";

const outputDirectory = path.join(process.cwd(), "public", "fabrication");
const shareUrl = "https://paw-memory404.vercel.app/m/demo";
const label = "DOUBAO";

await mkdir(outputDirectory, { recursive: true });
const stl = createBaseStl(DEFAULT_TAG_PARAMETERS);
const svg = createEngravingSvg(DEFAULT_TAG_PARAMETERS, shareUrl, label);
const zip = await createFabricationZip(DEFAULT_TAG_PARAMETERS, shareUrl, label, stl, svg);

await Promise.all([
  writeFile(path.join(outputDirectory, "demo-base.stl"), stl),
  writeFile(path.join(outputDirectory, "demo-panel.svg"), svg, "utf8"),
  writeFile(path.join(outputDirectory, "demo-fabrication-kit.zip"), zip),
  writeFile(
    path.join(outputDirectory, "demo-verification.json"),
    `${JSON.stringify({ verified: false, generatedAt: new Date().toISOString(), shareUrl, stl: null, svg: null, qrDecoded: null }, null, 2)}\n`,
    "utf8",
  ),
]);

console.log(JSON.stringify({ generated: true, shareUrl, stlBytes: stl.byteLength, svgBytes: Buffer.byteLength(svg), zipBytes: zip.byteLength }, null, 2));
