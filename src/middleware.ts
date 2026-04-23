import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // Deteksi Identitas Domain
  const isAdminDomain = hostname.includes('admin.24jammenariisisurakarta.com') || hostname.includes('admin.localhost');
  const isKomunitasDomain = hostname.startsWith('komunitas.');
  const isTenantDomain = hostname.startsWith('tenant.'); // INJEKSI TENANT

  // ==========================================
  // ATURAN 1: JIKA BERADA DI DOMAIN ADMIN
  // ==========================================
  if (isAdminDomain) {
    if (url.pathname === '/') {
      url.pathname = '/dashboard/admin';
      return NextResponse.rewrite(url);
    }
    if (url.pathname.startsWith('/dashboard/user') || url.pathname.startsWith('/booking')) {
      url.pathname = '/auth/login';
      return NextResponse.redirect(url);
    }
  }

  // ==========================================
  // ATURAN 2: JIKA BERADA DI DOMAIN KOMUNITAS
  // ==========================================
  if (isKomunitasDomain) {
    if (!url.pathname.startsWith('/komunitas')) {
      url.pathname = `/komunitas${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // ==========================================
  // ATURAN 3: JIKA BERADA DI DOMAIN TENANT
  // ==========================================
  if (isTenantDomain) {
    // Membelokkan URL /... menjadi /tenant/... secara transparan
    if (!url.pathname.startsWith('/tenant')) {
      url.pathname = `/tenant${url.pathname === '/' ? '' : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // ==========================================
  // ATURAN 4: JIKA BERADA DI DOMAIN UTAMA (USER MAIN)
  // ==========================================
  // Pastikan domain tenant juga dikecualikan dari fallback utama
  if (!isAdminDomain && !isKomunitasDomain && !isTenantDomain) {
    if (url.pathname.startsWith('/dashboard/admin')) {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};