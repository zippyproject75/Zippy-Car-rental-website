import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

const LOCALES = new Set(["hi", "mr"]);

function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/account";
  }
  return value;
}

function localePrefixFromPath(path: string): string {
  const segment = path.split("/")[1];
  return segment && LOCALES.has(segment) ? `/${segment}` : "";
}

function authErrorRedirect(request: NextRequest, nextPath: string, code?: string | null) {
  const isResetFlow = nextPath.includes("/reset-password");
  const prefix = localePrefixFromPath(nextPath);
  const pathname = isResetFlow ? `${prefix}/forgot-password` : `${prefix}/login`;
  const errorUrl = new URL(pathname, request.url);
  errorUrl.searchParams.set("authError", isResetFlow ? "reset_link" : "callback");
  if (code) {
    errorUrl.searchParams.set("authErrorCode", code);
  }
  const next = request.nextUrl.searchParams.get("next");
  if (next && !isResetFlow) {
    errorUrl.searchParams.set("next", next);
  }
  return NextResponse.redirect(errorUrl);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const authCode = params.get("code");
  const nextPath = safeRedirectPath(params.get("next"));
  const providerError = params.get("error");
  const providerErrorCode = params.get("error_code");

  if (providerError) {
    return authErrorRedirect(request, nextPath, providerErrorCode ?? providerError);
  }

  if (!authCode) {
    return authErrorRedirect(request, nextPath, "missing_code");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be configured.",
    );
  }

  const cookieStore = await cookies();
  const pendingCookies: CookieToSet[] = [];
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          pendingCookies.push(cookie);
          try {
            cookieStore.set(cookie.name, cookie.value, cookie.options as never);
          } catch {
            // Route handlers may not always allow mutating the request cookie store; the redirect response still gets the cookies below.
          }
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(authCode);
  if (error) {
    return authErrorRedirect(request, nextPath, error.code ?? "exchange_failed");
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url));
  for (const { name, value, options } of pendingCookies) {
    response.cookies.set(name, value, options as never);
  }
  return response;
}
