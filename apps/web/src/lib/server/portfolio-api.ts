import { marketPilotApiRequest } from "@/lib/server/marketpilot-api";
import type {
  CashTransactionCreateApiRequest,
  CashTransactionApiItem,
  PortfolioApiItem,
  PortfolioCreateApiRequest,
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

export async function createPortfolio(
  data: PortfolioCreateApiRequest,
): Promise<PortfolioApiItem> {
  return marketPilotApiRequest<PortfolioApiItem>("/portfolios", {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function createCashTransaction(
  portfolioId: string,
  data: CashTransactionCreateApiRequest,
): Promise<CashTransactionApiItem> {
  return marketPilotApiRequest<CashTransactionApiItem>(
    `/portfolios/${portfolioId}/cash-transactions`,
    {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );
}
