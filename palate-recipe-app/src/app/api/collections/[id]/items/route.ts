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
    const { id: collectionId } = await ctx.params;
    const body = await req.json();
    const recipeId = body?.recipeId as string;
    if (!recipeId)
      return NextResponse.json({ error: "recipeId required" }, { status: 400 });

    // Ensure ownership
    const coll = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });
    if (!coll)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const item = await prisma.collectionItem.create({
      data: { collectionId, recipeId },
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") {
      // unique constraint on (collectionId, recipeId)
      return NextResponse.json(
        { success: true, already: true },
        { status: 200 }
      );
    }
    console.error("collections items POST error", e);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
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
    const { id: collectionId } = await ctx.params;
    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get("recipeId");
    if (!recipeId)
      return NextResponse.json({ error: "recipeId required" }, { status: 400 });

    // Ensure ownership
    const coll = await prisma.collection.findFirst({
      where: { id: collectionId, userId },
    });
    if (!coll)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.collectionItem.deleteMany({
      where: { collectionId, recipeId },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("collections items DELETE error", e);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 }
    );
  }
}
