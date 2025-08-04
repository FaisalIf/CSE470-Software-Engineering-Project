"use client";

import { useState } from "react";
import { Plus, Minus, Upload, Save } from "lucide-react";
import type { CreateRecipeData } from "@/models/Recipe";

interface RecipeFormViewProps {
  onRecipeSubmitted?: (recipe: any) => void;
  onCancel?: () => void;
}

export default function RecipeFormView({
  onRecipeSubmitted,
  onCancel,
}: RecipeFormViewProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateRecipeData>>({
    title: "",
    description: "",
    instructions: [],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: "Medium",
    category: "",
    cuisine: "",
    imageUrl: "",
    ingredients: [],
  });

  const [currentIngredient, setCurrentIngredient] = useState({
    name: "",
    amount: "",
    unit: "",
  });

  const [tags, setTags] = useState<string[]>([]);

  const [currentTag, setCurrentTag] = useState("");

  const [instructionsText, setInstructionsText] = useState("");

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addIngredient = () => {
    if (currentIngredient.name && currentIngredient.amount) {
      const ingredient = {
        name: currentIngredient.name,
        amount: parseFloat(currentIngredient.amount) || 0,
        unit: currentIngredient.unit,
      };

      setFormData((prev) => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), ingredient],
      }));
      setCurrentIngredient({ name: "", amount: "", unit: "" });
    }
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || [],
    }));
  };

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags((prev) => [...prev, currentTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag: string) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      console.log("Form validation check:", {
        title: formData.title,
        description: formData.description,
        instructionsText: instructionsText,
        ingredientsLength: formData.ingredients?.length,
      });

      if (
        !formData.title ||
        !formData.description ||
        !instructionsText ||
        !formData.ingredients?.length
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Convert instructions text to array
      const instructions = instructionsText
        .split("\n")
        .filter((step) => step.trim().length > 0);

      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for session auth
        body: JSON.stringify({
          ...formData,
          instructions,
        }),
      });

      const data = await response.json();
      console.log("Recipe creation response:", data);

      if (data.success) {
        console.log("Recipe created successfully:", data.data);
        onRecipeSubmitted?.(data.data);
        // Reset form
        setFormData({
          title: "",
          description: "",
          instructions: [],
          prepTime: 15,
          cookTime: 30,
          servings: 4,
          difficulty: "Medium",
          category: "",
          cuisine: "",
          imageUrl: "",
          ingredients: [],
        });
        setTags([]);
        setInstructionsText("");
      } else {
        alert("Error creating recipe: " + data.error);
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
      alert("Error submitting recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Recipe
          </h1>
          <p className="text-gray-600 mt-1">
            Share your delicious creation with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Grandma's Chocolate Chip Cookies"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Describe what makes this recipe special..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category || ""}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Dessert">Dessert</option>
                <option value="Snack">Snack</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Beverage">Beverage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine
              </label>
              <select
                value={formData.cuisine || ""}
                onChange={(e) => handleInputChange("cuisine", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Cuisine</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Asian">Asian</option>
                <option value="American">American</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="French">French</option>
                <option value="Indian">Indian</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prep Time (minutes)
              </label>
              <input
                type="number"
                value={formData.prepTime || 15}
                onChange={(e) =>
                  handleInputChange("prepTime", parseInt(e.target.value))
                }
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                value={formData.cookTime || 30}
                onChange={(e) =>
                  handleInputChange("cookTime", parseInt(e.target.value))
                }
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servings
              </label>
              <input
                type="number"
                value={formData.servings || 4}
                onChange={(e) =>
                  handleInputChange("servings", parseInt(e.target.value))
                }
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty || "Medium"}
                onChange={(e) =>
                  handleInputChange("difficulty", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl || ""}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="https://example.com/your-recipe-image.jpg"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Ingredients *
            </label>

            {/* Add Ingredient Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-3">
                Add ingredients one by one using the form below:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Ingredient name (e.g., Flour)"
                    value={currentIngredient.name}
                    onChange={(e) =>
                      setCurrentIngredient((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Amount (e.g., 2)"
                    value={currentIngredient.amount}
                    onChange={(e) =>
                      setCurrentIngredient((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Unit (e.g., cups)"
                    value={currentIngredient.unit}
                    onChange={(e) =>
                      setCurrentIngredient((prev) => ({
                        ...prev,
                        unit: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center"
                    title="Add ingredient to list"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Ingredients List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Added Ingredients ({(formData.ingredients || []).length})
                </span>
                {(formData.ingredients || []).length === 0 && (
                  <span className="text-sm text-red-500">
                    Please add at least one ingredient
                  </span>
                )}
              </div>
              {(formData.ingredients || []).map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                >
                  <span className="text-sm">
                    {ingredient.amount} {ingredient.unit} {ingredient.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions *
            </label>
            <textarea
              value={instructionsText}
              onChange={(e) => setInstructionsText(e.target.value)}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="Write step-by-step instructions (one step per line)..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter each step on a new line
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                placeholder="Add a tag"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Recipe</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
