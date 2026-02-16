import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TrendingAnalysis } from "@/components/trending-analysis"

export default function TrendingPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1800px] space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">売れ筋分析</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">地域・期間を絞り込んでトレンド車両を分析</p>
            </div>

            <TrendingAnalysis />
          </div>
        </main>
      </div>
    </div>
  )
}
