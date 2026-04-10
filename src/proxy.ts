/**
 * @file src/proxy.ts
 * @description Locale and auth route protection for ORAX.
 */

import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ["en", "ar"] as const;
const DEFAULT_LOCALE = "en";
const LOCALE_COOKIE_NAME = "orax-locale";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const PROTECTED_ROUTES = ["/dashboard", "/settings", "/billing"];

type Locale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ar";
}

function getLocaleFromCookie(request: NextRequest): Locale {
  const cookieValue = request.cookies.get(LOCALE_COOKIE_NAME)?.value;

  if (isSupportedLocale(cookieValue)) {
    return cookieValue;
  }

  return DEFAULT_LOCALE;
}

function stripLocale(pathname: string): string {
  for (const locale of SUPPORTED_LOCALES) {
    if (pathname === `/${locale}`) {
      return "/";
    }

    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }

  return pathname;
}

function getLocalizedPath(pathname: string, locale: Locale): string {
  if (pathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathname}`;
}

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (pathname === route) return true;
    return pathname.startsWith(`${route}/`);
  });
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!hasLocale) {
    const locale = getLocaleFromCookie(request);
    const url = request.nextUrl.clone();
    url.pathname = getLocalizedPath(pathname, locale);
    return NextResponse.redirect(url);
  }

  const locale =
    SUPPORTED_LOCALES.find(
      (value) => pathname === `/${value}` || pathname.startsWith(`/${value}/`),
    ) ?? DEFAULT_LOCALE;

  const normalizedPath = stripLocale(pathname);

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const isAuthenticated = Boolean(token);
  const isAuthRoute = matchesRoute(normalizedPath, AUTH_ROUTES);
  const isProtectedRoute = matchesRoute(normalizedPath, PROTECTED_ROUTES);

  if (!isAuthenticated && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = getLocalizedPath("/login", locale);
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = getLocalizedPath("/dashboard", locale);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
