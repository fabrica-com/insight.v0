"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ArrowLeft, Car, ExternalLink, Calendar, Gauge, MapPin, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

type CompetitorInventoryItem = {
  id: string
  competitorName: string
  competitorArea: string
  manufacturer: string
  model: string
  modelCode: string
  grade: string
  year: number
  mileage: number
  color: string
  price: number
  listingDate: string
  listingStartDate: string
  url: string
  kurumaerabi_url?: string
  carsensor_url?: string
  newCarPrice: number
  priceHistory: { date: string; price: number }[]
}

// Mock data matching pricing-optimization.tsx
const mockCompetitors: CompetitorInventoryItem[] = [
  {
    id: "COMP001",
    competitorName: "カーセレクト東京",
    competitorArea: "東京都世田谷区",
    manufacturer: "トヨタ",
    model: "アルファード",
    modelCode: "AGH30W",
    grade: "2.5S Cパッケージ",
    year: 2020,
    mileage: 32000,
    color: "ホワイトパール",
    price: 4180000,
    listingDate: "2024-01-15",
    listingStartDate: "2026-01-15",
    url: "https://kurumaerabi.com/usedcar/detail/AU1234567890/",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU1234567890/",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0001234567.html",
    newCarPrice: 5200000,
    priceHistory: [
      { date: "01/15", price: 4580000 },
      { date: "02/01", price: 4580000 },
      { date: "03/01", price: 4480000 },
      { date: "04/01", price: 4380000 },
      { date: "05/01", price: 4380000 },
      { date: "06/01", price: 4280000 },
      { date: "07/01", price: 4280000 },
      { date: "08/01", price: 4180000 },
    ],
  },
  {
    id: "COMP002",
    competitorName: "オートプラザ横浜",
    competitorArea: "神奈川県横浜市",
    manufacturer: "トヨタ",
    model: "アルファード",
    modelCode: "AGH30W",
    grade: "2.5S",
    year: 2020,
    mileage: 38000,
    color: "ブラック",
    price: 3950000,
    listingDate: "2024-01-18",
    listingStartDate: "2025-10-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU2345678901/",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0002345678.html",
    newCarPrice: 4800000,
    priceHistory: [
      { date: "01/18", price: 4250000 },
      { date: "02/01", price: 4250000 },
      { date: "03/01", price: 4150000 },
      { date: "04/01", price: 4050000 },
      { date: "05/01", price: 3950000 },
    ],
  },
  {
    id: "COMP002B",
    competitorName: "カーランド千葉",
    competitorArea: "千葉県船橋市",
    manufacturer: "トヨタ",
    model: "アルファード",
    modelCode: "AGH30W",
    grade: "2.5S Cパッケージ",
    year: 2019,
    mileage: 45000,
    color: "ブラック",
    price: 3780000,
    listingDate: "2024-02-10",
    listingStartDate: "2025-11-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU2345678999/",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU2345678999/",
    newCarPrice: 5100000,
    priceHistory: [
      { date: "02/10", price: 4100000 },
      { date: "03/01", price: 3980000 },
      { date: "04/01", price: 3880000 },
      { date: "05/01", price: 3780000 },
    ],
  },
  {
    id: "COMP002C",
    competitorName: "ビッグモーター埼玉",
    competitorArea: "埼玉県さいたま市",
    manufacturer: "トヨタ",
    model: "アルファード",
    modelCode: "AGH30W",
    grade: "2.5S Aパッケージ",
    year: 2020,
    mileage: 28000,
    color: "ホワイトパール",
    price: 4350000,
    listingDate: "2024-01-20",
    listingStartDate: "2025-12-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU2345679001/",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU2345679001/",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0002345679.html",
    newCarPrice: 5000000,
    priceHistory: [
      { date: "01/20", price: 4600000 },
      { date: "02/01", price: 4500000 },
      { date: "03/01", price: 4450000 },
      { date: "04/01", price: 4350000 },
    ],
  },
  {
    id: "COMP003",
    competitorName: "カーセレクト東京",
    competitorArea: "東京都世田谷区",
    manufacturer: "ホンダ",
    model: "ヴェゼル",
    modelCode: "RV5",
    grade: "e:HEV Z",
    year: 2022,
    mileage: 15000,
    color: "プラチナホワイト",
    price: 3280000,
    listingDate: "2024-01-20",
    listingStartDate: "2025-11-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU3456789012/",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU3456789012/",
    newCarPrice: 3500000,
    priceHistory: [
      { date: "01/20", price: 3380000 },
      { date: "02/01", price: 3380000 },
      { date: "03/01", price: 3280000 },
    ],
  },
  {
    id: "COMP003B",
    competitorName: "オートギャラリー品川",
    competitorArea: "東京都品川区",
    manufacturer: "ホンダ",
    model: "ヴェゼル",
    modelCode: "RV5",
    grade: "e:HEV Z",
    year: 2021,
    mileage: 22000,
    color: "クリスタルブラック",
    price: 2980000,
    listingDate: "2024-02-05",
    listingStartDate: "2025-12-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU3456789099/",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0003456099.html",
    newCarPrice: 3400000,
    priceHistory: [
      { date: "02/05", price: 3180000 },
      { date: "03/01", price: 3080000 },
      { date: "04/01", price: 2980000 },
    ],
  },
  {
    id: "COMP004",
    competitorName: "オートギャラリー品川",
    competitorArea: "東京都品川区",
    manufacturer: "日産",
    model: "エクストレイル",
    modelCode: "T33",
    grade: "X e-4ORCE",
    year: 2023,
    mileage: 8000,
    color: "ダイヤモンドブラック",
    price: 4250000,
    listingDate: "2024-01-22",
    listingStartDate: "2025-11-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU4567890123/",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0004567890.html",
    newCarPrice: 4700000,
    priceHistory: [
      { date: "01/22", price: 4450000 },
      { date: "02/01", price: 4350000 },
      { date: "03/01", price: 4250000 },
    ],
  },
  {
    id: "COMP005",
    competitorName: "カーセレクト東京",
    competitorArea: "東京都世田谷区",
    manufacturer: "トヨタ",
    model: "ハリアー",
    modelCode: "MXUA80",
    grade: "Z レザーパッケージ",
    year: 2021,
    mileage: 25000,
    color: "プレシャスブラック",
    price: 3980000,
    listingDate: "2024-01-25",
    listingStartDate: "2025-10-15",
    url: "https://kurumaerabi.com/usedcar/detail/AU5678901234/",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU5678901234/",
    newCarPrice: 4500000,
    priceHistory: [
      { date: "01/25", price: 4280000 },
      { date: "02/01", price: 4180000 },
      { date: "03/01", price: 4080000 },
      { date: "04/01", price: 3980000 },
    ],
  },
  {
    id: "COMP005B",
    competitorName: "オートプラザ横浜",
    competitorArea: "神奈川県横浜市",
    manufacturer: "トヨタ",
    model: "ハリアー",
    modelCode: "MXUA80",
    grade: "G",
    year: 2021,
    mileage: 18000,
    color: "ホワイトパール",
    price: 3650000,
    listingDate: "2024-02-15",
    listingStartDate: "2025-12-15",
    url: "https://kurumaerabi.com/usedcar/detail/AU5678901299/",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU5678901299/",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0005678901.html",
    newCarPrice: 4200000,
    priceHistory: [
      { date: "02/15", price: 3850000 },
      { date: "03/01", price: 3750000 },
      { date: "04/01", price: 3650000 },
    ],
  },
  {
    id: "COMP006",
    competitorName: "オートプラザ横浜",
    competitorArea: "神奈川県横浜市",
    manufacturer: "トヨタ",
    model: "プリウス",
    modelCode: "ZVW60",
    grade: "Z",
    year: 2023,
    mileage: 5000,
    color: "アッシュ",
    price: 3650000,
    listingDate: "2024-01-28",
    listingStartDate: "2025-12-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU6789012345/",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU6789012345/",
    newCarPrice: 3900000,
    priceHistory: [
      { date: "01/28", price: 3750000 },
      { date: "02/01", price: 3700000 },
      { date: "03/01", price: 3650000 },
    ],
  },
  {
    id: "COMP007",
    competitorName: "オートギャラリー品川",
    competitorArea: "東京都品川区",
    manufacturer: "マツダ",
    model: "CX-5",
    modelCode: "KF5P",
    grade: "XD エクスクルーシブモード",
    year: 2022,
    mileage: 18000,
    color: "ソウルレッド",
    price: 3480000,
    listingDate: "2024-01-30",
    listingStartDate: "2025-11-15",
    url: "https://kurumaerabi.com/usedcar/detail/AU7890123456/",
    carsensor_url: "https://www.carsensor.net/usedcar/detail/VU0007890123.html",
    newCarPrice: 4000000,
    priceHistory: [
      { date: "01/30", price: 3680000 },
      { date: "02/15", price: 3580000 },
      { date: "03/01", price: 3480000 },
    ],
  },
  {
    id: "COMP007B",
    competitorName: "カーセレクト東京",
    competitorArea: "東京都世田谷区",
    manufacturer: "マツダ",
    model: "CX-5",
    modelCode: "KF5P",
    grade: "XD Lパッケージ",
    year: 2020,
    mileage: 35000,
    color: "ジェットブラック",
    price: 2680000,
    listingDate: "2024-02-20",
    listingStartDate: "2026-01-05",
    url: "https://kurumaerabi.com/usedcar/detail/AU7890123499/",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU7890123499/",
    newCarPrice: 3800000,
    priceHistory: [
      { date: "02/20", price: 2880000 },
      { date: "03/01", price: 2780000 },
      { date: "04/01", price: 2680000 },
    ],
  },
  {
    id: "COMP008",
    competitorName: "カーセレクト東京",
    competitorArea: "東京都世田谷区",
    manufacturer: "トヨタ",
    model: "アルファード",
    modelCode: "AAHH40W",
    grade: "エグゼクティブラウンジ",
    year: 2024,
    mileage: 3000,
    color: "ホワイトパール",
    price: 8500000,
    listingDate: "2024-02-01",
    listingStartDate: "2026-01-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU8901234567/",
    kurumaerabi_url: "https://www.kurumaerabi.com/usedcar/detail/AU8901234567/",
    newCarPrice: 10500000,
    priceHistory: [
      { date: "02/01", price: 9200000 },
      { date: "03/01", price: 8800000 },
      { date: "04/01", price: 8500000 },
    ],
  },
]

// Calculate days elapsed from listingStartDate
function calculateDaysFromListingStart(listingStartDate: string): number {
  const today = new Date("2026-03-11") // Current date
  const start = new Date(listingStartDate)
  const diffTime = today.getTime() - start.getTime()
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Calculate payment total (adding 10% for expenses)
function calculatePaymentTotal(price: number): number {
  return Math.round(price * 1.1)
}

export default function CompetitorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const competitorId = params.competitorId as string

  const vehicle = mockCompetitors.find((c) => c.id === competitorId)

  if (!vehicle) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-[1200px]">
              <Button variant="ghost" onClick={() => router.back()} className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Button>
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">車両が見つかりません</p>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const daysFromStart = calculateDaysFromListingStart(vehicle.listingStartDate)
  const priceDropFromNew = vehicle.newCarPrice - vehicle.price
  const priceDropPercent = ((priceDropFromNew / vehicle.newCarPrice) * 100).toFixed(1)

  // Get external URL - prioritize kurumaerabi, fallback to carsensor
  const externalUrl = vehicle.kurumaerabi_url || vehicle.carsensor_url
  const externalUrlLabel = vehicle.kurumaerabi_url ? "車選びドットコムで見る" : "カーセンサーで見る"

  // Chart data - transform priceHistory with proper Y-axis values
  const chartData = vehicle.priceHistory.map((item) => ({
    ...item,
    priceInMan: item.price / 10000,
  }))

  const minPrice = Math.min(...vehicle.priceHistory.map((p) => p.price))
  const maxPrice = Math.max(...vehicle.priceHistory.map((p) => p.price))
  const yMin = Math.floor(minPrice / 100000) * 10 - 10
  const yMax = Math.ceil(maxPrice / 100000) * 10 + 10

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1200px] space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                戻る
              </Button>
              <div>
                <h1 className="text-2xl font-bold">競合車両詳細</h1>
                <p className="text-sm text-muted-foreground">競合店在庫の詳細情報</p>
              </div>
            </div>

            {/* Vehicle Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Car className="h-5 w-5" />
                      {vehicle.manufacturer} {vehicle.model}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {vehicle.competitorName} - {vehicle.competitorArea}
                    </CardDescription>
                  </div>
                  {externalUrl && (
                    <Button asChild>
                      <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        {externalUrlLabel}
                      </a>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Metrics */}
                <div className="flex items-center justify-center gap-8 py-4 border-b">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-1">{daysFromStart}日経過</div>
                    <div className="text-xs text-muted-foreground">入庫からの日数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">新車 {(vehicle.newCarPrice / 10000).toFixed(0)}万円</div>
                    <div className="text-xs text-muted-foreground">新車価格</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono">{vehicle.modelCode}</div>
                    <div className="text-xs text-muted-foreground">型式</div>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-4 gap-4 py-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">グレード</div>
                    <div className="font-medium">{vehicle.grade}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">年式</div>
                    <div className="font-medium">{vehicle.year}年</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">走行距離</div>
                    <div className="font-medium">{vehicle.mileage.toLocaleString()}km</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">カラー</div>
                    <div className="font-medium">{vehicle.color}</div>
                  </div>
                </div>

                {/* Price Chart - from listing start date */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">価格推移（入庫時から）</h3>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      入庫日: {vehicle.listingStartDate}
                    </Badge>
                  </div>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#e5e5e5" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
                        <YAxis
                          domain={[yMin, yMax]}
                          tickFormatter={(value) => `${value}万`}
                          tick={{ fontSize: 11 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value: number) => [`¥${(value * 10000).toLocaleString()}`, "価格"]}
                          labelFormatter={(label) => `日付: ${label}`}
                        />
                        <ReferenceLine
                          y={vehicle.price / 10000}
                          stroke="#ef4444"
                          strokeDasharray="5 5"
                          label={{ value: "現在価格", position: "right", fontSize: 10, fill: "#ef4444" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="priceInMan"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="flex items-center justify-between py-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground">支払総額（税込）</div>
                    <div className="text-3xl font-bold text-chart-1">
                      ¥{calculatePaymentTotal(vehicle.price).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">車両本体 ¥{vehicle.price.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">新車価格からの下落</div>
                    <div className="text-xl font-semibold text-destructive flex items-center justify-end gap-1">
                      <TrendingDown className="h-5 w-5" />
                      -{priceDropPercent}%
                      <span className="text-sm ml-2">(¥{priceDropFromNew.toLocaleString()})</span>
                    </div>
                  </div>
                </div>

                {/* External Links */}
                <div className="flex gap-3 pt-4 border-t">
                  {vehicle.kurumaerabi_url && (
                    <Button variant="outline" asChild className="flex-1">
                      <a href={vehicle.kurumaerabi_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        車選びドットコムで詳細を見る
                      </a>
                    </Button>
                  )}
                  {vehicle.carsensor_url && (
                    <Button variant="outline" asChild className="flex-1">
                      <a href={vehicle.carsensor_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        カーセンサーで詳細を見る
                      </a>
                    </Button>
                  )}
                  {!vehicle.kurumaerabi_url && !vehicle.carsensor_url && (
                    <p className="text-sm text-muted-foreground">外部サイトへのリンクはありません</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
