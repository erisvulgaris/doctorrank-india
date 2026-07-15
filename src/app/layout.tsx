import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://doctorrank.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DoctorRank India — Find the Right Doctor for Your Condition",
    template: "%s · DoctorRank India",
  },
  description:
    "DoctorRank India is an AI-powered doctor discovery platform. Search by symptom or condition, compare verified specialists on transparent ranking factors, and book appointments with confidence.",
  keywords: [
    "find doctor India",
    "best doctor near me",
    "doctor discovery",
    "specialist search India",
    "AI doctor search",
    "DoctorRank",
    "verified doctors India",
    "book doctor appointment",
    "hair fall doctor",
    "cardiologist India",
    "dermatologist India",
  ],
  authors: [{ name: "DoctorRank India" }],
  creator: "DoctorRank India",
  publisher: "DoctorRank India",
  icons: {
    icon: "/logo.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DoctorRank India — AI-Powered Doctor Discovery",
    description:
      "Search by symptom, compare verified specialists on transparent ranking factors, and book the right doctor — fast.",
    url: siteUrl,
    siteName: "DoctorRank India",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoctorRank India — AI-Powered Doctor Discovery",
    description:
      "Search by symptom, compare verified specialists, and book the right doctor.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "health",
};

export const viewport: Viewport = {
  themeColor: "#1456D9",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
