import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProvenIQ Health — Clinical Intelligence Built on Real Outcomes",
  description:
    "ProvenIQ transforms EHR data into evidence-based clinical intelligence. Treatment recommendations ranked by proven success rates from 201K+ real patient outcomes.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  keywords: [
    "clinical decision support",
    "hormone replacement therapy",
    "HRT",
    "functional medicine",
    "clinical intelligence",
    "treatment recommendations",
    "patient outcomes",
    "EHR analytics",
  ],
  openGraph: {
    title: "ProvenIQ Health — Outcomes That Speak for Themselves",
    description:
      "Clinical intelligence built on 201K+ real treatment outcomes. Stop guessing. See what actually works.",
    url: "https://proveniq.health",
    siteName: "ProvenIQ Health",
    type: "website",
    images: [
      {
        url: "https://proveniq.health/images/hero-dashboard.png",
        width: 1200,
        height: 700,
        alt: "ProvenIQ Clinical Intelligence Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProvenIQ Health — Outcomes That Speak for Themselves",
    description:
      "Clinical intelligence built on 201K+ real treatment outcomes.",
    images: ["https://proveniq.health/images/hero-dashboard.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
