"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { RetailSalesBook } from "@/components/retail-sales-book"

export default function RetailSalesBookPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1800px] space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">小売業販ブック</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                小売実績とオークション落札データを統合した業販価格分析ダッシュボード
              </p>
            </div>

            <RetailSalesBook />
          </div>
        </main>
      </div>
    </div>
  )
}
