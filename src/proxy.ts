import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

const AUTH_PAGES = ["/login", "/signup", "/signup/professional", "/verify-otp"];
const PROTECTED_PREFIXES = ["/home", "/search", "/favorites", "/account", "/professional", "/admin"];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export default async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase isn't configured yet — let requests through unmodified rather
  // than crashing every route. Remove this guard once env vars are set.
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (isProtected(pathname) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (AUTH_PAGES.includes(pathname) && user) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Server Actions (Next-Action header) POST to the same path as the page
  // they're called from. A redirect here would break the Server Action
  // response the client expects, surfacing as an opaque client-side
  // exception instead of the actual RLS/is_admin() error. Real enforcement
  // for mutations already happens at the RLS/RPC layer regardless — this
  // check is only a navigation-time redirect for non-admins landing on the
  // page, so it's safe to skip for action requests.
  const isServerAction = request.headers.has("next-action");
  if (pathname.startsWith("/admin") && user && !isServerAction) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|icons/|absher-logo.png).*)"],
};
