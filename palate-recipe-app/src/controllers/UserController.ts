import { NextRequest, NextResponse } from 'next/server';
import { UserModel, CreateUserData, UpdateUserData } from '@/models/User';

export class UserController {
  // GET /api/users/[id] - Get user profile
  static async getUser(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const user = await UserModel.findById(params.id);
      
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user' },
        { status: 500 }
      );
    }
  }

  // PUT /api/users/[id] - Update user profile
  static async updateUser(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = request.headers.get('x-user-id');
      if (!userId || userId !== params.id) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const updateData: UpdateUserData = body;

      const user = await UserModel.update(params.id, updateData);
      
      return NextResponse.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update user' },
        { status: 500 }
      );
    }
  }

  // GET /api/users/[id]/favorites - Get user's favorite recipes
  static async getFavorites(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = request.headers.get('x-user-id');
      if (!userId || userId !== params.id) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '12');
      
      const result = await UserModel.getFavorites(params.id, page, limit);
      
      return NextResponse.json({
        success: true,
        data: result.recipes,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch favorites' },
        { status: 500 }
      );
    }
  }

  // POST /api/users/[id]/favorites - Add recipe to favorites
  static async addToFavorites(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = request.headers.get('x-user-id');
      if (!userId || userId !== params.id) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const { recipeId } = body;

      if (!recipeId) {
        return NextResponse.json(
          { success: false, error: 'Recipe ID required' },
          { status: 400 }
        );
      }

      await UserModel.addToFavorites(params.id, recipeId);
      
      return NextResponse.json({
        success: true,
        message: 'Recipe added to favorites'
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to add to favorites' },
        { status: 500 }
      );
    }
  }

  // DELETE /api/users/[id]/favorites/[recipeId] - Remove from favorites
  static async removeFromFavorites(request: NextRequest, { params }: { params: { id: string; recipeId: string } }) {
    try {
      const userId = request.headers.get('x-user-id');
      if (!userId || userId !== params.id) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      await UserModel.removeFromFavorites(params.id, params.recipeId);
      
      return NextResponse.json({
        success: true,
        message: 'Recipe removed from favorites'
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to remove from favorites' },
        { status: 500 }
      );
    }
  }

  // GET /api/users/[id]/collections - Get user's collections
  static async getCollections(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = request.headers.get('x-user-id');
      if (!userId || userId !== params.id) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      const collections = await UserModel.getCollections(params.id);
      
      return NextResponse.json({
        success: true,
        data: collections
      });
    } catch (error) {
      console.error('Error fetching collections:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch collections' },
        { status: 500 }
      );
    }
  }

  // POST /api/users/[id]/collections - Create new collection
  static async createCollection(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = request.headers.get('x-user-id');
      if (!userId || userId !== params.id) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const { name, description, isPublic } = body;

      if (!name) {
        return NextResponse.json(
          { success: false, error: 'Collection name required' },
          { status: 400 }
        );
      }

      const collection = await UserModel.createCollection(params.id, {
        name,
        description,
        isPublic
      });
      
      return NextResponse.json({
        success: true,
        data: collection
      }, { status: 201 });
    } catch (error) {
      console.error('Error creating collection:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create collection' },
        { status: 500 }
      );
    }
  }

  // GET /api/users/[id]/recent-views - Get recently viewed recipes
  static async getRecentlyViewed(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = request.headers.get('x-user-id');
      if (!userId || userId !== params.id) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }

      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '10');
      
      const recipes = await UserModel.getRecentlyViewed(params.id, limit);
      
      return NextResponse.json({
        success: true,
        data: recipes
      });
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch recently viewed recipes' },
        { status: 500 }
      );
    }
  }

  // POST /api/collections/[id]/recipes - Add recipe to collection
  static async addToCollection(request: NextRequest, { params }: { params: { id: string } }) {
    try {
      const userId = request.headers.get('x-user-id');
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const body = await request.json();
      const { recipeId } = body;

      if (!recipeId) {
        return NextResponse.json(
          { success: false, error: 'Recipe ID required' },
          { status: 400 }
        );
      }

      await UserModel.addToCollection(userId, params.id, recipeId);
      
      return NextResponse.json({
        success: true,
        message: 'Recipe added to collection'
      });
    } catch (error) {
      console.error('Error adding to collection:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to add to collection' },
        { status: 500 }
      );
    }
  }

  // DELETE /api/collections/[id]/recipes/[recipeId] - Remove from collection
  static async removeFromCollection(request: NextRequest, { params }: { params: { id: string; recipeId: string } }) {
    try {
      const userId = request.headers.get('x-user-id');
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }

      await UserModel.removeFromCollection(userId, params.id, params.recipeId);
      
      return NextResponse.json({
        success: true,
        message: 'Recipe removed from collection'
      });
    } catch (error) {
      console.error('Error removing from collection:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to remove from collection' },
        { status: 500 }
      );
    }
  }
}
