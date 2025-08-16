"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Clock,
  Users,
  Star,
  BookmarkPlus,
  Layers,
} from "lucide-react";
import type { RecipeWithDetails } from "@/types";
import { triggerToast } from "@/components/Toaster";

interface TrendingRecipesViewProps {
  onRecipeSelect?: (recipe: RecipeWithDetails) => void;
}

export default function TrendingRecipesView({
  onRecipeSelect,
}: TrendingRecipesViewProps) {
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecipeWithDetails[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [collections, setCollections] = useState<
    { id: string; name: string }[]
  >([]);
  const [openFor, setOpenFor] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7d");

  const fetchTrendingRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/recipes/trending?timeframe=${timeframe}&limit=12`
      );
      const data = await response.json();

      if (data.success) {
        setRecipes(data.data);
      }
    } catch (error) {
      console.error("Error fetching trending recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingRecipes();
  }, [timeframe]);

  useEffect(() => {
    // prefetch user's collections for add-to-collection action
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

  const getAverageRating = (recipe: RecipeWithDetails) => {
    if (!recipe.ratings || recipe.ratings.length === 0) return 0;
    const sum = recipe.ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return sum / recipe.ratings.length;
  };

  const getTrendingScore = (recipe: RecipeWithDetails) => {
    // Simple trending score based on ratings, favorites, and recency
    const avgRating = getAverageRating(recipe);
    const ratingCount = recipe._count?.ratings || 0;
    const favoriteCount = recipe._count?.favorites || 0;
    const daysSinceCreated = Math.max(
      1,
      Math.floor(
        (Date.now() - new Date(recipe.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    return (
      Math.round(
        ((avgRating * ratingCount + favoriteCount * 2) / daysSinceCreated) * 10
      ) / 10
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Trending Recipes
            </h1>
            <p className="text-gray-600">Most popular recipes right now</p>
          </div>
        </div>

        {/* Timeframe Filter */}
        <div className="flex space-x-2">
          {[
            { value: "7d", label: "7 Days" },
            { value: "30d", label: "30 Days" },
            { value: "90d", label: "90 Days" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTimeframe(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeframe === option.value
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-2 text-gray-600">Loading trending recipes...</p>
        </div>
      )}

      {/* Trending Recipes Grid */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group relative"
              >
                {/* Trending Badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center space-x-1 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>#{index + 1}</span>
                </div>

                {/* Trending Score */}
                <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-orange-600">
                  🔥 {getTrendingScore(recipe)}
                </div>

                {/* Recipe Image */}
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="aspect-w-16 aspect-h-9 bg-gray-200 relative overflow-hidden block rounded-t-xl"
                >
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {recipe.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Recipe Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    <Link href={`/recipes/${recipe.id}`}>{recipe.title}</Link>
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Recipe Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{recipe.prepTime + recipe.cookTime}m</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{recipe.servings}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
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

                  {/* Author and Rating */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {(recipe.author.name || recipe.author.username)
                            ?.charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 truncate max-w-20">
                        {recipe.author.name || recipe.author.username}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {getAverageRating(recipe).toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({recipe._count?.ratings || 0})
                      </span>
                    </div>
                  </div>

                  {/* Trending Metrics */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      <span>{recipe._count?.favorites || 0} favorites</span>
                      <span className="ml-3">
                        {recipe._count?.ratings || 0} ratings
                      </span>
                    </div>
                    {/* Actions below metrics */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setBusyId(recipe.id);
                          try {
                            // Try to create; if already exists, server returns {already:true}
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
                                triggerToast({
                                  title: "Removed from bookmarks",
                                });
                              } else {
                                setFavoriteIds((prev) =>
                                  new Set(prev).add(recipe.id)
                                );
                                triggerToast({ title: "Added to bookmarks" });
                              }
                            } else {
                              // fallback to delete
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
                        title="Toggle bookmark"
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
                            e.stopPropagation();
                            setOpenFor((id) =>
                              id === recipe.id ? null : recipe.id
                            );
                          }}
                          className="px-3 py-1 rounded bg-white border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 flex items-center gap-1"
                          title="Add to collection"
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
                                      e.stopPropagation();
                                      setBusyId(recipe.id);
                                      try {
                                        await fetch(
                                          `/api/collections/${c.id}/items`,
                                          {
                                            method: "POST",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
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
                                  e.stopPropagation();
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
              </div>
            ))}
          </div>

          {/* Empty State */}
          {recipes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <TrendingUp className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No trending recipes yet
              </h3>
              <p className="text-gray-600">
                Check back later to see what's popular in the community!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
