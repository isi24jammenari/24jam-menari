import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "24 Jam Menari — Pendaftaran Show",
  description: "Platform pendaftaran slot penampilan 24 Jam Menari",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${geist.variable} font-sans bg-background text-foreground antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t border-border bg-card mt-16">
          <div className="max-w-5xl mx-auto px-6 py-8 text-center">
            <p className="text-tradisional text-lg font-semibold text-primary">
              24 Jam Menari
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Platform Pendaftaran Penampilan Seni
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
