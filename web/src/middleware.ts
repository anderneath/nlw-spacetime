import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.rewrite(new URL('/api/auth/login', request.url), {
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; Path=/; Max-Age=20; HttpOnly;`,
      },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/memories/:path*',
}
