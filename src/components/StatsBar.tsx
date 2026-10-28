"use client";

import { useAccount, useReadContract } from "wagmi";
import { WAVE_ABI, WAVE_CONTRACT_ADDRESS } from "@/config/contract";
import { botchainTestnet } from "@/config/chain";
import { Sparkles, Send, Inbox } from "lucide-react";

interface StatsBarProps {
  refreshTrigger?: number;
}

export function StatsBar({ refreshTrigger }: StatsBarProps) {
  const { address, isConnected } = useAccount();

  // Read total waves from smart contract
  const { data: totalWavesData, isLoading: isLoadingTotal, refetch: refetchTotal } = useReadContract({
    address: WAVE_CONTRACT_ADDRESS,
    abi: WAVE_ABI,
    functionName: "getTotalWaves",
    chainId: botchainTestnet.id,
    query: {
      enabled: Boolean(WAVE_CONTRACT_ADDRESS),
    },
  });

  // Read waves sent by connected wallet
  const { data: userSentData, isLoading: isLoadingSent, refetch: refetchSent } = useReadContract({
    address: WAVE_CONTRACT_ADDRESS,
    abi: WAVE_ABI,
    functionName: "wavesSent",
    args: address ? [address] : undefined,
    chainId: botchainTestnet.id,
    query: {
      enabled: Boolean(WAVE_CONTRACT_ADDRESS && address),
    },
  });

  // Read waves received by connected wallet
  const { data: userReceivedData, isLoading: isLoadingReceived, refetch: refetchReceived } = useReadContract({
    address: WAVE_CONTRACT_ADDRESS,
    abi: WAVE_ABI,
    functionName: "wavesReceived",
    args: address ? [address] : undefined,
    chainId: botchainTestnet.id,
    query: {
      enabled: Boolean(WAVE_CONTRACT_ADDRESS && address),
    },
  });

  const totalWaves = totalWavesData !== undefined ? Number(totalWavesData) : 0;
  const userSent = userSentData !== undefined ? Number(userSentData) : 0;
  const userReceived = userReceivedData !== undefined ? Number(userReceivedData) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Waves */}
        <div className="rounded-2xl bg-charcoal-850/80 border border-white/[0.07] p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-gray-400">Total Waves</p>
            <p className="text-2xl font-bold text-white mt-1">
              {isLoadingTotal ? (
                <span className="inline-block w-8 h-6 bg-charcoal-700 animate-pulse rounded" />
              ) : (
                totalWaves.toLocaleString()
              )}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-accent/10 border border-purple-accent/20 flex items-center justify-center text-purple-accent">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Waves Sent by Connected Wallet */}
        <div className="rounded-2xl bg-charcoal-850/80 border border-white/[0.07] p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-gray-400">You Sent</p>
            <p className="text-2xl font-bold text-white mt-1">
              {!isConnected ? (
                <span className="text-sm font-normal text-gray-500">—</span>
              ) : isLoadingSent ? (
                <span className="inline-block w-8 h-6 bg-charcoal-700 animate-pulse rounded" />
              ) : (
                userSent.toLocaleString()
              )}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-purple-dim border border-purple-border flex items-center justify-center text-purple-light">
            <Send className="w-4 h-4" />
          </div>
        </div>

        {/* Waves Received by Connected Wallet */}
        <div className="rounded-2xl bg-charcoal-850/80 border border-white/[0.07] p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-gray-400">You Received</p>
            <p className="text-2xl font-bold text-white mt-1">
              {!isConnected ? (
                <span className="text-sm font-normal text-gray-500">—</span>
              ) : isLoadingReceived ? (
                <span className="inline-block w-8 h-6 bg-charcoal-700 animate-pulse rounded" />
              ) : (
                userReceived.toLocaleString()
              )}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-dim border border-emerald-border flex items-center justify-center text-emerald-accent">
            <Inbox className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
