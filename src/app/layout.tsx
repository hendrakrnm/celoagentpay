import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "../styles/globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { Providers } from "@/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CeloPay Agent",
  description: "AI-powered payment assistant for MiniPay.",
  icons: { icon: "/favicon.ico" },
  other: {
    "talentapp:project_verification":
      "26e0b6ee8261996ced4725fb4019003e9c073066ae39b498a825f330902902aaaa0e6add99a89ab89ea1200948a79a1d2cd75037b4dd6f415d0911c2d1de8b79",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#e8879f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}>
      <body className="h-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <Providers>
          <div className="app-shell">
            <main className="flex min-h-0 flex-1 flex-col">{children}</main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
