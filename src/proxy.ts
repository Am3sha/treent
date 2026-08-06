import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const isLoginPage = req.nextUrl.pathname === "/admin/login";
    const isLoggedIn = !!req.nextauth.token;

    // If user is at /admin/login but already logged in, redirect to /admin
    if (isLoginPage && isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === "/admin/login";
        // Always allow access to login page
        if (isLoginPage) return true;
        // For all other /admin routes, require valid token
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
