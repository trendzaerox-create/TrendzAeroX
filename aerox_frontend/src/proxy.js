// import { NextResponse } from "next/server";

// export function proxy(request) {

//   const token = request.cookies.get("token")?.value;
//   const { pathname } = request.nextUrl;

//   // protected routes
//   const protectedRoutes = ["/admin", "/account", "/checkout"];

//   const isProtected = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (isProtected && !token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/admin/:path*",
//     "/account/:path*",
//     "/checkout/:path*"
//   ]
// };










import { NextResponse } from "next/server";

export function proxy() {
  // 🔥 TEMP: disable all redirects
  return NextResponse.next();
}

export const config = {
  matcher: [],
};