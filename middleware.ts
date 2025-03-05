import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const unauthorized = () => new NextResponse(null, { status: 404});
  const path = req.nextUrl.pathname;

  // No token, return 401 for all protected routes
  if (!token) {
    return unauthorized();
  }

  const role = token.role as string | undefined;

  // If no role is defined, return 401
  if (!role) {
    return unauthorized();
  }

  // Doctor routes protection
  if (path.startsWith("/doctor") && role !== "Doctor") {
    return unauthorized();
  }

  // Admin routes protection
  if ((path.startsWith("/admin") 
    || path.startsWith("/employee")
  
      ) && role !== "admin") {

    return unauthorized();
  }

  // Blog route protection
  if (path.startsWith("/blog") && !["Doctor"].includes(role)) {
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
  ]
};
