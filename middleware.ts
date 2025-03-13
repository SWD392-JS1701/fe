import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const unauthorized = () => NextResponse.rewrite(new URL("/404", req.url));
  const path = req.nextUrl.pathname;

  if (!token) {
    return unauthorized();
  }

  const role = token.role as string | undefined;

  if (!role) {
    return unauthorized();
  }

  // Doctor routes protection
  if (
    path.startsWith("/doctor") ||
    (path.startsWith("/blog") && role !== "Doctor")
  ) {
    return unauthorized();
  }

  // Admin routes protection
  if (
    (path.startsWith("/admin") ||
      path.startsWith("/employee") ||
      path.startsWith("/overview") ||
      path.startsWith("/schedule")) &&
    role !== "Admin"
  ) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/doctor/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/blog/:path*",
    "/employee/:path*",
    "/overview/:path*",
    "/schedule/:path*",
    
  ],
};
