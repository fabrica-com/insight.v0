"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Calendar,
  Building2,
  Info,
  ArrowLeft,
  ExternalLink,
  Target,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Same seeded random for consistency
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

interface StoreData {
  id: number
  name: string
  prefecture: string
  revenue: number
  salesVolume: number
  avgInventory: number
  turnoverRate: string
  inventoryDays: number
  change: number
}

// AI経営コンサルタント総評生成（CEO AI「AI副社長」ロジック）
function generateCeoCommentary(store: StoreData): string {
  const monthlyRevenue = store.revenue / 12
  const monthlyRevenueMillion = monthlyRevenue / 10000
  const monthlySales = Math.floor(store.salesVolume / 12)
  const turnover = parseFloat(store.turnoverRate)
  const days = store.inventoryDays
  const change = store.change
  const inv = store.avgInventory

  // 規模判定
  const scaleLabel = inv < 30 ? "小規模店" : inv < 80 ? "中規模店" : "大規模店"
  const perCarRevenue = Math.round(monthlyRevenueMillion / Math.max(monthlySales, 1))

  const sections: string[] = []

  // 1. 総合評価ヘッダー
  const overallScore = turnover >= 8 && days <= 30 && change > 0 ? "優良" :
    turnover >= 5 && days <= 45 ? "良好" :
    turnover >= 3 ? "改善余地あり" : "要注意"

  sections.push(`【総合評価：${overallScore}】`)
  sections.push(`${store.prefecture}エリアの${scaleLabel}（在庫${inv}台規模）として分析します。`)
  sections.push("")

  // 2. 売上・販売力の診断
  sections.push("■ 売上・販売力の診断")
  if (monthlySales >= 20) {
    sections.push(`月販${monthlySales}台は${scaleLabel}としてはかなり好調です。1台あたり平均${perCarRevenue.toLocaleString()}万円の売上構成は、${perCarRevenue > 200 ? "高単価帯の品揃えが効いています" : "手頃な価格帯を中心に回転重視の戦略が見えます"}。`)
  } else if (monthlySales >= 10) {
    sections.push(`月販${monthlySales}台は標準的な水準です。1台あたり${perCarRevenue.toLocaleString()}万円の単価を維持しつつ、問い合わせ数を増やすことで月販15〜20台を狙える位置にあります。`)
  } else {
    sections.push(`月販${monthlySales}台は伸び代があります。まずカーセンサー等の掲載写真を全車20枚以上にする、コメント欄を充実させるなど、0円でできる改善から着手してください。`)
  }

  // 変動
  if (change > 5) {
    sections.push(`前年比+${change}%と好調な成長トレンドにあります。この勢いを活かし、在庫の質（回転の速い車種への集中）を高める時期です。`)
  } else if (change > 0) {
    sections.push(`前年比+${change}%と微増傾向です。安定していますが、次の成長ドライバーを見つける段階に入っています。`)
  } else if (change > -5) {
    sections.push(`前年比${change}%とやや減速しています。市場全体の動向を踏まえつつ、掲載内容の品質改善が即効性のある施策です。`)
  } else {
    sections.push(`前年比${change}%は注意が必要です。売上低下の原因を「問い合わせ数の減少」か「成約率の低下」かで切り分け、対策を絞ってください。`)
  }
  sections.push("")

  // 3. 在庫効率の診断
  sections.push("■ 在庫効率の診断")
  if (days <= 30) {
    sections.push(`平均在庫日数${days}日は非常に優秀です。回転率${store.turnoverRate}回/年と合わせて、キャッシュフローが健全に回っていることがわかります。`)
  } else if (days <= 45) {
    sections.push(`平均在庫日数${days}日は標準的な水準です。回転率${store.turnoverRate}回/年を維持しつつ、60日超の長期在庫をゼロにすることを目標にしてください。`)
  } else {
    sections.push(`平均在庫日数${days}日はやや長めです。60日を超えている車両は利益を圧縮するため、リストアップして値下げまたは業販による現金化を検討してください。在庫に寝ているお金が資金繰りを圧迫している可能性があります。`)
  }

  if (turnover >= 8) {
    sections.push(`回転率${store.turnoverRate}回/年はトップクラスの水準です。「売れる車を仕入れて、素早く売る」というサイクルが確立されています。`)
  } else if (turnover >= 5) {
    sections.push(`回転率${store.turnoverRate}回/年は良好です。さらに仕入れ精度を上げる（売れ筋データに基づいた仕入れ）ことで、7〜8回/年を目指せます。`)
  } else {
    sections.push(`回転率${store.turnoverRate}回/年は改善の余地があります。仕入れ基準の見直し（地域の売れ筋に合わせた車種選定）と、長期在庫の早期処分を同時に進めてください。`)
  }
  sections.push("")

  // 4. 他店が参考にすべきポイント
  sections.push("■ 他の販売店が参考にすべきポイント")
  const strengths: string[] = []
  const improvements: string[] = []

  if (turnover >= 6) strengths.push("高い在庫回転率を実現する仕入れ力")
  if (days <= 35) strengths.push("短い在庫滞留期間（仕入れ精度の高さ）")
  if (change > 3) strengths.push("安定した売上成長トレンド")
  if (monthlySales >= 15) strengths.push("月販15台以上の安定した販売力")
  if (perCarRevenue > 200) strengths.push("高単価帯を維持する商品力")

  if (days > 45) improvements.push("在庫日数の短縮（60日ルールの徹底）")
  if (turnover < 5) improvements.push("仕入れ精度の向上（売れ筋データの活用）")
  if (change < 0) improvements.push("売上回復に向けた掲載品質の見直し")
  if (monthlySales < 10) improvements.push("問い合わせ数の増加施策（写真・コメント改善）")

  if (strengths.length > 0) {
    sections.push(`【強み】`)
    strengths.forEach(s => sections.push(`  - ${s}`))
  }
  if (improvements.length > 0) {
    sections.push(`【改善すべき点】`)
    improvements.forEach(s => sections.push(`  - ${s}`))
  }
  sections.push("")

  // 5. 具体的アクション提案
  sections.push("■ 今すぐ取るべきアクション（優先度順）")

  const actions: string[] = []
  if (days > 45) {
    actions.push("1. 60日超の在庫を全台リストアップし、値下げまたは業販で1ヶ月以内に処分")
  }
  if (change < 0) {
    actions.push(`${actions.length + 1}. カーセンサー掲載の全車両の写真を20枚以上に増やし、コメント欄を充実させる（0円で即実行可能）`)
  }
  if (turnover < 6) {
    actions.push(`${actions.length + 1}. 売れ筋分析データを活用し、地域で回転の速い車種に仕入れを集中させる`)
  }
  if (inv > 50 && monthlySales < inv / 4) {
    actions.push(`${actions.length + 1}. 在庫台数に対して月販が少ないため、仕入れペースを落として在庫圧縮を検討`)
  }
  actions.push(`${actions.length + 1}. Googleビジネスプロフィール（MEO）を最新状態に更新し、口コミ獲得施策を開始`)

  if (actions.length === 1) {
    actions.unshift("1. 現状の好調を維持しつつ、売れ筋に集中した仕入れで在庫効率をさらに高める")
  }

  actions.forEach(a => sections.push(a))
  sections.push("")

  // 6. まとめ
  sections.push("─────────")
  if (overallScore === "優良" || overallScore === "良好") {
    sections.push(`この店舗のオペレーションは${scaleLabel}として${overallScore}な水準にあります。特に${strengths[0] || "経営の安定性"}は、同規模の販売店が学ぶべきポイントです。さらなる成長には、仕入れの精度向上と集客チャネルの多角化が鍵になるでしょう。`)
  } else {
    sections.push(`この店舗は${improvements[0] || "経営改善"}に取り組むことで、大きく改善する余地があります。まず上記のアクション1番を今週中に実行してください。「考えた」で���わらせず「やった」に変えることが、数字を動かす唯一の方法です。`)
  }

  return sections.join("\n")
}

export function StoreDetailPageContent({ store }: { store: StoreData }) {
  const router = useRouter()
  const rand = seededRandom(store.id * 7)

  // AI commentary state
  const [commentary, setCommentary] = useState("")
  const [displayedCommentary, setDisplayedCommentary] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [thinkingPhase, setThinkingPhase] = useState(0)
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const thinkingMessages = [
    "店舗データを分析中...",
    "売上トレンドを評価中...",
    "在庫効率を診断中...",
    "競合比較を実施中...",
    "改善提案を策定中...",
    "総評レポートを作成中...",
  ]

  // Rotate thinking messages
  useEffect(() => {
    if (!isGenerating) {
      setThinkingPhase(0)
      return
    }
    const interval = setInterval(() => {
      setThinkingPhase((prev) => (prev + 1) % thinkingMessages.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [isGenerating, thinkingMessages.length])

  // Character-by-character reveal
  useEffect(() => {
    if (!isRevealing || !commentary) return
    let currentIndex = 0
    const content = commentary

    const reveal = () => {
      currentIndex += 1
      if (currentIndex >= content.length) {
        setDisplayedCommentary(content)
        setIsRevealing(false)
        return
      }
      setDisplayedCommentary(content.slice(0, currentIndex))
      revealTimerRef.current = setTimeout(reveal, 20)
    }
    revealTimerRef.current = setTimeout(reveal, 20)
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
    }
  }, [isRevealing, commentary])

  const generateCommentary = useCallback(() => {
    setIsGenerating(true)
    setDisplayedCommentary("")
    setCommentary("")

    // Simulate AI processing time
    setTimeout(() => {
      const result = generateCeoCommentary(store)
      setCommentary(result)
      setIsGenerating(false)
      setIsRevealing(true)
    }, 3500)
  }, [store])

  // Auto-generate on mount
  useEffect(() => {
    generateCommentary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Monthly sales data
  const monthlySales = [
    { month: "1月", revenue: store.revenue * 0.08, sales: Math.floor(store.salesVolume * 0.08) },
    { month: "2月", revenue: store.revenue * 0.07, sales: Math.floor(store.salesVolume * 0.07) },
    { month: "3月", revenue: store.revenue * 0.11, sales: Math.floor(store.salesVolume * 0.11) },
    { month: "4月", revenue: store.revenue * 0.08, sales: Math.floor(store.salesVolume * 0.08) },
    { month: "5月", revenue: store.revenue * 0.09, sales: Math.floor(store.salesVolume * 0.09) },
    { month: "6月", revenue: store.revenue * 0.07, sales: Math.floor(store.salesVolume * 0.07) },
    { month: "7月", revenue: store.revenue * 0.07, sales: Math.floor(store.salesVolume * 0.07) },
    { month: "8月", revenue: store.revenue * 0.08, sales: Math.floor(store.salesVolume * 0.08) },
    { month: "9月", revenue: store.revenue * 0.09, sales: Math.floor(store.salesVolume * 0.09) },
    { month: "10月", revenue: store.revenue * 0.09, sales: Math.floor(store.salesVolume * 0.09) },
    { month: "11月", revenue: store.revenue * 0.08, sales: Math.floor(store.salesVolume * 0.08) },
    { month: "12月", revenue: store.revenue * 0.09, sales: Math.floor(store.salesVolume * 0.09) },
  ]

  // Inventory trend
  const inventoryTrend = [
    { month: "1月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.9 + rand() * 0.2)) },
    { month: "2月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.9 + rand() * 0.2)) },
    { month: "3月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.85 + rand() * 0.2)) },
    { month: "4月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.9 + rand() * 0.2)) },
    { month: "5月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.9 + rand() * 0.2)) },
    { month: "6月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.95 + rand() * 0.2)) },
    { month: "7月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.9 + rand() * 0.2)) },
    { month: "8月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.9 + rand() * 0.2)) },
    { month: "9月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.85 + rand() * 0.15)) },
    { month: "10月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.9 + rand() * 0.2)) },
    { month: "11月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.9 + rand() * 0.2)) },
    { month: "12月", inventory: Math.floor(store.avgInventory * (0.9 + rand() * 0.2)), days: Math.floor(store.inventoryDays * (0.9 + rand() * 0.15)) },
  ]

  const categoryBreakdown = [
    { name: "セダン", value: 30, fill: "#3b82f6" },
    { name: "SUV", value: 35, fill: "#10b981" },
    { name: "ミニバン", value: 20, fill: "#f59e0b" },
    { name: "軽自動車", value: 10, fill: "#ef4444" },
    { name: "その他", value: 5, fill: "#8b5cf6" },
  ]

  const priceRangeData = [
    { range: "~100万", count: Math.floor(store.avgInventory * 0.15) },
    { range: "100~200万", count: Math.floor(store.avgInventory * 0.25) },
    { range: "200~300万", count: Math.floor(store.avgInventory * 0.3) },
    { range: "300~500万", count: Math.floor(store.avgInventory * 0.2) },
    { range: "500万~", count: Math.floor(store.avgInventory * 0.1) },
  ]

  const yearModelData = [
    { year: "~2015", count: Math.floor(store.avgInventory * 0.1) },
    { year: "2016-18", count: Math.floor(store.avgInventory * 0.15) },
    { year: "2019-20", count: Math.floor(store.avgInventory * 0.2) },
    { year: "2021-22", count: Math.floor(store.avgInventory * 0.25) },
    { year: "2023-24", count: Math.floor(store.avgInventory * 0.2) },
    { year: "2025~", count: Math.floor(store.avgInventory * 0.1) },
  ]

  // Top selling models
  const topModels = [
    { name: "トヨタ アルファード", sales: Math.floor(rand() * 20 + 10), avgPrice: Math.floor(rand() * 200 + 300) },
    { name: "トヨタ ランドクルーザー", sales: Math.floor(rand() * 15 + 8), avgPrice: Math.floor(rand() * 300 + 400) },
    { name: "レクサス RX", sales: Math.floor(rand() * 12 + 5), avgPrice: Math.floor(rand() * 200 + 350) },
    { name: "トヨタ ハリアー", sales: Math.floor(rand() * 18 + 8), avgPrice: Math.floor(rand() * 100 + 250) },
    { name: "日産 セレナ", sales: Math.floor(rand() * 15 + 5), avgPrice: Math.floor(rand() * 80 + 200) },
  ].sort((a, b) => b.sales - a.sales)

  const performanceMetrics = [
    {
      label: "月間売上高",
      value: `\u00A5${(store.revenue / 12 / 100000000).toFixed(2)}億`,
      icon: DollarSign,
      change: store.change,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "月間販売台数",
      value: `${Math.floor(store.salesVolume / 12)}台`,
      icon: ShoppingCart,
      change: store.change > 0 ? store.change + 2 : store.change - 2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "在庫回転率",
      value: `${store.turnoverRate}回/年`,
      icon: Package,
      change: store.change > 0 ? store.change - 1 : store.change + 1,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "平均在庫日数",
      value: `${store.inventoryDays}日`,
      icon: Calendar,
      change: -store.change,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "平均在庫台数",
      value: `${store.avgInventory}台`,
      icon: Target,
      change: store.change > 0 ? store.change - 3 : store.change + 3,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
    },
    {
      label: "平���滞留期間",
      value: `${store.inventoryDays}日`,
      icon: Clock,
      change: -store.change + 2,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
    },
  ]

  const formatCurrency = (value: number) => {
    return `\u00A5${(value / 100000000).toFixed(2)}億`
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" className="mt-1 flex-shrink-0" onClick={() => router.push("/rankings")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex-shrink-0">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 flex-wrap">
                <span className="blur-sm hover:blur-none transition-all duration-300">{store.name}</span>
                <Badge variant="outline">{store.prefecture}</Badge>
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">店舗分析レポート</p>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="flex-shrink-0 gap-1.5 text-xs">
          <ExternalLink className="h-3.5 w-3.5" />
          在庫ページ
        </Button>
      </div>

      {/* Notice */}
      <Alert className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
        <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-xs text-red-800 dark:text-red-300">
          <strong className="text-red-600 dark:text-red-400">{'注記：'}</strong>
          {'表示される分析データは、お客様のブラウザ機能を利用して、お客様の指定したエリア・条件の公開情報を収集・解析したものです。'}
        </AlertDescription>
      </Alert>

      {/* Performance Metrics - 6 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
              {metric.change !== 0 && (
                <div className="flex items-center gap-0.5">
                  {metric.change > 0 ? (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                  )}
                  <span className={`text-xs font-medium ${metric.change > 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
            <div className="text-xl font-bold">{metric.value}</div>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="sales" className="py-2.5">売上推移</TabsTrigger>
          <TabsTrigger value="inventory" className="py-2.5">在庫分析</TabsTrigger>
          <TabsTrigger value="category" className="py-2.5">カテゴリー別</TabsTrigger>
          <TabsTrigger value="models" className="py-2.5">人気車種</TabsTrigger>
        </TabsList>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">月次売上・販売台数推移</h3>
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "売上高") return [formatCurrency(value), name]
                    return [value + "台", name]
                  }}
                />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} name="売上高" />
                <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981", r: 4 }} name="販売台数" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">年間売上高</h3>
              <p className="text-3xl font-bold text-primary">{formatCurrency(store.revenue)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                前年比{" "}
                <span className={store.change >= 0 ? "text-emerald-500" : "text-red-500"}>
                  {store.change >= 0 ? "+" : ""}{store.change}%
                </span>
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">年間販売台数</h3>
              <p className="text-3xl font-bold text-emerald-500">{store.salesVolume}台</p>
              <p className="text-sm text-muted-foreground mt-1">
                月平均 {Math.floor(store.salesVolume / 12)}台
              </p>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">価格帯別在庫構成</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={priceRangeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value + "台", "在庫台数"]}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">年式別在庫構成</h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={yearModelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value + "台", "在庫台数"]}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">在庫台数・在庫日数推移</h3>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={inventoryTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="inventory" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="在庫台数" />
                <Area yAxisId="right" type="monotone" dataKey="days" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} name="在庫日数" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">平均在庫台数</h3>
              <p className="text-3xl font-bold">{store.avgInventory}台</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">在庫回転率</h3>
              <p className="text-3xl font-bold text-amber-500">{store.turnoverRate}回</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">平均在庫日数</h3>
              <p className="text-3xl font-bold text-violet-500">{store.inventoryDays}日</p>
            </Card>
          </div>
        </TabsContent>

        {/* Category Tab */}
        <TabsContent value="category" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">車両カテゴリー別構成比</h3>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={110}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">カテゴリー別詳細</h3>
              <div className="space-y-3">
                {categoryBreakdown.map((category) => {
                  const count = Math.floor((category.value / 100) * store.avgInventory)
                  return (
                    <div key={category.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-4 h-4 rounded flex-shrink-0" style={{ backgroundColor: category.fill }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{category.name}</p>
                        <div className="w-full bg-muted rounded-full h-2 mt-1.5">
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{ width: `${category.value}%`, backgroundColor: category.fill }}
                          />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold">{category.value}%</p>
                        <p className="text-xs text-muted-foreground">{count}台</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Popular Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">人気車種ランキング（販売実績）</h3>
            <div className="space-y-3">
              {topModels.map((model, idx) => (
                <div key={model.name} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 ${
                    idx === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                    idx === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400" :
                    idx === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{model.name}</p>
                    <p className="text-xs text-muted-foreground">平均価格: {model.avgPrice}万円</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-primary">{model.sales}台</p>
                    <p className="text-xs text-muted-foreground">販売台数</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">車種別販売台数比較</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topModels} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value + "台", "販売台数"]}
                  />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">車種別平均価格比較</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topModels} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={140} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value + "万円", "平均価格"]}
                  />
                  <Bar dataKey="avgPrice" fill="#10b981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI経営コンサルタント総評 */}
      <Card className="border-2 border-amber-500/30 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">AI経営コンサルタント総評</h3>
                <p className="text-xs text-muted-foreground">AI副社長 による店舗分析レポート</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={generateCommentary}
              disabled={isGenerating || isRevealing}
              className="gap-1.5 text-xs border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-700"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              再分析
            </Button>
          </div>
        </div>

        <div className="p-6 pt-2">
          {isGenerating && (
            <div className="flex items-center gap-3 py-8 justify-center">
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-amber-500/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-2 w-2 rounded-full bg-amber-500/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-2 w-2 rounded-full bg-amber-500/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-sm text-muted-foreground animate-pulse">
                {thinkingMessages[thinkingPhase]}
              </span>
            </div>
          )}

          {!isGenerating && (displayedCommentary || commentary) && (
            <div className="relative">
              <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {(isRevealing ? displayedCommentary : commentary).split("\n").map((line, i) => {
                  if (line.startsWith("【総合評価")) {
                    const isGood = line.includes("優良") || line.includes("良好")
                    return (
                      <div key={i} className="mb-2">
                        <Badge className={isGood
                          ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 text-base px-3 py-1"
                          : line.includes("要注意")
                            ? "bg-red-500/15 text-red-700 border-red-500/30 text-base px-3 py-1"
                            : "bg-amber-500/15 text-amber-700 border-amber-500/30 text-base px-3 py-1"
                        }>
                          {line}
                        </Badge>
                      </div>
                    )
                  }
                  if (line.startsWith("■")) {
                    return <p key={i} className="font-bold text-base mt-5 mb-2 text-foreground border-l-4 border-amber-500 pl-3">{line.replace("■ ", "")}</p>
                  }
                  if (line.startsWith("【強み】")) {
                    return <p key={i} className="font-semibold text-emerald-600 mt-3 mb-1">{line}</p>
                  }
                  if (line.startsWith("【改善すべき点】")) {
                    return <p key={i} className="font-semibold text-amber-600 mt-3 mb-1">{line}</p>
                  }
                  if (line.startsWith("─────")) {
                    return <hr key={i} className="my-4 border-border" />
                  }
                  if (line.match(/^\d+\./)) {
                    return <p key={i} className="pl-2 py-0.5 text-sm">{line}</p>
                  }
                  if (line.startsWith("  - ")) {
                    return <p key={i} className="pl-4 py-0.5 text-sm">{line}</p>
                  }
                  if (line === "") return <div key={i} className="h-2" />
                  return <p key={i}>{line}</p>
                })}
                {isRevealing && (
                  <span className="inline-block w-0.5 h-4 bg-amber-500 animate-pulse ml-0.5 align-text-bottom" />
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
