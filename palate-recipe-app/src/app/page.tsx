"use client";
import Link from "next/link";
import { Search, Star, Users } from "lucide-react";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16 gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-orange-700 mb-4 leading-tight">
            Discover, Share, and Savor{" "}
            <span className="text-orange-500">Amazing Recipes</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl">
            Palate is your home for culinary inspiration. Find trending dishes,
            submit your own, and build your perfect meal plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/recipes"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-orange-600 transition-colors"
            >
              Browse Recipes
            </Link>
            <Link
              href="/recipes/create"
              className="border-2 border-orange-500 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors"
            >
              Share Your Recipe
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Delicious Food Collection"
            className="w-full max-w-md rounded-2xl shadow-lg border border-orange-100"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow border border-orange-100 flex flex-col items-center">
          <Search className="w-10 h-10 text-orange-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Smart Recipe Search
          </h3>
          <p className="text-gray-600 text-center">
            Find recipes by ingredients, cuisine, or dietary needs. Discover new
            favorites with ease.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow border border-orange-100 flex flex-col items-center">
          <Star className="w-10 h-10 text-orange-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Trending Dishes
          </h3>
          <p className="text-gray-600 text-center">
            See what’s hot! Explore trending recipes loved by the community.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow border border-orange-100 flex flex-col items-center">
          <Users className="w-10 h-10 text-orange-500 mb-3" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Community & Sharing
          </h3>
          <p className="text-gray-600 text-center">
            Share your creations, get feedback, and connect with fellow foodies.
          </p>
        </div>
        {/* ...removed interactive features, only original three cards remain... */}
      </section>

      {/* Ingredient List Builder moved to header */}

      {/* Call to Action Section */}
      <section className="bg-orange-50 py-12 mt-auto">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-orange-700 mb-4">
            Ready to Start Cooking?
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of home cooks sharing and discovering amazing recipes
            every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/recipes"
              className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Explore Recipes
            </Link>
            <Link
              href="/register"
              className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors"
            >
              Join the Community
            </Link>
            <Link
              href="/reviews"
              className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors"
            >
              Submit a Review
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
  // ...existing code...
}
