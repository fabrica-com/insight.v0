import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AIAnalysisChat } from "@/components/ai-analysis-chat"
import { Sparkles } from "lucide-react"

export default function RegionalPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar defaultCollapsed />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-hidden">
          <div className="border-b border-border bg-gradient-to-r from-card via-card to-chart-4/5">
            <div className="mx-auto max-w-[1600px] px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-chart-4 to-primary text-white shadow-lg shadow-chart-4/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">AI分析アシスタント</h1>
                  <p className="text-muted-foreground text-sm mt-0.5">自然言語でデータ分析と市場インサイトを取得</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[calc(100%-85px)] px-6 py-4">
            <div className="mx-auto h-full max-w-[1600px]">
              <AIAnalysisChat />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
