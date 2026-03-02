"use client"

import { useRouter } from "next/navigation"
import { useState, useMemo, use } from "react"
import React from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

import {
  ArrowLeft,
  TrendingUp,
  Save,
  Store,
  Info,
  Car,
  MapPin,
  Calendar,
  Gauge,
  Building2,
  Target,
  Zap,
  Link2,
  AlertTriangle,
  CheckCircle2,
  Filter,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calculator,
  ArrowRight,
  Check,
  Pencil,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"


type InventoryItem = {
  id: string
  manufacturer: string
  model: string
  modelCode: string
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

type PriceTrackingSetting = {
  targetVehicleId: string
  targetVehicleName: string
  targetCompetitorName: string
  targetPrice: number
  priceOffset: number // negative = below, positive = above
  offsetType: "fixed" | "percentage"
  minPrice: number
  isActive: boolean
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
    url: "https://kurumaerabi.com/usedcar/detail/AU1234567890/",
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
    url: "https://kurumaerabi.com/usedcar/detail/AU2345678901/",
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
    url: "https://kurumaerabi.com/usedcar/detail/AU2345678999/",
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
    url: "https://kurumaerabi.com/usedcar/detail/AU2345679001/",
    newCarPrice: 5000000,
    priceHistory: [
      { date: "01/20", price: 4600000 },
      { date: "02/01", price: 4500000 },
      { date: "03/01", price: 4450000 },
      { date: "04/01", price: 4350000 },
    ],
  },
  {
    id: "COMP001B",
    competitorName: "オートセンター東京",
    competitorArea: "東京都渋谷区",
    manufacturer: "トヨタ",
    model: "アルファード",
    modelCode: "AGH30W",
    grade: "2.5S Cパッケージ",
    year: 2020,
    mileage: 33000,
    color: "ホワイトパール",
    price: 4250000,
    listingDate: "2024-02-20",
    url: "https://kurumaerabi.com/usedcar/detail/AU1234567891/",
    newCarPrice: 5200000,
    priceHistory: [
      { date: "02/20", price: 4450000 },
      { date: "03/01", price: 4350000 },
      { date: "04/01", price: 4250000 },
    ],
  },
  {
    id: "COMP001C",
    competitorName: "プレミアムカーズ新宿",
    competitorArea: "東京都新宿区",
    manufacturer: "トヨタ",
    model: "アルファード",
    modelCode: "AGH30W",
    grade: "2.5S Cパッケージ",
    year: 2020,
    mileage: 38000,
    color: "ホワイトパール",
    price: 4080000,
    listingDate: "2024-03-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU1234567892/",
    newCarPrice: 5200000,
    priceHistory: [
      { date: "03/01", price: 4280000 },
      { date: "04/01", price: 4180000 },
      { date: "05/01", price: 4080000 },
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
    url: "https://kurumaerabi.com/usedcar/detail/AU3456789012/",
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
    competitorArea: "東京都品���������区",
    manufacturer: "ホンダ",
    model: "ヴェゼル",
    modelCode: "RV5",
    grade: "e:HEV Z",
    year: 2021,
    mileage: 22000,
    color: "クリスタルブラック",
    price: 2980000,
    listingDate: "2024-02-05",
    url: "https://kurumaerabi.com/usedcar/detail/AU3456789099/",
    newCarPrice: 3400000,
    priceHistory: [
      { date: "02/05", price: 3180000 },
      { date: "03/01", price: 3080000 },
      { date: "04/01", price: 2980000 },
    ],
  },
  {
    id: "COMP003C",
    competitorName: "ホンダカーズ東京",
    competitorArea: "東京都世田谷区",
    manufacturer: "ホンダ",
    model: "ヴェゼル",
    modelCode: "RV5",
    grade: "e:HEV Z",
    year: 2021,
    mileage: 20000,
    color: "プラチナホワイト",
    price: 2920000,
    listingDate: "2024-03-10",
    url: "https://kurumaerabi.com/usedcar/detail/AU3456789100/",
    newCarPrice: 3400000,
    priceHistory: [
      { date: "03/10", price: 3100000 },
      { date: "04/01", price: 3000000 },
      { date: "05/01", price: 2920000 },
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
    url: "https://kurumaerabi.com/usedcar/detail/AU4567890123/",
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
    url: "https://kurumaerabi.com/usedcar/detail/AU5678901234/",
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
    url: "https://kurumaerabi.com/usedcar/detail/AU5678901299/",
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
    url: "https://kurumaerabi.com/usedcar/detail/AU6789012345/",
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
    url: "https://kurumaerabi.com/usedcar/detail/AU7890123456/",
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
    url: "https://kurumaerabi.com/usedcar/detail/AU7890123499/",
    newCarPrice: 3800000,
    priceHistory: [
      { date: "02/20", price: 2880000 },
      { date: "03/01", price: 2780000 },
      { date: "04/01", price: 2680000 },
    ],
  },
  {
    id: "COMP007C",
    competitorName: "マツダ認定中古車東京",
    competitorArea: "東京都大田区",
    manufacturer: "マツダ",
    model: "CX-5",
    modelCode: "KF5P",
    grade: "XD Lパッケージ",
    year: 2020,
    mileage: 42000,
    color: "ソウルレッドクリスタル",
    price: 2750000,
    listingDate: "2024-03-05",
    url: "https://kurumaerabi.com/usedcar/detail/AU7890123500/",
    newCarPrice: 3800000,
    priceHistory: [
      { date: "03/05", price: 2950000 },
      { date: "04/01", price: 2850000 },
      { date: "05/01", price: 2750000 },
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
    url: "https://kurumaerabi.com/usedcar/detail/AU8901234567/",
    newCarPrice: 10500000,
    priceHistory: [
      { date: "02/01", price: 9200000 },
      { date: "02/15", price: 8800000 },
      { date: "03/01", price: 8500000 },
    ],
  },
]

const OWN_STORE_AREA = "東京都"

const DEFAULT_EXPENSE_RATE = 0.1 // 諸費用率（車両本体価格の10%）

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
    grade: "e:POWER ハイウェイスター",
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
    color: "ブラッ��",
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

const calculatePaymentTotal = (vehiclePrice: number | string) => {
  const priceNum = typeof vehiclePrice === "string" ? Number.parseFloat(vehiclePrice.replace(/,/g, "")) : vehiclePrice
  // 諸費用は車両本体価格の約10-12%として計算（登録費用、税金、保険等）
  const fees = Math.round(priceNum * 0.1)
  return priceNum + fees
}

export default function PricingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: vehicleId } = use(params)
  const router = useRouter()

  const selectedItem = mockInventory.find((item) => item.id === vehicleId)
  const [adjustedPrice, setAdjustedPrice] = useState<string>(selectedItem?.currentPrice.toString() || "")
  const [adjustedTotalPrice, setAdjustedTotalPrice] = useState<string>("")
  const [expenses, setExpenses] = useState<number>(0)
  const [selectedCompetitorForChart, setSelectedCompetitorForChart] = useState<CompetitorInventoryItem | null>(null)

  const [trackingModalOpen, setTrackingModalOpen] = useState(false)
  const [selectedTrackingTarget, setSelectedTrackingTarget] = useState<CompetitorInventoryItem | null>(null)
  const [trackingSettings, setTrackingSettings] = useState<PriceTrackingSetting | null>(null)
  const [trackingOffset, setTrackingOffset] = useState<number>(-10000)
  const [trackingOffsetType, setTrackingOffsetType] = useState<"fixed" | "percentage">("fixed")
  const [trackingMinPrice, setTrackingMinPrice] = useState<string>("")
  const [trackingActive, setTrackingActive] = useState(true)

  const [similarFilters, setSimilarFilters] = useState({
    sameModelCode: true,
    sameYear: true,
    yearRange: 0, // 0 = exact, 1 = ±1year, 2 = ±2years
    sameRegion: true,
    regionScope: "prefecture" as "prefecture" | "kanto" | "all",
    mileageRange: 10000,
    sameColor: true,
  })
  const [filterExpanded, setFilterExpanded] = useState(false)
  const [step, setStep] = useState<1 | "2a" | "2b" | 3>(1)



  useMemo(() => {
    if (selectedItem && expenses === 0) {
      const initialExpenses = Math.round(selectedItem.currentPrice * DEFAULT_EXPENSE_RATE)
      setExpenses(initialExpenses)
      setAdjustedTotalPrice((selectedItem.currentPrice + initialExpenses).toString())
      setAdjustedPrice(selectedItem.currentPrice.toString()) // Initialize adjustedPrice as well
    }
  }, [selectedItem, expenses])

  const handleTotalPriceChange = (newTotalPrice: string) => {
    const totalNum = Number(newTotalPrice.replace(/[^0-9]/g, "")) || 0
    setAdjustedTotalPrice(newTotalPrice.replace(/[^0-9]/g, ""))
    // 諸費用は固定のまま、車両本体価格を逆算
    const newVehiclePrice = totalNum - expenses
    setAdjustedPrice(Math.max(0, newVehiclePrice).toString())
  }

  const handleVehiclePriceChange = (newVehiclePrice: string) => {
    const vehicleNum = Number(newVehiclePrice.replace(/[^0-9]/g, "")) || 0
    setAdjustedPrice(newVehiclePrice.replace(/[^0-9]/g, ""))
    setAdjustedTotalPrice((vehicleNum + expenses).toString())
  }

  const handleExpensesChange = (newExpenses: string) => {
    const expNum = Number(newExpenses.replace(/[^0-9]/g, "")) || 0
    setExpenses(expNum)
    const vehicleNum = Number(adjustedPrice.replace(/[^0-9]/g, "")) || 0
    setAdjustedTotalPrice((vehicleNum + expNum).toString())
  }

  const setQuickTotalPrice = (totalPrice: number) => {
    setAdjustedTotalPrice(totalPrice.toString())
    setAdjustedPrice(Math.max(0, totalPrice - expenses).toString())
  }

  const calculateDaysElapsed = (listingDate: string) => {
    const listing = new Date(listingDate)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - listing.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getCompetitorsForModel = (item: InventoryItem) => {
    return mockCompetitorInventory
      .filter((comp) => comp.manufacturer === item.manufacturer && comp.model === item.model)
      .sort((a, b) => a.price - b.price)
  }

  const getSimilarConditionVehicles = (item: InventoryItem) => {
    return mockCompetitorInventory
      .filter((comp) => {
        // Same model code
        if (similarFilters.sameModelCode && comp.modelCode !== item.modelCode) return false

        // Year filter
        if (similarFilters.sameYear) {
          const yearDiff = Math.abs(comp.year - item.year)
          if (yearDiff > similarFilters.yearRange) return false
        }

        // Region filter
        if (similarFilters.sameRegion) {
          const ownPrefecture = OWN_STORE_AREA
          const compPrefecture =
            comp.competitorArea.split(/[都道府県]/)[0] +
            (comp.competitorArea.includes("都")
              ? "都"
              : comp.competitorArea.includes("道")
                ? "道"
                : comp.competitorArea.includes("府")
                  ? "府"
                  : "県")

          if (similarFilters.regionScope === "prefecture") {
            if (!compPrefecture.startsWith(ownPrefecture.replace(/[都道府県]$/, ""))) return false
          } else if (similarFilters.regionScope === "kanto") {
            const kantoRegions = ["東京", "神奈川", "千葉", "埼玉", "茨城", "栃木", "群馬"]
            const isKanto = kantoRegions.some((region) => comp.competitorArea.includes(region))
            if (!isKanto) return false
          }
          // "all" = no region filter
        }

        // Mileage within range
        if (Math.abs(comp.mileage - item.mileage) > similarFilters.mileageRange) return false

        // Same color
        if (similarFilters.sameColor) {
          const normalizeColor = (color: string) => {
            if (color.includes("ホワイト") || color.includes("パール") || color.includes("白")) return "white"
            if (color.includes("ブラック") || color.includes("黒")) return "black"
            if (color.includes("レッド") || color.includes("赤")) return "red"
            if (color.includes("���ル���ー") || color.includes("銀")) return "silver"
            return color
          }
          if (normalizeColor(comp.color) !== normalizeColor(item.color)) return false
        }
        return true
      })
      .sort((a, b) => a.price - b.price)
  }

  const resetFilters = () => {
    setSimilarFilters({
      sameModelCode: true,
      sameYear: true,
      yearRange: 0,
      sameRegion: true,
      regionScope: "prefecture",
      mileageRange: 10000,
      sameColor: true,
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (similarFilters.sameModelCode) count++
    if (similarFilters.sameYear) count++
    if (similarFilters.sameRegion) count++
    if (similarFilters.mileageRange < 999999) count++
    if (similarFilters.sameColor) count++
    return count
  }

  const openTrackingModal = (vehicle: CompetitorInventoryItem) => {
    setSelectedTrackingTarget(vehicle)
    setTrackingOffset(-10000)
    setTrackingOffsetType("fixed")
    // Use total price for minPrice
    setTrackingMinPrice(selectedItem ? calculatePaymentTotal(selectedItem.purchasePrice + 200000).toString() : "")
    setTrackingActive(true)
    setTrackingModalOpen(true)
  }

  const calculateTrackingPrice = () => {
    if (!selectedTrackingTarget) return 0
    const targetTotalPrice = calculatePaymentTotal(selectedTrackingTarget.price)
    if (trackingOffsetType === "fixed") {
      return targetTotalPrice + trackingOffset
    } else {
      return Math.round(targetTotalPrice * (1 + trackingOffset / 100))
    }
  }

  const saveTrackingSettings = () => {
    if (!selectedTrackingTarget || !selectedItem) return

    const calculatedTotalPrice = calculateTrackingPrice()
    const minPriceNum = Number(trackingMinPrice.replace(/,/g, "")) || 0
    const finalTotalPrice = Math.max(calculatedTotalPrice, minPriceNum)

    const newSettings: PriceTrackingSetting = {
      targetVehicleId: selectedTrackingTarget.id,
      targetVehicleName: `${selectedTrackingTarget.manufacturer} ${selectedTrackingTarget.model} ${selectedTrackingTarget.grade}`,
      targetCompetitorName: selectedTrackingTarget.competitorName,
      targetPrice: calculatePaymentTotal(selectedTrackingTarget.price), // Store total price
      priceOffset: trackingOffset,
      offsetType: trackingOffsetType,
      minPrice: minPriceNum,
      isActive: trackingActive,
    }

    setTrackingSettings(newSettings)
    setAdjustedTotalPrice(Math.round(finalTotalPrice).toString())
    setAdjustedPrice(Math.max(0, Math.round(finalTotalPrice) - expenses).toString())
    setStep(3)
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

  const handleGoToConfirm = () => {
    setStep(3)
  }

  const handleExecute = () => {
    router.push("/pricing")
  }

  const handleFilterChange = (key: string, value: any) => {
    setSimilarFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (!selectedItem) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 flex flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground">車両が見つかりません</p>
            <Button onClick={() => router.push("/pricing")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              価格最適化に戻る
            </Button>
          </main>
        </div>
      </div>
    )
  }

  const competitors = getCompetitorsForModel(selectedItem)
  const similarVehicles = getSimilarConditionVehicles(selectedItem)
  const adjustedPriceNum = Number(adjustedPrice.replace(/,/g, "")) || 0
  const priceDifference = adjustedPriceNum - selectedItem.marketPrice
  const priceDifferencePercent = ((priceDifference / selectedItem.marketPrice) * 100).toFixed(1)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1800px] space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => {
          if (step === 1) router.push("/pricing")
          else if (step === "2a" || step === "2b") setStep(1)
          else setStep(step === 3 && trackingSettings?.isActive ? "2b" : "2a")
        }}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step === 1 ? "一覧に戻る" : "前へ戻る"}
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Car className="h-5 w-5" />
            {selectedItem.manufacturer} {selectedItem.model} <span className="text-muted-foreground font-normal text-base">{selectedItem.grade}</span>
          </h1>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-0 bg-muted/30 rounded-lg p-2">
        {[
          { key: 1 as const, label: "競合比較", icon: Store },
          { key: "2" as const, label: "価格設定", icon: Pencil },
          { key: 3 as const, label: "確認・実行", icon: CheckCircle2 },
        ].map((s, i) => {
          const isCurrent = s.key === 1 ? step === 1 : s.key === "2" ? step === "2a" || step === "2b" : step === 3
          const isDone = s.key === 1 ? step !== 1 : s.key === "2" ? step === 3 : false
          return (
            <React.Fragment key={s.key}>
              {i > 0 && <div className={`flex-shrink-0 w-8 h-px ${isDone || isCurrent ? "bg-primary" : "bg-border"}`} />}
              <button
                type="button"
                onClick={() => { if (isDone) { if (s.key === 1) setStep(1); } }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isDone
                      ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                      : "text-muted-foreground"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                {s.label}
              </button>
            </React.Fragment>
          )
        })}
      </div>

      {/* Compact vehicle info bar */}
      <Card className="border-primary/20">
        <CardContent className="py-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-primary text-primary-foreground">自社在庫</Badge>
              <Badge variant="outline" className="font-mono">{selectedItem.modelCode}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />{selectedItem.year}年</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1"><Gauge className="h-3 w-3" />{selectedItem.mileage.toLocaleString()}km</span>
              <span className="text-sm text-muted-foreground">{selectedItem.color}</span>
              <Badge variant="outline" className={selectedItem.daysOnMarket > 60 ? "border-destructive text-destructive" : selectedItem.daysOnMarket > 30 ? "border-amber-500 text-amber-600" : ""}>
                在庫{selectedItem.daysOnMarket}日
              </Badge>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground">現在支払総額</div>
                <div className="text-lg font-bold text-primary">¥{calculatePaymentTotal(selectedItem.currentPrice).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground">市場相場</div>
                <div className="text-base">¥{calculatePaymentTotal(selectedItem.marketPrice).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== STEP 1: 競合比較 ===== */}
      {step === 1 && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left: All same model */}
            <Card className="border-indigo-500/20">
              <CardHeader className="pb-3 bg-indigo-500/5 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Store className="h-4 w-4 text-indigo-600" />
                      同型式の他社在庫一覧
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      <span className="font-medium text-indigo-600">{selectedItem.model}</span> の全在庫
                    </CardDescription>
                  </div>
                  <Badge className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 border-indigo-200">{competitors.length}台</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {competitors.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Store className="h-12 w-12 mb-3 opacity-30" />
                    <p>同型式の競合車両はありません</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">競合店</TableHead>
                          <TableHead>仕様</TableHead>
                          <TableHead className="text-right">価格</TableHead>
                          <TableHead className="text-right">差額</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {competitors.map((comp) => {
                          const pd = selectedItem.currentPrice - comp.price
                          const isSelected = selectedCompetitorForChart?.id === comp.id
                          return (
                            <TableRow key={comp.id} className={`cursor-pointer transition-colors ${isSelected ? "bg-primary/10" : "hover:bg-muted/50"}`} onClick={() => setSelectedCompetitorForChart(comp)}>
                              <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-medium text-sm flex items-center gap-1"><Building2 className="h-3 w-3" />{comp.competitorName}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{comp.competitorArea}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm">{comp.grade}</span>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{comp.year}年</span><span>{comp.mileage.toLocaleString()}km</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex flex-col">
                                  <span className="font-bold">¥{calculatePaymentTotal(comp.price).toLocaleString()}</span>
                                  <span className="text-xs text-muted-foreground">本体 ¥{comp.price.toLocaleString()}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {pd > 0 ? <span className="text-destructive text-sm">+¥{pd.toLocaleString()}</span> : pd < 0 ? <span className="text-chart-2 text-sm">-¥{Math.abs(pd).toLocaleString()}</span> : <span className="text-muted-foreground text-sm">同額</span>}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
                {selectedCompetitorForChart && (
                  <Card className="bg-muted/30 mt-4">
                    <CardHeader className="pb-2 pt-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">価格推移: {selectedCompetitorForChart.competitorName}</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCompetitorForChart(null)}>閉じる</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[180px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={selectedCompetitorForChart.priceHistory} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} tick={{ fontSize: 11 }} domain={["dataMin - 200000", "dataMax + 200000"]} />
                            <Tooltip formatter={(value: number) => [`¥${value.toLocaleString()}`, "価格"]} />
                            <ReferenceLine y={selectedItem.currentPrice} stroke="hsl(var(--primary))" strokeDasharray="5 5" label={{ value: "自社", position: "right", fontSize: 10, fill: "hsl(var(--primary))" }} />
                            <Line type="stepAfter" dataKey="price" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Right: Similar condition */}
            <Card className="border-emerald-500/20">
              <CardHeader className="pb-3 bg-emerald-500/5 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Target className="h-4 w-4 text-emerald-600" />
                      類似条件の競合在庫
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 flex-wrap mt-1">
                      {similarFilters.sameModelCode && <Badge variant="outline" className="text-xs">同型式</Badge>}
                      {similarFilters.sameYear && <Badge variant="outline" className="text-xs">{similarFilters.yearRange === 0 ? "同年式" : `±${similarFilters.yearRange}年`}</Badge>}
                      {similarFilters.sameRegion && <Badge variant="outline" className="text-xs">{similarFilters.regionScope === "prefecture" ? "同地域" : similarFilters.regionScope === "kanto" ? "関東圏" : "全国"}</Badge>}
                      <Badge variant="outline" className="text-xs">±{(similarFilters.mileageRange / 10000).toFixed(0)}万km</Badge>
                      {similarFilters.sameColor && <Badge variant="outline" className="text-xs">同色</Badge>}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={filterExpanded} onOpenChange={setFilterExpanded}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent text-xs"><Filter className="h-3.5 w-3.5" />絞り込み</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>絞り込み条件</DialogTitle>
                          <DialogDescription>類似条件の他社在庫の検索条件を変更</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="flex items-center justify-between"><Label>同一型式</Label><Switch checked={similarFilters.sameModelCode} onCheckedChange={(c) => handleFilterChange("sameModelCode", c)} /></div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between"><Label>年式</Label><Switch checked={similarFilters.sameYear} onCheckedChange={(c) => handleFilterChange("sameYear", c)} /></div>
                            {similarFilters.sameYear && <div className="flex gap-2 pl-4">{[{v:0,l:"同年式"},{v:1,l:"±1年"},{v:2,l:"±2年"}].map(o=><Button key={o.v} type="button" variant={similarFilters.yearRange===o.v?"default":"outline"} size="sm" onClick={()=>handleFilterChange("yearRange",o.v)}>{o.l}</Button>)}</div>}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between"><Label>地域</Label><Switch checked={similarFilters.sameRegion} onCheckedChange={(c) => handleFilterChange("sameRegion", c)} /></div>
                            {similarFilters.sameRegion && <div className="flex gap-2 pl-4">{[{v:"prefecture",l:"同一都道府県"},{v:"kanto",l:"関東圏"},{v:"all",l:"全国"}].map(o=><Button key={o.v} type="button" variant={similarFilters.regionScope===o.v?"default":"outline"} size="sm" onClick={()=>handleFilterChange("regionScope",o.v)}>{o.l}</Button>)}</div>}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between"><Label>走行距離</Label><span className="text-sm text-muted-foreground">±{(similarFilters.mileageRange/10000).toFixed(1)}万km</span></div>
                            <Slider value={[similarFilters.mileageRange]} onValueChange={([v])=>handleFilterChange("mileageRange",v)} min={5000} max={50000} step={5000} />
                          </div>
                          <div className="flex items-center justify-between"><Label>同系色のみ</Label><Switch checked={similarFilters.sameColor} onCheckedChange={(c) => handleFilterChange("sameColor", c)} /></div>
                        </div>
                        <DialogFooter className="flex justify-between sm:justify-between">
                          <Button type="button" variant="outline" onClick={resetFilters}><RotateCcw className="h-3 w-3 mr-1" />リセット</Button>
                          <Button type="button" onClick={()=>setFilterExpanded(false)}>適用</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Badge className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 border-emerald-200">{similarVehicles.length}台</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <ScrollArea className="h-[400px]">
                  {similarVehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <Car className="h-12 w-12 mb-2 opacity-30" />
                      <p className="text-sm">条件に一致する車両がありません</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[160px]">競合店</TableHead>
                          <TableHead>仕様</TableHead>
                          <TableHead className="text-right">価格</TableHead>
                          <TableHead className="text-right w-[80px]">差額</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {similarVehicles.map((vehicle) => {
                          const pd2 = Number(adjustedTotalPrice.replace(/,/g,"")) - calculatePaymentTotal(vehicle.price)
                          return (
                            <TableRow key={vehicle.id} className="hover:bg-muted/50">
                              <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-medium text-sm flex items-center gap-1"><Building2 className="h-3 w-3" />{vehicle.competitorName}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{vehicle.competitorArea}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm">{vehicle.grade}</span>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{vehicle.year}年</span><span>{vehicle.mileage.toLocaleString()}km</span><span>{vehicle.color}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex flex-col">
                                  <span className="font-bold">¥{calculatePaymentTotal(vehicle.price).toLocaleString()}</span>
                                  <span className="text-xs text-muted-foreground">本体 ¥{vehicle.price.toLocaleString()}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {pd2 > 0 ? <span className="text-destructive text-sm">+{Math.round(pd2/10000).toLocaleString()}万</span> : pd2 < 0 ? <span className="text-chart-2 text-sm">{Math.round(pd2/10000).toLocaleString()}万</span> : <span className="text-muted-foreground text-sm">同額</span>}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Action buttons at bottom of Step 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md group" onClick={() => setStep("2a")}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">手動で価格を変更する</p>
                  <p className="text-sm text-muted-foreground">比較結果をもとに、自分で価格を決めて入力</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardContent>
            </Card>
            <Card className="cursor-pointer transition-all hover:border-emerald-500 hover:shadow-md group" onClick={() => setStep("2b")}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors flex-shrink-0">
                  <Link2 className="h-6 w-6 text-emerald-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">競合に自動追従する</p>
                  <p className="text-sm text-muted-foreground">特定の競合車両の価格変動に連動して自動調整</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* ===== STEP 2a: 手動価格変更 ===== */}
      {step === "2a" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,340px] gap-6">
          <div className="space-y-4">
            {/* Summary of competitors */}
            {competitors.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-muted/30"><CardContent className="py-3 text-center"><div className="text-xs text-muted-foreground">競合最安</div><div className="text-lg font-bold">¥{calculatePaymentTotal(Math.min(...competitors.map(c=>c.price))).toLocaleString()}</div></CardContent></Card>
                <Card className="bg-muted/30"><CardContent className="py-3 text-center"><div className="text-xs text-muted-foreground">競合平均</div><div className="text-lg font-bold">¥{calculatePaymentTotal(Math.round(competitors.reduce((s,c)=>s+c.price,0)/competitors.length)).toLocaleString()}</div></CardContent></Card>
                <Card className="bg-muted/30"><CardContent className="py-3 text-center"><div className="text-xs text-muted-foreground">競合台数</div><div className="text-lg font-bold">{competitors.length}台</div></CardContent></Card>
              </div>
            )}

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Calculator className="h-4 w-4" />新しい価格を入力</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">支払総額（税込）</Label>
                  <div className="flex items-center gap-2 max-w-[320px]">
                    <span className="text-xl font-bold flex-shrink-0">¥</span>
                    <Input type="text" value={Number(adjustedTotalPrice).toLocaleString()} onChange={(e) => handleTotalPriceChange(e.target.value)} className="text-xl font-bold text-right h-12" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">車両本体価格</Label>
                  <div className="flex items-center gap-2 max-w-[320px]">
                    <span className="text-base text-muted-foreground flex-shrink-0">¥</span>
                    <Input type="text" value={Number(adjustedPrice).toLocaleString()} onChange={(e) => handleVehiclePriceChange(e.target.value)} className="text-base text-right h-10 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">諸費用（登録費用・税金・保険等）</Label>
                  <div className="flex items-center gap-2 max-w-[320px]">
                    <span className="text-sm text-muted-foreground flex-shrink-0">¥</span>
                    <Input type="text" value={expenses.toLocaleString()} onChange={(e) => handleExpensesChange(e.target.value)} className="text-sm text-right h-9 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => setQuickTotalPrice(calculatePaymentTotal(selectedItem.marketPrice))}>相場総額</Button>
                  <Button variant="outline" size="sm" onClick={() => setQuickTotalPrice(calculatePaymentTotal(selectedItem.marketPrice) - 100000)}>相場-10万</Button>
                  <Button variant="outline" size="sm" onClick={() => setQuickTotalPrice(calculatePaymentTotal(selectedItem.marketPrice) - 200000)}>相場-20万</Button>
                  {competitors.length > 0 && <Button variant="outline" size="sm" onClick={() => setQuickTotalPrice(calculatePaymentTotal(Math.min(...competitors.map(c=>c.price))) - 50000)}>最安-5万</Button>}
                </div>
              </CardContent>
            </Card>

            {competitors.length > 0 && (
              <Alert><Info className="h-4 w-4" /><AlertDescription>
                調整支払総額 ¥{Number(adjustedTotalPrice).toLocaleString()} は、競合{competitors.length}台中で
                <strong className="mx-1">{(() => { const all = [...competitors.map(c=>calculatePaymentTotal(c.price)), Number(adjustedTotalPrice)].sort((a,b)=>a-b); return all.indexOf(Number(adjustedTotalPrice))+1 })()}位</strong>の価格です
              </AlertDescription></Alert>
            )}

            <Button onClick={handleGoToConfirm} className="gap-2 w-full" size="lg">
              確認画面へ
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Prediction metrics sidebar */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><TrendingUp className="h-4 w-4" />予測指標</h3>
            <Card><CardContent className="py-3 flex items-center justify-between"><span className="text-sm text-muted-foreground">販売確率</span><span className={`text-xl font-bold ${calculateMetrics(selectedItem,adjustedPrice).salesProbability >= 90 ? "text-green-600" : calculateMetrics(selectedItem,adjustedPrice).salesProbability >= 75 ? "text-amber-600" : "text-destructive"}`}>{calculateMetrics(selectedItem,adjustedPrice).salesProbability}%</span></CardContent></Card>
            <Card><CardContent className="py-3 flex items-center justify-between"><span className="text-sm text-muted-foreground">予測掲載順位</span><span className="text-xl font-bold">{calculateMetrics(selectedItem,adjustedPrice).listingRank}位</span></CardContent></Card>
            <Card><CardContent className="py-3 flex items-center justify-between"><span className="text-sm text-muted-foreground">粗利額</span><span className={`text-xl font-bold ${calculateMetrics(selectedItem,adjustedPrice).grossProfit >= 500000 ? "text-green-600" : calculateMetrics(selectedItem,adjustedPrice).grossProfit >= 300000 ? "text-amber-600" : "text-destructive"}`}>¥{calculateMetrics(selectedItem,adjustedPrice).grossProfit.toLocaleString()}</span></CardContent></Card>
          </div>
        </div>
      )}

      {/* ===== STEP 2b: 自動追従 ===== */}
      {step === "2b" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Select tracking target */}
          <Card className="border-emerald-500/20">
            <CardHeader className="pb-3 bg-emerald-500/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4 text-emerald-600" />追従対象を選択</CardTitle>
              <CardDescription className="text-xs">価格変動に追従したい競合車両を選んでください</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ScrollArea className="h-[400px]">
                {similarVehicles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Car className="h-12 w-12 mb-2 opacity-30" /><p className="text-sm">条件に一致する車両がありません</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {similarVehicles.map((vehicle) => {
                      const isSelected = selectedTrackingTarget?.id === vehicle.id
                      return (
                        <Card key={vehicle.id} className={`cursor-pointer transition-all ${isSelected ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/50" : "hover:border-emerald-300"}`} onClick={() => {
                          setSelectedTrackingTarget(vehicle)
                          setTrackingOffset(-10000)
                          setTrackingOffsetType("fixed")
                          setTrackingMinPrice(selectedItem ? calculatePaymentTotal(selectedItem.purchasePrice + 200000).toString() : "")
                          setTrackingActive(true)
                        }}>
                          <CardContent className="p-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{vehicle.competitorName}</p>
                              <p className="text-xs text-muted-foreground">{vehicle.grade} / {vehicle.year}年 / {vehicle.mileage.toLocaleString()}km</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">¥{calculatePaymentTotal(vehicle.price).toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">本体 ¥{vehicle.price.toLocaleString()}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right: Tracking settings inline */}
          <div className="space-y-4">
            {selectedTrackingTarget ? (
              <>
                <Card className="bg-muted/30">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{selectedTrackingTarget.competitorName}</p>
                        <p className="text-sm text-muted-foreground">{selectedTrackingTarget.manufacturer} {selectedTrackingTarget.model} {selectedTrackingTarget.grade}</p>
                        <p className="text-xs text-muted-foreground mt-1">{selectedTrackingTarget.year}年 / {selectedTrackingTarget.mileage.toLocaleString()}km / {selectedTrackingTarget.color}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">支払総額</p>
                        <p className="text-xl font-bold text-emerald-700">¥{calculatePaymentTotal(selectedTrackingTarget.price).toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Label>価格差の設定方法</Label>
                  <Select value={trackingOffsetType} onValueChange={(v) => setTrackingOffsetType(v as "fixed" | "percentage")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">固定金額（例：1万円下回る）</SelectItem>
                      <SelectItem value="percentage">割合（例：2%下回る）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>{trackingOffsetType === "fixed" ? "価格差（円）" : "価格差（%）"}</Label>
                  <Slider value={[trackingOffset]} onValueChange={([v]) => setTrackingOffset(v)} min={trackingOffsetType === "fixed" ? -200000 : -20} max={trackingOffsetType === "fixed" ? 100000 : 10} step={trackingOffsetType === "fixed" ? 10000 : 1} />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{trackingOffsetType === "fixed" ? "-20万円" : "-20%"}</span>
                    <span className="font-medium text-lg">{trackingOffset === 0 ? "同額" : trackingOffsetType === "fixed" ? `${trackingOffset > 0 ? "+" : ""}${(trackingOffset / 10000).toFixed(0)}万円` : `${trackingOffset > 0 ? "+" : ""}${trackingOffset}%`}</span>
                    <span className="text-muted-foreground">{trackingOffsetType === "fixed" ? "+10万円" : "+10%"}</span>
                  </div>
                  <Card className="border-emerald-300 bg-emerald-50/50"><CardContent className="py-3">
                    <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">追従支払総額</span><span className="text-xl font-bold text-emerald-700">¥{calculateTrackingPrice().toLocaleString()}</span></div>
                    <div className="flex items-center justify-between mt-1"><span className="text-xs text-muted-foreground">車両本体価格</span><span className="text-sm text-muted-foreground">¥{Math.max(0, calculateTrackingPrice() - expenses).toLocaleString()}</span></div>
                  </CardContent></Card>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">下限支払総額<span className="text-xs text-muted-foreground font-normal">（これ以下には設定されません）</span></Label>
                  <div className="flex items-center gap-2"><span className="text-lg">¥</span><Input type="text" value={trackingMinPrice} onChange={(e) => setTrackingMinPrice(e.target.value.replace(/[^0-9]/g, ""))} placeholder="例: 4500000" className="text-lg" /></div>
                  {Number(trackingMinPrice) > 0 && calculateTrackingPrice() < Number(trackingMinPrice) && (
                    <Alert className="bg-amber-50 border-amber-300"><AlertTriangle className="h-4 w-4 text-amber-600" /><AlertDescription className="text-sm">追従価格が下限を下回るため、下限総額 ¥{Number(trackingMinPrice).toLocaleString()} が適用されます</AlertDescription></Alert>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5"><Label>自動追従を有効化</Label><p className="text-xs text-muted-foreground">相手が価格変更したら自動で追従</p></div>
                  <Switch checked={trackingActive} onCheckedChange={setTrackingActive} />
                </div>

                <Button onClick={saveTrackingSettings} className="gap-2 w-full" size="lg">
                  確認画面へ
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Card className="border-dashed"><CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100"><Link2 className="h-6 w-6 text-emerald-600" /></div>
                <div><p className="font-medium text-sm">追従対象を選択してください</p><p className="text-xs text-muted-foreground mt-1">左のリストから車両を選ぶと、追従設定が表示されます</p></div>
              </CardContent></Card>
            )}
          </div>
        </div>
      )}

      {/* ===== STEP 3: 確認・実行 ===== */}
      {step === 3 && (() => {
        const currentMetrics = calculateMetrics(selectedItem, selectedItem.currentPrice.toString())
        const newMetrics = calculateMetrics(selectedItem, adjustedPrice)
        const isTracking = trackingSettings?.isActive
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="border-2 border-primary/30">
              <CardHeader className="bg-primary/5 rounded-t-lg">
                <CardTitle className="text-lg">変更内容の確認</CardTitle>
                <CardDescription>{isTracking ? "自動追従設定による価格変更" : "手動による価格変更"}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Price change summary */}
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">現在の支払総額</div>
                    <div className="text-2xl font-bold">¥{calculatePaymentTotal(selectedItem.currentPrice).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">本体 ¥{selectedItem.currentPrice.toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRight className="h-6 w-6 text-primary" />
                    {(() => {
                      const diff = Number(adjustedTotalPrice) - calculatePaymentTotal(selectedItem.currentPrice)
                      return (
                        <span className={`text-sm font-bold ${diff > 0 ? "text-destructive" : diff < 0 ? "text-chart-2" : "text-muted-foreground"}`}>
                          {diff > 0 ? "+" : ""}{(diff / 10000).toFixed(1)}万円
                        </span>
                      )
                    })()}
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">新しい支払総額</div>
                    <div className="text-2xl font-bold text-primary">¥{Number(adjustedTotalPrice).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">本体 ¥{Number(adjustedPrice).toLocaleString()}</div>
                  </div>
                </div>

                {/* Tracking info */}
                {isTracking && trackingSettings && (
                  <Card className="bg-emerald-50/50 border-emerald-200">
                    <CardContent className="py-3 space-y-1 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">追従対象</span><span className="font-medium">{trackingSettings.targetCompetitorName}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">価格差</span><span className="font-medium">{trackingSettings.offsetType === "fixed" ? `${trackingSettings.priceOffset >= 0 ? "+" : ""}¥${trackingSettings.priceOffset.toLocaleString()}` : `${trackingSettings.priceOffset}%`}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">下限総額</span><span className="font-medium">¥{trackingSettings.minPrice.toLocaleString()}</span></div>
                    </CardContent>
                  </Card>
                )}

                {/* Metrics comparison */}
                <div>
                  <h4 className="text-sm font-semibold mb-3">予測指標の変化</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "販売確率", before: `${currentMetrics.salesProbability}%`, after: `${newMetrics.salesProbability}%`, diff: newMetrics.salesProbability - currentMetrics.salesProbability, unit: "%" },
                      { label: "掲載順位", before: `${currentMetrics.listingRank}位`, after: `${newMetrics.listingRank}位`, diff: currentMetrics.listingRank - newMetrics.listingRank, unit: "位" },
                      { label: "粗利額", before: `¥${currentMetrics.grossProfit.toLocaleString()}`, after: `¥${newMetrics.grossProfit.toLocaleString()}`, diff: newMetrics.grossProfit - currentMetrics.grossProfit, unit: "" },
                    ].map((m) => (
                      <Card key={m.label} className="bg-muted/30">
                        <CardContent className="py-3 text-center space-y-1">
                          <div className="text-xs text-muted-foreground">{m.label}</div>
                          <div className="text-sm line-through text-muted-foreground">{m.before}</div>
                          <div className="text-lg font-bold">{m.after}</div>
                          <div className={`text-xs font-medium ${m.diff > 0 ? "text-green-600" : m.diff < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                            {m.diff > 0 ? "+" : ""}{m.label === "粗利額" ? `¥${m.diff.toLocaleString()}` : `${m.diff}${m.unit}`}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setStep(isTracking ? "2b" : "2a")} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻って修正
              </Button>
              <Button onClick={handleExecute} size="lg" className="flex-1 gap-2">
                <CheckCircle2 className="h-5 w-5" />
                価格を更新する
              </Button>
            </div>
          </div>
        )
      })()}

          </div>
        </main>
      </div>
    </div>
  )
}
