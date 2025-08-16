import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserIdFromCookie(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const collection = await prisma.collection.create({
      data: {
        name: body.name,
        description: body.description ?? null,
        isPublic: !!body.isPublic,
        userId,
      },
    });
    return NextResponse.json(
      { success: true, data: collection },
      { status: 201 }
    );
  } catch (e) {
    console.error("collections POST error", e);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ data: [] }, { status: 200 });
    const collections = await prisma.collection.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true },
    });
    return NextResponse.json({ data: collections }, { status: 200 });
  } catch (e) {
    console.error("collections GET error", e);
    return NextResponse.json(
      { error: "Failed to list collections" },
      { status: 500 }
    );
  }
}
