import { JoinForm } from "@/components/JoinForm";
import Link from "next/link";

export const metadata = { title: "Join a party room", description: "Enter the five-letter code from your host to join a Blackwood Bureau party room." };

export default function JoinPage() {
  return (
    <div className="wrap" style={{ paddingTop: 28, paddingBottom: 80, maxWidth: 560 }}>
      <Link href="/cases" className="btn ghost" style={{ paddingLeft: 0 }}>← Case archive</Link>
      <div className="eyebrow" style={{ marginTop: 40 }}>Party room</div>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, fontSize: 34, margin: "8px 0 24px" }}>Join a room</h1>
      <JoinForm />
    </div>
  );
}
