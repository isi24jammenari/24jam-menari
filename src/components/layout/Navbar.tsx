"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const steps = [
  { label: "Pilih Venue", href: "/" },
  { label: "Pilih Jam", href: "/booking" },
  { label: "Pembayaran", href: "/booking/payment" },
  { label: "Buat Akun", href: "/booking/register" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isDashboard =
    pathname.startsWith("/dashboard/user") ||
    pathname.startsWith("/dashboard/admin");

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-3xl">🎭</span>
          <div>
            <p className="text-tradisional font-bold text-xl text-primary leading-none">
              24 Jam Menari
            </p>
            <p className="text-xs text-muted-foreground">Pendaftaran Penampilan</p>
          </div>
        </Link>

        {/* Breadcrumb step — hanya tampil di alur booking */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-1">
            {steps.map((step, i) => {
              const isActive = pathname === step.href;
              const isPast =
                steps.findIndex((s) => s.href === pathname) > i;
              return (
                <div key={step.href} className="flex items-center gap-1">
                  <span
                    className={`text-sm px-3 py-1 rounded-full transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : isPast
                        ? "text-accent font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {i + 1}. {step.label}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="text-muted-foreground text-xs">›</span>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        {/* Dashboard badge */}
        {isDashboard && (
          <div className="flex items-center gap-3">
            {pathname.startsWith("/dashboard/admin") && (
              <span className="text-sm bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium">
                Admin
              </span>
            )}
            {pathname.startsWith("/dashboard/user") && (
              <span className="text-sm bg-accent text-accent-foreground px-3 py-1 rounded-full font-medium">
                Dashboard Penari
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
