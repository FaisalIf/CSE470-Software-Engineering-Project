"use client";

import { useState, useEffect } from "react";
import { Search, Filter, TrendingUp, BookmarkPlus, Layers } from "lucide-react";
import type { RecipeWithDetails, SearchRecipesRequest } from "@/types";

import Link from "next/link";
import { triggerToast } from "@/components/Toaster";

interface RecipeListViewProps {
  initialRecipes?: RecipeWithDetails[];
  searchParams?: SearchRecipesRequest;
}

export default function RecipeListView({
  initialRecipes = [],
  searchParams = {},
}: RecipeListViewProps) {
  const [recipes, setRecipes] = useState<RecipeWithDetails[]>(initialRecipes);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.search || "");
  const [filters, setFilters] = useState({
    category: searchParams.category || "",
    cuisine: searchParams.cuisine || "",
    difficulty: searchParams.difficulty || "",
    sortBy: searchParams.sortBy || "recent",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [collections, setCollections] = useState<
    { id: string; name: string }[]
  >([]);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // Fetch recipes based on current search/filter state
  const fetchRecipes = async (page: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(filters.category && { category: filters.category }),
        ...(filters.cuisine && { cuisine: filters.cuisine }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        sortBy: filters.sortBy,
      });

      const response = await fetch(`/api/recipes?${params}`);
      const data = await response.json();

      if (data.success) {
        console.log(
          "Fetched recipes:",
          data.data.map((r: any) => ({ title: r.title, imageUrl: r.imageUrl }))
        );
        setRecipes(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(1);
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters
  useEffect(() => {
    fetchRecipes(1);
  }, [filters]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/collections", { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.data)) {
            setCollections(
              data.data.map((c: any) => ({ id: c.id, name: c.name }))
            );
          }
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me/favorites");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.data)) {
            setFavoriteIds(new Set<string>(data.data));
          }
        }
      } catch {}
    })();
  }, []);

  // Calculate average rating
  const getAverageRating = (recipe: RecipeWithDetails) => {
    if (!recipe.ratings || recipe.ratings.length === 0) return 0;
    const sum = recipe.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / recipe.ratings.length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes, ingredients, cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-600"
            />
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-800"
          >
            <option value="">All Categories</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
            <option value="Snack">Snack</option>
          </select>

          <select
            value={filters.cuisine}
            onChange={(e) => handleFilterChange("cuisine", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-800"
          >
            <option value="">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Asian">Asian</option>
            <option value="American">American</option>
            <option value="Mediterranean">Mediterranean</option>
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange("difficulty", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-800"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) =>
              handleFilterChange("sortBy", e.target.value as any)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-800"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-2 text-gray-600">Loading recipes...</p>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Recipe Image */}
                <Link
                  href={`/recipes/${recipe.id}`}
                  prefetch={false}
                  className="aspect-w-16 aspect-h-9 bg-gray-200 block rounded-t-xl overflow-hidden"
                >
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        console.error(
                          `Failed to load image for ${recipe.title}:`,
                          recipe.imageUrl
                        );
                        // Hide the image and show placeholder instead
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const placeholder =
                          target.nextElementSibling as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = "flex";
                        }
                      }}
                      onLoad={() => {
                        console.log(
                          `Successfully loaded image for ${recipe.title}:`,
                          recipe.imageUrl
                        );
                      }}
                    />
                  ) : null}
                  {/* Always render placeholder, hide it if image loads successfully */}
                  <div
                    className="w-full h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center"
                    style={{ display: recipe.imageUrl ? "none" : "flex" }}
                  >
                    <span className="text-white text-lg font-medium">
                      {recipe.title.charAt(0)}
                    </span>
                  </div>
                </Link>

                {/* Recipe Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {recipe.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Recipe Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-4">
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                      <span>{recipe.servings} servings</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          recipe.difficulty === "Easy"
                            ? "bg-green-100 text-green-800"
                            : recipe.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {recipe.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Author and Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {recipe.author?.name ||
                          recipe.author?.username ||
                          "Author"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < Math.round(getAverageRating(recipe))
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({recipe._count.ratings})
                      </span>
                    </div>
                  </div>
                  {/* Action Row - new line under stats */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={async (e) => {
                        e.preventDefault();
                        setBusyId(recipe.id);
                        try {
                          const res = await fetch(
                            `/api/recipes/${recipe.id}/favorite`,
                            { method: "POST" }
                          );
                          if (res.ok) {
                            const body = await res
                              .json()
                              .catch(() => ({} as any));
                            if (body?.already) {
                              await fetch(
                                `/api/recipes/${recipe.id}/favorite`,
                                { method: "DELETE" }
                              );
                              setFavoriteIds((prev) => {
                                const next = new Set(prev);
                                next.delete(recipe.id);
                                return next;
                              });
                              triggerToast({ title: "Removed from bookmarks" });
                            } else {
                              setFavoriteIds((prev) =>
                                new Set(prev).add(recipe.id)
                              );
                              triggerToast({ title: "Added to bookmarks" });
                            }
                          } else {
                            await fetch(`/api/recipes/${recipe.id}/favorite`, {
                              method: "DELETE",
                            });
                            setFavoriteIds((prev) => {
                              const next = new Set(prev);
                              next.delete(recipe.id);
                              return next;
                            });
                            triggerToast({ title: "Removed from bookmarks" });
                          }
                        } finally {
                          setBusyId(null);
                        }
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                        favoriteIds.has(recipe.id)
                          ? "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                          : "bg-orange-500 text-white hover:bg-orange-600"
                      }`}
                      disabled={busyId === recipe.id}
                    >
                      {busyId === recipe.id ? (
                        <span>...</span>
                      ) : (
                        <>
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span>
                            {favoriteIds.has(recipe.id) ? "Remove" : "Add"}
                          </span>
                        </>
                      )}
                    </button>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenFor((id) =>
                            id === recipe.id ? null : recipe.id
                          );
                        }}
                        className="px-3 py-1 rounded bg-white border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 flex items-center gap-1"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Collection</span>
                      </button>
                      {openFor === recipe.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-visible">
                          <div className="py-1 max-h-60 overflow-auto">
                            {collections.length === 0 ? (
                              <div className="px-3 py-2 text-xs text-gray-500">
                                No collections
                              </div>
                            ) : (
                              collections.map((c) => (
                                <button
                                  key={c.id}
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    setBusyId(recipe.id);
                                    try {
                                      await fetch(
                                        `/api/collections/${c.id}/items`,
                                        {
                                          method: "POST",
                                          headers: {
                                            "Content-Type": "application/json",
                                          },
                                          body: JSON.stringify({
                                            recipeId: recipe.id,
                                          }),
                                        }
                                      );
                                      triggerToast({
                                        title: "Added to collection",
                                        description: c.name,
                                      });
                                    } finally {
                                      setBusyId(null);
                                      setOpenFor(null);
                                    }
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  {c.name}
                                </button>
                              ))
                            )}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                // open create in new tab to avoid link-in-link hydration issue
                                window.open("/collections/create", "_blank");
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-orange-600 hover:underline"
                            >
                              + New collection
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => fetchRecipes(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>

              <span className="px-4 py-2 text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                onClick={() => fetchRecipes(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Empty State */}
          {recipes.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No recipes found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find more recipes.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
