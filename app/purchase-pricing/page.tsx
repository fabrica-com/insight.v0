import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { PurchasePricingTool } from "@/components/purchase-pricing-tool"
import { ShoppingCart } from "lucide-react"

export default function PurchasePricingPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="border-b border-border bg-gradient-to-r from-card via-card to-chart-3/5">
            <div className="mx-auto max-w-7xl px-6 py-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-chart-3 to-warning text-white shadow-lg shadow-warning/20">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">買取・仕入推奨価格</h1>
                  <p className="text-muted-foreground mt-0.5">
                    車両スペックを指定して、最適な仕入れ価格帯と販売可能性を分析
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl p-6">
            <PurchasePricingTool />
          </div>
        </main>
      </div>
    </div>
  )
}
