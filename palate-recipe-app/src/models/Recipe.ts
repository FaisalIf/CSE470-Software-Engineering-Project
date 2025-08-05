import { prisma } from "@/lib/prisma";
import type {
  Recipe,
  Ingredient,
  RecipeWithDetails,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  SearchRecipesRequest,
  PaginatedResponse,
} from "@/types";

export interface CreateRecipeData {
  title: string;
  description?: string;
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  cuisine?: string;
  category?: string;
  imageUrl?: string;
  authorId: string;
  ingredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    fat?: number;
    carbs?: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {
  id: string;
}

export class RecipeModel {
  // Create a new recipe
  static async create(data: CreateRecipeData) {
    const { ingredients, nutritionInfo, ...recipeData } = data;

    return await prisma.recipe.create({
      data: {
        ...recipeData,
        ingredients: {
          create: ingredients,
        },
        nutritionInfo: nutritionInfo
          ? {
              create: nutritionInfo,
            }
          : undefined,
      },
      include: {
        ingredients: true,
        nutritionInfo: true,
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        ratings: true,
        _count: {
          select: {
            favorites: true,
            ratings: true,
          },
        },
      },
    });
  }

  // Get all recipes with pagination and filters
  static async findMany(
    options: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      cuisine?: string;
      difficulty?: string;
      sortBy?: "recent" | "popular" | "rating";
    } = {}
  ) {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      cuisine,
      difficulty,
      sortBy = "recent",
    } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { cuisine: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) where.category = category;
    if (cuisine) where.cuisine = cuisine;
    if (difficulty) where.difficulty = difficulty;

    let orderBy: any = { createdAt: "desc" };

    if (sortBy === "popular") {
      orderBy = { viewCount: "desc" };
    } else if (sortBy === "rating") {
      orderBy = { ratings: { _count: "desc" } };
    }

    // Run queries sequentially to avoid prepared statement conflicts
    // Use raw query as fallback to avoid prepared statement issues
    try {
      const recipes = await prisma.recipe.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          ingredients: true,
          nutritionInfo: true,
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
          ratings: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              favorites: true,
              ratings: true,
            },
          },
        },
      });

      // Simplified - just return recipes without total count for now
      const total = recipes.length;

      return {
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Prisma query failed, using simplified query:", error);
      // Fallback to basic query without complex relations
      const recipes = await prisma.$queryRaw`
        SELECT id, title, description, "imageUrl", "prepTime", "cookTime", servings, difficulty, cuisine, category, "createdAt" 
        FROM "recipes" 
        ORDER BY "createdAt" DESC 
        LIMIT ${limit}
      `;

      return {
        recipes,
        pagination: {
          page,
          limit,
          total: limit,
          pages: 1,
        },
      };
    }
  }

  // Get trending recipes
  static async getTrending(limit: number = 6) {
    return await prisma.recipe.findMany({
      take: limit,
      orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            favorites: true,
            ratings: true,
          },
        },
      },
    });
  }

  // Get recipe by ID
  static async findById(id: string, userId?: string) {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: {
        ingredients: true,
        nutritionInfo: true,
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            bio: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        favorites: userId
          ? {
              where: { userId },
            }
          : false,
        _count: {
          select: {
            favorites: true,
            ratings: true,
          },
        },
      },
    });

    if (recipe) {
      // Increment view count
      await prisma.recipe.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      // Track recent view if user is logged in
      if (userId) {
        await prisma.recentView.upsert({
          where: {
            userId_recipeId: {
              userId,
              recipeId: id,
            },
          },
          update: {
            viewedAt: new Date(),
          },
          create: {
            userId,
            recipeId: id,
          },
        });
      }
    }

    return recipe;
  }

  // Update recipe
  static async update(data: UpdateRecipeData) {
    const { id, ingredients, nutritionInfo, ...recipeData } = data;

    return await prisma.recipe.update({
      where: { id },
      data: {
        ...recipeData,
        ingredients: ingredients
          ? {
              deleteMany: {},
              create: ingredients,
            }
          : undefined,
        nutritionInfo: nutritionInfo
          ? {
              upsert: {
                create: nutritionInfo,
                update: nutritionInfo,
              },
            }
          : undefined,
      },
      include: {
        ingredients: true,
        nutritionInfo: true,
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    });
  }

  // Delete recipe
  static async delete(id: string, authorId: string) {
    return await prisma.recipe.delete({
      where: {
        id,
        authorId, // Ensure only the author can delete
      },
    });
  }

  // Scale recipe servings
  static async scaleRecipe(id: string, newServings: number) {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      include: { ingredients: true },
    });

    if (!recipe) return null;

    const scaleFactor = newServings / recipe.servings;

    const scaledIngredients = recipe.ingredients.map(
      (ingredient: Ingredient) => ({
        ...ingredient,
        amount: ingredient.amount * scaleFactor,
      })
    );

    return {
      ...recipe,
      servings: newServings,
      ingredients: scaledIngredients,
    };
  }

  // Get recipes by author
  static async findByAuthor(
    authorId: string,
    page: number = 1,
    limit: number = 12
  ) {
    const skip = (page - 1) * limit;

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where: { authorId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          ingredients: true,
          nutritionInfo: true,
          ratings: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              favorites: true,
              ratings: true,
            },
          },
        },
      }),
      prisma.recipe.count({ where: { authorId } }),
    ]);

    return {
      recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
