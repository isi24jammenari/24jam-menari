import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // Deteksi apakah ini domain admin (termasuk admin.localhost untuk testing lokal)
  const isAdminDomain = hostname.includes('admin.24jammenariisisurakarta.com') || hostname.includes('admin.localhost');

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
  // ATURAN 2: JIKA BERADA DI DOMAIN UTAMA (USER)
  // ==========================================
  if (!isAdminDomain) {
    // 2A. Jika user biasa mencoba maksa ngetik URL /dashboard/admin, tendang ke beranda utama
    if (url.pathname.startsWith('/dashboard/admin')) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Terapkan ke semua rute kecuali file statis dan API Next.js internal
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};