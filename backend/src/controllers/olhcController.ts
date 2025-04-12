import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export const getOLHCData = async (req: Request, res: Response) => {
  const results: any[] = [];
  const filePath = path.join(
    __dirname,
    "..",
    "data",
    "zora-ohlc-history-from-beginning.csv"
  );

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      results.push({
        timestamp: data.timestamp,
        open: parseFloat(data.open),
        high: parseFloat(data.high),
        low: parseFloat(data.low),
        close: parseFloat(data.close),
      });
    })
    .on("end", () => {
      res.json(results);
    })
    .on("error", (err) => {
      console.error("Error reading CSV file", err);
      res.status(500).send("Internal Server Error");
    });
};
