"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Activity,
  Target,
  Package,
  Zap,
  Ship,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

// ... existing data definitions ...
const exportDestinationRanking = [
  {
    rank: 1,
    country: "ニュージーランド",
    code: "NZ",
    volume: 2850,
    change: 12.5,
    revenue: 8520000000,
    avgPrice: 2989474,
  },
  { rank: 2, country: "オーストラリア", code: "AU", volume: 2340, change: 8.2, revenue: 7254000000, avgPrice: 3100000 },
  { rank: 3, country: "UAE", code: "AE", volume: 1890, change: 15.8, revenue: 6615000000, avgPrice: 3500000 },
  { rank: 4, country: "ロシア", code: "RU", volume: 1560, change: -5.2, revenue: 4368000000, avgPrice: 2800000 },
  { rank: 5, country: "モンゴル", code: "MN", volume: 1120, change: 22.4, revenue: 2912000000, avgPrice: 2600000 },
  { rank: 6, country: "スリランカ", code: "LK", volume: 980, change: 18.3, revenue: 2450000000, avgPrice: 2500000 },
  { rank: 7, country: "ケニア", code: "KE", volume: 850, change: 9.1, revenue: 2040000000, avgPrice: 2400000 },
  { rank: 8, country: "タンザニア", code: "TZ", volume: 720, change: 14.6, revenue: 1656000000, avgPrice: 2300000 },
  { rank: 9, country: "ウガンダ", code: "UG", volume: 580, change: 7.8, revenue: 1276000000, avgPrice: 2200000 },
  { rank: 10, country: "パキスタン", code: "PK", volume: 450, change: -2.1, revenue: 945000000, avgPrice: 2100000 },
]

const exportByModelRanking = {
  NZ: [
    { rank: 1, model: "アルファード", modelCode: "AGH30W", volume: 420, change: 18.5, avgPrice: 4200000 },
    { rank: 2, model: "ハイエース", modelCode: "TRH200V", volume: 380, change: 12.3, avgPrice: 3500000 },
    { rank: 3, model: "ランドクルーザー", modelCode: "GRJ150L", volume: 320, change: 8.7, avgPrice: 5800000 },
    { rank: 4, model: "プリウス", modelCode: "ZVW50", volume: 290, change: 5.2, avgPrice: 2400000 },
    { rank: 5, model: "ハリアー", modelCode: "MXUA80", volume: 260, change: 22.1, avgPrice: 3800000 },
  ],
  AU: [
    { rank: 1, model: "ランドクルーザー", modelCode: "GRJ150L", volume: 380, change: 15.2, avgPrice: 6200000 },
    { rank: 2, model: "ハイエース", modelCode: "TRH200V", volume: 350, change: 10.8, avgPrice: 3800000 },
    { rank: 3, model: "アルファード", modelCode: "AGH30W", volume: 310, change: 12.5, avgPrice: 4500000 },
    { rank: 4, model: "RAV4", modelCode: "MXAA54", volume: 280, change: 18.9, avgPrice: 3200000 },
    { rank: 5, model: "カムリ", modelCode: "AXVH70", volume: 240, change: 6.3, avgPrice: 2800000 },
  ],
  AE: [
    { rank: 1, model: "ランドクルーザー", modelCode: "URJ202W", volume: 450, change: 25.3, avgPrice: 7500000 },
    { rank: 2, model: "パトロール", modelCode: "Y62", volume: 320, change: 18.7, avgPrice: 6800000 },
    { rank: 3, model: "アルファード", modelCode: "AGH35W", volume: 280, change: 14.2, avgPrice: 5200000 },
    { rank: 4, model: "レクサスLX", modelCode: "URJ201W", volume: 220, change: 32.1, avgPrice: 9500000 },
    { rank: 5, model: "プラド", modelCode: "TRJ150W", volume: 180, change: 8.5, avgPrice: 4800000 },
  ],
}

const exportVolumeChangeRanking = [
  { rank: 1, country: "モンゴル", change: 22.4, currentVolume: 1120, prevVolume: 915 },
  { rank: 2, country: "スリランカ", change: 18.3, currentVolume: 980, prevVolume: 828 },
  { rank: 3, country: "UAE", change: 15.8, currentVolume: 1890, prevVolume: 1632 },
  { rank: 4, country: "タンザニア", change: 14.6, currentVolume: 720, prevVolume: 628 },
  { rank: 5, country: "ニュージーランド", change: 12.5, currentVolume: 2850, prevVolume: 2533 },
  { rank: 6, country: "ケニア", change: 9.1, currentVolume: 850, prevVolume: 779 },
  { rank: 7, country: "オーストラリア", change: 8.2, currentVolume: 2340, prevVolume: 2162 },
  { rank: 8, country: "ウガンダ", change: 7.8, currentVolume: 580, prevVolume: 538 },
  { rank: 9, country: "パキスタン", change: -2.1, currentVolume: 450, prevVolume: 460 },
  { rank: 10, country: "ロシア", change: -5.2, currentVolume: 1560, prevVolume: 1646 },
]

const modelVolumeChangeRanking = [
  { rank: 1, model: "レクサスLX", modelCode: "URJ201W", change: 32.1, currentVolume: 580, prevVolume: 439 },
  { rank: 2, model: "ランドクルーザー", modelCode: "URJ202W", change: 25.3, currentVolume: 1250, prevVolume: 998 },
  { rank: 3, model: "モンゴル向けハイエース", modelCode: "TRH200V", change: 24.8, currentVolume: 420, prevVolume: 336 },
  { rank: 4, model: "ハリアー", modelCode: "MXUA80", change: 22.1, currentVolume: 680, prevVolume: 557 },
  { rank: 5, model: "RAV4", modelCode: "MXAA54", change: 18.9, currentVolume: 520, prevVolume: 437 },
  { rank: 6, model: "アルファード", modelCode: "AGH30W", change: 18.5, currentVolume: 1450, prevVolume: 1223 },
  { rank: 7, model: "パトロール", modelCode: "Y62", change: 18.7, currentVolume: 320, prevVolume: 269 },
  { rank: 8, model: "プラド", modelCode: "TRJ150W", change: 15.2, currentVolume: 890, prevVolume: 772 },
  { rank: 9, model: "ハイエース", modelCode: "TRH200V", change: 12.3, currentVolume: 1680, prevVolume: 1496 },
  { rank: 10, model: "プリウス", modelCode: "ZVW50", change: -3.2, currentVolume: 720, prevVolume: 744 },
]

// 車種別の輸出明細データ（国別 x 車種）
const colors = ["ホワイトパール", "ブラック", "シルバー", "グレーメタリック", "ダークブルー", "ホワイト", "パールホワイト", "ブラウン"]
const shifts = ["AT", "CVT", "MT"]
const drives = ["4WD", "2WD", "FF", "FR"]
const steerings = ["右", "左"]

function generateModelDetails(model: string, modelCode: string, avgPrice: number, count: number) {
  const details = []
  const makers: Record<string, string> = {
    "アルファード": "トヨタ", "ハイエース": "トヨタ", "ランドクルーザー": "トヨタ", "プリウス": "トヨタ",
    "ハリアー": "トヨタ", "RAV4": "トヨタ", "カムリ": "トヨタ", "プラド": "トヨタ",
    "パトロール": "日産", "レクサスLX": "レクサス",
  }
  const maker = makers[model] || "トヨタ"
  const baseYear = model.includes("ランドクルーザー") || model.includes("レクサス") ? 2015 : 2018
  for (let i = 0; i < Math.min(count, 8); i++) {
    const month = ((i * 3 + 1) % 12) + 1
    const day = ((i * 7 + 5) % 28) + 1
    const year = baseYear + (i % 5)
    const mileage = 30000 + i * 12000 + (i % 3) * 8000
    const priceVar = avgPrice * (0.85 + (i % 5) * 0.06)
    details.push({
      id: `${modelCode}-${i}`,
      date: `2025/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`,
      maker,
      model,
      year,
      modelCode,
      mileage,
      color: colors[i % colors.length],
      shift: shifts[i % shifts.length],
      drive: drives[i % drives.length],
      steering: steerings[i % steerings.length],
      purchasePrice: Math.round(priceVar),
    })
  }
  return details.sort((a, b) => b.date.localeCompare(a.date))
}

const exportTrendData = [
  { month: "1月", total: 1050, nz: 280, au: 230, ae: 180, ru: 160, other: 200 },
  { month: "2月", total: 980, nz: 260, au: 210, ae: 170, ru: 150, other: 190 },
  { month: "3月", total: 1120, nz: 300, au: 250, ae: 190, ru: 170, other: 210 },
  { month: "4月", total: 1080, nz: 290, au: 240, ae: 180, ru: 160, other: 210 },
  { month: "5月", total: 1150, nz: 310, au: 260, ae: 195, ru: 165, other: 220 },
  { month: "6月", total: 1200, nz: 320, au: 270, ae: 200, ru: 175, other: 235 },
  { month: "7月", total: 1280, nz: 340, au: 285, ae: 215, ru: 180, other: 260 },
  { month: "8月", total: 1350, nz: 360, au: 300, ae: 230, ru: 185, other: 275 },
  { month: "9月", total: 1180, nz: 315, au: 265, ae: 195, ru: 170, other: 235 },
  { month: "10月", total: 1420, nz: 380, au: 320, ae: 245, ru: 195, other: 280 },
  { month: "11月", total: 1520, nz: 405, au: 340, ae: 260, ru: 205, other: 310 },
  { month: "12月", total: 1680, nz: 450, au: 375, ae: 285, ru: 220, other: 350 },
]

const marketTrendData = [
  { month: "7月", marketSales: 1250, exportVolume: 450, avgPrice: 2850000 },
  { month: "8月", marketSales: 1320, exportVolume: 480, avgPrice: 2920000 },
  { month: "9月", marketSales: 1180, exportVolume: 420, avgPrice: 2880000 },
  { month: "10月", marketSales: 1450, exportVolume: 520, avgPrice: 3050000 },
  { month: "11月", marketSales: 1580, exportVolume: 580, avgPrice: 3100000 },
  { month: "12月", marketSales: 1750, exportVolume: 650, avgPrice: 3150000 },
]

const companyPerformanceData = [
  { month: "7月", sales: 87, target: 80, revenue: 245000000 },
  { month: "8月", sales: 92, target: 85, revenue: 268000000 },
  { month: "9月", sales: 78, target: 85, revenue: 221000000 },
  { month: "10月", sales: 95, target: 90, revenue: 287000000 },
  { month: "11月", sales: 103, target: 95, revenue: 312000000 },
  { month: "12月", sales: 118, target: 100, revenue: 356000000 },
]

const competitorComparisonData = [
  { subject: "価格競争力", A: 120, B: 110, fullMark: 150 },
  { subject: "在庫回転率", A: 98, B: 130, fullMark: 150 },
  { subject: "顧客満足度", A: 86, B: 130, fullMark: 150 },
  { subject: "成約率", A: 99, B: 100, fullMark: 150 },
  { subject: "在庫数", A: 85, B: 90, fullMark: 150 },
  { subject: "ブランド力", A: 65, B: 85, fullMark: 150 },
]

const exportData = [
  { country: "ニュージーランド", count: 45, revenue: 98500000, share: 32.5 },
  { country: "オーストラリア", count: 38, revenue: 87200000, share: 27.4 },
  { country: "UAE", count: 28, revenue: 72100000, share: 20.2 },
  { country: "ロシア", count: 22, revenue: 48900000, share: 15.9 },
  { country: "その他", count: 6, revenue: 11300000, share: 4.0 },
]

const CHART_COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  accent: "hsl(var(--chart-3))",
  purple: "hsl(var(--chart-4))",
  pink: "hsl(var(--chart-5))",
}

const PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const EXPORT_CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

const trendingRankingData = [
  { rank: 1, make: "トヨタ", model: "アルファード", str: 28.5, trend: 8.3 },
  { rank: 2, make: "ホンダ", model: "ヴェゼル", str: 24.2, trend: 5.1 },
  { rank: 3, make: "トヨタ", model: "ハリアー", str: 22.8, trend: 3.2 },
  { rank: 4, make: "メルセデス・ベンツ", model: "Cクラス", str: 21.8, trend: 4.5 },
  { rank: 5, make: "日産", model: "セレナ", str: 21.5, trend: 2.8 },
]

export function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState<"market" | "company" | "export">("market")
  const [selectedExportCountry, setSelectedExportCountry] = useState("NZ")
  const [exportRankingType, setExportRankingType] = useState<"destination" | "model" | "change">("destination")
  const [expandedExportModel, setExpandedExportModel] = useState<string | null>(null)

  const handleDownload = (reportType: string) => {
    console.log("Downloading report:", reportType)
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "market" | "company" | "export")}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-lg grid-cols-3 h-11">
          <TabsTrigger value="market" className="gap-2 text-sm">
            <Globe className="h-4 w-4" />
            市場動向
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2 text-sm">
            <Ship className="h-4 w-4" />
            輸出動向
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market" className="space-y-6 data-[state=inactive]:hidden">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "市場総販売台数", value: "8,530台", change: "+12.4%", positive: true },
              { label: "輸出比率", value: "36.4%", change: "+4.2pt", positive: true },
              { label: "平均市場価格", value: "¥2.98M", change: "+5.8%", positive: true },
            ].map((stat, i) => (
              <Card key={i} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {stat.positive ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={stat.positive ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                    <span className="text-muted-foreground">前年同期比</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border/50">
              <CardHeader>
                <CardTitle className="text-base">市場売れ行き・輸出動向</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketTrendData}>
                      <defs>
                        <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Area
                        type="monotone"
                        dataKey="marketSales"
                        name="国内販売"
                        stroke={CHART_COLORS.primary}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorMarket)"
                      />
                      <Area
                        type="monotone"
                        dataKey="exportVolume"
                        name="輸出"
                        stroke={CHART_COLORS.secondary}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorExport)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">売れ筋ランキング</CardTitle>
                <CardDescription className="text-xs">STR順 TOP5</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingRankingData.map((vehicle) => (
                    <div key={vehicle.rank} className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-xs font-bold">
                        {vehicle.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{vehicle.model}</div>
                        <div className="text-xs text-muted-foreground">{vehicle.make}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">{vehicle.str}%</div>
                        <Badge variant="outline" className="text-[10px] px-1 h-4">
                          +{vehicle.trend}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">輸出先シェア</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={exportData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="share"
                    >
                      {exportData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {[
              { icon: Globe, title: "市場動向レポート", desc: "国別・車種別データ", color: "from-chart-1 to-primary" },
            ].map((report, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${report.color} text-white`}
                  >
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{report.title}</div>
                    <div className="text-xs text-muted-foreground">{report.desc}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-6 data-[state=inactive]:hidden">
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "年間輸出総台数", value: "13,340台", change: "+11.8%", positive: true },
              { label: "輸出総売上", value: "¥38.0B", change: "+14.2%", positive: true },
              { label: "輸出先国数", value: "42カ国", change: "+3", positive: true },
              { label: "平均単価", value: "¥2.85M", change: "+2.1%", positive: true },
            ].map((stat, i) => (
              <Card key={i} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {stat.positive ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={stat.positive ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                    <span className="text-muted-foreground">前年比</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export Trend Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">月別輸出台数推移</CardTitle>
              <CardDescription className="text-xs">主要仕向地別内訳</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={exportTrendData}>
                    <defs>
                      <linearGradient id="colorNZ" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAU" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorAE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRU" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Area
                      type="monotone"
                      dataKey="nz"
                      name="ニュージーランド"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNZ)"
                      stackId="1"
                    />
                    <Area
                      type="monotone"
                      dataKey="au"
                      name="オーストラリア"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAU)"
                      stackId="1"
                    />
                    <Area
                      type="monotone"
                      dataKey="ae"
                      name="UAE"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAE)"
                      stackId="1"
                    />
                    <Area
                      type="monotone"
                      dataKey="ru"
                      name="ロシア"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRU)"
                      stackId="1"
                    />
                    <Area
                      type="monotone"
                      dataKey="other"
                      name="その他"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      fillOpacity={0.3}
                      fill="#8b5cf6"
                      stackId="1"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Ranking Type Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">ランキング種別:</span>
            <div className="flex gap-2">
              {[
                { value: "destination", label: "仕向地別" },
                { value: "model", label: "車種別（国別）" },
                { value: "change", label: "増減ランキング" },
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={exportRankingType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExportRankingType(type.value as typeof exportRankingType)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Destination Ranking */}
          {exportRankingType === "destination" && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  仕向地（国）別 輸出台数ランキング
                </CardTitle>
                <CardDescription className="text-xs">年間輸出実績 TOP10</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">順位</TableHead>
                      <TableHead>仕向地</TableHead>
                      <TableHead className="text-right">輸出台数</TableHead>
                      <TableHead className="text-right">前年比</TableHead>
                      <TableHead className="text-right">売上金額</TableHead>
                      <TableHead className="text-right">平均単価</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportDestinationRanking.map((item) => (
                      <TableRow key={item.rank} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                              item.rank === 1
                                ? "bg-yellow-500 text-white"
                                : item.rank === 2
                                  ? "bg-gray-400 text-white"
                                  : item.rank === 3
                                    ? "bg-amber-600 text-white"
                                    : "bg-muted"
                            }`}
                          >
                            {item.rank}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.country}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {item.code}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{item.volume.toLocaleString()}台</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`flex items-center justify-end gap-1 ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {item.change >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {item.change >= 0 ? "+" : ""}
                            {item.change}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">¥{(item.revenue / 100000000).toFixed(1)}億</TableCell>
                        <TableCell className="text-right">¥{(item.avgPrice / 10000).toFixed(0)}万</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Model Ranking by Country */}
          {exportRankingType === "model" && (
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-500" />
                      国別 車種（型式）別 輸出台数ランキング
                    </CardTitle>
                    <CardDescription className="text-xs">年間輸出実績 TOP5</CardDescription>
                  </div>
                  <Select value={selectedExportCountry} onValueChange={setSelectedExportCountry}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="国を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NZ">ニュージーランド</SelectItem>
                      <SelectItem value="AU">オーストラリア</SelectItem>
                      <SelectItem value="AE">UAE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">順位</TableHead>
                      <TableHead>車種</TableHead>
                      <TableHead>型式</TableHead>
                      <TableHead className="text-right">輸出台数</TableHead>
                      <TableHead className="text-right">前年比</TableHead>
                      <TableHead className="text-right">平均単価</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(exportByModelRanking[selectedExportCountry as keyof typeof exportByModelRanking] || []).map(
                      (item) => {
                        const key = `${selectedExportCountry}-${item.modelCode}`
                        const isExpanded = expandedExportModel === key
                        const details = isExpanded ? generateModelDetails(item.model, item.modelCode, item.avgPrice, item.volume) : []
                        return (
                          <React.Fragment key={item.rank}>
                            <TableRow
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => setExpandedExportModel(isExpanded ? null : key)}
                              data-state={isExpanded ? "expanded" : undefined}
                            >
                              <TableCell>
                                <div
                                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                                    item.rank === 1
                                      ? "bg-yellow-500 text-white"
                                      : item.rank === 2
                                        ? "bg-gray-400 text-white"
                                        : item.rank === 3
                                          ? "bg-amber-600 text-white"
                                          : "bg-muted"
                                  }`}
                                >
                                  {item.rank}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-1.5">
                                  {isExpanded
                                    ? <ChevronUp className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                    : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40 flex-shrink-0" />
                                  }
                                  {item.model}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-mono text-xs">
                                  {item.modelCode}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-medium">{item.volume.toLocaleString()}台</TableCell>
                              <TableCell className="text-right">
                                <span
                                  className={`flex items-center justify-end gap-1 ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}
                                >
                                  {item.change >= 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                  ) : (
                                    <TrendingDown className="h-3 w-3" />
                                  )}
                                  {item.change >= 0 ? "+" : ""}
                                  {item.change}%
                                </span>
                              </TableCell>
                              <TableCell className="text-right">¥{(item.avgPrice / 10000).toFixed(0)}万</TableCell>
                            </TableRow>
                            {isExpanded && (
                              <TableRow>
                                <TableCell colSpan={6} className="p-0">
                                  <div className="border-x-2 border-b-2 border-primary/20 bg-primary/[0.02] rounded-b-lg mx-2 mb-2">
                                    <div className="px-4 py-3 border-b border-primary/10 flex items-center gap-2">
                                      <Ship className="h-4 w-4 text-primary" />
                                      <span className="text-sm font-semibold">{item.model} の輸出明細</span>
                                      <Badge variant="outline" className="text-xs">{details.length}件</Badge>
                                    </div>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-xs">
                                        <thead>
                                          <tr className="border-b border-border/50 text-muted-foreground">
                                            <th className="px-3 py-2 text-left font-medium">日付</th>
                                            <th className="px-3 py-2 text-left font-medium">メーカー</th>
                                            <th className="px-3 py-2 text-left font-medium">車名</th>
                                            <th className="px-3 py-2 text-left font-medium">年式</th>
                                            <th className="px-3 py-2 text-left font-medium">型式</th>
                                            <th className="px-3 py-2 text-right font-medium">走行距離</th>
                                            <th className="px-3 py-2 text-left font-medium">カラー</th>
                                            <th className="px-3 py-2 text-left font-medium">シフト</th>
                                            <th className="px-3 py-2 text-left font-medium">駆動</th>
                                            <th className="px-3 py-2 text-left font-medium">ハンドル</th>
                                            <th className="px-3 py-2 text-right font-medium">仕入価格</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {details.map((v) => (
                                            <tr key={v.id} className="border-b border-border/30 hover:bg-muted/30">
                                              <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{v.date}</td>
                                              <td className="px-3 py-2">{v.maker}</td>
                                              <td className="px-3 py-2 font-medium">{v.model}</td>
                                              <td className="px-3 py-2">{v.year}年</td>
                                              <td className="px-3 py-2 font-mono text-muted-foreground">{v.modelCode}</td>
                                              <td className="px-3 py-2 text-right tabular-nums">{(v.mileage / 10000).toFixed(1)}万km</td>
                                              <td className="px-3 py-2">{v.color}</td>
                                              <td className="px-3 py-2"><Badge variant="outline" className="text-[10px] px-1.5 py-0">{v.shift}</Badge></td>
                                              <td className="px-3 py-2"><Badge variant="outline" className="text-[10px] px-1.5 py-0">{v.drive}</Badge></td>
                                              <td className="px-3 py-2">{v.steering}</td>
                                              <td className="px-3 py-2 text-right font-semibold tabular-nums">¥{(v.purchasePrice / 10000).toFixed(0)}万</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        )
                      },
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Volume Change Ranking */}
          {exportRankingType === "change" && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Country Volume Change */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    国別 台数増減ランキング
                  </CardTitle>
                  <CardDescription className="text-xs">前年比増減率 TOP10</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">順位</TableHead>
                        <TableHead>仕向地</TableHead>
                        <TableHead className="text-right">増減率</TableHead>
                        <TableHead className="text-right">現在</TableHead>
                        <TableHead className="text-right">前年</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exportVolumeChangeRanking.map((item) => (
                        <TableRow key={item.rank} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                                item.rank <= 3 ? "bg-green-500 text-white" : "bg-muted"
                              }`}
                            >
                              {item.rank}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{item.country}</TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`flex items-center justify-end gap-1 font-bold ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {item.change >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {item.change >= 0 ? "+" : ""}
                              {item.change}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{item.currentVolume.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {item.prevVolume.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Model Volume Change */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    車種（型式）別 台数増減ランキング
                  </CardTitle>
                  <CardDescription className="text-xs">前年比増減率 TOP10</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">順位</TableHead>
                        <TableHead>車種</TableHead>
                        <TableHead>型式</TableHead>
                        <TableHead className="text-right">増減率</TableHead>
                        <TableHead className="text-right">現在</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modelVolumeChangeRanking.map((item) => (
                        <TableRow key={item.rank} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                                item.rank <= 3 ? "bg-purple-500 text-white" : "bg-muted"
                              }`}
                            >
                              {item.rank}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-sm">{item.model}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-[10px]">
                              {item.modelCode}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`flex items-center justify-end gap-1 font-bold ${item.change >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {item.change >= 0 ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {item.change >= 0 ? "+" : ""}
                              {item.change}%
                            </span>
                          </TableCell>
                          <TableCell className="text-right">{item.currentVolume.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Download Reports */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Globe,
                title: "輸出総合レポート",
                desc: "全仕向地の詳細データ",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Ship,
                title: "仕向地別レポート",
                desc: "国別の車種構成・推移",
                color: "from-green-500 to-green-600",
              },
              {
                icon: TrendingUp,
                title: "輸出予測レポート",
                desc: "為替・需要予測分析",
                color: "from-orange-500 to-orange-600",
              },
            ].map((report, i) => (
              <Card key={i} className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="flex items-center gap-4 p-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${report.color} text-white`}
                  >
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{report.title}</div>
                    <div className="text-xs text-muted-foreground">{report.desc}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="h-4 w-4" />
                    PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
