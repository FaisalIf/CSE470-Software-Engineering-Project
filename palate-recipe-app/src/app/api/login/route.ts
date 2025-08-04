import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Insecure login: checks plain-text password
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password required" },
      { status: 400 }
    );
  }
  // Find user by username
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, username: true, password: true },
  });
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  // Set session cookie (insecure, just user id)
  const res = NextResponse.json({
    user: { id: user.id, username: user.username },
  });
  res.cookies.set("session", user.id, { path: "/" });
  return res;
}
