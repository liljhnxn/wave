import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06] bg-charcoal-900/40 py-8 px-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
        {/* Branding & Tagline */}
        <div className="flex items-center gap-2">
          <span className="text-base">👋</span>
          <span className="font-semibold text-white">Wave</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">Drop a wave. Get one back.</span>
        </div>

        {/* Network & Explorer Link */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-charcoal-800 border border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-gray-300 font-medium">Botchain Testnet</span>
          </div>

          <a
            href="https://scan.bohr.life"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-400 hover:text-white transition"
          >
            <span>Explorer</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Disclaimer */}
        <div className="text-gray-500 text-[11px]">
          Experimental testnet application.
        </div>
      </div>
    </footer>
  );
}
