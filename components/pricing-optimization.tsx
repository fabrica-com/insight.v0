"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpDown, Search, TrendingDown, TrendingUp, Store, ExternalLink, Car } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

type InventoryItem = {
  id: string
  manufacturer: string
  model: string
  modelCode: string // Added modelCode to own inventory
  grade: string
  year: number
  mileage: number
  color: string
  currentPrice: number
  purchasePrice: number
  marketPrice: number
  pricingScore: number
  listingRank: number
  salesProbability: number
  daysOnMarket: number
  status: "overpriced" | "underpriced" | "optimal"
}

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
  url: string
  newCarPrice: number
  priceHistory: { date: string; price: number }[]
}

const mockCompetitorInventory: CompetitorInventoryItem[] = [
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
    url: "https://www.carsensor.net/usedcar/detail/AU1234567890/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU2345678901/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU2345678999/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU2345679001/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU3456789012/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU3456789099/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU4567890123/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU5678901234/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU5678901299/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU6789012345/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU7890123456/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU7890123499/",
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
    url: "https://www.carsensor.net/usedcar/detail/AU8901234567/",
    newCarPrice: 10500000,
    priceHistory: [
      { date: "02/01", price: 9200000 },
      { date: "02/15", price: 8800000 },
      { date: "03/01", price: 8500000 },
    ],
  },
]

const mockInventory: InventoryItem[] = [
  {
    id: "INV001",
    manufacturer: "トヨタ",
    model: "アルファード",
    modelCode: "AGH30W",
    grade: "2.5S Cパッケージ",
    year: 2020,
    mileage: 35000,
    color: "ホワイトパール",
    currentPrice: 4280000,
    purchasePrice: 3800000,
    marketPrice: 3950000,
    pricingScore: 65,
    listingRank: 12,
    salesProbability: 72.5,
    daysOnMarket: 67,
    status: "overpriced",
  },
  {
    id: "INV002",
    manufacturer: "ホンダ",
    model: "ヴェゼル",
    modelCode: "RV5",
    grade: "e:HEV Z",
    year: 2021,
    mileage: 22000,
    color: "プラチナホワイト",
    currentPrice: 2890000,
    purchasePrice: 2600000,
    marketPrice: 2920000,
    pricingScore: 88,
    listingRank: 5,
    salesProbability: 91.2,
    daysOnMarket: 23,
    status: "optimal",
  },
  {
    id: "INV003",
    manufacturer: "日産",
    model: "セレナ",
    modelCode: "C28",
    grade: "e-POWER ハイウェイスター",
    year: 2019,
    mileage: 48000,
    color: "ブリリアントシルバー",
    currentPrice: 2450000,
    purchasePrice: 2150000,
    marketPrice: 2680000,
    pricingScore: 78,
    listingRank: 2,
    salesProbability: 94.8,
    daysOnMarket: 8,
    status: "underpriced",
  },
  {
    id: "INV004",
    manufacturer: "マツダ",
    model: "CX-5",
    modelCode: "KF5P",
    grade: "XD Lパッケージ",
    year: 2020,
    mileage: 41000,
    color: "ソウルレッドクリスタル",
    currentPrice: 2750000,
    purchasePrice: 2400000,
    marketPrice: 2580000,
    pricingScore: 70,
    listingRank: 9,
    salesProbability: 78.3,
    daysOnMarket: 45,
    status: "overpriced",
  },
  {
    id: "INV005",
    manufacturer: "トヨタ",
    model: "ハリアー",
    modelCode: "MXUA80",
    grade: "ハイブリッド G",
    year: 2021,
    mileage: 18000,
    color: "ブラック",
    currentPrice: 3980000,
    purchasePrice: 3500000,
    marketPrice: 4050000,
    pricingScore: 85,
    listingRank: 6,
    salesProbability: 89.7,
    daysOnMarket: 31,
    status: "optimal",
  },
  {
    id: "INV006",
    manufacturer: "日産",
    model: "エクストレイル",
    modelCode: "T33",
    grade: "20Xi",
    year: 2019,
    mileage: 52000,
    color: "ダークメタルグレー",
    currentPrice: 2380000,
    purchasePrice: 2000000,
    marketPrice: 2250000,
    pricingScore: 68,
    listingRank: 11,
    salesProbability: 74.6,
    daysOnMarket: 58,
    status: "overpriced",
  },
  {
    id: "INV007",
    manufacturer: "ホンダ",
    model: "ステップワゴン",
    modelCode: "RP8",
    grade: "スパーダ ハイブリッド",
    year: 2020,
    mileage: 38000,
    color: "プレミアムスパークルブラック",
    currentPrice: 3150000,
    purchasePrice: 2800000,
    marketPrice: 3180000,
    pricingScore: 90,
    listingRank: 4,
    salesProbability: 92.4,
    daysOnMarket: 19,
    status: "optimal",
  },
  {
    id: "INV008",
    manufacturer: "トヨタ",
    model: "ランドクルーザープラド",
    modelCode: "TRJ150W",
    grade: "TX Lパッケージ",
    year: 2018,
    mileage: 65000,
    color: "ホワイトパール",
    currentPrice: 4250000,
    purchasePrice: 3700000,
    marketPrice: 3980000,
    pricingScore: 62,
    listingRank: 15,
    salesProbability: 69.8,
    daysOnMarket: 89,
    status: "overpriced",
  },
]

type SortKey = "daysOnMarket" | "pricingScore" | "listingRank" | "salesProbability"

export function PricingOptimization() {
  const router = useRouter()

  const [sortKey, setSortKey] = useState<SortKey>("daysOnMarket")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("all")
  const [modelFilter, setModelFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  // Removed unused state variables: selectedItem, adjustedPrice, showCompetitorComparison, selectedCompetitorForChart

  const [activeTab, setActiveTab] = useState<string>("own-inventory")
  const [competitorFilter, setCompetitorFilter] = useState<string>("all")
  const [competitorModelFilter, setCompetitorModelFilter] = useState<string>("all")
  const [competitorModelCodeFilter, setCompetitorModelCodeFilter] = useState<string>("all")
  const [competitorManufacturerFilter, setCompetitorManufacturerFilter] = useState<string>("all")

  const [selectedVehicle, setSelectedVehicle] = useState<CompetitorInventoryItem | null>(null)
  const [showVehicleDetail, setShowVehicleDetail] = useState(false)

  const manufacturers = Array.from(new Set(mockInventory.map((item) => item.manufacturer)))
  const competitors = Array.from(new Set(mockCompetitorInventory.map((item) => item.competitorName)))
  const competitorManufacturers = Array.from(new Set(mockCompetitorInventory.map((item) => item.manufacturer)))
  const competitorModels = Array.from(new Set(mockCompetitorInventory.map((item) => item.model)))
  const competitorModelCodes = Array.from(new Set(mockCompetitorInventory.map((item) => item.modelCode)))

  const calculateDaysElapsed = (listingDate: string) => {
    const listing = new Date(listingDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - listing.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const calculatePaymentTotal = (vehiclePrice: number) => {
    const fees = Math.round(vehiclePrice * 0.1)
    return vehiclePrice + fees
  }

  const filteredAndSortedInventory = useMemo(() => {
    let filtered = [...mockInventory]

    if (manufacturerFilter !== "all") {
      filtered = filtered.filter((item) => item.manufacturer === manufacturerFilter)
    }

    if (modelFilter) {
      filtered = filtered.filter((item) => item.model.toLowerCase().includes(modelFilter.toLowerCase()))
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    filtered.sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [sortKey, sortOrder, manufacturerFilter, modelFilter, statusFilter])

  const filteredCompetitorInventory = useMemo(() => {
    let filtered = [...mockCompetitorInventory]

    if (competitorFilter !== "all") {
      filtered = filtered.filter((item) => item.competitorName === competitorFilter)
    }

    if (competitorManufacturerFilter !== "all") {
      filtered = filtered.filter((item) => item.manufacturer === competitorManufacturerFilter)
    }

    if (competitorModelFilter !== "all") {
      filtered = filtered.filter((item) => item.model === competitorModelFilter)
    }

    if (competitorModelCodeFilter !== "all") {
      filtered = filtered.filter((item) => item.modelCode === competitorModelCodeFilter)
    }

    filtered.sort((a, b) => a.price - b.price)

    return filtered
  }, [competitorFilter, competitorManufacturerFilter, competitorModelFilter, competitorModelCodeFilter])

  const getCompetitorsForModel = (item: InventoryItem) => {
    return mockCompetitorInventory
      .filter((comp) => comp.manufacturer === item.manufacturer && comp.model === item.model)
      .sort((a, b) => a.price - b.price)
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder(key === "daysOnMarket" ? "desc" : "asc")
    }
  }

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />
    return sortOrder === "asc" ? <TrendingUp className="ml-1 h-4 w-4" /> : <TrendingDown className="ml-1 h-4 w-4" />
  }

  const handleItemClick = (item: InventoryItem) => {
    router.push(`/pricing/${item.id}`)
  }

  // Removed unused functions: handleCloseModal, calculateMetrics, handleSavePrice, priceDifference, priceDifferencePercent, getPricePosition
  // Removed unused variables: adjustedPriceNum, priceDifference, priceDifferencePercent, selectedItem
  // Removed unused state variables: selectedItem, adjustedPrice, showCompetitorComparison, selectedCompetitorForChart

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="own-inventory">自社在庫</TabsTrigger>
          <TabsTrigger value="competitor-inventory" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            競合在庫一覧
          </TabsTrigger>
        </TabsList>

        <TabsContent value="own-inventory" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>フィルター・並び替え</CardTitle>
              <CardDescription>在庫の絞り込みと並び替え条件を設定</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>メーカー</Label>
                  <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer} value={manufacturer}>
                          {manufacturer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>車名</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="検索..."
                      value={modelFilter}
                      onChange={(e) => setModelFilter(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>価格評価</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="overpriced">高価格</SelectItem>
                      <SelectItem value="optimal">適正</SelectItem>
                      <SelectItem value="underpriced">低価格</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>表示件数</Label>
                  <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm">
                    {filteredAndSortedInventory.length}件
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>在庫一覧</CardTitle>
              <CardDescription>車両をクリックして競合比較・価格調整ページへ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-sm text-muted-foreground">車両情報</th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">価格</th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => handleSort("pricingScore")}
                        >
                          プライシング評価
                          {getSortIcon("pricingScore")}
                        </Button>
                      </th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => handleSort("listingRank")}
                        >
                          掲載順位
                          {getSortIcon("listingRank")}
                        </Button>
                      </th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => handleSort("salesProbability")}
                        >
                          販売可能性
                          {getSortIcon("salesProbability")}
                        </Button>
                      </th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => handleSort("daysOnMarket")}
                        >
                          在庫日数
                          {getSortIcon("daysOnMarket")}
                        </Button>
                      </th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">競合</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedInventory.map((item) => {
                      const competitorCount = getCompetitorsForModel(item).length
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-border cursor-pointer transition-colors hover:bg-muted/50"
                          onClick={() => handleItemClick(item)}
                        >
                          <td className="py-4">
                            <div className="flex flex-col gap-1">
                              <div className="font-medium">
                                {item.manufacturer} {item.model}
                              </div>
                              <div className="text-sm text-muted-foreground">{item.grade}</div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{item.year}年</span>
                                <span>•</span>
                                <span>{item.mileage.toLocaleString()}km</span>
                                <span>•</span>
                                <span>{item.color}</span>
                                <span>•</span>
                                <span className="font-mono">{item.modelCode}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col gap-0.5">
                              <div className="font-semibold text-primary">
                                ¥{calculatePaymentTotal(item.currentPrice).toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                本体 ¥{item.currentPrice.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                相場 ¥{calculatePaymentTotal(item.marketPrice).toLocaleString()}
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-20 rounded-full ${
                                  item.pricingScore >= 80
                                    ? "bg-success"
                                    : item.pricingScore >= 60
                                      ? "bg-warning"
                                      : "bg-destructive"
                                }`}
                                style={{
                                  background: `linear-gradient(to right, ${
                                    item.pricingScore >= 80
                                      ? "hsl(var(--success))"
                                      : item.pricingScore >= 60
                                        ? "hsl(var(--warning))"
                                        : "hsl(var(--destructive))"
                                  } ${item.pricingScore}%, hsl(var(--muted)) ${item.pricingScore}%)`,
                                }}
                              />
                              <span className="text-sm font-medium">{item.pricingScore}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge
                              variant={item.listingRank <= 5 ? "default" : "secondary"}
                              className={item.listingRank <= 5 ? "bg-success text-success-foreground" : ""}
                            >
                              {item.listingRank}位
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1">
                              <span
                                className={`font-medium ${
                                  item.salesProbability >= 90
                                    ? "text-success"
                                    : item.salesProbability >= 75
                                      ? "text-warning"
                                      : "text-destructive"
                                }`}
                              >
                                {item.salesProbability}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge
                              variant="outline"
                              className={
                                item.daysOnMarket > 60
                                  ? "border-destructive text-destructive"
                                  : item.daysOnMarket > 30
                                    ? "border-warning text-warning"
                                    : ""
                              }
                            >
                              {item.daysOnMarket}日
                            </Badge>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline" className="gap-1">
                              <Store className="h-3 w-3" />
                              {competitorCount}台
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitor-inventory" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>フィルター</CardTitle>
              <CardDescription>競合在庫の絞り込み条件を設定</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>競合店</Label>
                  <Select value={competitorFilter} onValueChange={setCompetitorFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {competitors.map((competitor) => (
                        <SelectItem key={competitor} value={competitor}>
                          {competitor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>メーカー</Label>
                  <Select value={competitorManufacturerFilter} onValueChange={setCompetitorManufacturerFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {competitorManufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer} value={manufacturer}>
                          {manufacturer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>車名</Label>
                  <Select value={competitorModelFilter} onValueChange={setCompetitorModelFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {competitorModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>型式</Label>
                  <Select value={competitorModelCodeFilter} onValueChange={setCompetitorModelCodeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {competitorModelCodes.map((code) => (
                        <SelectItem key={code} value={code}>
                          {code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>表示件数</Label>
                  <div className="flex h-10 items-center rounded-md border border-input bg-background px-3 text-sm">
                    {filteredCompetitorInventory.length}件
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                競合在庫一覧
              </CardTitle>
              <CardDescription>競合店の在庫情報を価格順に表示</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-sm text-muted-foreground">競合店</th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">車両情報</th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">型式</th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">価格</th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">掲載日数</th>
                      <th className="pb-3 font-medium text-sm text-muted-foreground">自社在庫</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompetitorInventory.map((item) => {
                      const ownInventory = mockInventory.find(
                        (inv) => inv.manufacturer === item.manufacturer && inv.model === item.model,
                      )
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-border cursor-pointer transition-colors hover:bg-muted/50"
                          onClick={() => {
                            setSelectedVehicle(item)
                            setShowVehicleDetail(true)
                          }}
                        >
                          <td className="py-4">
                            <div className="flex flex-col gap-1">
                              <div className="font-medium">{item.competitorName}</div>
                              <div className="text-xs text-muted-foreground">{item.competitorArea}</div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col gap-1">
                              <div className="font-medium">
                                {item.manufacturer} {item.model}
                              </div>
                              <div className="text-sm text-muted-foreground">{item.grade}</div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{item.year}年</span>
                                <span>•</span>
                                <span>{item.mileage.toLocaleString()}km</span>
                                <span>•</span>
                                <span>{item.color}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge variant="outline" className="font-mono">
                              {item.modelCode}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-col gap-0.5">
                              <div className="font-semibold text-chart-1">
                                ¥{calculatePaymentTotal(item.price).toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">本体 ¥{item.price.toLocaleString()}</div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge
                              variant="outline"
                              className={
                                calculateDaysElapsed(item.listingDate) > 60
                                  ? "border-destructive text-destructive"
                                  : calculateDaysElapsed(item.listingDate) > 30
                                    ? "border-warning text-warning"
                                    : ""
                              }
                            >
                              {calculateDaysElapsed(item.listingDate)}日
                            </Badge>
                          </td>
                          <td className="py-4">
                            {ownInventory ? (
                              <div className="flex flex-col gap-1">
                                <Badge variant="secondary" className="w-fit">
                                  あり
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  ¥{calculatePaymentTotal(ownInventory.currentPrice).toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                なし
                              </Badge>
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
        </TabsContent>
      </Tabs>

      {/* Competitor vehicle detail modal - kept for competitor tab */}
      <Dialog open={showVehicleDetail} onOpenChange={setShowVehicleDetail}>
        <DialogContent className="max-w-3xl">
          {selectedVehicle && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {selectedVehicle.manufacturer} {selectedVehicle.model}
                </DialogTitle>
                <DialogDescription>
                  {selectedVehicle.competitorName} - {selectedVehicle.competitorArea}
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center justify-center gap-8 py-4 border-b">
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-1">
                    {calculateDaysElapsed(selectedVehicle.listingDate)}日経過
                  </div>
                  <div className="text-xs text-muted-foreground">掲載期間</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">新車 {(selectedVehicle.newCarPrice / 10000).toFixed(0)}万円</div>
                  <div className="text-xs text-muted-foreground">新車価格</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold font-mono">{selectedVehicle.modelCode}</div>
                  <div className="text-xs text-muted-foreground">型式</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 py-4 text-sm">
                <div>
                  <div className="text-muted-foreground">グレード</div>
                  <div className="font-medium">{selectedVehicle.grade}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">年式</div>
                  <div className="font-medium">{selectedVehicle.year}年</div>
                </div>
                <div>
                  <div className="text-muted-foreground">走行距離</div>
                  <div className="font-medium">{selectedVehicle.mileage.toLocaleString()}km</div>
                </div>
                <div>
                  <div className="text-muted-foreground">カラー</div>
                  <div className="font-medium">{selectedVehicle.color}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">価格推移</h4>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={selectedVehicle.priceHistory}
                      margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#e5e5e5" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={{ stroke: "#e5e5e5" }} />
                      <YAxis
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                        tick={{ fontSize: 12 }}
                        domain={["dataMin - 200000", "dataMax + 200000"]}
                        axisLine={{ stroke: "#e5e5e5" }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`¥${value.toLocaleString()}`, "価格"]}
                        labelFormatter={(label) => `日付: ${label}`}
                      />
                      <ReferenceLine
                        y={selectedVehicle.price}
                        stroke="#ef4444"
                        strokeDasharray="5 5"
                        label={{ value: "現在価格", position: "right", fontSize: 10, fill: "#ef4444" }}
                      />
                      <Line
                        type="stepAfter"
                        dataKey="price"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground">支払総額（税込）</div>
                  <div className="text-3xl font-bold text-chart-1">
                    ¥{calculatePaymentTotal(selectedVehicle.price).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    車両本体 ¥{selectedVehicle.price.toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">新車価格からの下落</div>
                  <div className="text-xl font-semibold text-destructive">
                    -{((1 - selectedVehicle.price / selectedVehicle.newCarPrice) * 100).toFixed(1)}%
                    <span className="text-sm ml-2">
                      (¥{(selectedVehicle.newCarPrice - selectedVehicle.price).toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-600 border-orange-300 hover:bg-orange-50 bg-transparent"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  この車種の相場表を見る
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  もっと詳しいスペックを見る
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Removed the competitor comparison modal as it's no longer used */}
    </div>
  )
}
