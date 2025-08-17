import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/models/User";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await UserModel.getPublicProfile(params.id);
  if (!data)
    return NextResponse.json(
      { success: false, error: "Not found" },
      { status: 404 }
    );
  return NextResponse.json({ success: true, data });
}
