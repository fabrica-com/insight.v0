"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Calendar,
  Car,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Filter,
  Star,
  Award,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts"

// メーカーデータ
const makers = [
  { id: "all", name: "すべて" },
  { id: "toyota", name: "トヨタ" },
  { id: "honda", name: "ホンダ" },
  { id: "nissan", name: "日産" },
  { id: "mazda", name: "マツダ" },
  { id: "subaru", name: "スバル" },
  { id: "mitsubishi", name: "三菱" },
  { id: "suzuki", name: "スズキ" },
  { id: "daihatsu", name: "ダイハツ" },
  { id: "lexus", name: "レクサス" },
  { id: "mercedes", name: "メルセデス・ベンツ" },
  { id: "bmw", name: "BMW" },
  { id: "audi", name: "アウディ" },
]

// 車種データ（メーカー別）
const vehicleTypes: Record<string, { id: string; name: string }[]> = {
  toyota: [
    { id: "prius", name: "プリウス" },
    { id: "alphard", name: "アルファード" },
    { id: "vellfire", name: "ヴェルファイア" },
    { id: "crown", name: "クラウン" },
    { id: "harrier", name: "ハリアー" },
    { id: "landcruiser", name: "ランドクルーザー" },
    { id: "rav4", name: "RAV4" },
    { id: "yaris", name: "ヤリス" },
    { id: "corolla", name: "カローラ" },
    { id: "sienta", name: "シエンタ" },
  ],
  honda: [
    { id: "nbox", name: "N-BOX" },
    { id: "freed", name: "フリード" },
    { id: "vezel", name: "ヴェゼル" },
    { id: "stepwgn", name: "ステップワゴン" },
    { id: "fit", name: "フィット" },
  ],
  nissan: [
    { id: "note", name: "ノート" },
    { id: "serena", name: "セレナ" },
    { id: "xtrail", name: "エクストレイル" },
    { id: "kicks", name: "キックス" },
  ],
  lexus: [
    { id: "rx", name: "RX" },
    { id: "nx", name: "NX" },
    { id: "lx", name: "LX" },
    { id: "is", name: "IS" },
  ],
  mercedes: [
    { id: "cclass", name: "Cクラス" },
    { id: "eclass", name: "Eクラス" },
    { id: "gclass", name: "Gクラス" },
    { id: "gle", name: "GLE" },
  ],
  bmw: [
    { id: "3series", name: "3シリーズ" },
    { id: "5series", name: "5シリーズ" },
    { id: "x3", name: "X3" },
    { id: "x5", name: "X5" },
  ],
}

// モデルデータ（車種別）
const models: Record<string, { id: string; name: string; years: string }[]> = {
  prius: [
    { id: "60series", name: "60系", years: "2023年〜" },
    { id: "50series", name: "50系", years: "2015年〜2023年" },
    { id: "30series", name: "30系", years: "2009年〜2015年" },
  ],
  alphard: [
    { id: "40series", name: "40系", years: "2023年〜" },
    { id: "30series", name: "30系", years: "2015年〜2023年" },
    { id: "20series", name: "20系", years: "2008年〜2015年" },
  ],
  vellfire: [
    { id: "40series", name: "40系", years: "2023年〜" },
    { id: "30series", name: "30系", years: "2015年〜2023年" },
  ],
  crown: [
    { id: "crossover", name: "クロスオーバー", years: "2022年〜" },
    { id: "220series", name: "220系", years: "2018年〜2022年" },
    { id: "210series", name: "210系", years: "2012年〜2018年" },
  ],
  harrier: [
    { id: "80series", name: "80系", years: "2020年〜" },
    { id: "60series", name: "60系", years: "2013年〜2020年" },
  ],
  landcruiser: [
    { id: "300series", name: "300系", years: "2021年〜" },
    { id: "200series", name: "200系", years: "2007年〜2021年" },
  ],
  nbox: [
    { id: "jf5", name: "JF5/6型", years: "2023年〜" },
    { id: "jf3", name: "JF3/4型", years: "2017年〜2023年" },
  ],
  serena: [
    { id: "c28", name: "C28型", years: "2022年〜" },
    { id: "c27", name: "C27型", years: "2016年〜2022年" },
  ],
  rx: [
    { id: "al25", name: "AL25型", years: "2022年〜" },
    { id: "al20", name: "AL20型", years: "2015年〜2022年" },
  ],
}

// 年式データ（モデル別）
const modelYears: Record<string, { id: string; year: string }[]> = {
  "60series": [
    { id: "2024", year: "2024年" },
    { id: "2023", year: "2023年" },
  ],
  "50series": [
    { id: "2023", year: "2023年" },
    { id: "2022", year: "2022年" },
    { id: "2021", year: "2021年" },
    { id: "2020", year: "2020年" },
    { id: "2019", year: "2019年" },
    { id: "2018", year: "2018年" },
    { id: "2017", year: "2017年" },
    { id: "2016", year: "2016年" },
    { id: "2015", year: "2015年" },
  ],
  "30series": [
    { id: "2015", year: "2015年" },
    { id: "2014", year: "2014年" },
    { id: "2013", year: "2013年" },
    { id: "2012", year: "2012年" },
    { id: "2011", year: "2011年" },
    { id: "2010", year: "2010年" },
    { id: "2009", year: "2009年" },
  ],
  "40series": [
    { id: "2024", year: "2024年" },
    { id: "2023", year: "2023年" },
  ],
  "20series": [
    { id: "2015", year: "2015年" },
    { id: "2014", year: "2014年" },
    { id: "2013", year: "2013年" },
    { id: "2012", year: "2012年" },
    { id: "2011", year: "2011年" },
    { id: "2010", year: "2010年" },
    { id: "2009", year: "2009年" },
    { id: "2008", year: "2008年" },
  ],
  "80series": [
    { id: "2024", year: "2024年" },
    { id: "2023", year: "2023年" },
    { id: "2022", year: "2022年" },
    { id: "2021", year: "2021年" },
    { id: "2020", year: "2020年" },
  ],
  "60series": [
    { id: "2020", year: "2020年" },
    { id: "2019", year: "2019年" },
    { id: "2018", year: "2018年" },
    { id: "2017", year: "2017年" },
    { id: "2016", year: "2016年" },
    { id: "2015", year: "2015年" },
    { id: "2014", year: "2014年" },
    { id: "2013", year: "2013年" },
  ],
  "300series": [
    { id: "2024", year: "2024年" },
    { id: "2023", year: "2023年" },
    { id: "2022", year: "2022年" },
    { id: "2021", year: "2021年" },
  ],
  "200series": [
    { id: "2021", year: "2021年" },
    { id: "2020", year: "2020年" },
    { id: "2019", year: "2019年" },
    { id: "2018", year: "2018年" },
    { id: "2017", year: "2017年" },
    { id: "2016", year: "2016年" },
    { id: "2015", year: "2015年" },
    { id: "2014", year: "2014年" },
    { id: "2013", year: "2013年" },
    { id: "2012", year: "2012年" },
    { id: "2011", year: "2011年" },
    { id: "2010", year: "2010年" },
    { id: "2009", year: "2009年" },
    { id: "2008", year: "2008年" },
    { id: "2007", year: "2007年" },
  ],
  "jf5": [
    { id: "2024", year: "2024年" },
    { id: "2023", year: "2023年" },
  ],
  "jf3": [
    { id: "2023", year: "2023年" },
    { id: "2022", year: "2022年" },
    { id: "2021", year: "2021年" },
    { id: "2020", year: "2020年" },
    { id: "2019", year: "2019年" },
    { id: "2018", year: "2018年" },
    { id: "2017", year: "2017年" },
  ],
  "c28": [
    { id: "2024", year: "2024年" },
    { id: "2023", year: "2023年" },
    { id: "2022", year: "2022年" },
  ],
  "c27": [
    { id: "2022", year: "2022年" },
    { id: "2021", year: "2021年" },
    { id: "2020", year: "2020年" },
    { id: "2019", year: "2019年" },
    { id: "2018", year: "2018年" },
    { id: "2017", year: "2017年" },
    { id: "2016", year: "2016年" },
  ],
  "al25": [
    { id: "2024", year: "2024年" },
    { id: "2023", year: "2023年" },
    { id: "2022", year: "2022年" },
  ],
  "al20": [
    { id: "2022", year: "2022年" },
    { id: "2021", year: "2021年" },
    { id: "2020", year: "2020年" },
    { id: "2019", year: "2019年" },
    { id: "2018", year: "2018年" },
    { id: "2017", year: "2017年" },
    { id: "2016", year: "2016年" },
    { id: "2015", year: "2015年" },
  ],
  "crossover": [
    { id: "2024", year: "2024年" },
    { id: "2023", year: "2023年" },
    { id: "2022", year: "2022年" },
  ],
  "220series": [
    { id: "2022", year: "2022年" },
    { id: "2021", year: "2021年" },
    { id: "2020", year: "2020年" },
    { id: "2019", year: "2019年" },
    { id: "2018", year: "2018年" },
  ],
  "210series": [
    { id: "2018", year: "2018年" },
    { id: "2017", year: "2017年" },
    { id: "2016", year: "2016年" },
    { id: "2015", year: "2015年" },
    { id: "2014", year: "2014年" },
    { id: "2013", year: "2013年" },
    { id: "2012", year: "2012年" },
  ],
}

// 色系統データ
const colors = [
  { id: "all", name: "すべて" },
  { id: "white", name: "ホワイト" },
  { id: "black", name: "ブラック" },
  { id: "silver", name: "シルバー" },
  { id: "gray", name: "グレー" },
  { id: "red", name: "レッド" },
  { id: "blue", name: "ブルー" },
  { id: "brown", name: "ブラウン" },
  { id: "beige", name: "ベージュ" },
]

// 地域データ
const regions = [
  { id: "all", name: "すべて" },
  { id: "hokkaido", name: "北海道" },
  { id: "tohoku", name: "東北" },
  { id: "kanto", name: "関東" },
  { id: "chubu", name: "中部" },
  { id: "kansai", name: "関西" },
  { id: "chugoku", name: "中国" },
  { id: "shikoku", name: "四国" },
  { id: "kyushu", name: "九州" },
]

// グレードデータ（モデル別）
const grades: Record<string, { id: string; name: string }[]> = {
  "60series": [
    { id: "s", name: "S" },
    { id: "a", name: "A" },
    { id: "a-premium", name: "A Premium" },
  ],
  "50series": [
    { id: "l", name: "L" },
    { id: "s", name: "S" },
    { id: "a", name: "A" },
    { id: "a-premium", name: "A Premium" },
  ],
  "30series": [
    { id: "l", name: "L" },
    { id: "s", name: "S" },
    { id: "g", name: "G" },
  ],
  "40series": [
    { id: "x", name: "X" },
    { id: "g-f-package", name: "G F Package" },
    { id: "executive-lounge", name: "Executive Lounge" },
  ],
  "20series": [
    { id: "x", name: "X" },
    { id: "g", name: "G" },
    { id: "g-f-package", name: "G F Package" },
  ],
  "80series": [
    { id: "s", name: "S" },
    { id: "g", name: "G" },
    { id: "z", name: "Z" },
  ],
  "60series": [
    { id: "s", name: "S" },
    { id: "g", name: "G" },
    { id: "premium", name: "Premium" },
  ],
  "300series": [
    { id: "gx", name: "GX" },
    { id: "zx", name: "ZX" },
  ],
  "200series": [
    { id: "vx", name: "VX" },
    { id: "tx", name: "TX" },
    { id: "zx", name: "ZX" },
  ],
  "jf5": [
    { id: "g", name: "G" },
    { id: "g-ex", name: "G EX" },
    { id: "l", name: "L" },
  ],
  "jf3": [
    { id: "g", name: "G" },
    { id: "g-ex", name: "G EX" },
    { id: "g-ex-hev", name: "G EX HEV" },
  ],
  "c28": [
    { id: "x", name: "X" },
    { id: "hv-x", name: "HV X" },
    { id: "luxury", name: "Luxury" },
  ],
  "c27": [
    { id: "x", name: "X" },
    { id: "g", name: "G" },
    { id: "highway-star", name: "Highway Star" },
  ],
  "al25": [
    { id: "version-l", name: "Version L" },
    { id: "version-f", name: "Version F" },
    { id: "luxury", name: "Luxury" },
  ],
  "al20": [
    { id: "version-l", name: "Version L" },
    { id: "version-f", name: "Version F" },
  ],
  "crossover": [
    { id: "g", name: "G" },
    { id: "z", name: "Z" },
    { id: "z-premium", name: "Z Premium" },
  ],
  "220series": [
    { id: "s", name: "S" },
    { id: "s-prize", name: "S Prize" },
    { id: "g", name: "G" },
  ],
  "210series": [
    { id: "s", name: "S" },
    { id: "rs", name: "RS" },
    { id: "g", name: "G" },
  ],
}

// 相場データ
const marketPriceData = [
  {
    id: 1,
    maker: "トヨタ",
    vehicleType: "アルファード",
    model: "40系",
    avgPrice: 7850000,
    minPrice: 6980000,
    maxPrice: 9500000,
    priceChange: 2.3,
    volume: 1245,
    resaleRate: 92.5,
    trend: "up",
    popularity: 98,
  },
  {
    id: 2,
    maker: "トヨタ",
    vehicleType: "アルファード",
    model: "30系",
    avgPrice: 4280000,
    minPrice: 2980000,
    maxPrice: 5800000,
    priceChange: -1.2,
    volume: 3420,
    resaleRate: 78.5,
    trend: "down",
    popularity: 95,
  },
  {
    id: 3,
    maker: "トヨタ",
    vehicleType: "プリウス",
    model: "60系",
    avgPrice: 3650000,
    minPrice: 3200000,
    maxPrice: 4500000,
    priceChange: 1.8,
    volume: 890,
    resaleRate: 88.2,
    trend: "up",
    popularity: 85,
  },
  {
    id: 4,
    maker: "トヨタ",
    vehicleType: "プリウス",
    model: "50系",
    avgPrice: 2180000,
    minPrice: 1480000,
    maxPrice: 2980000,
    priceChange: -2.5,
    volume: 4560,
    resaleRate: 65.3,
    trend: "down",
    popularity: 82,
  },
  {
    id: 5,
    maker: "トヨタ",
    vehicleType: "ランドクルーザー",
    model: "300系",
    avgPrice: 9800000,
    minPrice: 8500000,
    maxPrice: 12500000,
    priceChange: 5.2,
    volume: 320,
    resaleRate: 105.8,
    trend: "up",
    popularity: 99,
  },
  {
    id: 6,
    maker: "トヨタ",
    vehicleType: "ハリアー",
    model: "80系",
    avgPrice: 3980000,
    minPrice: 3200000,
    maxPrice: 4800000,
    priceChange: 0.5,
    volume: 1890,
    resaleRate: 82.4,
    trend: "stable",
    popularity: 88,
  },
  {
    id: 7,
    maker: "レクサス",
    vehicleType: "RX",
    model: "AL25型",
    avgPrice: 8950000,
    minPrice: 7800000,
    maxPrice: 11200000,
    priceChange: 3.1,
    volume: 450,
    resaleRate: 91.2,
    trend: "up",
    popularity: 92,
  },
  {
    id: 8,
    maker: "ホンダ",
    vehicleType: "N-BOX",
    model: "JF5/6型",
    avgPrice: 1780000,
    minPrice: 1480000,
    maxPrice: 2180000,
    priceChange: 1.2,
    volume: 5670,
    resaleRate: 85.6,
    trend: "up",
    popularity: 96,
  },
  {
    id: 9,
    maker: "日産",
    vehicleType: "セレナ",
    model: "C28型",
    avgPrice: 3450000,
    minPrice: 2980000,
    maxPrice: 4200000,
    priceChange: 0.8,
    volume: 1230,
    resaleRate: 79.8,
    trend: "stable",
    popularity: 84,
  },
  {
    id: 10,
    maker: "トヨタ",
    vehicleType: "ヴェルファイア",
    model: "40系",
    avgPrice: 8200000,
    minPrice: 7200000,
    maxPrice: 10000000,
    priceChange: 2.8,
    volume: 980,
    resaleRate: 93.8,
    trend: "up",
    popularity: 97,
  },
  {
    id: 11,
    maker: "トヨタ",
    vehicleType: "クラウン",
    model: "クロスオーバー",
    avgPrice: 5650000,
    minPrice: 4800000,
    maxPrice: 6800000,
    priceChange: -0.5,
    volume: 720,
    resaleRate: 76.2,
    trend: "down",
    popularity: 78,
  },
  {
    id: 12,
    maker: "メルセデス・ベンツ",
    vehicleType: "Gクラス",
    model: "W463",
    avgPrice: 15800000,
    minPrice: 12000000,
    maxPrice: 22000000,
    priceChange: 4.5,
    volume: 180,
    resaleRate: 98.5,
    trend: "up",
    popularity: 94,
  },
]

// 価格推移データ
const generatePriceHistory = (basePrice: number, trend: string) => {
  const months = ["8月", "9月", "10月", "11月", "12月", "1月"]
  const data = []
  let price = basePrice * (trend === "up" ? 0.95 : trend === "down" ? 1.05 : 1)

  for (const month of months) {
    const change = trend === "up" ? 1.01 : trend === "down" ? 0.99 : 1 + (Math.random() - 0.5) * 0.01
    price = price * change
    data.push({
      month,
      price: Math.round(price),
      volume: Math.floor(Math.random() * 500) + 100,
    })
  }
  return data
}

// リセールバリューランキングデータ
const resaleRankingData = [
  { rank: 1, maker: "トヨタ", vehicleType: "ランドクルーザー", model: "300系", resaleRate: 105.8, trend: "up" },
  { rank: 2, maker: "メルセデス・ベンツ", vehicleType: "Gクラス", model: "W463", resaleRate: 98.5, trend: "up" },
  { rank: 3, maker: "トヨタ", vehicleType: "ヴェルファイア", model: "40系", resaleRate: 93.8, trend: "up" },
  { rank: 4, maker: "トヨタ", vehicleType: "アルファード", model: "40系", resaleRate: 92.5, trend: "up" },
  { rank: 5, maker: "レクサス", vehicleType: "RX", model: "AL25型", resaleRate: 91.2, trend: "up" },
  { rank: 6, maker: "トヨタ", vehicleType: "プリウス", model: "60系", resaleRate: 88.2, trend: "up" },
  { rank: 7, maker: "ホンダ", vehicleType: "N-BOX", model: "JF5/6型", resaleRate: 85.6, trend: "up" },
  { rank: 8, maker: "トヨタ", vehicleType: "ハリアー", model: "80系", resaleRate: 82.4, trend: "stable" },
  { rank: 9, maker: "日産", vehicleType: "セレナ", model: "C28型", resaleRate: 79.8, trend: "stable" },
  { rank: 10, maker: "トヨタ", vehicleType: "アルファード", model: "30系", resaleRate: 78.5, trend: "down" },
]

export function MarketTrendsAnalysis() {
  const [selectedMaker, setSelectedMaker] = useState("all")
  const [selectedVehicleType, setSelectedVehicleType] = useState("all")
  const [selectedModel, setSelectedModel] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedColor, setSelectedColor] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"price" | "resale" | "volume" | "change">("resale")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedVehicle, setSelectedVehicle] = useState<(typeof marketPriceData)[0] | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  // フィルタリングされた車種リスト
  const availableVehicleTypes = useMemo(() => {
    if (selectedMaker === "all") return []
    return vehicleTypes[selectedMaker] || []
  }, [selectedMaker])

  // フィルタリングされたモデルリスト
  const availableModels = useMemo(() => {
    if (selectedVehicleType === "all") return []
    return models[selectedVehicleType] || []
  }, [selectedVehicleType])

  // フィルタリングされた年式リスト
  const availableYears = useMemo(() => {
    if (selectedModel === "all") return []
    return modelYears[selectedModel] || []
  }, [selectedModel])

  // フィルタリングされたグレードリスト
  const availableGrades = useMemo(() => {
    if (selectedModel === "all") return []
    return grades[selectedModel] || []
  }, [selectedModel])

  // フィルタリングとソート
  const filteredData = useMemo(() => {
    let data = [...marketPriceData]

    // メーカーフィルター
    if (selectedMaker !== "all") {
      const makerName = makers.find((m) => m.id === selectedMaker)?.name
      data = data.filter((v) => v.maker === makerName)
    }

    // 車種フィルター
    if (selectedVehicleType !== "all") {
      const vehicleTypeName = availableVehicleTypes.find((v) => v.id === selectedVehicleType)?.name
      data = data.filter((v) => v.vehicleType === vehicleTypeName)
    }

    // モデルフィルター
    if (selectedModel !== "all") {
      const modelName = availableModels.find((m) => m.id === selectedModel)?.name
      data = data.filter((v) => v.model === modelName)
    }

    // 検索フィルター
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      data = data.filter(
        (v) =>
          v.maker.toLowerCase().includes(query) ||
          v.vehicleType.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query)
      )
    }

    // ソート
    data.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "price":
          comparison = a.avgPrice - b.avgPrice
          break
        case "resale":
          comparison = a.resaleRate - b.resaleRate
          break
        case "volume":
          comparison = a.volume - b.volume
          break
        case "change":
          comparison = a.priceChange - b.priceChange
          break
      }
      return sortOrder === "desc" ? -comparison : comparison
    })

    return data
  }, [
    selectedMaker,
    selectedVehicleType,
    selectedModel,
    selectedYear,
    selectedColor,
    selectedRegion,
    selectedGrade,
    searchQuery,
    sortBy,
    sortOrder,
    availableVehicleTypes,
    availableModels,
  ])

  const handleVehicleClick = (vehicle: (typeof marketPriceData)[0]) => {
    setSelectedVehicle(vehicle)
    setDetailModalOpen(true)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-emerald-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(0)}万円`
    }
    return `¥${price.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* フィルターセクション */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              絞り込み条件
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 検索 */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="車種名で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* メーカー */}
            <Select
              value={selectedMaker}
              onValueChange={(value) => {
                setSelectedMaker(value)
                setSelectedVehicleType("all")
                setSelectedModel("all")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="メーカー" />
              </SelectTrigger>
              <SelectContent>
                {makers.map((maker) => (
                  <SelectItem key={maker.id} value={maker.id}>
                    {maker.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 車種 */}
            <Select
              value={selectedVehicleType}
              onValueChange={(value) => {
                setSelectedVehicleType(value)
                setSelectedModel("all")
              }}
              disabled={selectedMaker === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="車種" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {availableVehicleTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* モデル */}
            <Select
              value={selectedModel}
              onValueChange={(value) => {
                setSelectedModel(value)
                setSelectedYear("all")
                setSelectedColor("all")
                setSelectedRegion("all")
                setSelectedGrade("all")
              }}
              disabled={selectedVehicleType === "all"}
            >
              <SelectTrigger>
                <SelectValue placeholder="モデル" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 2行目: 年式、色系統、地域、グレード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 年式 */}
            <Select value={selectedYear} onValueChange={setSelectedYear} disabled={selectedModel === "all"}>
              <SelectTrigger>
                <SelectValue placeholder="年式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 色系統 */}
            <Select value={selectedColor} onValueChange={setSelectedColor} disabled={selectedModel === "all"}>
              <SelectTrigger>
                <SelectValue placeholder="色系統" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    {color.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 地域 */}
            <Select value={selectedRegion} onValueChange={setSelectedRegion} disabled={selectedModel === "all"}>
              <SelectTrigger>
                <SelectValue placeholder="地域" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* グレード */}
            <Select value={selectedGrade} onValueChange={setSelectedGrade} disabled={selectedModel === "all"}>
              <SelectTrigger>
                <SelectValue placeholder="グレード" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {availableGrades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* メインコンテンツ */}
      <Tabs defaultValue="market" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="market" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            メーカー・車種別相場推移
          </TabsTrigger>
          <TabsTrigger value="resale" className="gap-2">
            <Award className="h-4 w-4" />
            リセールバリュー
          </TabsTrigger>
        </TabsList>

        {/* メーカー・車種別相場推移タブ */}
        <TabsContent value="market" className="space-y-6">
          {/* ソートボタン */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">並び替え:</span>
            {[
              { key: "resale", label: "リセール率" },
              { key: "price", label: "平均価格" },
              { key: "volume", label: "流通台数" },
              { key: "change", label: "価格変動" },
            ].map((sort) => (
              <Button
                key={sort.key}
                variant={sortBy === sort.key ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (sortBy === sort.key) {
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                  } else {
                    setSortBy(sort.key as typeof sortBy)
                    setSortOrder("desc")
                  }
                }}
              >
                {sort.label}
                {sortBy === sort.key && (
                  <span className="ml-1">{sortOrder === "desc" ? "↓" : "↑"}</span>
                )}
              </Button>
            ))}
          </div>

          {/* 相場一覧 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">相場一覧</CardTitle>
                <Badge variant="secondary">{filteredData.length}件</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[200px]">メーカー / 車種</TableHead>
                    <TableHead>モデル</TableHead>
                    <TableHead className="text-right">平均価格</TableHead>
                    <TableHead className="text-right">価格帯</TableHead>
                    <TableHead className="text-right">変動</TableHead>
                    <TableHead className="text-right">流通台数</TableHead>
                    <TableHead className="text-right">リセール率</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((vehicle) => (
                    <TableRow
                      key={vehicle.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleVehicleClick(vehicle)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{vehicle.vehicleType}</div>
                            <div className="text-xs text-muted-foreground">{vehicle.maker}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{vehicle.model}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-semibold">{formatPrice(vehicle.avgPrice)}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {formatPrice(vehicle.minPrice)} 〜 {formatPrice(vehicle.maxPrice)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {getTrendIcon(vehicle.trend)}
                          <span
                            className={
                              vehicle.priceChange > 0
                                ? "text-emerald-500"
                                : vehicle.priceChange < 0
                                  ? "text-red-500"
                                  : ""
                            }
                          >
                            {vehicle.priceChange > 0 ? "+" : ""}
                            {vehicle.priceChange}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="text-sm">{vehicle.volume.toLocaleString()}台</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={vehicle.resaleRate >= 90 ? "default" : vehicle.resaleRate >= 80 ? "secondary" : "outline"}
                          className={vehicle.resaleRate >= 100 ? "bg-emerald-500" : ""}
                        >
                          {vehicle.resaleRate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* リセールバリュータブ */}
        <TabsContent value="resale" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ランキング */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-lg">リセールバリューランキング</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">3年後の残価率が高い車種</p>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[60px]">順位</TableHead>
                      <TableHead>メーカー</TableHead>
                      <TableHead>車種</TableHead>
                      <TableHead>モデル</TableHead>
                      <TableHead className="text-right">リセール率</TableHead>
                      <TableHead className="text-right">傾向</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resaleRankingData.map((vehicle) => (
                      <TableRow key={vehicle.rank} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {vehicle.rank <= 3 ? (
                              <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full font-bold text-white ${
                                  vehicle.rank === 1
                                    ? "bg-amber-500"
                                    : vehicle.rank === 2
                                      ? "bg-slate-400"
                                      : "bg-amber-700"
                                }`}
                              >
                                {vehicle.rank}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">{vehicle.rank}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{vehicle.maker}</TableCell>
                        <TableCell className="font-medium">{vehicle.vehicleType}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{vehicle.model}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={vehicle.resaleRate >= 90 ? "default" : "secondary"}
                            className={vehicle.resaleRate >= 100 ? "bg-emerald-500" : ""}
                          >
                            {vehicle.resaleRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{getTrendIcon(vehicle.trend)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* リセール率の説明 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  リセールバリューとは
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  新車購入価格に対する3年後の中古車価格の割合を示します。100%を超える車種は、新車価格よりも高値で取引されています。
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-sm font-medium">100%以上</span>
                    <Badge className="bg-emerald-500">プレミアム</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-sm font-medium">90%〜99%</span>
                    <Badge>非常に高い</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted border">
                    <span className="text-sm font-medium">80%〜89%</span>
                    <Badge variant="secondary">高い</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted border">
                    <span className="text-sm font-medium">80%未満</span>
                    <Badge variant="outline">標準</Badge>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">高リセール車種の特徴</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>・人気車種で需要が安定</li>
                    <li>・新車の納期が長い</li>
                    <li>・生産台数が限られている</li>
                    <li>・海外需要が高い</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 詳細モーダル */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedVehicle && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span>{selectedVehicle.maker} {selectedVehicle.vehicleType} {selectedVehicle.model}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {selectedVehicle.trend === "up" ? "上昇傾向" : selectedVehicle.trend === "down" ? "下落傾向" : "横ばい"}
                      </Badge>
                      <Badge
                        variant={selectedVehicle.resaleRate >= 90 ? "default" : "secondary"}
                        className={`text-xs ${selectedVehicle.resaleRate >= 100 ? "bg-emerald-500" : ""}`}
                      >
                        リセール率 {selectedVehicle.resaleRate}%
                      </Badge>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* サマリーカード */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">平均価格</div>
                      <div className="text-xl font-bold mt-1">{formatPrice(selectedVehicle.avgPrice)}</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">価格帯</div>
                      <div className="text-sm font-medium mt-1">
                        {formatPrice(selectedVehicle.minPrice)} 〜 {formatPrice(selectedVehicle.maxPrice)}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">流通台数</div>
                      <div className="text-xl font-bold mt-1">{selectedVehicle.volume.toLocaleString()}台</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">月間変動</div>
                      <div
                        className={`text-xl font-bold mt-1 flex items-center gap-1 ${
                          selectedVehicle.priceChange > 0
                            ? "text-emerald-500"
                            : selectedVehicle.priceChange < 0
                              ? "text-red-500"
                              : ""
                        }`}
                      >
                        {selectedVehicle.priceChange > 0 ? (
                          <ArrowUpRight className="h-5 w-5" />
                        ) : selectedVehicle.priceChange < 0 ? (
                          <ArrowDownRight className="h-5 w-5" />
                        ) : null}
                        {selectedVehicle.priceChange > 0 ? "+" : ""}
                        {selectedVehicle.priceChange}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 価格推移チャート */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">価格推移（過去6ヶ月）</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={generatePriceHistory(selectedVehicle.avgPrice, selectedVehicle.trend)}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" className="text-xs" />
                          <YAxis
                            tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                            className="text-xs"
                            width={60}
                          />
                          <Tooltip
                            formatter={(value: number) => [`¥${value.toLocaleString()}`, "平均価格"]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            fill="url(#colorPrice)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* 流通台数チャート */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">月間流通台数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={generatePriceHistory(selectedVehicle.avgPrice, selectedVehicle.trend)}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" className="text-xs" />
                          <YAxis className="text-xs" width={40} />
                          <Tooltip
                            formatter={(value: number) => [`${value}台`, "流通台数"]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="volume" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* 人気度と市場分析 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500" />
                        人気度
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">人気スコア</span>
                          <span className="font-bold text-lg">{selectedVehicle.popularity}/100</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                            style={{ width: `${selectedVehicle.popularity}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {selectedVehicle.popularity >= 90
                            ? "非常に人気が高く、在庫の回転が早い車種です"
                            : selectedVehicle.popularity >= 80
                              ? "人気が高く、安定した需要があります"
                              : "標準的な人気度です"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">市場分析</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between py-1 border-b">
                          <span className="text-muted-foreground">需要予測</span>
                          <Badge variant={selectedVehicle.trend === "up" ? "default" : "secondary"}>
                            {selectedVehicle.trend === "up" ? "増加" : selectedVehicle.trend === "down" ? "減少" : "安定"}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b">
                          <span className="text-muted-foreground">在庫回転</span>
                          <span className="font-medium">
                            {selectedVehicle.popularity >= 90 ? "早い" : selectedVehicle.popularity >= 80 ? "普通" : "遅い"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-muted-foreground">仕入推奨</span>
                          <Badge variant={selectedVehicle.resaleRate >= 85 ? "default" : "outline"}>
                            {selectedVehicle.resaleRate >= 85 ? "推奨" : "要検討"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
