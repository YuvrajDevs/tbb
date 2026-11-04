import { notFound } from "next/navigation";
import { cases } from "@/lib/cases/hollow-pines";
import { Kit } from "@/components/Kit";

export function generateStaticParams() {
  return Object.keys(cases).map((id) => ({ id }));
}

export default async function KitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = cases[id];
  if (!c) notFound();
  return <Kit c={c} />;
}
