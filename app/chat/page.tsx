"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AIAnalysisChat } from "@/components/ai-analysis-chat"
import { ConsultantChat } from "@/components/consultant-chat"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Flame, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type ChatMode = "data-analysis" | "consultant" | null

function ChatPageContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") as ChatMode

  // 選択画面
  if (!mode || (mode !== "data-analysis" && mode !== "consultant")) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto w-full max-w-4xl space-y-6">
              <div className="border-b border-border pb-6">
                <h1 className="text-2xl font-bold tracking-tight">AI分析・コンサルティング</h1>
                <p className="text-muted-foreground mt-0.5 text-sm">データ分析または経営コンサルタントを選択してください</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Link href="/chat?mode=data-analysis">
                  <Card className="h-full cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30">
                    <CardContent className="flex flex-col items-center p-8 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                        <BarChart3 className="h-7 w-7" />
                      </div>
                      <h2 className="text-lg font-semibold">データ分析</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        自然言語で市場データや販売分析について質問
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/chat?mode=consultant">
                  <Card className="h-full cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30">
                    <CardContent className="flex flex-col items-center p-8 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-chart-3/10 text-chart-3 mb-4">
                        <Flame className="h-7 w-7" />
                      </div>
                      <h2 className="text-lg font-semibold">経営コンサルタント</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        経営課題の相談・壁打ちチャット
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // チャット画面
  const title = mode === "data-analysis" ? "データ分析" : "経営コンサルタント"
  const subtitle =
    mode === "data-analysis"
      ? "自然言語でデータ分析と市場インサイトを取得"
      : "経営課題の相談・壁打ちチャット"

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 flex flex-col overflow-hidden p-3 md:p-4 lg:p-6">
          <div className="flex min-h-0 w-full flex-1 flex-col gap-3 md:gap-4 lg:gap-6">
            <div className="flex shrink-0 items-center gap-3 md:gap-4 border-b border-border pb-3 md:pb-4 lg:pb-6">
              <Link href="/chat">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground mt-0.5 text-sm">{subtitle}</p>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              {mode === "data-analysis" ? <AIAnalysisChat /> : <ConsultantChat />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 flex items-center justify-center p-6">
            <div className="text-muted-foreground">読み込み中...</div>
          </main>
        </div>
      </div>
    }>
      <ChatPageContent />
    </Suspense>
  )
}
