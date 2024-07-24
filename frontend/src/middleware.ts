import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Request URL:", req.url);
  
  // Continue to the next middleware
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};