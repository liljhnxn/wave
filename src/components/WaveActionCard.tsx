"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain, useConnect } from "wagmi";
import { isAddress, zeroAddress } from "viem";
import { WAVE_ABI, WAVE_CONTRACT_ADDRESS } from "@/config/contract";
import { botchainTestnet } from "@/config/chain";
import { Loader2, ExternalLink, CheckCircle2, AlertTriangle, ArrowRight, UserCheck } from "lucide-react";

interface WaveActionCardProps {
  onWaveSuccess: () => void;
}

export function WaveActionCard({ onWaveSuccess }: WaveActionCardProps) {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();

  const [recipient, setRecipient] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const isWrongNetwork = isConnected && chain?.id !== botchainTestnet.id;

  // Wagmi contract write
  const {
    data: txHash,
    isPending: isWritePending,
    error: writeError,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  // Wait for transaction confirmation
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Call onWaveSuccess when transaction is confirmed
  useEffect(() => {
    if (isConfirmed) {
      onWaveSuccess();
    }
  }, [isConfirmed, onWaveSuccess]);

  // Recipient input validation
  const validateRecipient = (val: string): boolean => {
    const trimmed = val.trim();
    if (!trimmed) {
      setValidationError("Please enter a recipient address.");
      return false;
    }
    if (!isAddress(trimmed)) {
      setValidationError("Invalid Ethereum address format (must start with 0x...).");
      return false;
    }
    if (trimmed.toLowerCase() === zeroAddress.toLowerCase()) {
      setValidationError("Cannot send a wave to the zero address.");
      return false;
    }
    if (address && trimmed.toLowerCase() === address.toLowerCase()) {
      setValidationError("You cannot wave at yourself! Spread the vibes to another wallet.");
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSendWave = () => {
    if (!validateRecipient(recipient)) {
      return;
    }

    if (!WAVE_CONTRACT_ADDRESS) {
      setValidationError("Contract address not configured in environment.");
      return;
    }

    resetWrite();
    writeContract({
      address: WAVE_CONTRACT_ADDRESS,
      abi: WAVE_ABI,
      functionName: "sendWave",
      args: [recipient.trim() as `0x${string}`],
      chainId: botchainTestnet.id,
    });
  };

  const isBusy = isWritePending || isConfirming;

  const handleResetForm = () => {
    setRecipient("");
    resetWrite();
    setValidationError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-10">
      <div className="rounded-3xl bg-charcoal-850/90 border border-white/[0.08] shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-dim border border-purple-border text-xs font-semibold text-purple-light mb-2">
            <span>Direct Wave</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Send a wave to someone
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Enter any EVM address to record an on-chain wave on Botchain Testnet.
          </p>
        </div>

        {/* Action Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="recipient-input" className="block text-xs font-medium text-gray-300 mb-2">
              Recipient Wallet Address
            </label>
            <div className="relative">
              <input
                id="recipient-input"
                type="text"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => {
                  setRecipient(e.target.value);
                  if (validationError) validateRecipient(e.target.value);
                }}
                disabled={isBusy || isConfirmed}
                className="w-full px-4 py-3 rounded-xl bg-charcoal-900 border border-white/[0.1] focus:border-purple-accent/60 focus:ring-1 focus:ring-purple-accent/60 text-white font-mono text-sm placeholder-gray-600 transition outline-none disabled:opacity-50"
              />
              {recipient && !isBusy && !isConfirmed && (
                <button
                  type="button"
                  onClick={() => setRecipient("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300 px-1 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>
            {validationError && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{validationError}</span>
              </p>
            )}
          </div>

          {/* Action Button States */}
          {!isConnected ? (
            <button
              id="connect-wallet-action-btn"
              type="button"
              onClick={() => {
                const conn = connectors[0];
                if (conn) connect({ connector: conn });
              }}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-purple-accent hover:bg-purple-hover transition-all duration-200 shadow-md flex items-center justify-center gap-2"
            >
              <span>Connect Wallet to Wave</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : isWrongNetwork ? (
            <button
              id="switch-network-action-btn"
              type="button"
              onClick={() => switchChain({ chainId: botchainTestnet.id })}
              disabled={isSwitching}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-amber-200 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>{isSwitching ? "Switching Network..." : "Switch to Botchain Testnet (968)"}</span>
            </button>
          ) : isConfirmed ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-emerald-dim border border-emerald-border text-emerald-accent flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-white">Wave confirmed on-chain! 👋</p>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Your wave has been permanently recorded on Botchain Testnet.
                  </p>
                  {txHash && (
                    <a
                      href={`https://scan.bohr.life/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-purple-light hover:underline mt-2 font-mono"
                    >
                      <span>View Transaction on Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full py-3 px-4 rounded-xl font-medium text-sm text-gray-300 bg-charcoal-800 hover:bg-charcoal-700 transition"
              >
                Send Another Wave
              </button>
            </div>
          ) : (
            <button
              id="send-wave-btn"
              type="button"
              onClick={handleSendWave}
              disabled={isBusy || !recipient}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-base text-white bg-purple-accent hover:bg-purple-hover active:scale-[0.99] transition-all duration-200 shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-accent flex items-center justify-center gap-2"
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>
                    {isWritePending ? "Waiting for signature..." : "Confirming transaction..."}
                  </span>
                </>
              ) : (
                <>
                  <span>👋 Send a Wave</span>
                </>
              )}
            </button>
          )}

          {/* Pending Transaction Information */}
          {txHash && isConfirming && (
            <div className="p-3.5 rounded-xl bg-charcoal-900 border border-purple-accent/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-accent" />
                <span className="text-gray-300">Transaction pending on Botchain...</span>
              </div>
              <a
                href={`https://scan.bohr.life/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-light hover:underline flex items-center gap-1 font-mono"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Error display */}
          {(writeError || confirmError) && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <div className="flex-1">
                <p className="font-medium text-red-200">Transaction Failed</p>
                <p className="mt-0.5 text-red-300/80 break-words">
                  {writeError?.message?.includes("User rejected")
                    ? "Transaction was rejected in MetaMask."
                    : writeError?.message || confirmError?.message || "An unexpected error occurred."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
