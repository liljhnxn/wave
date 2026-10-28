"use client";

import { useState } from "react";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { WAVE_ABI, WAVE_CONTRACT_ADDRESS, shortenAddress, formatTimeAgo } from "@/config/contract";
import { botchainTestnet } from "@/config/chain";
import { RotateCw, ExternalLink, ArrowRight, Clock, MessageSquareQuote, Check } from "lucide-react";

interface WaveRecord {
  sender: `0x${string}`;
  recipient: `0x${string}`;
  timestamp: bigint;
}

interface RecentWavesProps {
  refreshTrigger?: number;
}

export function RecentWaves({ refreshTrigger }: RecentWavesProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Read latest 20 waves directly from the contract
  const {
    data: wavesData,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useReadContract({
    address: WAVE_CONTRACT_ADDRESS,
    abi: WAVE_ABI,
    functionName: "getRecentWaves",
    args: [BigInt(20), BigInt(0)],
    chainId: botchainTestnet.id,
    query: {
      enabled: Boolean(WAVE_CONTRACT_ADDRESS),
    },
  });

  // Watch for real-time WaveSent events on Botchain Testnet
  useWatchContractEvent({
    address: WAVE_CONTRACT_ADDRESS,
    abi: WAVE_ABI,
    eventName: "WaveSent",
    chainId: botchainTestnet.id,
    enabled: Boolean(WAVE_CONTRACT_ADDRESS),
    onLogs() {
      refetch();
    },
  });

  const waves = (wavesData as WaveRecord[] | undefined) || [];

  const handleCopy = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(addr);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-16">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-white tracking-tight">Recent Waves</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-charcoal-800 text-gray-400 border border-white/[0.06]">
            {waves.length}
          </span>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white bg-charcoal-850 hover:bg-charcoal-800 border border-white/[0.06] transition disabled:opacity-50"
          title="Refresh feed"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin text-purple-light" : ""}`} />
          <span>{isRefetching ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Feed Container */}
      <div className="rounded-2xl bg-charcoal-850/60 border border-white/[0.08] overflow-hidden backdrop-blur-sm">
        {isLoading ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-purple-accent/30 border-t-purple-accent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-400">Loading on-chain waves from Botchain...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-xs text-red-400">Unable to load waves from RPC.</p>
            <button
              onClick={() => refetch()}
              className="mt-2 text-xs text-purple-light underline"
            >
              Try again
            </button>
          </div>
        ) : waves.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-charcoal-800 border border-white/[0.06] flex items-center justify-center mx-auto text-xl mb-3">
              👋
            </div>
            <p className="text-sm font-semibold text-gray-200">No waves recorded yet</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Be the first to connect your wallet and send an on-chain wave to a friend!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {waves.map((wave, index) => {
              const sender = wave.sender;
              const recipient = wave.recipient;
              const timestamp = wave.timestamp;

              return (
                <div
                  key={`${sender}-${recipient}-${timestamp.toString()}-${index}`}
                  className="p-4 sm:p-5 hover:bg-charcoal-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {/* Wave Participants */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg flex-shrink-0">👋</span>
                    <div className="flex items-center gap-1.5 flex-wrap text-xs sm:text-sm font-mono">
                      {/* Sender */}
                      <a
                        href={`https://scan.bohr.life/address/${sender}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-light hover:underline font-semibold"
                        title={sender}
                      >
                        {shortenAddress(sender)}
                      </a>

                      <ArrowRight className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />

                      {/* Recipient */}
                      <a
                        href={`https://scan.bohr.life/address/${recipient}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white hover:underline"
                        title={recipient}
                      >
                        {shortenAddress(recipient)}
                      </a>
                    </div>
                  </div>

                  {/* Timestamp & Explorer Link */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 self-end sm:self-auto">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>{formatTimeAgo(timestamp)}</span>
                    </div>

                    <a
                      href={`https://scan.bohr.life/address/${WAVE_CONTRACT_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded hover:bg-charcoal-700 text-gray-400 hover:text-white transition"
                      title="View contract on Botchain Explorer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RPC Notes / Transparency disclaimer */}
      <div className="mt-3 text-center">
        <p className="text-[11px] text-gray-500">
          Source of truth: On-chain contract state on Botchain Testnet (Chain ID 968).
        </p>
      </div>
    </div>
  );
}
