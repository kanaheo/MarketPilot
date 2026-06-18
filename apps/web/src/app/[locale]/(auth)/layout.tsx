import type { ChildrenProps } from "@/types/common";

export default function AuthLayout({ children }: ChildrenProps) {
  return <main className="auth-main">{children}</main>;
}
