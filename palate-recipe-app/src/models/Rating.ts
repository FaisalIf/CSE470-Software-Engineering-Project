import { prisma } from "@/lib/prisma";
import type { Rating, RateRecipeRequest } from "@/types";

export class RatingModel {
  // Create or update a rating
  static async upsertRating(
    userId: string,
    recipeId: string,
    data: RateRecipeRequest
  ) {
    return await prisma.rating.upsert({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
      update: {
        rating: data.rating,
        review: data.review,
      },
      create: {
        userId,
        recipeId,
        rating: data.rating,
        review: data.review,
      },
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
    });
  }

  // Get all ratings for a recipe
  static async getRecipeRatings(
    recipeId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { recipeId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.rating.count({ where: { recipeId } }),
    ]);

    return {
      ratings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get user's rating for a specific recipe
  static async getUserRating(userId: string, recipeId: string) {
    return await prisma.rating.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
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
    });
  }

  // Delete a rating
  static async deleteRating(userId: string, recipeId: string) {
    return await prisma.rating.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });
  }

  // Get average rating for a recipe
  static async getAverageRating(recipeId: string) {
    const result = await prisma.rating.aggregate({
      where: { recipeId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    return {
      average: result._avg.rating || 0,
      count: result._count.rating,
    };
  }

  // Get ratings by user
  static async getUserRatings(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          recipe: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
              author: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.rating.count({ where: { userId } }),
    ]);

    return {
      ratings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
