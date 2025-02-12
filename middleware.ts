import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { User } from 'next-auth'

// Extendemos el tipo Request para incluir auth
interface RequestWithAuth extends NextRequest {
  auth: {
    user: User & {
      role: string
    } | null
  } | null
}

export default auth((req: NextRequest) => {
  // Cast req a nuestro tipo personalizado
  const request = req as RequestWithAuth
  const isAuthenticated = !!request.auth
  const isAccessingProtectedRoute =
    request.nextUrl.pathname.startsWith('/profile') ||
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin')

  if (!isAuthenticated && isAccessingProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isAuthenticated &&
    request.nextUrl.pathname.startsWith('/admin') &&
    request.auth?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/profile/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ]
}