import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Remove the session cookie
  const url = new URL("/", req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set("session", "", { path: "/", maxAge: 0 });
  return res;
}
