"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";

const outfits = [
  { name: "珊瑚橙", value: "#dc6950", dark: "#a94331", light: "#f5b29f" },
  { name: "鼠尾草绿", value: "#8fa58b", dark: "#566d54", light: "#cad8c6" },
  { name: "晴空蓝", value: "#7899ad", dark: "#456579", light: "#bfd2dd" },
] as const;

type WearablePreviewProps = {
  name?: string;
  compact?: boolean;
};

export function WearablePreview({ name = "豆包", compact = false }: WearablePreviewProps) {
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [isTagOpen, setIsTagOpen] = useState(false);
  const descriptionId = useId();
  const outfit = outfits[outfitIndex];
  const previewName = name.trim() || "牠的名字";

  return (
    <div className={`wearable-preview overflow-hidden rounded-[2rem] border border-white/80 bg-[var(--paper)] shadow-[0_24px_70px_rgba(65,58,47,0.14)] ${compact ? "p-4" : "p-5 sm:p-7"}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-[var(--line)] bg-white/80 px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.12em] text-[var(--coral-dark)]">
          穿戴概念预览
        </span>
        <span className="text-xs text-[var(--muted)]">点击背部回忆牌</span>
      </div>

      <div className={`relative mt-4 overflow-hidden rounded-[1.5rem] bg-[#eef0e7] ${compact ? "aspect-[4/3]" : "aspect-[5/4]"}`}>
        <div className="memory-grid absolute inset-0 opacity-55" />
        <div className="wearable-float absolute inset-0">
          <svg className="size-full" viewBox="0 0 520 410" role="img" aria-labelledby={`${descriptionId}-title ${descriptionId}-desc`}>
            <title id={`${descriptionId}-title`}>{previewName}穿着背心和回忆牌的概念图</title>
            <desc id={`${descriptionId}-desc`}>一只侧身站立的狗狗，穿着可换色背心，背部固定一块带爪印的回忆牌。</desc>
            <ellipse cx="265" cy="360" rx="178" ry="22" fill="#75806f" opacity="0.13" />
            <path d="M144 202c-13-39-4-85 27-112 13-11 24-8 27 8l4 29c24-13 56-18 91-13 77 11 127 70 117 137-4 26-19 50-41 68l-7 48h-42l-8-30c-24 8-55 10-85 5l-6 25h-43l-3-51c-34-25-48-67-31-114Z" fill="#c99263" />
            <path d="M149 196c-25-18-45-48-46-78-1-12 8-18 18-10 22 18 39 47 43 77Z" fill="#ae744e" />
            <path d="M155 116c-21-35-17-70 5-79 17-7 31 28 26 73Z" fill="#8e5a3d" />
            <path d="M178 94c8-21 30-25 43-7l9 28-37 16Z" fill="#a86c47" />
            <path d="M164 158c-29 3-51 19-52 38-1 18 27 30 63 21 21-5 33-19 29-35-4-17-18-27-40-24Z" fill="#e1b080" />
            <circle cx="177" cy="144" r="7" fill="#302d29" />
            <circle cx="179" cy="142" r="2" fill="#fff" />
            <path d="M112 190c-8 0-14 5-14 11 0 7 10 12 21 9 7-2 10-7 8-12-2-6-7-8-15-8Z" fill="#403a35" />
            <path d="M120 213c14 10 30 9 42 2" fill="none" stroke="#734b36" strokeWidth="4" strokeLinecap="round" />
            <path d="M204 137c55-27 135-7 173 42 24 32 27 72 8 104-48 24-144 23-207-9-13-48-3-105 26-137Z" fill={outfit.value} className="outfit-fill" />
            <path d="M205 137c19 21 31 55 29 91-1 26-9 48-21 65-13-5-25-11-35-19-13-48-3-105 26-137Z" fill={outfit.light} className="outfit-fill" opacity="0.9" />
            <path d="M230 127c-6 35 1 74 20 103M347 156c-15 26-22 62-15 98" fill="none" stroke={outfit.dark} className="outfit-stroke" strokeWidth="9" strokeLinecap="round" opacity="0.55" />
            <path d="M188 183c-15 10-24 31-22 54" fill="none" stroke={outfit.dark} className="outfit-stroke" strokeWidth="12" strokeLinecap="round" />
            <g className="memory-tag-visual">
              <path d="M275 151h72a14 14 0 0 1 14 14v65a14 14 0 0 1-14 14h-72a14 14 0 0 1-14-14v-65a14 14 0 0 1 14-14Z" fill="#fffdf8" stroke="#3f443f" strokeWidth="5" />
              <circle cx="311" cy="164" r="5" fill="none" stroke="#3f443f" strokeWidth="3" />
              <circle cx="298" cy="188" r="5" fill={outfit.value} className="outfit-fill" />
              <circle cx="324" cy="188" r="5" fill={outfit.value} className="outfit-fill" />
              <circle cx="290" cy="202" r="4" fill={outfit.value} className="outfit-fill" />
              <circle cx="332" cy="202" r="4" fill={outfit.value} className="outfit-fill" />
              <path d="M311 197c-10 0-17 9-17 17 0 6 5 9 10 9 3 0 5-2 7-2s4 2 7 2c5 0 10-3 10-9 0-8-7-17-17-17Z" fill={outfit.value} className="outfit-fill" />
              <text x="311" y="237" textAnchor="middle" fontSize="10" fontWeight="700" fill="#3f443f">SCAN ME</text>
            </g>
            <path d="M379 190c38-4 66-29 75-61 4-13 17-10 16 4-2 49-35 88-82 99Z" fill="#b87f55" />
          </svg>
        </div>
        <button
          type="button"
          className="memory-tag-button absolute left-[50%] top-[36%] h-[25%] w-[23%] -translate-x-1/2 rounded-xl focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[var(--coral)]"
          aria-expanded={isTagOpen}
          aria-controls={descriptionId}
          aria-label="展开回忆牌扫码说明"
          onClick={() => setIsTagOpen((current) => !current)}
        />
        <div className="absolute bottom-3 left-3 rounded-full bg-white/88 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur">
          {previewName}的回忆牌
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="选择服装颜色">
        <span className="mr-1 text-xs font-medium text-[var(--muted)]">背心换色</span>
        {outfits.map((option, index) => (
          <button
            key={option.name}
            type="button"
            onClick={() => setOutfitIndex(index)}
            className={`flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs font-semibold transition-all ${index === outfitIndex ? "border-[var(--ink)] text-[var(--ink)]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--sage)]"}`}
            aria-pressed={index === outfitIndex}
          >
            <span className="size-3 rounded-full" style={{ backgroundColor: option.value }} />
            {option.name}
          </button>
        ))}
      </div>

      <div id={descriptionId} className={`tag-explanation ${isTagOpen ? "is-open" : ""}`} aria-hidden={!isTagOpen}>
        <div className="mt-4 grid gap-4 rounded-2xl border border-[var(--line)] bg-white/80 p-4 sm:grid-cols-[5.5rem_1fr] sm:items-center">
          <Image
            src="/demo/paw-memory-demo-qr.png"
            width={120}
            height={120}
            alt="前往固定示例回忆页的二维码"
            className="qr-static mx-auto size-22 rounded-lg bg-white p-1"
          />
          <div>
            <p className="text-sm font-semibold">牌子是回到回忆页的入口</p>
            <p className="mt-1 text-xs leading-5 text-[var(--muted)]">手机扫码后开启照片、影片与暖心话。这里使用固定示例二维码，不会随服装动画移动。</p>
            <Link href="/m/demo" className="mt-2 inline-flex text-xs font-semibold text-[var(--coral-dark)] hover:underline">
              进入固定示例回忆页 →
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[0.7rem] leading-5 text-[var(--muted)]">
        此为服装与回忆牌的视觉概念，不是照片生成 3D、宠物模型或可打印文件，也不代表实际尺寸适配结果。
      </p>
    </div>
  );
}
