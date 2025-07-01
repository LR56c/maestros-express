import { type NextRequest } from "next/server"
import { updateSession }    from "@/utils/supabase/middleware"

// const urlObject = request.nextUrl
// console.log( "Middleware triggered for request:", request )
// // request.method
// if ( urlObject.pathname.startsWith( "/api" ) ) {
//   console.log('Skipping middleware for API route:', urlObject.pathname)
//   return NextResponse.next()
// }
export async function middleware( request: NextRequest ) {
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
    "/((?!_next/static|_next/image|favicon.ico|register|login.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
}