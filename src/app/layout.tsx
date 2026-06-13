import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { Providers } from "@/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CeloPay Agent",
  description: "AI-powered payment assistant for MiniPay.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1D9E75",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="h-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <Providers>
          <div className="app-shell">
            <main className="flex-1 flex flex-col min-h-0">{children}</main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
