"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Star } from "lucide-react";
import type { RecipeWithDetails } from "@/types";
import Link from "next/link";

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params?.id as string;
  const [recipe, setRecipe] = useState<RecipeWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  // recent views tracking disabled for now

  useEffect(() => {
    async function fetchRecipe() {
      setLoading(true);
      const res = await fetch(`/api/recipes/${recipeId}`);
      const data = await res.json();
      if (data.success) setRecipe(data.data);
      setLoading(false);
    }
    if (recipeId) fetchRecipe();
  }, [recipeId]);

  // Track recent view (if logged in) via API
  useEffect(() => {
    if (recipeId) {
      fetch(`/api/recipes/${recipeId}/recent-view`, { method: "POST" }).catch(
        () => {}
      );
    }
  }, [recipeId]);

  // Reviews are view-only on this page; submissions happen on /reviews

  if (loading)
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-600">
        Loading recipe...
      </div>
    );
  if (!recipe)
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-600">
        Recipe not found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-4 text-orange-600 hover:underline"
      >
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-2 text-gray-900">{recipe.title}</h1>
      {recipe.imageUrl ? (
        <img
          src={recipe.imageUrl || ""}
          alt={recipe.title}
          className="w-full max-w-lg rounded-xl mb-4"
        />
      ) : (
        <div className="w-full max-w-lg h-64 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl mb-4 flex items-center justify-center text-white text-2xl font-semibold">
          {recipe.title.charAt(0)}
        </div>
      )}
      <p className="mb-4 text-gray-600">{recipe.description}</p>
      <div className="mb-6 text-sm text-gray-600">
        <span className="font-medium text-gray-700">Cuisine:</span>{" "}
        {recipe.cuisine}
        <span className="mx-2">|</span>
        <span className="font-medium text-gray-700">Category:</span>{" "}
        {recipe.category}
      </div>
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Instructions
        </h2>
        <ol className="list-decimal list-inside space-y-1 text-gray-700">
          {recipe.instructions?.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">
          Ingredients
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          {recipe.ingredients?.map((ing, i) => (
            <li key={i}>
              {ing.amount} {ing.unit} {ing.name}
            </li>
          ))}
        </ul>
        <Link
          href="/ingredients-builder"
          className="inline-block mt-3 text-orange-600 hover:underline text-sm"
        >
          Add to Ingredient List Builder
        </Link>
      </div>
      {recipe.nutritionInfo && (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Nutrition
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-gray-500">Calories</div>
              <div className="font-semibold">
                {recipe.nutritionInfo.calories ?? "-"} kcal
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-gray-500">Protein</div>
              <div className="font-semibold">
                {recipe.nutritionInfo.protein ?? "-"} g
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-gray-500">Fat</div>
              <div className="font-semibold">
                {recipe.nutritionInfo.fat ?? "-"} g
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <div className="text-gray-500">Carbs</div>
              <div className="font-semibold">
                {recipe.nutritionInfo.carbs ?? "-"} g
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Ratings & Reviews
          </h2>
          <Link
            href={`/reviews?recipeId=${recipe.id}`}
            className="text-sm text-orange-600 hover:underline"
          >
            Write a review
          </Link>
        </div>
        <div className="space-y-4">
          {recipe.ratings && recipe.ratings.length > 0 ? (
            recipe.ratings.map((r, i) => (
              <div key={i} className="border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`w-4 h-4 ${
                        r.rating >= n
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">
                    {r.user?.username || "User"}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mt-1">{r.review}</div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm">No reviews yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
