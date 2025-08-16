import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserIdFromCookie(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ data: [] });
    const favs = await prisma.favorite.findMany({
      where: { userId },
      select: { recipeId: true },
    });
    return NextResponse.json({ data: favs.map((f) => f.recipeId) });
  } catch (e) {
    console.error("favorites GET error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
