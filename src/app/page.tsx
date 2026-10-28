"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { WaveActionCard } from "@/components/WaveActionCard";
import { RecentWaves } from "@/components/RecentWaves";
import { Footer } from "@/components/Footer";
import { ContractNotice } from "@/components/ContractNotice";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleWaveSuccess = () => {
    // Increment trigger to signal StatsBar and RecentWaves to refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-charcoal-950 text-gray-200">
      <Header />

      <main className="flex-1 flex flex-col justify-start">
        <Hero />
        <ContractNotice />
        <StatsBar refreshTrigger={refreshTrigger} />
        <WaveActionCard onWaveSuccess={handleWaveSuccess} />
        <RecentWaves refreshTrigger={refreshTrigger} />
      </main>

      <Footer />
    </div>
  );
}
