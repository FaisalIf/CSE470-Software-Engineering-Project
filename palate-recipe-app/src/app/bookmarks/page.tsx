import Link from "next/link";
import { cookies } from "next/headers";
import RemoveFavoriteButton from "@/components/RemoveFavoriteButton";
import { UserModel } from "@/models/User";

export default async function BookmarksPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <p className="mb-4">You must be logged in.</p>
        <Link href="/login" className="text-orange-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  const { recipes: favoriteRecipes } = await UserModel.getFavorites(
    session.value!,
    1,
    100
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Bookmarks</h1>
      {favoriteRecipes.length === 0 ? (
        <div className="text-gray-500">No bookmarks yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((r) => (
            <Link
              key={r.id}
              href={`/recipes/${r.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 relative"
            >
              <RemoveFavoriteButton recipeId={r.id} />
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {r.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.imageUrl}
                    alt={r.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-lg font-medium">
                    {r.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {r.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {r.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
