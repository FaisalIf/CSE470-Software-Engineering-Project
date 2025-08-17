import Link from "next/link";
import { UserModel } from "@/models/User";

export default async function PublicUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await UserModel.getPublicProfile(id);
  if (!data) return <div className="p-8">User not found</div>;
  const { user, collections } = data;
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || user.username || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg text-gray-600 font-medium">
                {(user.name || user.username || "U").charAt(0)}
              </span>
            )}
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">
              {user.name || user.username || "Unnamed"}
            </div>
            {user.username && (
              <div className="text-sm text-gray-600">@{user.username}</div>
            )}
          </div>
        </div>
        {user.bio && (
          <p className="text-gray-700 mt-4 whitespace-pre-line">{user.bio}</p>
        )}
      </div>

      <h2 className="text-lg font-semibold mb-3">Public Collections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((c: any) => (
          <div key={c.id} className="bg-white border rounded-lg p-4">
            <div className="font-medium text-gray-900">{c.name}</div>
            {c.description && (
              <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                {c.description}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              {c._count?.items ?? c.items?.length ?? 0} recipes
            </div>
            <div className="mt-3 flex gap-2">
              {c.items.slice(0, 3).map((it: any) => (
                <Link
                  key={it.id}
                  href={`/recipes/${it.recipeId}`}
                  className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center"
                >
                  {it.recipe?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.recipe.imageUrl}
                      alt={it.recipe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-600 p-1 text-center">
                      {it.recipe?.title?.slice(0, 10) || "Recipe"}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
