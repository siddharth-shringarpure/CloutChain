"use client";

import { WagmiProvider, createConfig } from "wagmi";
import { http, defineChain } from "viem";
import { metaMask } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Define Zora Sepolia as a custom chain
const zoraSepolia = defineChain({
  id: 999999999,
  name: "Zora Sepolia Testnet",
  network: "zora-sepolia",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://sepolia.rpc.zora.energy"] } },
  blockExplorers: {
    default: {
      name: "Zora Explorer",
      url: "https://sepolia.explorer.zora.energy",
    },
  },
});

// Configure wagmi with Zora Sepolia Testnet
const config = createConfig({
  chains: [zoraSepolia],
  connectors: [metaMask()],
  transports: {
    [zoraSepolia.id]: http("https://sepolia.rpc.zora.energy"),
  },
});

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
