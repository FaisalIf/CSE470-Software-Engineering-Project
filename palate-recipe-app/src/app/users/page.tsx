import Link from "next/link";
import { UserModel } from "@/models/User";

export default async function UsersPage() {
  const { users } = await UserModel.listPublic(30);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-4">Browse Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u: any) => (
          <Link
            key={u.id}
            href={`/users/${u.id}`}
            className="border rounded-lg p-4 bg-white hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {u.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={u.image}
                    alt={u.name || u.username || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {(u.name || u.username || "U").charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {u.name || u.username || "Unnamed"}
                </div>
                {u.username && (
                  <div className="text-xs text-gray-600">@{u.username}</div>
                )}
              </div>
            </div>
            {u.bio && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{u.bio}</p>
            )}
            <div className="text-xs text-gray-500 mt-2">
              {u._count?.collections ?? 0} collections •{" "}
              {u._count?.recipes ?? 0} recipes
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
