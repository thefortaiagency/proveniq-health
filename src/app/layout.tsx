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
  },
  twitter: {
    card: "summary_large_image",
    title: "ProvenIQ Health — Outcomes That Speak for Themselves",
    description:
      "Clinical intelligence built on 201K+ real treatment outcomes.",
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
