import Link from "next/link";
import { cookies } from "next/headers";
import { RecipeModel } from "@/models/Recipe";

export default async function MyRecipesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session")?.value;
  if (!userId)
    return <div className="p-8">Please log in to view your recipes.</div>;
  const { recipes } = await RecipeModel.findByAuthor(userId, 1, 100);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">My Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((r: any) => (
          <div key={r.id} className="bg-white border rounded-lg p-4">
            <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-3 flex items-center justify-center">
              {r.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.imageUrl}
                  alt={r.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-600">No image</span>
              )}
            </div>
            <div className="font-medium text-gray-900 line-clamp-1">
              {r.title}
            </div>
            <div className="text-xs text-gray-500">
              {r.category || "General"} • {r.cuisine || "Cuisine"}
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href={`/recipes/${r.id}`}
                className="px-3 py-1 text-sm rounded bg-gray-100"
              >
                View
              </Link>
              <Link
                href={`/my-recipes/${r.id}/edit`}
                className="px-3 py-1 text-sm rounded bg-orange-500 text-white"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
