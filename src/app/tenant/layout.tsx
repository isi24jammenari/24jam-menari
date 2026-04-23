import { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function TenantLayout({ children }: { children: ReactNode }) {
  return (
    // Background dasar menggunakan Black (#000000) sesuai palet
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#ff00cc] selection:text-white font-sans">
      
      {/* NAVBAR TENANT KHUSUS */}
      <nav className="border-b border-[#6849cf]/30 bg-[#000000]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Area */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-[#c6ff33] flex items-center justify-center font-bold text-black group-hover:bg-[#ff00cc] transition-colors duration-300">
                  24
                </div>
                <div className="flex flex-col">
                  <span className="text-[#c6ff33] font-bold text-xl tracking-wider uppercase leading-none group-hover:text-[#ff00cc] transition-colors duration-300">
                    Bazaar Tenant
                  </span>
                  <span className="text-[#6849cf] text-xs font-semibold uppercase tracking-widest">
                    24 Jam Menari
                  </span>
                </div>
              </Link>
            </div>

            {/* Menu Kanan (Recovery Login) */}
            <div className="flex items-center">
              <Link 
                href="/form" 
                className="px-5 py-2.5 bg-[#6849cf] text-white text-sm font-bold uppercase tracking-wider rounded-none border border-[#6849cf] hover:bg-transparent hover:text-[#c6ff33] hover:border-[#c6ff33] transition-all duration-300 shadow-[0_0_15px_rgba(104,73,207,0.5)] hover:shadow-[0_0_20px_rgba(198,255,51,0.5)]"
              >
                Login Kode Akses
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* KONTEN HALAMAN */}
      <main className="w-full">
        {children}
      </main>

      {/* FOOTER SEDERHANA */}
      <footer className="border-t border-[#6849cf]/30 bg-[#000000] py-8 text-center">
        <p className="text-[#6849cf] text-sm">
          &copy; 2026 ISI Surakarta - Divisi Tenant & Bazaar.
        </p>
      </footer>
    </div>
  );
}