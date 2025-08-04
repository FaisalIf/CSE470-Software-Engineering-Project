import { NextRequest, NextResponse } from "next/server";
import {
  RecipeModel,
  CreateRecipeData,
  UpdateRecipeData,
} from "@/models/Recipe";
import type { SearchRecipesRequest } from "@/types";

export class RecipeController {
  // GET /api/recipes - Get all recipes with search and pagination
  static async getRecipes(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);

      const options: SearchRecipesRequest = {
        page: parseInt(searchParams.get("page") || "1"),
        limit: parseInt(searchParams.get("limit") || "12"),
        search: searchParams.get("search") || undefined,
        category: searchParams.get("category") || undefined,
        cuisine: searchParams.get("cuisine") || undefined,
        difficulty: searchParams.get("difficulty") || undefined,
        sortBy:
          (searchParams.get("sortBy") as "recent" | "popular" | "rating") ||
          "recent",
      };

      const result = await RecipeModel.findMany(options);

      return NextResponse.json({
        success: true,
        data: result.recipes,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch recipes" },
        { status: 500 }
      );
    }
  }

  // GET /api/recipes/[id] - Get single recipe
  static async getRecipe(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const userId = request.headers.get("x-user-id"); // From auth middleware
      const recipe = await RecipeModel.findById(params.id, userId || undefined);

      if (!recipe) {
        return NextResponse.json(
          { success: false, error: "Recipe not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      console.error("Error fetching recipe:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch recipe" },
        { status: 500 }
      );
    }
  }

  // POST /api/recipes - Create new recipe
  static async createRecipe(request: NextRequest) {
    try {
      // Get userId from session cookie
      const cookieHeader = request.headers.get("cookie");
      let userId = null;
      if (cookieHeader) {
        const match = cookieHeader.match(/session=([^;]+)/);
        if (match) userId = match[1];
      }
      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }

      const body = await request.json();
      const recipeData: CreateRecipeData = {
        ...body,
        authorId: userId,
      };

      const recipe = await RecipeModel.create(recipeData);

      return NextResponse.json(
        {
          success: true,
          data: recipe,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating recipe:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create recipe" },
        { status: 500 }
      );
    }
  }

  // PUT /api/recipes/[id] - Update recipe
  static async updateRecipe(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const userId = request.headers.get("x-user-id");
      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }

      const body = await request.json();
      const updateData: UpdateRecipeData = {
        ...body,
        id: params.id,
      };

      const recipe = await RecipeModel.update(updateData);

      return NextResponse.json({
        success: true,
        data: recipe,
      });
    } catch (error) {
      console.error("Error updating recipe:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update recipe" },
        { status: 500 }
      );
    }
  }

  // DELETE /api/recipes/[id] - Delete recipe
  static async deleteRecipe(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const userId = request.headers.get("x-user-id");
      if (!userId) {
        return NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        );
      }

      await RecipeModel.delete(params.id, userId);

      return NextResponse.json({
        success: true,
        message: "Recipe deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      return NextResponse.json(
        { success: false, error: "Failed to delete recipe" },
        { status: 500 }
      );
    }
  }

  // GET /api/recipes/trending - Get trending recipes
  static async getTrendingRecipes(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get("limit") || "6");

      const recipes = await RecipeModel.getTrending(limit);

      return NextResponse.json({
        success: true,
        data: recipes,
      });
    } catch (error) {
      console.error("Error fetching trending recipes:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch trending recipes" },
        { status: 500 }
      );
    }
  }

  // POST /api/recipes/[id]/scale - Scale recipe servings
  static async scaleRecipe(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const body = await request.json();
      const { servings } = body;

      if (!servings || servings <= 0) {
        return NextResponse.json(
          { success: false, error: "Valid servings number required" },
          { status: 400 }
        );
      }

      const scaledRecipe = await RecipeModel.scaleRecipe(params.id, servings);

      if (!scaledRecipe) {
        return NextResponse.json(
          { success: false, error: "Recipe not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: scaledRecipe,
      });
    } catch (error) {
      console.error("Error scaling recipe:", error);
      return NextResponse.json(
        { success: false, error: "Failed to scale recipe" },
        { status: 500 }
      );
    }
  }

  // GET /api/users/[id]/recipes - Get recipes by author
  static async getRecipesByAuthor(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "12");

      const result = await RecipeModel.findByAuthor(params.id, page, limit);

      return NextResponse.json({
        success: true,
        data: result.recipes,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error fetching recipes by author:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch recipes" },
        { status: 500 }
      );
    }
  }
}
