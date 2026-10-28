import { AlertTriangle, Terminal, Code } from "lucide-react";
import { WAVE_CONTRACT_ADDRESS } from "@/config/contract";

export function ContractNotice() {
  if (WAVE_CONTRACT_ADDRESS && WAVE_CONTRACT_ADDRESS.length > 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
          <div className="text-xs space-y-2">
            <p className="font-semibold text-amber-100 text-sm">
              Smart Contract Not Configured Yet
            </p>
            <p className="text-amber-200/90 leading-relaxed">
              The <code className="bg-charcoal-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">NEXT_PUBLIC_WAVE_CONTRACT_ADDRESS</code> environment variable is not set. 
              The application is running in configuration mode.
            </p>
            <div className="p-2.5 rounded-lg bg-charcoal-900 border border-white/10 font-mono text-[11px] text-gray-300 space-y-1">
              <p className="text-gray-400 font-sans font-medium">To deploy and configure:</p>
              <p className="text-purple-light">1. npx hardhat run scripts/deploy.ts --network botchain</p>
              <p className="text-emerald-400">2. Set NEXT_PUBLIC_WAVE_CONTRACT_ADDRESS=0x... in .env.local</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
