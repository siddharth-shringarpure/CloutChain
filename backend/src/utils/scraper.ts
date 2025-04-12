import {
  getCoinsMostValuable,
  getCoinComments,
  getProfileBalances,
} from "@zoralabs/coins-sdk";
import { Address } from "viem";

async function fetchCreatorTotalBalance(creatorAddress: string) {
  try {
    const response = await getProfileBalances({
      identifier: creatorAddress,
      count: 10000,
    });

    // @ts-ignore
    const balances = response?.data?.profile?.coinBalances?.edges || [];
    let totalBalanceUsd = 0;

    for (const balance of balances) {
      const earnings = balance.node?.coin?.creatorEarnings;
      if (earnings && earnings.length > 0) {
        for (const earning of earnings) {
          totalBalanceUsd += parseFloat(earning.amountUsd || "0");
        }
      }
    }

    return totalBalanceUsd.toFixed(2);
  } catch (error) {
    console.error("Error fetching creator balances:", error);
    return "N/A";
  }
}

async function fetchCoinComments(coinAddress: Address, after?: string) {
  const response = await getCoinComments({
    address: coinAddress,
    chain: 8453,
    after,
    count: 10000,
  });

  console.log(`Fetched comments for coin: ${coinAddress}`);

  let comments = response.data?.zora20Token?.zoraComments?.edges || [];
  let nextPageCursor =
    response.data?.zora20Token?.zoraComments?.pageInfo?.endCursor;

  comments.forEach((edge, index) => {
    console.log(`Comment ${index + 1}:`);
    // @ts-ignore
    console.log(`- txHash: ${edge.node.txHash}`);
    // @ts-ignore
    console.log(`- Comment: ${edge.node.comment}`);
    // @ts-ignore
    console.log(`- Author Address: ${edge.node.userAddress}`);

    // @ts-ignore
    const userProfile = edge.node.userProfile;
    if (userProfile) {
      console.log(`- Author Handle: ${userProfile.handle}`);
      console.log(`- Avatar URL: ${userProfile.avatar?.previewImage?.small}`);
    }

    console.log(
      // @ts-ignore
      `- Created At: ${new Date(edge.node.timestamp * 1000).toISOString()}`
    );

    // @ts-ignore
    const replies = edge.node.replies?.edges || [];
    if (replies.length > 0) {
      console.log(`- Replies:`);
      // @ts-ignore
      replies.forEach((reply, replyIndex) => {
        console.log(`  Reply ${replyIndex + 1}:`);
        console.log(`  - Author Address: ${reply.node.userAddress}`);
        console.log(`  - Reply: ${reply.node.comment}`);
        console.log(
          `  - Created At: ${new Date(
            reply.node.timestamp * 1000
          ).toISOString()}`
        );
      });
    }

    console.log("-----------------------------------");
  });

  // Check if there is a next page for comments
  if (nextPageCursor) {
    console.log("Next page cursor:", nextPageCursor);
    await fetchCoinComments(coinAddress, nextPageCursor);
  }
}

async function fetchCoinDetails(coinAddress: Address) {
  const response = await getCoinsMostValuable({
    count: 10000,
  });

  // @ts-ignore
  const coin = response.data?.exploreList?.edges.find(
    (coin) => coin.node?.address === coinAddress
  )?.node;
  if (coin) {
    const creatorAddress = coin.creatorAddress;
    const totalCreatorBalance = creatorAddress
      ? await fetchCreatorTotalBalance(creatorAddress)
      : "N/A";
    console.log(`Fetched details for coin: ${coinAddress}`);
    console.log(`- Name: ${coin.name}`);
    console.log(`- Symbol: ${coin.symbol}`);
    console.log(`- Description: ${coin.description}`);
    console.log(`- Total Supply: ${coin.totalSupply}`);
    console.log(`- Total Volume: ${coin.totalVolume}`);
    console.log(`- Volume 24h: ${coin.volume24h}`);
    console.log(`- Market Cap: ${coin.marketCap}`);
    console.log(`- Market Cap Delta (24h): ${coin.marketCapDelta24h}`);
    // @ts-ignore
    console.log(`- Created At: ${new Date(coin.createdAt).toISOString()}`);
    console.log(`- Creator Address: ${coin.creatorAddress}`);
    console.log(
      // @ts-ignore
      `- Creator Earnings: ${coin.creatorEarnings
        .map((earning) => earning.amountUsd)
        .join(", ")}`
    );
    console.log(`- Unique Holders: ${coin.uniqueHolders}`);
    // @ts-ignore
    console.log(`- Transfers: ${coin.transfers.count}`);
    console.log(
      `- Creator's Total Overall Balance (USD): $${totalCreatorBalance}`
    );

    // @ts-ignore
    if (coin.mediaContent) {
      // @ts-ignore
      console.log(`- Media Content Mime Type: ${coin.mediaContent.mimeType}`);
      // @ts-ignore
      console.log(`- Media Content URI: ${coin.mediaContent.originalUri}`);
      console.log(
        // @ts-ignore
        `- Media Preview Image: ${coin.mediaContent.previewImage?.small}`
      );
    }

    if (coin.creatorProfile) {
      // @ts-ignore
      console.log(`- Creator Handle: ${coin.creatorProfile.handle}`);
      console.log(
        // @ts-ignore
        `- Creator Avatar URL: ${coin.creatorProfile.avatar?.previewImage?.small}`
      );
    }

    console.log("-----------------------------------");
  } else {
    console.log(`Coin not found: ${coinAddress}`);
  }
}

async function fetchMostValuableCoins(after?: string) {
  const response = await getCoinsMostValuable({
    count: 10000,
    after,
  });

  console.log("Fetched top coins:");

  const coins = response.data?.exploreList?.edges || [];

  for (const coin of coins) {
    const coinAddress = coin.node?.address;
    if (coinAddress) {
      await fetchCoinDetails(coinAddress as Address);
      await fetchCoinComments(coinAddress as Address);
    }
  }

  const nextPageCursor = response.data?.exploreList?.pageInfo?.endCursor;
  if (nextPageCursor) {
    console.log("Next page cursor for coins:", nextPageCursor);
    await fetchMostValuableCoins(nextPageCursor);
  }
}

fetchMostValuableCoins();
