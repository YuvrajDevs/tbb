import { AuthCallback } from "@/components/AuthCallback";

export const metadata = { title: "Signing in", robots: { index: false } };

export default function CallbackPage() {
  return <AuthCallback />;
}
