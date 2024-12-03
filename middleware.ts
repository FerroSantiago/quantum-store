import { auth } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAuthenticated = !!req.auth
  const isAccessingProtectedRoute = 
    req.nextUrl.pathname.startsWith('/profile') ||
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname.startsWith('/admin')

  // Si no está autenticado y trata de acceder a una ruta protegida
  if (!isAuthenticated && isAccessingProtectedRoute) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Si está autenticado pero no es admin intentando acceder a /admin
  if (isAuthenticated && 
      req.nextUrl.pathname.startsWith('/admin') && 
      req.auth?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
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