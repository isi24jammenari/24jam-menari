import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // Deteksi jika diakses melalui subdomain admin
  if (hostname.includes('admin.24jammenariisisurakarta.com')) {
    // Jika mengakses root domain admin, lempar otomatis ke dashboard admin
    if (url.pathname === '/') {
      url.pathname = '/dashboard/admin';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};