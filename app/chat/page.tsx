"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Flame, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const AIAnalysisChat = dynamic(
  () => import("@/components/ai-analysis-chat").then((mod) => ({ default: mod.AIAnalysisChat })),
  { ssr: false }
)

const ConsultantChat = dynamic(
  () => import("@/components/consultant-chat").then((mod) => ({ default: mod.ConsultantChat })),
  { ssr: false }
)

type ChatMode = "data-analysis" | "consultant" | null

function ChatModeSelector() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[800px] space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">
                {"AI\u30C1\u30E3\u30C3\u30C8"}
              </h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {"\u30C7\u30FC\u30BF\u5206\u6790\u307E\u305F\u306F\u7D4C\u55B6\u30B3\u30F3\u30B5\u30EB\u30BF\u30F3\u30C8\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044"}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Link href="/chat?mode=data-analysis">
                <Card className="h-full cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30">
                  <CardContent className="flex flex-col items-center p-8 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                      <BarChart3 className="h-7 w-7" />
                    </div>
                    <h2 className="text-lg font-semibold">
                      {"\u30C7\u30FC\u30BF\u5206\u6790"}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {"\u81EA\u7136\u8A00\u8A9E\u3067\u5E02\u5834\u30C7\u30FC\u30BF\u3084\u8CA9\u58F2\u5206\u6790\u306B\u3064\u3044\u3066\u8CEA\u554F"}
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
                    <h2 className="text-lg font-semibold">
                      {"\u7D4C\u55B6\u30B3\u30F3\u30B5\u30EB\u30BF\u30F3\u30C8"}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {"\u7D4C\u55B6\u8AB2\u984C\u306E\u76F8\u8AC7\u30FB\u58C1\u6253\u3061\u30C1\u30E3\u30C3\u30C8"}
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

function ChatView({ mode }: { mode: "data-analysis" | "consultant" }) {
  const title = mode === "data-analysis"
    ? "\u30C7\u30FC\u30BF\u5206\u6790"
    : "\u7D4C\u55B6\u30B3\u30F3\u30B5\u30EB\u30BF\u30F3\u30C8"
  const subtitle = mode === "data-analysis"
    ? "\u81EA\u7136\u8A00\u8A9E\u3067\u30C7\u30FC\u30BF\u5206\u6790\u3068\u5E02\u5834\u30A4\u30F3\u30B5\u30A4\u30C8\u3092\u53D6\u5F97"
    : "\u7D4C\u55B6\u8AB2\u984C\u306E\u76F8\u8AC7\u30FB\u58C1\u6253\u3061\u30C1\u30E3\u30C3\u30C8"

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col gap-6">
            <div className="flex shrink-0 items-center gap-4 border-b border-border pb-6">
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

function ChatPageContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") as ChatMode

  if (!mode || (mode !== "data-analysis" && mode !== "consultant")) {
    return <ChatModeSelector />
  }

  return <ChatView mode={mode} />
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen overflow-hidden bg-background">
          <DashboardSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 flex items-center justify-center p-6">
              <div className="text-muted-foreground">
                {"\u8AAD\u307F\u8FBC\u307F\u4E2D..."}
              </div>
            </main>
          </div>
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  )
}
