import { getCoinsMostValuable } from "@zoralabs/coins-sdk";

interface MediaContent {
  mimeType?: string;
  previewImage?: {
    small?: string;
  };
  originalUri?: string;
}

interface Transfer {
  count?: number;
}

interface CoinNode {
  id?: string;
  name?: string;
  symbol?: string;
  description?: string;
  createdAt?: string;
  creatorAddress?: string;
  uniqueHolders?: number;
  mediaContent?: MediaContent;
  totalSupply?: string;
  totalVolume?: string;
  volume24h?: string;
  marketCap?: string;
  marketCapDelta24h?: string;
  address?: string;
  transfers?: Transfer;
}

export async function fetchCoinData() {
  const response = await getCoinsMostValuable({
    count: 10,
  });

  const now = new Date().toISOString().replace("T", " ").slice(0, 23);

  const formatted = response.data?.exploreList?.edges
    ?.map((edge) => edge.node)
    .filter((node): node is CoinNode => node !== undefined)
    .map((node: CoinNode) => ({
      id: node.id ?? "",
      name: node.name ?? "",
      symbol: node.symbol ?? "",
      description: node.description ?? "",
      createdAt: node.createdAt?.replace("T", " ") ?? "",
      creatorAddress: node.creatorAddress ?? "",
      uniqueHolders: node.uniqueHolders ?? 0,
      mediaMimeType: node.mediaContent?.mimeType ?? "",
      mediaPreviewUrl: node.mediaContent?.previewImage?.small ?? "",
      mediaOriginalUri: node.mediaContent?.originalUri ?? "",
      totalSupply: parseFloat(node.totalSupply ?? "0"),
      totalVolume: parseFloat(node.totalVolume ?? "0"),
      volume24h: parseFloat(node.volume24h ?? "0"),
      marketCap: parseFloat(node.marketCap ?? "0"),
      marketCapDelta24h: parseFloat(node.marketCapDelta24h ?? "0"),
      address: node.address ?? "",
      transferCount: node.transfers?.count ?? 0,
      scrapedAt: now,
      updatedAt: now,
    }));

  return formatted;
}
