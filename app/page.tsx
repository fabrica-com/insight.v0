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

        <main className="flex-1 overflow-y-auto">
          <div className="relative border-b border-border bg-gradient-to-br from-card via-card to-muted/30">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-chart-1/5 via-transparent to-transparent" />
            <div className="relative mx-auto max-w-[1600px] px-6 py-8">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-medium text-primary mb-1">Dashboard</p>
                  <h1 className="text-4xl font-bold tracking-tight text-foreground">ダッシュボード</h1>
                  <p className="text-muted-foreground mt-2 max-w-xl text-balance">
                    リアルタイムの市場動向と販売インサイトを確認して、最適な仕入れと価格戦略を立てましょう。
                  </p>
                </div>
                <QuickActions />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1600px] p-6 space-y-8">
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
