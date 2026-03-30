"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram } from "lucide-react"; // Pastikan sudah install lucide-react atau gunakan SVG biasa

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/24jammenari.png" alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
        </Link>

        {/* Instagram Link (Placeholder) */}
        <div className="flex items-center gap-4">
          <a 
            href="https://instagram.com/placeholder" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
          >
            <Instagram size={22} />
          </a>
        </div>
      </div>
    </header>
  );
}