"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, TrendingUp } from "lucide-react";
import RecipeListView from "@/views/RecipeListView";
import TrendingRecipesView from "@/views/TrendingRecipesView";
import RecipeFormView from "@/views/RecipeFormView";
import type { RecipeWithDetails } from "@/types";

type ViewMode = "browse" | "trending" | "create";

export default function RecipesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<ViewMode>("browse");
  const [selectedRecipe, setSelectedRecipe] =
    useState<RecipeWithDetails | null>(null);

  const handleRecipeSelect = (recipe: RecipeWithDetails) => {
    setSelectedRecipe(recipe);
    // TODO: Navigate to recipe detail page or open modal
    console.log("Selected recipe:", recipe);
  };

  const handleRecipeSubmitted = (recipe: any) => {
    console.log("Recipe submitted:", recipe);
    // Switch back to browse view after successful submission
    setCurrentView("browse");
    // TODO: Show success message
  };

  // Sync view state with URL query param
  useEffect(() => {
    const v = (searchParams.get("view") as ViewMode) || "browse";
    if (v !== currentView) setCurrentView(v);
  }, [searchParams, currentView]);

  const setView = (v: ViewMode) => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    if (v === "browse") sp.delete("view");
    else sp.set("view", v);
    router.push(`/recipes${sp.size ? `?${sp}` : ""}`);
  };

  const renderView = () => {
    switch (currentView) {
      case "trending":
        return <TrendingRecipesView onRecipeSelect={handleRecipeSelect} />;
      case "create":
        return (
          <RecipeFormView
            onRecipeSubmitted={handleRecipeSubmitted}
            onCancel={() => setCurrentView("browse")}
          />
        );
      case "browse":
      default:
        return <RecipeListView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>

              {/* View Toggle */}
              <nav className="flex space-x-1">
                <button
                  onClick={() => setView("browse")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === "browse"
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Browse All
                </button>
                <button
                  onClick={() => setView("trending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${
                    currentView === "trending"
                      ? "bg-orange-100 text-orange-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending</span>
                </button>
              </nav>
            </div>

            {/* Create Recipe Button */}
            <button
              onClick={() => setView("create")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === "create"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create Recipe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderView()}
    </div>
  );
}
