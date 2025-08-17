"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

type RecipeLite = { id: string; title: string };
type ShoppingListItem = {
  ingredient: string;
  amount: number;
  unit: string;
  recipes: string[];
};
type ShoppingList = {
  items: ShoppingListItem[];
  recipeCount: number;
  totalItems: number;
};

export default function IngredientsBuilderPage() {
  const [recipes, setRecipes] = useState<RecipeLite[]>([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);
  const [list, setList] = useState<ShoppingList>({
    items: [],
    recipeCount: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch("/api/recipes?withIngredients=1");
      const data = await res.json();
      if (data.success)
        setRecipes(data.data.map((r: any) => ({ id: r.id, title: r.title })));
    }
    fetchRecipes();
  }, []);

  useEffect(() => {
    async function buildList() {
      setLoading(true);
      try {
        const res = await fetch("/api/shopping-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeIds: selectedRecipeIds }),
        });
        const data = await res.json();
        if (data.success) setList(data.data);
      } finally {
        setLoading(false);
      }
    }
    buildList();
  }, [selectedRecipeIds]);

  function handleRecipeSelect(id: string) {
    setSelectedRecipeIds((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Ingredient List Builder
        </h1>
        <Link href="/recipes" className="text-orange-600 hover:underline">
          Browse Recipes
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <p className="mb-4 text-gray-600">
            Select recipes to build your shopping list:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-auto pr-2">
            {recipes.map((r) => (
              <label
                key={r.id}
                className="flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                <input
                  type="checkbox"
                  checked={selectedRecipeIds.includes(r.id)}
                  onChange={() => handleRecipeSelect(r.id)}
                />
                {r.title}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">Shopping List</h2>
          <ul className="list-disc list-inside text-gray-700 min-h-[2rem] space-y-1">
            {loading ? (
              <li className="text-gray-500">Building list…</li>
            ) : list.items.length === 0 ? (
              <li className="text-gray-500">
                Select recipes to see your shopping list
              </li>
            ) : (
              list.items.map((ing, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {Math.round(ing.amount * 100) / 100}
                  {ing.unit !== "x" ? ` ${ing.unit}` : "x"} {ing.ingredient}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
