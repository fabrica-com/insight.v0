import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CompetitorComparison } from "@/components/competitor-comparison"
import { Users } from "lucide-react"

export default function CompetitorsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="border-b border-border bg-gradient-to-r from-card via-card to-primary/5">
            <div className="mx-auto max-w-[1800px] px-6 py-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4 text-white shadow-lg shadow-primary/20">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">競合店分析</h1>
                  <p className="text-muted-foreground mt-0.5">複数の競合店を選択して在庫・販売動向を比較</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1800px] p-6">
            <CompetitorComparison />
          </div>
        </main>
      </div>
    </div>
  )
}
