import { RecipeController } from "@/controllers/RecipeController";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  return RecipeController.scaleRecipe(request as any, { params });
}
