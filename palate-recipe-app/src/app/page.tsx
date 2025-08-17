"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Full-bleed hero with background image */}
      <section
        className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-start"
        style={{
          backgroundImage:
            "url('https://cdn.pixabay.com/photo/2022/12/04/18/15/pesto-7635158_1280.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 w-full">
          <div
            className="mx-auto w-full max-w-7xl px-6 pt-16 md:pt-24"
            style={{ height: "60%" }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white max-w-3xl leading-tight">
              Discover, Share, and Savor Amazing Recipes
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90 max-w-2xl">
              Palate is your home for culinary inspiration. Find trending
              dishes, submit your own, and build your perfect meal plan.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/recipes"
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-orange-600 transition-colors"
              >
                Browse Recipes
              </Link>
              <Link
                href="/recipes/create"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Share Your Recipe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Alternating feature sections */}
      <section className="max-w-7xl mx-auto w-full px-6 py-16 space-y-16">
        {/* Row 1: image left, text right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/30/15/47/churros-2188871_1280.jpg"
              alt="Churros"
              className="w-full rounded-2xl shadow-lg border border-orange-100 object-cover aspect-[16/10]"
            />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Smart Recipe Search
            </h3>
            <p className="mt-3 text-gray-700 text-lg">
              Find recipes by ingredients, cuisine, or dietary needs. Discover
              new favorites with ease.
            </p>
          </div>
        </div>

        {/* Row 2: text left, image right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Trending Dishes
            </h3>
            <p className="mt-3 text-gray-700 text-lg">
              See what’s hot! Explore trending recipes loved by the community.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <img
              src="https://cdn.pixabay.com/photo/2015/04/08/13/13/food-712665_1280.jpg"
              alt="Trending Food"
              className="w-full rounded-2xl shadow-lg border border-orange-100 object-cover aspect-[16/10]"
            />
          </div>
        </div>

        {/* Row 3: image left, text right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Community"
              className="w-full rounded-2xl shadow-lg border border-orange-100 object-cover aspect-[16/10]"
            />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Community & Sharing
            </h3>
            <p className="mt-3 text-gray-700 text-lg">
              Share your creations, get feedback, and connect with fellow
              foodies.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section (unchanged) */}
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
}
