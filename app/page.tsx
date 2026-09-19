import Link from "next/link";
import { DemoQrCard } from "@/app/components/demo-qr-card";

const steps = [
  { number: "01", title: "留下一張照片", text: "從最熟悉的眼神開始，建立牠的專屬回憶。" },
  { number: "02", title: "收藏模樣與聲音", text: "放入模型、影片，以及一直想對牠說的話。" },
  { number: "03", title: "發布回憶頁", text: "生成一個固定網址，讓重要的片段安穩留存。" },
  { number: "04", title: "掃碼再次相遇", text: "下載回憶牌 QR Code，手機一掃就能播放。" },
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12M11.5 5.5 16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <section className="relative mx-auto grid max-w-6xl gap-14 px-5 pb-20 pt-18 sm:px-8 sm:pt-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pb-28">
        <div className="relative z-10">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/70 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[var(--coral-dark)]">
            <span className="size-1.5 rounded-full bg-[var(--coral)]" />
            給每一段珍貴陪伴
          </p>
          <h1 className="max-w-2xl text-5xl leading-[1.12] font-semibold tracking-[-0.045em] text-balance sm:text-6xl lg:text-7xl">
            把牠的故事，<br />留在<span className="text-[var(--coral)]">想念抵達</span>的地方。
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
            將照片、立體模樣、影片和暖心話收進一頁回憶。做成專屬 QR Code，讓每一次掃描，都像回到牠身邊。
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--coral)] px-6 py-3.5 font-semibold text-white shadow-[0_12px_28px_rgba(220,105,80,0.22)] transition-colors hover:bg-[var(--coral-dark)]">
              開始製作 <ArrowIcon />
            </Link>
            <Link href="/m/demo" className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/75 px-6 py-3.5 font-semibold text-[var(--ink)] transition-colors hover:border-[var(--sage)]">
              體驗示例
            </Link>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">目前為介面 Demo，尚未啟用上傳與發布。</p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:ml-auto">
          <div className="absolute -left-8 top-16 size-28 rounded-full bg-[var(--sage-light)] blur-2xl" />
          <div className="absolute -right-10 bottom-16 size-32 rounded-full bg-orange-200/55 blur-2xl" />
          <div className="relative rotate-[2deg] rounded-[2rem] border border-white/80 bg-[var(--paper)] p-4 shadow-[0_28px_70px_rgba(65,58,47,0.15)]">
            <div className="memory-grid relative grid aspect-[4/4.6] place-items-center overflow-hidden rounded-[1.45rem] bg-[#dfe8dc]">
              <div className="absolute left-5 top-5 rounded-full bg-white/75 px-3 py-1.5 text-xs font-medium text-[var(--muted)] backdrop-blur">豆包的回憶</div>
              <div className="relative grid size-48 place-items-center rounded-full bg-[#f4ede0] shadow-inner">
                <span className="text-8xl" role="img" aria-label="狗狗示意圖">🐕</span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/82 p-4 backdrop-blur">
                <p className="text-sm font-semibold">「謝謝你，把每一天都變成好天氣。」</p>
                <p className="mt-1.5 text-xs text-[var(--muted)]">一段被好好收藏的陪伴</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-3 -rotate-3 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
            <p className="text-xs text-[var(--muted)]">掃描回憶牌</p>
            <p className="mt-0.5 text-sm font-semibold">隨時回來看看牠</p>
          </div>
        </div>
      </section>

      <section id="demo-qr" className="border-y border-[var(--line)] bg-white/45">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-18 sm:px-8 sm:py-22 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-[var(--coral-dark)]">SCAN TO REMEMBER</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">手機掃碼體驗</h2>
            <p className="mt-5 text-base leading-8 text-[var(--muted)]">
              用手機相機掃描右側 QR Code，直接開啟豆包的固定示例回憶。也可以下載 PNG 製作回憶牌，或在目前手機直接開啟。
            </p>
            <div className="mt-7 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 text-sm leading-7 text-[var(--muted)]">
              QR Code 固定指向正式網域，不使用 localhost、暫存網址或登入後才能瀏覽的連結。
            </div>
          </div>
          <DemoQrCard />
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-18 sm:px-8 sm:py-22">
          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-[var(--coral-dark)]">HOW IT WORKS</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">四個步驟，留住一生的陪伴</h2>
          </div>
          <div className="mt-11 grid gap-px overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <article key={step.number} className="min-h-56 bg-[var(--paper)] p-6 sm:p-7">
                <p className="text-sm font-semibold text-[var(--coral)]">{step.number}</p>
                <h3 className="mt-12 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-white/45">
        <div className="mx-auto max-w-6xl px-5 py-18 text-center sm:px-8 sm:py-24">
          <p className="text-sm font-semibold tracking-[0.18em] text-[var(--sage)]">PAWSTORY</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">有些愛不會離開，只是換一種方式陪伴。</h2>
          <Link href="/create" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-3.5 font-semibold text-white transition-colors hover:bg-[var(--coral-dark)]">
            建立牠的回憶 <ArrowIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
