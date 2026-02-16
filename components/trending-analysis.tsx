"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Filter,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  X,
  ShoppingCart,
  ExternalLink,
} from "lucide-react"

const getRecommendedSpecs = (vehicle: any) => {
  return [
    {
      rank: 1,
      year: "2022年",
      grade: "エグゼクティブラウンジ",
      mileage: "1万〜3万km",
      color: "パールホワイト",
      str: 38.5,
      salesCount: 24,
      avgPrice: 4680000,
      score: 98,
      reason: "最高STR・需要旺盛・高回転率",
    },
    {
      rank: 2,
      year: "2023年",
      grade: "エグゼクティブラウンジS",
      mileage: "1万km未満",
      color: "ブラック",
      str: 36.2,
      salesCount: 18,
      avgPrice: 5120000,
      score: 95,
      reason: "高年式・低走行・高級グレード",
    },
    {
      rank: 3,
      year: "2021年",
      grade: "エグゼクティブラウンジ",
      mileage: "3万〜5万km",
      color: "パールホワイト",
      str: 34.8,
      salesCount: 22,
      avgPrice: 4250000,
      score: 93,
      reason: "コスパ良好・人気色・安定需要",
    },
    {
      rank: 4,
      year: "2022年",
      grade: "GF",
      mileage: "1万〜3万km",
      color: "ブラック",
      str: 32.1,
      salesCount: 19,
      avgPrice: 4100000,
      score: 89,
      reason: "人気グレード・適正走行・需要安定",
    },
    {
      rank: 5,
      year: "2021年",
      grade: "エグゼクティブラウンジS",
      mileage: "3万〜5万km",
      color: "ブラック",
      str: 31.5,
      salesCount: 16,
      avgPrice: 4420000,
      score: 87,
      reason: "最上級グレード・価格優位性",
    },
    {
      rank: 6,
      year: "2020年",
      grade: "エグゼクティブラウンジ",
      mileage: "3万〜5万km",
      color: "パールホワイト",
      str: 29.8,
      salesCount: 15,
      avgPrice: 3850000,
      score: 84,
      reason: "低価格帯・高STR維持",
    },
    {
      rank: 7,
      year: "2023年",
      grade: "G",
      mileage: "1万km未満",
      color: "シルバー",
      str: 28.3,
      salesCount: 12,
      avgPrice: 3920000,
      score: 81,
      reason: "新しい・低走行・手頃な価格",
    },
    {
      rank: 8,
      year: "2022年",
      grade: "GF",
      mileage: "3万〜5万km",
      color: "グレー",
      str: 27.1,
      salesCount: 14,
      avgPrice: 3680000,
      score: 78,
      reason: "バランス型・利益確保可能",
    },
    {
      rank: 9,
      year: "2021年",
      grade: "G",
      mileage: "5万〜7万km",
      color: "ブラック",
      str: 25.6,
      salesCount: 11,
      avgPrice: 3250000,
      score: 74,
      reason: "エントリー層需要・回転良好",
    },
    {
      rank: 10,
      year: "2020年",
      grade: "S",
      mileage: "5万〜7万km",
      color: "シルバー",
      str: 23.9,
      salesCount: 9,
      avgPrice: 2980000,
      score: 70,
      reason: "低価格戦略・薄利多売向き",
    },
  ]
}

const getVehicleDetail = (vehicle: any) => {
  return {
    ...vehicle,
    yearDistribution: [
      { year: "2023年", salesCount: 12, percentage: 18, str: 32.5 },
      { year: "2022年", salesCount: 18, percentage: 27, str: 28.3 },
      { year: "2021年", salesCount: 15, percentage: 22, str: 26.1 },
      { year: "2020年", salesCount: 11, percentage: 16, str: 22.8 },
      { year: "2019年", salesCount: 7, percentage: 10, str: 19.5 },
      { year: "2018年以前", salesCount: 4, percentage: 6, str: 15.2 },
    ],
    gradeDistribution: [
      { grade: "エグゼクティブラウンジS", salesCount: 15, percentage: 22, str: 35.2 },
      { grade: "エグゼクティブラウンジ", salesCount: 19, percentage: 28, str: 30.8 },
      { grade: "GF", salesCount: 14, percentage: 21, str: 26.5 },
      { grade: "G", salesCount: 12, percentage: 18, str: 24.1 },
      { grade: "S", salesCount: 7, percentage: 10, str: 20.3 },
    ],
    mileageDistribution: [
      { range: "1万km未満", salesCount: 8, percentage: 12, str: 38.5 },
      { range: "1万〜3万km", salesCount: 18, percentage: 27, str: 32.1 },
      { range: "3万〜5万km", salesCount: 16, percentage: 24, str: 28.6 },
      { range: "5万〜7万km", salesCount: 13, percentage: 19, str: 24.8 },
      { range: "7万〜10万km", salesCount: 8, percentage: 12, str: 19.5 },
      { range: "10万km以上", salesCount: 4, percentage: 6, str: 12.3 },
    ],
    colorDistribution: [
      { color: "ブラック", salesCount: 22, percentage: 33, str: 31.2 },
      { color: "パールホワイト", salesCount: 18, percentage: 27, str: 29.8 },
      { color: "シルバー", salesCount: 12, percentage: 18, str: 26.5 },
      { color: "グレー", salesCount: 9, percentage: 13, str: 24.1 },
      { color: "その他", salesCount: 6, percentage: 9, str: 18.7 },
    ],
    recommendedSpecs: getRecommendedSpecs(vehicle),
  }
}

const mockVehicles = [
  {
    rank: 1,
    make: "トヨタ",
    model: "アルファード",
    modelCode: "AGH30W",
    str: 28.5,
    listings: 234,
    sold: 67,
    avgPrice: 4250000,
    avgDays: 21,
    trend: 8.3,
    category: "国産車",
    bodyType: "ミニバン",
  },
  {
    rank: 2,
    make: "ホンダ",
    model: "ヴェゼル",
    modelCode: "RU1",
    str: 24.2,
    listings: 189,
    sold: 46,
    avgPrice: 2890000,
    avgDays: 25,
    trend: 5.1,
    category: "国産車",
    bodyType: "SUV",
  },
  {
    rank: 3,
    make: "トヨタ",
    model: "ハリアー",
    modelCode: "ZSU60W",
    str: 22.8,
    listings: 167,
    sold: 38,
    avgPrice: 3680000,
    avgDays: 28,
    trend: 3.2,
    category: "国産車",
    bodyType: "SUV",
  },
  {
    rank: 4,
    make: "メルセデス・ベンツ",
    model: "Cクラス",
    modelCode: "W205",
    str: 21.8,
    listings: 145,
    sold: 32,
    avgPrice: 4850000,
    avgDays: 35,
    trend: 4.5,
    category: "輸入車",
    bodyType: "セダン",
  },
  {
    rank: 5,
    make: "日産",
    model: "セレナ",
    modelCode: "C27",
    str: 21.5,
    listings: 198,
    sold: 43,
    avgPrice: 2650000,
    avgDays: 32,
    trend: 2.8,
    category: "国産車",
    bodyType: "ミニバン",
  },
  {
    rank: 6,
    make: "スズキ",
    model: "ハスラー",
    modelCode: "MR52S",
    str: 20.3,
    listings: 176,
    sold: 36,
    avgPrice: 1580000,
    avgDays: 27,
    trend: 6.2,
    category: "軽自動車",
    bodyType: "SUV",
  },
  {
    rank: 7,
    make: "BMW",
    model: "3シリーズ",
    modelCode: "G20",
    str: 19.8,
    listings: 132,
    sold: 26,
    avgPrice: 5200000,
    avgDays: 38,
    trend: 3.7,
    category: "輸入車",
    bodyType: "セダン",
  },
  {
    rank: 8,
    make: "マツダ",
    model: "CX-5",
    modelCode: "KF",
    str: 19.3,
    listings: 156,
    sold: 30,
    avgPrice: 2750000,
    avgDays: 35,
    trend: 1.5,
    category: "国産車",
    bodyType: "SUV",
  },
  {
    rank: 9,
    make: "ダイハツ",
    model: "タント",
    modelCode: "LA650S",
    str: 18.7,
    listings: 203,
    sold: 38,
    avgPrice: 1420000,
    avgDays: 24,
    trend: 4.9,
    category: "軽自動車",
    bodyType: "ワゴン",
  },
  {
    rank: 10,
    make: "トヨタ",
    model: "プリウス",
    modelCode: "ZVW50",
    str: 17.9,
    listings: 184,
    sold: 33,
    avgPrice: 2350000,
    avgDays: 30,
    trend: -1.2,
    category: "国産車",
    bodyType: "セダン",
  },
]

const periodOptions = [
  { value: "1week", label: "過去1週間" },
  { value: "2weeks", label: "過去2週間" },
  { value: "1month", label: "過去1ヶ月" },
  { value: "3months", label: "過去3ヶ月" },
  { value: "6months", label: "過去6ヶ月" },
  { value: "1year", label: "過去1年" },
]

const DISTRIBUTION_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(217, 91%, 60%)",
]

export function TrendingAnalysis() {
  const [locationMode, setLocationMode] = useState<"area" | "radius">("area")
  const [prefecture, setPrefecture] = useState("東京都")
  const [city, setCity] = useState("全域")
  const [radius, setRadius] = useState("10")
  const [period, setPeriod] = useState("1month")
  const [vehicleCategory, setVehicleCategory] = useState("all")
  const [maker, setMaker] = useState("all")
  const [bodyType, setBodyType] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [modalPeriod, setModalPeriod] = useState("1month")

  const getPeriodLabel = () => {
    const p = periodOptions.find((opt) => opt.value === period)
    return p ? p.label : "過去1ヶ月"
  }

  const handleVehicleClick = (vehicle: any) => {
    const detail = getVehicleDetail(vehicle)
    setSelectedVehicle(detail)
  }

  const generateSearchUrl = (spec: any) => {
    // Build search parameters based on vehicle specifications
    const params = new URLSearchParams({
      make: selectedVehicle.make,
      model: selectedVehicle.model,
      modelCode: selectedVehicle.modelCode,
      year: spec.year,
      grade: spec.grade,
      mileage: spec.mileage,
      color: spec.color,
    })

    // Symphony One Plus search URL (replace with actual URL structure)
    return `/search?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            絞り込み条件
          </CardTitle>
          <CardDescription>地域・期間・車種条件を指定して売れ筋車両を分析</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Period Filter */}
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              分析期間
            </Label>
            <div className="flex flex-wrap gap-2">
              {periodOptions.map((p) => (
                <Button
                  key={p.value}
                  variant={period === p.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod(p.value)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Location Filter */}
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              地域設定
            </Label>
            <Tabs value={locationMode} onValueChange={(v) => setLocationMode(v as "area" | "radius")}>
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="area">都道府県・市区町村</TabsTrigger>
                <TabsTrigger value="radius">半径距離</TabsTrigger>
              </TabsList>
              <TabsContent value="area" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>都道府県</Label>
                    <Select value={prefecture} onValueChange={setPrefecture}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="東京都">東京都</SelectItem>
                        <SelectItem value="神奈川県">神奈川県</SelectItem>
                        <SelectItem value="千葉県">千葉県</SelectItem>
                        <SelectItem value="埼玉県">埼玉県</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>市区町村</Label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="全域">全域</SelectItem>
                        <SelectItem value="千代田区">千代田区</SelectItem>
                        <SelectItem value="中央区">中央区</SelectItem>
                        <SelectItem value="港区">港区</SelectItem>
                        <SelectItem value="新宿区">新宿区</SelectItem>
                        <SelectItem value="渋谷区">渋谷区</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="radius" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>基準店舗</Label>
                    <Select defaultValue="main">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">オートプラザ横浜（本店）</SelectItem>
                        <SelectItem value="branch1">カーセレクト東京</SelectItem>
                        <SelectItem value="branch2">ドライブワン川崎</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>半径距離（km）</Label>
                    <Select value={radius} onValueChange={setRadius}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5km</SelectItem>
                        <SelectItem value="10">10km</SelectItem>
                        <SelectItem value="20">20km</SelectItem>
                        <SelectItem value="30">30km</SelectItem>
                        <SelectItem value="50">50km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="h-px bg-border" />

          {/* Vehicle Category */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">車両カテゴリー</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "すべて" },
                { value: "国産車", label: "国産車" },
                { value: "輸入車", label: "輸入車" },
                { value: "軽自動車", label: "軽自動車" },
                { value: "segment-all", label: "すべて", desc: "" },
                { value: "segment-A", label: "Aセグメント", desc: "軽・小型コンパクト" },
                { value: "segment-B", label: "Bセグメント", desc: "コンパクトカー" },
                { value: "segment-C", label: "Cセグメント", desc: "大型コンパクト・小型セダン" },
                { value: "segment-D", label: "Dセグメント", desc: "中型セダン・ワゴン" },
                { value: "segment-E", label: "Eセグメント", desc: "大型セダン" },
                { value: "segment-F", label: "Fセグメント", desc: "フルサイズ高級車" },
              ].map((cat) => (
                <Button
                  key={cat.value}
                  variant={vehicleCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setVehicleCategory(cat.value)}
                  className={cat.desc ? "relative group" : ""}
                >
                  {cat.label}
                  {cat.desc && (
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {cat.desc}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Detail Filters - Maker & Price */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>メーカー</Label>
              <Select value={maker} onValueChange={setMaker}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="トヨタ">トヨタ</SelectItem>
                  <SelectItem value="ホンダ">ホンダ</SelectItem>
                  <SelectItem value="日産">日産</SelectItem>
                  <SelectItem value="マツダ">マツダ</SelectItem>
                  <SelectItem value="スズキ">スズキ</SelectItem>
                  <SelectItem value="ダイハツ">ダイハツ</SelectItem>
                  <SelectItem value="メルセデス・ベンツ">メルセデス・ベンツ</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>価格帯</Label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="0-30">30万円以下</SelectItem>
                  <SelectItem value="30-50">30万円〜50万円</SelectItem>
                  <SelectItem value="50-100">50万円〜100万円</SelectItem>
                  <SelectItem value="100-150">100万円〜150万円</SelectItem>
                  <SelectItem value="150-200">150万円〜200万円</SelectItem>
                  <SelectItem value="200-250">200万円〜250万円</SelectItem>
                  <SelectItem value="250-300">250万円〜300万円</SelectItem>
                  <SelectItem value="300-400">300万円〜400万円</SelectItem>
                  <SelectItem value="400-500">400万円〜500万円</SelectItem>
                  <SelectItem value="500-600">500万円〜600万円</SelectItem>
                  <SelectItem value="600-700">600万円〜700万円</SelectItem>
                  <SelectItem value="700-800">700万円〜800万円</SelectItem>
                  <SelectItem value="800-900">800万円〜900万円</SelectItem>
                  <SelectItem value="900-1000">900万円〜1000万円</SelectItem>
                  <SelectItem value="1000-1200">1000万円〜1200万円</SelectItem>
                  <SelectItem value="1200-1400">1200万円〜1400万円</SelectItem>
                  <SelectItem value="1400-1600">1400万円〜1600万円</SelectItem>
                  <SelectItem value="1600-1800">1600万円〜1800万円</SelectItem>
                  <SelectItem value="1800-2000">1800万円〜2000万円</SelectItem>
                  <SelectItem value="2000+">2000万円以上</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Body Type Visual Grid - カーセンサー風 */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">ボディタイプから検索</Label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-8">
              {[
                { value: "軽自動車", label: "軽自動車", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <rect x="8" y="12" width="48" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <rect x="14" y="8" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="18" cy="32" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="46" cy="32" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <line x1="36" y1="12" x2="36" y2="8" stroke="currentColor" strokeWidth="1"/>
                    <line x1="36" y1="8" x2="42" y2="8" stroke="currentColor" strokeWidth="1"/>
                    <line x1="42" y1="8" x2="42" y2="12" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                )},
                { value: "コンパクト", label: "コンパクト", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M8 26 L14 14 L40 10 L52 14 L58 22 L58 28 L8 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <line x1="28" y1="12" x2="30" y2="26" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="18" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="48" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "ミニバン", label: "ミニバン", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M6 28 L6 12 Q6 8 10 8 L44 8 L54 14 L58 20 L58 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <line x1="20" y1="8" x2="20" y2="24" stroke="currentColor" strokeWidth="1"/>
                    <line x1="36" y1="8" x2="38" y2="24" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="16" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="48" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "ワゴン", label: "ステーション\nワゴン", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M6 28 L6 16 L10 10 L42 8 L52 14 L58 22 L58 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <line x1="22" y1="10" x2="24" y2="24" stroke="currentColor" strokeWidth="1"/>
                    <line x1="40" y1="8" x2="42" y2="24" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="16" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="48" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "SUV", label: "SUV・クロカン", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M6 28 L6 16 L12 10 L38 8 L50 12 L58 18 L58 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <line x1="24" y1="9" x2="26" y2="22" stroke="currentColor" strokeWidth="1"/>
                    <line x1="40" y1="9" x2="42" y2="22" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="16" cy="30" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <circle cx="48" cy="30" r="5" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                )},
                { value: "セダン", label: "セダン", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M4 28 L4 22 L14 14 L26 10 L40 10 L52 14 L58 22 L60 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <line x1="24" y1="10" x2="24" y2="24" stroke="currentColor" strokeWidth="1"/>
                    <line x1="42" y1="11" x2="42" y2="24" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="16" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="48" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "クーペ", label: "クーペ", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M4 28 L6 22 L18 10 L38 8 L52 14 L58 22 L60 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <line x1="30" y1="9" x2="30" y2="24" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="16" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="48" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "オープン", label: "オープンカー", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M4 28 L6 22 L18 16 L38 14 L52 18 L58 22 L60 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <path d="M22 16 L24 12 L32 11" stroke="currentColor" strokeWidth="1" fill="none"/>
                    <circle cx="16" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="48" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "ハッチバック", label: "ハッチバック", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M4 28 L6 22 L16 12 L38 10 L48 12 L56 18 L56 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <line x1="30" y1="10" x2="30" y2="24" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="16" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="46" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "ピックアップ", label: "ピックアップ\nトラック", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M4 28 L4 12 Q4 8 8 8 L28 8 L28 18 L54 18 L58 22 L58 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <line x1="28" y1="8" x2="28" y2="28" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="14" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="48" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "商用車", label: "商用車・バン", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <rect x="4" y="8" width="52" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <line x1="36" y1="8" x2="36" y2="30" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="14" cy="32" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="46" cy="32" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "トラック", label: "トラック", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <rect x="2" y="10" width="24" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M26 16 L50 16 L58 22 L58 28 L26 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <circle cx="14" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="48" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "福祉車両", label: "福祉車両", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M8 28 L8 14 L14 8 L42 8 L52 14 L56 22 L56 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <circle cx="32" cy="18" r="5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <line x1="32" y1="13" x2="32" y2="23" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="27" y1="18" x2="37" y2="18" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="16" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="46" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "キャンピング", label: "キャンピング\nカー", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M4 28 L4 8 Q4 4 8 4 L42 4 Q46 4 46 8 L46 16 L56 16 L58 22 L58 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <rect x="10" y="10" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
                    <rect x="24" y="10" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
                    <circle cx="14" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="48" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "ハイブリッド", label: "ハイブリッド", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <path d="M4 28 L6 22 L16 12 L38 10 L50 14 L58 22 L60 28 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
                    <path d="M30 14 L34 18 L28 22 L32 26" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <circle cx="16" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="48" cy="30" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                )},
                { value: "その他", label: "その他", icon: (
                  <svg viewBox="0 0 64 40" fill="none" className="h-8 w-14">
                    <circle cx="20" cy="20" r="3" fill="currentColor"/>
                    <circle cx="32" cy="20" r="3" fill="currentColor"/>
                    <circle cx="44" cy="20" r="3" fill="currentColor"/>
                  </svg>
                )},
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setBodyType(bodyType === type.value ? "all" : type.value)}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all hover:bg-muted/60 ${
                    bodyType === type.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex h-10 w-full items-center justify-center">{type.icon}</span>
                  <span className="text-[10px] leading-tight text-center font-medium whitespace-pre-line">{type.label}</span>
                </button>
              ))}
            </div>
            {bodyType !== "all" && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  {bodyType}
                  <button type="button" onClick={() => setBodyType("all")} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">
              <TrendingUp className="mr-2 h-4 w-4" />
              分析実行
            </Button>
            <Button variant="outline">条件クリア</Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>売れ筋ランキング（STR順）</CardTitle>
              <CardDescription>
                {getPeriodLabel()} -{" "}
                {locationMode === "area"
                  ? `${prefecture} ${city !== "全域" ? city : ""}`
                  : `基準店舗から半径${radius}km圏内`}
                {vehicleCategory !== "all" && ` - ${vehicleCategory}`}
              </CardDescription>
            </div>
            <Badge variant="outline">{mockVehicles.length}件</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm text-muted-foreground">
                  <th className="pb-3 text-left font-medium">順位</th>
                  <th className="pb-3 text-left font-medium">メーカー</th>
                  <th className="pb-3 text-left font-medium">車種・モデル</th>
                  <th className="pb-3 text-left font-medium">型式</th>
                  <th className="pb-3 text-left font-medium">カテゴリー</th>
                  <th className="pb-3 text-right font-medium">STR</th>
                  <th className="pb-3 text-right font-medium">掲載数</th>
                  <th className="pb-3 text-right font-medium">売却数</th>
                  <th className="pb-3 text-right font-medium">平均価格</th>
                  <th className="pb-3 text-right font-medium">平均日数</th>
                  <th className="pb-3 text-right font-medium">トレンド</th>
                </tr>
              </thead>
              <tbody>
                {mockVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.rank}
                    className="border-b border-border/50 hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleVehicleClick(vehicle)}
                  >
                    <td className="py-4">
                      <Badge variant="outline" className="w-10 justify-center font-bold">
                        {vehicle.rank}
                      </Badge>
                    </td>
                    <td className="py-4 text-muted-foreground">{vehicle.make}</td>
                    <td className="py-4 font-semibold">{vehicle.model}</td>
                    <td className="py-4 text-sm text-muted-foreground font-mono">{vehicle.modelCode}</td>
                    <td className="py-4">
                      <Badge variant="secondary">{vehicle.category}</Badge>
                    </td>
                    <td className="py-4 text-right">
                      <span className="font-bold text-xl text-primary">{vehicle.str.toFixed(1)}%</span>
                    </td>
                    <td className="py-4 text-right text-muted-foreground">{vehicle.listings}台</td>
                    <td className="py-4 text-right font-medium">{vehicle.sold}台</td>
                    <td className="py-4 text-right text-muted-foreground">
                      ¥{(vehicle.avgPrice / 10000).toFixed(0)}万
                    </td>
                    <td className="py-4 text-right text-muted-foreground">{vehicle.avgDays}日</td>
                    <td className="py-4 text-right">
                      <Badge variant={vehicle.trend > 0 ? "default" : "secondary"}>
                        {vehicle.trend > 0 ? (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        )}
                        {Math.abs(vehicle.trend).toFixed(1)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-background shadow-lg">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedVehicle.make} {selectedVehicle.model}
                </h2>
                <p className="text-sm text-muted-foreground">型式: {selectedVehicle.modelCode}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedVehicle(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6 p-6">
              {/* Summary Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>STR</CardDescription>
                    <CardTitle className="text-3xl text-primary">{selectedVehicle.str.toFixed(1)}%</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>掲載数</CardDescription>
                    <CardTitle className="text-3xl">{selectedVehicle.listings}台</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>売却数</CardDescription>
                    <CardTitle className="text-3xl">{selectedVehicle.sold}台</CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>平均価格</CardDescription>
                    <CardTitle className="text-3xl">{(selectedVehicle.avgPrice / 10000).toFixed(0)}万円</CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">売れ筋分布</h3>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">分析期間:</Label>
                  <div className="flex gap-1">
                    {periodOptions.map((p) => (
                      <Button
                        key={p.value}
                        variant={modalPeriod === p.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setModalPeriod(p.value)}
                      >
                        {p.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Matrix Tables for Distribution */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Year Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>年式別 売れ筋分布</CardTitle>
                    <CardDescription>年式ごとの販売台数・STRと構成比</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-sm">
                            <th className="pb-3 text-left font-medium">年式</th>
                            <th className="pb-3 text-right font-medium">販売台数</th>
                            <th className="pb-3 text-right font-medium">構成比</th>
                            <th className="pb-3 text-right font-medium">STR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedVehicle.yearDistribution.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="py-3 font-medium">{item.year}</td>
                              <td className="py-3 text-right">
                                <span className="text-sm font-semibold">{item.salesCount}台</span>
                              </td>
                              <td className="py-3 text-right text-muted-foreground">{item.percentage.toFixed(1)}%</td>
                              <td className="py-3 text-right">
                                <span className="text-sm font-semibold text-primary">{item.str.toFixed(1)}%</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Grade Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>グレード別 売れ筋分布</CardTitle>
                    <CardDescription>グレードごとの販売台数・STRと構成比</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-sm">
                            <th className="pb-3 text-left font-medium">グレード</th>
                            <th className="pb-3 text-right font-medium">販売台数</th>
                            <th className="pb-3 text-right font-medium">構成比</th>
                            <th className="pb-3 text-right font-medium">STR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedVehicle.gradeDistribution.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="py-3 font-medium">{item.grade}</td>
                              <td className="py-3 text-right">
                                <span className="text-sm font-semibold">{item.salesCount}台</span>
                              </td>
                              <td className="py-3 text-right text-muted-foreground">{item.percentage.toFixed(1)}%</td>
                              <td className="py-3 text-right">
                                <span className="text-sm font-semibold text-primary">{item.str.toFixed(1)}%</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Mileage Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>走行距離別 売れ筋分布</CardTitle>
                    <CardDescription>走行距離帯ごとの販売台数・STRと構成比</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-sm">
                            <th className="pb-3 text-left font-medium">走行距離</th>
                            <th className="pb-3 text-right font-medium">販売台数</th>
                            <th className="pb-3 text-right font-medium">構成比</th>
                            <th className="pb-3 text-right font-medium">STR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedVehicle.mileageDistribution.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="py-3 font-medium">{item.range}</td>
                              <td className="py-3 text-right">
                                <span className="text-sm font-semibold">{item.salesCount}台</span>
                              </td>
                              <td className="py-3 text-right text-muted-foreground">{item.percentage.toFixed(1)}%</td>
                              <td className="py-3 text-right">
                                <span className="text-sm font-semibold text-primary">{item.str.toFixed(1)}%</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Color Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>色別 売れ筋分布</CardTitle>
                    <CardDescription>ボディーカラーごとの販売台数・STRと構成比</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b text-sm">
                            <th className="pb-3 text-left font-medium">色</th>
                            <th className="pb-3 text-right font-medium">販売台数</th>
                            <th className="pb-3 text-right font-medium">構成比</th>
                            <th className="pb-3 text-right font-medium">STR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedVehicle.colorDistribution.map((item: any, idx: number) => (
                            <tr key={idx} className="border-b border-border/50">
                              <td className="py-3 font-medium">{item.color}</td>
                              <td className="py-3 text-right">
                                <span className="text-sm font-semibold">{item.salesCount}台</span>
                              </td>
                              <td className="py-3 text-right text-muted-foreground">{item.percentage.toFixed(1)}%</td>
                              <td className="py-3 text-right">
                                <span className="text-sm font-semibold text-primary">{item.str.toFixed(1)}%</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    仕入れ推奨車両ランキング
                  </CardTitle>
                  <CardDescription>
                    年式・グレード・走行距離・色を総合評価した推奨スペック（{selectedVehicle.make}{" "}
                    {selectedVehicle.model}）
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-sm text-muted-foreground">
                          <th className="pb-3 text-left font-medium">順位</th>
                          <th className="pb-3 text-left font-medium">年式</th>
                          <th className="pb-3 text-left font-medium">グレード</th>
                          <th className="pb-3 text-left font-medium">走行距離</th>
                          <th className="pb-3 text-left font-medium">色</th>
                          <th className="pb-3 text-right font-medium">STR</th>
                          <th className="pb-3 text-right font-medium">販売台数</th>
                          <th className="pb-3 text-right font-medium">平均価格</th>
                          <th className="pb-3 text-right font-medium">推奨スコア</th>
                          <th className="pb-3 text-left font-medium">推奨理由</th>
                          <th className="pb-3 text-center font-medium">在庫検索</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedVehicle.recommendedSpecs.map((spec: any) => (
                          <tr key={spec.rank} className="border-b border-border/50 hover:bg-muted/50">
                            <td className="py-4">
                              <Badge
                                variant="outline"
                                className={`w-10 justify-center font-bold ${
                                  spec.rank === 1
                                    ? "bg-yellow-500/10 border-yellow-500 text-yellow-600"
                                    : spec.rank === 2
                                      ? "bg-gray-400/10 border-gray-400 text-gray-600"
                                      : spec.rank === 3
                                        ? "bg-orange-500/10 border-orange-500 text-orange-600"
                                        : ""
                                }`}
                              >
                                {spec.rank}
                              </Badge>
                            </td>
                            <td className="py-4 font-medium">{spec.year}</td>
                            <td className="py-4 font-medium">{spec.grade}</td>
                            <td className="py-4 text-muted-foreground">{spec.mileage}</td>
                            <td className="py-4">{spec.color}</td>
                            <td className="py-4 text-right">
                              <span className="font-bold text-lg text-primary">{spec.str.toFixed(1)}%</span>
                            </td>
                            <td className="py-4 text-right text-muted-foreground">{spec.salesCount}台</td>
                            <td className="py-4 text-right font-semibold">¥{(spec.avgPrice / 10000).toFixed(0)}万</td>
                            <td className="py-4 text-right">
                              <Badge variant="default" className="bg-primary/90 font-bold">
                                {spec.score}点
                              </Badge>
                            </td>
                            <td className="py-4 text-sm text-primary">{spec.reason}</td>
                            <td className="py-4 text-center">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1 bg-transparent"
                                onClick={() => {
                                  const searchUrl = generateSearchUrl(spec)
                                  window.open(searchUrl, "_blank")
                                }}
                              >
                                <ExternalLink className="h-3 w-3" />
                                検索
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
