"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Home,
  Search,
  TrendingUp,
  ListChecks,
  User,
  BookMarked,
  Layers,
  Clock,
} from "lucide-react";

type RecentItem = {
  id: string;
  recipeId: string;
  recipe: { id: string; title: string; imageUrl?: string | null };
};

export default function Sidebar({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const [recent, setRecent] = useState<RecentItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me/recent-views");
        if (!res.ok) return;
        const data = await res.json();
        setRecent(data.data || []);
      } catch {}
    })();
  }, []);

  const widthClass = collapsed ? "w-16" : "w-72";
  return (
    <aside
      className={`hidden lg:block ${widthClass} shrink-0 border-r bg-white min-h-[calc(100vh-64px)] transition-all duration-200`}
    >
      <div className="p-4 space-y-6">
        <nav className="space-y-1">
          <SidebarLink
            collapsed={collapsed}
            href="/"
            icon={<Home className="w-4 h-4" />}
          >
            Home
          </SidebarLink>
          <SidebarLink
            collapsed={collapsed}
            href="/recipes"
            icon={<Search className="w-4 h-4" />}
          >
            Recipes
          </SidebarLink>
          <SidebarLink
            collapsed={collapsed}
            href="/recipes?view=trending"
            icon={<TrendingUp className="w-4 h-4" />}
          >
            Trending
          </SidebarLink>
          <SidebarLink
            collapsed={collapsed}
            href="/ingredients-builder"
            icon={<ListChecks className="w-4 h-4" />}
          >
            Recipe Builder
          </SidebarLink>
        </nav>

        <div className="border-t pt-4 space-y-1">
          <SidebarLink
            collapsed={collapsed}
            href="/profile"
            icon={<User className="w-4 h-4" />}
          >
            My Profile
          </SidebarLink>
          <SidebarLink
            collapsed={collapsed}
            href="/bookmarks"
            icon={<BookMarked className="w-4 h-4" />}
          >
            My Bookmarks
          </SidebarLink>
          <SidebarLink
            collapsed={collapsed}
            href="/collections"
            icon={<Layers className="w-4 h-4" />}
          >
            My Collections
          </SidebarLink>
        </div>

        <div className="border-t pt-4">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-2"
            } text-sm text-gray-600 mb-2`}
          >
            <Clock className="w-4 h-4" />
            {!collapsed && <span>Recently Viewed</span>}
          </div>
          {!collapsed && (
            <div className="space-y-2">
              {recent.length === 0 && (
                <div className="text-xs text-gray-500">
                  No recent views yet.
                </div>
              )}
              {recent.map((rv) => (
                <Link
                  key={rv.id}
                  href={`/recipes/${rv.recipeId}`}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                    {rv.recipe?.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rv.recipe.imageUrl}
                        alt={rv.recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="text-sm text-gray-700 line-clamp-2">
                    {rv.recipe?.title}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  children,
  collapsed = false,
}: {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  collapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center ${
        collapsed ? "justify-center" : "gap-2"
      } px-3 py-2 rounded text-gray-700 hover:bg-gray-50`}
    >
      {icon}
      {!collapsed && <span className="text-sm">{children}</span>}
    </Link>
  );
}
