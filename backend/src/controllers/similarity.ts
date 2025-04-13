import { Request, Response } from "express";
import { fetchNewCoins } from "../utils/fetchNewCoins";
import { fetchCoinData } from "../utils/coinData";
import axios from "axios";
import { getPredictionStatus, getTypeFromMime } from "../utils/color";
import { subHours } from "date-fns";
import { PrismaClient } from "@prisma/client";

export const calculateTotalSimilarity = async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient();
    const newCoins = await fetchNewCoins();
    const coinData = await fetchCoinData();
    const cleanedCoinData = coinData!.map(cleanObject);

    const predictions = [];

    for (const coinRaw of newCoins.filter(Boolean) as Record<string, any>[]) {
      const coin = cleanObject(coinRaw);
      const address = coin.address;
      const creatorAddress = coin.creatorAddress;

      const existingCoin = await prisma.coin.findFirst({
        where: {
          address,
          scrapedAt: {
            gte: subHours(new Date(), 1),
          },
          total_similarity: {
            not: null,
          },
        },
      });

      if (creatorAddress) {
        try {
          await prisma.profile.upsert({
            where: { address: creatorAddress },
            update: {},
            create: { address: creatorAddress },
          });
        } catch (error) {
          // @ts-ignore
          if (error.code === 'P2002') {
            console.warn(`Profile with address ${creatorAddress} already exists.`);
          } else {
            throw error; // Rethrow other errors
          }
        }
      }

      let sentiment_similarity,
        embed_similarity,
        finance_similarity,
        total_similarity;

      if (existingCoin) {
        ({
          sentiment_similarity,
          embed_similarity,
          finance_similarity,
          total_similarity,
        } = existingCoin);
      } else {
        const payload = {
          example_post: coin,
          coin_data: cleanedCoinData,
        };

        const response = await axios.post(
          "http://127.0.0.1:5000/predict",
          payload
        );

        sentiment_similarity = response.data.weighted_sentiment_similarity;
        embed_similarity = response.data.weighted_embed_similarity;
        finance_similarity = response.data.weighted_financial_similarity;
        total_similarity = response.data.weighted_total_similarity;

        await prisma.coin.upsert({
          where: { address },
          update: {
            sentiment_similarity,
            embed_similarity,
            finance_similarity,
            total_similarity,
            scrapedAt: new Date(),
          },
          create: {
            address: coin.address,
            name: coin.name,
            symbol: coin.symbol,
            description: coin.description,
            totalSupply: String(coin.totalSupply ?? "0"),
            totalVolume: String(coin.totalVolume ?? "0"),
            volume24h: String(coin.volume24h ?? "0"),
            marketCap: String(coin.marketCap ?? "0"),
            marketCapDelta24h: String(coin.marketCapDelta24h ?? "0"),
            createdAt: new Date(coin.createdAt || new Date()),
            creatorAddress: coin.creatorAddress,
            uniqueHolders: Number(coin.uniqueHolders ?? 0),
            transferCount: Number(coin.transferCount ?? 0),
            sentiment_similarity,
            embed_similarity,
            finance_similarity,
            total_similarity,
            mediaMimeType: coin.mimeType,
            mediaOriginalUri: coin.originalImageUrl,
            mediaPreviewUrl: coin.previewImageUrl,
            scrapedAt: new Date(),
          },
        });
      }

      const predictionScore = parseFloat(total_similarity);
      const confidence = parseFloat(
        (
          (sentiment_similarity + embed_similarity + finance_similarity) /
          3
        ).toFixed(1)
      );
      const type = getTypeFromMime(coin.mimeType);
      const timeToViral = parseFloat((20 - predictionScore * 0.15).toFixed(1));
      const { status, statusColor } = getPredictionStatus(predictionScore);

      predictions.push({
        id: coin.address,
        type,
        prediction: predictionScore,
        confidence,
        timeToViral,
        status,
        statusColor,
      });
    }

    res.status(200).json({ predictions });
  } catch (error) {
    console.error("Error processing coins:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

function cleanObject(obj: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      cleaned[key] = "";
    } else {
      cleaned[key] = obj[key];
    }
  }
  return cleaned;
}
