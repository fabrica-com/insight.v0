import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { IndustryNews } from "@/components/industry-news"

export default function NewsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1800px] space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">{"業界ニュース"}</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">{"自動車業界の最新ニュースをAIが収集・要約します"}</p>
            </div>
            <IndustryNews />
          </div>
        </main>
      </div>
    </div>
  )
}
