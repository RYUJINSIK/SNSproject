import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 쿠키에서 토큰 확인
  const token = request.cookies.get("auth_token")?.value;
  const isLoggedIn = !!token;

  // 로그인이 필요한 페이지들
  const authRequiredPages = ["/posts/write"];
  // 로그인한 사용자가 접근할 수 없는 페이지들
  const guestOnlyPages = ["/login"];

  if (
    authRequiredPages.some((page) => pathname.startsWith(page)) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (guestOnlyPages.includes(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/write", "/login"],
};
