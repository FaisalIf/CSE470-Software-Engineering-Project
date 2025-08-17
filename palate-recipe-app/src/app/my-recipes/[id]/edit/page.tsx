"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { triggerToast } from "@/components/Toaster";

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (!json.success) throw new Error("Failed to load recipe");
        setData(json.data);
      } catch (e) {
        triggerToast({
          title: "Failed to load",
          description: "Could not load recipe.",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const updateField = (field: string, value: any) =>
    setData((prev: any) => ({ ...prev, [field]: value }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          instructions: data.instructions,
          prepTime: data.prepTime,
          cookTime: data.cookTime,
          servings: data.servings,
          difficulty: data.difficulty,
          cuisine: data.cuisine,
          category: data.category,
          imageUrl: data.imageUrl,
          ingredients: (data.ingredients || []).map((i: any) => ({
            name: i.name,
            amount: i.amount,
            unit: i.unit,
          })),
          nutritionInfo: data.nutritionInfo
            ? {
                calories: data.nutritionInfo.calories || undefined,
                protein: data.nutritionInfo.protein || undefined,
                fat: data.nutritionInfo.fat || undefined,
                carbs: data.nutritionInfo.carbs || undefined,
                fiber: data.nutritionInfo.fiber || undefined,
                sugar: data.nutritionInfo.sugar || undefined,
                sodium: data.nutritionInfo.sodium || undefined,
              }
            : undefined,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Update failed");
      triggerToast({
        title: "Recipe updated",
        description: "Your changes have been saved.",
      });
      setTimeout(() => router.push(`/recipes/${id}`), 600);
    } catch (e: any) {
      triggerToast({
        title: "Save failed",
        description: String(e?.message || e),
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading…</div>;
  if (!data) return <div className="p-8">Recipe not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
      <div className="bg-white border rounded-lg p-4 space-y-4">
        <div>
          <label className="text-sm text-gray-700">Title</label>
          <input
            value={data.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-700">Description</label>
          <textarea
            value={data.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-700">Prep Time (min)</label>
            <input
              type="number"
              value={data.prepTime || 0}
              onChange={(e) =>
                updateField("prepTime", parseInt(e.target.value || "0"))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Cook Time (min)</label>
            <input
              type="number"
              value={data.cookTime || 0}
              onChange={(e) =>
                updateField("cookTime", parseInt(e.target.value || "0"))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-700">Servings</label>
          <input
            type="number"
            value={data.servings || 1}
            onChange={(e) =>
              updateField("servings", parseInt(e.target.value || "1"))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-700">Category</label>
            <input
              value={data.category || ""}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-700">Cuisine</label>
            <input
              value={data.cuisine || ""}
              onChange={(e) => updateField("cuisine", e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-700">Image URL</label>
          <input
            value={data.imageUrl || ""}
            onChange={(e) => updateField("imageUrl", e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Ingredients</label>
          <div className="space-y-2 mt-2">
            {(data.ingredients || []).map((ing: any, idx: number) => (
              <div key={idx} className="grid grid-cols-5 gap-2">
                <input
                  className="border rounded px-2 py-1 col-span-3"
                  value={ing.name}
                  onChange={(e) => {
                    const arr = [...data.ingredients];
                    arr[idx] = { ...arr[idx], name: e.target.value };
                    setData({ ...data, ingredients: arr });
                  }}
                />
                <input
                  className="border rounded px-2 py-1"
                  type="number"
                  value={ing.amount}
                  onChange={(e) => {
                    const arr = [...data.ingredients];
                    arr[idx] = {
                      ...arr[idx],
                      amount: parseFloat(e.target.value || "0"),
                    };
                    setData({ ...data, ingredients: arr });
                  }}
                />
                <input
                  className="border rounded px-2 py-1"
                  value={ing.unit}
                  onChange={(e) => {
                    const arr = [...data.ingredients];
                    arr[idx] = { ...arr[idx], unit: e.target.value };
                    setData({ ...data, ingredients: arr });
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Instructions</label>
          <textarea
            value={(data.instructions || []).join("\n")}
            onChange={(e) =>
              updateField("instructions", e.target.value.split("\n"))
            }
            className="w-full border rounded px-3 py-2"
            rows={6}
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Nutrition (optional)</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            {[
              ["calories", "Calories"],
              ["protein", "Protein (g)"],
              ["fat", "Fat (g)"],
              ["carbs", "Carbs (g)"],
              ["fiber", "Fiber (g)"],
              ["sugar", "Sugar (g)"],
              ["sodium", "Sodium (mg)"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs text-gray-600">{label}</label>
                <input
                  type="number"
                  step="0.1"
                  value={data.nutritionInfo?.[key as keyof any] ?? ""}
                  onChange={(e) => {
                    const v =
                      e.target.value === ""
                        ? undefined
                        : parseFloat(e.target.value);
                    setData({
                      ...data,
                      nutritionInfo: {
                        ...(data.nutritionInfo || {}),
                        [key]: v,
                      },
                    });
                  }}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="px-4 py-2 rounded bg-orange-600 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
