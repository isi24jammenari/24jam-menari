import Navbar from "./Navbar";
import Image from "next/image";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// SVG Kustom untuk Icon TikTok
const TikTokIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// MENGEMBALIKAN INTERFACE PROPS AGAR TIDAK ERROR DI HALAMAN LAIN
interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

export default function PageWrapper({ children, className, narrow = false }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header / Navbar Global */}
      <Navbar />

      {/* Konten Utama Halaman (Dengan dukungan properti narrow dan className) */}
      <main className={cn(
        "flex-1 w-full mx-auto px-6 py-8 md:py-12",
        narrow ? "max-w-2xl" : "max-w-5xl",
        className
      )}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto bg-card/20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8">
            
            {/* Kolom Kiri: Logo & Alamat */}
            <div className="space-y-5">
              <Image 
                src="/24jammenari.webp" 
                alt="Logo 24 Jam Menari" 
                width={180} 
                height={60} 
                className="h-12 sm:h-14 w-auto object-contain opacity-90"
              />
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm">
                Jl. Ki Hadjar Dewantara No. 19, Jebres, Surakarta 57126
              </p>
            </div>

            {/* Kolom Kanan: Kontak & Sosial Media */}
            <div className="flex flex-col space-y-4 md:items-end">
              
              {/* 1. WhatsApp CP */}
              <a 
                href="https://wa.me/6282123239004" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start md:items-center gap-3 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors group"
              >
                <MessageCircle size={20} className="mt-0.5 md:mt-0 flex-shrink-0 group-hover:text-green-500 transition-colors" />
                <span className="text-left md:text-right">
                  CP. 0821-2323-9004 <br className="md:hidden" />
                  <span className="opacity-80 md:ml-1 text-xs sm:text-sm">(PANITIA 24JAM MENARI ISI SURAKARTA)</span>
                </span>
              </a>

              {/* 2. Instagram */}
              <a 
                href="https://www.instagram.com/24jammenari_official/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors group"
              >
                <Instagram size={20} className="flex-shrink-0 group-hover:text-pink-500 transition-colors" />
                <span>24jammenari_official</span>
              </a>

              {/* 3. TikTok */}
              <a 
                href="https://www.tiktok.com/@24jammenari_official" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors group"
              >
                <TikTokIcon size={20} className="flex-shrink-0 group-hover:text-foreground transition-colors" />
                <span>24jammenari_official</span>
              </a>

              {/* 4. Email */}
              <a 
                href="mailto:24jammenariisisolo2026@gmail.com" 
                className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors group"
              >
                <Mail size={20} className="flex-shrink-0 group-hover:text-accent transition-colors" />
                <span>24jammenariisisolo2026@gmail.com</span>
              </a>

            </div>
          </div>

          {/* Aksen Budaya & Copyright di Paling Bawah */}
          <div className="mt-16 pt-8 border-t border-border/40 flex flex-col items-center justify-center">
            
            {/* Ornamen Floral/Batik */}
            <div className="flex items-center justify-center gap-4 mb-6 opacity-60">
              <div className="h-px w-20 sm:w-32 bg-gradient-to-r from-transparent to-primary" />
              <span className="text-primary text-xl sm:text-2xl">❦</span>
              <div className="h-px w-20 sm:w-32 bg-gradient-to-l from-transparent to-primary" />
            </div>
            
            <p className="text-center text-muted-foreground text-xs sm:text-sm tracking-wide">
              &copy; {new Date().getFullYear()} 24Jam Menari ISI Surakarta. Hak Cipta Dilindungi.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}