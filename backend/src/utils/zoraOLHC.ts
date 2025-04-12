import axios from "axios";
import { writeFileSync } from "fs";
import { parse } from "json2csv";

interface PriceDataPoint {
  timestamp: number;
  price: number;
  marketCap: number;
  volume: number;
}

interface OHLCData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  marketCap: number;
  volume: number;
}

const fetchZoraOHLCDataFromCoinGecko = async () => {
  const coinId = "zora-ai";
  const vsCurrency = "usd";
  const fromDate = new Date("2025-01-09");
  const toDate = new Date();

  const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
  const toTimestamp = Math.floor(toDate.getTime() / 1000);

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range`,
      {
        params: {
          vs_currency: vsCurrency,
          from: fromTimestamp,
          to: toTimestamp,
        },
      }
    );

    // Extract price, market cap, and volume data
    const priceData: PriceDataPoint[] = response.data.prices.map(
      ([timestamp, price]: [number, number], index: number) => ({
        timestamp,
        price,
        marketCap: response.data.market_caps[index][1],
        volume: response.data.total_volumes[index][1],
      })
    );

    // Calculate daily OHLC data
    const dailyOHLC: OHLCData[] = [];
    let currentDayPrices: PriceDataPoint[] = [];

    for (let i = 0; i < priceData.length; i++) {
      const currentDate = new Date(priceData[i].timestamp).toDateString();

      if (
        i === priceData.length - 1 ||
        currentDate !== new Date(priceData[i + 1].timestamp).toDateString()
      ) {
        currentDayPrices.push(priceData[i]);

        // Calculate OHLC for the day
        const dayOHLC: OHLCData = {
          timestamp: new Date(currentDayPrices[0].timestamp).toISOString(),
          open: currentDayPrices[0].price,
          high: Math.max(...currentDayPrices.map((p) => p.price)),
          low: Math.min(...currentDayPrices.map((p) => p.price)),
          close: currentDayPrices[currentDayPrices.length - 1].price,
          marketCap: currentDayPrices[currentDayPrices.length - 1].marketCap,
          volume: currentDayPrices.reduce((acc, p) => acc + p.volume, 0),
        };

        dailyOHLC.push(dayOHLC);
        currentDayPrices = []; // Reset for next day
      } else {
        currentDayPrices.push(priceData[i]);
      }
    }

    return dailyOHLC;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const saveOHLCDataToCSV = async () => {
  const data = await fetchZoraOHLCDataFromCoinGecko();
  if (data.length > 0) {
    try {
      const csv = parse(data);
      writeFileSync("zora-ohlc-market-data.csv", csv);
      console.log("OHLC market data saved to zora-ohlc-market-data.csv");
    } catch (error) {
      console.error("Error writing OHLC market data to CSV:", error);
    }
  } else {
    console.log("No data to save.");
  }
};

saveOHLCDataToCSV();
