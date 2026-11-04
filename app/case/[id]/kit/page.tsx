import { notFound } from "next/navigation";
import { cases } from "@/lib/cases/hollow-pines";
import { Kit } from "@/components/Kit";
import { SignInGate } from "@/components/SignIn";

export function generateStaticParams() {
  return Object.keys(cases).map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const c = cases[(await params).id];
  return { title: c ? `Case No. ${c.number} · Print kit` : "Case not found", robots: { index: false } };
}

export default async function KitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = cases[id];
  if (!c) notFound();
  return (
    <SignInGate what="print this case kit">
      <Kit c={c} />
    </SignInGate>
  );
}
