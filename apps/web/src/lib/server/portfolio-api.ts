import {
  marketPilotApiDelete,
  marketPilotApiPatch,
  marketPilotApiPost,
  marketPilotApiRequest,
} from "@/lib/server/marketpilot-api";
import type {
  CashTransactionCreateApiRequest,
  CashTransactionApiItem,
  MarketQuoteApiItem,
  OrderApiItem,
  OrderCreateApiRequest,
  OrderExecuteApiRequest,
  OrderUpdateApiRequest,
  PortfolioApiItem,
  PortfolioCreateApiRequest,
  PortfolioDetailApiItem,
} from "@/types/marketpilot-api";

export async function getMarketQuotes(): Promise<
  readonly MarketQuoteApiItem[]
> {
  return marketPilotApiRequest<MarketQuoteApiItem[]>("/market-data/quotes");
}

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
  return marketPilotApiPost<PortfolioCreateApiRequest, PortfolioApiItem>(
    "/portfolios",
    data,
  );
}

export async function createCashTransaction(
  portfolioId: string,
  data: CashTransactionCreateApiRequest,
): Promise<CashTransactionApiItem> {
  return marketPilotApiPost<
    CashTransactionCreateApiRequest,
    CashTransactionApiItem
  >(
    `/portfolios/${portfolioId}/cash-transactions`,
    data,
  );
}

export async function getOrders(
  portfolioId: string,
): Promise<readonly OrderApiItem[]> {
  return marketPilotApiRequest<OrderApiItem[]>(
    `/portfolios/${portfolioId}/orders`,
  );
}

export async function createOrder(
  portfolioId: string,
  data: OrderCreateApiRequest,
): Promise<OrderApiItem> {
  return marketPilotApiPost<OrderCreateApiRequest, OrderApiItem>(
    `/portfolios/${portfolioId}/orders`,
    data,
  );
}

export async function cancelOrder(
  portfolioId: string,
  orderId: string,
): Promise<OrderApiItem> {
  return marketPilotApiPatch<undefined, OrderApiItem>(
    `/portfolios/${portfolioId}/orders/${orderId}/cancel`,
  );
}

export async function deleteOrder(
  portfolioId: string,
  orderId: string,
): Promise<void> {
  return marketPilotApiDelete(`/portfolios/${portfolioId}/orders/${orderId}`);
}

export async function updateOrder(
  portfolioId: string,
  orderId: string,
  data: OrderUpdateApiRequest,
): Promise<OrderApiItem> {
  return marketPilotApiPatch<OrderUpdateApiRequest, OrderApiItem>(
    `/portfolios/${portfolioId}/orders/${orderId}`,
    data,
  );
}

export async function executeOrder(
  portfolioId: string,
  orderId: string,
  data: OrderExecuteApiRequest,
): Promise<OrderApiItem> {
  return marketPilotApiPatch<OrderExecuteApiRequest, OrderApiItem>(
    `/portfolios/${portfolioId}/orders/${orderId}/execute`,
    data,
  );
}
