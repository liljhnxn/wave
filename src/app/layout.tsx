import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wave — A Simple Web3 Social DApp",
  description: "Drop a wave. Get one back. Connect your MetaMask wallet, send a wave, and spread good vibes on Botchain Testnet.",
  keywords: ["Web3", "Solidity", "DApp", "Botchain", "MetaMask", "Next.js", "Social"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-charcoal-950 text-gray-200 antialiased selection:bg-purple-accent/30 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
