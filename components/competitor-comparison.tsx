"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
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
import { TrendingUp, TrendingDown, Plus, X } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const AVAILABLE_COMPETITORS = [
  { id: "own-company", name: "自社（マイカーセンター）", region: "東京都港区", distance: "0km", isOwnCompany: true },
  { id: "comp-1", name: "カーセレクト東京", region: "東京都渋谷区", distance: "2.3km" },
  { id: "comp-2", name: "オートプラザ横浜", region: "神奈川県横浜市", distance: "15.8km" },
  { id: "comp-3", name: "ドライブワン川崎", region: "神奈川県川崎市", distance: "8.5km" },
  { id: "comp-4", name: "モーターランド品川", region: "東京都品川区", distance: "5.2km" },
  { id: "comp-5", name: "カーショップ目黒", region: "東京都目黒区", distance: "3.7km" },
]

const COMPETITOR_COLORS = [
  "#6366f1", // 自社（インディゴ）
  "#3b82f6", // 青
  "#10b981", // 緑
  "#f59e0b", // オレンジ
  "#8b5cf6", // 紫
  "#ec4899", // ピンク
]

const YEAR_COLORS = [
  "#3b82f6", // 青
  "#10b981", // 緑
  "#f59e0b", // オレンジ
  "#8b5cf6", // 紫
  "#ec4899", // ピンク
  "#06b6d4", // シアン
  "#f97316", // ディープオレンジ
  "#84cc16", // ライム
  "#64748b", // グレー (それ以前)
]

export function CompetitorComparison() {
  const [selectedCompetitors, setSelectedCompetitors] = useState(["own-company", "comp-1", "comp-2", "comp-3"])
  const [visibleCompetitors, setVisibleCompetitors] = useState<string[]>(["own-company", "comp-1", "comp-2", "comp-3"])
  const [selectedPeriod, setSelectedPeriod] = useState("3months")
  const [trendPeriodType, setTrendPeriodType] = useState<"monthly" | "yearly">("monthly")
  const [turnoverPeriod, setTurnoverPeriod] = useState<"6months" | "1year" | "5years">("6months")

  const toggleCompetitorVisibility = (competitorId: string) => {
    if (visibleCompetitors.includes(competitorId)) {
      setVisibleCompetitors(visibleCompetitors.filter((id) => id !== competitorId))
    } else {
      setVisibleCompetitors([...visibleCompetitors, competitorId])
    }
  }

  const handleAddCompetitor = (competitorId: string) => {
    if (!selectedCompetitors.includes(competitorId) && selectedCompetitors.length < 6) {
      setSelectedCompetitors([...selectedCompetitors, competitorId])
      setVisibleCompetitors([...visibleCompetitors, competitorId])
    }
  }

  const handleRemoveCompetitor = (competitorId: string) => {
    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === competitorId)
    if (competitor?.isOwnCompany) {
      return
    }
    if (selectedCompetitors.length > 2) {
      setSelectedCompetitors(selectedCompetitors.filter((id) => id !== competitorId))
      setVisibleCompetitors(visibleCompetitors.filter((id) => id !== competitorId))
    }
  }

  const currentSnapshot = selectedCompetitors.map((id, index) => {
    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
    const isOwn = competitor?.isOwnCompany
    return {
      id,
      name: competitor?.name || "",
      inventoryCount: isOwn ? 180 : 120 + index * 30,
      inventoryValue: isOwn ? 720000000 : 450000000 + index * 100000000,
      avgPrice: isOwn ? 1500000 : 1200000 + index * 200000,
      avgInventoryDays: isOwn ? 38 : 45 + index * 10,
      turnoverRate: isOwn ? 9.5 : parseFloat((8.2 - index * 0.5).toFixed(1)),
    }
  })

  const currentYear = 2024
  const yearDistributionStacked = selectedCompetitors.map((id, index) => {
    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
    const isOwn = competitor?.isOwnCompany

    const counts = isOwn
      ? {
          [`${currentYear}年`]: 20,
          [`${currentYear - 1}年`]: 28,
          [`${currentYear - 2}年`]: 32,
          [`${currentYear - 3}年`]: 25,
          [`${currentYear - 4}年`]: 18,
          [`${currentYear - 5}年`]: 15,
          [`${currentYear - 6}年`]: 12,
          [`${currentYear - 7}年`]: 8,
          それ以前: 10,
        }
      : {
          [`${currentYear}年`]: 12 + index * 3,
          [`${currentYear - 1}年`]: 18 + index * 4,
          [`${currentYear - 2}年`]: 22 + index * 2,
          [`${currentYear - 3}年`]: 15 - index * 1,
          [`${currentYear - 4}年`]: 12 + index * 1,
          [`${currentYear - 5}年`]: 10 - index * 1,
          [`${currentYear - 6}年`]: 8 + index * 1,
          [`${currentYear - 7}年`]: 5 + index * 1,
          それ以前: 8 + index * 2,
        }

    const sum = Object.values(counts).reduce((a, b) => a + b, 0)

    return {
      name: competitor?.name || "",
      [`${currentYear}年`]: (counts[`${currentYear}年`] / sum) * 100,
      [`${currentYear - 1}年`]: (counts[`${currentYear - 1}年`] / sum) * 100,
      [`${currentYear - 2}年`]: (counts[`${currentYear - 2}年`] / sum) * 100,
      [`${currentYear - 3}年`]: (counts[`${currentYear - 3}年`] / sum) * 100,
      [`${currentYear - 4}年`]: (counts[`${currentYear - 4}年`] / sum) * 100,
      [`${currentYear - 5}年`]: (counts[`${currentYear - 5}年`] / sum) * 100,
      [`${currentYear - 6}年`]: (counts[`${currentYear - 6}年`] / sum) * 100,
      [`${currentYear - 7}年`]: (counts[`${currentYear - 7}年`] / sum) * 100,
      それ以前: (counts["それ以前"] / sum) * 100,
    }
  })

  // メーカー比率データ
  const manufacturerData = selectedCompetitors.map((id, index) => {
    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
    const isOwn = competitor?.isOwnCompany
    return {
      name: competitor?.name || "",
      data: isOwn
        ? [
            { name: "トヨタ", value: 35 },
            { name: "日産", value: 22 },
            { name: "ホンダ", value: 20 },
            { name: "マツダ", value: 10 },
            { name: "BMW", value: 6 },
            { name: "メルセデス・ベンツ", value: 5 },
            { name: "その他", value: 2 },
          ]
        : [
            { name: "トヨタ", value: 30 + index * 3 },
            { name: "日産", value: 20 - index * 2 },
            { name: "ホンダ", value: 18 + index * 1 },
            { name: "マツダ", value: 12 - index * 1 },
            { name: "BMW", value: 8 + index * 1 },
            { name: "メルセデス・ベンツ", value: 7 + index * 1 },
            { name: "その他", value: 5 },
          ],
    }
  })

  const vehicleTypeData = [
    { type: "セダン", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 28 : 25 + i * 3])) },
    { type: "SUV", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 32 : 30 - i * 2])) },
    { type: "ワゴン", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 18 : 15 + i * 1])) },
    { type: "ミニバン", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 15 : 20 - i * 1])) },
    { type: "コンパクト", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 7 : 10 + i * 2])) },
  ]

  const priceDistribution = [
    { range: "50万以下", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5 : 8 + i * 2])) },
    { range: "50-100万", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 18 : 20 + i * 3])) },
    { range: "100-150万", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 28 : 25 - i * 2])) },
    { range: "150-200万", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 25 : 22 + i * 1])) },
    { range: "200-300万", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 16 : 15 - i * 1])) },
    { range: "300万以上", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 8 : 10 + i * 2])) },
  ]

  const originData = selectedCompetitors.map((id, index) => {
    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
    const isOwn = competitor?.isOwnCompany
    return {
      name: competitor?.name || "",
      data: isOwn
        ? [
            { name: "国産車", value: 65 },
            { name: "輸入車", value: 20 },
            { name: "軽自動車", value: 15 },
          ]
        : [
            { name: "国産車", value: 60 - index * 5 },
            { name: "輸入車", value: 25 + index * 3 },
            { name: "軽自動車", value: 15 + index * 2 },
          ],
    }
  })

  const inventoryTrend = [
    { month: "1月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 170 : 110 + i * 25])) },
    { month: "2月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 175 : 115 + i * 28])) },
    { month: "3月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 185 : 125 + i * 30])) },
    { month: "4月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 178 : 118 + i * 27])) },
    { month: "5月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 182 : 122 + i * 29])) },
    { month: "6月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 180 : 120 + i * 30])) },
  ]

  const inventoryDaysTrend = [
    { month: "1月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 42 : 50 + i * 12])) },
    { month: "2月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 40 : 48 + i * 11])) },
    { month: "3月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 37 : 45 + i * 10])) },
    { month: "4月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 39 : 47 + i * 11])) },
    { month: "5月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 38 : 46 + i * 10])) },
    { month: "6月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 38 : 45 + i * 10])) },
  ]

  const inventoryValueTrend = [
    { month: "1月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 680 : 420 + i * 95])) },
    { month: "2月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 695 : 435 + i * 98])) },
    { month: "3月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 730 : 460 + i * 102])) },
    { month: "4月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 710 : 445 + i * 99])) },
    { month: "5月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 725 : 455 + i * 100])) },
    { month: "6月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 720 : 450 + i * 100])) },
  ]

  const salesVolumeTrend = [
    { month: "1月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 28 : 18 + i * 5])) },
    { month: "2月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 32 : 22 + i * 6])) },
    { month: "3月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 38 : 28 + i * 7])) },
    { month: "4月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 34 : 24 + i * 6])) },
    { month: "5月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 36 : 26 + i * 6])) },
    { month: "6月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 35 : 25 + i * 6])) },
  ]

  const revenueTrend = [
    { month: "1月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 4200 : 2100 + i * 800])) },
    { month: "2月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 4800 : 2500 + i * 900])) },
    { month: "3月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5700 : 3200 + i * 1000])) },
    { month: "4月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5100 : 2800 + i * 900])) },
    { month: "5月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5400 : 3000 + i * 950])) },
    { month: "6月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5250 : 2900 + i * 920])) },
  ]

  const inventoryTrendYearly = [
    { year: "2020年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 145 : 95 + i * 20])) },
    { year: "2021年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 158 : 105 + i * 22])) },
    { year: "2022年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 165 : 110 + i * 25])) },
    { year: "2023年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 173 : 115 + i * 27])) },
    { year: "2024年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 180 : 120 + i * 30])) },
  ]

  const inventoryDaysTrendYearly = [
    { year: "2020年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 48 : 55 + i * 13])) },
    { year: "2021年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 45 : 52 + i * 12])) },
    { year: "2022年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 42 : 48 + i * 11])) },
    { year: "2023年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 40 : 47 + i * 10])) },
    { year: "2024年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 38 : 45 + i * 10])) },
  ]

  const inventoryValueTrendYearly = [
    { year: "2020年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 580 : 380 + i * 85])) },
    { year: "2021年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 632 : 410 + i * 90])) },
    { year: "2022年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 665 : 430 + i * 95])) },
    { year: "2023年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 695 : 445 + i * 98])) },
    { year: "2024年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 720 : 450 + i * 100])) },
  ]

  const salesVolumeTrendYearly = [
    { year: "2020年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 360 : 240 + i * 60])) },
    { year: "2021年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 380 : 260 + i * 65])) },
    { year: "2022年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 395 : 275 + i * 68])) },
    { year: "2023年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 410 : 290 + i * 70])) },
    { year: "2024年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 420 : 300 + i * 72])) },
  ]

  const revenueTrendYearly = [
    { year: "2020年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 54000 : 28000 + i * 9000])) },
    { year: "2021年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 57000 : 30000 + i * 9500])) },
    { year: "2022年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 59300 : 32000 + i * 10000])) },
    { year: "2023年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 61500 : 33500 + i * 10500])) },
    { year: "2024年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 63000 : 35000 + i * 11000])) },
  ]

  const turnoverComparisonData = [
    {
      category: "新規入庫",
      ...Object.fromEntries(
        selectedCompetitors.map((id, index) => {
          const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
          const isOwn = competitor?.isOwnCompany
          return [id, isOwn ? 45 : 35 + index * 8]
        })
      ),
    },
    {
      category: "売却済み",
      ...Object.fromEntries(
        selectedCompetitors.map((id, index) => {
          const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
          const isOwn = competitor?.isOwnCompany
          return [id, isOwn ? 43 : 32 + index * 7]
        })
      ),
    },
    {
      category: "純増",
      ...Object.fromEntries(
        selectedCompetitors.map((id, index) => {
          const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
          const isOwn = competitor?.isOwnCompany
          return [id, isOwn ? 2 : 3 + index * 1]
        })
      ),
    },
  ]

  const turnoverTrend6Months = [
    { month: "7月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 42 : 32 + i * 7), sold: (id === "own-company" ? 40 : 30 + i * 6), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "8月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 45 : 35 + i * 8), sold: (id === "own-company" ? 43 : 33 + i * 7), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "9月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 48 : 38 + i * 8), sold: (id === "own-company" ? 46 : 36 + i * 7), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "10月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 44 : 34 + i * 7), sold: (id === "own-company" ? 42 : 32 + i * 6), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "11月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 46 : 36 + i * 8), sold: (id === "own-company" ? 44 : 34 + i * 7), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "12月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 45 : 35 + i * 8), sold: (id === "own-company" ? 43 : 32 + i * 7), net: (id === "own-company" ? 2 : 3 + i * 1) }])) },
  ]

  const turnoverTrend1Year = [
    { month: "1月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 40 : 30 + i * 7), sold: (id === "own-company" ? 38 : 28 + i * 6), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "2月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 42 : 32 + i * 7), sold: (id === "own-company" ? 40 : 30 + i * 7), net: (id === "own-company" ? 2 : 2 + i * 0) }])) },
    { month: "3月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 50 : 40 + i * 9), sold: (id === "own-company" ? 48 : 38 + i * 8), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "4月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 43 : 33 + i * 7), sold: (id === "own-company" ? 41 : 31 + i * 6), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "5月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 44 : 34 + i * 8), sold: (id === "own-company" ? 42 : 32 + i * 7), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "6月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 45 : 35 + i * 8), sold: (id === "own-company" ? 43 : 33 + i * 7), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "7月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 42 : 32 + i * 7), sold: (id === "own-company" ? 40 : 30 + i * 6), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "8月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 45 : 35 + i * 8), sold: (id === "own-company" ? 43 : 33 + i * 7), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "9月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 48 : 38 + i * 8), sold: (id === "own-company" ? 46 : 36 + i * 7), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "10月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 44 : 34 + i * 7), sold: (id === "own-company" ? 42 : 32 + i * 6), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "11月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 46 : 36 + i * 8), sold: (id === "own-company" ? 44 : 34 + i * 7), net: (id === "own-company" ? 2 : 2 + i * 1) }])) },
    { month: "12月", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 45 : 35 + i * 8), sold: (id === "own-company" ? 43 : 32 + i * 7), net: (id === "own-company" ? 2 : 3 + i * 1) }])) },
  ]

  const turnoverTrend5Years = [
    { year: "2020年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 480 : 360 + i * 90), sold: (id === "own-company" ? 470 : 350 + i * 85), net: (id === "own-company" ? 10 : 10 + i * 5) }])) },
    { year: "2021年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 500 : 380 + i * 95), sold: (id === "own-company" ? 490 : 370 + i * 90), net: (id === "own-company" ? 10 : 10 + i * 5) }])) },
    { year: "2022年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 520 : 400 + i * 98), sold: (id === "own-company" ? 510 : 390 + i * 93), net: (id === "own-company" ? 10 : 10 + i * 5) }])) },
    { year: "2023年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 530 : 410 + i * 100), sold: (id === "own-company" ? 520 : 400 + i * 95), net: (id === "own-company" ? 10 : 10 + i * 5) }])) },
    { year: "2024年", ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, { newArrivals: (id === "own-company" ? 540 : 420 + i * 102), sold: (id === "own-company" ? 530 : 410 + i * 97), net: (id === "own-company" ? 10 : 10 + i * 5) }])) },
  ]

  const getTurnoverData = () => {
    switch (turnoverPeriod) {
      case "6months":
        return turnoverTrend6Months
      case "1year":
        return turnoverTrend1Year
      case "5years":
        return turnoverTrend5Years
    }
  }

  const turnoverData = getTurnoverData()

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {selectedCompetitors.map((competitorId, index) => {
          const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === competitorId)
          const isVisible = visibleCompetitors.includes(competitorId)
          const color = COMPETITOR_COLORS[index % COMPETITOR_COLORS.length]
          
          return (
            <button
              key={`legend-${competitorId}`}
              onClick={() => toggleCompetitorVisibility(competitorId)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div
                className="h-3 w-3 rounded border-2 transition-all"
                style={{
                  backgroundColor: isVisible ? color : "transparent",
                  borderColor: color,
                }}
              />
              <span
                className="text-sm"
                style={{
                  opacity: isVisible ? 1 : 0.5,
                  textDecoration: isVisible ? "none" : "line-through",
                }}
              >
                {competitor?.name}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 競合店選択セクション */}
      <Card className="p-6 border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">競合店選択</h2>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">直近1ヶ月</SelectItem>
              <SelectItem value="3months">直近3ヶ月</SelectItem>
              <SelectItem value="6months">直近6ヶ月</SelectItem>
              <SelectItem value="1year">直近1年</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {selectedCompetitors.map((id, index) => {
              const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
              const isOwn = competitor?.isOwnCompany
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="px-4 py-2 text-sm gap-2"
                  style={{ backgroundColor: COMPETITOR_COLORS[index % COMPETITOR_COLORS.length] + "33" }}
                >
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCompetitorVisibility(id)}
                      className="hover:scale-110 transition-transform"
                      title={visibleCompetitors.includes(id) ? "非表示にする" : "表示する"}
                    >
                      <div
                        className="h-4 w-4 rounded border-2 cursor-pointer transition-all"
                        style={{
                          backgroundColor: visibleCompetitors.includes(id)
                            ? COMPETITOR_COLORS[index % COMPETITOR_COLORS.length]
                            : "transparent",
                          borderColor: COMPETITOR_COLORS[index % COMPETITOR_COLORS.length],
                        }}
                      />
                    </button>
                    <span className="font-medium">{competitor?.name}</span>
                    {!isOwn && <span className="text-muted-foreground text-xs">({competitor?.distance})</span>}
                  </div>
                  {!isOwn && (
                    <button
                      onClick={() => handleRemoveCompetitor(id)}
                      className="hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              )
            })}
          </div>

          {selectedCompetitors.length < 6 && (
            <Select onValueChange={handleAddCompetitor}>
              <SelectTrigger className="w-full max-w-[300px]">
                <Plus className="h-4 w-4 mr-2" />
                <SelectValue placeholder="競合店を追加（最大5店舗 + 自社）" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_COMPETITORS.filter((c) => !selectedCompetitors.includes(c.id) && !c.isOwnCompany).map(
                  (competitor) => (
                    <SelectItem key={competitor.id} value={competitor.id}>
                      {competitor.name} - {competitor.region} ({competitor.distance})
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </Card>

      {/* タブで現状と推移を切り替え */}
      <Tabs defaultValue="snapshot" className="space-y-6">
        <TabsList className="grid w-full max-w-[600px] grid-cols-3 h-12 bg-muted/50 p-1">
          <TabsTrigger value="snapshot" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
            現状比較
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
            時系列推移
          </TabsTrigger>
          <TabsTrigger value="turnover" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium">
            入れ替わり分析
          </TabsTrigger>
        </TabsList>

        {/* 現状比較タブ */}
        <TabsContent value="snapshot" className="space-y-6">
          {/* 主要指標カード */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentSnapshot.map((comp, index) => (
              <Card key={comp.id} className="p-5 border-border bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COMPETITOR_COLORS[index % COMPETITOR_COLORS.length] }}
                      />
                      <h3 className="font-semibold text-sm">{comp.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">在庫台数</p>
                    <p className="text-2xl font-bold">{comp.inventoryCount}台</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">在庫総額</p>
                    <p className="text-xl font-semibold">{(comp.inventoryValue / 100000000).toFixed(1)}億円</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">平均価格</p>
                      <p className="text-sm font-medium">{(comp.avgPrice / 10000).toFixed(0)}万円</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">平均在庫日数</p>
                      <p className="text-sm font-medium">{comp.avgInventoryDays}日</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">回転率</p>
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium">{comp.turnoverRate.toFixed(1)}回/年</p>
                      {comp.turnoverRate > 8 ? (
                        <TrendingUp className="h-3 w-3 text-chart-2" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 年式分布 */}
          <Card className="p-6 border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">年式分布（構成比率）</h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={yearDistributionStacked}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis
                  type="number"
                  stroke="oklch(var(--muted-foreground))"
                  domain={[0, 100]}
                  tickFormatter={(value) => `${Math.round(value)}%`}
                />
                <YAxis dataKey="name" type="category" width={150} stroke="oklch(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: number) => `${Math.round(value)}%`}
                />
                <Legend />
                <Bar dataKey={`${currentYear}年`} stackId="a" fill={YEAR_COLORS[0]} />
                <Bar dataKey={`${currentYear - 1}年`} stackId="a" fill={YEAR_COLORS[1]} />
                <Bar dataKey={`${currentYear - 2}年`} stackId="a" fill={YEAR_COLORS[2]} />
                <Bar dataKey={`${currentYear - 3}年`} stackId="a" fill={YEAR_COLORS[3]} />
                <Bar dataKey={`${currentYear - 4}年`} stackId="a" fill={YEAR_COLORS[4]} />
                <Bar dataKey={`${currentYear - 5}年`} stackId="a" fill={YEAR_COLORS[5]} />
                <Bar dataKey={`${currentYear - 6}年`} stackId="a" fill={YEAR_COLORS[6]} />
                <Bar dataKey={`${currentYear - 7}年`} stackId="a" fill={YEAR_COLORS[7]} />
                <Bar dataKey="それ以前" stackId="a" fill={YEAR_COLORS[8]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* メーカー比率 */}
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">メーカー比率</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {manufacturerData.map((comp, index) => (
                <div key={comp.name}>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COMPETITOR_COLORS[index % COMPETITOR_COLORS.length] }}
                    />
                    {comp.name}
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={comp.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {comp.data.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COMPETITOR_COLORS[idx % COMPETITOR_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </Card>

          {/* 車両タイプ比率 */}
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">車両タイプ比率</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vehicleTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey="type" stroke="oklch(var(--muted-foreground))" />
                <YAxis stroke="oklch(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend content={<CustomLegend />} />
                {selectedCompetitors
                  .filter((id) => visibleCompetitors.includes(id))
                  .map((id) => {
                    const originalIndex = selectedCompetitors.indexOf(id)
                    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                    return (
                      <Bar
                        key={id}
                        dataKey={id}
                        name={competitor?.name || ""}
                        fill={COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length]}
                      />
                    )
                  })}
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* 価格帯分布 */}
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">価格帯分布</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priceDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey="range" stroke="oklch(var(--muted-foreground))" />
                <YAxis stroke="oklch(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend content={<CustomLegend />} />
                {selectedCompetitors
                  .filter((id) => visibleCompetitors.includes(id))
                  .map((id) => {
                    const originalIndex = selectedCompetitors.indexOf(id)
                    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                    return (
                      <Bar
                        key={id}
                        dataKey={id}
                        name={competitor?.name || ""}
                        fill={COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length]}
                      />
                    )
                  })}
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* 国産・輸入車比率 */}
          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">国産・輸入車・軽自動車比率</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {originData.map((comp, index) => (
                <div key={comp.name}>
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COMPETITOR_COLORS[index % COMPETITOR_COLORS.length] }}
                    />
                    {comp.name}
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={comp.data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {comp.data.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={COMPETITOR_COLORS[idx % COMPETITOR_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* 時系列推移タブ */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="p-4 border-border bg-card">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">表示期間:</span>
              <div className="flex gap-2">
                <Button
                  variant={trendPeriodType === "monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTrendPeriodType("monthly")}
                >
                  月次
                </Button>
                <Button
                  variant={trendPeriodType === "yearly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTrendPeriodType("yearly")}
                >
                  年次（過去5年）
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">在庫台数推移</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendPeriodType === "monthly" ? inventoryTrend : inventoryTrendYearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey={trendPeriodType === "monthly" ? "month" : "year"} stroke="oklch(var(--muted-foreground))" />
                <YAxis stroke="oklch(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend content={<CustomLegend />} />
                {selectedCompetitors
                  .filter((id) => visibleCompetitors.includes(id))
                  .map((id) => {
                    const originalIndex = selectedCompetitors.indexOf(id)
                    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={id}
                        name={competitor?.name || ""}
                        stroke={COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )
                  })}
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">店舗</TableHead>
                    {(trendPeriodType === "monthly" ? inventoryTrend : inventoryTrendYearly).map((row) => (
                      <TableHead key={trendPeriodType === "monthly" ? row.month : row.year} className="text-center">
                        {trendPeriodType === "monthly" ? row.month : row.year}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCompetitors
                    .filter((id) => visibleCompetitors.includes(id))
                    .map((id) => {
                      const originalIndex = selectedCompetitors.indexOf(id)
                      const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                      return (
                        <TableRow key={id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length] }}
                              />
                              <span className="whitespace-nowrap">{competitor?.name}</span>
                            </div>
                          </TableCell>
                          {(trendPeriodType === "monthly" ? inventoryTrend : inventoryTrendYearly).map((row) => (
                            <TableCell
                              key={trendPeriodType === "monthly" ? row.month : row.year}
                              className="text-center"
                            >
                              {row[id]}台
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">平均在庫日数推移</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendPeriodType === "monthly" ? inventoryDaysTrend : inventoryDaysTrendYearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey={trendPeriodType === "monthly" ? "month" : "year"} stroke="oklch(var(--muted-foreground))" />
                <YAxis stroke="oklch(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend content={<CustomLegend />} />
                {selectedCompetitors
                  .filter((id) => visibleCompetitors.includes(id))
                  .map((id) => {
                    const originalIndex = selectedCompetitors.indexOf(id)
                    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={id}
                        name={competitor?.name || ""}
                        stroke={COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )
                  })}
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">店舗</TableHead>
                    {(trendPeriodType === "monthly" ? inventoryDaysTrend : inventoryDaysTrendYearly).map((row) => (
                      <TableHead key={trendPeriodType === "monthly" ? row.month : row.year} className="text-center">
                        {trendPeriodType === "monthly" ? row.month : row.year}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCompetitors
                    .filter((id) => visibleCompetitors.includes(id))
                    .map((id) => {
                      const originalIndex = selectedCompetitors.indexOf(id)
                      const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                      return (
                        <TableRow key={id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length] }}
                              />
                              <span className="whitespace-nowrap">{competitor?.name}</span>
                            </div>
                          </TableCell>
                          {(trendPeriodType === "monthly" ? inventoryDaysTrend : inventoryDaysTrendYearly).map((row) => (
                            <TableCell
                              key={trendPeriodType === "monthly" ? row.month : row.year}
                              className="text-center"
                            >
                              {row[id]}日
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">在庫総額推移（百万円）</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendPeriodType === "monthly" ? inventoryValueTrend : inventoryValueTrendYearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey={trendPeriodType === "monthly" ? "month" : "year"} stroke="oklch(var(--muted-foreground))" />
                <YAxis stroke="oklch(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend content={<CustomLegend />} />
                {selectedCompetitors
                  .filter((id) => visibleCompetitors.includes(id))
                  .map((id) => {
                    const originalIndex = selectedCompetitors.indexOf(id)
                    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={id}
                        name={competitor?.name || ""}
                        stroke={COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )
                  })}
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">店舗</TableHead>
                    {(trendPeriodType === "monthly" ? inventoryValueTrend : inventoryValueTrendYearly).map((row) => (
                      <TableHead key={trendPeriodType === "monthly" ? row.month : row.year} className="text-center">
                        {trendPeriodType === "monthly" ? row.month : row.year}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCompetitors
                    .filter((id) => visibleCompetitors.includes(id))
                    .map((id) => {
                      const originalIndex = selectedCompetitors.indexOf(id)
                      const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                      return (
                        <TableRow key={id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length] }}
                              />
                              <span className="whitespace-nowrap">{competitor?.name}</span>
                            </div>
                          </TableCell>
                          {(trendPeriodType === "monthly" ? inventoryValueTrend : inventoryValueTrendYearly).map((row) => (
                            <TableCell
                              key={trendPeriodType === "monthly" ? row.month : row.year}
                              className="text-center"
                            >
                              {row[id]}百万円
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">販売台数推移</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendPeriodType === "monthly" ? salesVolumeTrend : salesVolumeTrendYearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey={trendPeriodType === "monthly" ? "month" : "year"} stroke="oklch(var(--muted-foreground))" />
                <YAxis stroke="oklch(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend content={<CustomLegend />} />
                {selectedCompetitors
                  .filter((id) => visibleCompetitors.includes(id))
                  .map((id) => {
                    const originalIndex = selectedCompetitors.indexOf(id)
                    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={id}
                        name={competitor?.name || ""}
                        stroke={COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )
                  })}
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">店舗</TableHead>
                    {(trendPeriodType === "monthly" ? salesVolumeTrend : salesVolumeTrendYearly).map((row) => (
                      <TableHead key={trendPeriodType === "monthly" ? row.month : row.year} className="text-center">
                        {trendPeriodType === "monthly" ? row.month : row.year}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCompetitors
                    .filter((id) => visibleCompetitors.includes(id))
                    .map((id) => {
                      const originalIndex = selectedCompetitors.indexOf(id)
                      const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                      return (
                        <TableRow key={id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length] }}
                              />
                              <span className="whitespace-nowrap">{competitor?.name}</span>
                            </div>
                          </TableCell>
                          {(trendPeriodType === "monthly" ? salesVolumeTrend : salesVolumeTrendYearly).map((row) => (
                            <TableCell
                              key={trendPeriodType === "monthly" ? row.month : row.year}
                              className="text-center"
                            >
                              {row[id]}台
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">売上推移（万円）</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendPeriodType === "monthly" ? revenueTrend : revenueTrendYearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis dataKey={trendPeriodType === "monthly" ? "month" : "year"} stroke="oklch(var(--muted-foreground))" />
                <YAxis stroke="oklch(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend content={<CustomLegend />} />
                {selectedCompetitors
                  .filter((id) => visibleCompetitors.includes(id))
                  .map((id) => {
                    const originalIndex = selectedCompetitors.indexOf(id)
                    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={id}
                        name={competitor?.name || ""}
                        stroke={COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )
                  })}
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">店舗</TableHead>
                    {(trendPeriodType === "monthly" ? revenueTrend : revenueTrendYearly).map((row) => (
                      <TableHead key={trendPeriodType === "monthly" ? row.month : row.year} className="text-center">
                        {trendPeriodType === "monthly" ? row.month : row.year}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCompetitors
                    .filter((id) => visibleCompetitors.includes(id))
                    .map((id) => {
                      const originalIndex = selectedCompetitors.indexOf(id)
                      const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                      return (
                        <TableRow key={id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length] }}
                              />
                              <span className="whitespace-nowrap">{competitor?.name}</span>
                            </div>
                          </TableCell>
                          {(trendPeriodType === "monthly" ? revenueTrend : revenueTrendYearly).map((row) => (
                            <TableCell
                              key={trendPeriodType === "monthly" ? row.month : row.year}
                              className="text-center"
                            >
                              {row[id]}万円
                            </TableCell>
                          ))}
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* 入れ替わり分析タブ */}
        <TabsContent value="turnover" className="space-y-6">
          <Card className="p-4 border-border bg-card">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">表示期間:</span>
              <div className="flex gap-2">
                <Button
                  variant={turnoverPeriod === "6months" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTurnoverPeriod("6months")}
                >
                  6ヶ月
                </Button>
                <Button
                  variant={turnoverPeriod === "1year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTurnoverPeriod("1year")}
                >
                  1年
                </Button>
                <Button
                  variant={turnoverPeriod === "5years" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTurnoverPeriod("5years")}
                >
                  5年
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">新規入庫推移</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis
                  dataKey={turnoverPeriod === "5years" ? "year" : "month"}
                  stroke="oklch(var(--muted-foreground))"
                />
                <YAxis stroke="oklch(var(--muted-foreground))" label={{ value: '台数', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: any) => {
                    if (typeof value === 'object' && value !== null) {
                      return `${value.newArrivals}台`
                    }
                    return `${value}台`
                  }}
                />
                <Legend content={<CustomLegend />} />
                {selectedCompetitors
                  .filter((id) => visibleCompetitors.includes(id))
                  .map((id) => {
                    const originalIndex = selectedCompetitors.indexOf(id)
                    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={(data: any) => data[id]?.newArrivals}
                        name={competitor?.name || ""}
                        stroke={COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )
                  })}
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">売却済み推移</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis
                  dataKey={turnoverPeriod === "5years" ? "year" : "month"}
                  stroke="oklch(var(--muted-foreground))"
                />
                <YAxis stroke="oklch(var(--muted-foreground))" label={{ value: '台数', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: any) => {
                    if (typeof value === 'object' && value !== null) {
                      return `${value.sold}台`
                    }
                    return `${value}台`
                  }}
                />
                <Legend content={<CustomLegend />} />
                {selectedCompetitors
                  .filter((id) => visibleCompetitors.includes(id))
                  .map((id) => {
                    const originalIndex = selectedCompetitors.indexOf(id)
                    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={(data: any) => data[id]?.sold}
                        name={competitor?.name || ""}
                        stroke={COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )
                  })}
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h3 className="text-lg font-semibold mb-4">純増推移</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={turnoverData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis
                  dataKey={turnoverPeriod === "5years" ? "year" : "month"}
                  stroke="oklch(var(--muted-foreground))"
                />
                <YAxis stroke="oklch(var(--muted-foreground))" label={{ value: '台数', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(var(--popover))",
                    border: "1px solid oklch(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  formatter={(value: any) => {
                    if (typeof value === 'object' && value !== null) {
                      return `${value.net}台`
                    }
                    return `${value}台`
                  }}
                />
                <Legend content={<CustomLegend />} />
                {selectedCompetitors
                  .filter((id) => visibleCompetitors.includes(id))
                  .map((id) => {
                    const originalIndex = selectedCompetitors.indexOf(id)
                    const competitor = AVAILABLE_COMPETITORS.find((c) => c.id === id)
                    return (
                      <Line
                        key={id}
                        type="monotone"
                        dataKey={(data: any) => data[id]?.net}
                        name={competitor?.name || ""}
                        stroke={COMPETITOR_COLORS[originalIndex % COMPETITOR_COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    )
                  })}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
