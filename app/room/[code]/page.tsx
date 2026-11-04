import { Room } from "@/components/Room";

export default async function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <Room code={code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6)} />;
}
