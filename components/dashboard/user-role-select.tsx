"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserRole } from "@/lib/actions/content";
import { inputClass } from "./form";

export function UserRoleSelect({ id, role, disabled }: { id: string; role: "ADMIN" | "EDITOR"; disabled?: boolean }) {
  const [pending, start] = useTransition();
  return (
    <select
      defaultValue={role}
      disabled={disabled || pending}
      aria-label="Role"
      onChange={(e) =>
        start(async () => {
          await updateUserRole(id, e.target.value as "ADMIN" | "EDITOR");
          toast.success("Role updated.");
        })
      }
      className={`${inputClass} w-32 py-1.5`}
    >
      <option value="EDITOR" className="bg-indigo">Editor</option>
      <option value="ADMIN" className="bg-indigo">Admin</option>
    </select>
  );
}
