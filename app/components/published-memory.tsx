"use client";

import { useState } from "react";

type PublishedMemoryProps = {
  petName: string;
  warmMessage: string;
  photoUrl: string;
  videoUrl: string;
};

export function PublishedMemory({
  petName,
  warmMessage,
  photoUrl,
  videoUrl,
}: PublishedMemoryProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/80 bg-[var(--paper)] shadow-[0_28px_80px_rgba(65,58,47,0.13)]">
      <header className="px-6 pb-6 pt-8 sm:px-10 sm:pt-10">
        <p className="text-xs font-semibold tracking-[0.16em] text-[var(--coral)]">SHARED MEMORY</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-[-0.045em] sm:text-6xl">{petName}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">这是一则已发布的公开回忆；任何持有链接者都可访问。</p>
      </header>

      <div className="grid gap-5 px-4 sm:px-8">
        <div className="overflow-hidden rounded-2xl bg-[#e6e1d7]">
          {photoFailed ? (
            <div className="grid aspect-video place-items-center px-6 text-center text-sm text-[var(--muted)]" role="alert">
              照片目前无法载入，请重新整理后再试。
            </div>
          ) : (
            <img
              src={photoUrl}
              alt={`${petName}的回忆照片`}
              className="aspect-video w-full object-cover"
              onError={() => setPhotoFailed(true)}
            />
          )}
        </div>

        <div className="overflow-hidden rounded-2xl bg-black">
          {videoFailed ? (
            <div className="grid aspect-video place-items-center px-6 text-center text-white" role="alert">
              <div>
                <p className="font-semibold">影片目前无法载入</p>
                <p className="mt-2 text-sm text-white/70">签名链接可能已过期，请重新整理页面取得新链接。</p>
              </div>
            </div>
          ) : (
            <video
              src={videoUrl}
              controls
              playsInline
              preload="metadata"
              poster={photoUrl}
              className="aspect-video w-full object-contain"
              onError={() => setVideoFailed(true)}
              aria-label={`${petName}的回忆影片`}
            >
              你的浏览器不支援 HTML video 播放。
            </video>
          )}
        </div>
        <p className="text-xs leading-5 text-[var(--muted)]">影片不会自动播放；点击播放后才会发出声音。不同手机对影片编码的支援可能不同。</p>
      </div>

      <div className="px-6 pb-9 pt-8 sm:px-10 sm:pb-12">
        <blockquote className="text-xl leading-9 font-medium text-balance">「{warmMessage}」</blockquote>
      </div>
    </article>
  );
}
