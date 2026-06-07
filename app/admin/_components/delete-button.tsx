"use client";

import { useTransition } from "react";

interface DeleteButtonProps {
  id: string;
  action: (id: string) => Promise<{ success?: boolean; error?: string }>;
  label?: string;
  confirmMessage?: string;
  className?: string;
}

export function DeleteButton({
  id,
  action,
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this item?",
  className = "btn-secondary text-red-500 text-sm px-3 py-1.5 disabled:opacity-50",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm(confirmMessage)) {
      startTransition(async () => {
        try {
          const result = await action(id);
          if (result?.error) {
            alert(result.error);
          }
        } catch (error: unknown) {
          const errMsg = error instanceof Error ? error.message : "Failed to delete item.";
          alert(errMsg);
        }
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className={className}
    >
      {isPending ? "Deleting..." : label}
    </button>
  );
}
