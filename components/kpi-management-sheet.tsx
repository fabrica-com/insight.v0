"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Save,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight,
  Target,
  BarChart3,
  AlertTriangle,
  Settings2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// KPI definitions
const KPI_ITEMS = [
  { key: "salesUnits", label: "販売台数", unit: "台", format: "integer" },
  { key: "wholesaleUnits", label: "業販台数", unit: "台", format: "integer" },
  { key: "revenue", label: "売上高", unit: "万円", format: "currency" },
  { key: "grossProfit", label: "粗利合計", unit: "万円", format: "currency" },
  { key: "grossMargin", label: "粗利率", unit: "%", format: "percent" },
  { key: "avgUnitPrice", label: "平均単価", unit: "万円", format: "currency" },
  { key: "avgGrossPerUnit", label: "台あたり粗利", unit: "万円", format: "currency" },
  { key: "inventoryCount", label: "在庫台数", unit: "台", format: "integer" },
  { key: "inventoryTurnover", label: "在庫回転率", unit: "回/年", format: "decimal" },
  { key: "avgDaysInStock", label: "平均在庫日数", unit: "日", format: "integer" },
  { key: "inquiries", label: "問い合わせ数", unit: "件", format: "integer" },
  { key: "cpa", label: "CPA（顧客獲得単価）", unit: "万円", format: "currency" },
  { key: "adSpend", label: "広告宣伝費", unit: "万円", format: "currency" },
] as const

type KpiKey = (typeof KPI_ITEMS)[number]["key"]

interface MonthlyKpiData {
  target: Record<KpiKey, number | null>
  actual: Record<KpiKey, number | null>
}

interface YearlyKpiData {
  [month: string]: MonthlyKpiData
}

const ALL_MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]

function getMonths(startMonth: number): string[] {
  const months: string[] = []
  for (let i = 0; i < 12; i++) {
    const m = ((startMonth - 1 + i) % 12) + 1
    months.push(`${m}月`)
  }
  return months
}

const STORAGE_KEY = "symphony-kpi-data"
const FISCAL_START_KEY = "symphony-kpi-fiscal-start"

function loadFiscalStart(): number {
  if (typeof window === "undefined") return 4
  try {
    const stored = localStorage.getItem(FISCAL_START_KEY)
    return stored ? Number(stored) : 4
  } catch {
    return 4
  }
}

function saveFiscalStart(month: number) {
  if (typeof window === "undefined") return
  localStorage.setItem(FISCAL_START_KEY, String(month))
}

function createEmptyMonth(): MonthlyKpiData {
  const empty: Record<string, number | null> = {}
  KPI_ITEMS.forEach((item) => {
    empty[item.key] = null
  })
  return {
    target: { ...empty } as Record<KpiKey, number | null>,
    actual: { ...empty } as Record<KpiKey, number | null>,
  }
}

function loadKpiData(year: number): YearlyKpiData {
  if (typeof window === "undefined") return {}
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${year}`)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveKpiData(year: number, data: YearlyKpiData) {
  if (typeof window === "undefined") return
  localStorage.setItem(`${STORAGE_KEY}-${year}`, JSON.stringify(data))
}

function formatValue(value: number | null, format: string): string {
  if (value === null || value === undefined) return "-"
  switch (format) {
    case "integer":
      return value.toLocaleString()
    case "currency":
      return value.toLocaleString()
    case "percent":
      return value.toFixed(1)
    case "decimal":
      return value.toFixed(1)
    default:
      return value.toString()
  }
}

function getAchievementRate(target: number | null, actual: number | null): number | null {
  if (target === null || target === 0 || actual === null) return null
  return (actual / target) * 100
}

function getAchievementColor(rate: number | null, key: KpiKey): string {
  if (rate === null) return "text-muted-foreground"
  // For metrics where lower is better (CPA, avg days in stock, ad spend)
  const lowerIsBetter = ["cpa", "avgDaysInStock", "adSpend"].includes(key)
  if (lowerIsBetter) {
    if (rate <= 90) return "text-emerald-600 dark:text-emerald-400"
    if (rate <= 110) return "text-amber-600 dark:text-amber-400"
    return "text-destructive"
  }
  // For normal metrics where higher is better
  if (rate >= 100) return "text-emerald-600 dark:text-emerald-400"
  if (rate >= 80) return "text-amber-600 dark:text-amber-400"
  return "text-destructive"
}

function getAchievementBg(rate: number | null, key: KpiKey): string {
  if (rate === null) return "bg-muted"
  const lowerIsBetter = ["cpa", "avgDaysInStock", "adSpend"].includes(key)
  if (lowerIsBetter) {
    if (rate <= 90) return "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
    if (rate <= 110) return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
    return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
  }
  if (rate >= 100) return "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
  if (rate >= 80) return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
  return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
}

function TrendIcon({ rate, kpiKey }: { rate: number | null; kpiKey: KpiKey }) {
  if (rate === null) return <Minus className="h-3.5 w-3.5 text-muted-foreground" />
  const lowerIsBetter = ["cpa", "avgDaysInStock", "adSpend"].includes(kpiKey)
  const isGood = lowerIsBetter ? rate <= 100 : rate >= 100
  if (isGood) return <TrendingUp className="h-3.5 w-3.5" />
  return <TrendingDown className="h-3.5 w-3.5" />
}

export function KpiManagementSheet() {
  const [fiscalStartMonth, setFiscalStartMonth] = useState(4)
  const MONTHS = getMonths(fiscalStartMonth)

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth() + 1 // 1-12
  const currentFiscalYear = currentMonth >= fiscalStartMonth
    ? currentDate.getFullYear()
    : currentDate.getFullYear() - 1
  const [fiscalYear, setFiscalYear] = useState(currentFiscalYear)
  const [kpiData, setKpiData] = useState<YearlyKpiData>({})
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[0])
  const [saveMessage, setSaveMessage] = useState("")
  const [mounted, setMounted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const start = loadFiscalStart()
    setFiscalStartMonth(start)
    setSelectedMonth(getMonths(start)[0])
    setMounted(true)
  }, [])

  useEffect(() => {
    setKpiData(loadKpiData(fiscalYear))
  }, [fiscalYear])

  const handleFiscalStartChange = (value: string) => {
    const newStart = Number(value)
    setFiscalStartMonth(newStart)
    saveFiscalStart(newStart)
    const newMonths = getMonths(newStart)
    setSelectedMonth(newMonths[0])
    // Recalculate fiscal year
    const cm = currentDate.getMonth() + 1
    const newFiscalYear = cm >= newStart ? currentDate.getFullYear() : currentDate.getFullYear() - 1
    setFiscalYear(newFiscalYear)
    setShowSettings(false)
  }

  const getMonthData = useCallback(
    (month: string): MonthlyKpiData => {
      return kpiData[month] || createEmptyMonth()
    },
    [kpiData],
  )

  const updateValue = (month: string, type: "target" | "actual", key: KpiKey, value: string) => {
    const numValue = value === "" ? null : Number(value)
    if (value !== "" && isNaN(numValue as number)) return

    setKpiData((prev) => {
      const monthData = prev[month] || createEmptyMonth()
      return {
        ...prev,
        [month]: {
          ...monthData,
          [type]: {
            ...monthData[type],
            [key]: numValue,
          },
        },
      }
    })
  }

  const handleSave = () => {
    saveKpiData(fiscalYear, kpiData)
    setSaveMessage("保存しました")
    setTimeout(() => setSaveMessage(""), 2000)
  }

  // Chart data for annual overview
  const chartData = MONTHS.map((month) => {
    const md = getMonthData(month)
    return {
      month,
      目標売上: md.target.revenue,
      実績売上: md.actual.revenue,
      目標販売: md.target.salesUnits,
      実績販売: md.actual.salesUnits,
    }
  })

  // Summary stats
  const summaryStats = (() => {
    let totalTargetRevenue = 0
    let totalActualRevenue = 0
    let totalTargetUnits = 0
    let totalActualUnits = 0
    let monthsWithActual = 0

    MONTHS.forEach((month) => {
      const md = getMonthData(month)
      if (md.target.revenue) totalTargetRevenue += md.target.revenue
      if (md.actual.revenue) {
        totalActualRevenue += md.actual.revenue
        monthsWithActual++
      }
      if (md.target.salesUnits) totalTargetUnits += md.target.salesUnits
      if (md.actual.salesUnits) totalActualUnits += md.actual.salesUnits
    })

    return {
      totalTargetRevenue,
      totalActualRevenue,
      totalTargetUnits,
      totalActualUnits,
      monthsWithActual,
      revenueAchievement: totalTargetRevenue > 0 ? (totalActualRevenue / totalTargetRevenue) * 100 : null,
      unitsAchievement: totalTargetUnits > 0 ? (totalActualUnits / totalTargetUnits) * 100 : null,
    }
  })()

  if (!mounted) return null

  const monthData = getMonthData(selectedMonth)

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFiscalYear((y) => y - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold min-w-[100px] text-center">{fiscalYear}年度</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFiscalYear((y) => y + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-muted-foreground"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className="h-3.5 w-3.5" />
              始期: {fiscalStartMonth}月
            </Button>
            {showSettings && (
              <div className="absolute top-full left-0 mt-1 z-50 rounded-md border border-border bg-card p-3 shadow-lg min-w-[180px]">
                <p className="text-[10px] font-medium text-muted-foreground mb-2">年度始期（開始月）</p>
                <Select value={String(fiscalStartMonth)} onValueChange={handleFiscalStartChange}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_MONTH_LABELS.map((label, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)} className="text-xs">
                        {label}始まり
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {saveMessage}
            </span>
          )}
          <Button size="sm" onClick={handleSave}>
            <Save className="h-3.5 w-3.5 mr-1.5" />
            保存
          </Button>
        </div>
      </div>

      <Tabs defaultValue="monthly" className="flex-1 min-h-0 flex flex-col">
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="monthly" className="gap-1.5 text-xs">
            <Target className="h-3.5 w-3.5" />
            月次入力・予実
          </TabsTrigger>
          <TabsTrigger value="annual" className="gap-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5" />
            年間サマリー
          </TabsTrigger>
        </TabsList>

        {/* Monthly Input Tab */}
        <TabsContent value="monthly" className="flex-1 min-h-0 overflow-y-auto space-y-4 mt-3">
          {/* Month selector */}
          <div className="flex gap-1 flex-wrap">
            {MONTHS.map((month) => {
              const md = getMonthData(month)
              const hasActual = KPI_ITEMS.some((item) => md.actual[item.key] !== null)
              const hasTarget = KPI_ITEMS.some((item) => md.target[item.key] !== null)
              return (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(month)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-xs font-medium transition-colors relative",
                    selectedMonth === month
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-foreground",
                  )}
                >
                  {month}
                  {hasTarget && !hasActual && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400" />
                  )}
                  {hasActual && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              )
            })}
          </div>

          {/* KPI Input Table */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-600" />
                {selectedMonth} KPI目標・実績
              </CardTitle>
              <CardDescription className="text-xs">
                目標値と実績値を入力してください。達成率は自動計算されます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground w-[180px]">KPI項目</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-muted-foreground w-[120px]">目標</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-muted-foreground w-[120px]">実績</th>
                      <th className="text-right py-2 px-2 text-xs font-semibold text-muted-foreground w-[80px]">差異</th>
                      <th className="text-right py-2 pl-2 text-xs font-semibold text-muted-foreground w-[100px]">達成率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KPI_ITEMS.map((item) => {
                      const target = monthData.target[item.key]
                      const actual = monthData.actual[item.key]
                      const diff = target !== null && actual !== null ? actual - target : null
                      const rate = getAchievementRate(target, actual)

                      return (
                        <tr key={item.key} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-2 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium">{item.label}</span>
                              <span className="text-[10px] text-muted-foreground">({item.unit})</span>
                            </div>
                          </td>
                          <td className="py-2 px-2">
                            <Input
                              type="number"
                              value={target ?? ""}
                              onChange={(e) => updateValue(selectedMonth, "target", item.key, e.target.value)}
                              className="h-8 text-xs text-right w-full"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2 px-2">
                            <Input
                              type="number"
                              value={actual ?? ""}
                              onChange={(e) => updateValue(selectedMonth, "actual", item.key, e.target.value)}
                              className="h-8 text-xs text-right w-full"
                              placeholder="0"
                            />
                          </td>
                          <td className="py-2 px-2 text-right">
                            {diff !== null ? (
                              <span
                                className={cn(
                                  "text-xs font-medium",
                                  getAchievementColor(rate, item.key),
                                )}
                              >
                                {diff > 0 ? "+" : ""}
                                {formatValue(diff, item.format)}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="py-2 pl-2 text-right">
                            {rate !== null ? (
                              <div className="flex items-center justify-end gap-1">
                                <TrendIcon rate={rate} kpiKey={item.key} />
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] h-5 font-mono border",
                                    getAchievementBg(rate, item.key),
                                    getAchievementColor(rate, item.key),
                                  )}
                                >
                                  {rate.toFixed(1)}%
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Month summary cards */}
          {(() => {
            const rate = getAchievementRate(monthData.target.revenue, monthData.actual.revenue)
            const unitsRate = getAchievementRate(monthData.target.salesUnits, monthData.actual.salesUnits)
            const profitRate = getAchievementRate(monthData.target.grossProfit, monthData.actual.grossProfit)

            if (rate === null && unitsRate === null && profitRate === null) return null

            return (
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: "売上達成率", rate, target: monthData.target.revenue, actual: monthData.actual.revenue, unit: "万円" },
                  { label: "販売台数達成率", rate: unitsRate, target: monthData.target.salesUnits, actual: monthData.actual.salesUnits, unit: "台" },
                  { label: "粗利達成率", rate: profitRate, target: monthData.target.grossProfit, actual: monthData.actual.grossProfit, unit: "万円" },
                ].map((item) => (
                  <Card key={item.label} className={cn("border", item.rate !== null ? getAchievementBg(item.rate, "revenue") : "border-border/50")}>
                    <CardContent className="p-4">
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{item.label}</p>
                      <div className="flex items-end gap-1 mt-1">
                        <span className={cn("text-2xl font-bold", item.rate !== null ? getAchievementColor(item.rate, "revenue") : "text-muted-foreground")}>
                          {item.rate !== null ? `${item.rate.toFixed(1)}%` : "-"}
                        </span>
                      </div>
                      {item.target !== null && item.actual !== null && (
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatValue(item.actual, "currency")} / {formatValue(item.target, "currency")} {item.unit}
                        </p>
                      )}
                      {item.rate !== null && item.rate < 80 && (
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-destructive">
                          <AlertTriangle className="h-3 w-3" />
                          目標を大きく下回っています
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          })()}
        </TabsContent>

        {/* Annual Summary Tab */}
        <TabsContent value="annual" className="flex-1 min-h-0 overflow-y-auto space-y-4 mt-3">
          {/* Annual summary cards */}
          <div className="grid gap-3 sm:grid-cols-4">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">年間目標売上</p>
                <p className="text-xl font-bold mt-1">{summaryStats.totalTargetRevenue.toLocaleString()}<span className="text-xs font-normal text-muted-foreground ml-1">万円</span></p>
              </CardContent>
            </Card>
            <Card className={cn("border", summaryStats.revenueAchievement !== null ? getAchievementBg(summaryStats.revenueAchievement, "revenue") : "border-border/50")}>
              <CardContent className="p-4">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">年間実績売上</p>
                <p className="text-xl font-bold mt-1">{summaryStats.totalActualRevenue.toLocaleString()}<span className="text-xs font-normal text-muted-foreground ml-1">万円</span></p>
                {summaryStats.revenueAchievement !== null && (
                  <p className={cn("text-xs font-medium mt-0.5", getAchievementColor(summaryStats.revenueAchievement, "revenue"))}>
                    達成率 {summaryStats.revenueAchievement.toFixed(1)}%
                  </p>
                )}
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">年間目標台数</p>
                <p className="text-xl font-bold mt-1">{summaryStats.totalTargetUnits.toLocaleString()}<span className="text-xs font-normal text-muted-foreground ml-1">台</span></p>
              </CardContent>
            </Card>
            <Card className={cn("border", summaryStats.unitsAchievement !== null ? getAchievementBg(summaryStats.unitsAchievement, "salesUnits") : "border-border/50")}>
              <CardContent className="p-4">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">年間実績台数</p>
                <p className="text-xl font-bold mt-1">{summaryStats.totalActualUnits.toLocaleString()}<span className="text-xs font-normal text-muted-foreground ml-1">台</span></p>
                {summaryStats.unitsAchievement !== null && (
                  <p className={cn("text-xs font-medium mt-0.5", getAchievementColor(summaryStats.unitsAchievement, "salesUnits"))}>
                    達成率 {summaryStats.unitsAchievement.toFixed(1)}%
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Annual revenue chart */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">月次売上推移（目標 vs 実績）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value?.toLocaleString() ?? "-"} 万円`]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="目標売上" fill="hsl(var(--muted-foreground))" opacity={0.3} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="実績売上" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Annual sales units chart */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">月次販売台数推移（目標 vs 実績）</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`${value?.toLocaleString() ?? "-"} 台`]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="目標販売" fill="hsl(var(--muted-foreground))" opacity={0.3} radius={[2, 2, 0, 0]} />
                    <Bar dataKey="実績販売" fill="hsl(var(--chart-4))" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Annual KPI overview table */}
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">年間KPI一覧</CardTitle>
              <CardDescription className="text-xs">各月の目標・実績・達成率を一覧表示</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-2 font-semibold text-muted-foreground sticky left-0 bg-card z-10 min-w-[100px]">月</th>
                      {MONTHS.map((m) => (
                        <th key={m} className="text-center py-2 px-1 font-semibold text-muted-foreground min-w-[60px]">
                          {m}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(["salesUnits", "revenue", "grossProfit"] as KpiKey[]).map((key) => {
                      const item = KPI_ITEMS.find((i) => i.key === key)!
                      return (
                        <>
                          <tr key={`${key}-target`} className="border-b border-border/30">
                            <td className="py-1.5 pr-2 sticky left-0 bg-card z-10">
                              <span className="font-medium">{item.label}</span>
                              <span className="text-muted-foreground ml-1">(目標)</span>
                            </td>
                            {MONTHS.map((month) => {
                              const md = getMonthData(month)
                              return (
                                <td key={month} className="text-center py-1.5 px-1 text-muted-foreground">
                                  {formatValue(md.target[key], item.format)}
                                </td>
                              )
                            })}
                          </tr>
                          <tr key={`${key}-actual`} className="border-b border-border/30">
                            <td className="py-1.5 pr-2 sticky left-0 bg-card z-10">
                              <span className="font-medium">{item.label}</span>
                              <span className="text-muted-foreground ml-1">(実績)</span>
                            </td>
                            {MONTHS.map((month) => {
                              const md = getMonthData(month)
                              const rate = getAchievementRate(md.target[key], md.actual[key])
                              return (
                                <td key={month} className={cn("text-center py-1.5 px-1 font-medium", getAchievementColor(rate, key))}>
                                  {formatValue(md.actual[key], item.format)}
                                </td>
                              )
                            })}
                          </tr>
                        </>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
