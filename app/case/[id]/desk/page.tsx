import { notFound } from "next/navigation";
import { cases } from "@/lib/cases/hollow-pines";
import { Desk } from "@/components/Desk";

export function generateStaticParams() {
  return Object.keys(cases).map((id) => ({ id }));
}

export default async function DeskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = cases[id];
  if (!c) notFound();
  return <Desk c={c} />;
}
