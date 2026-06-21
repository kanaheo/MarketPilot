import type { PortfolioHeaderProps } from "@/types/portfolio";

export function PortfolioHeader({ messages }: PortfolioHeaderProps) {
  return (
    <header className="portfolio-header">
      <h1>{messages.title}</h1>
      <p>{messages.description}</p>
    </header>
  );
}
