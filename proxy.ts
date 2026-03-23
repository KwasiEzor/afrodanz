import { auth } from "./lib/auth"

/** Next.js 16+ proxy: same `auth` instance as API routes so JWT carries `role` for `/admin`. */
export default auth

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
