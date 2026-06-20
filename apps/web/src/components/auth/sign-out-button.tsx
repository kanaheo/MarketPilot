"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

import type { SignOutButtonProps } from "@/types/auth";

export function SignOutButton({
  label,
  redirectTo,
}: SignOutButtonProps) {
  return (
    <button
      className="sidebar-action"
      onClick={() => {
        void signOut({ redirectTo });
      }}
      type="button"
    >
      <LogOut size={19} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
