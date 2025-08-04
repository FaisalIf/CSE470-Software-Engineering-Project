import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Insecure registration: stores password as plain text
export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json();
  if (!username || !email || !password) {
    return NextResponse.json(
      { error: "Username, email, and password required" },
      { status: 400 }
    );
  }
  // Check if user exists (by username or email)
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
  // Create user with plain-text password
  const user = await prisma.user.create({
    data: { username, email, password },
  });
  // Set session cookie (insecure, just user id)
  const res = NextResponse.json({
    user: { id: user.id, username: user.username, email: user.email },
  });
  res.cookies.set("session", user.id, { path: "/" });
  return res;
}
