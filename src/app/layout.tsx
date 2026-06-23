import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "../styles/globals.css";
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
