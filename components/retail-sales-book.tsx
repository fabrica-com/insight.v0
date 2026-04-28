"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Search, TrendingUp, TrendingDown, Store, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react"
import {
  MANUFACTURERS,
  REGIONS,
  retailSalesData,
  auctionData,
  aggregateRetailSales,
  aggregateWholesalePrices,
  getModelsForManufacturer,
  getRegionName,
  formatPrice,
  formatPriceInMan,
  type Manufacturer,
  type RegionId,
  type RetailSalesSummary,
  type WholesalePriceSummary,
  type EquipmentFeatures,
} from "@/lib/retail-sales-book-data"

type SortKey = "avgPrice" | "avgListingPrice" | "avgListingDays" | "calculatedWholesalePrice" | "year"

const ITEMS_PER_PAGE = 15

export function RetailSalesBook() {
  const [activeTab, setActiveTab] = useState<"retail" | "wholesale">("retail")
  
  // フィルター状態
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("all")
  const [modelFilter, setModelFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  // ソート状態
  const [sortKey, setSortKey] = useState<SortKey>("avgPrice")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  
  // ページネーション
  const [currentPage, setCurrentPage] = useState(1)

  // 車種リスト（メーカーに基づく）
  const availableModels = useMemo(() => {
    if (manufacturerFilter === "all") return []
    return getModelsForManufacturer(manufacturerFilter as Manufacturer)
  }, [manufacturerFilter])

  // メーカー変更時に車種をリセット
  const handleManufacturerChange = (value: string) => {
    setManufacturerFilter(value)
    setModelFilter("all")
    setCurrentPage(1)
  }

  // 小売データの集計・フィルタリング
  const retailSummaries = useMemo(() => {
    const summaries = aggregateRetailSales(retailSalesData, {
      manufacturer: manufacturerFilter !== "all" ? manufacturerFilter as Manufacturer : undefined,
      model: modelFilter !== "all" ? modelFilter : undefined,
      region: regionFilter !== "all" ? regionFilter as RegionId : undefined,
    })

    // 検索フィルター
    let filtered = summaries
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = summaries.filter(
        s => s.model.toLowerCase().includes(query) || s.grade.toLowerCase().includes(query)
      )
    }

    // ソート
    return filtered.sort((a, b) => {
      const aValue = a[sortKey as keyof RetailSalesSummary]
      const bValue = b[sortKey as keyof RetailSalesSummary]
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
      return 0
    })
  }, [manufacturerFilter, modelFilter, regionFilter, searchQuery, sortKey, sortOrder])

  // 業販データの集計・フィルタリング
  const wholesaleSummaries = useMemo(() => {
    const summaries = aggregateWholesalePrices(auctionData, {
      manufacturer: manufacturerFilter !== "all" ? manufacturerFilter as Manufacturer : undefined,
      model: modelFilter !== "all" ? modelFilter : undefined,
      region: regionFilter !== "all" ? regionFilter as RegionId : undefined,
    })

    // 検索フィルター
    let filtered = summaries
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = summaries.filter(
        s => s.model.toLowerCase().includes(query) || s.grade.toLowerCase().includes(query)
      )
    }

    // ソート
    return filtered.sort((a, b) => {
      const aValue = a[sortKey as keyof WholesalePriceSummary]
      const bValue = b[sortKey as keyof WholesalePriceSummary]
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      }
      return 0
    })
  }, [manufacturerFilter, modelFilter, regionFilter, searchQuery, sortKey, sortOrder])

  // 現在のタブに応じたデータ
  const currentData = activeTab === "retail" ? retailSummaries : wholesaleSummaries
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE)
  const paginatedData = currentData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // ソートハンドラー
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("desc")
    }
    setCurrentPage(1)
  }

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />
    return sortOrder === "asc" ? (
      <TrendingUp className="ml-1 h-4 w-4" />
    ) : (
      <TrendingDown className="ml-1 h-4 w-4" />
    )
  }

  // タブ切り替え時のリセット
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "retail" | "wholesale")
    setCurrentPage(1)
    // 小売/業販で適切なデフォルトソートを設定
    if (tab === "retail") {
      setSortKey("avgPrice")
    } else {
      setSortKey("calculatedWholesalePrice")
    }
  }

  return (
    <div className="space-y-6">
      {/* タブ切り替え */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-2 bg-slate-100 dark:bg-slate-900 h-auto gap-2 p-2">
          <TabsTrigger 
            value="retail" 
            className="flex items-center justify-center gap-3 py-3 px-6 text-base font-semibold rounded-lg transition-all bg-white text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
          >
            <ShoppingBag className="h-5 w-5" />
            小売実績
          </TabsTrigger>
          <TabsTrigger 
            value="wholesale" 
            className="flex items-center justify-center gap-3 py-3 px-6 text-base font-semibold rounded-lg transition-all bg-white text-gray-700 hover:bg-gray-50 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg dark:data-[state=active]:bg-amber-600 dark:data-[state=active]:text-white"
          >
            <Store className="h-5 w-5" />
            業販価格
          </TabsTrigger>
        </TabsList>

        {/* フィルターカード */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>フィルター・検索</CardTitle>
            <CardDescription>
              {activeTab === "retail" 
                ? "小売実績データの絞り込み条件を設定" 
                : "業販価格データの絞り込み条件を設定"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>メーカー</Label>
                <Select value={manufacturerFilter} onValueChange={handleManufacturerChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {MANUFACTURERS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>車種</Label>
                <Select 
                  value={modelFilter} 
                  onValueChange={(v) => { setModelFilter(v); setCurrentPage(1); }}
                  disabled={manufacturerFilter === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={manufacturerFilter === "all" ? "メーカーを選択" : "すべて"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべて</SelectItem>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>{model}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>エリア</Label>
                <Select value={regionFilter} onValueChange={(v) => { setRegionFilter(v); setCurrentPage(1); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="すべて" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのエリア</SelectItem>
                    {REGIONS.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>車種・グレード検索</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="キーワードで検索..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 小売実績タブ */}
        <TabsContent value="retail" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>小売実績一覧</CardTitle>
                  <CardDescription>
                    全{retailSummaries.length}件のデータ
                    {regionFilter !== "all" && ` - ${getRegionName(regionFilter as RegionId)}`}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {formatPriceInMan(
                    retailSummaries.reduce((sum, s) => sum + s.avgPrice, 0) / (retailSummaries.length || 1)
                  )} 平均
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>メーカー</TableHead>
                      <TableHead>車種</TableHead>
                      <TableHead>型式</TableHead>
                      <TableHead>グレード</TableHead>
                      <TableHead>色</TableHead>
                      <TableHead>年式</TableHead>
                      <TableHead>車検</TableHead>
                      <TableHead>車検満了</TableHead>
                      <TableHead>エリア</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort("avgListingPrice")}
                        >
                          平均掲載価格
                          {getSortIcon("avgListingPrice")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort("avgPrice")}
                        >
                          成約価格
                          {getSortIcon("avgPrice")}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort("avgListingDays")}
                        >
                          掲載日数
                          {getSortIcon("avgListingDays")}
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(paginatedData as RetailSalesSummary[]).map((item, idx) => (
                      <TableRow key={`${item.manufacturer}-${item.model}-${item.grade}-${item.region}-${idx}`}>
                        <TableCell className="font-medium">{item.manufacturer}</TableCell>
                        <TableCell>{item.model}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.modelCode}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={item.grade}>
                          {item.grade}
                        </TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.year}年</TableCell>
                        <TableCell>
                          <Badge variant={item.hasInspection ? "default" : "secondary"} className="text-xs">
                            {item.hasInspection ? "有" : "無"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{item.inspectionExpiry}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getRegionName(item.region)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatPrice(item.avgListingPrice)}
                        </TableCell>
                        <TableCell className="font-semibold text-primary">
                          {formatPrice(item.avgPrice)}
                        </TableCell>
                        <TableCell>
                          <span className={item.avgListingDays <= 30 ? "text-green-600" : item.avgListingDays <= 60 ? "text-amber-600" : "text-red-600"}>
                            {item.avgListingDays}日
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                          条件に一致するデータがありません
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 業販価格タブ */}
        <TabsContent value="wholesale" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>業販価格一覧</CardTitle>
                  <CardDescription>
                    全{wholesaleSummaries.length}件のデータ（業販価格（税込） = 業販価格（税抜） x 1.1 + 15,000円）
                    {regionFilter !== "all" && ` - ${getRegionName(regionFilter as RegionId)}`}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {formatPriceInMan(
                    wholesaleSummaries.reduce((sum, s) => sum + s.calculatedWholesalePrice, 0) / (wholesaleSummaries.length || 1)
                  )} 平均
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>メーカー</TableHead>
                      <TableHead>車種</TableHead>
                      <TableHead>型式</TableHead>
                      <TableHead>グレード</TableHead>
                      <TableHead>色</TableHead>
                      <TableHead>年式</TableHead>
                      <TableHead>車検</TableHead>
                      <TableHead>車検満了</TableHead>
                      <TableHead>装備</TableHead>
                      <TableHead>エリア</TableHead>
                      <TableHead>業販価格（税抜）</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 font-semibold hover:bg-transparent"
                          onClick={() => handleSort("calculatedWholesalePrice")}
                        >
                          業販価格（税込）
                          {getSortIcon("calculatedWholesalePrice")}
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(paginatedData as WholesalePriceSummary[]).map((item, idx) => (
                      <TableRow key={`${item.manufacturer}-${item.model}-${item.grade}-${item.region}-${idx}`}>
                        <TableCell className="font-medium">{item.manufacturer}</TableCell>
                        <TableCell>{item.model}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.modelCode}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={item.grade}>
                          {item.grade}
                        </TableCell>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.year}年</TableCell>
                        <TableCell>
                          <Badge variant={item.hasInspection ? "default" : "secondary"} className="text-xs">
                            {item.hasInspection ? "有" : "無"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{item.inspectionExpiry}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge 
                              variant={item.equipment.hasSunroof ? "default" : "outline"} 
                              className={`text-xs ${item.equipment.hasSunroof ? "bg-blue-500" : "text-muted-foreground"}`}
                            >
                              SR
                            </Badge>
                            <Badge 
                              variant={item.equipment.hasLeatherSeats ? "default" : "outline"} 
                              className={`text-xs ${item.equipment.hasLeatherSeats ? "bg-amber-500" : "text-muted-foreground"}`}
                            >
                              革
                            </Badge>
                            <Badge 
                              variant={item.equipment.hasGenuineAlloy ? "default" : "outline"} 
                              className={`text-xs ${item.equipment.hasGenuineAlloy ? "bg-slate-600" : "text-muted-foreground"}`}
                            >
                              純アルミ
                            </Badge>
                            <Badge 
                              variant={item.equipment.hasNavigation ? "default" : "outline"} 
                              className={`text-xs ${item.equipment.hasNavigation ? "bg-green-500" : "text-muted-foreground"}`}
                            >
                              ナビ
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getRegionName(item.region)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatPrice(item.avgAuctionPrice)}
                        </TableCell>
                        <TableCell className="font-semibold text-primary">
                          {formatPrice(item.calculatedWholesalePrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {paginatedData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                          条件に一致するデータがありません
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {currentData.length}件中 {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(currentPage * ITEMS_PER_PAGE, currentData.length)}件を表示
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              前へ
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              次へ
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
