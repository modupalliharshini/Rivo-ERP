import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect routes based on role (could fetch profile here, but simpler in layout for now)
  // Just basic redirect if not authenticated for protected routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/super-admin') ||
                           request.nextUrl.pathname.startsWith('/dashboard') ||
                           request.nextUrl.pathname.startsWith('/faculty') ||
                           request.nextUrl.pathname.startsWith('/student');

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // If going to login page while authenticated, redirect to role dashboard
  // We don't fetch role here for performance, so just generic redirect to dashboard
  // Layouts will handle specific role mismatch
  if (user && request.nextUrl.pathname === '/') {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile) {
      let redirectTo = '/dashboard'
      if (profile.role === 'super_admin') redirectTo = '/super-admin'
      else if (profile.role === 'faculty') redirectTo = '/faculty'
      else if (profile.role === 'student') redirectTo = '/student'

      const url = request.nextUrl.clone()
      url.pathname = redirectTo
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
