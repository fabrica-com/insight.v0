import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ConsultantChat } from "@/components/consultant-chat"

export default function ConsultantPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar defaultCollapsed />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-hidden p-6">
          <div className="mx-auto h-full max-w-[1600px]">
            <ConsultantChat />
          </div>
        </main>
      </div>
    </div>
  )
}
