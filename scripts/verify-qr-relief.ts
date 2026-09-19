import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { Vector3 } from "three";
import sharp from "sharp";
import jsQR from "jsqr";
import { qrReliefStl, DEMO_OBJECT_URL } from "../lib/fabrication/qr-relief";

for (const url of [DEMO_OBJECT_URL, "https://paw-memory404.vercel.app/m/12345678-1234-4123-8123-123456789abc?accessory=birthday"]) {
  const stl=qrReliefStl(url);
  const geometry=new STLLoader().parse(stl);
  geometry.computeBoundingBox();
  const size=geometry.boundingBox!.getSize(new Vector3());
  assert.ok(Math.abs(size.x-60)<.001 && Math.abs(size.y-60)<.001 && Math.abs(size.z-2.8)<.001);
  const p=geometry.getAttribute("position");
  const edges=new Map<string,number>();
  const faces:string[]=[];
  let volume=0;
  const point=(i:number)=>[p.getX(i),p.getY(i),p.getZ(i)];
  for(let i=0;i<p.count;i+=3) {
    const v=[point(i),point(i+1),point(i+2)];
    const ids=v.map(a=>a.map(x=>x.toFixed(4)).join(","));
    for(let j=0;j<3;j++) { const key=[ids[j],ids[(j+1)%3]].sort().join("|"); edges.set(key,(edges.get(key)||0)+1); }
    const [a,b,c]=v;
    volume+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6;
    if(v.every(a=>a[2]>2.79)) faces.push(`M${v.map(a=>`${a[0]+30},${30-a[1]}`).join("L")}Z`);
  }
  assert.equal([...edges.values()].filter(n=>n!==2).length,0,"Every STL edge must belong to exactly two faces");
  assert.ok(volume>7200,"Raised modules must add actual positive volume to the base");
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><rect width="60" height="60" fill="white"/><path fill="black" d="${faces.join("")}"/></svg>`;
  const renderer=sharp(Buffer.from(svg),{density:720}).resize(600,600);
  const {data,info}=await renderer.ensureAlpha().raw().toBuffer({resolveWithObject:true});
  assert.equal(jsQR(new Uint8ClampedArray(data),info.width,info.height)?.data,url,"Actual exported STL relief must decode to its exact target");
  if(url===DEMO_OBJECT_URL) writeFileSync("public/fabrication/demo-qr-relief.stl",stl);
  geometry.dispose();
  console.log(JSON.stringify({url,dimensions:[size.x,size.y,size.z],triangles:p.count/3,openOrNonManifoldEdges:0,decodedFromExportedGeometry:true}));
}
