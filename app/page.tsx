import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MarketOverview } from "@/components/market-overview"
import { CompetitorAnalysis } from "@/components/competitor-analysis"
import { PricingInsights } from "@/components/pricing-insights"
import { TrendingVehicles } from "@/components/trending-vehicles"

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1600px] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-balance">市場概況</h1>
                <p className="text-muted-foreground mt-1">リアルタイムの市場動向と販売インサイト</p>
              </div>
            </div>

            <MarketOverview />

            <div className="grid gap-6 lg:grid-cols-2">
              <CompetitorAnalysis />
              <PricingInsights />
            </div>

            <TrendingVehicles />
          </div>
        </main>
      </div>
    </div>
  )
}
