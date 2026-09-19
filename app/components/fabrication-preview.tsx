"use client";

import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import {
  AmbientLight,
  CapsuleGeometry,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { buildFabricationGeometry, disposeFabricationGeometry } from "@/lib/fabrication/geometry";
import { normalizeTagParameters, type TagParameters } from "@/lib/fabrication/types";

export type FabricationView = "print" | "laser";

type Visibility = {
  fabric: boolean;
  base: boolean;
  panel: boolean;
  fasteners: boolean;
  body: boolean;
};

type FabricationPreviewProps = {
  parameters: TagParameters;
  shareUrl: string;
  compact?: boolean;
};

function StaticStructureDiagram() {
  return (
    <svg className="size-full" viewBox="0 0 720 430" role="img" aria-label="制造组合静态结构图">
      <rect width="720" height="430" fill="#eef0e7" />
      <g fill="none" stroke="#93a58f" strokeWidth="4" opacity="0.75">
        {Array.from({ length: 9 }, (_, column) => Array.from({ length: 5 }, (_, row) => (
          <ellipse key={`${column}-${row}`} cx={95 + column * 64} cy={75 + row * 58} rx="29" ry="17" />
        )))}
      </g>
      <rect x="205" y="125" width="310" height="190" rx="22" fill="#dc6950" stroke="#873f30" strokeWidth="6" />
      <circle cx="240" cy="280" r="13" fill="#eef0e7" stroke="#873f30" strokeWidth="5" />
      <circle cx="480" cy="280" r="13" fill="#eef0e7" stroke="#873f30" strokeWidth="5" />
      <rect x="235" y="90" width="310" height="190" rx="22" fill="#fffdf8" fillOpacity="0.88" stroke="#2f3330" strokeWidth="5" />
      <text x="360" y="345" textAnchor="middle" fontSize="18" fontWeight="700" fill="#2f3330">静态结构图：参照网格／底座／雕刻面板／固定环</text>
    </svg>
  );
}

export function FabricationPreview({ parameters, shareUrl, compact = false }: FabricationPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [view, setView] = useState<FabricationView>("print");
  const [exploded, setExploded] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>({ fabric: true, base: true, panel: true, fasteners: true, body: true });
  const [renderError, setRenderError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const resetCameraRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(shareUrl, { width: 180, margin: 4, errorCorrectionLevel: "H" })
      .then((value) => { if (active) setQrDataUrl(value); })
      .catch(() => { if (active) setQrDataUrl(""); });
    return () => { active = false; };
  }, [shareUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let resizeObserver: ResizeObserver | undefined;
    let renderer: WebGLRenderer | undefined;
    let fabrication: ReturnType<typeof buildFabricationGeometry> | undefined;
    const materials: (MeshStandardMaterial | MeshPhysicalMaterial)[] = [];

    try {
      const normalized = normalizeTagParameters(parameters);
      const scene = new Scene();
      scene.background = new Color("#eef0e7");
      const camera = new PerspectiveCamera(37, 1, 0.1, 1000);
      const resetCamera = () => {
        camera.position.set(72, -74, 72);
        camera.lookAt(0, 0, 0);
      };
      resetCamera();
      resetCameraRef.current = resetCamera;

      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = !reducedMotion;
      controls.dampingFactor = 0.07;
      controls.minDistance = 55;
      controls.maxDistance = 190;
      controls.target.set(0, 0, 0);
      controls.update();
      resetCameraRef.current = () => {
        resetCamera();
        controls.target.set(0, 0, 0);
        controls.update();
      };

      scene.add(new AmbientLight("#fff8ea", 2.1));
      const keyLight = new DirectionalLight("#ffffff", 3.2);
      keyLight.position.set(50, -20, 90);
      scene.add(keyLight);
      const fillLight = new DirectionalLight("#b9d4d0", 1.5);
      fillLight.position.set(-50, 30, 20);
      scene.add(fillLight);

      fabrication = buildFabricationGeometry(normalized);
      const assembly = new Group();
      scene.add(assembly);

      const baseMaterial = new MeshStandardMaterial({ color: "#dc6950", roughness: 0.56, metalness: 0.02 });
      const panelMaterial = new MeshStandardMaterial({ color: view === "laser" ? "#f1dfbd" : "#fff8e9", roughness: 0.72 });
      const fastenerMaterial = new MeshStandardMaterial({ color: "#49514c", roughness: 0.38, metalness: 0.5 });
      const fabricMaterial = new MeshStandardMaterial({ color: "#8fa58b", roughness: 0.78, metalness: 0 });
      const bodyMaterial = new MeshPhysicalMaterial({ color: "#9bb7b0", transparent: true, opacity: 0.13, roughness: 0.4, depthWrite: false });
      materials.push(baseMaterial, panelMaterial, fastenerMaterial, fabricMaterial, bodyMaterial);

      const fabricGroup = new Group();
      fabrication.fabricLinks.forEach((item) => fabricGroup.add(new Mesh(item, fabricMaterial)));
      fabricGroup.visible = visibility.fabric && view === "print";
      assembly.add(fabricGroup);

      const baseMesh = new Mesh(fabrication.base, baseMaterial);
      baseMesh.visible = visibility.base;
      assembly.add(baseMesh);

      const panelMesh = new Mesh(fabrication.panel, panelMaterial);
      panelMesh.visible = visibility.panel;
      assembly.add(panelMesh);

      const fastenerGroup = new Group();
      fabrication.fasteners.forEach((item) => fastenerGroup.add(new Mesh(item, fastenerMaterial)));
      fastenerGroup.visible = visibility.fasteners && view === "print";
      assembly.add(fastenerGroup);

      const bodyGroup = new Group();
      const torso = new Mesh(new CapsuleGeometry(23, 48, 12, 24), bodyMaterial);
      torso.rotateZ(Math.PI / 2);
      torso.scale.set(1, 0.65, 0.75);
      const head = new Mesh(new SphereGeometry(18, 24, 16), bodyMaterial);
      head.position.set(-36, 1, 0);
      bodyGroup.add(torso, head);
      bodyGroup.visible = visibility.body && view === "print";
      assembly.add(bodyGroup);

      const assembledPanelZ = normalized.thickness / 2 + normalized.panelThickness / 2 + 0.25;
      const setTargets = (instant: boolean) => {
        const targets = exploded
          ? {
              fabric: [-48, 0, -7],
              base: [0, 0, 0],
              panel: [48, 0, 8],
              fasteners: [0, -31, 8],
              body: [0, 38, -17],
            }
          : {
              fabric: [0, 0, -4.2],
              base: [0, 0, 0],
              panel: [0, 0, assembledPanelZ],
              fasteners: [0, 0, assembledPanelZ + 1.2],
              body: [0, 20, -18],
            };
        ([fabricGroup, baseMesh, panelMesh, fastenerGroup, bodyGroup] as Group[]).forEach((object, index) => {
          const target = Object.values(targets)[index];
          object.userData.target = target;
          if (instant) object.position.set(target[0], target[1], target[2]);
        });
      };
      setTargets(reducedMotion);

      const resize = () => {
        const width = canvas.clientWidth || 720;
        const height = canvas.clientHeight || 430;
        renderer!.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);
      resize();

      const animate = () => {
        animationFrame = window.requestAnimationFrame(animate);
        if (!reducedMotion) {
          [fabricGroup, baseMesh, panelMesh, fastenerGroup, bodyGroup].forEach((object) => {
            const target = object.userData.target as [number, number, number];
            object.position.x += (target[0] - object.position.x) * 0.09;
            object.position.y += (target[1] - object.position.y) * 0.09;
            object.position.z += (target[2] - object.position.z) * 0.09;
          });
          if (autoRotate && view === "print") assembly.rotation.z += 0.0025;
        }
        controls.update();
        renderer!.render(scene, camera);
      };
      animate();
      setRenderError("");

      return () => {
        window.cancelAnimationFrame(animationFrame);
        resizeObserver?.disconnect();
        controls.dispose();
        torso.geometry.dispose();
        head.geometry.dispose();
        materials.forEach((material) => material.dispose());
        if (fabrication) disposeFabricationGeometry(fabrication);
        renderer?.dispose();
      };
    } catch (error) {
      setRenderError(error instanceof Error ? error.message : "浏览器无法初始化 3D 模型。");
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      materials.forEach((material) => material.dispose());
      if (fabrication) disposeFabricationGeometry(fabrication);
      renderer?.dispose();
    }
  }, [parameters, view, exploded, autoRotate, visibility]);

  function togglePart(part: keyof Visibility) {
    setVisibility((current) => ({ ...current, [part]: !current[part] }));
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] shadow-[0_24px_70px_rgba(65,58,47,0.14)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] p-4 sm:p-5">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--coral-dark)]">REAL THREE.JS GEOMETRY</p>
          <p className="mt-1 text-sm font-semibold">制造组合／分解预览</p>
        </div>
        <div className="flex rounded-full bg-[#eef0e7] p-1 text-xs font-semibold">
          <button type="button" onClick={() => setView("print")} className={`rounded-full px-3 py-2 ${view === "print" ? "bg-white shadow-sm" : "text-[var(--muted)]"}`}>3D 打印</button>
          <button type="button" onClick={() => { setView("laser"); setAutoRotate(false); }} className={`rounded-full px-3 py-2 ${view === "laser" ? "bg-white shadow-sm" : "text-[var(--muted)]"}`}>激光雕刻</button>
        </div>
      </div>

      <div className={`relative bg-[#eef0e7] ${compact ? "aspect-[5/4]" : "aspect-[16/10] min-h-80"}`}>
        {renderError ? <StaticStructureDiagram /> : <canvas ref={canvasRef} className="block size-full touch-none" aria-label="可旋转缩放的制造部件 Three.js 预览" />}
        {qrDataUrl && (
          <div className="qr-static pointer-events-none absolute bottom-3 right-3 rounded-xl border border-black/10 bg-white p-2 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="静止的当前回忆网址二维码检查图" className="size-18 sm:size-22" />
            <p className="mt-1 text-center text-[0.58rem] font-semibold text-black">QR 静止检查</p>
          </div>
        )}
        {renderError && <p className="absolute left-3 top-3 max-w-sm rounded-xl bg-white/92 p-3 text-xs text-[var(--coral-dark)]">3D 模型载入失败：{renderError}。已显示静态结构图。</p>}
      </div>

      <div className="grid gap-3 p-4 text-xs sm:p-5">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setExploded((value) => !value)} className="rounded-full border border-[var(--line)] bg-white px-3 py-2 font-semibold">{exploded ? "合拢部件" : "分解部件"}</button>
          <button type="button" onClick={() => setAutoRotate((value) => !value)} disabled={view === "laser"} className="rounded-full border border-[var(--line)] bg-white px-3 py-2 font-semibold disabled:opacity-40">{autoRotate ? "暂停自动旋转" : "开启自动旋转"}</button>
          <button type="button" onClick={() => resetCameraRef.current()} className="rounded-full border border-[var(--line)] bg-white px-3 py-2 font-semibold">复位镜头</button>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="部件显隐">
          {([['fabric', '参照网格'], ['base', '底座'], ['panel', '雕刻面板'], ['fasteners', '固定结构'], ['body', '身体参照']] as const).map(([key, label]) => (
            <button key={key} type="button" aria-pressed={visibility[key]} onClick={() => togglePart(key)} className={`rounded-full px-3 py-2 font-semibold ${visibility[key] ? "bg-[var(--ink)] text-white" : "bg-[#eef0e7] text-[var(--muted)]"}`}>{label}</button>
          ))}
        </div>
        <p className="leading-5 text-[var(--muted)]">OrbitControls 支持拖动旋转与滚轮／双指缩放。平滑着色只服务显示，不代表加工精度；身体与柔性链接面料均为项目自建比例参照，不是照片还原、服装 STL 或合身设计。</p>
      </div>
    </div>
  );
}
