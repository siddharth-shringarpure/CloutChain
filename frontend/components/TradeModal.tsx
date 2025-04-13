"use client";

import { useState } from "react";
import { tradeCoin, tradeCoinCall } from "@zoralabs/coins-sdk";
import { type Address, parseEther } from "viem";
import { useAccount, useWriteContract } from "wagmi";
import { createPublicClient, createWalletClient, http } from "viem";
import { base } from "viem/chains";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "./ui/use-toast";

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  coinAddress: string;
  coinName?: string;
  predictionScore?: number;
}

export default function TradeModal({
  isOpen,
  onClose,
  coinAddress,
  coinName = "Unknown Coin",
  predictionScore = 0,
}: TradeModalProps) {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [tradeDirection, setTradeDirection] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("0.1");
  const [minAmountOut, setMinAmountOut] = useState("0");
  const [tradeTab, setTradeTab] = useState("instant");
  const [isProcessing, setIsProcessing] = useState(false);

  const tradeParams = {
    direction: tradeDirection,
    target: coinAddress as Address,
    args: {
      recipient: (address || "0x") as Address,
      orderSize:
        tradeDirection === "buy"
          ? parseEther(amount || "0.1")
          : parseEther(amount || "100"),
      minAmountOut: parseEther(minAmountOut || "0"),
      tradeReferrer: "0x0000000000000000000000000000000000000000" as Address,
    },
  };

  const contractCallParams = tradeCoinCall(tradeParams);

  const { writeContractAsync, isPending, isSuccess, error } =
    useWriteContract();

  const handleInstantTrade = async () => {
    if (!isConnected || !address || !coinAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      await writeContractAsync({
        ...contractCallParams,
        value:
          tradeDirection === "buy" ? tradeParams.args.orderSize : BigInt(0),
      });

      toast({
        title: "Trade Successful",
        description: "Your transaction has been submitted",
      });

      onClose();
    } catch (err) {
      console.error("Trade error:", err);
      toast({
        title: "Trade Failed",
        description:
          err instanceof Error ? err.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Manual trade implementation
  const executeManualTrade = async () => {
    if (!isConnected || !address || !coinAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);

      // Set up viem clients
      const RPC_URL =
        process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.zora.energy";

      const publicClient = createPublicClient({
        chain: base,
        transport: http(RPC_URL),
      });

      const walletClient = createWalletClient({
        account: address as Address,
        chain: base,
        transport: http(RPC_URL),
      });

      // Define trade parameters
      const tradeParams = {
        direction: tradeDirection,
        target: coinAddress as Address,
        args: {
          recipient: address as Address,
          orderSize:
            tradeDirection === "buy"
              ? parseEther(amount || "0.1")
              : parseEther(amount || "100"),
          minAmountOut: parseEther(minAmountOut || "0"),
          tradeReferrer:
            "0x0000000000000000000000000000000000000000" as Address,
        },
      };

      // Execute the trade
      const result = await tradeCoin(tradeParams, walletClient, publicClient);

      console.log("Transaction hash:", result.hash);
      console.log("Trade details:", result.trade);

      toast({
        title: "Trade Successful",
        description: `Transaction hash: ${result.hash.slice(0, 10)}...`,
      });

      onClose();
    } catch (error) {
      console.error("Trade error:", error);
      toast({
        title: "Trade Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTrade = () => {
    if (tradeTab === "instant") {
      handleInstantTrade();
    } else {
      executeManualTrade();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-purple-900/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Trade Coin</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {coinName} (Prediction Score: {predictionScore}%)
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="instant"
          className="w-full"
          onValueChange={setTradeTab}
        >
          <TabsList className="grid grid-cols-2 bg-zinc-800">
            <TabsTrigger value="instant">Instant Trade</TabsTrigger>
            <TabsTrigger value="manual">Manual Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="instant" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="trade-type">Trade Type</Label>
              <Select
                defaultValue="buy"
                onValueChange={(value) =>
                  setTradeDirection(value as "buy" | "sell")
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select trade type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                {tradeDirection === "buy" ? "ETH Amount" : "Token Amount"}
              </Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder={
                  tradeDirection === "buy" ? "0.1 ETH" : "100 Tokens"
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Coin Address</Label>
              <div className="p-2 bg-zinc-800 rounded-md border border-zinc-700 text-sm font-mono overflow-hidden text-ellipsis">
                {coinAddress}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="manual-trade-type">Trade Type</Label>
              <Select
                defaultValue="buy"
                onValueChange={(value) =>
                  setTradeDirection(value as "buy" | "sell")
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select trade type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manual-amount">
                {tradeDirection === "buy" ? "ETH Amount" : "Token Amount"}
              </Label>
              <Input
                id="manual-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder={
                  tradeDirection === "buy" ? "0.1 ETH" : "100 Tokens"
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="min-amount">Minimum Amount Out</Label>
              <Input
                id="min-amount"
                value={minAmountOut}
                onChange={(e) => setMinAmountOut(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Advanced Settings</Label>
              <div className="p-2 bg-zinc-800 rounded-md border border-zinc-700 text-xs">
                These settings are for advanced users. Use with caution.
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded-md border border-red-900/30">
            {error instanceof Error ? error.message : "An error occurred"}
          </div>
        )}

        {isSuccess && (
          <div className="text-green-400 text-sm bg-green-900/20 p-2 rounded-md border border-green-900/30">
            Transaction successful!
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleTrade}
            disabled={!isConnected || isPending || isProcessing}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isPending || isProcessing
              ? "Processing..."
              : `${tradeDirection === "buy" ? "Buy" : "Sell"} Now`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
