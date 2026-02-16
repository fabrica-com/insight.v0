import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CompetitorAnalysis } from "@/components/competitor-analysis"
import { PricingInsights } from "@/components/pricing-insights"
import { TrendingVehicles } from "@/components/trending-vehicles"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1600px] space-y-8">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
                <p className="text-muted-foreground mt-0.5 text-sm">リアルタイムの市場動向と販売インサイトを確認して、最適な仕入れと価格戦略を立てましょう。</p>
              </div>
              <QuickActions />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
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
