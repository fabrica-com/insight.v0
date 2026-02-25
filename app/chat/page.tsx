"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AIAnalysisChat } from "@/components/ai-analysis-chat"
import { ConsultantChat } from "@/components/consultant-chat"
import { CeoChat } from "@/components/ceo-chat"
import { CfoChat } from "@/components/cfo-chat"
import { CmoChat } from "@/components/cmo-chat"
import { GrantChat } from "@/components/grant-chat"
import { ChroChat } from "@/components/chro-chat"
import { CustomChat } from "@/components/custom-chat"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Flame, Sparkles, ArrowLeft, Crown, Wallet, Megaphone, Award, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type ChatMode = "data-analysis" | "consultant" | "ceo" | "cfo" | "cmo" | "grant" | "chro" | "custom" | null

const chatOptions = [
  {
    mode: "ceo",
    href: "/chat?mode=ceo",
    icon: Crown,
    iconBg: "bg-amber-500/10 text-amber-600",
    borderHover: "hover:border-amber-500/50 hover:bg-amber-500/5",
    title: "AI副社長",
    badge: "CEO",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    description: "経営判断を統合的にサポート。困っていることを話すだけでOK",
  },
  {
    mode: "cfo",
    href: "/chat?mode=cfo",
    icon: Wallet,
    iconBg: "bg-emerald-500/10 text-emerald-600",
    borderHover: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
    title: "AI金庫番",
    badge: "CFO",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    description: "資金繰り・仕入れ予算・銀行対策・税金カレンダー",
  },
  {
    mode: "cmo",
    href: "/chat?mode=cmo",
    icon: Megaphone,
    iconBg: "bg-sky-500/10 text-sky-600",
    borderHover: "hover:border-sky-500/50 hover:bg-sky-500/5",
    title: "AI集客参謀",
    badge: "CMO",
    badgeClass: "bg-sky-100 text-sky-700 border-sky-200",
    description: "MEO・SNS・ポータル最適化・写真改善・広告戦略",
  },
  {
    mode: "grant",
    href: "/chat?mode=grant",
    icon: Award,
    iconBg: "bg-violet-500/10 text-violet-600",
    borderHover: "hover:border-violet-500/50 hover:bg-violet-500/5",
    title: "補助金コンシェルジュ",
    badge: "助成金",
    badgeClass: "bg-violet-100 text-violet-700 border-violet-200",
    description: "補助金・助成金の最適マッチングと申請サポート",
  },
  {
    mode: "chro",
    href: "/chat?mode=chro",
    icon: Users,
    iconBg: "bg-rose-500/10 text-rose-600",
    borderHover: "hover:border-rose-500/50 hover:bg-rose-500/5",
    title: "AI人事参謀",
    badge: "CHRO",
    badgeClass: "bg-rose-100 text-rose-700 border-rose-200",
    description: "採用・定着・育成・外国人材・労務の人事課題を解決",
  },
  {
    mode: "data-analysis",
    href: "/chat?mode=data-analysis",
    icon: BarChart3,
    iconBg: "bg-primary/10 text-primary",
    borderHover: "hover:border-primary/50 hover:bg-muted/30",
    title: "データ分析",
    badge: null,
    badgeClass: "",
    description: "自然言語で市場データや販売分析について質問",
  },
  {
    mode: "consultant",
    href: "/chat?mode=consultant",
    icon: Flame,
    iconBg: "bg-chart-3/10 text-chart-3",
    borderHover: "hover:border-chart-3/50 hover:bg-chart-3/5",
    title: "経営コンサルタント",
    badge: null,
    badgeClass: "",
    description: "経営課題の相談・壁打ちチャット",
  },
  {
    mode: "custom",
    href: "/chat?mode=custom",
    icon: Sparkles,
    iconBg: "bg-violet-500/10 text-violet-600",
    borderHover: "hover:border-violet-500/50 hover:bg-violet-500/5",
    title: "カスタムAIチャット",
    badge: null,
    badgeClass: "",
    description: "独自のプロンプトでAIチャットを作成・利用",
  },
]

const chatTitles: Record<string, { title: string; subtitle: string }> = {
  "data-analysis": { title: "データ分析", subtitle: "自然言語でデータ分析と市場インサイトを取得" },
  consultant: { title: "経営コンサルタント", subtitle: "経営課題の相談・壁打ちチャット" },
  ceo: { title: "AI副社長", subtitle: "経営判断を統合的にサポートするAI参謀" },
  cfo: { title: "AI金庫番", subtitle: "お金まわりの一切を見守り、先回りして助言" },
  cmo: { title: "AI集客参謀", subtitle: "WEB集客を横断的に見渡し最適な施策を提案" },
  grant: { title: "補助金コンシェルジュ", subtitle: "補助金・助成金の最適マッチングと申請サポート" },
  chro: { title: "AI人事参謀", subtitle: "採用・定着・育成・外国人材・労務の人事課題を解決" },
}

const chatComponents: Record<string, React.ComponentType> = {
  "data-analysis": AIAnalysisChat,
  consultant: ConsultantChat,
  ceo: CeoChat,
  cfo: CfoChat,
  cmo: CmoChat,
  grant: GrantChat,
  chro: ChroChat,
}

function ChatPageContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") as ChatMode
  const customChatId = searchParams.get("id")

  const validModes = ["data-analysis", "consultant", "ceo", "cfo", "cmo", "grant", "chro", "custom"]

  // Selection screen
  if (!mode || !validModes.includes(mode)) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto w-full max-w-5xl space-y-8">
              <div className="border-b border-border pb-6">
                <h1 className="text-2xl font-bold tracking-tight">AI分析・コンサルティング</h1>
                <p className="text-muted-foreground mt-1 text-sm">利用するAIチャットを選択してください</p>
              </div>

              {/* CEO featured card */}
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">統合AI参謀</h2>
                <Link href="/chat?mode=ceo">
                  <Card className="cursor-pointer transition-all hover:border-amber-500/50 hover:bg-amber-500/5 hover:shadow-md">
                    <CardContent className="flex items-center gap-6 p-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shrink-0">
                        <Crown className="h-8 w-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-lg font-bold">AI副社長</h2>
                          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                            CEO
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ��金・集客・補助金・人事を統合的に判断。困っていることを話すだけで、今やるべきことを具体的にお伝えします。
                          4人の専門AI（金庫番・集客参謀・補助金コンシェルジュ・人事参謀）の知見を統合し、1つの結論を出す司令塔です。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Specialist AIs */}
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">専門AI</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {chatOptions.filter(o => ["cfo", "cmo", "grant", "chro"].includes(o.mode)).map((option) => (
                    <Link key={option.mode} href={option.href}>
                      <Card className={`h-full cursor-pointer transition-all ${option.borderHover} hover:shadow-sm`}>
                        <CardContent className="flex flex-col items-center p-6 text-center">
                          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${option.iconBg} mb-3`}>
                            <option.icon className="h-7 w-7" />
                          </div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <h2 className="text-base font-semibold">{option.title}</h2>
                            {option.badge && (
                              <Badge variant="outline" className={`text-[10px] ${option.badgeClass}`}>
                                {option.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{option.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Other tools */}
              <div>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">その他のツール</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {chatOptions.filter(o => ["data-analysis", "consultant", "custom"].includes(o.mode)).map((option) => (
                    <Link key={option.mode} href={option.href}>
                      <Card className={`h-full cursor-pointer transition-all ${option.borderHover} hover:shadow-sm`}>
                        <CardContent className="flex flex-col items-center p-6 text-center">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${option.iconBg} mb-3`}>
                            <option.icon className="h-6 w-6" />
                          </div>
                          <h2 className="text-sm font-semibold mb-1">{option.title}</h2>
                          <p className="text-xs text-muted-foreground leading-relaxed">{option.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Custom chat screen
  if (mode === "custom") {
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
                  <h1 className="text-2xl font-bold tracking-tight">カスタムAIチャット</h1>
                  <p className="text-muted-foreground mt-0.5 text-sm">独自のプロンプトでAIチャットを作成・利用</p>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-auto">
                <CustomChat initialChatId={customChatId} />
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Chat screens for all other modes
  const titleInfo = chatTitles[mode] || { title: mode, subtitle: "" }
  const ChatComponent = chatComponents[mode]

  if (!ChatComponent) {
    return null
  }

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
                <h1 className="text-2xl font-bold tracking-tight">{titleInfo.title}</h1>
                <p className="text-muted-foreground mt-0.5 text-sm">{titleInfo.subtitle}</p>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <ChatComponent />
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
