// Database types based on Prisma schema
export interface User {
  id: string;
  email: string;
  username?: string | null;
  name?: string | null;
  image?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string | null;
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  cuisine?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  authorId: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  recipeId: string;
}

export interface Rating {
  id: string;
  rating: number;
  review?: string | null;
  createdAt: Date;
  userId: string;
  recipeId: string;
}

export interface Favorite {
  id: string;
  createdAt: Date;
  userId: string;
  recipeId: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string | null;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface CollectionItem {
  id: string;
  addedAt: Date;
  collectionId: string;
  recipeId: string;
}

export interface NutritionInfo {
  id: string;
  calories?: number | null;
  protein?: number | null;
  fat?: number | null;
  carbs?: number | null;
  fiber?: number | null;
  sugar?: number | null;
  sodium?: number | null;
  recipeId: string;
}

export interface RecentView {
  id: string;
  viewedAt: Date;
  userId: string;
  recipeId: string;
}

// Extended types with relations
export interface RecipeWithDetails extends Recipe {
  ingredients: Ingredient[];
  nutritionInfo?: NutritionInfo | null;
  author: Pick<User, 'id' | 'username' | 'name' | 'image'>;
  ratings: Rating[];
  favorites?: Favorite[];
  _count: {
    favorites: number;
    ratings: number;
  };
}

export interface UserWithRecipes extends User {
  recipes: Recipe[];
  ratings: Rating[];
  favorites: Favorite[];
  collections: Collection[];
}

// API Response types
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Request/Response types for API
export interface CreateRecipeRequest {
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

export interface UpdateRecipeRequest extends Partial<CreateRecipeRequest> {
  id: string;
}

export interface SearchRecipesRequest {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  cuisine?: string;
  difficulty?: string;
  sortBy?: 'recent' | 'popular' | 'rating';
}

export interface RateRecipeRequest {
  rating: number;
  review?: string;
}

export interface CreateCollectionRequest {
  name: string;
  description?: string;
  isPublic?: boolean;
}

// Shopping list types
export interface ShoppingListItem {
  ingredient: string;
  amount: number;
  unit: string;
  recipes: string[]; // Recipe titles that require this ingredient
}

export interface ShoppingList {
  items: ShoppingListItem[];
  recipeCount: number;
  totalItems: number;
}
