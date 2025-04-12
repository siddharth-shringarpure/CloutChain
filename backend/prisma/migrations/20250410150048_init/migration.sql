-- CreateTable
CREATE TABLE "Coin" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "description" TEXT,
    "totalSupply" TEXT,
    "totalVolume" TEXT,
    "volume24h" TEXT,
    "marketCap" TEXT,
    "marketCapDelta24h" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "creatorAddress" TEXT,
    "uniqueHolders" INTEGER,
    "transferCount" INTEGER,
    "sentiment_similarity" DOUBLE PRECISION,
    "embed_similarity" DOUBLE PRECISION,
    "finance_similarity" DOUBLE PRECISION,
    "total_similarity" DOUBLE PRECISION,
    "mediaMimeType" TEXT,
    "mediaOriginalUri" TEXT,
    "mediaPreviewUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "address" TEXT NOT NULL,
    "handle" TEXT,
    "avatarUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("address")
);

-- CreateTable
CREATE TABLE "CreatorEarning" (
    "id" TEXT NOT NULL,
    "amountUsd" TEXT NOT NULL,
    "coinId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorEarning_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coin_address_key" ON "Coin"("address");

-- CreateIndex
CREATE INDEX "Coin_creatorAddress_idx" ON "Coin"("creatorAddress");

-- CreateIndex
CREATE INDEX "CreatorEarning_coinId_idx" ON "CreatorEarning"("coinId");

-- AddForeignKey
ALTER TABLE "Coin" ADD CONSTRAINT "Coin_creatorAddress_fkey" FOREIGN KEY ("creatorAddress") REFERENCES "Profile"("address") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorEarning" ADD CONSTRAINT "CreatorEarning_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "Coin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
