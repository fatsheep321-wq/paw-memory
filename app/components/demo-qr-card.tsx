"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const demoUrl = "https://paw-memory404.vercel.app/m/demo";
const qrImageUrl = "/demo/paw-memory-demo-qr.png";

type CopyStatus = "idle" | "copied" | "failed";

export function DemoQrCard() {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  async function copyDemoUrl() {
    try {
      await navigator.clipboard.writeText(demoUrl);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  return (
    <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_20px_55px_rgba(65,58,47,0.1)] sm:p-7">
      <div className="mx-auto w-full max-w-72 rounded-2xl bg-white p-3">
        <Image
          src={qrImageUrl}
          alt="前往爪印留聲豆包示例回憶頁的 QR Code"
          width={360}
          height={360}
          className="h-auto w-full"
          sizes="288px"
        />
      </div>
      <p className="mt-4 break-all text-center text-xs leading-5 text-[var(--muted)]">{demoUrl}</p>
      <div className="mt-5 grid gap-2">
        <a
          href={qrImageUrl}
          download="paw-memory-demo-qr.png"
          className="inline-flex items-center justify-center rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--coral-dark)]"
        >
          下載 QR Code PNG
        </a>
        <button
          type="button"
          onClick={copyDemoUrl}
          className="rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] hover:border-[var(--sage)]"
        >
          {copyStatus === "copied" ? "已複製回憶頁連結" : "複製回憶頁連結"}
        </button>
        <Link
          href={demoUrl}
          className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-[var(--coral-dark)] hover:underline"
        >
          目前手機直接體驗
        </Link>
      </div>
      <p className="mt-3 min-h-5 text-center text-xs text-[var(--muted)]" aria-live="polite">
        {copyStatus === "failed" ? "無法自動複製，請長按上方網址複製。" : ""}
      </p>
    </div>
  );
}
