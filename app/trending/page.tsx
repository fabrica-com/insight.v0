"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TrendingAnalysis } from "@/components/trending-analysis"
import { ExportVehicleAnalysis } from "@/components/export-vehicle-analysis"
import { TrendingUp, Ship } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState<"domestic" | "export">("domestic")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1800px] space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">売れ筋分析</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                地域・期間を絞り込んでトレンド車両を分析
              </p>

              {/* Tab Switcher */}
              <div className="mt-4 flex gap-1 rounded-lg bg-muted p-1 w-fit">
                <button
                  onClick={() => setActiveTab("domestic")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                    activeTab === "domestic"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <TrendingUp className="h-4 w-4" />
                  国内売れ筋
                </button>
                <button
                  onClick={() => setActiveTab("export")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                    activeTab === "export"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Ship className="h-4 w-4" />
                  輸出車両
                </button>
              </div>
            </div>

            {activeTab === "domestic" ? (
              <TrendingAnalysis />
            ) : (
              <ExportVehicleAnalysis />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
