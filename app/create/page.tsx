import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "建立回憶",
  description: "建立寵物專屬回憶頁的流程預覽。",
};

const flow = [
  { number: "1", label: "寵物照片", description: "選擇一張清楚、最像牠的照片", active: true },
  { number: "2", label: "立體模樣", description: "展示或匯入寵物模型" },
  { number: "3", label: "影片與暖心話", description: "留下想一起珍藏的片段" },
  { number: "4", label: "發布與回憶牌", description: "取得固定頁面與 QR Code" },
];

export default function CreatePage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[var(--coral-dark)]">CREATE A MEMORY</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">建立牠的回憶</h1>
          <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">慢慢來，把你最想留下的模樣與話語放進這裡。</p>
        </div>
        <span className="w-fit rounded-full bg-[var(--sage-light)] px-4 py-2 text-xs font-semibold text-[#52634f]">本階段為介面預覽</span>
      </div>

      <div className="mt-9 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
        <aside aria-label="建立流程">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {flow.map((step) => (
              <li key={step.number} className={`flex gap-4 rounded-2xl border p-4 ${step.active ? "border-[var(--coral)] bg-white/75" : "border-transparent"}`}>
                <span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-semibold ${step.active ? "bg-[var(--coral)] text-white" : "bg-white/70 text-[var(--muted)]"}`}>{step.number}</span>
                <div>
                  <p className={`font-semibold ${step.active ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>{step.label}</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        <div className="rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-[0_20px_50px_rgba(65,58,47,0.08)] sm:p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[var(--coral)]">STEP 01</p>
            <h2 className="mt-2 text-2xl font-semibold">先選一張牠的照片</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">建議使用光線充足、臉部清楚且沒有遮擋的照片。</p>
          </div>

          <div className="mt-7 grid min-h-80 place-items-center rounded-3xl border border-dashed border-[var(--sage)] bg-[#f4f6f0] px-6 py-12 text-center">
            <div>
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-white text-[var(--sage)] shadow-sm">
                <svg aria-hidden="true" className="size-7" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mt-5 font-semibold">照片上傳將在下一階段開放</p>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[var(--muted)]">目前先確認頁面流程、閱讀順序與手機版配置。</p>
              <button disabled className="mt-5 cursor-not-allowed rounded-full bg-[var(--ink)]/35 px-5 py-3 text-sm font-semibold text-white" type="button">選擇照片</button>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="px-3 py-2 text-center text-sm font-medium text-[var(--muted)] hover:text-[var(--ink)]">返回首頁</Link>
            <button disabled className="cursor-not-allowed rounded-full bg-[var(--coral)]/45 px-6 py-3 text-sm font-semibold text-white" type="button">下一步：建立立體模樣</button>
          </div>
        </div>
      </div>
    </section>
  );
}
