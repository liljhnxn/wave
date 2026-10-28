import { isAddress } from "viem";

export const WAVE_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_WAVE_CONTRACT_ADDRESS || "") as `0x${string}`;

export const WAVE_ABI = [
  {
    type: "function",
    name: "sendWave",
    stateMutability: "nonpayable",
    inputs: [{ name: "recipient", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getTotalWaves",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getAllWaves",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "sender", type: "address" },
          { name: "recipient", type: "address" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getRecentWaves",
    stateMutability: "view",
    inputs: [
      { name: "limit", type: "uint256" },
      { name: "offset", type: "uint256" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        components: [
          { name: "sender", type: "address" },
          { name: "recipient", type: "address" },
          { name: "timestamp", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "wavesSent",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "wavesReceived",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "event",
    name: "WaveSent",
    inputs: [
      { indexed: true, name: "sender", type: "address" },
      { indexed: true, name: "recipient", type: "address" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
  },
  {
    type: "error",
    name: "ZeroAddressNotAllowed",
    inputs: [],
  },
  {
    type: "error",
    name: "CannotWaveToSelf",
    inputs: [],
  },
] as const;

export function shortenAddress(address?: string | null): string {
  if (!address) return "";
  if (!isAddress(address)) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatTimeAgo(timestampSeconds: number | bigint): string {
  const ts = Number(timestampSeconds) * 1000;
  if (!ts || isNaN(ts)) return "Just now";
  
  const now = Date.now();
  const diffSeconds = Math.max(0, Math.floor((now - ts) / 1000));

  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
