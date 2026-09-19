import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
export default async function MakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "demo") redirect("/studio");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();
  redirect(`/studio?memory=${id}`);
}
