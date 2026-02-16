import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ConsultantChat } from "@/components/consultant-chat"

export default function ConsultantPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar defaultCollapsed />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-6">
            <div className="shrink-0 border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">経営コンサルタント</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">経営課題の相談・壁打ちチャット</p>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <ConsultantChat />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
