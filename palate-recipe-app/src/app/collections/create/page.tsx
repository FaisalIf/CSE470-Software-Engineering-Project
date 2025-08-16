"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCollectionPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, isPublic }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to create collection");
      return;
    }
    router.push("/collections");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Create Collection
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <label className="block mb-3">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
            required
          />
        </label>
        <label className="block mb-3">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-orange-500"
            rows={3}
          />
        </label>
        <label className="flex items-center gap-2 mb-4 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public
        </label>
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Create
        </button>
      </form>
    </div>
  );
}
