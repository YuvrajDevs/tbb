import { Room } from "@/components/Room";
import { SignInGate } from "@/components/SignIn";

export const metadata = { title: "Party room", robots: { index: false } };

export default async function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <SignInGate what="join this room">
      <Room code={code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)} />
    </SignInGate>
  );
}
