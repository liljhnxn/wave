export function Hero() {
  return (
    <section className="text-center pt-8 pb-6 px-4">
      {/* Large animated wave icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-charcoal-850 border border-purple-accent/30 shadow-lg shadow-purple-900/10 mb-6 group cursor-default">
        <span className="text-4xl sm:text-5xl inline-block origin-bottom-right animate-wave-hand select-none">
          👋
        </span>
      </div>

      {/* Main headings */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
        A little wave goes a long way.
      </h1>

      <p className="mt-3 text-base sm:text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
        Connect your wallet and spread good vibes.
      </p>

      {/* Tagline pill */}
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-850 border border-white/[0.08] text-xs text-gray-300 font-medium">
        <span>Drop a wave. Get one back.</span>
        <span className="text-purple-light">👋</span>
      </div>
    </section>
  );
}
