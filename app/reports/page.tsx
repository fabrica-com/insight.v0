import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ReportsDashboard } from "@/components/reports-dashboard"

export default function ReportsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1800px] space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">レポート</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">市場分析と自社パフォーマンスの統合レポート</p>
            </div>

            <ReportsDashboard />
          </div>
        </main>
      </div>
    </div>
  )
}
