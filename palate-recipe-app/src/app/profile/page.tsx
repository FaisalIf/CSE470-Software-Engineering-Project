import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { UserModel } from "@/models/User";

export default async function ProfilePage() {
  // Insecure cookie-based auth
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

  const user = await UserModel.findById(session.value!);
  const { recipes: favoriteRecipes } = await UserModel.getFavorites(
    session.value!,
    1,
    5
  );
  const collections = await UserModel.getCollections(session.value!);

  if (!user) {
    return <div className="max-w-3xl mx-auto px-4 py-8">User not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Profile</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.username || "User"}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div>
            <div className="text-lg font-semibold">
              {user.name || user.username}
            </div>
            <div className="text-gray-600 text-sm">{user.email}</div>
          </div>
        </div>
        {user.bio && <p className="mt-4 text-gray-600">{user.bio}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">My Bookmarks</h2>
            <Link
              href="/bookmarks"
              className="text-sm text-orange-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-2">
            {favoriteRecipes.slice(0, 5).map((r) => (
              <li key={r.id}>
                <Link
                  href={`/recipes/${r.id}`}
                  className="text-gray-800 hover:underline"
                >
                  {r.title}
                </Link>
              </li>
            ))}
            {favoriteRecipes.length === 0 && (
              <li className="text-gray-500 text-sm">No bookmarks yet.</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">My Collections</h2>
            <Link
              href="/collections"
              className="text-sm text-orange-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="space-y-2">
            {collections.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/collections/${c.id}`}
                  className="text-gray-800 hover:underline"
                >
                  {c.name} ({c._count?.items ?? c.items.length} items)
                </Link>
              </li>
            ))}
            {collections.length === 0 && (
              <li className="text-gray-500 text-sm">No collections yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
