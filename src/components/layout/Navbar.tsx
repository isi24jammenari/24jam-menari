"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Instagram, LayoutDashboard, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };

    checkAuth();
    window.addEventListener("focus", checkAuth);
    return () => window.removeEventListener("focus", checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    router.push("/");
  };

  // ✅ Sembunyikan tombol "Masuk" jika sudah di dalam Dashboard ATAU sedang di halaman Login
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuthPage = pathname?.startsWith("/auth");
  const hideLoginBtn = isDashboard || isAuthPage;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between relative">
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

        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href="https://www.instagram.com/24jammenari_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
            title="Instagram 24 Jam Menari"
          >
            <Instagram size={22} />
          </a>

          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {!isDashboard && (
                <button
                  onClick={() => router.push("/dashboard/user")}
                  className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold transition-all text-sm sm:text-base shadow-sm"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/30 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold transition-all text-sm sm:text-base shadow-sm"
                title="Keluar dari akun"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            // ✅ Arahkan ke /auth/login
            !hideLoginBtn && (
              <button
                onClick={() => router.push("/auth/login")}
                className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold transition-all text-sm sm:text-base shadow-sm"
              >
                <span className="text-lg">👤</span>
                <span className="hidden sm:inline">Sudah Daftar? Masuk</span>
                <span className="sm:hidden">Masuk</span>
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}