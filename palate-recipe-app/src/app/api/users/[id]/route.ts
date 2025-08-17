import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/User";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await UserModel.getPublicProfile(id);
  if (!data)
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  return NextResponse.json({ success: true, data });
}
