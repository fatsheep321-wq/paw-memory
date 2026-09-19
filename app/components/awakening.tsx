"use client";
import { useEffect, useRef, useState } from "react";
import { PetAvatar, type Accessory, type Animal } from "./pet-avatar";

const stages = ["静态分身", "恢复颜色", "照片显现", "回忆开始"];
export function Awakening({ photoUrl, videoUrl, petName, warmMessage, accessory = "rain", sculpture = false, animal = "dog" }: { photoUrl: string; videoUrl: string; petName: string; warmMessage: string; accessory?: Accessory; sculpture?: boolean; animal?: Animal }) {
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (phase !== 1 && phase !== 2) return;
    const timer = window.setTimeout(() => setPhase(phase + 1), phase === 1 ? 2400 : 2400);
    return () => window.clearTimeout(timer);
  }, [phase]);
  useEffect(() => {
    if (phase !== 3) return;
    const player = video.current;
    if (player) player.play().catch(() => setError("点击视频播放按钮，继续这段回忆。"));
  }, [phase]);
  function start() {
    setError("");
    setPhase(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 3 : 1);
  }
  function reset() { video.current?.pause(); if(video.current) video.current.currentTime=0; setPhase(0); setError(""); }
  return <div className="awakening awakening-cinema">
    <div className={`cinema-stage cinema-phase-${phase}`}>
      <video ref={video} src={videoUrl} poster={photoUrl} controls={phase === 3} playsInline preload="metadata" aria-label={`${petName}的故事视频`} onError={() => setError("视频暂时无法加载，请刷新后重试。")} />
      <div className="cinema-photo"><img src={photoUrl} alt={`${petName}的真实照片`} /><span>原来，你一直在这里。</span></div>
      <div className="cinema-model">{sculpture ? <PetAvatar accessory={accessory} animal={animal} /> : <img src={photoUrl} alt={`${petName}的静态影像`} />}<div className="cinema-sweep" /><div className="cinema-glow" /></div>
      {phase < 3 && <div className="cinema-heading"><span>PAWSTORY · A LITTLE REUNION</span><strong>{phase === 0 ? `${petName}，好久不见。` : phase === 1 ? "让熟悉的颜色，慢慢回来。" : "从眼前的模样，走回那一天。"}</strong></div>}
      {phase === 0 && <button type="button" className="awaken-trigger" onClick={start}>✦ 唤醒这段回忆</button>}
      {(phase === 1 || phase === 2) && <button type="button" className="cinema-skip" onClick={() => setPhase(3)}>直接播放 →</button>}
    </div>
    <ol className="cinema-timeline" aria-label="回忆唤醒进度">{stages.map((name,i)=><li key={name} className={phase >= i ? "is-active" : ""} aria-current={phase===i ? "step" : undefined}><span>{String(i+1).padStart(2,"0")}</span>{name}</li>)}</ol>
    <div className="awakening-message"><blockquote>“{warmMessage}”</blockquote>{phase > 0 && <button type="button" onClick={reset}>再见一次 ↺</button>}</div>
    <p className="small-note" aria-live="polite">{error || "模型、照片与视频分层衔接；视频仅在回忆阶段开始播放。"}</p>
  </div>;
}
