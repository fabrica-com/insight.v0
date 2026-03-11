"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  TrendingUp,
  Store,
  Car,
  MapPin,
  Calendar,
  Gauge,
  Building2,
  ExternalLink,
  Clock,
  Target,
  Link2,
  Info,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

// Types
type PriceHistoryEntry = { date: string; price: number }

type InventoryItem = {
  id: string
  make: string
  model: string
  grade: string
  year: number
  month: number
  mileage: number
  color: string
  inspection: string
  purchasePrice: number
  currentPrice: number
  marketPrice: number
  daysOnMarket: number
  viewCount: number
  inquiryCount: number
  image: string
  priceHistory: PriceHistoryEntry[]
  listingStartDate: string // 入庫日
}

type CompetitorInventoryItem = {
  id: string
  competitorId: string
  competitorName: string
  competitorArea: string
  make: string
  model: string
  grade: string
  year: number
  month: number
  mileage: number
  color: string
  inspection: string
  price: number
  daysOnMarket: number
  image: string
  priceHistory: PriceHistoryEntry[]
  listingStartDate: string // 入庫日
  kurumaerabi_url?: string // 車選びドットコムURL
  carsensor_url?: string // カーセンサーURL
}

// Mock data for own inventory (matching main pricing page)
const mockInventory: InventoryItem[] = [
  {
    id: "INV001",
    make: "トヨタ",
    model: "アルファード",
    grade: "2.5S Cパッケージ",
    year: 2020,
    month: 4,
    mileage: 35000,
    color: "ホワイトパール",
    inspection: "2026年4月",
    purchasePrice: 3800000,
    currentPrice: 4280000,
    marketPrice: 3950000,
    daysOnMarket: 67,
    viewCount: 342,
    inquiryCount: 5,
    image: "/placeholder.svg?height=200&width=300",
    priceHistory: [
      { date: "11/01", price: 4580000 },
      { date: "12/01", price: 4480000 },
      { date: "01/01", price: 4480000 },
      { date: "02/01", price: 4380000 },
      { date: "03/01", price: 4280000 },
    ],
    listingStartDate: "2025-11-01",
  },
]

// Mock data for competitor inventory (matching main pricing page)
const mockCompetitors: CompetitorInventoryItem[] = [
  {
    id: "COMP001",
    competitorId: "DEALER001",
    competitorName: "カーセレクト東京",
    competitorArea: "東京都世田谷区",
    make: "トヨタ",
    model: "アルファード",
    grade: "2.5S Cパッケージ",
    year: 2020,
    month: 3,
    mileage: 32000,
    color: "ホワイトパール",
    inspection: "2026年5月",
    price: 4180000,
    daysOnMarket: 45,
    image: "/placeholder.svg?height=200&width=300",
    priceHistory: [
      { date: "11/01", price: 4680000 },
      { date: "12/01", price: 4580000 },
      { date: "01/15", price: 4580000 },
      { date: "02/01", price: 4480000 },
      { date: "03/01", price: 4380000 },
    ],
    listingStartDate: "2026-01-15",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU1234567890/",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0001234567.html",
  },
  {
    id: "COMP002",
    competitorId: "DEALER002",
    competitorName: "オートプラザ横浜",
    competitorArea: "神奈川県横浜市",
    make: "トヨタ",
    model: "アルファード",
    grade: "2.5S",
    year: 2020,
    month: 7,
    mileage: 38000,
    color: "ブラック",
    inspection: "2025年12月",
    price: 3950000,
    daysOnMarket: 60,
    image: "/placeholder.svg?height=200&width=300",
    priceHistory: [
      { date: "01/05", price: 4680000 },
      { date: "01/20", price: 4580000 },
      { date: "02/05", price: 4530000 },
      { date: "02/20", price: 4480000 },
    ],
    listingStartDate: "2026-01-05",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0002345678.html",
  },
  {
    id: "COMP002B",
    competitorId: "DEALER002B",
    competitorName: "カーランド千葉",
    competitorArea: "千葉県船橋市",
    make: "トヨタ",
    model: "アルファード",
    grade: "2.5S Cパッケージ",
    year: 2019,
    month: 11,
    mileage: 45000,
    color: "ブラック",
    inspection: "車検なし",
    price: 3780000,
    daysOnMarket: 88,
    image: "/placeholder.svg?height=200&width=300",
    priceHistory: [
      { date: "11/01", price: 4200000 },
      { date: "12/01", price: 4100000 },
      { date: "01/01", price: 4100000 },
      { date: "02/10", price: 3980000 },
    ],
    listingStartDate: "2025-11-01",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU2345678999/",
  },
  {
    id: "COMP002C",
    competitorId: "DEALER002C",
    competitorName: "ビッグモーター埼玉",
    competitorArea: "埼玉県さいたま市",
    make: "トヨタ",
    model: "アルファード",
    grade: "2.5S Aパッケージ",
    year: 2020,
    month: 1,
    mileage: 28000,
    color: "ホワイトパール",
    inspection: "2026年1月",
    price: 4350000,
    daysOnMarket: 30,
    image: "/placeholder.svg?height=200&width=300",
    priceHistory: [
      { date: "12/01", price: 4700000 },
      { date: "01/01", price: 4600000 },
      { date: "01/20", price: 4500000 },
      { date: "02/01", price: 4450000 },
    ],
    listingStartDate: "2025-12-01",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU2345679001/",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0002345679.html",
  },
  {
    id: "COMP001B",
    competitorId: "DEALER001B",
    competitorName: "オートセンター東京",
    competitorArea: "東京都渋谷区",
    make: "トヨタ",
    model: "アルファード",
    grade: "2.5S Cパッケージ",
    year: 2020,
    month: 6,
    mileage: 33000,
    color: "ホワイトパール",
    inspection: "2026年6月",
    price: 4250000,
    daysOnMarket: 21,
    image: "/placeholder.svg?height=200&width=300",
    priceHistory: [
      { date: "01/01", price: 4550000 },
      { date: "02/01", price: 4450000 },
      { date: "02/20", price: 4450000 },
      { date: "03/01", price: 4350000 },
    ],
    listingStartDate: "2026-01-01",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU1234567891/",
  },
  {
    id: "COMP001C",
    competitorId: "DEALER001C",
    competitorName: "プレミアムカーズ新宿",
    competitorArea: "東京都新宿区",
    make: "トヨタ",
    model: "アルファード",
    grade: "2.5S Cパッケージ",
    year: 2020,
    month: 9,
    mileage: 38000,
    color: "ホワイトパール",
    inspection: "2025年9月",
    price: 4080000,
    daysOnMarket: 55,
    image: "/placeholder.svg?height=200&width=300",
    priceHistory: [
      { date: "01/01", price: 4380000 },
      { date: "02/01", price: 4280000 },
      { date: "03/01", price: 4280000 },
      { date: "04/01", price: 4180000 },
    ],
    listingStartDate: "2026-01-01",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0001234892.html",
  },
  {
    id: "COMP001D",
    competitorId: "DEALER001D",
    competitorName: "ガリバー練馬",
    competitorArea: "東京都練馬区",
    make: "トヨタ",
    model: "アルファード",
    grade: "2.5S Cパッケージ",
    year: 2020,
    month: 5,
    mileage: 41000,
    color: "ホワイトパール",
    inspection: "車検なし",
    price: 3980000,
    daysOnMarket: 72,
    image: "/placeholder.svg?height=200&width=300",
    priceHistory: [
      { date: "02/01", price: 4280000 },
      { date: "03/01", price: 4180000 },
      { date: "04/01", price: 4080000 },
      { date: "04/10", price: 4080000 },
    ],
    listingStartDate: "2026-02-01",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU1234567893/",
  },
  {
    id: "COMP001E",
    competitorId: "DEALER001E",
    competitorName: "ネクステージ川崎",
    competitorArea: "神奈川県川崎市",
    make: "トヨタ",
    model: "アルファード",
    grade: "2.5S Cパッケージ",
    year: 2021,
    month: 2,
    mileage: 22000,
    color: "ホワイトパール",
    inspection: "2027年2月",
    price: 4580000,
    daysOnMarket: 14,
    image: "/placeholder.svg?height=200&width=300",
    priceHistory: [
      { date: "03/15", price: 4680000 },
      { date: "04/01", price: 4580000 },
    ],
    listingStartDate: "2026-02-15",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU1234567894/",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0001234894.html",
  },
  {
    id: "COMP003",
    competitorId: "DEALER003",
    competitorName: "カーセレクト東京",
    competitorArea: "東京都世田谷区",
    make: "ホンダ",
    model: "ヴェゼル",
    grade: "e:HEV Z",
    year: 2022,
    month: 4,
    mileage: 15000,
    color: "プラチナホワイト",
    inspection: "2026年4月",
    price: 3280000,
    daysOnMarket: 35,
    image: "/placeholder.svg?height=200&width=300",
    priceHistory: [
      { date: "11/01", price: 3480000 },
      { date: "12/01", price: 3380000 },
      { date: "01/20", price: 3380000 },
      { date: "02/01", price: 3380000 },
    ],
    listingStartDate: "2025-11-01",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU3456789012/",
  },
]

const DEFAULT_EXPENSE_RATE = 0.1

export default function CompetitorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string
  const competitorId = params.competitorId as string

  // Get own vehicle
  const selectedItem = useMemo(
    () => mockInventory.find((item) => item.id === vehicleId) ?? mockInventory[0],
    [vehicleId]
  )

  // Get competitor vehicle
  const competitor = useMemo(
    () => mockCompetitors.find((c) => c.id === competitorId),
    [competitorId]
  )

  if (!competitor) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">競合車両が見つかりません</p>
            <Button className="mt-4" onClick={() => router.back()}>
              戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const calculatePaymentTotal = (vehiclePrice: number) => {
    const expenseAmount = Math.round(vehiclePrice * DEFAULT_EXPENSE_RATE)
    return vehiclePrice + expenseAmount
  }

  const priceDiff = selectedItem.currentPrice - competitor.price
  const totalPriceDiff = calculatePaymentTotal(selectedItem.currentPrice) - calculatePaymentTotal(competitor.price)

  // Build chart data from listing start date (入庫時から)
  const chartData = useMemo(() => {
    const today = new Date(2026, 2, 2) // March 2, 2026

    // Parse listing start dates
    const parseDate = (dateStr: string) => new Date(dateStr)
    const ownStartDate = parseDate(selectedItem.listingStartDate)
    const compStartDate = parseDate(competitor.listingStartDate)

    // Chart starts from the older listing date
    const chartStart = new Date(Math.min(ownStartDate.getTime(), compStartDate.getTime()))

    // Align to Monday of the chart start week
    const startDay = chartStart.getDay()
    const mondayOffset = startDay === 0 ? -6 : 1 - startDay
    const firstMonday = new Date(chartStart.getTime() + mondayOffset * 86400000)

    const weeks: { start: Date; end: Date; label: string }[] = []
    let cur = new Date(firstMonday)
    while (cur.getTime() <= today.getTime()) {
      const wEnd = new Date(cur.getTime() + 6 * 86400000)
      const m = cur.getMonth() + 1
      const d = cur.getDate()
      weeks.push({ start: new Date(cur), end: wEnd, label: `${m}/${d}` })
      cur = new Date(cur.getTime() + 7 * 86400000)
    }

    if (weeks.length === 0) return []

    // Parse price history dates
    const parsePriceDate = (d: string) => {
      const [mm, dd] = d.split("/").map(Number)
      const yr = mm >= 9 ? 2025 : 2026
      return new Date(yr, mm - 1, dd)
    }

    const ownEntries = selectedItem.priceHistory
      .map((p) => ({ dt: parsePriceDate(p.date), price: p.price }))
      .sort((a, b) => a.dt.getTime() - b.dt.getTime())
    const compEntries = competitor.priceHistory
      .map((p) => ({ dt: parsePriceDate(p.date), price: p.price }))
      .sort((a, b) => a.dt.getTime() - b.dt.getTime())

    // Get week price with carry-forward
    const getWeekPrice = (
      entries: { dt: Date; price: number }[],
      weekEnd: Date
    ): number | null => {
      let last: number | null = null
      for (const e of entries) {
        if (e.dt.getTime() <= weekEnd.getTime()) last = e.price
      }
      return last
    }

    return weeks.map((w) => {
      // Own: null before own listing start
      let ownVal: number | null = null
      if (w.end.getTime() >= ownStartDate.getTime()) {
        ownVal = getWeekPrice(ownEntries, w.end) ?? selectedItem.currentPrice
      }
      // Comp: null before comp listing start
      let compVal: number | null = null
      if (w.end.getTime() >= compStartDate.getTime()) {
        compVal = getWeekPrice(compEntries, w.end) ?? competitor.price
      }
      return { date: w.label, own: ownVal, competitor: compVal }
    })
  }, [selectedItem, competitor])

  const ownLabel = `自社 ${selectedItem.model} ${selectedItem.grade}`
  const compLabel = `${competitor.competitorName} ${competitor.model} ${competitor.grade}`

  // Determine external link (prioritize kurumaerabi, fallback to carsensor)
  const externalUrl = competitor.kurumaerabi_url || competitor.carsensor_url
  const externalSiteName = competitor.kurumaerabi_url ? "車選びドットコム" : "カーセンサー"

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Button>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{competitor.competitorName}</span>
            </div>
          </div>
          {externalUrl && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => window.open(externalUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              {externalSiteName}で見る
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Vehicle Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6">
          {/* Image */}
          <Card className="overflow-hidden">
            <div className="aspect-[4/3] relative bg-muted">
              <img
                src={competitor.image}
                alt={`${competitor.model} ${competitor.grade}`}
                className="object-cover w-full h-full"
              />
            </div>
          </Card>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs">
                  {competitor.make}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    competitor.daysOnMarket <= 14
                      ? "border-green-500 text-green-600"
                      : competitor.daysOnMarket <= 30
                        ? "border-amber-500 text-amber-600"
                        : "border-muted-foreground"
                  }
                >
                  <Clock className="h-3 w-3 mr-1" />
                  在庫{competitor.daysOnMarket}日
                </Badge>
              </div>
              <h1 className="text-2xl font-bold">
                {competitor.model} {competitor.grade}
              </h1>
              <p className="text-muted-foreground flex items-center gap-1.5 mt-1">
                <MapPin className="h-4 w-4" />
                {competitor.competitorArea}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {competitor.year}年{competitor.month}月
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Gauge className="h-4 w-4 text-muted-foreground" />
                <span>{competitor.mileage.toLocaleString()}km</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Car className="h-4 w-4 text-muted-foreground" />
                <span>{competitor.color}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span>車検 {competitor.inspection}</span>
              </div>
            </div>

            {/* Price Comparison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Card className="bg-indigo-50/50 border-indigo-200">
                <CardContent className="py-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    競合店価格（支払総額）
                  </div>
                  <div className="text-2xl font-bold text-indigo-700">
                    ¥{calculatePaymentTotal(competitor.price).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    車両本体: ¥{competitor.price.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-4">
                  <div className="text-sm text-muted-foreground mb-1">
                    自社価格（支払総額）
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    ¥{calculatePaymentTotal(selectedItem.currentPrice).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    車両本体: ¥{selectedItem.currentPrice.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Price Difference Alert */}
            <Alert className={totalPriceDiff < 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
              <Info className="h-4 w-4" />
              <AlertDescription>
                自社価格は競合より
                <span className={`font-bold mx-1 ${totalPriceDiff < 0 ? "text-red-600" : "text-green-600"}`}>
                  ¥{Math.abs(totalPriceDiff).toLocaleString()}
                  {totalPriceDiff < 0 ? "安い" : "高い"}
                </span>
                です（支払総額ベース）
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Price Trend Chart - Starting from listing date */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4" />
                  価格推移比較（入庫時から）
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  自社入庫日: {selectedItem.listingStartDate} / 競合入庫日: {competitor.listingStartDate}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <>
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        interval={Math.max(0, Math.floor(chartData.length / 8))}
                        angle={-30}
                        textAnchor="end"
                        height={50}
                      />
                      <YAxis
                        tickFormatter={(val) => `${(val / 10000).toFixed(0)}万`}
                        tick={{ fontSize: 12 }}
                        domain={["auto", "auto"]}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          `¥${value.toLocaleString()}`,
                          name === "own" ? ownLabel : compLabel,
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="own"
                        name="own"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                        connectNulls={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="competitor"
                        name="competitor"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                        connectNulls={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-4 justify-center text-xs flex-wrap mt-4">
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block w-4 h-0.5"
                      style={{ backgroundColor: "#2563eb" }}
                    />
                    {ownLabel}
                  </span>
                  <span className="flex items-center gap-1">
                    <span
                      className="inline-block w-4 h-0.5"
                      style={{ backgroundColor: "#f59e0b" }}
                    />
                    {compLabel}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <p className="text-sm">データがありません</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="gap-2 flex-1"
            onClick={() => router.push(`/pricing/${vehicleId}`)}
          >
            <Target className="h-4 w-4" />
            この車両に価格追従を設定
          </Button>
          {externalUrl && (
            <Button
              className="gap-2 flex-1"
              onClick={() => window.open(externalUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              {externalSiteName}で車両詳細を見る
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
