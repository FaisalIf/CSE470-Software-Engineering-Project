import { RecipeController } from "@/controllers/RecipeController";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  return RecipeController.getRecipe(request as any, { params });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  return RecipeController.updateRecipe(request as any, { params });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  return RecipeController.deleteRecipe(request as any, { params });
}
