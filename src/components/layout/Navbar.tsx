"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Instagram, LayoutDashboard, LogOut, Key } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminDomain, setIsAdminDomain] = useState(false);
  const [isKomunitasDomain, setIsKomunitasDomain] = useState(false);
  const [isTenantDomain, setIsTenantDomain] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token);
    };

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      setIsAdminDomain(hostname.includes("admin.24jammenari") || hostname.includes("admin.localhost"));
      setIsKomunitasDomain(hostname.startsWith("komunitas."));
      setIsTenantDomain(hostname.startsWith("tenant."));
    }

    checkAuth();
    window.addEventListener("focus", checkAuth);
    return () => window.removeEventListener("focus", checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    router.push("/");
  };

  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuthPage = pathname?.startsWith("/auth");
  const hideLoginBtn = isDashboard || isAuthPage;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between relative">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity gap-3">
          <Image
            src="/24jammenari.webp"
            alt="Logo 24 Jam Menari"
            width={120}
            height={48}
            priority
            unoptimized 
            className="h-10 md:h-12 w-auto object-contain"
          />
          {isTenantDomain && (
            <div className="border-l border-border pl-3 hidden sm:block">
              <p className="text-accent font-bold text-sm tracking-tighter uppercase leading-none">Bazaar Tenant</p>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">HTD #20 Surakarta</p>
            </div>
          )}
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <a
            href="https://www.instagram.com/24jammenari_official/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10"
          >
            <Instagram size={22} />
          </a>

          {isTenantDomain ? (
             <Link 
                href="/form" 
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 sm:px-6 rounded-full font-bold transition-all text-sm shadow-lg shadow-primary/20 hover:scale-105"
             >
               <Key size={16} />
               <span>Login Kode</span>
             </Link>
          ) : (
            isLoggedIn ? (
              <div className="flex items-center gap-2">
                {!isDashboard && !isAdminDomain && !isKomunitasDomain && (
                  <button
                    onClick={() => router.push("/dashboard/user")}
                    className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/30 px-4 py-2 rounded-full font-semibold transition-all text-sm"
                  >
                    <LayoutDashboard size={18} />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/30 px-4 py-2 rounded-full font-semibold transition-all text-sm"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              !hideLoginBtn && (
                <button
                  onClick={() => router.push("/auth/login")}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-bold transition-all text-sm"
                >
                  <span>Masuk</span>
                </button>
              )
            )
          )}
        </div>
      </div>
    </header>
  );
}