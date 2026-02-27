"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StoreDetailPageContent } from "@/components/store-detail-page"
import { getStoreById } from "@/lib/store-data"

export default function StoreDetailPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = use(params)
  const store = getStoreById(Number(storeId))

  if (!store) {
    notFound()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1800px]">
            <StoreDetailPageContent store={store} />
          </div>
        </main>
      </div>
    </div>
  )
}
