"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAdminUserAction } from "@/actions/admin";

interface Props {
  userId: number;
  email: string;
}

export const DeleteUserButton = ({ userId, email }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm(`Delete user ${email}? This cannot be undone.`)) {
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const result = await deleteAdminUserAction(userId);

      if (result.error) {
        setError(result.error);
        return;
      }

      router.refresh();
    } catch {
      setError("error deleting user");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <span className="admin-delete">
      <button
        type="button"
        className="admin-danger-button"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <span className="admin-inline-error" role="alert">
          {error}
        </span>
      )}
    </span>
  );
};
