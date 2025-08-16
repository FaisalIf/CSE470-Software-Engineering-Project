import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function CollectionsPage() {
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

  const collections = await prisma.collection.findMany({
    where: { userId: session.value! },
    include: { items: { include: { recipe: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Collections</h1>
        <Link
          href="/collections/create"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 text-sm font-medium"
        >
          New Collection
        </Link>
      </div>
      {collections.length === 0 ? (
        <div className="text-gray-500">No collections yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
            >
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {c.name}
                </h3>
                {c.items.length > 0 ? (
                  <p className="text-gray-600 text-sm mb-2">
                    {c.items.length} recipes
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm mb-2">Empty collection</p>
                )}
                <div className="flex -space-x-2">
                  {c.items.slice(0, 5).map((i) => (
                    <div
                      key={i.id}
                      className="w-10 h-10 bg-gray-200 rounded overflow-hidden border border-gray-200"
                    >
                      {i.recipe.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={i.recipe.imageUrl}
                          alt={i.recipe.title}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
