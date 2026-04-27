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

// =====================================================
// 公開データソース: 財務省E-Stat普通貿易統計
// データ加工元: JUMV.NET (https://jumv.net)
// 更新頻度: 月次（毎月中旬に前月分データ公開）
// =====================================================

// 2025年通年 中古車輸出台数ランキング TOP10
// 出典: 財務省E-Stat普通貿易統計 → JUMV.NET集計
// 総輸出台数: 1,708,604台（前年比109.1%）
const exportDestinationRanking2025 = [
  { rank: 1, country: "アラブ首長国連邦", code: "AE", volume: 232408, share: 14.9, yoy: 113.0, note: "中東・アフリカへの再輸出ハブ" },
  { rank: 2, country: "ロシア", code: "RU", volume: 170347, share: 10.9, yoy: 91.0, note: "前年比マイナス継続" },
  { rank: 3, country: "タンザニア", code: "TZ", volume: 105566, share: 6.8, yoy: 148.3, note: "アフリカ直送ルート急成長" },
  { rank: 4, country: "チリ", code: "CL", volume: 74548, share: 4.8, yoy: 129.9, note: "南米市場の拡大" },
  { rank: 5, country: "ケニア", code: "KE", volume: 71105, share: 4.6, yoy: 123.0, note: "東アフリカのゲートウェイ" },
  { rank: 6, country: "ニュージーランド", code: "NZ", volume: 65171, share: 4.2, yoy: 87.5, note: "前年比減少" },
  { rank: 7, country: "モンゴル", code: "MN", volume: 60770, share: 3.9, yoy: 57.9, note: "大幅減少" },
  { rank: 8, country: "南アフリカ", code: "ZA", volume: 58207, share: 3.7, yoy: 118.5, note: "アフリカ南部の成長" },
  { rank: 9, country: "スリランカ", code: "LK", volume: 57016, share: 3.7, yoy: 69531.7, note: "輸入規制緩和で急回復" },
  { rank: 10, country: "タイ", code: "TH", volume: 45273, share: 2.9, yoy: 103.7, note: "ASEAN需要" },
]

// 2026年1月 中古車輸出台数ランキング TOP20
// 出典: 財務省E-Stat普通貿易統計 → JUMV.NET集計
// 総輸出台数: 116,223台
const exportDestinationRanking2026Jan = [
  { rank: 1, country: "アラブ首長国連邦", code: "AE", volume: 17802, share: 15.3, yoy: 103.8 },
  { rank: 2, country: "ロシア", code: "RU", volume: 11194, share: 9.6, yoy: 145.2 },
  { rank: 3, country: "タンザニア", code: "TZ", volume: 8688, share: 7.5, yoy: 141.0 },
  { rank: 4, country: "マレーシア", code: "MY", volume: 8105, share: 7.0, yoy: 141.1 },
  { rank: 5, country: "チリ", code: "CL", volume: 7187, share: 6.2, yoy: 201.7 },
  { rank: 6, country: "ニュージーランド", code: "NZ", volume: 5631, share: 4.8, yoy: 150.1 },
  { rank: 7, country: "スリランカ", code: "LK", volume: 5176, share: 4.5, yoy: 172533.3 },
  { rank: 8, country: "モンゴル", code: "MN", volume: 4711, share: 4.1, yoy: 77.3 },
  { rank: 9, country: "南アフリカ", code: "ZA", volume: 4523, share: 3.9, yoy: 131.4 },
  { rank: 10, country: "ケニア", code: "KE", volume: 3850, share: 3.3, yoy: 106.4 },
  { rank: 11, country: "キプロス", code: "CY", volume: 3567, share: 3.1, yoy: 310.2 },
  { rank: 12, country: "タイ", code: "TH", volume: 2784, share: 2.4, yoy: 69.6 },
  { rank: 13, country: "フィリピン", code: "PH", volume: 2684, share: 2.3, yoy: 73.1 },
  { rank: 14, country: "バングラデシュ", code: "BD", volume: 2147, share: 1.8, yoy: 168.0 },
  { rank: 15, country: "ガイアナ", code: "GY", volume: 1915, share: 1.6, yoy: 135.1 },
  { rank: 16, country: "イギリス", code: "GB", volume: 1763, share: 1.5, yoy: 168.4 },
  { rank: 17, country: "ガーナ", code: "GH", volume: 1657, share: 1.4, yoy: 184.9 },
  { rank: 18, country: "オーストラリア", code: "AU", volume: 1609, share: 1.4, yoy: 217.7 },
  { rank: 19, country: "ウガンダ", code: "UG", volume: 1476, share: 1.3, yoy: 76.1 },
  { rank: 20, country: "ジョージア", code: "GE", volume: 1419, share: 1.2, yoy: 198.7 },
]

// 車両タイプ別 輸出ランキング（2026年1月）- 普通車
// 出典: 財務省E-Stat普通貿易統計 → JUMV.NET集計
const exportByTypeRegular2026Jan = [
  { rank: 1, country: "ロシア", volume: 9840, note: "制裁下でも回復基調" },
  { rank: 2, country: "マレーシア", volume: 7839, note: "右ハンドル需要" },
  { rank: 3, country: "アラブ首長国連邦", volume: 7255, note: "再輸出向け" },
  { rank: 4, country: "タンザニア", volume: 5820, note: "アフリカ直送" },
  { rank: 5, country: "チリ", volume: 5124, note: "南米向け好調" },
]

// 車両タイプ別 輸出ランキング（2026年1月）- ハイブリッド
// 出典: 財務省E-Stat普通貿易統計 → JUMV.NET集計
const exportByTypeHybrid2026Jan = [
  { rank: 1, country: "アラブ首長国連邦", volume: 5306, note: "プリウス・アクア需要" },
  { rank: 2, country: "モンゴル", volume: 3938, note: "ハイブリッド人気" },
  { rank: 3, country: "ニュージーランド", volume: 2157, note: "環境規制対応" },
  { rank: 4, country: "スリランカ", volume: 1852, note: "輸入再開で急増" },
  { rank: 5, country: "キプロス", volume: 1680, note: "欧州向けハブ" },
]

// 車両タイプ別 輸出ランキング（2025年通年）- 軽自動車
// 出典: 財務省E-Stat普通貿易統計 → JUMV.NET集計
const exportByTypeKei2025 = [
  { rank: 1, country: "アラブ首長国連邦", volume: 76994, share: 22.7, yoy: 133.9 },
  { rank: 2, country: "モンゴル", volume: 54922, share: 16.2, yoy: 58.2 },
  { rank: 3, country: "ニュージーランド", volume: 34602, share: 10.2, yoy: 98.3 },
  { rank: 4, country: "バングラデシュ", volume: 15367, share: 4.5, yoy: 123.0 },
  { rank: 5, country: "イギリス", volume: 15343, share: 4.5, yoy: 130.0 },
]

// 月別輸出台数推移（2025年 - 軽自動車）
// 出典: 財務省E-Stat普通貿易統計 → JUMV.NET集計
const exportMonthlyTrendKei = [
  { month: "1月", volume: 20490, avgFOB: 107.9 },
  { month: "2月", volume: 30628, avgFOB: 115.5 },
  { month: "3月", volume: 32981, avgFOB: 122.7 },
  { month: "4月", volume: 30963, avgFOB: 113.2 },
  { month: "5月", volume: 29585, avgFOB: 113.9 },
  { month: "6月", volume: 28734, avgFOB: 120.5 },
  { month: "7月", volume: 28646, avgFOB: 132.1 },
  { month: "8月", volume: 26272, avgFOB: 117.4 },
  { month: "9月", volume: 27404, avgFOB: 122.0 },
  { month: "10月", volume: 29122, avgFOB: 124.3 },
  { month: "11月", volume: 26225, avgFOB: 129.7 },
  { month: "12月", volume: 28384, avgFOB: 113.4 },
]

// 年別輸出台数推移（軽自動車）
// 出典: 財務省E-Stat普通貿易統計 → JUMV.NET集計
const exportYearlyTrendKei = [
  { year: "2017", volume: 123753 },
  { year: "2018", volume: 161681 },
  { year: "2019", volume: 148881 },
  { year: "2020", volume: 140312 },
  { year: "2021", volume: 189008 },
  { year: "2022", volume: 231662 },
  { year: "2023", volume: 328600 },
  { year: "2024", volume: 337310 },
  { year: "2025", volume: 339434 },
]

// FOB価格推移（軽自動車、千円）
// 出典: 財務省E-Stat普通貿易統計 → JUMV.NET集計
const fobPriceTrendKei = [
  { year: "2020", jan: 70.4, feb: 69.8, mar: 70.0, apr: 61.1, may: 58.7, jun: 59.7, jul: 61.3, aug: 62.4, sep: 62.3, oct: 62.6, nov: 63.5, dec: 65.2 },
  { year: "2021", jan: 73.8, feb: 73.0, mar: 73.1, apr: 72.4, may: 68.2, jun: 76.7, jul: 77.7, aug: 80.0, sep: 80.5, oct: 80.3, nov: 71.4, dec: 80.1 },
  { year: "2022", jan: 91.9, feb: 85.9, mar: 86.7, apr: 89.5, may: 88.1, jun: 94.2, jul: 105.3, aug: 114.2, sep: 117.9, oct: 123.2, nov: 119.9, dec: 113.8 },
  { year: "2023", jan: 105.7, feb: 99.6, mar: 101.8, apr: 97.4, may: 91.8, jun: 90.7, jul: 95.5, aug: 93.4, sep: 93.7, oct: 101.6, nov: 96.6, dec: 91.5 },
  { year: "2024", jan: 96.6, feb: 102.1, mar: 107.8, apr: 112.5, may: 110.7, jun: 115.2, jul: 125.1, aug: 121.2, sep: 110.4, oct: 108.7, nov: 110.5, dec: 107.1 },
  { year: "2025", jan: 107.9, feb: 115.5, mar: 122.7, apr: 113.2, may: 113.9, jun: 120.5, jul: 132.1, aug: 117.4, sep: 122.0, oct: 124.3, nov: 129.7, dec: 113.4 },
  { year: "2026", jan: 138.9, feb: 135.2, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 },
]

// 前年比伸び率ランキング（2026年1月）
const exportGrowthRanking2026Jan = [
  { rank: 1, country: "スリランカ", yoy: 172533.3, note: "輸入規制解除" },
  { rank: 2, country: "韓国", yoy: 442.6, note: "中古車輸入再開" },
  { rank: 3, country: "中国", yoy: 1466.7, note: "試験的輸入拡大" },
  { rank: 4, country: "キプロス", yoy: 310.2, note: "欧州経由ルート" },
  { rank: 5, country: "オーストラリア", yoy: 217.7, note: "需要急回復" },
  { rank: 6, country: "チリ", yoy: 201.7, note: "南米市場好調" },
  { rank: 7, country: "ジョージア", yoy: 198.7, note: "中央アジア経由" },
  { rank: 8, country: "ガーナ", yoy: 184.9, note: "西アフリカ需要" },
  { rank: 9, country: "バングラデシュ", yoy: 168.0, note: "南アジア回復" },
  { rank: 10, country: "イギリス", yoy: 168.4, note: "右ハンドル需要" },
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
  const [exportRankingType, setExportRankingType] = useState<"destination" | "destination2026" | "type" | "growth" | "model" | "change">("destination")
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
          {/* キーメトリクス - 財務省E-Stat貿易統計より */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "2025年通年輸出台数", value: "170.9万台", change: "+9.1%", positive: true, note: "財務省E-Stat" },
              { label: "2026年1月輸出台数", value: "11.6万台", change: "+3.8%", positive: true, note: "財務省E-Stat" },
              { label: "軽自動車FOB価格", value: "138.9万円", change: "+28.7%", positive: true, note: "2026年1月" },
              { label: "タンザニア（1月）", value: "8,688台", change: "+41.0%", positive: true, note: "アフリカ直送増" },
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

          {/* 年別・月別輸出推移チャート - 財務省E-Stat貿易統計より */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">年別輸出台数推移（軽自動車）</CardTitle>
                <CardDescription className="text-xs">出典: 財務省E-Stat普通貿易統計</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={exportYearlyTrendKei}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }}
                        formatter={(value: number) => [`${value.toLocaleString()}台`, "輸出台数"]}
                      />
                      <Bar dataKey="volume" name="輸出台数" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">月別FOB価格推移（軽自動車）</CardTitle>
                <CardDescription className="text-xs">出典: 財務省E-Stat普通貿易統計（単位: 万円）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={exportMonthlyTrendKei}>
                      <defs>
                        <linearGradient id="colorFOB" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.accent} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} domain={[100, 140]} tickFormatter={(v) => `${v}万`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "12px" }}
                        formatter={(value: number) => [`${value}万円`, "FOB価格"]}
                      />
                      <Area type="monotone" dataKey="avgFOB" name="FOB価格" stroke={CHART_COLORS.accent} strokeWidth={2} fillOpacity={1} fill="url(#colorFOB)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ranking Type Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">ランキング種別:</span>
            <div className="flex gap-2">
              {[
                { value: "destination", label: "仕向地別（2025年）" },
                { value: "destination2026", label: "仕向地別（2026年1月）" },
                { value: "type", label: "車両タイプ別" },
                { value: "growth", label: "伸び率ランキング" },
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

          {/* 2025年通年 仕向地ランキング - 財務省E-Stat貿易統計より */}
          {exportRankingType === "destination" && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  仕向地（国）別 輸出台数ランキング - 2025年通年
                </CardTitle>
                <CardDescription className="text-xs">出典: 財務省E-Stat普通貿易統計（総輸出台数: 1,708,604台、前年比109.1%）</CardDescription>
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
                    {exportDestinationRanking2025.map((item) => (
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
                            className={`flex items-center justify-end gap-1 ${item.yoy >= 100 ? "text-green-500" : "text-red-500"}`}
                          >
                            {item.yoy >= 100 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {item.yoy}%
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

          {/* 2026年1月 仕向地ランキング - 財務省E-Stat貿易統計より */}
          {exportRankingType === "destination2026" && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  仕向地（国）別 輸出台数ランキング - 2026年1月
                </CardTitle>
                <CardDescription className="text-xs">出典: 財務省E-Stat普通貿易統計（総輸出台数: 116,223台）</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">順位</TableHead>
                      <TableHead>仕向地</TableHead>
                      <TableHead className="text-right">輸出台数</TableHead>
                      <TableHead className="text-right">前年同月比</TableHead>
                      <TableHead className="text-right">シェア</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportDestinationRanking2026Jan.slice(0, 15).map((item) => (
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
                            className={`flex items-center justify-end gap-1 ${item.yoy >= 100 ? "text-green-500" : "text-red-500"}`}
                          >
                            {item.yoy >= 100 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {item.yoy}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{item.share}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* 車両タイプ別ランキング */}
          {exportRankingType === "type" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    普通車 TOP5（2026年1月）
                  </CardTitle>
                  <CardDescription className="text-xs">財務省E-Stat貿易統計</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exportByTypeRegular2026Jan.map((item) => (
                      <div key={item.rank} className="flex items-center gap-3">
                        <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                          item.rank <= 3 ? "bg-blue-500 text-white" : "bg-muted"
                        }`}>
                          {item.rank}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.country}</div>
                          <div className="text-xs text-muted-foreground">{item.note}</div>
                        </div>
                        <div className="text-sm font-mono">{item.volume.toLocaleString()}台</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    ハイブリッド TOP5（2026年1月）
                  </CardTitle>
                  <CardDescription className="text-xs">財務省E-Stat貿易統計</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exportByTypeHybrid2026Jan.map((item) => (
                      <div key={item.rank} className="flex items-center gap-3">
                        <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                          item.rank <= 3 ? "bg-green-500 text-white" : "bg-muted"
                        }`}>
                          {item.rank}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.country}</div>
                          <div className="text-xs text-muted-foreground">{item.note}</div>
                        </div>
                        <div className="text-sm font-mono">{item.volume.toLocaleString()}台</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    軽自動車 TOP5（2025年）
                  </CardTitle>
                  <CardDescription className="text-xs">財務省E-Stat貿易統計</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {exportByTypeKei2025.map((item) => (
                      <div key={item.rank} className="flex items-center gap-3">
                        <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                          item.rank <= 3 ? "bg-purple-500 text-white" : "bg-muted"
                        }`}>
                          {item.rank}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.country}</div>
                          <div className="text-xs text-muted-foreground">シェア {item.share}%</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono">{item.volume.toLocaleString()}台</div>
                          <div className={`text-xs ${item.yoy >= 100 ? "text-green-500" : "text-red-500"}`}>
                            {item.yoy}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 伸び率ランキング */}
          {exportRankingType === "growth" && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  前年同月比 伸び率ランキング（2026年1月）
                </CardTitle>
                <CardDescription className="text-xs">出典: 財務省E-Stat普通貿易統計 - 成長市場の発見に活用</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">順位</TableHead>
                      <TableHead>仕向地</TableHead>
                      <TableHead className="text-right">前年同月比</TableHead>
                      <TableHead className="w-[250px]">備考</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportGrowthRanking2026Jan.map((item) => (
                      <TableRow key={item.rank}>
                        <TableCell>
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                            item.rank <= 3 ? "bg-green-500 text-white" : "bg-muted"
                          }`}>
                            {item.rank}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.country}</TableCell>
                        <TableCell className="text-right">
                          <span className="text-green-500 font-bold">
                            {item.yoy > 1000 ? `${(item.yoy / 100).toFixed(0)}倍` : `+${(item.yoy - 100).toFixed(1)}%`}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* データソース情報 */}
          <Card className="border-border/50 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                データソース情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-3 bg-background rounded-lg border border-border/50">
                  <h4 className="font-semibold text-sm mb-1">財務省E-Stat普通貿易統計</h4>
                  <p className="text-xs text-muted-foreground">
                    政府統計の総合窓口で公開される公式データ。毎月中旬に前月分が更新されます。
                  </p>
                  <a href="https://www.e-stat.go.jp" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                    e-stat.go.jp
                  </a>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border/50">
                  <h4 className="font-semibold text-sm mb-1">JUMV.NET（データ加工元）</h4>
                  <p className="text-xs text-muted-foreground">
                    財務省E-Statデータを可視化・集計。国別・車種別・月別のランキングを提供。
                  </p>
                  <a href="https://jumv.net" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                    jumv.net
                  </a>
                </div>
              </div>
              <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
                更新頻度: 月次（毎月中旬に前月分データ公開） / 最終更新: 2026年1月分まで反映
              </div>
            </CardContent>
          </Card>

          {/* 輸出市場インサイト */}
          <Card className="border-border/50 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                輸出市場インサイト（データ分析）
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-sm mb-2 text-green-700 dark:text-green-400">タンザニアの急成長（前年比+48.3%）</h4>
                <p className="text-sm text-muted-foreground">
                  2025年通年で105,566台（シェア6.8%）を記録。アフリカ直送ルートの拡大により、UAE経由の再輸出に依存しない物流が確立されつつあります。
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-sm mb-2 text-amber-700 dark:text-amber-400">軽自動車FOB価格の高騰</h4>
                <p className="text-sm text-muted-foreground">
                  2026年1月のFOB価格は138.9万円で、2020年（約65万円）から2倍以上に上昇。国内中古車価格上昇と円安が継続しており、輸出採算は改善傾向。
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-sm mb-2 text-red-700 dark:text-red-400">ロシア向け減少傾向の継続</h4>
                <p className="text-sm text-muted-foreground">
                  2025年通年で前年比91.0%と減少。ただし2026年1月は前年同月比145.2%と回復の兆し。制裁下でも一定の需要は存在。
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border/50">
                <h4 className="font-semibold text-sm mb-2">スリランカの輸入再開</h4>
                <p className="text-sm text-muted-foreground">
                  輸入規制緩和により2025年は前年比69,531.7%（ほぼゼロからの回復）。2026年1月も5,176台と好調を維持。南アジア市場の回復に注目。
                </p>
              </div>
            </CardContent>
          </Card>

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
