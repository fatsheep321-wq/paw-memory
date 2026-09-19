import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "爪印留声｜把回忆穿在身上",
    template: "%s｜爪印留声",
  },
  description: "把宠物的专属回忆牌固定在服装上，手机扫码重温照片、影片与想留下的话。",
};

function PawMark() {
  return (
    <span className="grid size-9 place-items-center rounded-full bg-[var(--coral)] text-white shadow-[0_6px_16px_rgba(220,105,80,0.25)]">
      <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="7" cy="6" r="2.5" />
        <circle cx="17" cy="6" r="2.5" />
        <circle cx="4.5" cy="11.5" r="2.2" />
        <circle cx="19.5" cy="11.5" r="2.2" />
        <path d="M12 9.5c-3.6 0-6.3 3.4-6.3 6.2 0 2.1 1.6 3.3 3.4 3.3 1.2 0 1.9-.6 2.9-.6s1.7.6 2.9.6c1.8 0 3.4-1.2 3.4-3.3 0-2.8-2.7-6.2-6.3-6.2Z" />
      </svg>
    </span>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>
        <div className="min-h-screen overflow-hidden">
          <header className="relative z-20 border-b border-[var(--line)] bg-[color:var(--cream)/0.88] backdrop-blur-md">
            <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
              <Link href="/" className="flex items-center gap-3 font-semibold tracking-[0.12em] text-[var(--ink)]">
                <PawMark />
                <span>爪印留聲</span>
              </Link>
              <nav className="flex items-center gap-4 text-sm text-[var(--muted)]" aria-label="主要導覽">
                <Link className="hidden transition-colors hover:text-[var(--ink)] md:inline" href="/sources">
                  模型來源
                </Link>
                <Link className="hidden transition-colors hover:text-[var(--ink)] sm:inline" href="/make/demo">
                  製造示例
                </Link>
                <Link className="rounded-full bg-[var(--ink)] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[var(--coral-dark)]" href="/create">
                  發布回憶
                </Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-[var(--line)] bg-white/45">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p>爪印留声 PawStory</p>
              <p>把回忆穿在身上，让每一次扫码都有回去的入口。</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
