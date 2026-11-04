import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MusicHost } from "@/components/MusicHost";
import { ErrorReporter } from "@/components/ErrorReporter";
import { Analytics } from "@vercel/analytics/next";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
const DESCRIPTION =
  "A detective case file you solve yourself: real statements, records and photographs, a narrator, and five sealed envelopes. Play solo, with friends anywhere in a party room, or print it for game night.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "The Blackwood Bureau · Open the file. Find the truth.", template: "%s · The Blackwood Bureau" },
  description: DESCRIPTION,
  applicationName: "The Blackwood Bureau",
  openGraph: {
    type: "website",
    siteName: "The Blackwood Bureau",
    title: "The Blackwood Bureau · Open the file. Find the truth.",
    description: DESCRIPTION,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: "The Blackwood Bureau", description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#0f0d0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Mrs+Saint+Delafield&display=swap"
        />
      </head>
      <body>
        <MusicHost />
        <ErrorReporter />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
