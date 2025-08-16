"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Link from "next/link";

type Ingredient = { name: string; amount: number; unit: string };
type Recipe = { id: string; title: string; ingredients: Ingredient[] };
// This would be fetched from your API in a real app
const sampleRecipes: Recipe[] = [
  {
    id: "carbonara",
    title: "Spaghetti Carbonara",
    ingredients: [
      { name: "Eggs", amount: 2, unit: "x" },
      { name: "Spaghetti", amount: 400, unit: "g" },
      { name: "Pancetta", amount: 100, unit: "g" },
    ],
  },
  {
    id: "pancakes",
    title: "Blueberry Pancakes",
    ingredients: [
      { name: "Eggs", amount: 1, unit: "x" },
      { name: "Milk", amount: 1, unit: "cup" },
      { name: "Flour", amount: 1, unit: "cup" },
    ],
  },
  {
    id: "avocado-toast",
    title: "Avocado Toast",
    ingredients: [
      { name: "Avocado", amount: 1, unit: "x" },
      { name: "Bread", amount: 2, unit: "slices" },
      { name: "Eggs", amount: 1, unit: "x" },
    ],
  },
];

function mergeIngredients(selected: Recipe[]): Ingredient[] {
  const map = new Map<string, Ingredient>();
  selected.forEach((r) => {
    r.ingredients.forEach((ing) => {
      const key = ing.name + ing.unit;
      if (!map.has(key)) {
        map.set(key, { ...ing });
      } else {
        map.get(key)!.amount += ing.amount;
      }
    });
  });
  return Array.from(map.values());
}

export default function IngredientsBuilderPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<string[]>([]);
  const selectedRecipes = recipes.filter((r) =>
    selectedRecipeIds.includes(r.id)
  );
  const mergedIngredients = mergeIngredients(selectedRecipes);

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch("/api/recipes?withIngredients=1");
      const data = await res.json();
      if (data.success) setRecipes(data.data);
    }
    fetchRecipes();
  }, []);

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
            {mergedIngredients.length === 0 ? (
              <li className="text-gray-500">
                Select recipes to see your shopping list
              </li>
            ) : (
              mergedIngredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {ing.amount}
                  {ing.unit !== "x" ? ` ${ing.unit}` : "x"} {ing.name}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
