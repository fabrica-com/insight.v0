"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowUpDown, Search, TrendingDown, TrendingUp, Save } from 'lucide-react'

type InventoryItem = {
  id: string
  manufacturer: string
  model: string
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

const mockInventory: InventoryItem[] = [
  {
    id: "INV001",
    manufacturer: "トヨタ",
    model: "アルファード",
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
  const [sortKey, setSortKey] = useState<SortKey>("daysOnMarket")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("all")
  const [modelFilter, setModelFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustedPrice, setAdjustedPrice] = useState<string>("")

  const manufacturers = Array.from(new Set(mockInventory.map((item) => item.manufacturer)))

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
    setSelectedItem(item)
    setAdjustedPrice(item.currentPrice.toString())
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
    setAdjustedPrice("")
  }

  const calculateMetrics = (item: InventoryItem | null, price: string) => {
    if (!item) return { salesProbability: 0, listingRank: 0, grossProfit: 0 }

    const priceNum = Number(price.replace(/,/g, "")) || item.currentPrice

    const priceDiff = priceNum - item.marketPrice
    const diffPercent = (priceDiff / item.marketPrice) * 100

    let salesProbability = 95 - diffPercent * 2.5
    salesProbability = Math.max(50, Math.min(98, salesProbability))

    let listingRank = Math.round(1 + diffPercent / 2)
    listingRank = Math.max(1, Math.min(20, listingRank))

    const grossProfit = priceNum - item.purchasePrice

    return {
      salesProbability: Number(salesProbability.toFixed(1)),
      listingRank,
      grossProfit,
    }
  }

  const handleSavePrice = () => {
    const priceNum = Number(adjustedPrice.replace(/,/g, ""))
    console.log("[v0] Saving new price:", priceNum, "for item:", selectedItem?.id)
    handleCloseModal()
  }

  const adjustedPriceNum = Number(adjustedPrice.replace(/,/g, "")) || 0
  const priceDifference = selectedItem ? adjustedPriceNum - selectedItem.marketPrice : 0
  const priceDifferencePercent = selectedItem
    ? (((adjustedPriceNum - selectedItem.marketPrice) / selectedItem.marketPrice) * 100).toFixed(1)
    : "0.0"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">価格最適化</h1>
        <p className="text-muted-foreground mt-2">自社在庫のプライシング評価と最適化推奨</p>
      </div>

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
          <CardDescription>プライシング評価・掲載順位・販売可能性で並び替え可能</CardDescription>
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
                  <th className="pb-3 font-medium text-sm text-muted-foreground">推奨</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedInventory.map((item) => {
                  const priceDiff = item.currentPrice - item.marketPrice
                  const priceDiffPercent = ((priceDiff / item.marketPrice) * 100).toFixed(1)
                  const recommendedPrice =
                    item.status === "overpriced"
                      ? Math.floor(item.marketPrice / 10000) * 10000
                      : item.status === "underpriced"
                        ? Math.ceil(item.marketPrice / 10000) * 10000
                        : item.currentPrice

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleItemClick(item)}
                    >
                      <td className="py-4">
                        <div className="space-y-1">
                          <div className="font-semibold">
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
                        <div className="space-y-1">
                          <div className="font-semibold">¥{item.currentPrice.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">相場: ¥{item.marketPrice.toLocaleString()}</div>
                          <div className="flex items-center gap-1 text-xs">
                            {priceDiff > 0 ? (
                              <span className="text-destructive">+¥{Math.abs(priceDiff).toLocaleString()}</span>
                            ) : priceDiff < 0 ? (
                              <span className="text-chart-3">-¥{Math.abs(priceDiff).toLocaleString()}</span>
                            ) : (
                              <span className="text-muted-foreground">±¥0</span>
                            )}
                            <span className="text-muted-foreground">
                              ({priceDiff > 0 ? "+" : ""}
                              {priceDiffPercent}%)
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.pricingScore}</span>
                          <div className="h-2 w-24 rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${
                                item.pricingScore >= 85
                                  ? "bg-chart-2"
                                  : item.pricingScore >= 70
                                    ? "bg-chart-4"
                                    : "bg-destructive"
                              }`}
                              style={{ width: `${item.pricingScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <Badge variant="outline">{item.listingRank}位</Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.salesProbability.toFixed(1)}%</span>
                          <div className="h-2 w-24 rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${
                                item.salesProbability >= 90
                                  ? "bg-chart-2"
                                  : item.salesProbability >= 80
                                    ? "bg-chart-4"
                                    : "bg-chart-5"
                              }`}
                              style={{ width: `${item.salesProbability}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{item.daysOnMarket}日</span>
                          <Badge
                            variant={item.daysOnMarket > 60 ? "destructive" : item.daysOnMarket > 30 ? "secondary" : "outline"}
                          >
                            {item.daysOnMarket > 60 ? "長期" : item.daysOnMarket > 30 ? "中期" : "短期"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4">
                        {item.status === "optimal" ? (
                          <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 hover:bg-chart-2/20">
                            価格適正
                          </Badge>
                        ) : (
                          <div className="space-y-1">
                            <Badge
                              variant={item.status === "overpriced" ? "destructive" : "default"}
                              className={
                                item.status === "underpriced" ? "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20" : ""
                              }
                            >
                              {item.status === "overpriced" ? "値下げ推奨" : "値上げ検討"}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              ¥{recommendedPrice.toLocaleString()}
                            </div>
                          </div>
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

      <Dialog open={selectedItem !== null} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle>価格調整</DialogTitle>
            <DialogDescription>
              価格を調整して販売可能性、掲載順位、粗利額をリアルタイムで確認
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-3">
              <div className="rounded-lg border border-border bg-muted/30 p-2">
                <h3 className="font-semibold text-lg mb-0.5">
                  {selectedItem.manufacturer} {selectedItem.model}
                </h3>
                <p className="text-sm text-muted-foreground mb-0.5">{selectedItem.grade}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{selectedItem.year}年</span>
                  <span>•</span>
                  <span>{selectedItem.mileage.toLocaleString()}km</span>
                  <span>•</span>
                  <span>{selectedItem.color}</span>
                  <span>•</span>
                  <span>在庫{selectedItem.daysOnMarket}日</span>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-3">
                <div className="space-y-0.5">
                  <Label className="text-xs text-muted-foreground">仕入価格</Label>
                  <p className="text-lg font-bold">¥{selectedItem.purchasePrice.toLocaleString()}</p>
                </div>
                <div className="space-y-0.5">
                  <Label className="text-xs text-muted-foreground">現在の販売価格</Label>
                  <p className="text-lg font-bold">¥{selectedItem.currentPrice.toLocaleString()}</p>
                </div>
                <div className="space-y-0.5">
                  <Label className="text-xs text-muted-foreground">市場相場価格</Label>
                  <p className="text-lg font-bold">¥{selectedItem.marketPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-1 pt-2 px-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground">販売可能性</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2 px-3">
                    <div className="space-y-0.5">
                      <p className="text-3xl font-bold">{calculateMetrics(selectedItem, adjustedPrice).salesProbability}%</p>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${
                            calculateMetrics(selectedItem, adjustedPrice).salesProbability >= 90
                              ? "bg-chart-2"
                              : calculateMetrics(selectedItem, adjustedPrice).salesProbability >= 80
                                ? "bg-chart-4"
                                : "bg-chart-5"
                          }`}
                          style={{ width: `${calculateMetrics(selectedItem, adjustedPrice).salesProbability}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        現在: {selectedItem.salesProbability.toFixed(1)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-1 pt-2 px-3">
                    <CardTitle className="text-xs font-medium text-muted-foreground">推定掲載順位</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2 px-3">
                    <div className="space-y-0.5">
                      <p className="text-3xl font-bold">{calculateMetrics(selectedItem, adjustedPrice).listingRank}位</p>
                      <Badge
                        variant={calculateMetrics(selectedItem, adjustedPrice).listingRank <= 5 ? "default" : "secondary"}
                        className={
                          calculateMetrics(selectedItem, adjustedPrice).listingRank <= 5 ? "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20" : ""
                        }
                      >
                        {calculateMetrics(selectedItem, adjustedPrice).listingRank <= 5 ? "上位" : calculateMetrics(selectedItem, adjustedPrice).listingRank <= 10 ? "中位" : "下位"}
                      </Badge>
                      <p className="text-xs text-muted-foreground">現在: {selectedItem.listingRank}位</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-1 pt-2 px-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">粗利額</CardTitle>
                </CardHeader>
                <CardContent className="pb-2 px-3">
                  <div className="flex items-center justify-between gap-6">
                    <div className="space-y-0.5">
                      <p className="text-3xl font-bold">
                        ¥{calculateMetrics(selectedItem, adjustedPrice).grossProfit.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        現在: ¥{(selectedItem.currentPrice - selectedItem.purchasePrice).toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={calculateMetrics(selectedItem, adjustedPrice).grossProfit >= 300000 ? "default" : "secondary"}
                      className={`px-4 py-1 ${
                        calculateMetrics(selectedItem, adjustedPrice).grossProfit >= 300000
                          ? "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20"
                          : calculateMetrics(selectedItem, adjustedPrice).grossProfit < 150000
                            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            : ""
                      }`}
                    >
                      {calculateMetrics(selectedItem, adjustedPrice).grossProfit >= 300000
                        ? "高利益"
                        : calculateMetrics(selectedItem, adjustedPrice).grossProfit >= 150000
                          ? "標準"
                          : "低利益"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-1.5">
                <Label htmlFor="adjusted-price" className="text-sm font-semibold">新しい販売価格</Label>
                <Input
                  id="adjusted-price"
                  type="text"
                  inputMode="numeric"
                  value={adjustedPrice ? Number(adjustedPrice.replace(/,/g, "")).toLocaleString() : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "")
                    setAdjustedPrice(value)
                  }}
                  className="text-6xl font-bold h-32 text-center tracking-tight min-w-full px-4"
                  placeholder="4,250,000"
                />
                <p className="text-sm text-muted-foreground text-center">
                  市場相場との差:{" "}
                  {priceDifference > 0 ? "+" : ""}
                  ¥{Math.abs(priceDifference).toLocaleString()}{" "}
                  ({priceDifference > 0 ? "+" : ""}{priceDifferencePercent}%)
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <Button variant="outline" onClick={handleCloseModal}>
                  キャンセル
                </Button>
                <Button onClick={handleSavePrice} className="gap-2">
                  <Save className="h-4 w-4" />
                  価格を保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
