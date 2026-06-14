import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicRoutes = ["/", "/auth/sign-in", "/auth/sign-up", "/auth/sign-in/error"];

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathName = request.nextUrl.pathname;

  const inOnAuthRoutes = pathName.startsWith("/auth");

  if (inOnAuthRoutes && sessionCookie) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  const inOnProtectedRoutes = !publicRoutes.includes(pathName);

  if (inOnProtectedRoutes && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
