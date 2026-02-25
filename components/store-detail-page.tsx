"use client"

import { useRouter } from "next/navigation"
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

export function StoreDetailPageContent({ store }: { store: StoreData }) {
  const router = useRouter()
  const rand = seededRandom(store.id * 7)

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
      label: "平均滞留期間",
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
    </div>
  )
}
