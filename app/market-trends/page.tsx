import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MarketTrendsAnalysis } from "@/components/market-trends-analysis"
import { BarChart3 } from "lucide-react"

export default function MarketTrendsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="border-b border-border bg-gradient-to-r from-card via-card to-chart-2/5">
            <div className="mx-auto max-w-[1800px] px-6 py-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-chart-2 to-primary text-white shadow-lg shadow-chart-2/20">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">車種別相場</h1>
                  <p className="text-muted-foreground mt-0.5">メーカー・車種・モデル別の市場相場とリセールバリューを分析</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1800px] p-6">
            <MarketTrendsAnalysis />
          </div>
        </main>
      </div>
    </div>
  )
}
