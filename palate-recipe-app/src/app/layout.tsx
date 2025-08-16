import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import {
  ChefHat,
  Home,
  Search,
  TrendingUp,
  User,
  LogOut,
  BookMarked,
  Layers,
} from "lucide-react";
import "./globals.css";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Palate - Cooking Recipe Media Platform",
  description:
    "Discover, share, and create amazing recipes. Build your perfect meal plan with our comprehensive cooking platform.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Simple session check (cookie-based, no security)
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <ChefHat className="w-8 h-8 text-orange-600" />
                <span className="text-xl font-bold text-gray-900">Palate</span>
              </Link>

              {/* Main Navigation */}
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
                <Link
                  href="/ingredients-builder"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span>Recipe Builder</span>
                </Link>
              </div>

              {/* User Actions */}
              <div className="flex items-center space-x-4">
                {session ? (
                  <>
                    <Link
                      href="/recipes/create"
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                    >
                      Create Recipe
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/bookmarks"
                      className="hidden lg:flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                    >
                      <BookMarked className="w-4 h-4" />
                      <span>My Bookmarks</span>
                    </Link>
                    <Link
                      href="/collections"
                      className="hidden lg:flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                    >
                      <Layers className="w-4 h-4" />
                      <span>My Collections</span>
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

        {/* Main Content */}
        {children}
      </body>
    </html>
  );
}
