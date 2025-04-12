import {
  getCoinsMostValuable,
  setApiKey,
} from "@zoralabs/coins-sdk";
import { Address } from "viem";
import { PrismaClient } from "@prisma/client";

setApiKey(process.env.ZORA_API_KEY || "");

const prisma = new PrismaClient();

interface CoinNode {
  address: string;
  name: string;
  symbol: string;
  description?: string;
  totalSupply?: string;
  totalVolume?: string;
  volume24h?: string;
  marketCap?: string;
  marketCapDelta24h?: string;
  createdAt: number | string;
  creatorAddress?: string;
  uniqueHolders?: number;
  transfers?: { count?: number };
  mediaContent?: {
    mimeType?: string;
    originalUri?: string;
    previewImage?: {
      small?: string;
    };
  };
  creatorProfile?: {
    handle?: string;
    avatar?: {
      previewImage?: {
        small?: string;
      };
    };
  };
  creatorEarnings?: Array<{
    amountUsd?: string;
  }>;
}

interface BalanceNode {
  coin?: {
    address: string;
    creatorEarnings?: Array<{
      amountUsd?: string;
    }>;
  };
}

async function fetchAndSaveCoinDetails(coinAddress: Address) {
  try {
    const response = await getCoinsMostValuable({ count: 10000 });

    // @ts-ignore
    const coinEdge = response.data?.exploreList?.edges.find(
      (coin: any) => coin.node?.address === coinAddress
    );

    const coin = coinEdge?.node as CoinNode | undefined;

    if (coin) {
      const creatorAddress = coin.creatorAddress;

      if (creatorAddress) {
        await prisma.profile.upsert({
          where: { address: creatorAddress },
          update: {
            handle: coin.creatorProfile?.handle || null,
            avatarUrl: coin.creatorProfile?.avatar?.previewImage?.small || null,
          },
          create: {
            address: creatorAddress,
            handle: coin.creatorProfile?.handle || null,
            avatarUrl: coin.creatorProfile?.avatar?.previewImage?.small || null,
          },
        });
      }

      const savedCoin = await prisma.coin.upsert({
        where: { address: coinAddress },
        update: {
          name: coin.name,
          symbol: coin.symbol,
          description: coin.description || null,
          totalSupply: coin.totalSupply || null,
          totalVolume: coin.totalVolume || null,
          volume24h: coin.volume24h || null,
          marketCap: coin.marketCap || null,
          marketCapDelta24h: coin.marketCapDelta24h || null,
          createdAt:
            typeof coin.createdAt === "number"
              ? new Date(coin.createdAt * 1000)
              : new Date(coin.createdAt),
          creatorAddress: creatorAddress || null,
          uniqueHolders: coin.uniqueHolders || null,
          transferCount: coin.transfers?.count || null,
          mediaMimeType: coin.mediaContent?.mimeType || null,
          mediaOriginalUri: coin.mediaContent?.originalUri || null,
          mediaPreviewUrl: coin.mediaContent?.previewImage?.small || null,
        },
        create: {
          address: coinAddress,
          name: coin.name,
          symbol: coin.symbol,
          description: coin.description || null,
          totalSupply: coin.totalSupply || null,
          totalVolume: coin.totalVolume || null,
          volume24h: coin.volume24h || null,
          marketCap: coin.marketCap || null,
          marketCapDelta24h: coin.marketCapDelta24h || null,
          createdAt:
            typeof coin.createdAt === "number"
              ? new Date(coin.createdAt * 1000)
              : new Date(coin.createdAt),
          creatorAddress: creatorAddress || null,
          uniqueHolders: coin.uniqueHolders || null,
          transferCount: coin.transfers?.count || null,
          mediaMimeType: coin.mediaContent?.mimeType || null,
          mediaOriginalUri: coin.mediaContent?.originalUri || null,
          mediaPreviewUrl: coin.mediaContent?.previewImage?.small || null,
        },
      });

      if (coin.creatorEarnings && coin.creatorEarnings.length > 0) {
        for (const earning of coin.creatorEarnings) {
          await prisma.creatorEarning.create({
            data: {
              amountUsd: earning.amountUsd || "0",
              coinId: savedCoin.id,
            },
          });
        }
      }

      console.log(`Saved coin: ${coinAddress}`);
    } else {
      console.log(`Coin not found: ${coinAddress}`);
    }
  } catch (error) {
    console.error(`Error fetching details for ${coinAddress}:`, error);
  }
}

async function fetchAndSaveMostValuableCoins(after?: string) {
  try {
    const response = await getCoinsMostValuable({ count: 10000, after });
    console.log("Fetching top coins...");

    const coins = response.data?.exploreList?.edges || [];

    for (const coin of coins) {
      const coinAddress = coin.node?.address;
      if (coinAddress) {
        await fetchAndSaveCoinDetails(coinAddress as Address);
      }
    }

    const nextPageCursor = response.data?.exploreList?.pageInfo?.endCursor;
    if (nextPageCursor) {
      console.log("Fetching next page of coins...");
      await fetchAndSaveMostValuableCoins(nextPageCursor);
    }
  } catch (error) {
    console.error("Error fetching top coins:", error);
  }
}

async function main() {
  try {
    console.log("Starting Zora Coins scraper...");
    await fetchAndSaveMostValuableCoins();
    console.log("Scraping completed!");
  } catch (error) {
    console.error("Error in main function:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
