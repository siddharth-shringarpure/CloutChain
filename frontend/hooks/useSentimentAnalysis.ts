import { useState, useEffect } from "react";
import { pipeline, env } from "@xenova/transformers";

// Configure Xenova to use the correct cache directory
env.cacheDir = "/tmp/transformers-cache"; // For production
// Use './public/models/' for development if you want to serve models locally

export default function useSentimentAnalysis(posts: string[]) {
  const [sentiments, setSentiments] = useState<
    {
      text: string;
      sentiment: string;
      score: number;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function analyzeSentiment() {
      if (!posts || posts.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Initialize the sentiment analysis pipeline with Xenova
        const sentimentAnalyzer = await pipeline(
          "text-classification",
          "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
        );

        // Analyze the sentiment for each post
        const results = await Promise.all(
          posts.map(async (text) => {
            // Ensure text is a string
            if (typeof text !== "string") {
              console.warn("Non-string value found in posts array:", text);
              text = String(text || ""); // Convert to string or use empty string
            }

            const result = await sentimentAnalyzer(text);
            return {
              text,
              // @ts-ignore
              sentiment: result[0].label, // Get the sentiment label
              // @ts-ignore
              score: result[0].score, // Get the score of the sentiment
            };
          })
        );

        setSentiments(results);
      } catch (err) {
        console.error("Sentiment analysis error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during sentiment analysis"
        );
      } finally {
        setLoading(false);
      }
    }

    analyzeSentiment();
  }, [posts]);

  return { sentiments, loading, error };
}
