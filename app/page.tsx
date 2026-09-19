import Link from "next/link";
import { DemoQrCard } from "@/app/components/demo-qr-card";
import { FabricationPreview } from "@/app/components/fabrication-preview";
import { Reveal } from "@/app/components/reveal";
import { DEFAULT_TAG_PARAMETERS } from "@/lib/fabrication/types";
import { PRODUCTION_SITE_URL } from "@/lib/supabase/config";

const journey = [
  { number: "01", title: "3D 打印", text: "项目自建柔性链接参照网格、闭合底座与双孔固定结构，先看清组合关系。", icon: "PRINT" },
  { number: "02", title: "激光雕刻", text: "独立面板输出名字轮廓、切割层与带静区的专属 QR。", icon: "ENGRAVE" },
  { number: "03", title: "安全固定", text: "完成实物打样、公差与穿戴安全检查后，再固定到合适服装。", icon: "ASSEMBLE" },
  { number: "04", title: "数字回忆", text: "手机扫码进入真实回忆页，重看照片、影片与想留下的话。", icon: "REMEMBER" },
];

function ArrowIcon() {
  return <svg aria-hidden="true" className="size-4" viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11.5 5.5 16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute -left-24 top-20 size-80 rounded-full bg-[var(--sage-light)]/70 blur-3xl" />
        <div className="absolute -right-24 top-4 size-96 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-14">
          <div className="relative z-10">
            <p className="hero-enter hero-enter-1 mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/72 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[var(--coral-dark)] backdrop-blur"><span className="size-1.5 rounded-full bg-[var(--coral)]" />PAWSTORY · DIGITAL FABRICATION</p>
            <h1 className="hero-enter hero-enter-2 max-w-2xl text-5xl leading-[1.04] font-semibold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">打印结构，<br /><span className="text-[var(--coral)]">雕刻回忆。</span></h1>
            <p className="hero-enter hero-enter-3 mt-7 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">用共享参数建立真实 Three.js 制造组合：3D 打印底座与固定结构、激光雕刻名字和专属 QR，再扫码回到照片、影片与话语。</p>
            <div className="hero-enter hero-enter-4 mt-7 grid max-w-xl grid-cols-2 gap-2 text-xs font-semibold sm:grid-cols-4">
              {["柔性参照", "打印底座", "雕刻面板", "真实回忆"].map((label, index) => <div key={label} className="rounded-2xl border border-[var(--line)] bg-white/70 px-3 py-3 text-center backdrop-blur"><span className="mr-1 text-[var(--coral)]">{index + 1}</span>{label}</div>)}
            </div>
            <div className="hero-enter hero-enter-5 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/make/demo" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--coral)] px-6 py-3.5 font-semibold text-white shadow-[0_12px_28px_rgba(220,105,80,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[var(--coral-dark)]">打开制造工作台 <ArrowIcon /></Link>
              <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/78 px-6 py-3.5 font-semibold transition-all hover:-translate-y-0.5 hover:border-[var(--sage)]">发布真实回忆</Link>
            </div>
          </div>
          <div className="hero-enter hero-enter-3 relative z-10 mx-auto w-full max-w-3xl lg:mx-0 lg:ml-auto">
            <FabricationPreview parameters={{ ...DEFAULT_TAG_PARAMETERS }} shareUrl={`${PRODUCTION_SITE_URL}/m/demo`} compact />
            <p className="mt-3 text-center text-xs leading-5 text-[var(--muted)]">真实 BufferGeometry／Mesh 预览；可旋转、缩放、分解与切换工艺。柔性网格和透明身体只作项目自建比例参照。</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white/42">
        <div className="mx-auto max-w-6xl px-5 py-18 sm:px-8 sm:py-22">
          <Reveal><div className="max-w-3xl"><p className="text-sm font-semibold tracking-[0.18em] text-[var(--coral-dark)]">FROM PARTS TO MEMORY</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">两种工艺，一条可验证的扫码路径</h2><p className="mt-5 max-w-2xl leading-8 text-[var(--muted)]">制造文件与预览共用同一参数几何；数字页面继续使用真实发布网址，而不是脱离数据的装饰二维码。</p></div></Reveal>
          <div className="mt-11 grid gap-px overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {journey.map((step, index) => <Reveal key={step.number} delay={index * 80}><article className="group min-h-64 bg-[var(--paper)] p-6 transition-colors hover:bg-white sm:p-7"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-[var(--coral)]">{step.number}</span><span className="rounded-full bg-[var(--sage-light)] px-3 py-1 text-[0.65rem] font-semibold text-[#52634f]">{step.icon}</span></div><h3 className="mt-16 text-xl font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.text}</p></article></Reveal>)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-18 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <Reveal><div><p className="text-sm font-semibold tracking-[0.18em] text-[var(--coral-dark)]">LICENSED ADAPTATION</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">清楚标示来源，不把改编说成原创</h2><p className="mt-5 max-w-xl leading-8 text-[var(--muted)]">牌体参考 scadqr 的圆角底板、固定孔与 QR padding 结构思路，作者 Darwin Schuppan and contributors，MIT，固定 commit。预览旁、来源页与 ZIP 都保留归属和修改说明。</p><Link href="/sources" className="mt-6 inline-flex rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold">查看模型来源与许可评估</Link></div></Reveal>
          <Reveal delay={100}><div className="rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] p-7"><p className="text-xs font-semibold tracking-[0.14em] text-[var(--coral-dark)]">诚实边界</p><ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--muted)]"><li>• 没有照片转 3D 或服装 STL 尺寸适配。</li><li>• 面料仅为项目自建参数化参照，不提供下载。</li><li>• 公差、材料、耐用与宠物穿戴待实物验证。</li><li>• 不生成激光功率、速度或 G-code。</li></ul></div></Reveal>
        </div>
      </section>

      <section id="demo-qr" className="border-t border-[var(--line)] bg-white/35">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-18 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <Reveal><div><p className="text-sm font-semibold tracking-[0.18em] text-[var(--coral-dark)]">SCAN TO REMEMBER</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">从实体结构回到数字回忆</h2><p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">这个固定二维码仍指向既有 production demo 回忆页。制造页为演示文件，不会冒充用户专属；真实发布后则以真实记录 ID 建立制造入口与动态 QR。</p></div></Reveal>
          <Reveal delay={100}><DemoQrCard /></Reveal>
        </div>
      </section>

      <section className="bg-[var(--ink)] text-white"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-18 sm:px-8 sm:py-22 lg:grid-cols-[1fr_auto] lg:items-center"><Reveal><p className="text-sm font-semibold tracking-[0.18em] text-[#c7d5c4]">PAWSTORY</p><h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">先发布真实回忆，再为它制作扫码入口。</h2><p className="mt-5 max-w-2xl leading-7 text-white/65">现有 Supabase、TUS、publish_memory、真实 shareUrl 与动态二维码流程保持不变。</p></Reveal><Reveal delay={100}><Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-[var(--coral)] px-6 py-3.5 font-semibold text-white hover:bg-[#ed795f]">建立真实回忆 <ArrowIcon /></Link></Reveal></div></section>
    </>
  );
}
