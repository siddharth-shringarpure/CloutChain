import { useState, useEffect } from "react";
import { getCoinsTopGainers } from "@zoralabs/coins-sdk";

export default function useZoraTopGainers() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopGainers() {
      setLoading(true);
      setError(null);
      try {

        console.log("Fetching top gaining coins from Zora SDK...");
        // Fetch top gaining coins from the Zora SDK
        const response = await getCoinsTopGainers({
          count: 10, // Fetch 10 top gaining coins
        });

        console.log("Top gaining coins response:", response);

        // Check if response contains coins
        if (response.data?.exploreList?.edges) {
          const fetchedCoins = response.data.exploreList.edges.map(
            (edge: any) => edge.node
          );
          setCoins(fetchedCoins);
        } else {
          throw new Error("No coins found in response");
        }
      } catch (err: any) {
        setError(`Failed to fetch top gaining coins: ${err.message}`);
      } finally {
        setLoading(false);
        console.log("Top gaining coins fetched successfully:", coins);
      }
    }

    fetchTopGainers();
  }, []);

  return { coins, loading, error };
}
