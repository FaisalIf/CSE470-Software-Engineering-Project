import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  const userId = match ? decodeURIComponent(match[1]) : null;
  if (!userId) return NextResponse.json({ data: [] });

  const items = await prisma.recentView.findMany({
    where: { userId },
    include: { recipe: { select: { id: true, title: true, imageUrl: true } } },
    orderBy: { viewedAt: "desc" },
    take: 10,
  });
  return NextResponse.json({ data: items });
}
