import { getCoinsTopGainers } from "@zoralabs/coins-sdk";

async function fetchTopGainers() {
  const response = await getCoinsTopGainers({
    count: 10, // Optional: number of coins per page
    after: undefined, // Optional: for pagination
  });

  const tokens = response.data?.exploreList?.edges?.map(
    (edge: any) => edge.node
  );

  console.log(`Top Gainers (${tokens?.length || 0} coins):`);

  console.log("Tokens:", tokens);

  // For pagination
  if (response.data?.exploreList?.pageInfo?.endCursor) {
    console.log(
      "Next page cursor:",
      response.data?.exploreList?.pageInfo?.endCursor
    );
  }

  return response;
}

