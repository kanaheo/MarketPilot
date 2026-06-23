import { marketPilotApiRequest } from "@/lib/server/marketpilot-api";
import type {
  PortfolioApiItem,
  PortfolioDetailApiItem,
} from "@/types/marketpilot-api";

export async function getPortfolios(): Promise<readonly PortfolioApiItem[]> {
  return marketPilotApiRequest<PortfolioApiItem[]>("/portfolios");
}

export async function getPortfolioDetail(
  portfolioId: string,
): Promise<PortfolioDetailApiItem> {
  return marketPilotApiRequest<PortfolioDetailApiItem>(
    `/portfolios/${portfolioId}`,
  );
}
