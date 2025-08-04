import { RecipeController } from '@/controllers/RecipeController';

export async function GET(request: Request) {
  return RecipeController.getTrendingRecipes(request as any);
}
