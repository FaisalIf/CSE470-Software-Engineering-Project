import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserIdFromCookie(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: recipeId } = await ctx.params;
    const favorite = await prisma.favorite.create({
      data: { userId, recipeId },
    });
    return NextResponse.json(
      { success: true, data: favorite },
      { status: 201 }
    );
  } catch (e: any) {
    if (e?.code === "P2002") {
      // unique constraint; already favorited
      return NextResponse.json(
        { success: true, already: true },
        { status: 200 }
      );
    }
    console.error("favorite POST error", e);
    return NextResponse.json({ error: "Failed to favorite" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id: recipeId } = await ctx.params;
    await prisma.favorite.deleteMany({ where: { userId, recipeId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("favorite DELETE error", e);
    return NextResponse.json(
      { error: "Failed to unfavorite" },
      { status: 500 }
    );
  }
}
