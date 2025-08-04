import { prisma } from "@/lib/prisma";
import type { User, Collection, Recipe, PaginatedResponse } from "@/types";
import bcrypt from "bcryptjs";

export interface CreateUserData {
  email: string;
  username?: string;
  name?: string;
  password: string;
  image?: string;
  bio?: string;
}

export interface UpdateUserData {
  username?: string;
  name?: string;
  image?: string;
  bio?: string;
}

export class UserModel {
  // Create a new user
  static async create(data: CreateUserData) {
    const { password, ...userData } = data;
    const hashedPassword = await bcrypt.hash(password, 12);

    return await prisma.user.create({
      data: {
        ...userData,
        // Note: In a real app, you'd handle password separately with NextAuth
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Find user by email
  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Find user by ID
  static async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            recipes: true,
            favorites: true,
            collections: true,
          },
        },
      },
    });
  }

  // Update user profile
  static async update(id: string, data: UpdateUserData) {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Get user's favorite recipes
  static async getFavorites(
    userId: string,
    page: number = 1,
    limit: number = 12
  ) {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          recipe: {
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
          },
        },
      }),
      prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      recipes: favorites.map((fav: any) => fav.recipe),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get user's collections
  static async getCollections(userId: string) {
    return await prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            recipe: {
              select: {
                id: true,
                title: true,
                imageUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
  }

  // Get recently viewed recipes
  static async getRecentlyViewed(userId: string, limit: number = 10) {
    const recentViews = await prisma.recentView.findMany({
      where: { userId },
      take: limit,
      orderBy: { viewedAt: "desc" },
      include: {
        recipe: {
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
        },
      },
    });

    return recentViews.map((view: any) => view.recipe);
  }

  // Add recipe to favorites
  static async addToFavorites(userId: string, recipeId: string) {
    return await prisma.favorite.create({
      data: {
        userId,
        recipeId,
      },
    });
  }

  // Remove recipe from favorites
  static async removeFromFavorites(userId: string, recipeId: string) {
    return await prisma.favorite.delete({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });
  }

  // Check if recipe is favorited by user
  static async isFavorited(userId: string, recipeId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });
    return !!favorite;
  }

  // Create a new collection
  static async createCollection(
    userId: string,
    data: { name: string; description?: string; isPublic?: boolean }
  ) {
    return await prisma.collection.create({
      data: {
        ...data,
        userId,
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });
  }

  // Add recipe to collection
  static async addToCollection(
    userId: string,
    collectionId: string,
    recipeId: string
  ) {
    // Verify collection belongs to user
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      throw new Error("Collection not found or access denied");
    }

    return await prisma.collectionItem.create({
      data: {
        collectionId,
        recipeId,
      },
    });
  }

  // Remove recipe from collection
  static async removeFromCollection(
    userId: string,
    collectionId: string,
    recipeId: string
  ) {
    // Verify collection belongs to user
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
    });

    if (!collection) {
      throw new Error("Collection not found or access denied");
    }

    return await prisma.collectionItem.delete({
      where: {
        collectionId_recipeId: {
          collectionId,
          recipeId,
        },
      },
    });
  }

  // Delete collection
  static async deleteCollection(userId: string, collectionId: string) {
    return await prisma.collection.delete({
      where: {
        id: collectionId,
        userId,
      },
    });
  }
}
