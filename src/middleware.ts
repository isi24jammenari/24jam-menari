import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // Deteksi Identitas Domain
  const isAdminDomain = hostname.includes('admin.24jammenariisisurakarta.com') || hostname.includes('admin.localhost');
  const isKomunitasDomain = hostname.startsWith('komunitas.');

  // ==========================================
  // ATURAN 1: JIKA BERADA DI DOMAIN ADMIN
  // ==========================================
  if (isAdminDomain) {
    // 1A. Jika buka halaman depan (/) di domain admin, langsung invisible rewrite ke dashboard admin
    if (url.pathname === '/') {
      url.pathname = '/dashboard/admin';
      return NextResponse.rewrite(url);
    }

    // 1B. Jika admin iseng buka halaman portal user atau booking, tendang ke login admin
    if (url.pathname.startsWith('/dashboard/user') || url.pathname.startsWith('/booking')) {
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  }

  // ==========================================
  // ATURAN 2: JIKA BERADA DI DOMAIN KOMUNITAS
  // ==========================================
  if (isKomunitasDomain) {
    // 2A. Jika URL belum mengarah ke folder /komunitas, kita paksa masuk secara invisible (rewrite)
    // Contoh 1: komunitas.domain.com/ -> dirender sebagai -> /komunitas
    // Contoh 2: komunitas.domain.com/login -> dirender sebagai -> /komunitas/login
    if (!url.pathname.startsWith('/komunitas')) {
      url.pathname = `/komunitas${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // ==========================================
  // ATURAN 3: JIKA BERADA DI DOMAIN UTAMA (USER MAIN)
  // ==========================================
  if (!isAdminDomain && !isKomunitasDomain) {
    // 3A. Jika user biasa mencoba maksa ngetik URL /dashboard/admin, tendang ke beranda utama
    if (url.pathname.startsWith('/dashboard/admin')) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Terapkan ke semua rute kecuali file statis dan API Next.js internal
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};