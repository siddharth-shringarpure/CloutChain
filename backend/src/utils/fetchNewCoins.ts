import { getCoinsNew } from "@zoralabs/coins-sdk";

type CoinNode = {
  id?: string;
  address?: string;
  name?: string;
  symbol?: string;
  description?: string;
  totalSupply?: string;
  totalVolume?: string;
  volume24h?: string;
  createdAt?: string;
  creatorAddress?: string;
  marketCap?: string;
  marketCapDelta24h?: string;
  chainId?: number;
  uniqueHolders?: string;
  creatorProfile?: {
    handle?: string;
    id?: string;
    avatar?: {
      previewImage?: {
        blurhash?: string;
        small?: string;
      };
    };
  };
  avatar?: {
    previewImage?: {
      blurhash?: string;
      medium?: string;
      small?: string;
    };
  };
  transfers?: {
    count?: number;
  };
  mediaContent?: {
    previewImage?: {
      blurhash?: string;
      medium?: string;
      small?: string;
    };
    mimeType?: string;
    originalUri?: string;
  };
  creatorEarnings?: any;
};

type CoinEdge = {
  node?: CoinNode;
};

export async function fetchNewCoins() {
  const response = await getCoinsNew({
    count: 10,
    after: undefined,
  });

  const coins = response?.data?.exploreList?.edges || [];

  const formattedCoins = coins
    // @ts-ignore
    .map((edge: CoinEdge) => {
      const node = edge.node;
      if (!node) return null;

      return {
        id: node.id ?? "",
        address: node.address ?? "",
        name: node.name ?? "",
        symbol: node.symbol ?? "",
        description: node.description ?? "",
        totalSupply: parseFloat(node.totalSupply ?? "0"),
        totalVolume: parseFloat(node.totalVolume ?? "0"),
        volume24h: parseFloat(node.volume24h ?? "0"),
        createdAt: node.createdAt?.replace("T", " ") ?? "",
        creatorAddress: node.creatorAddress ?? "",
        marketCap: parseFloat(node.marketCap ?? "0"),
        marketCapDelta24h: parseFloat(node.marketCapDelta24h ?? "0"),
        chainId: node.chainId ?? 0,
        uniqueHolders: parseFloat(node.uniqueHolders ?? "0"),
        handle: node.creatorProfile?.handle ?? "",
        transferCount: node.transfers?.count ?? 0,
        avatarBlurhash: node.avatar?.previewImage?.blurhash ?? "",
        updatedAt: new Date().toISOString().replace("T", " ").slice(0, 23),
        avatarPreviewUrl: node.avatar?.previewImage?.medium ?? "",
        avatarSmallUrl: node.avatar?.previewImage?.small ?? "",
        blurhash: node.mediaContent?.previewImage?.blurhash ?? "",
        creatorEarnings: JSON.stringify(node.creatorEarnings ?? []),
        mediumImageUrl: node.mediaContent?.previewImage?.medium ?? "",
        mimeType: node.mediaContent?.mimeType ?? "",
        originalImageUrl: node.mediaContent?.originalUri ?? "",
        previewImageUrl: node.mediaContent?.previewImage?.small ?? "",
        creatorProfileAvatarBlurhash:
          node.creatorProfile?.avatar?.previewImage?.blurhash ?? "",
        creatorProfileAvatarUrl:
          node.creatorProfile?.avatar?.previewImage?.small ?? "",
        creatorProfileHandle: node.creatorProfile?.handle ?? "",
        creatorProfileId: node.creatorProfile?.id ?? "",
      };
    })
    .filter(Boolean);

  return formattedCoins;
}
