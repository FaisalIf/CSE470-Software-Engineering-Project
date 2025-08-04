import { RecipeController } from '@/controllers/RecipeController';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return RecipeController.getRecipe(request as any, { params });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return RecipeController.updateRecipe(request as any, { params });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return RecipeController.deleteRecipe(request as any, { params });
}
