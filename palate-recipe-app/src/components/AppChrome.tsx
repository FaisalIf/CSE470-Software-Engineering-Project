"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChefHat,
  Home,
  Search,
  TrendingUp,
  User,
  LogOut,
  PanelLeft,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function AppChrome({
  children,
  sessionPresent,
}: {
  children: React.ReactNode;
  sessionPresent: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo and primary links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center space-x-2">
                <ChefHat className="w-8 h-8 text-orange-600" />
                <span className="text-xl font-bold text-gray-900">Palate</span>
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/recipes"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  <span>Recipes</span>
                </Link>
                <Link
                  href="/recipes?view=trending"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending</span>
                </Link>
              </div>
            </div>

            {/* Right: Sidebar toggle + user actions */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                title="Toggle sidebar"
                aria-label="Toggle sidebar"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
              {sessionPresent ? (
                <>
                  <Link
                    href="/recipes/create"
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Create Recipe
                  </Link>
                  <form action="/api/logout" method="POST">
                    <button
                      type="submit"
                      className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/recipes"
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Browse Recipes
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm font-medium"
                  >
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 min-h-0 bg-gray-50">
        <Sidebar collapsed={collapsed} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
