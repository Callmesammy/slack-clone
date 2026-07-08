import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Bypassed: Let everything be accessible for now
  return NextResponse.next();
}

// Apply to pages and paths, excluding static resources and API calls
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
