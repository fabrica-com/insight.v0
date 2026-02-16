import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { PurchasePricingTool } from "@/components/purchase-pricing-tool"

export default function PurchasePricingPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">買取・仕入推奨価格</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">車両スペックを指定して、最適な仕入れ価格帯と販売可能性を分析</p>
            </div>

            <PurchasePricingTool />
          </div>
        </main>
      </div>
    </div>
  )
}
