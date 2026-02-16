import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AIAnalysisChat } from "@/components/ai-analysis-chat"

export default function RegionalPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar defaultCollapsed />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-hidden p-6">
          <div className="mx-auto max-w-[1600px] space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">データ分析</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">自然言語でデータ分析と市場インサイトを取得</p>
            </div>

            <div className="h-[calc(100%-120px)]">
              <div className="mx-auto h-full max-w-[1600px]">
                <AIAnalysisChat />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
