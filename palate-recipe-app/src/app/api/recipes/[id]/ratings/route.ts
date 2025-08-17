import { NextRequest, NextResponse } from "next/server";
import { RatingModel } from "@/models/Rating";

// GET /api/recipes/[id]/ratings - list ratings for a recipe
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recipeId } = await ctx.params;
    const result = await RatingModel.getRecipeRatings(recipeId, 1, 50);
    return NextResponse.json(result);
  } catch (e) {
    console.error("GET ratings error", e);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 }
    );
  }
}

// POST /api/recipes/[id]/ratings - create rating/review for a recipe
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recipeId } = await ctx.params;
    // Get userId from insecure session cookie (set by /api/login)
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)session=([^;]+)/);
    const userId = match ? decodeURIComponent(match[1]) : null;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const rating = Number(body.rating);
    const review = typeof body.review === "string" ? body.review : null;

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be 1-5" },
        { status: 400 }
      );
    }
    const created = await RatingModel.upsertRating(userId, recipeId, {
      rating,
      review,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error("POST ratings error", e);
    return NextResponse.json(
      { error: "Failed to create rating" },
      { status: 500 }
    );
  }
}
