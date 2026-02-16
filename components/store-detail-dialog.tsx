"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Calendar, Building2, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StoreDetailDialogProps {
  store: {
    id: number
    name: string
    prefecture: string
    revenue: number
    salesVolume: number
    avgInventory: number
    turnoverRate: string
    inventoryDays: number
    change: number
  } | null
  onClose: () => void
}

export function StoreDetailDialog({ store, onClose }: StoreDetailDialogProps) {
  if (!store) return null

  // Generate detailed analytics data
  const monthlySales = [
    { month: "1月", revenue: store.revenue * 0.08, sales: Math.floor(store.salesVolume * 0.08) },
    { month: "2月", revenue: store.revenue * 0.07, sales: Math.floor(store.salesVolume * 0.07) },
    { month: "3月", revenue: store.revenue * 0.09, sales: Math.floor(store.salesVolume * 0.09) },
    { month: "4月", revenue: store.revenue * 0.08, sales: Math.floor(store.salesVolume * 0.08) },
    { month: "5月", revenue: store.revenue * 0.09, sales: Math.floor(store.salesVolume * 0.09) },
    { month: "6月", revenue: store.revenue * 0.08, sales: Math.floor(store.salesVolume * 0.08) },
    { month: "7月", revenue: store.revenue * 0.07, sales: Math.floor(store.salesVolume * 0.07) },
    { month: "8月", revenue: store.revenue * 0.08, sales: Math.floor(store.salesVolume * 0.08) },
    { month: "9月", revenue: store.revenue * 0.09, sales: Math.floor(store.salesVolume * 0.09) },
    { month: "10月", revenue: store.revenue * 0.09, sales: Math.floor(store.salesVolume * 0.09) },
    { month: "11月", revenue: store.revenue * 0.09, sales: Math.floor(store.salesVolume * 0.09) },
    { month: "12月", revenue: store.revenue * 0.09, sales: Math.floor(store.salesVolume * 0.09) },
  ]

  const categoryBreakdown = [
    { name: "セダン", value: 30, fill: "#3b82f6" },
    { name: "SUV", value: 35, fill: "#10b981" },
    { name: "ミニバン", value: 20, fill: "#f59e0b" },
    { name: "軽自動車", value: 10, fill: "#ef4444" },
    { name: "その他", value: 5, fill: "#8b5cf6" },
  ]

  const priceRangeData = [
    { range: "～100万", count: Math.floor(store.avgInventory * 0.15) },
    { range: "100～200万", count: Math.floor(store.avgInventory * 0.25) },
    { range: "200～300万", count: Math.floor(store.avgInventory * 0.3) },
    { range: "300～500万", count: Math.floor(store.avgInventory * 0.2) },
    { range: "500万～", count: Math.floor(store.avgInventory * 0.1) },
  ]

  const performanceMetrics = [
    {
      label: "月間売上高",
      value: `¥${(store.revenue / 12 / 100000000).toFixed(2)}億`,
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
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "在庫回転率",
      value: `${store.turnoverRate}回/年`,
      icon: Package,
      change: store.change > 0 ? store.change - 1 : store.change + 1,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "平均在庫日数",
      value: `${store.inventoryDays}日`,
      icon: Calendar,
      change: -store.change,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ]

  const formatCurrency = (value: number) => {
    return `¥${(value / 100000000).toFixed(2)}億`
  }

  return (
    <Dialog open={!!store} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {store.name}
                <Badge variant="outline">{store.prefecture}</Badge>
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">店舗分析レポート</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Alert className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900 mt-4">
          <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-xs text-red-800 dark:text-red-300">
            <strong className="text-red-600 dark:text-red-400">注記：</strong>
            表示される分析データは、お客様のブラウザ機能を利用して、お客様の指定したエリア・条件の公開情報を収集・解析したものです。
            <span className="ml-2 text-red-600 dark:text-red-400 underline cursor-pointer hover:text-red-700">
              [詳しい利用条件はこちら &gt;]
            </span>
          </AlertDescription>
        </Alert>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {performanceMetrics.map((metric) => (
            <Card key={metric.label} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                {metric.change !== 0 && (
                  <div className="flex items-center gap-1">
                    {metric.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${metric.change > 0 ? "text-green-500" : "text-red-500"}`}>
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

        {/* Detailed Analytics Tabs */}
        <Tabs defaultValue="sales" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">売上推移</TabsTrigger>
            <TabsTrigger value="inventory">在庫分析</TabsTrigger>
            <TabsTrigger value="category">カテゴリー別</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="mt-6 space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">月次売上・販売台数推移</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--foreground))" fontSize={12} />
                  <YAxis yAxisId="left" stroke="hsl(var(--foreground))" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === "売上高") return [formatCurrency(value), name]
                      return [value + "台", name]
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    name="売上高"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    name="販売台数"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">年間売上高</h3>
                <p className="text-3xl font-bold text-primary">{formatCurrency(store.revenue)}</p>
                <p className="text-sm text-muted-foreground mt-1">前年比 +{store.change}%</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">年間販売台数</h3>
                <p className="text-3xl font-bold text-green-500">{store.salesVolume}台</p>
                <p className="text-sm text-muted-foreground mt-1">前年比 +{store.change + 2}%</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="mt-6 space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">価格帯別在庫構成</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priceRangeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" stroke="hsl(var(--foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: any) => [value + "台", "在庫台数"]}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">平均在庫台数</h3>
                <p className="text-3xl font-bold">{store.avgInventory}台</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">在庫回転率</h3>
                <p className="text-3xl font-bold text-orange-500">{store.turnoverRate}回</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">平均在庫日数</h3>
                <p className="text-3xl font-bold text-purple-500">{store.inventoryDays}日</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="category" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">車両カテゴリー別構成比</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
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

              <div className="mt-6 grid grid-cols-2 gap-4">
                {categoryBreakdown.map((category) => (
                  <div key={category.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: category.fill }} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.floor((category.value / 100) * store.avgInventory)}台
                      </p>
                    </div>
                    <p className="font-semibold">{category.value}%</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
