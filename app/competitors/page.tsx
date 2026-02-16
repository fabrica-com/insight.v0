import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { CompetitorComparison } from "@/components/competitor-comparison"

export default function CompetitorsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1800px] space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">競合店分析</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">複数の競合店を選択して在庫・販売動向を比較</p>
            </div>

            <CompetitorComparison />
          </div>
        </main>
      </div>
    </div>
  )
}
