import QRCode from "qrcode";
import { BufferGeometry, Float32BufferAttribute, Mesh, MeshStandardMaterial } from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";

export const DEMO_OBJECT_URL = "https://paw-memory404.vercel.app/awaken/demo";
export const QR_WIDTH_MM = 60;
export const QR_BASE_MM = 2;
export const QR_RELIEF_MM = .8;

/** A single closed surface. Tiny insets prevent diagonal modules touching at non-manifold edges. */
export function buildQrRelief(url: string) {
  const matrix = QRCode.create(url, { errorCorrectionLevel: "M" }).modules;
  const n = matrix.size + 8;
  const cell = QR_WIDTH_MM / n;
  const positions: number[] = [];
  const colors: number[] = [];
  type P = [number, number, number];
  function triangle(a: P, b: P, c: P, dark = false) {
    positions.push(...a, ...b, ...c);
    const color = dark ? [.025, .032, .028] : [.95, .92, .84];
    colors.push(...color, ...color, ...color);
  }
  function quad(a: P, b: P, c: P, d: P, dark = false) { triangle(a,b,c,dark); triangle(a,c,d,dark); }
  for (let row = 0; row < n; row++) for (let col = 0; col < n; col++) {
    const x = col * cell - QR_WIDTH_MM / 2;
    const y = (n - row - 1) * cell - QR_WIDTH_MM / 2;
    const p: P[] = [[x,y,2],[x+cell,y,2],[x+cell,y+cell,2],[x,y+cell,2]];
    const dark = row >= 4 && row < n-4 && col >= 4 && col < n-4 && matrix.get(row-4,col-4);
    if (dark) {
      const inset = .002;
      const inner: P[] = [[x+inset,y+inset,2],[x+cell-inset,y+inset,2],[x+cell-inset,y+cell-inset,2],[x+inset,y+cell-inset,2]];
      const top: P[] = inner.map(([a,b]) => [a,b,2.8]);
      for (let i=0;i<4;i++) {
        const j=(i+1)%4;
        quad(p[i],p[j],inner[j],inner[i]);
        quad(inner[i],inner[j],top[j],top[i],true);
      }
      quad(top[0],top[1],top[2],top[3],true);
    } else quad(p[0],p[1],p[2],p[3]);
    const bottom: P[] = p.map(([a,b])=>[a,b,0]);
    quad(bottom[3],bottom[2],bottom[1],bottom[0]);
    if (row===n-1) quad(bottom[0],bottom[1],p[1],p[0]);
    if (col===n-1) quad(bottom[1],bottom[2],p[2],p[1]);
    if (row===0) quad(bottom[2],bottom[3],p[3],p[2]);
    if (col===0) quad(bottom[3],bottom[0],p[0],p[3]);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position",new Float32BufferAttribute(positions,3));
  geometry.setAttribute("color",new Float32BufferAttribute(colors,3));
  geometry.computeVertexNormals();
  return geometry;
}

export function qrReliefStl(url: string) {
  const geometry = buildQrRelief(url);
  const material = new MeshStandardMaterial();
  const result = new STLExporter().parse(new Mesh(geometry, material));
  geometry.dispose(); material.dispose();
  return result;
}
