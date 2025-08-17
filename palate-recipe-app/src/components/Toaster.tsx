"use client";
import * as Toast from "@radix-ui/react-toast";
import { useEffect, useState } from "react";

type ToastMsg = { title?: string; description?: string };

export function triggerToast(msg: ToastMsg) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("app:toast", { detail: msg }));
  }
}

export default function Toaster() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<ToastMsg>({});

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<ToastMsg>;
      setMsg(ce.detail || {});
      setOpen(false);
      // next tick to re-open for successive toasts
      setTimeout(() => setOpen(true), 0);
    };
    window.addEventListener("app:toast", handler as EventListener);
    return () =>
      window.removeEventListener("app:toast", handler as EventListener);
  }, []);

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <Toast.Root
        className="fixed bottom-4 right-4 z-[1000] bg-gray-900 text-white rounded-lg shadow-lg p-4 w-80 data-[state=open]:animate-in data-[state=closed]:animate-out"
        open={open}
        onOpenChange={setOpen}
      >
        {msg.title && (
          <Toast.Title className="text-sm font-medium">{msg.title}</Toast.Title>
        )}
        {msg.description && (
          <Toast.Description className="text-xs text-gray-200 mt-1">
            {msg.description}
          </Toast.Description>
        )}
      </Toast.Root>
      <Toast.Viewport className="" />
    </Toast.Provider>
  );
}
