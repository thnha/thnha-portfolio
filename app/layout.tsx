import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Nha Tran — Senior React Native Engineer",
  description:
    "Senior React Native Engineer with 14+ years of experience: multi-app POS ecosystems, payments, in-store hardware integrations and production releases on iOS and Android.",
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.svg`,
    shortcut: `${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.svg`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
