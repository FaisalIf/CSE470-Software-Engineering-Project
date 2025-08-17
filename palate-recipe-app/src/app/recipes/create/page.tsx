"use client";

import { useRouter } from "next/navigation";
import RecipeFormView from "@/views/RecipeFormView";
import { triggerToast } from "@/components/Toaster";

export default function CreateRecipePage() {
  const router = useRouter();

  const handleRecipeSubmitted = (recipe: any) => {
    triggerToast({
      title: "Recipe created",
      description: "Your recipe has been created.",
    });
    // Give toast a moment to appear before navigation
    setTimeout(() => router.push(`/recipes`), 600);
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
