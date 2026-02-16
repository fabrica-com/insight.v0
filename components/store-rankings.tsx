"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, TrendingDown, ArrowUpDown, Info } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoreDetailDialog } from "./store-detail-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Sample data for store rankings
const generateStoreData = () => {
  const prefectures = ["東京都", "神奈川県", "大阪府", "愛知県", "福岡県", "北海道", "千葉県", "埼玉県"]
  const storeNames = [
    "カーセレクト東京",
    "オートギャラリー横浜",
    "ドリームモータース大阪",
    "プレミアムカーズ名古屋",
    "スピードオート福岡",
    "北海道カーセンター",
    "千葉モーターズ",
    "埼玉オートプラザ",
    "東京ベストカー",
    "横浜カーズ",
    "大阪プレミアム",
    "名古屋オートマーケット",
    "福岡カーステーション",
    "札幌モータース",
    "千葉カーワールド",
    "埼玉オートギャラリー",
    "銀座カーセレクト",
    "みなとみらいオート",
    "梅田カーズ",
    "栄モータース",
  ]

  return storeNames.map((name, idx) => ({
    id: idx + 1,
    name,
    prefecture: prefectures[idx % prefectures.length],
    revenue: Math.floor(Math.random() * 500000000) + 50000000,
    salesVolume: Math.floor(Math.random() * 300) + 20,
    avgInventory: Math.floor(Math.random() * 150) + 10,
    turnoverRate: (Math.random() * 10 + 2).toFixed(1),
    inventoryDays: Math.floor(Math.random() * 60) + 15,
    change: Math.floor(Math.random() * 20) - 10,
  }))
}

const allStores = generateStoreData()

const prefectures = ["すべて", "東京都", "神奈川県", "大阪府", "愛知県", "福岡県", "北海道", "千葉県", "埼玉県"]

export function StoreRankings() {
  const [prefecture, setPrefecture] = useState("すべて")
  const [inventorySize, setInventorySize] = useState("すべて")
  const [rankingType, setRankingType] = useState<"revenue" | "sales" | "turnover" | "days">("revenue")
  const [period, setPeriod] = useState("1month")
  const [selectedStore, setSelectedStore] = useState<(typeof allStores)[0] | null>(null)

  const filteredStores = allStores
    .filter((store) => {
      if (prefecture !== "すべて" && store.prefecture !== prefecture) return false

      if (inventorySize !== "すべて") {
        if (inventorySize === "100+" && store.avgInventory < 100) return false
        if (inventorySize === "50-100" && (store.avgInventory < 50 || store.avgInventory >= 100)) return false
        if (inventorySize === "20-50" && (store.avgInventory < 20 || store.avgInventory >= 50)) return false
        if (inventorySize === "20未満" && store.avgInventory >= 20) return false
      }

      return true
    })
    .sort((a, b) => {
      switch (rankingType) {
        case "revenue":
          return b.revenue - a.revenue
        case "sales":
          return b.salesVolume - a.salesVolume
        case "turnover":
          return Number.parseFloat(b.turnoverRate) - Number.parseFloat(a.turnoverRate)
        case "days":
          return a.inventoryDays - b.inventoryDays
        default:
          return 0
      }
    })
    .slice(0, 30) // Top 30 only

  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
          1
        </div>
      )
    if (rank === 2)
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-sm shadow-lg">
          2
        </div>
      )
    if (rank === 3)
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
          3
        </div>
      )
    return (
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">
        {rank}
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return `¥${(value / 100000000).toFixed(1)}億`
  }

  const getRankingValue = (store: (typeof allStores)[0]) => {
    switch (rankingType) {
      case "revenue":
        return formatCurrency(store.revenue)
      case "sales":
        return `${store.salesVolume}台`
      case "turnover":
        return `${store.turnoverRate}回`
      case "days":
        return `${store.inventoryDays}日`
      default:
        return ""
    }
  }

  const getRankingLabel = () => {
    switch (rankingType) {
      case "revenue":
        return "売上高"
      case "sales":
        return "販売台数"
      case "turnover":
        return "在庫回転率"
      case "days":
        return "在庫日数"
      default:
        return ""
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 overflow-y-auto bg-background">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-chart-4/10 to-chart-1/10 p-8 border border-primary/20">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-lg shadow-orange-500/30">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">店舗ランキング</h1>
              <p className="text-sm text-muted-foreground mt-1">各種指標による店舗パフォーマンスランキング</p>
            </div>
          </div>
        </div>
      </div>

      <Alert className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
        <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-xs text-red-800 dark:text-red-300">
          <strong className="text-red-600 dark:text-red-400">注記：</strong>
          表示される分析データは、お客様のブラウザ機能を利用して、お客様の指定したエリア・条件の公開情報を収集・解析したものです。
          <br />
          ※情報の取得は、参照先サイトへの負荷を考慮し、通常閲覧の範囲内（低頻度）で行われます。
          <br />
          ※取得したデータは貴社内での検討資料としてのみご利用ください。
          <span className="ml-2 text-red-600 dark:text-red-400 underline cursor-pointer hover:text-red-700">
            [詳しい利用条件はこちら &gt;]
          </span>
        </AlertDescription>
      </Alert>

      {/* Filters */}
      <Card className="p-6 border-2">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">期間</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">月次（前月）</SelectItem>
                <SelectItem value="3months">3か月</SelectItem>
                <SelectItem value="6months">6か月</SelectItem>
                <SelectItem value="1year">1年</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">都道府県</label>
            <Select value={prefecture} onValueChange={setPrefecture}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {prefectures.map((pref) => (
                  <SelectItem key={pref} value={pref}>
                    {pref}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">平均在庫台数</label>
            <Select value={inventorySize} onValueChange={setInventorySize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="すべて">すべて</SelectItem>
                <SelectItem value="100+">100台以上</SelectItem>
                <SelectItem value="50-100">50～100台</SelectItem>
                <SelectItem value="20-50">20～50台</SelectItem>
                <SelectItem value="20未満">20台未満</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">ランキング種別</label>
            <Tabs value={rankingType} onValueChange={(v) => setRankingType(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
                <TabsTrigger value="revenue" className="text-xs py-2">
                  売上高
                </TabsTrigger>
                <TabsTrigger value="sales" className="text-xs py-2">
                  販売台数
                </TabsTrigger>
                <TabsTrigger value="turnover" className="text-xs py-2">
                  回転率
                </TabsTrigger>
                <TabsTrigger value="days" className="text-xs py-2">
                  在庫日数
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowUpDown className="h-4 w-4" />
          <span>上位30位まで表示中（全{filteredStores.length}件）</span>
        </div>
      </Card>

      {/* Rankings Table */}
      <Card className="border-2">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {getRankingLabel()}ランキング
            </h2>
            <Badge variant="secondary" className="text-xs">
              上位30位まで表示
            </Badge>
          </div>

          <div className="space-y-2">
            {filteredStores.map((store, idx) => (
              <div
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0">{getRankIcon(idx + 1)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base truncate blur-sm hover:blur-none transition-all duration-300">
                      {store.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {store.prefecture}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>平均在庫: {store.avgInventory}台</span>
                    <span className="hidden sm:inline">販売: {store.salesVolume}台</span>
                    <span className="hidden md:inline">回転率: {store.turnoverRate}回</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{getRankingValue(store)}</div>
                    <div className="text-xs text-muted-foreground">{getRankingLabel()}</div>
                  </div>

                  {store.change !== 0 && (
                    <div className="flex items-center gap-1">
                      {store.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${store.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {Math.abs(store.change)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Store Detail Dialog */}
      <StoreDetailDialog store={selectedStore} onClose={() => setSelectedStore(null)} />
    </div>
  )
}
