"use client";

import { useRouter } from "next/navigation";
import RecipeFormView from "@/views/RecipeFormView";

export default function CreateRecipePage() {
  const router = useRouter();

  const handleRecipeSubmitted = (recipe: any) => {
    alert("Recipe created successfully!");
    router.push(`/recipes`);
  };

  const handleCancel = () => {
    router.push("/recipes");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <RecipeFormView
          onRecipeSubmitted={handleRecipeSubmitted}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
