import type { Metadata } from "next";

import { localeFontClassNames } from "@/config/fonts";
import { siteMetadata } from "@/config/site";
import type { ChildrenProps } from "@/types/common";

import "../globals.css";

export const metadata: Metadata = siteMetadata.ko;

export default function RedirectRootLayout({ children }: ChildrenProps) {
  return (
    <html lang="ko">
      <body className={localeFontClassNames.ko}>{children}</body>
    </html>
  );
}
