import type { Metadata } from "next";
import Link from "next/link";
import { CreateMemoryForm } from "./create-memory-form";
import { getSiteUrl, getSupabasePublicConfig } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "建立回憶",
  description: "上传宠物照片与影片，发布可跨设备访问的公开回忆页。",
};

export default function CreatePage() {
  const siteUrl = getSiteUrl();
  const hasEnvironmentConfig = Boolean(getSupabasePublicConfig() && siteUrl);

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-9 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em] text-[var(--coral-dark)]">CREATE A WEARABLE MEMORY</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">建立牠的穿戴回忆</h1>
          <p className="mt-4 max-w-2xl leading-7 text-[var(--muted)]">填写名字与暖心话，将照片和影片直接上传到私有云端空间；发布后取得真实回忆网址与动态二维码，再依说明固定到合适的宠物服装上。</p>
        </div>
        <span className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${hasEnvironmentConfig ? "bg-[var(--sage-light)] text-[#52634f]" : "bg-orange-100 text-orange-800"}`}>
          {hasEnvironmentConfig ? "故事上传已就绪" : "云端服务尚未配置"}
        </span>
      </div>

      {!hasEnvironmentConfig ? (
        <div className="mt-9 rounded-[2rem] border border-orange-200 bg-orange-50 p-7 sm:p-10" role="alert">
          <p className="text-sm font-semibold tracking-[0.14em] text-orange-800">PUBLISHING UNAVAILABLE</p>
          <h2 className="mt-3 text-2xl font-semibold">目前无法发布真实回忆</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-orange-950/75">
            请先执行 <code>supabase/setup.sql</code>、开启 Anonymous Sign-Ins，并配置
            <code className="mx-1">NEXT_PUBLIC_SUPABASE_URL</code>、
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> 与
            <code className="ml-1">NEXT_PUBLIC_SITE_URL</code>。本页不会伪造上传或发布成功。
          </p>
          <Link href="/m/demo" className="mt-6 inline-flex rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-white">
            先查看固定示例
          </Link>
        </div>
      ) : (
        <div className="mt-9">
          <CreateMemoryForm siteUrl={siteUrl!} />
        </div>
      )}
    </section>
  );
}
