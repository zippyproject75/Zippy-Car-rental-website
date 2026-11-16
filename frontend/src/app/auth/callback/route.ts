import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function safeRedirectPath(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/account";
  }
  return value;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(
        new URL(safeRedirectPath(request.nextUrl.searchParams.get("next")), request.url),
      );
    }
  }

  const errorUrl = new URL("/login", request.url);
  errorUrl.searchParams.set("authError", "oauth");
  return NextResponse.redirect(errorUrl);
}
