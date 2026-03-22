import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const viewport: Viewport = {
  themeColor: "#c2410c",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AfroDanz | Authentic Afro Dance Workshops & Community",
  description: "Join the heartbeat of rhythm. Experience Amapiano, Afrobeats, and Afro-Contemporary dance workshops with world-class instructors. Book classes and join our vibrant community.",
  keywords: ["Afro Dance", "Amapiano", "Afrobeats", "Dance Workshop", "African Culture", "Dance Studio"],
  authors: [{ name: "AfroDanz Studio" }],
  openGraph: {
    title: "AfroDanz | Authentic Afro Dance Movement",
    description: "Join our vibrant community and master the art of Afro movement. Book workshops and subscriptions online.",
    url: "https://afrodanz.com",
    siteName: "AfroDanz",
    images: [
      {
        url: "/page_facbook_kouami_atelier_danse_africaine.jpg",
        width: 1200,
        height: 630,
        alt: "AfroDanz Workshop Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AfroDanz | Unleash Your Spirit",
    description: "Experience the heartbeat of rhythm. Authentic Afro dance workshops and memberships.",
    images: ["/page_facbook_kouami_atelier_danse_africaine.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-primary selection:text-white`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-primary focus:text-white">
          Skip to content
        </a>
        <Navbar />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
