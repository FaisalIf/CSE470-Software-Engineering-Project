import { RecipeController } from '@/controllers/RecipeController';

export async function GET(request: Request) {
  return RecipeController.getRecipes(request as any);
}

export async function POST(request: Request) {
  return RecipeController.createRecipe(request as any);
}
