import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const targetUrl = "https://paw-memory404.vercel.app/m/demo";
const outputPath = fileURLToPath(
  new URL("../public/demo/paw-memory-demo-qr.png", import.meta.url),
);

await QRCode.toFile(outputPath, targetUrl, {
  type: "png",
  width: 360,
  margin: 4,
  errorCorrectionLevel: "H",
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
});

console.log(`Generated ${outputPath}`);
console.log(`Encoded URL: ${targetUrl}`);
