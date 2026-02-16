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
          <div className="mx-auto h-full max-w-[1600px]">
            <AIAnalysisChat />
          </div>
        </main>
      </div>
    </div>
  )
}
