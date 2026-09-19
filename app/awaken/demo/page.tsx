import Link from "next/link";
import { Awakening } from "@/app/components/awakening";
export const metadata = { title: "唤醒雨天的回忆" };
export default function AwakenPage() { return <section className="ps-awaken-page"><span className="eyebrow">RAINCOAT / MEMORY NO. 01</span><h1>豆包，<br />我们再去散一次步吧。</h1><p>雨衣配件 · 固定示例故事</p><Awakening photoUrl="/demo/pet-cover.jpg" videoUrl="/demo/pet-memory.mp4" petName="豆包" warmMessage="雨再大，有你在就是好天气。" sculpture /><Link className="ps-button secondary" href="/studio">为自己的小伙伴创造故事 ↗</Link></section>; }
