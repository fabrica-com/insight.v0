"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { PricingOptimization } from "@/components/pricing-optimization"
import { DollarSign } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="border-b border-border bg-gradient-to-r from-card via-card to-chart-2/5">
            <div className="mx-auto max-w-[1800px] px-6 py-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-chart-2 to-success text-white shadow-lg shadow-success/20">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">価格最適化</h1>
                  <p className="text-muted-foreground mt-0.5">自社在庫のプライシング評価と最適化推奨</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1800px] p-6">
            <PricingOptimization />
          </div>
        </main>
      </div>
    </div>
  )
}
