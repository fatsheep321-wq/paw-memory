import Link from "next/link";
import { DemoQrCard } from "@/app/components/demo-qr-card";
import { Reveal } from "@/app/components/reveal";
import { WearablePreview } from "@/app/components/wearable-preview";

const journey = [
  { number: "01", title: "宠物穿戴", text: "把轻巧回忆牌稳妥固定在合适的宠物背心或服装上。", icon: "背心" },
  { number: "02", title: "专属回忆牌", text: "每一块牌子，对应一只宠物和一条长期使用的回忆链接。", icon: "铭牌" },
  { number: "03", title: "手机扫码", text: "不需要安装 App；用手机相机扫描，就能打开公开回忆页。", icon: "扫码" },
  { number: "04", title: "照片与视频", text: "在同一页重看牠的照片、影片，以及想一直留下的话。", icon: "回忆" },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M11.5 5.5 16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 8h3v3H8zM14 8h2v2h-2zM8 14h2v2H8zM13 13h3v3h-3z" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute -left-24 top-20 size-80 rounded-full bg-[var(--sage-light)]/70 blur-3xl" />
        <div className="absolute -right-24 top-4 size-96 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pb-26 sm:pt-22 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-16">
          <div className="relative z-10">
            <p className="hero-enter hero-enter-1 mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/72 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-[var(--coral-dark)] backdrop-blur">
              <span className="size-1.5 rounded-full bg-[var(--coral)]" />
              PAWSTORY · 穿戴式回忆入口
            </p>
            <h1 className="hero-enter hero-enter-2 max-w-2xl text-5xl leading-[1.08] font-semibold tracking-[-0.055em] text-balance sm:text-6xl lg:text-7xl">
              把回忆，<br /><span className="text-[var(--coral)]">穿在身上。</span>
            </h1>
            <p className="hero-enter hero-enter-3 mt-7 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              为宠物服装固定一块专属回忆牌。手机轻轻一扫，就能从牠此刻的模样，走进那些值得反复重看的照片、影片与话语。
            </p>

            <div className="hero-enter hero-enter-4 mt-7 grid max-w-xl grid-cols-2 gap-2 text-xs font-semibold text-[var(--ink)] sm:grid-cols-4">
              {["宠物穿戴", "专属回忆牌", "手机扫码", "照片与视频"].map((label, index) => (
                <div key={label} className="rounded-2xl border border-[var(--line)] bg-white/65 px-3 py-3 text-center backdrop-blur">
                  <span className="mr-1 text-[var(--coral)]">{index + 1}</span>{label}
                </div>
              ))}
            </div>

            <div className="hero-enter hero-enter-5 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--coral)] px-6 py-3.5 font-semibold text-white shadow-[0_12px_28px_rgba(220,105,80,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[var(--coral-dark)] hover:shadow-[0_16px_32px_rgba(220,105,80,0.28)]">
                建立专属回忆 <ArrowIcon />
              </Link>
              <Link href="/m/demo" className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/78 px-6 py-3.5 font-semibold text-[var(--ink)] transition-all hover:-translate-y-0.5 hover:border-[var(--sage)]">
                查看固定示例
              </Link>
            </div>
          </div>

          <div className="hero-enter hero-enter-3 relative z-10 mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="absolute -left-5 top-16 hidden rounded-2xl border border-white bg-white/85 px-4 py-3 text-xs shadow-lg backdrop-blur sm:block">
              <p className="font-semibold">轻巧固定在背部</p>
              <p className="mt-1 text-[var(--muted)]">让相机容易对准</p>
            </div>
            <WearablePreview name="豆包" />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white/42">
        <div className="mx-auto max-w-6xl px-5 py-18 sm:px-8 sm:py-22">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.18em] text-[var(--coral-dark)]">FROM OUTFIT TO MEMORY</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">一块小小的牌，让陪伴多一个入口</h2>
              <p className="mt-5 max-w-xl leading-8 text-[var(--muted)]">穿戴只是起点。回忆牌把眼前的牠，与云端保存的照片和影片连在一起。</p>
            </div>
          </Reveal>

          <div className="mt-11 grid gap-px overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {journey.map((step, index) => (
              <Reveal key={step.number} delay={index * 80}>
                <article className="group min-h-64 bg-[var(--paper)] p-6 transition-colors hover:bg-white sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--coral)]">{step.number}</span>
                    <span className="rounded-full bg-[var(--sage-light)] px-3 py-1 text-xs font-semibold text-[#52634f] transition-transform group-hover:-rotate-3 group-hover:scale-105">{step.icon}</span>
                  </div>
                  <h3 className="mt-16 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="demo-qr" className="relative overflow-hidden">
        <div className="absolute right-0 top-24 size-80 rounded-full bg-[var(--sage-light)]/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-18 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <Reveal>
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-[var(--coral-dark)]"><ScanIcon /> SCAN TO REMEMBER</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">先用手机，走一遍真实扫码路径</h2>
              <p className="mt-5 text-base leading-8 text-[var(--muted)]">
                扫描右侧真实 demo QR Code，直接开启豆包的固定示例回忆页，看看回忆牌如何把服装上的一个入口，连接到照片与影片。
              </p>
              <div className="mt-7 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 text-sm leading-7 text-[var(--muted)]">
                此示例二维码固定指向正式网域，不使用 localhost、暂存网址或登录后才能浏览的链接。二维码保持静止，方便相机识别。
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}><DemoQrCard /></Reveal>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[var(--ink)] text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-18 sm:px-8 sm:py-22 lg:grid-cols-[1fr_auto] lg:items-center">
          <Reveal>
            <p className="text-sm font-semibold tracking-[0.18em] text-[#c7d5c4]">PAWSTORY</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.035em] text-balance sm:text-5xl">今天穿在身上的，是以后还能回去的地方。</h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/65">上传真实照片与影片，发布固定回忆网址，并取得对应的动态二维码。</p>
          </Reveal>
          <Reveal delay={100}>
            <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-[var(--coral)] px-6 py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#ed795f]">
              开始建立回忆 <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
