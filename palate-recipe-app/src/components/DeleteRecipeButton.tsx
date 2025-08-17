"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteRecipeButton({
  recipeId,
  userId,
  variant = "small",
  onDeleted,
}: {
  recipeId: string;
  userId?: string;
  variant?: "small" | "large";
  onDeleted?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const cls =
    variant === "large"
      ? "px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
      : "px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600";

  async function handleDelete() {
    setDeleting(true);
    try {
      const headers: Record<string, string> = {};
      if (userId) headers["x-user-id"] = userId;
      const res = await fetch(`/api/recipes/${recipeId}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      if (json.success) {
        setOpen(false);
        if (onDeleted) onDeleted();
        else router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <button type="button" className={cls} onClick={() => setOpen(true)}>
        Delete
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !deleting && setOpen(false)}
          />

          {/* Modal */}
          <div className="relative z-10 w-full max-w-sm rounded-lg bg-white shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete recipe?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              This action cannot be undone. This will permanently delete the
              recipe.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="px-3 py-1.5 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
