import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://reel-save.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ReelSave | Instagram Reel Downloader",
  description: "Download public Instagram Reels in seconds with ReelSave. Paste a Reel link and save the video you have permission to keep.",
  keywords: [
    "Instagram reel downloader",
    "download Instagram reel",
    "save Instagram video",
    "reel saver",
    "Instagram video downloader",
  ],
  applicationName: "ReelSave",
  verification: {
    google: "GRtDQJ2BpUGChbtvJVmupWRxMTszIEmufHkd2qxR2C0",
    other: {
      "msvalidate.01": "8A640A2EFF81503020D89208FEDB7E35",
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ReelSave | Instagram Reel Downloader",
    description: "Download public Instagram Reels in seconds with ReelSave.",
    url: "/",
    siteName: "ReelSave",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReelSave | Instagram Reel Downloader",
    description: "Download public Instagram Reels in seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#191126",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
