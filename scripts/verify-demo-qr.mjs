import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import jsQR from "jsqr";
import { PNG } from "pngjs";

const expectedUrl = "https://paw-memory404.vercel.app/m/demo";
const qrPath = fileURLToPath(
  new URL("../public/demo/paw-memory-demo-qr.png", import.meta.url),
);
const image = PNG.sync.read(await readFile(qrPath));
const pixels = new Uint8ClampedArray(image.data);
const decoded = jsQR(pixels, image.width, image.height, {
  inversionAttempts: "dontInvert",
});

if (!decoded) {
  throw new Error("Unable to decode the generated QR code.");
}

if (decoded.data !== expectedUrl) {
  throw new Error(
    `QR code mismatch: expected ${expectedUrl}, received ${decoded.data}`,
  );
}

console.log(`Decoded URL: ${decoded.data}`);
console.log(`QR dimensions: ${image.width}x${image.height}`);
