import type { Metadata } from "next";
import Link from "next/link";
import { DemoVideo } from "@/app/components/demo-video";

export const metadata: Metadata = {
  title: "一頁珍藏的回憶",
  description: "透過手機掃碼開啟的寵物回憶頁。",
};

const demoMemory = {
  name: "豆包",
  subtitle: "和豆包一起的日常",
  message: "謝謝你，把每一個普通的日子，都變成值得記住的好天氣。",
  story:
    "豆包喜歡午後的陽光、散步時熟悉的小路，也總是在家門打開時送上最熱情的迎接。這一頁，收著我們今天與明天都想反覆看的可愛日常。",
};

type MemoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MemoryPage({ params }: MemoryPageProps) {
  const { id } = await params;
  const isDemo = id === "demo";

  return (
    <section className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-14">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-[var(--line)] bg-white/65 px-4 py-2 text-xs font-semibold tracking-[0.1em] text-[var(--muted)]">
          {isDemo ? "示例回憶・固定展示內容" : `回憶編號・${id}`}
        </span>
        <Link href="/create" className="text-sm font-semibold text-[var(--coral-dark)] hover:underline">
          也為牠建立一頁
        </Link>
      </div>

      {isDemo ? (
        <article className="overflow-hidden rounded-[2rem] border border-white/80 bg-[var(--paper)] shadow-[0_28px_80px_rgba(65,58,47,0.13)]">
          <header className="px-6 pb-6 pt-8 sm:px-10 sm:pt-10">
            <p className="text-xs font-semibold tracking-[0.16em] text-[var(--coral)]">OUR DEAREST FRIEND</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.045em] sm:text-6xl">{demoMemory.name}</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{demoMemory.subtitle}</p>
          </header>

          <div className="px-4 sm:px-8">
            <DemoVideo />
          </div>

          <div className="px-6 pb-9 pt-8 sm:px-10 sm:pb-12">
            <blockquote className="text-xl leading-9 font-medium text-balance">「{demoMemory.message}」</blockquote>
            <p className="mt-5 text-sm leading-7 text-[var(--muted)]">{demoMemory.story}</p>
            <div className="mt-7 rounded-2xl border border-[var(--line)] bg-white/70 p-4 text-sm leading-6 text-[var(--muted)]">
              這是預先準備的示例回憶，不包含 AI 即時生成、使用者上傳或動態資料。
            </div>
          </div>
        </article>
      ) : (
        <div className="grid min-h-[32rem] place-items-center rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] px-6 text-center shadow-[0_20px_50px_rgba(65,58,47,0.08)]">
          <div>
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--sage-light)] text-3xl">🐾</div>
            <h1 className="mt-5 text-3xl font-semibold">這則回憶尚未發布</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">目前只有示例頁可供體驗，資料儲存與正式發布會在後續階段完成。</p>
            <Link href="/m/demo" className="mt-6 inline-flex rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white">
              查看體驗示例
            </Link>
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-xs leading-6 text-[var(--muted)]">爪印留聲・把一起生活的每個日常好好收藏</p>
    </section>
  );
}
