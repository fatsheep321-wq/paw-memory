"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { buildQrRelief, DEMO_OBJECT_URL } from "@/lib/fabrication/qr-relief";
export type Animal = "dog" | "cat" | "alpaca";
export type Accessory = "rain" | "birthday" | "snack";
export const accessories = {
  rain: { name: "小小雨衣", title: "雨天，也要一起出门", greeting: "雨再大，有你在就是好天气。", icon: "☂", color: "#efbf53" },
  birthday: { name: "生日帽", title: "又陪你长大了一岁", greeting: "每一年的愿望，都是你在身边。", icon: "✦", color: "#d79cbe" },
  snack: { name: "小零食", title: "藏在日常里的小幸福", greeting: "你的快乐，有时只需要一块小饼干。", icon: "♡", color: "#a1b59e" },
};

export function PetAvatar({ accessory, modelUrl, mono = false, animal = "dog", qrUrl = DEMO_OBJECT_URL }: { accessory: Accessory; modelUrl?: string; mono?: boolean; animal?: Animal; qrUrl?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!host.current) return;
    const element = host.current;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { setError("当前浏览器无法显示 3D，请查看雕刻预览。"); return; }
    setError("");
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
    camera.position.set(4, 2.9, 6);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.3, 0); controls.enablePan = false;
    controls.minDistance = 4; controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI * .52;
    controls.enableDamping = true;
    scene.add(new THREE.HemisphereLight(0xfff7ea, 0x8c837d, 2.6));
    const key = new THREE.DirectionalLight(0xfff7e5, 4); key.position.set(3, 6, 4); scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 2); fill.position.set(-4, 3, -2); scene.add(fill);
    const pet = new THREE.Group(); scene.add(pet);
    const material = (color: string) => new THREE.MeshStandardMaterial({ color: mono ? "#e9e3d8" : color, roughness: .62 });
    function ellipsoid(parent: THREE.Group, at: number[], size: number[], color: string) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), material(color));
      mesh.position.set(at[0], at[1], at[2]); mesh.scale.set(size[0], size[1], size[2]); parent.add(mesh); return mesh;
    }
    const body = new THREE.Group(); pet.add(body);
    if (animal === "dog") {
      ellipsoid(body,[0,.9,0],[.65,.85,.55],"#c39a73");
      ellipsoid(body,[0,1.95,.05],[.77,.69,.63],"#d9b68b");
      for(const side of [-1,1]) ellipsoid(body,[side*.64,1.85,-.02],[.25,.65,.31],"#88674f").rotation.z=side*.3;
      ellipsoid(body,[0,1.68,.55],[.48,.31,.29],"#f3dfbe");
      ellipsoid(body,[0,1.83,.79],[.16,.11,.1],"#383330");
      ellipsoid(body,[.66,.65,-.35],[.17,.48,.18],"#b08a62").rotation.z=-.65;
    } else if (animal === "cat") {
      ellipsoid(body,[0,.9,0],[.54,.85,.49],"#acb1ac");
      ellipsoid(body,[0,1.92,.08],[.66,.57,.55],"#cbd0c7");
      for(const side of [-1,1]) {
        const ear=new THREE.Mesh(new THREE.ConeGeometry(.26,.6,3),material("#a4ada7"));
        ear.position.set(side*.44,2.46,.02); ear.rotation.z=-side*.22; body.add(ear);
        const inner=new THREE.Mesh(new THREE.ConeGeometry(.15,.37,3),material("#d8aeb0"));
        inner.position.set(side*.44,2.47,.13); inner.rotation.z=-side*.22; body.add(inner);
        ellipsoid(body,[side*.17,1.75,.57],[.23,.15,.1],"#f6f0e8");
        for(let i=0;i<3;i++) {
          const whisker=new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,.39,8),material("#686c64"));
          whisker.position.set(side*.43,1.78-i*.055,.59); whisker.rotation.z=side*(1.35+i*.18); body.add(whisker);
        }
      }
      ellipsoid(body,[0,1.82,.65],[.075,.055,.035],"#b8767b");
      const tail=new THREE.Mesh(new THREE.TorusGeometry(.43,.12,18,48,Math.PI*1.4),material("#979e96"));
      tail.position.set(.55,.46,-.22); tail.rotation.x=.3; body.add(tail);
      for(const y of [2.1,2.22,2.34]) ellipsoid(body,[0,y,.59],[.055,.033,.022],"#858e85");
    } else {
      ellipsoid(body,[0,.8,0],[.67,.65,.54],"#e9dbc5");
      ellipsoid(body,[0,1.46,0],[.31,.74,.32],"#f1e5d0");
      ellipsoid(body,[0,2.13,.09],[.48,.44,.42],"#eee1c7");
      for(const side of [-1,1]) {
        ellipsoid(body,[side*.27,2.66,.02],[.13,.44,.15],"#dfceb3").rotation.z=-side*.14;
        ellipsoid(body,[side*.27,2.69,.15],[.064,.28,.032],"#c69691");
      }
      ellipsoid(body,[0,1.99,.46],[.3,.19,.23],"#d4b996");
      ellipsoid(body,[0,2.07,.65],[.095,.057,.03],"#77624e");
      for(let i=0;i<24;i++) {
        const a=i*2.39996; const y=.45+(i%5)*.18;
        ellipsoid(body,[Math.cos(a)*.52,y,Math.sin(a)*.43],[.22,.2,.2],"#eee2cf");
      }
      for(let i=0;i<7;i++) ellipsoid(body,[(i-3)*.105,2.44,.24],[.13,.12,.13],"#f5ecdb");
    }
    for(const x of [-.27,.27]) {
      const eyeY=animal==="alpaca"?2.18:2.04;
      const eyeZ=animal==="alpaca"?.43:.61;
      ellipsoid(body,[x,eyeY,eyeZ],[.06,.08,.045],"#302e2a");
      ellipsoid(body,[x-.016,eyeY+.025,eyeZ+.04],[.018,.022,.01],"#ffffff");
      ellipsoid(body,[x*1.3,.23,.3],[.23,.22,.33],animal==="cat"?"#e4e5dc":"#e5d2b4");
    }
    const outfit = new THREE.Group(); pet.add(outfit);
    if (accessory === "rain") {
      ellipsoid(outfit, [0, .91, -.04], [.69, .7, .59], "#eebc42");
      ellipsoid(outfit, [0, 1.36, .52], [.36, .35, .09], "#f6d876");
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(.62, .72, .12, 64), material("#eebc42"));
      brim.position.set(0, 2.45, .12); outfit.add(brim);
      ellipsoid(outfit, [0, 2.49, .02], [.53, .31, .47], "#f5ca55");
    } else if (accessory === "birthday") {
      const hat = new THREE.Mesh(new THREE.ConeGeometry(.4, .95, 64), material("#d79cbe"));
      hat.position.set(.07, 2.84, .01); hat.rotation.z = -.15; outfit.add(hat);
      ellipsoid(outfit, [.14, 3.3, .01], [.13, .13, .13], "#f6e7b6");
      for (const x of [-.2, 0, .2]) ellipsoid(outfit, [x, 2.63 + (x + .2), .29], [.047, .047, .03], "#fff1d4");
    } else {
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(.44, .33, .22, 48), material("#8fa28b"));
      bowl.position.set(0, .16, .96); outfit.add(bowl);
      for (const x of [-.17, .02, .18]) ellipsoid(outfit, [x, .3, .95], [.11, .075, .11], "#c19360");
    }
    if(animal === "alpaca" && accessory === "rain") outfit.scale.set(.9,.95,.95);
    if(animal === "alpaca" && accessory === "birthday") outfit.position.y=.12;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.22, .16, 80), material("#ede2d2"));
    base.position.y = -.03; scene.add(base);
    const plaque=new THREE.Mesh(buildQrRelief(qrUrl),new THREE.MeshStandardMaterial({vertexColors:true,roughness:.82}));
    plaque.scale.setScalar(.012); plaque.position.set(0,.26,1.25); plaque.rotation.x=-.18; scene.add(plaque);
    let disposed = false;
    const disposeObject = (object: THREE.Object3D) => object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        for (const m of Array.isArray(child.material) ? child.material : [child.material]) {
          for (const value of Object.values(m)) if (value instanceof THREE.Texture) value.dispose();
          m.dispose();
        }
      }
    });
    if (modelUrl) new GLTFLoader().load(modelUrl, (gltf) => {
      if (disposed) { disposeObject(gltf.scene); return; }
      body.visible = false; outfit.visible = false;
      const imported = gltf.scene;
      const box = new THREE.Box3().setFromObject(imported);
      const size = box.getSize(new THREE.Vector3()); const center = box.getCenter(new THREE.Vector3());
      const factor = 2.7 / Math.max(size.x, size.y, size.z, .001);
      imported.scale.setScalar(factor);
      imported.position.set(-center.x * factor, -box.min.y * factor + .05, -center.z * factor);
      pet.add(imported);
    }, undefined, () => { if (!disposed) setError("模型无法读取，已显示示例摆件。请使用完整的 GLB 文件。"); });
    const resize = () => { const w = element.clientWidth; const h = element.clientHeight; renderer.setSize(w, h); camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix(); };
    const observer = new ResizeObserver(resize); observer.observe(element); resize();
    let frame = 0;
    const render = () => { controls.update(); renderer.render(scene, camera); frame = requestAnimationFrame(render); }; render();
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); controls.dispose(); disposeObject(scene); renderer.dispose(); renderer.domElement.remove(); };
  }, [accessory, modelUrl, mono, animal, qrUrl]);
  return <div className="pet-canvas-wrap"><div ref={host} className="pet-canvas" role="img" aria-label="可拖动旋转的宠物摆件预览" />{error && <p className="avatar-error" role="alert">{error}</p>}<span className="canvas-hint">拖动看看它 · 双指缩放</span></div>;
}
