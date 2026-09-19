import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "一頁珍藏的回憶",
  description: "透過手機掃碼開啟的寵物回憶頁。",
};

type MemoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MemoryPage({ params }: MemoryPageProps) {
  const { id } = await params;
  const isDemo = id === "demo";

  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full border border-[var(--line)] bg-white/65 px-4 py-2 text-xs font-semibold tracking-[0.1em] text-[var(--muted)]">
          {isDemo ? "體驗示例・非真實發布內容" : `回憶編號・${id}`}
        </span>
        <Link href="/create" className="text-sm font-semibold text-[var(--coral-dark)] hover:underline">也為牠建立一頁</Link>
      </div>

      {isDemo ? (
        <article className="overflow-hidden rounded-[2rem] border border-white/80 bg-[var(--paper)] shadow-[0_28px_80px_rgba(65,58,47,0.13)]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div className="memory-grid relative grid min-h-[28rem] place-items-center overflow-hidden bg-[#dfe8dc] p-8 sm:min-h-[36rem]">
              <div className="absolute left-7 top-7 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#52634f] backdrop-blur">立體模型展示區</div>
              <div className="absolute -right-16 top-10 size-52 rounded-full border border-white/40" />
              <div className="absolute -left-20 bottom-8 size-64 rounded-full border border-white/45" />
              <div className="relative grid size-64 place-items-center rounded-full bg-[#f6efe3] shadow-[inset_0_0_0_12px_rgba(255,255,255,0.35),0_22px_45px_rgba(74,91,70,0.12)] sm:size-72">
                <span className="text-9xl" role="img" aria-label="狗狗示意圖">🐕</span>
              </div>
              <p className="absolute bottom-6 text-xs text-[#667263]">Demo 以示意圖代替 3D 模型</p>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="text-sm font-semibold tracking-[0.16em] text-[var(--coral)]">OUR DEAREST FRIEND</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.045em] sm:text-6xl">豆包</h1>
              <p className="mt-3 text-sm text-[var(--muted)]">和豆包一起的日常</p>
              <div className="my-8 h-px bg-[var(--line)]" />
              <blockquote className="text-xl leading-9 font-medium text-balance">「謝謝你，把每一個普通的日子，都變成值得記住的好天氣。」</blockquote>
              <p className="mt-5 text-sm leading-7 text-[var(--muted)]">豆包喜歡午後的陽光、散步時熟悉的小路，也總是在家門打開時送上最熱情的迎接。這一頁，收著我們今天與明天都想反覆看的可愛日常。</p>

              <div className="mt-8 rounded-2xl border border-[var(--line)] bg-white/70 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-[var(--coral)]/12 text-[var(--coral)]">
                    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
                      <path d="m9 7 8 5-8 5V7Z" fill="currentColor" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold">回憶影片</p>
                    <p className="mt-0.5 text-xs text-[var(--muted)]">影片播放將於後續階段串接</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      ) : (
        <div className="grid min-h-[32rem] place-items-center rounded-[2rem] border border-[var(--line)] bg-[var(--paper)] px-6 text-center shadow-[0_20px_50px_rgba(65,58,47,0.08)]">
          <div>
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--sage-light)] text-3xl">🐾</div>
            <h1 className="mt-5 text-3xl font-semibold">這則回憶尚未發布</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">目前只有示例頁可供體驗，資料儲存與正式發布會在後續階段完成。</p>
            <Link href="/m/demo" className="mt-6 inline-flex rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white">查看體驗示例</Link>
          </div>
        </div>
      )}

      <p className="mt-8 text-center text-xs leading-6 text-[var(--muted)]">爪印留聲・把一起生活的每個日常好好收藏</p>
    </section>
  );
}
