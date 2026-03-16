import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const role = payload.role;
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/admin") && role !== "ROLE_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/profile") && !role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
};