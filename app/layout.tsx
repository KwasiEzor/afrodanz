import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import theme from "./colors.json";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Providers } from "./providers";
import { Toaster } from 'sonner';
import { CookieBanner } from "./components/CookieBanner";
import { getServerLocale } from "@/lib/locale.server";

const themeStyle = {
  "--background": theme.colors.navajowhite["950"],
  "--foreground": theme.colors.navajowhite["100"],
  "--primary": theme.colors.saddlebrown["400"],
  "--secondary": theme.colors.orange["400"],
  "--accent": theme.colors.darkseagreen["500"],
  "--muted": theme.colors.navajowhite["600"],
  "--panel": "rgba(25, 22, 17, 0.86)",
  "--panel-strong": "rgba(13, 11, 8, 0.95)",
  "--panel-soft": "rgba(255, 248, 238, 0.04)",
  "--panel-border": "rgba(149, 103, 69, 0.32)",
} as CSSProperties;

function resolveMetadataBase() {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!rawUrl) {
    return new URL("http://localhost:3000");
  }

  try {
    return new URL(rawUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const viewport: Viewport = {
  themeColor: theme.colors.navajowhite["950"],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialLocale = await getServerLocale();
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className="site-shell antialiased selection:bg-primary selection:text-white"
        style={themeStyle}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-primary focus:text-white">
          Skip to content
        </a>
        <Providers initialLocale={initialLocale}>
          <Navbar />
          <main id="main-content">
            {children}
          </main>
        </Providers>
        <Toaster richColors position="top-right" />
        <CookieBanner />
      </body>
    </html>
  );
}
