"use client"

import { useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, TrendingDown, ArrowUpDown, Info, ChevronRight, Store, MapPin } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { allStores, allPrefectures, allStoresWithMine, myStore, MY_STORE_ID } from "@/lib/store-data"

function maskStoreName(name: string, index: number): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  }
  const code = (Math.abs(hash) + index * 7919) % 1000000
  return `KE-${String(code).padStart(6, "0")}`
}

export function StoreRankings() {
  const [prefecture, setPrefecture] = useState("すべて")
  const [inventorySize, setInventorySize] = useState("すべて")
  const [rankingType, setRankingType] = useState<"revenue" | "sales" | "turnover" | "days">("revenue")
  const [period, setPeriod] = useState("1month")

  const sortFn = (a: typeof allStores[0], b: typeof allStores[0]) => {
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
  }

  const filterFn = (store: typeof allStores[0]) => {
    if (prefecture !== "すべて" && store.prefecture !== prefecture) return false
    if (inventorySize !== "すべて") {
      if (inventorySize === "100+" && store.avgInventory < 100) return false
      if (inventorySize === "50-100" && (store.avgInventory < 50 || store.avgInventory >= 100)) return false
      if (inventorySize === "20-50" && (store.avgInventory < 20 || store.avgInventory >= 50)) return false
      if (inventorySize === "20未満" && store.avgInventory >= 20) return false
    }
    return true
  }

  // TOP20（自店を除く他店のみ）
  const filteredStores = allStores
    .filter(filterFn)
    .sort(sortFn)
    .slice(0, 20)

  // 自店の順位を全店舗（自店含む）から算出
  const allRankedStores = allStoresWithMine
    .filter(filterFn)
    .sort(sortFn)

  const myStoreRank = allRankedStores.findIndex((s) => s.id === MY_STORE_ID) + 1
  const myStoreInFilter = myStoreRank > 0 // フィルタ条件に自店が該当するか
  const myStoreInTop20 = myStoreRank > 0 && myStoreRank <= 20

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
    <div className="flex-1 space-y-6 overflow-y-auto">
      <Alert className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900">
        <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-xs text-red-800 dark:text-red-300">
          <strong className="text-red-600 dark:text-red-400">注記：</strong>
          表示される分析データは、お客様のブラウザ機能を利用して、お客様の指定したエリア・条件の公開情報を収集・解析したものです。
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
                {allPrefectures.map((pref) => (
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
          <span>上位20位まで表示中（全{allRankedStores.length}件中）</span>
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
              TOP 20
            </Badge>
          </div>

          <div className="space-y-2">
            {filteredStores.map((store, idx) => (
              <Link
                key={store.id}
                href={`/rankings/${store.id}`}
                className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="flex-shrink-0">{getRankIcon(idx + 1)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base truncate font-mono tracking-wide">
                      {store.id === MY_STORE_ID ? store.name : maskStoreName(store.name, idx)}
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

                  <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-foreground/60 transition-colors flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* 自店の順位 */}
      {myStoreInFilter && (
        <Card className="border-2 border-primary/30 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-4 shadow-sm">
                <Store className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight">自店の順位</h3>
                <p className="text-xs text-muted-foreground">{getRankingLabel()}ランキングにおける自店のポジション</p>
              </div>
            </div>
          </div>

          <div className="p-5 pt-3">
            <Link
              href={`/rankings/${MY_STORE_ID}`}
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group"
            >
              {/* 順位 */}
              <div className="flex-shrink-0">
                {myStoreInTop20 ? (
                  getRankIcon(myStoreRank)
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
                    {myStoreRank}
                  </div>
                )}
              </div>

              {/* 店舗情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-base">{myStore.name}</h3>
                  <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">自店</Badge>
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="h-3 w-3 mr-0.5" />
                    {myStore.prefecture}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>平均在庫: {myStore.avgInventory}台</span>
                  <span>販売: {myStore.salesVolume}台</span>
                  <span>回転率: {myStore.turnoverRate}回</span>
                  <span>在庫日数: {myStore.inventoryDays}日</span>
                </div>
              </div>

              {/* 数値 */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-0.5">
                    全{allRankedStores.length}店中
                  </div>
                  <div className="text-2xl font-bold text-primary">{myStoreRank}位</div>
                </div>

                <div className="h-10 w-px bg-border" />

                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-0.5">{getRankingLabel()}</div>
                  <div className="text-xl font-bold">{getRankingValue(myStore)}</div>
                </div>

                {myStore.change !== 0 && (
                  <div className="flex items-center gap-1">
                    {myStore.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${myStore.change > 0 ? "text-green-500" : "text-red-500"}`}>
                      {Math.abs(myStore.change)}%
                    </span>
                  </div>
                )}

                <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </Link>

            {/* TOP20との差 */}
            {!myStoreInTop20 && filteredStores.length > 0 && (
              <div className="mt-3 px-4 py-2.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">TOP 20入りまであと：</span>
                {(() => {
                  const top20Last = filteredStores[filteredStores.length - 1]
                  switch (rankingType) {
                    case "revenue":
                      return ` 売上 +${((top20Last.revenue - myStore.revenue) / 10000).toLocaleString()}万円`
                    case "sales":
                      return ` 販売 +${top20Last.salesVolume - myStore.salesVolume}台`
                    case "turnover":
                      return ` 回転率 +${(Number.parseFloat(top20Last.turnoverRate) - Number.parseFloat(myStore.turnoverRate)).toFixed(1)}回`
                    case "days":
                      return ` 在庫日数 ${myStore.inventoryDays - top20Last.inventoryDays}日短縮`
                    default:
                      return ""
                  }
                })()}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
