"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Globe,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  X,
  Ship,
  BarChart3,
  Filter,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts"

// ── Deterministic seeded random ──
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ── Types ──
interface ExportVehicle {
  id: number
  date: string
  maker: string
  model: string
  year: number
  modelCode: string
  mileage: number
  color: string
  shift: string
  drive: string
  steering: string
  purchasePrice: number
  destination: string
}

// ── Generate sample data ──
const generateExportData = (): ExportVehicle[] => {
  const rand = seededRandom(123)

  const makers = [
    { name: "トヨタ", models: ["ランドクルーザー", "ハイエース", "ハイラックス", "プラド", "カムリ", "RAV4", "アルファード", "ヴェルファイア"] },
    { name: "日産", models: ["パトロール", "キャラバン", "エクストレイル", "ナバラ", "サファリ"] },
    { name: "ホンダ", models: ["フィット", "CR-V", "シビック", "ヴェゼル"] },
    { name: "三菱", models: ["パジェロ", "アウトランダー", "L200", "デリカD:5"] },
    { name: "スズキ", models: ["ジムニー", "スイフト", "エブリイ", "キャリイ"] },
    { name: "いすゞ", models: ["エルフ", "フォワード", "ギガ"] },
    { name: "マツダ", models: ["CX-5", "BT-50", "デミオ"] },
    { name: "スバル", models: ["フォレスター", "アウトバック", "インプレッサ"] },
  ]

  const colors = ["ホワイト", "ブラック", "シルバー", "パールホワイト", "グレー", "ブルー", "レッド", "ベージュ", "グリーン", "ダークブルー"]
  const shifts = ["AT", "MT", "CVT"]
  const drives = ["2WD", "4WD", "AWD"]
  const steerings = ["右", "左"]
  const destinations = [
    "ケニア", "タンザニア", "ウガンダ", "ナイジェリア", "コンゴ", "モザンビーク",
    "ザンビア", "ジンバブエ", "南アフリカ", "ガーナ",
    "UAE", "スリランカ", "パキスタン", "バングラデシュ", "モンゴル",
    "ロシア", "ジョージア", "キルギス",
    "ニュージーランド", "フィジー", "サモア",
    "ジャマイカ", "トリニダード・トバゴ", "ガイアナ",
  ]

  const data: ExportVehicle[] = []
  for (let i = 0; i < 200; i++) {
    const makerObj = makers[Math.floor(rand() * makers.length)]
    const model = makerObj.models[Math.floor(rand() * makerObj.models.length)]
    const year = 2010 + Math.floor(rand() * 15)
    const month = 1 + Math.floor(rand() * 12)
    const day = 1 + Math.floor(rand() * 28)

    data.push({
      id: i + 1,
      date: `2025/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`,
      maker: makerObj.name,
      model,
      year,
      modelCode: `${model.slice(0, 2).toUpperCase()}${year % 100}${Math.floor(rand() * 90 + 10)}`,
      mileage: Math.floor(rand() * 250000) + 5000,
      color: colors[Math.floor(rand() * colors.length)],
      shift: shifts[Math.floor(rand() * shifts.length)],
      drive: drives[Math.floor(rand() * drives.length)],
      steering: steerings[Math.floor(rand() * steerings.length)],
      purchasePrice: Math.floor(rand() * 4500000) + 150000,
      destination: destinations[Math.floor(rand() * destinations.length)],
    })
  }
  return data
}

const allExportData = generateExportData()

// ── Aggregation helpers ──
function aggregateByField<T extends Record<string, unknown>>(
  data: T[],
  field: keyof T,
): { label: string; count: number; percentage: number }[] {
  const counts: Record<string, number> = {}
  for (const item of data) {
    const key = String(item[field])
    counts[key] = (counts[key] || 0) + 1
  }
  const total = data.length
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count, percentage: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count)
}

// ── Component ──
export function ExportVehicleAnalysis() {
  // Filters
  const [filterMaker, setFilterMaker] = useState("all")
  const [filterModel, setFilterModel] = useState("")
  const [filterDestination, setFilterDestination] = useState("all")
  const [filterYearFrom, setFilterYearFrom] = useState("")
  const [filterYearTo, setFilterYearTo] = useState("")
  const [filterDrive, setFilterDrive] = useState("all")
  const [filterShift, setFilterShift] = useState("all")
  const [filterSteering, setFilterSteering] = useState("all")
  const [filterColor, setFilterColor] = useState("all")
  const [filterMileageMax, setFilterMileageMax] = useState("")
  const [filterPriceMax, setFilterPriceMax] = useState("")
  const [showFilters, setShowFilters] = useState(true)
  const [sortField, setSortField] = useState<string>("count")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [view, setView] = useState<"summary" | "list">("summary")
  const [expandedModel, setExpandedModel] = useState<string | null>(null)

  // Unique values for filter dropdowns
  const uniqueMakers = useMemo(() => [...new Set(allExportData.map((d) => d.maker))].sort(), [])
  const uniqueDestinations = useMemo(() => [...new Set(allExportData.map((d) => d.destination))].sort(), [])
  const uniqueColors = useMemo(() => [...new Set(allExportData.map((d) => d.color))].sort(), [])

  // Filtered data
  const filtered = useMemo(() => {
    return allExportData.filter((v) => {
      if (filterMaker !== "all" && v.maker !== filterMaker) return false
      if (filterModel && !v.model.includes(filterModel)) return false
      if (filterDestination !== "all" && v.destination !== filterDestination) return false
      if (filterYearFrom && v.year < Number(filterYearFrom)) return false
      if (filterYearTo && v.year > Number(filterYearTo)) return false
      if (filterDrive !== "all" && v.drive !== filterDrive) return false
      if (filterShift !== "all" && v.shift !== filterShift) return false
      if (filterSteering !== "all" && v.steering !== filterSteering) return false
      if (filterColor !== "all" && v.color !== filterColor) return false
      if (filterMileageMax && v.mileage > Number(filterMileageMax)) return false
      if (filterPriceMax && v.purchasePrice > Number(filterPriceMax)) return false
      return true
    })
  }, [filterMaker, filterModel, filterDestination, filterYearFrom, filterYearTo, filterDrive, filterShift, filterSteering, filterColor, filterMileageMax, filterPriceMax])

  // Aggregations
  const byMaker = useMemo(() => aggregateByField(filtered, "maker"), [filtered])
  const byModel = useMemo(() => {
    const counts: Record<string, { count: number; maker: string; avgPrice: number; totalPrice: number }> = {}
    for (const v of filtered) {
      const key = `${v.maker} ${v.model}`
      if (!counts[key]) counts[key] = { count: 0, maker: v.maker, avgPrice: 0, totalPrice: 0 }
      counts[key].count++
      counts[key].totalPrice += v.purchasePrice
    }
    return Object.entries(counts)
      .map(([label, d]) => ({ label, count: d.count, maker: d.maker, avgPrice: Math.round(d.totalPrice / d.count), percentage: (d.count / filtered.length) * 100 }))
      .sort((a, b) => b.count - a.count)
  }, [filtered])

  const byDestination = useMemo(() => aggregateByField(filtered, "destination"), [filtered])
  const byDrive = useMemo(() => aggregateByField(filtered, "drive"), [filtered])
  const byShift = useMemo(() => aggregateByField(filtered, "shift"), [filtered])
  const bySteering = useMemo(() => aggregateByField(filtered, "steering"), [filtered])
  const byColor = useMemo(() => aggregateByField(filtered, "color"), [filtered])

  const avgPrice = useMemo(() => {
    if (filtered.length === 0) return 0
    return Math.round(filtered.reduce((s, v) => s + v.purchasePrice, 0) / filtered.length)
  }, [filtered])

  const avgMileage = useMemo(() => {
    if (filtered.length === 0) return 0
    return Math.round(filtered.reduce((s, v) => s + v.mileage, 0) / filtered.length)
  }, [filtered])

  const topModelsChart = byModel.slice(0, 10)

  const destinationPieData = byDestination.slice(0, 8).map((d, i) => ({
    name: d.label,
    value: d.count,
  }))

  const PIE_COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(217, 91%, 60%)",
    "hsl(45, 93%, 47%)",
    "hsl(340, 75%, 55%)",
  ]

  const clearFilters = () => {
    setFilterMaker("all")
    setFilterModel("")
    setFilterDestination("all")
    setFilterYearFrom("")
    setFilterYearTo("")
    setFilterDrive("all")
    setFilterShift("all")
    setFilterSteering("all")
    setFilterColor("all")
    setFilterMileageMax("")
    setFilterPriceMax("")
  }

  const hasFilters = filterMaker !== "all" || filterModel !== "" || filterDestination !== "all" ||
    filterYearFrom !== "" || filterYearTo !== "" || filterDrive !== "all" || filterShift !== "all" ||
    filterSteering !== "all" || filterColor !== "all" || filterMileageMax !== "" || filterPriceMax !== ""

  // Sorted list data
  const sortedList = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a, b) => {
      let valA: number | string = 0
      let valB: number | string = 0
      switch (sortField) {
        case "date": valA = a.date; valB = b.date; break
        case "maker": valA = a.maker; valB = b.maker; break
        case "model": valA = a.model; valB = b.model; break
        case "year": valA = a.year; valB = b.year; break
        case "mileage": valA = a.mileage; valB = b.mileage; break
        case "price": valA = a.purchasePrice; valB = b.purchasePrice; break
        case "destination": valA = a.destination; valB = b.destination; break
        default: return 0
      }
      if (typeof valA === "string" && typeof valB === "string") {
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA)
      }
      return sortDir === "asc" ? (valA as number) - (valB as number) : (valB as number) - (valA as number)
    })
    return copy
  }, [filtered, sortField, sortDir])

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 inline ml-0.5" /> : <ChevronDown className="h-3 w-3 inline ml-0.5" />
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>対象件数</CardDescription>
            <CardTitle className="text-3xl">{filtered.length}<span className="text-base font-normal text-muted-foreground ml-1">件</span></CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>平均仕入価格</CardDescription>
            <CardTitle className="text-3xl text-primary">{(avgPrice / 10000).toFixed(0)}<span className="text-base font-normal text-muted-foreground ml-1">万円</span></CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>平均走行距離</CardDescription>
            <CardTitle className="text-3xl">{(avgMileage / 10000).toFixed(1)}<span className="text-base font-normal text-muted-foreground ml-1">万km</span></CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>仕向け国数</CardDescription>
            <CardTitle className="text-3xl">{byDestination.length}<span className="text-base font-normal text-muted-foreground ml-1">カ国</span></CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === "summary" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("summary")}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          サマリー分析
        </Button>
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("list")}
        >
          <Ship className="mr-2 h-4 w-4" />
          明細一覧
        </Button>
      </div>

      {view === "summary" ? (
        <>
          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Models Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-chart-1" />
                  輸出台数 車種ランキング TOP10
                </CardTitle>
                <CardDescription>車種別の輸出取引台数</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topModelsChart} layout="vertical" margin={{ left: 0, right: 20 }}>
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={120} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value: number) => [`${value}台`, "台数"]}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {topModelsChart.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index < 3 ? "hsl(var(--chart-1))" : "hsl(var(--muted-foreground)/0.3)"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Destination Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-chart-2" />
                  仕向け国分布 TOP8
                </CardTitle>
                <CardDescription>輸出先の国別構成比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px] flex items-center">
                  <ResponsiveContainer width="50%" height="100%">
                    <PieChart>
                      <Pie
                        data={destinationPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={100}
                        dataKey="value"
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      >
                        {destinationPieData.map((_, i) => (
                          <Cell key={`pie-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}台`, "台数"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-1.5">
                    {destinationPieData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2 text-sm">
                        <div className="h-3 w-3 rounded-sm flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="truncate text-muted-foreground">{d.name}</span>
                        <span className="ml-auto font-medium">{d.value}台</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail Aggregation Tables */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* By Maker */}
            <Card>
              <CardHeader>
                <CardTitle>メーカー別集計</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm text-muted-foreground">
                      <th className="pb-3 text-left font-medium">メーカー</th>
                      <th className="pb-3 text-right font-medium">台数</th>
                      <th className="pb-3 text-right font-medium">構成比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byMaker.map((item) => (
                      <tr key={item.label} className="border-b border-border/50">
                        <td className="py-2.5 font-medium">{item.label}</td>
                        <td className="py-2.5 text-right font-semibold">{item.count}台</td>
                        <td className="py-2.5 text-right text-muted-foreground">{item.percentage.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* By Destination */}
            <Card>
              <CardHeader>
                <CardTitle>仕向け国別集計</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm text-muted-foreground">
                      <th className="pb-3 text-left font-medium">仕向け国</th>
                      <th className="pb-3 text-right font-medium">台数</th>
                      <th className="pb-3 text-right font-medium">構成比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byDestination.slice(0, 12).map((item) => (
                      <tr key={item.label} className="border-b border-border/50">
                        <td className="py-2.5 font-medium">{item.label}</td>
                        <td className="py-2.5 text-right font-semibold">{item.count}台</td>
                        <td className="py-2.5 text-right text-muted-foreground">{item.percentage.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* By Drive */}
            <Card>
              <CardHeader>
                <CardTitle>駆動形式別集計</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm text-muted-foreground">
                      <th className="pb-3 text-left font-medium">駆動</th>
                      <th className="pb-3 text-right font-medium">台数</th>
                      <th className="pb-3 text-right font-medium">構成比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byDrive.map((item) => (
                      <tr key={item.label} className="border-b border-border/50">
                        <td className="py-2.5 font-medium">{item.label}</td>
                        <td className="py-2.5 text-right font-semibold">{item.count}台</td>
                        <td className="py-2.5 text-right text-muted-foreground">{item.percentage.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* By Shift + Steering + Color (combined) */}
            <Card>
              <CardHeader>
                <CardTitle>スペック別集計</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">シフト種類</h4>
                  <div className="flex gap-4">
                    {byShift.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <Badge variant="outline">{item.label}</Badge>
                        <span className="text-sm font-semibold">{item.count}台</span>
                        <span className="text-xs text-muted-foreground">({item.percentage.toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">ハンドル位置</h4>
                  <div className="flex gap-4">
                    {bySteering.map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <Badge variant="outline">{item.label}ハンドル</Badge>
                        <span className="text-sm font-semibold">{item.count}台</span>
                        <span className="text-xs text-muted-foreground">({item.percentage.toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">カラー</h4>
                  <div className="flex flex-wrap gap-2">
                    {byColor.slice(0, 8).map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1">
                        <span className="text-xs font-medium">{item.label}</span>
                        <span className="text-xs text-muted-foreground">{item.count}台</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Procurement Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                仕入れ推奨 輸出向け車両ランキング
              </CardTitle>
              <CardDescription>車種をクリックすると輸出明細が表示されます</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-sm text-muted-foreground">
                      <th className="pb-3 text-left font-medium">順位</th>
                      <th className="pb-3 text-left font-medium">車種</th>
                      <th className="pb-3 text-right font-medium">輸出台数</th>
                      <th className="pb-3 text-right font-medium">構成比</th>
                      <th className="pb-3 text-right font-medium">平均仕入価格</th>
                      <th className="pb-3 text-left font-medium">主要仕向け国</th>
                      <th className="pb-3 text-right font-medium">推奨度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byModel.slice(0, 15).map((item, idx) => {
                      // Find top destination for this model
                      const modelVehicles = filtered.filter((v) => `${v.maker} ${v.model}` === item.label)
                      const destCounts: Record<string, number> = {}
                      modelVehicles.forEach((v) => { destCounts[v.destination] = (destCounts[v.destination] || 0) + 1 })
                      const topDest = Object.entries(destCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k)

                      const score = Math.max(40, Math.min(99, Math.round(50 + item.count * 3 + (item.avgPrice < 2000000 ? 10 : 0))))
                      const isExpanded = expandedModel === item.label

                      return (
                        <React.Fragment key={item.label}>
                          <tr
                            className={cn(
                              "border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors",
                              isExpanded && "bg-primary/5 border-primary/20",
                            )}
                            onClick={() => setExpandedModel(isExpanded ? null : item.label)}
                          >
                            <td className="py-3">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "w-10 justify-center font-bold",
                                  idx === 0 && "bg-yellow-500/10 border-yellow-500 text-yellow-600",
                                  idx === 1 && "bg-gray-400/10 border-gray-400 text-gray-600",
                                  idx === 2 && "bg-orange-500/10 border-orange-500 text-orange-600",
                                )}
                              >
                                {idx + 1}
                              </Badge>
                            </td>
                            <td className="py-3 font-semibold">
                              <div className="flex items-center gap-1.5">
                                {isExpanded ? <ChevronUp className="h-4 w-4 text-primary flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />}
                                {item.label}
                              </div>
                            </td>
                            <td className="py-3 text-right font-bold text-lg text-primary">{item.count}台</td>
                            <td className="py-3 text-right text-muted-foreground">{item.percentage.toFixed(1)}%</td>
                            <td className="py-3 text-right">{(item.avgPrice / 10000).toFixed(0)}万円</td>
                            <td className="py-3">
                              <div className="flex gap-1 flex-wrap">
                                {topDest.map((d) => (
                                  <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 text-right">
                              <Badge variant="default" className={cn(
                                "font-bold",
                                score >= 80 ? "bg-primary/90" : score >= 60 ? "bg-chart-2" : "bg-muted-foreground",
                              )}>
                                {score}点
                              </Badge>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan={7} className="p-0">
                                <div className="border-x-2 border-b-2 border-primary/20 bg-primary/[0.02] rounded-b-lg mx-2 mb-2">
                                  <div className="px-4 py-3 border-b border-primary/10 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Ship className="h-4 w-4 text-primary" />
                                      <span className="text-sm font-semibold">{item.label} の輸出明細</span>
                                      <Badge variant="outline" className="text-xs">{modelVehicles.length}件</Badge>
                                    </div>
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
                                        {modelVehicles
                                          .sort((a, b) => b.date.localeCompare(a.date))
                                          .map((v) => (
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
                                            <td className="px-3 py-2 text-right font-semibold tabular-nums">{(v.purchasePrice / 10000).toFixed(0)}万円</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* List View */
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>輸出車両 明細一覧</CardTitle>
                <CardDescription>ヘッダーをクリックでソート</CardDescription>
              </div>
              <Badge variant="outline">{filtered.length}件</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    {[
                      { key: "date", label: "日付" },
                      { key: "maker", label: "メーカー" },
                      { key: "model", label: "車名" },
                      { key: "year", label: "年式" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="pb-3 text-left font-medium cursor-pointer hover:text-foreground"
                        onClick={() => toggleSort(col.key)}
                      >
                        {col.label}<SortIcon field={col.key} />
                      </th>
                    ))}
                    <th className="pb-3 text-left font-medium">型式</th>
                    <th className="pb-3 text-right font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort("mileage")}>
                      走行距離<SortIcon field="mileage" />
                    </th>
                    <th className="pb-3 text-left font-medium">カラー</th>
                    <th className="pb-3 text-left font-medium">シフト</th>
                    <th className="pb-3 text-left font-medium">駆動</th>
                    <th className="pb-3 text-left font-medium">ハンドル</th>
                    <th className="pb-3 text-right font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort("price")}>
                      仕入価格<SortIcon field="price" />
                    </th>
                    <th className="pb-3 text-left font-medium cursor-pointer hover:text-foreground" onClick={() => toggleSort("destination")}>
                      仕向け国<SortIcon field="destination" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedList.slice(0, 100).map((v) => (
                    <tr key={v.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-2.5 text-muted-foreground whitespace-nowrap">{v.date}</td>
                      <td className="py-2.5">{v.maker}</td>
                      <td className="py-2.5 font-medium">{v.model}</td>
                      <td className="py-2.5">{v.year}年</td>
                      <td className="py-2.5 font-mono text-xs text-muted-foreground">{v.modelCode}</td>
                      <td className="py-2.5 text-right tabular-nums">{(v.mileage / 10000).toFixed(1)}万km</td>
                      <td className="py-2.5">{v.color}</td>
                      <td className="py-2.5"><Badge variant="outline" className="text-xs">{v.shift}</Badge></td>
                      <td className="py-2.5"><Badge variant="outline" className="text-xs">{v.drive}</Badge></td>
                      <td className="py-2.5">{v.steering}</td>
                      <td className="py-2.5 text-right font-semibold tabular-nums">{(v.purchasePrice / 10000).toFixed(0)}万円</td>
                      <td className="py-2.5">
                        <Badge variant="secondary" className="text-xs">{v.destination}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length > 100 && (
                <p className="text-center text-sm text-muted-foreground mt-4 py-2">
                  {filtered.length}件中 100件を表示中
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
