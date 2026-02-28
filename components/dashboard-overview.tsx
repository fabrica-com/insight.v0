"use client"

import Link from "next/link"
import {
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  RotateCw,
  Clock,
  ChevronRight,
  Sparkles,
  Users,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Trophy,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  BarChart,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { cn } from "@/lib/utils"
import { myStore, allStoresWithMine } from "@/lib/store-data"

// --- Deterministic seeded random ---
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// --- My Store KPI data ---
const rand = seededRandom(777)
const monthlyRevenue = myStore.revenue / 12
const monthlySales = Math.floor(myStore.salesVolume / 12)
const turnover = parseFloat(myStore.turnoverRate)

// Sales trend (6 months)
const months = ["9月", "10月", "11月", "12月", "1月", "2月"]
const salesTrendData = months.map((m, i) => {
  const r = seededRandom(777 + i)
  return {
    month: m,
    sales: Math.floor(r() * 8 + monthlySales - 4),
    revenue: Math.floor((r() * 0.3 + 0.85) * monthlyRevenue),
  }
})

// Inventory age distribution
const inventoryAgeData = [
  { name: "30日以内", value: Math.floor(myStore.avgInventory * 0.45), color: "hsl(var(--chart-2))" },
  { name: "31-60日", value: Math.floor(myStore.avgInventory * 0.30), color: "hsl(var(--chart-3))" },
  { name: "61-90日", value: Math.floor(myStore.avgInventory * 0.15), color: "hsl(var(--chart-5))" },
  { name: "90日超", value: Math.floor(myStore.avgInventory * 0.10), color: "hsl(var(--destructive))" },
]

// Competitor summary
const competitorSummary = [
  { name: "オートプラザ新宿", inventory: 312, sold: 45, change: 8 },
  { name: "カーセレクト渋谷", inventory: 278, sold: 38, change: -3 },
  { name: "モーターランド品川", inventory: 245, sold: 31, change: 5 },
]

// Pricing alerts summary
const pricingAlerts = {
  overpriced: 2,
  optimal: 5,
  underpriced: 1,
  longTerm: 3,
}

// Trending vehicles for dashboard
const trendingVehicles = [
  { make: "トヨタ", model: "アルファード", str: 28.5, trend: "+8.3%", avgPrice: 425 },
  { make: "ホンダ", model: "ヴェゼル", str: 24.2, trend: "+5.1%", avgPrice: 289 },
  { make: "トヨタ", model: "ハリアー", str: 22.8, trend: "+3.2%", avgPrice: 368 },
  { make: "日産", model: "セレナ", str: 21.5, trend: "+2.8%", avgPrice: 265 },
  { make: "マツダ", model: "CX-5", str: 19.3, trend: "+1.5%", avgPrice: 275 },
]

// Pre-compute all random KPI change values at module level to avoid hydration mismatch
const kpiChangeSales = Math.floor(rand() * 12) - 3
const kpiChangeInventory = Math.floor(rand() * 10) - 5
const kpiChangeTurnover = parseFloat((rand() * 2 - 0.5).toFixed(1))
const kpiChangeDays = -Math.floor(rand() * 5)

// Ranking position
const myRank = (() => {
  const sorted = [...allStoresWithMine].sort((a, b) => b.revenue - a.revenue)
  return sorted.findIndex((s) => s.id === myStore.id) + 1
})()

// STR chart data
const strChartData = trendingVehicles.map((v) => ({
  name: v.model,
  str: v.str,
}))

export function DashboardOverview() {
  const kpis = [
    {
      label: "月間売上",
      value: `${(monthlyRevenue / 10000).toFixed(0)}万`,
      prefix: "¥",
      change: myStore.change,
      icon: DollarSign,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "月間販売台数",
      value: `${monthlySales}`,
      suffix: "台",
      change: kpiChangeSales,
      icon: ShoppingCart,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "在庫台数",
      value: `${myStore.avgInventory}`,
      suffix: "台",
      change: kpiChangeInventory,
      icon: Package,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      label: "回転率",
      value: myStore.turnoverRate,
      suffix: "回/年",
      change: kpiChangeTurnover,
      icon: RotateCw,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "平均在庫日数",
      value: `${myStore.inventoryDays}`,
      suffix: "日",
      change: kpiChangeDays,
      icon: Clock,
      color: myStore.inventoryDays > 45 ? "text-destructive" : "text-chart-2",
      bgColor: myStore.inventoryDays > 45 ? "bg-destructive/10" : "bg-chart-2/10",
      invertChange: true,
    },
    {
      label: "全国ランキング",
      value: `${myRank}`,
      suffix: `位 / ${allStoresWithMine.length}店`,
      icon: Trophy,
      color: "text-primary",
      bgColor: "bg-primary/10",
      isRank: true,
    },
  ]

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", kpi.bgColor)}>
                  <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                </div>
                {kpi.change !== undefined && !kpi.isRank && (
                  <div className={cn(
                    "flex items-center gap-0.5 text-xs font-medium",
                    kpi.invertChange
                      ? (kpi.change <= 0 ? "text-chart-2" : "text-destructive")
                      : (kpi.change >= 0 ? "text-chart-2" : "text-destructive"),
                  )}>
                    {(kpi.invertChange ? kpi.change <= 0 : kpi.change >= 0) ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {kpi.change > 0 ? "+" : ""}{kpi.change}%
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  {kpi.prefix && <span className="text-sm text-muted-foreground">{kpi.prefix}</span>}
                  <span className="text-2xl font-bold tracking-tight">{kpi.value}</span>
                  {kpi.suffix && <span className="text-xs text-muted-foreground">{kpi.suffix}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2: Sales trend + Inventory health */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Sales Trend Chart (3/5) */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">売上・販売推移</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">直近6ヶ月の月間推移</p>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrendData} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [`¥${(value / 10000).toLocaleString()}万`, "売上"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" fill="url(#revGrad)" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--chart-1))" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Mini bar chart for sales count */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">月間販売台数</span>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-sm bg-chart-2" />
                  <span className="text-muted-foreground">台数</span>
                </div>
              </div>
              <div className="h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesTrendData} margin={{ top: 0, right: 5, bottom: 0, left: -15 }}>
                    <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                    <Bar dataKey="sales" radius={[3, 3, 0, 0]} fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Health (2/5) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">在庫健全性</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">在庫期間別の内訳</p>
            </div>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary">
                詳細 <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryAgeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {inventoryAgeData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number, name: string) => [`${value}台`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {inventoryAgeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.value}台</span>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {Math.round((item.value / myStore.avgInventory) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Long-term inventory warning */}
            {inventoryAgeData[3].value > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/15">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-destructive">長期在庫アラート</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      90日超の在庫が{inventoryAgeData[3].value}台あります。早期処分を検討してください。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Pricing + Competitor + AI */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pricing Alerts Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">価格アラート</CardTitle>
            <Link href="/pricing">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary">
                詳細 <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-destructive/5 border border-destructive/10 p-3 text-center">
                <div className="text-2xl font-bold text-destructive">{pricingAlerts.overpriced}</div>
                <div className="text-xs text-muted-foreground mt-0.5">高価格</div>
              </div>
              <div className="rounded-lg bg-chart-2/5 border border-chart-2/10 p-3 text-center">
                <div className="text-2xl font-bold text-chart-2">{pricingAlerts.optimal}</div>
                <div className="text-xs text-muted-foreground mt-0.5">適正価格</div>
              </div>
              <div className="rounded-lg bg-chart-3/5 border border-chart-3/10 p-3 text-center">
                <div className="text-2xl font-bold text-chart-3">{pricingAlerts.underpriced}</div>
                <div className="text-xs text-muted-foreground mt-0.5">低価格</div>
              </div>
              <div className="rounded-lg bg-chart-5/5 border border-chart-5/10 p-3 text-center">
                <div className="text-2xl font-bold text-chart-5">{pricingAlerts.longTerm}</div>
                <div className="text-xs text-muted-foreground mt-0.5">長期在庫</div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-destructive/15 bg-destructive/5 text-sm">
                <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                <span className="text-xs">アルファード 2.5S - 67日経過、値下げ推奨</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-chart-2/15 bg-chart-2/5 text-sm">
                <CheckCircle2 className="h-4 w-4 text-chart-2 flex-shrink-0" />
                <span className="text-xs">セレナ e-POWER - 値上げ余地あり(+23万)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">競合動向</CardTitle>
            <Link href="/competitors">
              <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary">
                詳細 <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
              <div>
                <div className="text-xs text-muted-foreground">自店 (商圏内)</div>
                <div className="font-semibold mt-0.5">{myStore.name}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{myStore.avgInventory}台</div>
                <div className="text-xs text-muted-foreground">在庫</div>
              </div>
            </div>

            <div className="space-y-2">
              {competitorSummary.map((c) => (
                <div key={c.name} className="flex items-center justify-between p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm">{c.inventory}台</span>
                    <div className={cn("flex items-center gap-0.5 text-xs font-medium", c.change >= 0 ? "text-chart-2" : "text-destructive")}>
                      {c.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {c.change > 0 ? "+" : ""}{c.change}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Consulting Quick Access */}
        <Card className="border-amber-500/20 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-amber-500/5 to-transparent">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-base font-semibold">AI経営アドバイザー</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI社長（Co-CEO）が、売上・在庫・競合データを総合的に分析し、今取るべきアクションを提案します。
            </p>

            <div className="space-y-2">
              <Link href="/chat" className="block">
                <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium">AI社長（Co-CEO）</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 ml-8">経営判断を総合支援</p>
                </div>
              </Link>
              <Link href="/chat" className="block">
                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                        <DollarSign className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium">AI金庫番</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 ml-8">資金繰り・財務相談</p>
                </div>
              </Link>
              <Link href="/chat" className="block">
                <div className="p-3 rounded-lg border border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center">
                        <BarChart3 className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium">AI集客参謀</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-sky-600 transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 ml-8">WEB集客・MEO対策</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Trending Vehicles */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
              <TrendingUp className="h-4 w-4 text-chart-1" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">売れ筋車両 TOP 5</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">過去30日間 STR ランキング - 東京都内</p>
            </div>
          </div>
          <Link href="/trending">
            <Button variant="ghost" size="sm" className="gap-1 text-xs text-primary hover:text-primary">
              詳細分析 <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-5">
            {/* STR Chart */}
            <div className="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium">Sell-Through Rate</span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-2.5 w-2.5 rounded-sm bg-chart-1" />
                  STR (%)
                </div>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={strChartData} layout="vertical" margin={{ left: 0, right: 10 }}>
                    <XAxis type="number" fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" domain={[0, 35]} />
                    <YAxis type="category" dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" width={80} />
                    <Bar dataKey="str" radius={[0, 4, 4, 0]}>
                      {strChartData.map((_, i) => (
                        <Cell key={i} fill={i === 0 ? "hsl(var(--chart-1))" : "hsl(var(--muted-foreground)/0.2)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="lg:col-span-3">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 text-left font-medium">#</th>
                    <th className="px-4 py-2.5 text-left font-medium">車種</th>
                    <th className="px-4 py-2.5 text-right font-medium">STR</th>
                    <th className="px-4 py-2.5 text-right font-medium">平均価格</th>
                    <th className="px-4 py-2.5 text-right font-medium">トレンド</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingVehicles.map((v, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                          i === 0 && "bg-chart-1/15 text-chart-1",
                          i === 1 && "bg-chart-2/15 text-chart-2",
                          i === 2 && "bg-chart-3/15 text-chart-3",
                          i > 2 && "bg-muted text-muted-foreground",
                        )}>
                          {i + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium">{v.make} {v.model}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-primary">{v.str}%</span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                        {v.avgPrice}万
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20 text-xs">
                          <TrendingUp className="h-3 w-3 mr-0.5" />
                          {v.trend}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
