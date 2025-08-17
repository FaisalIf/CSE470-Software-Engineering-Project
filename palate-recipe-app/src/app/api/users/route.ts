import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/User";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const cursor = searchParams.get("cursor") || undefined;
  const data = await UserModel.listPublic(
    Math.min(Math.max(limit, 1), 50),
    cursor
  );
  return NextResponse.json({ success: true, data });
}
