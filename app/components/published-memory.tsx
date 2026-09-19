"use client";
import { useEffect, useState } from "react";
import { Awakening } from "./awakening";
import { accessories, type Accessory } from "./pet-avatar";
export function PublishedMemory({ petName, warmMessage, photoUrl, videoUrl }: { petName: string; warmMessage: string; photoUrl: string; videoUrl: string }) {
  const [accessory, setAccessory] = useState<Accessory>("rain");
  useEffect(() => { const chosen = new URLSearchParams(window.location.search).get("accessory"); if (chosen === "rain" || chosen === "birthday" || chosen === "snack") setAccessory(chosen); }, []);
  return <article className="published-story"><span className="eyebrow">PAWSTORY · 一段被珍藏的陪伴</span><h1>{petName}，你回来啦。</h1><p>{accessories[accessory].name} · 点击唤醒作品背后的故事</p><Awakening photoUrl={photoUrl} videoUrl={videoUrl} petName={petName} warmMessage={warmMessage} accessory={accessory} /></article>;
}
