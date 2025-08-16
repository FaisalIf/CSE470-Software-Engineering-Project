"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientCollectionControls(props: {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  items: { id: string; recipeId: string; title: string }[];
}) {
  const router = useRouter();
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [isPublic, setIsPublic] = useState(props.isPublic);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/collections/${props.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, isPublic }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update");
      }
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-700 mb-1">Name</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-700 mb-1">
            Description
          </label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Public
        </label>
        <button
          onClick={save}
          disabled={saving}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
    </div>
  );
}

export function RemoveItemButton({
  collectionId,
  recipeId,
}: {
  collectionId: string;
  recipeId: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (busy) return;
        setBusy(true);
        try {
          await fetch(
            `/api/collections/${collectionId}/items?recipeId=${recipeId}`,
            {
              method: "DELETE",
            }
          );
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      className="absolute top-2 right-2 z-10 px-2 py-1 rounded text-xs font-medium bg-white/90 border border-gray-200 text-gray-700 hover:bg-white"
    >
      {busy ? "..." : "Remove"}
    </button>
  );
}

// Attach as a static property for convenient namespaced access in server component
(ClientCollectionControls as any).RemoveItemButton = RemoveItemButton;
