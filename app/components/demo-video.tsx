"use client";

import Image from "next/image";
import { useState } from "react";

const videoUrl = "/demo/pet-memory.mp4";
const posterUrl = "/demo/pet-cover.jpg";

export function DemoVideo() {
  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-[#171917] shadow-[0_18px_45px_rgba(47,51,48,0.16)]">
        {hasError ? (
          <div className="relative grid aspect-video place-items-center overflow-hidden px-6 text-center">
            <Image
              src={posterUrl}
              alt="穿著黃色雨衣的豆包站在雨天街道上"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover opacity-35"
              priority
            />
            <div className="relative z-10 max-w-sm rounded-2xl bg-black/70 p-5 text-white">
              <p className="font-semibold">影片目前無法載入</p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                請確認網路連線，或改用下方連結直接開啟影片。
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[var(--ink)]"
              >
                直接開啟影片
              </a>
            </div>
          </div>
        ) : (
          <video
            className="aspect-video w-full bg-black object-contain"
            controls
            playsInline
            preload="metadata"
            poster={posterUrl}
            onError={() => setHasError(true)}
            aria-label="豆包的示例回憶影片"
          >
            <source src={videoUrl} type="video/mp4" />
            你的瀏覽器不支援 HTML video 播放。
          </video>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1 text-xs leading-5 text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>點擊播放後才會播放聲音，不會自動播放。</p>
        <a className="font-semibold text-[var(--coral-dark)] hover:underline" href={videoUrl} target="_blank" rel="noreferrer">
          直接開啟影片
        </a>
      </div>
    </div>
  );
}
