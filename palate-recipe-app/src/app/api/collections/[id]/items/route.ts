import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserIdFromCookie(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const collectionId = params.id;
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
