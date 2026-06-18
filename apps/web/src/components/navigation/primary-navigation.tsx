"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  LayoutDashboard,
  Search,
} from "lucide-react";

import { primaryNavigation } from "@/config/navigation";
import type { PrimaryNavigationProps } from "@/types/navigation";

const navigationIcons = {
  dashboard: LayoutDashboard,
  portfolio: BriefcaseBusiness,
  markets: Search,
  backtests: BarChart3,
  data: Activity,
};

export function PrimaryNavigation({
  ariaLabel,
  labels,
  locale,
}: PrimaryNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="primary-navigation" aria-label={ariaLabel}>
      {primaryNavigation.map((item) => {
        const Icon = navigationIcons[item.icon];
        const href = `/${locale}${item.href === "/" ? "" : item.href}`;
        const isActive =
          item.href === "/"
            ? pathname === href
            : pathname.startsWith(`${href}/`) || pathname === href;

        return (
          <Link
            className="navigation-link"
            data-active={isActive}
            href={href}
            key={item.href}
          >
            <Icon size={19} />
            <span>{labels[item.key]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
