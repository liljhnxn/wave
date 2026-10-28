"use client";

import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { botchainTestnet } from "@/config/chain";
import { shortenAddress } from "@/config/contract";
import { useState, useEffect } from "react";
import { Wallet, LogOut, AlertCircle, ChevronDown, CheckCircle2 } from "lucide-react";

export function Header() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending: isConnecting, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [mounted, setMounted] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState<boolean>(true);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setHasMetaMask(Boolean((window as unknown as { ethereum?: unknown }).ethereum));
    }
  }, []);

  const isWrongNetwork = isConnected && chain?.id !== botchainTestnet.id;

  const handleConnect = async () => {
    if (!hasMetaMask) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    const injectedConnector = connectors[0];
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    }
  };

  const handleSwitchToBotchain = () => {
    switchChain({ chainId: botchainTestnet.id });
  };

  if (!mounted) {
    return (
      <header className="w-full border-b border-white/[0.06] bg-charcoal-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">👋</span>
            <span className="font-semibold text-lg tracking-tight text-white">Wave</span>
          </div>
          <div className="h-9 w-32 rounded-lg bg-charcoal-800 animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="w-full border-b border-white/[0.06] bg-charcoal-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-accent/15 border border-purple-accent/30 flex items-center justify-center text-lg shadow-sm">
            👋
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white leading-none">Wave</span>
            <span className="text-[11px] text-gray-400 font-medium tracking-normal mt-0.5">Botchain Web3</span>
          </div>
        </div>

        {/* Network and Wallet Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Network Badge */}
          {isConnected && (
            <div className="hidden sm:flex items-center">
              {isWrongNetwork ? (
                <button
                  onClick={handleSwitchToBotchain}
                  disabled={isSwitching}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors"
                  title="Click to switch to Botchain Testnet"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{isSwitching ? "Switching..." : "Switch to Botchain"}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-dim border border-emerald-border text-emerald-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Botchain Testnet (968)</span>
                </div>
              )}
            </div>
          )}

          {/* Connect / Account Button */}
          {!isConnected ? (
            <div className="flex flex-col items-end">
              <button
                id="connect-wallet-btn"
                onClick={handleConnect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-purple-accent hover:bg-purple-hover text-white shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wallet className="w-4 h-4" />
                <span>
                  {!hasMetaMask
                    ? "Install MetaMask"
                    : isConnecting
                    ? "Connecting..."
                    : "Connect Wallet"}
                </span>
              </button>
              {connectError && (
                <span className="text-[11px] text-red-400 mt-1 max-w-[200px] truncate">
                  {connectError.message.includes("User rejected")
                    ? "Connection cancelled"
                    : "Failed to connect"}
                </span>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-charcoal-800 border border-white/10 hover:border-purple-accent/40 text-gray-200 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-xs sm:text-sm">{shortenAddress(address)}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Dropdown for Disconnect / Info */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-charcoal-850 border border-white/10 shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-white/[0.06]">
                    <p className="text-gray-400">Connected as</p>
                    <p className="font-mono text-gray-200 font-semibold truncate mt-0.5">{address}</p>
                  </div>
                  
                  {isWrongNetwork && (
                    <div className="p-2">
                      <button
                        onClick={() => {
                          handleSwitchToBotchain();
                          setShowDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-left transition-colors font-medium"
                      >
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Switch to Botchain Testnet</span>
                      </button>
                    </div>
                  )}

                  <div className="p-1">
                    <button
                      onClick={() => {
                        disconnect();
                        setShowDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
