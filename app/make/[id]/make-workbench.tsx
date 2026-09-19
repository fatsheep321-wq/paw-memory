"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FabricationPreview } from "@/app/components/fabrication-preview";
import { ASCII_LABEL_PATTERN, createFabricationZip } from "@/lib/fabrication/artifacts";
import { SCADQR_COMMIT, SCADQR_PROJECT_URL } from "@/lib/fabrication/attribution";
import { verifyBrowserArtifacts, type BrowserArtifactVerification } from "@/lib/fabrication/browser-validation";
import {
  DEFAULT_TAG_PARAMETERS,
  TAG_PARAMETER_LIMITS,
  normalizeTagParameters,
  tagParametersEqual,
  type TagParameters,
} from "@/lib/fabrication/types";

type DemoVerification = {
  verified: boolean;
  shareUrl: string;
  stl: { dimensions: number[]; triangleCount: number; boundaryEdgeCount: number; nonManifoldEdgeCount: number } | null;
  svg: { width: number; height: number; viewBox: string; layers: string[] } | null;
  qrDecoded: string | null;
};

type MakeWorkbenchProps = {
  memoryId: string;
  petName: string;
  shareUrl: string;
  demo: boolean;
  demoVerification: DemoVerification;
};

const EMPTY_VERIFICATION: BrowserArtifactVerification = {
  baseValid: false,
  engravingValid: false,
  stl: null,
  svg: null,
  details: "正在生成并验证制造文件…",
};

function downloadBlob(data: string | Uint8Array<ArrayBufferLike>, type: string, filename: string) {
  let part: BlobPart;
  if (typeof data === "string") {
    part = data;
  } else {
    const copied = new Uint8Array(data.byteLength);
    copied.set(data);
    part = copied.buffer;
  }
  const url = URL.createObjectURL(new Blob([part], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function MakeWorkbench({ memoryId, petName, shareUrl, demo, demoVerification }: MakeWorkbenchProps) {
  const [parameters, setParameters] = useState<TagParameters>({ ...DEFAULT_TAG_PARAMETERS });
  const suggestedLabel = /^[A-Z0-9]{1,12}$/.test(petName.toUpperCase()) ? petName.toUpperCase() : demo ? "DOUBAO" : "";
  const [label, setLabel] = useState(suggestedLabel);
  const [verification, setVerification] = useState<BrowserArtifactVerification>(EMPTY_VERIFICATION);
  const [verifying, setVerifying] = useState(true);
  const [packing, setPacking] = useState(false);

  const normalized = useMemo(() => normalizeTagParameters(parameters), [parameters]);
  const isDefaultDemo = demo && tagParametersEqual(normalized, DEFAULT_TAG_PARAMETERS) && label === "DOUBAO";
  const engravingLabelValid = ASCII_LABEL_PATTERN.test(label);

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(async () => {
      setVerifying(true);
      const result = await verifyBrowserArtifacts(normalized, shareUrl, engravingLabelValid ? label : "");
      if (active) {
        setVerification(result);
        setVerifying(false);
      }
    }, 180);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [normalized, shareUrl, label, engravingLabelValid]);

  function setDimension(key: "width" | "height" | "thickness", value: number) {
    setParameters((current) => normalizeTagParameters({ ...current, [key]: value }));
  }

  async function downloadZip() {
    if (!verification.stl || !verification.svg || !verification.engravingValid) return;
    setPacking(true);
    try {
      const zip = await createFabricationZip(normalized, shareUrl, label, verification.stl, verification.svg);
      downloadBlob(zip, "application/zip", `pawstory-${memoryId}-fabrication.zip`);
    } finally {
      setPacking(false);
    }
  }

  return (
    <div className="grid gap-10">
      <div className="grid gap-8 lg:grid-cols-[1.22fr_0.78fr] lg:items-start">
        <FabricationPreview parameters={normalized} shareUrl={shareUrl} />

        <aside className="grid gap-5 rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_20px_50px_rgba(65,58,47,0.08)] sm:p-7">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[var(--coral-dark)]">PARAMETRIC WORKBENCH</p>
            <h2 className="mt-2 text-2xl font-semibold">牌体尺寸</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">底座与雕刻面板同宽高、同孔位；所有数值单位均为 mm。</p>
          </div>

          {([['width', '宽度'], ['height', '高度'], ['thickness', '底座厚度']] as const).map(([key, title]) => {
            const limits = TAG_PARAMETER_LIMITS[key];
            return (
              <label key={key} className="grid gap-2 text-sm font-semibold">
                <span className="flex items-center justify-between"><span>{title}</span><span>{normalized[key]} mm</span></span>
                <input type="range" min={limits.min} max={limits.max} step={limits.step} value={normalized[key]} onChange={(event) => setDimension(key, Number(event.target.value))} className="accent-[var(--coral)]" />
                <input type="number" min={limits.min} max={limits.max} step={limits.step} value={normalized[key]} onChange={(event) => setDimension(key, Number(event.target.value))} className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 font-normal" />
              </label>
            );
          })}

          <dl className="grid grid-cols-2 gap-2 rounded-2xl bg-[#eef0e7] p-4 text-xs">
            <div><dt className="text-[var(--muted)]">面板厚度</dt><dd className="mt-1 font-semibold">{normalized.panelThickness} mm</dd></div>
            <div><dt className="text-[var(--muted)]">固定孔</dt><dd className="mt-1 font-semibold">2 × Ø{normalized.holeDiameter} mm</dd></div>
            <div><dt className="text-[var(--muted)]">圆角</dt><dd className="mt-1 font-semibold">R{normalized.cornerRadius} mm</dd></div>
            <div><dt className="text-[var(--muted)]">QR 区</dt><dd className="mt-1 font-semibold">{normalized.qrSize} × {normalized.qrSize} mm</dd></div>
          </dl>

          <label className="grid gap-2 text-sm font-semibold">
            ASCII 雕刻标签
            <input value={label} maxLength={12} onChange={(event) => setLabel(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} placeholder="例如 DOUBAO" className="rounded-xl border border-[var(--line)] bg-white px-3 py-3 font-mono tracking-[0.12em]" />
            <span className="text-xs font-normal leading-5 text-[var(--muted)]">只支持 A–Z／0–9，共 1–12 字符；以真实点阵轮廓输出，不使用 SVG &lt;text&gt;。</span>
          </label>

          {!/^[A-Z0-9]{1,12}$/.test(petName.toUpperCase()) && (
            <p className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-xs leading-5 text-orange-900">“{petName}”含中文或不支持字符，浏览器无法可靠转为可交付轮廓，因此不会直接生成该名字，也不会在标签为空时开放雕刻 SVG／ZIP。请另填独立 ASCII 标签。</p>
          )}

          <div aria-live="polite" className={`rounded-2xl border p-4 text-xs leading-5 ${verification.baseValid ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-orange-200 bg-orange-50 text-orange-900"}`}>
            <p className="font-semibold">{verifying ? "正在验证…" : verification.baseValid ? "制造文件验证通过" : "制造文件尚不可下载"}</p>
            <p className="mt-1 break-words">{verifying ? "重导 STL、检查闭合边，并渲染 SVG 实际解码 QR。" : verification.details}</p>
          </div>

          {!verifying && (
            <div className="grid gap-2 sm:grid-cols-2">
              {verification.baseValid && verification.stl && (
                <button type="button" onClick={() => downloadBlob(verification.stl!, "model/stl", `pawstory-${memoryId}-base.stl`)} className="rounded-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white">下载底座 STL</button>
              )}
              {verification.engravingValid && verification.svg && (
                <button type="button" onClick={() => downloadBlob(verification.svg!, "image/svg+xml", `pawstory-${memoryId}-panel.svg`)} className="rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold">下载雕刻 SVG</button>
              )}
              {verification.engravingValid && verification.stl && verification.svg && (
                <button type="button" disabled={packing} onClick={downloadZip} className="rounded-full bg-[var(--coral)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2">{packing ? "正在封装…" : "下载 ZIP 制作包"}</button>
              )}
            </div>
          )}

          {isDefaultDemo && demoVerification.verified && (
            <div className="rounded-2xl border border-[var(--sage)] bg-[#f4f6f0] p-4 text-xs leading-5 text-[#52634f]">
              <p className="font-semibold">固定演示资产已通过离线验证</p>
              <p className="mt-1">STL {demoVerification.stl?.dimensions.join(" × ")} mm；开放边 {demoVerification.stl?.boundaryEdgeCount}；QR 解码为固定 demo URL。</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="/fabrication/demo-base.stl" download className="font-semibold underline">固定 STL</a>
                <a href="/fabrication/demo-panel.svg" download className="font-semibold underline">固定 SVG</a>
                <a href="/fabrication/demo-fabrication-kit.zip" download className="font-semibold underline">固定 ZIP</a>
              </div>
            </div>
          )}
        </aside>
      </div>

      <section className="grid gap-5 rounded-[2rem] border border-[var(--line)] bg-white/60 p-6 sm:grid-cols-2 sm:p-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--coral-dark)]">3D PRINT</p>
          <h2 className="mt-2 text-xl font-semibold">项目自建柔性链接参照＋底座＋固定结构</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">仅底座 STL 可下载。链接网格和透明身体用于解释组合关系，不是第三方面料样件、服装制造文件或尺寸适配结果。</p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--coral-dark)]">LASER ENGRAVING</p>
          <h2 className="mt-2 text-xl font-semibold">轮廓标签＋专属 QR＋独立切割层</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">SVG 红线只是切割轮廓约定，黑色为雕刻内容，不代表设备会自动识别。请在目标软件内确认图层与材料；本项目不提供功率、速度或 G-code。</p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--coral-dark)]">OPEN-SOURCE ATTRIBUTION</p>
        <h2 className="mt-2 text-2xl font-semibold">基于开源模型改编</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">圆角底板、固定孔与 QR padding 结构思路来自 <a className="font-semibold text-[var(--ink)] underline" href={SCADQR_PROJECT_URL}>scadqr</a>，作者 Darwin Schuppan and contributors，MIT License，固定 commit <code>{SCADQR_COMMIT}</code>。ZIP 包附原 MIT LICENSE 与修改说明；不得视为完全原创。</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/sources" className="rounded-full border border-[var(--line)] bg-white px-4 py-2">查看全部来源与许可评估</Link>
          <a href="/m/demo" className="rounded-full border border-[var(--line)] bg-white px-4 py-2">查看扫码后的数字回忆示例</a>
        </div>
      </section>

      <p className="text-xs leading-6 text-[var(--muted)]">安全说明：尚未实现照片转 3D、服装 STL 或宠物尺寸适配；打印公差、材料、耐用性、防水、固定方式与宠物穿戴舒适度均待实物验证。演示制作文件不是任何用户的专属成品。</p>
    </div>
  );
}
