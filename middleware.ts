import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // ── CORS for API routes ───────────────────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    // Allow WhatsApp webhook from Meta servers
    if (pathname.startsWith('/api/whatsapp/')) {
      res.headers.set('Access-Control-Allow-Origin', 'https://graph.facebook.com');
    } else {
      // Allow same-origin + your frontend domain
      const origin = req.headers.get('origin') || '';
      const allowed = [
        process.env.NEXT_PUBLIC_APP_URL || '',
        'http://localhost:3000',
        'http://localhost:3001',
      ];
      if (allowed.includes(origin)) {
        res.headers.set('Access-Control-Allow-Origin', origin);
      }
    }

    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: res.headers });
    }
  }

  // ── Basic rate limiting hint (use Vercel KV in production) ───────────────
  // For production, add: import { Ratelimit } from '@upstash/ratelimit'

  // ── Security headers ──────────────────────────────────────────────────────
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return res;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
