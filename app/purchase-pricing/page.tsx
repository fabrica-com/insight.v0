import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { PurchasePricingTool } from "@/components/purchase-pricing-tool"

export default function PurchasePricingPage() {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">仕入れ推奨価格</h1>
              <p className="text-muted-foreground mt-2">
                車両スペックを指定して、最適な仕入れ価格帯と販売可能性を分析
              </p>
            </div>
            <PurchasePricingTool />
          </div>
        </main>
      </div>
    </div>
  )
}
