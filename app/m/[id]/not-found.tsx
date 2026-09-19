import Link from "next/link";

export default function MemoryNotFound() {
  return (
    <section className="mx-auto grid min-h-[34rem] max-w-4xl place-items-center px-5 py-12 text-center sm:px-8">
      <div>
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--sage-light)] text-3xl">🐾</div>
        <h1 className="mt-5 text-3xl font-semibold">找不到这则公开回忆</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">链接可能不正确、记录不存在，或创建者尚未完成公开发布。</p>
        <Link href="/m/demo" className="mt-6 inline-flex rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white">
          查看固定示例
        </Link>
      </div>
    </section>
  );
}
