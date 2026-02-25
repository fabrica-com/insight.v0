import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { QRCodeGenerator } from "@/components/qr-code-generator"

export default function QRGeneratorPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1800px] space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">QRコード生成</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                MEO口コミ誘導・SNSフォロー・LINE友だち追加など、商談席やPOP用のQRコードを作成・PDF出力
              </p>
            </div>
            <QRCodeGenerator />
          </div>
        </main>
      </div>
    </div>
  )
}
