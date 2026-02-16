import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ReportsDashboard } from "@/components/reports-dashboard"
import { FileText } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="border-b border-border bg-gradient-to-r from-card via-card to-chart-5/5">
            <div className="mx-auto max-w-[1800px] px-6 py-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-chart-5 to-destructive text-white shadow-lg shadow-chart-5/20">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">レポート</h1>
                  <p className="text-muted-foreground mt-0.5">市場分析と自社パフォーマンスの統合レポート</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1800px] p-6">
            <ReportsDashboard />
          </div>
        </main>
      </div>
    </div>
  )
}
