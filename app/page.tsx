import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1600px] space-y-6">
            <div className="border-b border-border pb-4">
              <h1 className="text-2xl font-bold tracking-tight">ダッシュボード</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                自店のパフォーマンスと市場動向を一目で確認できます。
              </p>
            </div>

            <DashboardOverview />
          </div>
        </main>
      </div>
    </div>
  )
}
