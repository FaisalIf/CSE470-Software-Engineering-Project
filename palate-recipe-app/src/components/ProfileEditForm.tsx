"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  user: {
    username?: string | null;
    name?: string | null;
    image?: string | null;
    bio?: string | null;
    email: string;
  };
};

export default function ProfileEditForm({ user }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [username, setUsername] = useState(user.username || "");
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [bio, setBio] = useState(user.bio || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, image, bio }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to update profile");
      return;
    }
    setSuccess("Profile updated");
    startTransition(() => router.refresh());
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <div className="text-sm text-gray-600">Email: {user.email}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-sm text-gray-700 mb-1">Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="block text-sm text-gray-700 mb-1">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </label>
      </div>
      <label className="block">
        <span className="block text-sm text-gray-700 mb-1">Image URL</span>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="block text-sm text-gray-700 mb-1">Bio</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </label>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-60"
      >
        {isPending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
