import type { NavigationItem } from "@/types/navigation";

export const primaryNavigation = [
  {
    key: "dashboard",
    href: "/",
    icon: "dashboard",
  },
  {
    key: "portfolio",
    href: "/portfolio",
    icon: "portfolio",
  },
  {
    key: "markets",
    href: "/markets",
    icon: "markets",
  },
  {
    key: "backtests",
    href: "/backtests",
    icon: "backtests",
  },
  {
    key: "data",
    href: "/data",
    icon: "data",
  },
] as const satisfies readonly NavigationItem[];
