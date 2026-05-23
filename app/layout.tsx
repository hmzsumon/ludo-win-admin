import SocketProvider from "@/providers/SocketProvider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import { AppThemeProvider } from "@/components/theme/theme-provider";
import StoreProvider from "./StoreProvider";
import Providers from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Orbit  - Admin Panel",
  description: "Trade on your favorite trading platforms with Capitalise",
  openGraph: {
    title: "Ludo Party - Admin Panel",
    description: "Play Ludo with your friends online and have fun together",
    url: "https://sw999.bet",
    siteName: "Capitalise",
    images: [
      {
        url: "https://sw999.bet/og-image.png",
        width: 1200,
        height: 630,
        alt: "SW999 - Bet",
      },
    ],
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased transition-colors`}
        suppressHydrationWarning={true}
      >
        <StoreProvider>
          <AppThemeProvider>
            <SocketProvider>
              <Providers>{children}</Providers>
              <Toaster />
            </SocketProvider>
          </AppThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
