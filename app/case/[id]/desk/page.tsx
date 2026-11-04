import { notFound } from "next/navigation";
import { cases } from "@/lib/cases/hollow-pines";
import { SoloDesk } from "@/components/SoloDesk";

export function generateStaticParams() {
  return Object.keys(cases).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const c = cases[(await params).id];
  return { title: c ? `Case No. ${c.number} · Desk` : "Case not found", robots: { index: false } };
}

export default async function DeskPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = cases[id];
  if (!c) notFound();
  return <SoloDesk c={c} />;
}
