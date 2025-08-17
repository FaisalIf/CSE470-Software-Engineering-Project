import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getUserIdFromCookie(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserIdFromCookie(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await ctx.params;
    const body = await req.json();
    const { name, description, isPublic } = body ?? {};

    // Ensure ownership
    const coll = await prisma.collection.findFirst({ where: { id, userId } });
    if (!coll)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        name: typeof name === "string" ? name : undefined,
        description: typeof description === "string" ? description : undefined,
        isPublic: typeof isPublic === "boolean" ? Boolean(isPublic) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (e) {
    console.error("collections PATCH error", e);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}
