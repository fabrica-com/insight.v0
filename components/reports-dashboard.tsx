"use client"

import React, { useState } from "react"
import { MarketMonthlyReport } from "@/components/market-monthly-report"
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
// 輸出仕向地ランキング（2025年実績ベース・外部レポートより）
// 2025年の日本からの中古車輸出台数：1,713,099台（前年比8.9%増）
const exportDestinationRanking = [
  { rank: 1, country: "UAE", code: "AE", volume: 253814, change: 12.0, share: 14.8, note: "中東・アフリカへの再輸出ハブ" },
  { rank: 2, country: "ロシア", code: "RU", volume: 186583, change: -6.3, share: 10.9, note: "経済制裁の影響継続" },
  { rank: 3, country: "タンザニア", code: "TZ", volume: 180245, change: 116.9, share: 10.5, note: "2月に首位浮上、アフリカ直送増加" },
  { rank: 4, country: "ニュージーランド", code: "NZ", volume: 142560, change: 8.5, share: 8.3, note: "安定した需要継続" },
  { rank: 5, country: "モンゴル", code: "MN", volume: 98320, change: 15.2, share: 5.7, note: "中央アジアルート拡大" },
  { rank: 6, country: "スリランカ", code: "LK", volume: 85640, change: -8.5, share: 5.0, note: "ホルムズ情勢で停滞" },
  { rank: 7, country: "ケニア", code: "KE", volume: 78450, change: 22.4, share: 4.6, note: "アフリカ東岸へのゲートウェイ" },
  { rank: 8, country: "マレーシア", code: "MY", volume: 72180, change: -12.3, share: 4.2, note: "高価格帯車両の輸出停滞" },
  { rank: 9, country: "ウガンダ", code: "UG", volume: 58920, change: 18.7, share: 3.4, note: "アフリカ内陸部への供給増" },
  { rank: 10, country: "パキスタン", code: "PK", volume: 45280, change: -5.8, share: 2.6, note: "経済不安定の影響" },
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

// 月別輸出台数推移（2025年度、仕向地別）
// ホルムズ海峡情勢の影響：2月からUAE減少、タンザニア急増
const exportTrendData = [
  { month: "4月", total: 138500, uae: 21200, tz: 8500, ru: 15800, nz: 11200, other: 81800 },
  { month: "5月", total: 142800, uae: 21800, tz: 9200, ru: 15200, nz: 11800, other: 84800 },
  { month: "6月", total: 145200, uae: 22100, tz: 10500, ru: 14800, nz: 12100, other: 85700 },
  { month: "7月", total: 148600, uae: 22500, tz: 11800, ru: 14500, nz: 12400, other: 87400 },
  { month: "8月", total: 135200, uae: 20800, tz: 12200, ru: 13800, nz: 11500, other: 76900 },
  { month: "9月", total: 146800, uae: 21900, tz: 13500, ru: 14200, nz: 12200, other: 85000 },
  { month: "10月", total: 152400, uae: 22800, tz: 14800, ru: 14800, nz: 12800, other: 87200 },
  { month: "11月", total: 148200, uae: 22200, tz: 15200, ru: 14500, nz: 12500, other: 83800 },
  { month: "12月", total: 155800, uae: 23200, tz: 16500, ru: 15200, nz: 13200, other: 87700 },
  { month: "1月", total: 138600, uae: 18500, tz: 17200, ru: 14800, nz: 11800, other: 76300 },
  { month: "2月", total: 144372, uae: 15400, tz: 18020, ru: 15100, nz: 12100, other: 83752 },
  { month: "3月", total: 158200, uae: 16800, tz: 19500, ru: 15800, nz: 13500, other: 92600 },
]

// 2025年度 月別販売推移データ（外部レポートより）
const marketTrendData = [
  { month: "4月", newCar: 342878, usedCar: 544174, newCarYoY: 110.5, usedCarYoY: 100.7 },
  { month: "5月", newCar: 324069, usedCar: 506139, newCarYoY: 103.7, usedCarYoY: 96.3 },
  { month: "6月", newCar: 393162, usedCar: 535385, newCarYoY: 105.2, usedCarYoY: 105.8 },
  { month: "7月", newCar: 390512, usedCar: 570807, newCarYoY: 96.4, usedCarYoY: 101.3 },
  { month: "8月", newCar: 301219, usedCar: 461678, newCarYoY: 91.7, usedCarYoY: 98.8 },
  { month: "9月", newCar: 428216, usedCar: 547288, newCarYoY: 97.6, usedCarYoY: 106.7 },
  { month: "10月", newCar: 395189, usedCar: 568915, newCarYoY: 98.2, usedCarYoY: 99.1 },
  { month: "11月", newCar: 369721, usedCar: 466023, newCarYoY: 94.9, usedCarYoY: 91.9 },
  { month: "12月", newCar: 335459, usedCar: 525580, newCarYoY: 101.7, usedCarYoY: 103.3 },
  { month: "1月", newCar: 367748, usedCar: 466605, newCarYoY: 97.7, usedCarYoY: 96.5 },
  { month: "2月", newCar: 394965, usedCar: 500388, newCarYoY: 96.5, usedCarYoY: 100.4 },
  { month: "3月", newCar: 490640, usedCar: 796078, newCarYoY: 98.2, usedCarYoY: 102.5 },
]

// USS オークションデータ（2025年度）
const ussAuctionData = [
  { month: "4月", listing: 327914, contract: 200476, rate: 61.1, avgPrice: 1065, priceYoY: 94.9 },
  { month: "5月", listing: 290251, contract: 187194, rate: 64.5, avgPrice: 1184, priceYoY: 98.4 },
  { month: "6月", listing: 289533, contract: 183429, rate: 63.4, avgPrice: 1230, priceYoY: 99.2 },
  { month: "7月", listing: 306955, contract: 203188, rate: 66.2, avgPrice: 1244, priceYoY: 99.0 },
  { month: "8月", listing: 233141, contract: 162263, rate: 69.6, avgPrice: 1224, priceYoY: 98.5 },
  { month: "9月", listing: 276888, contract: 194631, rate: 70.3, avgPrice: 1303, priceYoY: 105.1 },
  { month: "10月", listing: 314395, contract: 216185, rate: 68.8, avgPrice: 1305, priceYoY: 105.7 },
  { month: "11月", listing: 292696, contract: 199242, rate: 68.1, avgPrice: 1297, priceYoY: 109.6 },
  { month: "12月", listing: 256699, contract: 169328, rate: 66.0, avgPrice: 1252, priceYoY: 110.5 },
  { month: "1月", listing: 272007, contract: 189320, rate: 69.6, avgPrice: 1346, priceYoY: 107.7 },
  { month: "2月", listing: 294698, contract: 205104, rate: 69.6, avgPrice: 1380, priceYoY: 109.5 },
  { month: "3月", listing: 349260, contract: 237206, rate: 67.9, avgPrice: 1220, priceYoY: 109.3 },
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



const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  accent: "#f59e0b",
  purple: "#8b5cf6",
  pink: "#ec4899",
}

const PIE_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
]

const EXPORT_CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

// 普通車 新車販売ランキング（2026年3月）
const carSalesRankingData = [
  { rank: 1, make: "トヨタ", model: "ヤリス", sales: 13607, yoy: 82.6 },
  { rank: 2, make: "トヨタ", model: "カローラ", sales: 12835, yoy: 78.5 },
  { rank: 3, make: "トヨタ", model: "シエンタ", sales: 11674, yoy: 92.3 },
  { rank: 4, make: "ホンダ", model: "フリード", sales: 10932, yoy: 98.4 },
  { rank: 5, make: "トヨタ", model: "ライズ", sales: 10646, yoy: 143.9 },
  { rank: 6, make: "ホンダ", model: "ヴェゼル", sales: 9519, yoy: 116.8 },
  { rank: 7, make: "日産", model: "ノート", sales: 9169, yoy: 91.6 },
  { rank: 8, make: "トヨタ", model: "ヴォクシー", sales: 8580, yoy: 116.6 },
  { rank: 9, make: "トヨタ", model: "ノア", sales: 8075, yoy: 95.0 },
  { rank: 10, make: "日産", model: "セレナ", sales: 7794, yoy: 82.1 },
]

// 軽自動車 新車販売ランキング（2026年3月）
const keiCarRankingData = [
  { rank: 1, make: "ホンダ", model: "N-BOXシリーズ", sales: 21342, mom: 115.3 },
  { rank: 2, make: "スズキ", model: "スペーシアシリーズ", sales: 16039, mom: 111.1 },
  { rank: 3, make: "ダイハツ", model: "ムーヴシリーズ", sales: 14690, mom: 128.9 },
  { rank: 4, make: "ダイハツ", model: "タントシリーズ", sales: 14393, mom: 128.3 },
  { rank: 5, make: "日産", model: "ルークス", sales: 11768, mom: 123.6 },
]

// 中古車販売ランキング（国産車）
const usedCarRankingData = [
  { rank: 1, make: "トヨタ", model: "プリウス", change: "→" },
  { rank: 2, make: "ホンダ", model: "N-BOX", change: "↑" },
  { rank: 3, make: "ホンダ", model: "N-BOXカスタム", change: "↓" },
  { rank: 4, make: "日産", model: "セレナ", change: "↓" },
  { rank: 5, make: "ダイハツ", model: "ハイゼットカーゴ", change: "→" },
  { rank: 6, make: "スズキ", model: "ワゴンR", change: "→" },
  { rank: 7, make: "トヨタ", model: "アルファード", change: "↑" },
  { rank: 8, make: "ダイハツ", model: "タント", change: "↑" },
  { rank: 9, make: "スズキ", model: "エブリイ", change: "↓" },
  { rank: 10, make: "スズキ", model: "ハスラー", change: "↓" },
]

export function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState<"monthly" | "market" | "company" | "export">("monthly")
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
        onValueChange={(value) => setActiveTab(value as "monthly" | "market" | "company" | "export")}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-2xl grid-cols-4 h-11">
          <TabsTrigger value="monthly" className="gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            月次レポート
          </TabsTrigger>
          <TabsTrigger value="market" className="gap-2 text-sm">
            <Globe className="h-4 w-4" />
            市場動��
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-2 text-sm">
            <Ship className="h-4 w-4" />
            輸出動向
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2 text-sm">
            <Building2 className="h-4 w-4" />
            自社分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-6 data-[state=inactive]:hidden">
          <MarketMonthlyReport />
        </TabsContent>

        <TabsContent value="market" className="space-y-6 data-[state=inactive]:hidden">
          {/* Key Metrics - 外部レポートより */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "新車登録（3月）", value: "49.1万台", change: "-1.8%", positive: false, note: "8カ月連続前年割れ" },
              { label: "中古車登録（3月）", value: "79.6万台", change: "+2.5%", positive: true, note: "3カ月ぶりプラス" },
              { label: "USS平均成約単価", value: "122万円", change: "+9.3%", positive: true, note: "前月比-16万円" },
              { label: "USS成約率", value: "67.9%", change: "+2.1pt", positive: true, note: "前年同月比" },
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
                    <span className="text-muted-foreground">{stat.note}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 新車・中古車登録推移チャート */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">新車・中古車登録台数推移（2025年度）</CardTitle>
                <CardDescription className="text-xs">自販連・全軽自協データより</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number) => [`${value.toLocaleString()}台`, ""]}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Bar dataKey="newCar" name="新車登録" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="usedCar" name="中古車登録" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">USSオークション成約単価推移</CardTitle>
                <CardDescription className="text-xs">2025年度通期データ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ussAuctionData}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => `${v}千円`} domain={[1000, 1400]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                        formatter={(value: number, name: string) => {
                          if (name === "平均成約単価") return [`${value}千円`, name]
                          return [`${value}%`, name]
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Area
                        type="monotone"
                        dataKey="avgPrice"
                        name="平均成約単価"
                        stroke={CHART_COLORS.accent}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPrice)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 販売ランキング */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  普通車 新車販売ランキング（3月）
                </CardTitle>
                <CardDescription className="text-xs">自販連発表データ</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">順位</TableHead>
                      <TableHead>車種</TableHead>
                      <TableHead>メーカー</TableHead>
                      <TableHead className="text-right">販売台数</TableHead>
                      <TableHead className="text-right">前年比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carSalesRankingData.slice(0, 5).map((item) => (
                      <TableRow key={item.rank}>
                        <TableCell>
                          <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                            item.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}>
                            {item.rank}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.model}</TableCell>
                        <TableCell className="text-muted-foreground">{item.make}</TableCell>
                        <TableCell className="text-right font-mono">{item.sales.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={item.yoy >= 100 ? "text-green-500" : "text-red-500"}>
                            {item.yoy}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-500" />
                  軽自動車 新車販売ランキング（3月）
                </CardTitle>
                <CardDescription className="text-xs">全軽自協発表データ</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">順位</TableHead>
                      <TableHead>車種</TableHead>
                      <TableHead>メーカー</TableHead>
                      <TableHead className="text-right">販売台数</TableHead>
                      <TableHead className="text-right">前月比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keiCarRankingData.map((item) => (
                      <TableRow key={item.rank}>
                        <TableCell>
                          <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                            item.rank <= 3 ? "bg-green-500 text-white" : "bg-muted"
                          }`}>
                            {item.rank}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.model}</TableCell>
                        <TableCell className="text-muted-foreground">{item.make}</TableCell>
                        <TableCell className="text-right font-mono">{item.sales.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-green-500">{item.mom}%</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* 中古車販売ランキング */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-500" />
                中古車 車種別販売ランキング（3月）
              </CardTitle>
              <CardDescription className="text-xs">車選びドットコム加盟店データ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {usedCarRankingData.map((item) => (
                  <div key={item.rank} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                      item.rank <= 3 ? "bg-purple-500 text-white" : "bg-muted"
                    }`}>
                      {item.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{item.model}</div>
                      <div className="text-xs text-muted-foreground">{item.make}</div>
                    </div>
                    <Badge variant={item.change === "↑" ? "default" : item.change === "↓" ? "secondary" : "outline"} className="text-xs">
                      {item.change === "↑" ? "UP" : item.change === "↓" ? "DOWN" : "SAME"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* インサイト */}
          <Card className="border-border/50 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                市場インサイト
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-border/50">
                <h4 className="font-semibold text-sm mb-2">新車市場の構造変化</h4>
                <p className="text-sm text-muted-foreground">
                  普通車は8カ月連続で前年割れ（3月：前年比92.7%）、一方で軽自動車は4カ月連続プラス（同108.7%）。市場の中軸が登録車から軽へ移行する傾向が鮮明化。
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border/50">
                <h4 className="font-semibold text-sm mb-2">AA相場の調整局面</h4>
                <p className="text-sm text-muted-foreground">
                  USS平均成約単価は1-2月の過去最高更新後、3月に前月比16万円下落。出品台数が前月比18.5%増と急増し、需給が緩んだ。ただし前年比では+9.3%を維持。
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border/50">
                <h4 className="font-semibold text-sm mb-2">中古車市場の底入れ</h4>
                <p className="text-sm text-muted-foreground">
                  中古車登録は3カ月ぶりにプラス転換。新車納期改善で下取り発生が増加し、流通量が回復。ただし5年落ち相当の良質玉は依然として不足が継続。
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6 data-[state=inactive]:hidden">
          {/* 輸出市場ヘッドライン */}
          <Card className="border-border/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">ホルムズ海峡情勢による仕向地構造の変化</h3>
                  <p className="text-sm text-muted-foreground">
                    2026年2月、タンザニアが前年同月比116.9%増で初の首位浮上、UAEは14.5%減で2位に後退。UAE経由の再輸出に頼っていた業者がアフリカ直送ルートへ仕向地を切り替えた結果、輸出市場の地殻変動が進行中。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats - 外部レポートより */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "2025年輸出総台数", value: "171.3万台", change: "+8.9%", positive: true, note: "5年連続増加" },
              { label: "2月輸出台数", value: "14.4万台", change: "+5.5%", positive: true, note: "前年同月比" },
              { label: "UAE向け（2月）", value: "1.54万台", change: "-14.5%", positive: false, note: "ホルムズ影響" },
              { label: "タンザニア向け（2月）", value: "1.80万台", change: "+116.9%", positive: true, note: "首位浮上" },
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
                    <span className="text-muted-foreground">{stat.note}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Export Trend Chart - 仕向地シフトを可視化 */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">月別輸出台数推移（2025年度）</CardTitle>
              <CardDescription className="text-xs">主要仕向地別内訳 - 1-2月のUAE減・タンザニア増に注目</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={exportTrendData}>
                    <defs>
                      <linearGradient id="colorUAE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorTZ" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRU" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorNZ" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()}台`, ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Area
                      type="monotone"
                      dataKey="uae"
                      name="UAE"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorUAE)"
                      stackId="1"
                    />
                    <Area
                      type="monotone"
                      dataKey="tz"
                      name="タンザニア"
                      stroke="#10b981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTZ)"
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
                      dataKey="nz"
                      name="NZ"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNZ)"
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

          {/* Destination Ranking - 外部レポートデータ反映 */}
          {exportRankingType === "destination" && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  仕向地（国）別 輸出台数ランキング
                </CardTitle>
                <CardDescription className="text-xs">2025年通年実績 TOP10（日本中古車輸出業協同組合データ）</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">順位</TableHead>
                      <TableHead>仕向地</TableHead>
                      <TableHead className="text-right">輸出台数</TableHead>
                      <TableHead className="text-right">前年比</TableHead>
                      <TableHead className="text-right">シェア</TableHead>
                      <TableHead className="w-[200px]">備考</TableHead>
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
                        <TableCell className="text-right">{item.share}%</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* 輸出市場インサイト */}
          <Card className="border-border/50 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                輸出市場インサイト
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-sm mb-2 text-amber-700 dark:text-amber-400">仕向地ポートフォリオの再設計が急務</h4>
                <p className="text-sm text-muted-foreground">
                  ホルムズ海峡の通常運航の本格回復は早ければ2026年後半との見方。UAE一極集中型のロジスティクスから、アフリカ直送、モンゴル経由、東南アジア直送など複数ルートへの分散が重要に。
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border/50">
                <h4 className="font-semibold text-sm mb-2">輸出向けプレミアムの変動リスク</h4>
                <p className="text-sm text-muted-foreground">
                  ランドクルーザー、ハイエース、SUV系の相場が一時的に緩む可能性。仕入れ価格と小売出口価格のミスマッチが起きやすい局面に入るため、車種ごとの仕入れ判断に慎重さが必要。
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border/50">
                <h4 className="font-semibold text-sm mb-2">アフリカ市場の急成長</h4>
                <p className="text-sm text-muted-foreground">
                  タンザニア、ケニア、ウガンダなど東アフリカ諸国への直送ルートが急拡大。UAE経由の再輸出コスト増を回避する動きが加速し、仕向地構造の組み替えが進行中。
                </p>
              </div>
            </CardContent>
          </Card>

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
                                            <th className="px-3 py-2 text-left font-medium">��付</th>
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

        <TabsContent value="company" className="space-y-6 data-[state=inactive]:hidden">
          {/* Company Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "月間販売台数", value: "118台", change: "+18%", positive: true },
              { label: "目標達成率", value: "118%", change: "+8pt", positive: true },
              { label: "月間売上", value: "¥356M", change: "+14.1%", positive: true },
              { label: "平均販売単価", value: "¥3.02M", change: "+3.2%", positive: true },
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
                    <span className="text-muted-foreground">前月比</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">自社パフォーマンス推移</CardTitle>
              <CardDescription className="text-xs">販売実績 vs 目標</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={companyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="sales" name="販売実績" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" name="目標" fill={CHART_COLORS.accent} opacity={0.5} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Comparison */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">競合比較分析</CardTitle>
              <CardDescription className="text-xs">主要指標の相対評価</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={competitorComparisonData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: "#6b7280", fontSize: 10 }} />
                    <Radar name="自社" dataKey="A" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.3} />
                    <Radar name="競合平均" dataKey="B" stroke={CHART_COLORS.accent} fill={CHART_COLORS.accent} fillOpacity={0.3} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Download Reports */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "自社分析レポート",
                desc: "パフォーマンス詳細",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Target,
                title: "競合分析レポート",
                desc: "市場ポジション分析",
                color: "from-green-500 to-green-600",
              },
              {
                icon: Activity,
                title: "KPI推移レポート",
                desc: "月次・四半期比較",
                color: "from-purple-500 to-purple-600",
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
