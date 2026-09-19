import type { Metadata } from "next";
import { notFound } from "next/navigation";
import demoVerification from "@/public/fabrication/demo-verification.json";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { PRODUCTION_SITE_URL } from "@/lib/supabase/config";
import { MakeWorkbench } from "./make-workbench";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "制造回忆牌",
  description: "预览并验证 3D 打印底座、激光雕刻面板与真实数字回忆二维码。",
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type MakePageProps = { params: Promise<{ id: string }> };

export default async function MakePage({ params }: MakePageProps) {
  const { id } = await params;
  const demo = id === "demo";
  let petName = "豆包";

  if (!demo) {
    if (!UUID_PATTERN.test(id)) notFound();
    const client = await getServerSupabaseClient();
    if (!client) notFound();
    const { data, error } = await client
      .from("memories")
      .select("pet_name")
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle();
    if (error || !data?.pet_name) notFound();
    petName = data.pet_name;
  }

  const shareUrl = `${PRODUCTION_SITE_URL}/m/${id}`;

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-9 border-b border-[var(--line)] pb-8">
        <p className="text-sm font-semibold tracking-[0.16em] text-[var(--coral-dark)]">PRINT · ENGRAVE · REMEMBER</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">把制造部件与{demo ? "演示" : petName}的数字回忆连在一起</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted)]">调整底座尺寸，检查 3D 打印与激光雕刻结构，再以真实 QR 进入固定回忆网址。</p>
        {demo && <p className="mt-4 inline-flex rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold text-orange-900">演示模式：文件仅用于验证流程，不是用户专属制造文件</p>}
      </div>
      <MakeWorkbench memoryId={id} petName={petName} shareUrl={shareUrl} demo={demo} demoVerification={demoVerification} />
    </section>
  );
}
