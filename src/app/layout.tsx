import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css"; // REVISI: Menggunakan alias @ agar TS Server tidak error

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "24Jam Menari — Pendaftaran Show",
  description: "Platform pendaftaran slot penampilan 24Jam Menari",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${geist.variable} font-sans bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}