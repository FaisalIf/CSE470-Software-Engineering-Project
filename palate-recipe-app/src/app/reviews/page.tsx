"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import type { RecipeWithDetails } from "@/types";

export default function ReviewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectId = searchParams.get("recipeId") || "";

  const [recipes, setRecipes] = useState<
    Pick<RecipeWithDetails, "id" | "title">[]
  >([]);
  const [selectedId, setSelectedId] = useState<string>(preselectId);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/recipes?page=1&limit=200&sortBy=recent");
        const data = await res.json();
        if (data.success) {
          setRecipes(data.data.map((r: any) => ({ id: r.id, title: r.title })));
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const canSubmit = useMemo(
    () => !!selectedId && rating > 0 && review.trim().length > 0 && !submitting,
    [selectedId, rating, review, submitting]
  );

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/recipes/${selectedId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Failed with ${res.status}`);
      }
      setSuccess("Review submitted!");
      setRating(0);
      setHover(0);
      setReview("");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Submit a Review</h1>
        <Link href="/recipes" className="text-orange-600 hover:underline">
          Browse Recipes
        </Link>
      </div>

      <form
        onSubmit={submitReview}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Select Recipe
          </span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-800"
            required
          >
            <option value="" disabled>
              Choose a recipe
            </option>
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </label>

        <div className="mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-2">
            Your Rating
          </span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="p-1"
                aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
              >
                <Star
                  className={`w-6 h-6 ${
                    (hover || rating) >= n
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {rating ? `${rating} / 5` : "Select rating"}
            </span>
          </div>
        </div>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Your Review
          </span>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-gray-800"
            placeholder="Share your thoughts..."
            required
          />
        </label>

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm mb-2">{success}</div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 hover:bg-orange-600"
          >
            Submit Review
          </button>
          {selectedId && (
            <Link
              href={`/recipes/${selectedId}`}
              className="text-sm text-orange-600 hover:underline"
            >
              View recipe
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
