"use client";
import { useRef, useState } from "react";
import { PetAvatar, type Accessory } from "./pet-avatar";

export function Awakening({ photoUrl, videoUrl, petName, warmMessage, accessory = "rain", sculpture = false }: { photoUrl: string; videoUrl: string; petName: string; warmMessage: string; accessory?: Accessory; sculpture?: boolean }) {
  const [phase, setPhase] = useState<"still" | "color" | "video">("still");
  const [error, setError] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  async function awaken() {
    setError(""); setPhase("color");
    try { await video.current?.play(); } catch { setError("请点击视频中的播放按钮，继续这段回忆。"); }
  }
  return <div className="awakening">
    <div className={`awakening-stage phase-${phase}`}>
      <video ref={video} src={videoUrl} poster={photoUrl} controls={phase === "video"} playsInline preload="metadata" aria-label={`${petName}的故事视频`} onError={() => { setError("视频暂时无法加载，请刷新后重试。"); setPhase("video"); }} />
      <div className="awakening-cover" onAnimationEnd={() => { if (phase === "color") setPhase("video"); }}>
        {sculpture ? <PetAvatar accessory={accessory} /> : <img src={photoUrl} alt={`${petName}的静态作品照片`} />}
        <div className="awakening-caption"><span>一件作品 · 一段陪伴</span><strong>{phase === "color" ? "回忆正在恢复颜色…" : `${petName}，好久不见。`}</strong></div>
      </div>
      {phase === "still" && <button type="button" className="awaken-trigger" onClick={awaken}>✦ 唤醒这段回忆</button>}
    </div>
    <div className="awakening-message"><blockquote>“{warmMessage}”</blockquote>{phase !== "still" && <button type="button" onClick={() => { video.current?.pause(); if (video.current) video.current.currentTime = 0; setPhase("still"); setError(""); }}>重新唤醒 ↺</button>}</div>
    <p className="small-note" aria-live="polite">{error || "点击后播放声音；静态作品将逐渐过渡到真实视频。"}</p>
  </div>;
}
