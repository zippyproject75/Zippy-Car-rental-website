import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

const LOCALES = new Set(["hi", "mr"]);
const RECOVERY_NEXT_COOKIE = "zippy_recovery_next";
const OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function safeRedirectPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }
  return value;
}

function localePrefixFromPath(path: string): string {
  const segment = path.split("/")[1];
  return segment && LOCALES.has(segment) ? `/${segment}` : "";
}

function withPendingCookies(response: NextResponse, pendingCookies: CookieToSet[]) {
  for (const { name, value, options } of pendingCookies) {
    response.cookies.set(name, value, options);
  }
  return response;
}

function clearRecoveryCookie(response: NextResponse) {
  response.cookies.set(RECOVERY_NEXT_COOKIE, "", { path: "/", maxAge: 0 });
}

function authErrorRedirect(
  request: NextRequest,
  nextPath: string | null,
  pendingCookies: CookieToSet[],
  code?: string | null,
) {
  const isResetFlow = (nextPath ?? "").includes("/reset-password");
  const prefix = localePrefixFromPath(nextPath ?? request.nextUrl.pathname);
  const pathname = isResetFlow ? `${prefix}/forgot-password` : `${prefix}/login`;
  const errorUrl = new URL(pathname, request.url);
  errorUrl.searchParams.set("authError", isResetFlow ? "reset_link" : "callback");
  if (code) {
    errorUrl.searchParams.set("authErrorCode", code);
  }
  const originalNext = safeRedirectPath(request.nextUrl.searchParams.get("next"));
  if (originalNext && !isResetFlow) {
    errorUrl.searchParams.set("next", originalNext);
  }
  const response = withPendingCookies(NextResponse.redirect(errorUrl), pendingCookies);
  clearRecoveryCookie(response);
  return response;
}

function resolveNextPath(request: NextRequest, cookieNext: string | undefined): string {
  return (
    safeRedirectPath(request.nextUrl.searchParams.get("next")) ??
    safeRedirectPath(cookieNext) ??
    "/account"
  );
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const authCode = params.get("code");
  const tokenHash = params.get("token_hash");
  const typeParam = params.get("type");
  const providerError = params.get("error");
  const providerErrorCode = params.get("error_code") ?? params.get("error_description");

  const cookieStore = await cookies();
  const cookieNext = cookieStore.get(RECOVERY_NEXT_COOKIE)?.value;
  const explicitNext = safeRedirectPath(params.get("next"));

  if (providerError) {
    return authErrorRedirect(request, explicitNext ?? cookieNext ?? null, [], providerErrorCode ?? providerError);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be configured.",
    );
  }

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

  if (authCode) {
    const { error } = await supabase.auth.exchangeCodeForSession(authCode);
    if (error) {
      return authErrorRedirect(request, resolveNextPath(request, cookieNext), pendingCookies, error.code ?? "exchange_failed");
    }
  } else if (tokenHash && typeParam && OTP_TYPES.has(typeParam as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      type: typeParam as EmailOtpType,
      token_hash: tokenHash,
    });
    if (error) {
      return authErrorRedirect(request, resolveNextPath(request, cookieNext), pendingCookies, error.code ?? "verify_failed");
    }
  } else {
    return authErrorRedirect(request, explicitNext ?? cookieNext ?? null, [], "missing_code");
  }

  const nextPath = resolveNextPath(request, cookieNext);
  const response = withPendingCookies(NextResponse.redirect(new URL(nextPath, request.url)), pendingCookies);
  clearRecoveryCookie(response);
  return response;
}
