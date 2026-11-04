import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MusicHost } from "@/components/MusicHost";

export const metadata: Metadata = {
  title: "The Blackwood Bureau",
  description: "Open the file. Find the truth.",
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
        <main>{children}</main>
      </body>
    </html>
  );
}
