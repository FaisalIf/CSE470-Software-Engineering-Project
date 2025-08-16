import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = params.id;
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
    const userId = match ? decodeURIComponent(match[1]) : null;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.recentView.upsert({
      where: { userId_recipeId: { userId, recipeId } },
      update: { viewedAt: new Date() },
      create: { userId, recipeId },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("recent-view error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
