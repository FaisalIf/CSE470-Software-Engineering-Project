"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RemoveFavoriteButton({
  recipeId,
}: {
  recipeId: string;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  return (
    <button
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (busy) return;
        setBusy(true);
        try {
          await fetch(`/api/recipes/${recipeId}/favorite`, {
            method: "DELETE",
          });
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
      className="absolute top-2 right-2 z-10 px-2 py-1 rounded text-xs font-medium bg-white/90 border border-gray-200 text-gray-700 hover:bg-white"
      title="Remove bookmark"
    >
      {busy ? "..." : "Remove"}
    </button>
  );
}
