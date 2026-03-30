"use client";

import Link from "next/link";
import Image from "next/image"; // Tambahkan import ini
import { useRouter } from "next/navigation";
import { Instagram } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* Logo - Diperbarui ke WebP dan menggunakan next/image */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image 
            src="/24jammenari.webp" 
            alt="Logo 24 Jam Menari" 
            width={120} 
            height={48} 
            priority 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </Link>

        {/* Portal Text - Desktop Only */}
        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
          <p className="text-sm font-medium tracking-widest text-muted-foreground uppercase italic">
            Portal Pendaftaran Penampil 24 Jam Menari Surakarta
          </p>
        </div>

        {/* Action Bar Kanan */}
        <div className="flex items-center gap-3 sm:gap-6">
          <a 
            href="https://instagram.com/placeholder" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
          >
            <Instagram size={22} />
          </a>

          <button
            onClick={() => router.push("/?login=true")}
            className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold transition-all text-sm sm:text-base shadow-sm"
          >
            <span className="text-lg">👤</span>
            <span className="hidden sm:inline">Masuk Akun</span>
            <span className="sm:hidden">Masuk</span>
          </button>
        </div>
      </div>
    </header>
  );
}