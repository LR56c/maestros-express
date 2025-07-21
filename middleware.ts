import { type NextRequest, NextResponse } from "next/server"
import { updateSession }                  from "@/utils/supabase/middleware"

const PUBLIC_PATHS = ['/', '/ingresar', '/registrar', '/trabajador/aplicar']
function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}
export async function middleware( request: NextRequest ) {
  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }
  return await updateSession( request )
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
}