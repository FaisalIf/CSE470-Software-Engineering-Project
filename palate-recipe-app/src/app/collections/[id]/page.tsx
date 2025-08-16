import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import ClientCollectionControls, {
  RemoveItemButton,
} from "@/components/ClientCollectionControls";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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

  const { id } = await params;
  const collection = await prisma.collection.findUnique({
    where: { id, userId: session.value! },
    include: { items: { include: { recipe: true } } },
  });

  if (!collection) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">Collection not found.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{collection.name}</h1>
        <Link href="/collections" className="text-orange-600 hover:underline">
          Back to Collections
        </Link>
      </div>
      <ClientCollectionControls
        id={collection.id}
        name={collection.name}
        description={collection.description ?? ""}
        isPublic={collection.isPublic}
        items={collection.items.map((i) => ({
          id: i.id,
          recipeId: i.recipeId,
          title: i.recipe.title,
        }))}
      />
      {collection.items.length === 0 ? (
        <div className="text-gray-500">This collection is empty.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.items.map((it) => (
            <div
              key={it.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border relative"
            >
              <Link href={`/recipes/${it.recipeId}`}>
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {it.recipe.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.recipe.imageUrl}
                      alt={it.recipe.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-lg font-medium">
                      {it.recipe.title.charAt(0)}
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {it.recipe.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {it.recipe.description}
                </p>
              </div>
              <RemoveItemButton
                collectionId={collection.id}
                recipeId={it.recipeId}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
