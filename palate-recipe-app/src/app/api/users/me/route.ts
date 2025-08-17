import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/User";

function getUserId(req: NextRequest) {
  // Insecure cookie-based auth for demo purposes
  const cookie = req.cookies.get("session");
  return cookie?.value || null;
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await UserModel.findById(userId);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: user });
}

export async function PUT(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { username, name, image, bio } = body || {};
    const updated = await UserModel.update(userId, {
      username: typeof username === "string" ? username : undefined,
      name: typeof name === "string" ? name : undefined,
      image: typeof image === "string" ? image : undefined,
      bio: typeof bio === "string" ? bio : undefined,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    console.error("PUT /api/users/me error", e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
