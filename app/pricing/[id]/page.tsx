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

  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calculator,
  ArrowRight,
  Check,
  Pencil,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  Wrench,
  Shield,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"


type InventoryItem = {
  id: string
  manufacturer: string
  model: string
  modelCode: string
  grade: string
  year: number
  month: number // registration month
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
  transmission: string
  drivetrain: string
  fuelType: string
  inspection: string // e.g. "2026年3月" or "車検なし"
  repairHistory: string // e.g. "なし" or "あり（軽微）"
  equipment: string[] // key features
  priceHistory: { date: string; price: number }[]
  viewCount: number // PV count on listing
  inquiryCount: number // number of inquiries
  favoriteCount: number // number of favorites
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
  month: number
  mileage: number
  color: string
  price: number
  listingDate: string
  url: string
  newCarPrice: number
  priceHistory: { date: string; price: number }[]
  transmission: string
  drivetrain: string
  fuelType: string
  inspection: string
  repairHistory: string
  equipment: string[]
  daysOnMarket: number
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
    year: 2020, month: 3,
    mileage: 32000,
    color: "ホワイトパール",
    price: 4180000,
    listingDate: "2024-01-15",
    url: "https://kurumaerabi.com/usedcar/detail/AU1234567890/",
    newCarPrice: 5200000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "2026年5月", repairHistory: "なし",
    equipment: ["両側パワスラ", "純正ナビ", "BSM", "パノラミックビュー"],
    daysOnMarket: 45,
    priceHistory: [
      { date: "11/01", price: 4680000 }, { date: "12/01", price: 4580000 },
      { date: "01/15", price: 4580000 }, { date: "02/01", price: 4480000 },
      { date: "03/01", price: 4380000 }, { date: "04/01", price: 4380000 },
      { date: "05/01", price: 4280000 }, { date: "06/01", price: 4280000 },
      { date: "07/01", price: 4180000 }, { date: "08/01", price: 4180000 },
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
    year: 2020, month: 7,
    mileage: 38000,
    color: "ブラック",
    price: 3950000,
    listingDate: "2024-01-18",
    url: "https://kurumaerabi.com/usedcar/detail/AU2345678901/",
    newCarPrice: 4800000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "2025年12月", repairHistory: "なし",
    equipment: ["両側パワスラ", "社外ナビ", "ETC2.0"],
    daysOnMarket: 62,
    priceHistory: [
      { date: "10/01", price: 4350000 }, { date: "11/01", price: 4250000 },
      { date: "12/01", price: 4250000 }, { date: "01/18", price: 4250000 },
      { date: "02/01", price: 4150000 }, { date: "03/01", price: 4050000 },
      { date: "04/01", price: 3950000 }, { date: "05/01", price: 3950000 },
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
    year: 2019, month: 11,
    mileage: 45000,
    color: "ブラック",
    price: 3780000,
    listingDate: "2024-02-10",
    url: "https://kurumaerabi.com/usedcar/detail/AU2345678999/",
    newCarPrice: 5100000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "車検なし", repairHistory: "あり（軽微）",
    equipment: ["両側パワスラ", "純正ナビ", "JBLサウンド"],
    daysOnMarket: 88,
    priceHistory: [
      { date: "11/01", price: 4200000 }, { date: "12/01", price: 4100000 },
      { date: "01/01", price: 4100000 }, { date: "02/10", price: 3980000 },
      { date: "03/01", price: 3880000 }, { date: "04/01", price: 3780000 },
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
    year: 2020, month: 1,
    mileage: 28000,
    color: "ホワイトパール",
    price: 4350000,
    listingDate: "2024-01-20",
    url: "https://kurumaerabi.com/usedcar/detail/AU2345679001/",
    newCarPrice: 5000000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "2026年1月", repairHistory: "なし",
    equipment: ["両側パワスラ", "純正ナビ", "セーフティセンス"],
    daysOnMarket: 30,
    priceHistory: [
      { date: "12/01", price: 4700000 }, { date: "01/01", price: 4600000 },
      { date: "01/20", price: 4500000 }, { date: "02/01", price: 4450000 },
      { date: "03/01", price: 4400000 }, { date: "04/01", price: 4350000 },
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
    year: 2020, month: 6,
    mileage: 33000,
    color: "ホワイトパール",
    price: 4250000,
    listingDate: "2024-02-20",
    url: "https://kurumaerabi.com/usedcar/detail/AU1234567891/",
    newCarPrice: 5200000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "2026年6月", repairHistory: "なし",
    equipment: ["両側パワスラ", "純正ナビ", "デジタルインナーミラー", "BSM"],
    daysOnMarket: 21,
    priceHistory: [
      { date: "01/01", price: 4550000 }, { date: "02/01", price: 4450000 },
      { date: "02/20", price: 4450000 }, { date: "03/01", price: 4350000 },
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
    year: 2020, month: 9,
    mileage: 38000,
    color: "ホワイトパール",
    price: 4080000,
    listingDate: "2024-03-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU1234567892/",
    newCarPrice: 5200000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "2025年9月", repairHistory: "なし",
    equipment: ["両側パワスラ", "社外ナビ", "ETC"],
    daysOnMarket: 55,
    priceHistory: [
      { date: "01/01", price: 4380000 }, { date: "02/01", price: 4280000 },
      { date: "03/01", price: 4280000 }, { date: "04/01", price: 4180000 },
      { date: "05/01", price: 4080000 },
    ],
  },
  {
    id: "COMP001D",
    competitorName: "ガリバー練馬",
    competitorArea: "東京都練馬区",
    manufacturer: "トヨタ",
    model: "アルファード",
    modelCode: "AGH30W",
    grade: "2.5S Cパッケージ",
    year: 2020, month: 5,
    mileage: 41000,
    color: "ホワイトパール",
    price: 3980000,
    listingDate: "2024-04-10",
    url: "https://kurumaerabi.com/usedcar/detail/AU1234567893/",
    newCarPrice: 5200000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "車検なし", repairHistory: "あり（軽微）",
    equipment: ["両側パワスラ", "純正ナビ"],
    daysOnMarket: 72,
    priceHistory: [
      { date: "02/01", price: 4280000 }, { date: "03/01", price: 4180000 },
      { date: "04/01", price: 4080000 }, { date: "04/10", price: 4080000 },
      { date: "05/01", price: 3980000 },
    ],
  },
  {
    id: "COMP001E",
    competitorName: "ネクステージ川崎",
    competitorArea: "神奈川県川崎市",
    manufacturer: "トヨタ",
    model: "アルファード",
    modelCode: "AGH30W",
    grade: "2.5S Cパッケージ",
    year: 2021, month: 2,
    mileage: 22000,
    color: "ホワイトパール",
    price: 4580000,
    listingDate: "2024-03-15",
    url: "https://kurumaerabi.com/usedcar/detail/AU1234567894/",
    newCarPrice: 5400000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "2027年2月", repairHistory: "なし",
    equipment: ["両側パワスラ", "純正ナビ", "BSM", "パノラミックビュー", "JBLサウンド"],
    daysOnMarket: 14,
    priceHistory: [
      { date: "03/15", price: 4680000 }, { date: "04/01", price: 4580000 },
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
    year: 2022, month: 4,
    mileage: 15000,
    color: "プラチナホワイト",
    price: 3280000,
    listingDate: "2024-01-20",
    url: "https://kurumaerabi.com/usedcar/detail/AU3456789012/",
    newCarPrice: 3500000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ハイブリッド",
    inspection: "2026年4月", repairHistory: "なし",
    equipment: ["ホンダセンシング", "純正ナビ", "ETC2.0", "LEDヘッド"],
    daysOnMarket: 35,
    priceHistory: [
      { date: "11/01", price: 3480000 }, { date: "12/01", price: 3380000 },
      { date: "01/20", price: 3380000 }, { date: "02/01", price: 3380000 },
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
    year: 2021, month: 10,
    mileage: 22000,
    color: "クリスタルブラック",
    price: 2980000,
    listingDate: "2024-02-05",
    url: "https://kurumaerabi.com/usedcar/detail/AU3456789099/",
    newCarPrice: 3400000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ハイブリッド",
    inspection: "2025年10月", repairHistory: "なし",
    equipment: ["ホンダセンシング", "社外ナビ", "ETC"],
    daysOnMarket: 48,
    priceHistory: [
      { date: "12/01", price: 3280000 }, { date: "01/01", price: 3180000 },
      { date: "02/05", price: 3180000 }, { date: "03/01", price: 3080000 },
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
    year: 2021, month: 6,
    mileage: 20000,
    color: "プラチナホワイト",
    price: 2920000,
    listingDate: "2024-03-10",
    url: "https://kurumaerabi.com/usedcar/detail/AU3456789100/",
    newCarPrice: 3400000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ハイブリッド",
    inspection: "2025年6月", repairHistory: "なし",
    equipment: ["ホンダセンシング", "純正ナビ", "ETC", "LEDヘッド"],
    daysOnMarket: 25,
    priceHistory: [
      { date: "01/01", price: 3200000 }, { date: "02/01", price: 3100000 },
      { date: "03/10", price: 3100000 }, { date: "04/01", price: 3000000 },
      { date: "05/01", price: 2920000 },
    ],
  },
  {
    id: "COMP003D",
    competitorName: "ネクステージ府中",
    competitorArea: "東京都府中市",
    manufacturer: "ホンダ",
    model: "ヴェゼル",
    modelCode: "RV5",
    grade: "e:HEV PLaY",
    year: 2022, month: 8,
    mileage: 12000,
    color: "サンドカーキ",
    price: 3150000,
    listingDate: "2024-04-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU3456789101/",
    newCarPrice: 3600000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ハイブリッド",
    inspection: "2026年8月", repairHistory: "なし",
    equipment: ["ホンダセンシング", "純正ナビ", "パノラマルーフ", "LEDヘッド", "ワイヤレス充電"],
    daysOnMarket: 18,
    priceHistory: [
      { date: "04/01", price: 3250000 }, { date: "05/01", price: 3150000 },
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
    year: 2023, month: 3,
    mileage: 8000,
    color: "ダイヤモンドブラック",
    price: 4250000,
    listingDate: "2024-01-22",
    url: "https://kurumaerabi.com/usedcar/detail/AU4567890123/",
    newCarPrice: 4700000,
    transmission: "CVT", drivetrain: "4WD", fuelType: "e-POWER",
    inspection: "2028年3月", repairHistory: "なし",
    equipment: ["プロパイロット2.0", "純正ナビ", "アラウンドビュー", "LEDヘッド"],
    daysOnMarket: 40,
    priceHistory: [
      { date: "11/01", price: 4550000 }, { date: "12/01", price: 4450000 },
      { date: "01/22", price: 4450000 }, { date: "02/01", price: 4350000 },
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
    year: 2021, month: 5,
    mileage: 25000,
    color: "プレシャスブラック",
    price: 3980000,
    listingDate: "2024-01-25",
    url: "https://kurumaerabi.com/usedcar/detail/AU5678901234/",
    newCarPrice: 4500000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "2026年5月", repairHistory: "なし",
    equipment: ["本革シート", "パノラミックビュー", "JBLサウンド", "BSM", "パワーバックドア"],
    daysOnMarket: 38,
    priceHistory: [
      { date: "11/01", price: 4380000 }, { date: "12/01", price: 4280000 },
      { date: "01/25", price: 4280000 }, { date: "02/01", price: 4180000 },
      { date: "03/01", price: 4080000 }, { date: "04/01", price: 3980000 },
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
    year: 2021, month: 9,
    mileage: 18000,
    color: "ホワイトパール",
    price: 3650000,
    listingDate: "2024-02-15",
    url: "https://kurumaerabi.com/usedcar/detail/AU5678901299/",
    newCarPrice: 4200000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "2025年9月", repairHistory: "なし",
    equipment: ["セーフティセンス", "社外ナビ", "パワーバックドア", "ETC2.0"],
    daysOnMarket: 52,
    priceHistory: [
      { date: "12/01", price: 3950000 }, { date: "01/01", price: 3850000 },
      { date: "02/15", price: 3850000 }, { date: "03/01", price: 3750000 },
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
    year: 2023, month: 2,
    mileage: 5000,
    color: "アッシュ",
    price: 3650000,
    listingDate: "2024-01-28",
    url: "https://kurumaerabi.com/usedcar/detail/AU6789012345/",
    newCarPrice: 3900000,
    transmission: "CVT", drivetrain: "FF", fuelType: "ハイブリッド",
    inspection: "2028年2月", repairHistory: "なし",
    equipment: ["セーフティセンス3.0", "純正ナビ", "ヘッドアップディスプレイ"],
    daysOnMarket: 22,
    priceHistory: [
      { date: "12/01", price: 3850000 }, { date: "01/01", price: 3750000 },
      { date: "01/28", price: 3750000 }, { date: "02/01", price: 3700000 },
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
    year: 2022, month: 6,
    mileage: 18000,
    color: "ソウルレッド",
    price: 3480000,
    listingDate: "2024-01-30",
    url: "https://kurumaerabi.com/usedcar/detail/AU7890123456/",
    newCarPrice: 4000000,
    transmission: "6AT", drivetrain: "AWD", fuelType: "ディーゼル",
    inspection: "2026年6月", repairHistory: "なし",
    equipment: ["360度ビュー", "BOSE", "本革シート", "パワーリフトゲート"],
    daysOnMarket: 33,
    priceHistory: [
      { date: "11/01", price: 3780000 }, { date: "12/01", price: 3680000 },
      { date: "01/30", price: 3680000 }, { date: "02/15", price: 3580000 },
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
    year: 2020, month: 4,
    mileage: 35000,
    color: "ジェットブラック",
    price: 2680000,
    listingDate: "2024-02-20",
    url: "https://kurumaerabi.com/usedcar/detail/AU7890123499/",
    newCarPrice: 3800000,
    transmission: "6AT", drivetrain: "AWD", fuelType: "ディーゼル",
    inspection: "2026年4月", repairHistory: "なし",
    equipment: ["BOSE", "本革シート", "i-ACTIVSENSE"],
    daysOnMarket: 58,
    priceHistory: [
      { date: "12/01", price: 2980000 }, { date: "01/01", price: 2880000 },
      { date: "02/20", price: 2880000 }, { date: "03/01", price: 2780000 },
      { date: "04/01", price: 2680000 },
    ],
  },
  {
    id: "COMP007C",
    competitorName: "��ツダ認定中古車東京",
    competitorArea: "東京都大田区",
    manufacturer: "マツダ",
    model: "CX-5",
    modelCode: "KF5P",
    grade: "XD Lパッケージ",
    year: 2020, month: 8,
    mileage: 42000,
    color: "ソウルレッドクリスタル",
    price: 2750000,
    listingDate: "2024-03-05",
    url: "https://kurumaerabi.com/usedcar/detail/AU7890123500/",
    newCarPrice: 3800000,
    transmission: "6AT", drivetrain: "AWD", fuelType: "ディーゼル",
    inspection: "2026年8月", repairHistory: "��り（板金）",
    equipment: ["BOSE", "本革シート", "i-ACTIVSENSE", "パワーリフトゲート"],
    daysOnMarket: 42,
    priceHistory: [
      { date: "01/01", price: 3050000 }, { date: "02/01", price: 2950000 },
      { date: "03/05", price: 2950000 }, { date: "04/01", price: 2850000 },
      { date: "05/01", price: 2750000 },
    ],
  },
  {
    id: "COMP007D",
    competitorName: "オートプラザ横浜",
    competitorArea: "神奈川県横浜市",
    manufacturer: "マツダ",
    model: "CX-5",
    modelCode: "KF5P",
    grade: "XD Lパッケージ",
    year: 2020, month: 11,
    mileage: 38000,
    color: "マシーングレー",
    price: 2820000,
    listingDate: "2024-03-20",
    url: "https://kurumaerabi.com/usedcar/detail/AU7890123501/",
    newCarPrice: 3800000,
    transmission: "6AT", drivetrain: "AWD", fuelType: "ディーゼル",
    inspection: "2026年11月", repairHistory: "なし",
    equipment: ["BOSE", "本革シート", "i-ACTIVSENSE"],
    daysOnMarket: 28,
    priceHistory: [
      { date: "02/01", price: 3020000 }, { date: "03/01", price: 2920000 },
      { date: "03/20", price: 2920000 }, { date: "04/01", price: 2820000 },
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
    year: 2024, month: 1,
    mileage: 3000,
    color: "ホワイトパール",
    price: 8500000,
    listingDate: "2024-02-01",
    url: "https://kurumaerabi.com/usedcar/detail/AU8901234567/",
    newCarPrice: 10500000,
    transmission: "CVT", drivetrain: "4WD", fuelType: "ハイブリッド",
    inspection: "2027年1月", repairHistory: "なし",
    equipment: ["エグゼクティブラウンジシート", "JBLサウンド", "デジ���ルキー", "パノラミックビュー"],
    daysOnMarket: 15,
    priceHistory: [
      { date: "02/01", price: 9200000 }, { date: "02/15", price: 8800000 },
      { date: "03/01", price: 8500000 },
    ],
  },
]

const OWN_STORE_AREA = "東京都"
// Current month for chart timeline (March = "03/01")
const CURRENT_MONTH_KEY = "03/01"
const FISCAL_TIMELINE = ["09/01","10/01","11/01","12/01","01/01","02/01","03/01","04/01","05/01","06/01","07/01","08/01"]
const CURRENT_MONTH_IDX = FISCAL_TIMELINE.indexOf(CURRENT_MONTH_KEY)
// Timeline capped at current month
const TIMELINE = FISCAL_TIMELINE.slice(0, CURRENT_MONTH_IDX + 1)

const DEFAULT_EXPENSE_RATE = 0.1 // 諸費用率（車両本体価格の10%）

const mockInventory: InventoryItem[] = [
  {
    id: "INV001",
    manufacturer: "トヨタ", model: "アルファード", modelCode: "AGH30W",
    grade: "2.5S Cパッケージ", year: 2020, month: 4, mileage: 35000,
    color: "ホワイトパール",
    currentPrice: 4280000, purchasePrice: 3800000, marketPrice: 3950000,
    pricingScore: 65, listingRank: 12, salesProbability: 72.5, daysOnMarket: 67,
    status: "overpriced",
    transmission: "CVT", drivetrain: "FF", fuelType: "ガソリン",
    inspection: "2026年4月", repairHistory: "なし",
    equipment: ["両側パワスラ", "純正ナビ", "BSM", "パノラミックビュー", "JBLサウンド"],
    viewCount: 342, inquiryCount: 5, favoriteCount: 18,
    priceHistory: [
      { date: "11/01", price: 4580000 }, { date: "12/01", price: 4480000 },
      { date: "01/01", price: 4480000 }, { date: "02/01", price: 4380000 },
      { date: "03/01", price: 4280000 }, { date: "04/01", price: 4280000 },
      { date: "05/01", price: 4280000 },
    ],
  },
  {
    id: "INV002",
    manufacturer: "ホンダ", model: "ヴェゼル", modelCode: "RV5",
    grade: "e:HEV Z", year: 2021, month: 8, mileage: 22000,
    color: "プラチナホワイト",
    currentPrice: 2890000, purchasePrice: 2600000, marketPrice: 2920000,
    pricingScore: 88, listingRank: 5, salesProbability: 91.2, daysOnMarket: 23,
    status: "optimal",
    transmission: "CVT", drivetrain: "FF", fuelType: "ハイブリッド",
    inspection: "2025年8月", repairHistory: "なし",
    equipment: ["ホンダセンシング", "純正ナビ", "ETC2.0", "LEDヘッド"],
    viewCount: 580, inquiryCount: 12, favoriteCount: 35,
    priceHistory: [
      { date: "01/01", price: 3080000 }, { date: "02/01", price: 2980000 },
      { date: "03/01", price: 2890000 }, { date: "04/01", price: 2890000 },
    ],
  },
  {
    id: "INV003",
    manufacturer: "日産", model: "セレナ", modelCode: "C28",
    grade: "e:POWER ハイウェイスター", year: 2019, month: 12, mileage: 48000,
    color: "ブリリアントシルバー",
    currentPrice: 2450000, purchasePrice: 2150000, marketPrice: 2680000,
    pricingScore: 78, listingRank: 2, salesProbability: 94.8, daysOnMarket: 8,
    status: "underpriced",
    transmission: "CVT", drivetrain: "FF", fuelType: "e-POWER",
    inspection: "2025年12月", repairHistory: "なし",
    equipment: ["プロパイロット", "アラウンドビュー", "両側パワスラ", "純正ナビ"],
    viewCount: 890, inquiryCount: 22, favoriteCount: 55,
    priceHistory: [
      { date: "03/15", price: 2550000 }, { date: "04/01", price: 2450000 },
    ],
  },
  {
    id: "INV004",
    manufacturer: "マツダ", model: "CX-5", modelCode: "KF5P",
    grade: "XD Lパッケージ", year: 2020, month: 7, mileage: 41000,
    color: "ソウルレッドクリスタル",
    currentPrice: 2750000, purchasePrice: 2400000, marketPrice: 2580000,
    pricingScore: 70, listingRank: 9, salesProbability: 78.3, daysOnMarket: 45,
    status: "overpriced",
    transmission: "6AT", drivetrain: "AWD", fuelType: "ディーゼル",
    inspection: "2026年7月", repairHistory: "なし",
    equipment: ["BOSE", "本革シート", "i-ACTIVSENSE", "パワーリフトゲート"],
    viewCount: 210, inquiryCount: 3, favoriteCount: 11,
    priceHistory: [
      { date: "11/01", price: 2980000 }, { date: "12/01", price: 2880000 },
      { date: "01/01", price: 2880000 }, { date: "02/01", price: 2800000 },
      { date: "03/01", price: 2750000 }, { date: "04/01", price: 2750000 },
    ],
  },
  {
    id: "INV005",
    manufacturer: "トヨタ", model: "ハリアー", modelCode: "MXUA80",
    grade: "ハイブリッド G", year: 2021, month: 3, mileage: 18000,
    color: "ブラック",
    currentPrice: 3980000, purchasePrice: 3500000, marketPrice: 4050000,
    pricingScore: 85, listingRank: 6, salesProbability: 89.7, daysOnMarket: 31,
    status: "optimal",
    transmission: "CVT", drivetrain: "FF", fuelType: "ハイブリッド",
    inspection: "2027年3月", repairHistory: "なし",
    equipment: ["セーフティセンス", "純正ナビ", "パワーバックドア", "BSM", "LEDヘッド"],
    viewCount: 460, inquiryCount: 8, favoriteCount: 28,
    priceHistory: [
      { date: "12/01", price: 4180000 }, { date: "01/01", price: 4080000 },
      { date: "02/01", price: 3980000 }, { date: "03/01", price: 3980000 },
    ],
  },
  {
    id: "INV006",
    manufacturer: "日産", model: "エクストレイル", modelCode: "T33",
    grade: "20Xi", year: 2019, month: 6, mileage: 52000,
    color: "ダークメタルグレー",
    currentPrice: 2380000, purchasePrice: 2000000, marketPrice: 2250000,
    pricingScore: 68, listingRank: 11, salesProbability: 74.6, daysOnMarket: 58,
    status: "overpriced",
    transmission: "CVT", drivetrain: "4WD", fuelType: "ガソリン",
    inspection: "2025年6月", repairHistory: "あり（軽微）",
    equipment: ["プロパイロット", "社外ナビ", "アラウンドビュー", "ETC"],
    viewCount: 185, inquiryCount: 2, favoriteCount: 7,
    priceHistory: [
      { date: "11/01", price: 2580000 }, { date: "12/01", price: 2480000 },
      { date: "01/01", price: 2480000 }, { date: "02/01", price: 2380000 },
      { date: "03/01", price: 2380000 },
    ],
  },
  {
    id: "INV007",
    manufacturer: "ホンダ", model: "ステップワゴン", modelCode: "RP8",
    grade: "スパーダ ハイブリッド", year: 2020, month: 10, mileage: 38000,
    color: "プレミアムスパークルブラック",
    currentPrice: 3150000, purchasePrice: 2800000, marketPrice: 3180000,
    pricingScore: 90, listingRank: 4, salesProbability: 92.4, daysOnMarket: 19,
    status: "optimal",
    transmission: "CVT", drivetrain: "FF", fuelType: "ハイブリッド",
    inspection: "2026年10月", repairHistory: "なし",
    equipment: ["ホンダセンシング", "両側パワスラ", "純正ナビ", "ETC2.0", "LEDヘッド"],
    viewCount: 620, inquiryCount: 15, favoriteCount: 42,
    priceHistory: [
      { date: "02/01", price: 3280000 }, { date: "03/01", price: 3150000 },
      { date: "04/01", price: 3150000 },
    ],
  },
  {
    id: "INV008",
    manufacturer: "トヨタ", model: "ランドクルーザープラド", modelCode: "TRJ150W",
    grade: "TX Lパッケージ", year: 2018, month: 5, mileage: 65000,
    color: "ホワイトパール",
    currentPrice: 4250000, purchasePrice: 3700000, marketPrice: 3980000,
    pricingScore: 62, listingRank: 15, salesProbability: 69.8, daysOnMarket: 89,
    status: "overpriced",
    transmission: "6AT", drivetrain: "4WD", fuelType: "ガソリン",
    inspection: "2024年5月", repairHistory: "なし",
    equipment: ["本革シート", "純正ナビ", "セーフティセンスP", "LEDヘッド", "ルーフレール"],
    viewCount: 145, inquiryCount: 1, favoriteCount: 5,
    priceHistory: [
      { date: "09/01", price: 4580000 }, { date: "10/01", price: 4480000 },
      { date: "11/01", price: 4380000 }, { date: "12/01", price: 4280000 },
      { date: "01/01", price: 4280000 }, { date: "02/01", price: 4250000 },
      { date: "03/01", price: 4250000 },
    ],
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


  const [trackingModalOpen, setTrackingModalOpen] = useState(false)
  const [selectedTrackingTarget, setSelectedTrackingTarget] = useState<CompetitorInventoryItem | null>(null)
  const [trackingSettings, setTrackingSettings] = useState<PriceTrackingSetting | null>(null)
  const [trackingOffset, setTrackingOffset] = useState<number>(-10000)
  const [trackingOffsetType, setTrackingOffsetType] = useState<"fixed" | "percentage">("fixed")
  const [trackingMinPrice, setTrackingMinPrice] = useState<string>("")
  const [trackingActive, setTrackingActive] = useState(true)

  const [areaScope, setAreaScope] = useState<"prefecture" | "kanto" | "all">("prefecture")
  const [compFilterExpanded, setCompFilterExpanded] = useState(false)
  const [compFilters, setCompFilters] = useState({
    yearRange: 2 as 0 | 1 | 2,
    mileageRange: 30000,
    sameColor: false,
  })
  const [areaFilterExpanded, setAreaFilterExpanded] = useState(false)
  const [areaFilters, setAreaFilters] = useState({
    yearRange: 2 as 0 | 1 | 2,
    mileageRange: 30000,
    sameColor: false,
  })
  const [compChartModalOpen, setCompChartModalOpen] = useState(false)
  const [areaChartModalOpen, setAreaChartModalOpen] = useState(false)
  const [individualChartVehicle, setIndividualChartVehicle] = useState<CompetitorInventoryItem | null>(null)

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
      .filter((comp) => {
        if (comp.manufacturer !== item.manufacturer || comp.model !== item.model) return false
        // Year filter
        if (Math.abs(comp.year - item.year) > compFilters.yearRange) return false
        // Mileage filter
        if (Math.abs(comp.mileage - item.mileage) > compFilters.mileageRange) return false
        // Color filter
        if (compFilters.sameColor) {
          const normalize = (c: string) => {
            if (c.includes("ホワイト") || c.includes("パール") || c.includes("白")) return "white"
            if (c.includes("ブラック") || c.includes("黒")) return "black"
            return c
          }
          if (normalize(comp.color) !== normalize(item.color)) return false
        }
        return true
      })
      .sort((a, b) => a.price - b.price)
  }

  const getAreaVehicles = (item: InventoryItem) => {
    return mockCompetitorInventory
      .filter((comp) => {
        if (comp.manufacturer !== item.manufacturer || comp.model !== item.model) return false
        // Area filter
        if (areaScope === "prefecture") {
          const ownPrefix = OWN_STORE_AREA.replace(/[都道府県]$/, "")
          if (!comp.competitorArea.includes(ownPrefix)) return false
        } else if (areaScope === "kanto") {
          const kantoRegions = ["東京", "神奈川", "千葉", "埼玉", "茨城", "栃木", "群馬"]
          if (!kantoRegions.some((r) => comp.competitorArea.includes(r))) return false
        }
        // Year filter
        if (Math.abs(comp.year - item.year) > areaFilters.yearRange) return false
        // Mileage filter
        if (Math.abs(comp.mileage - item.mileage) > areaFilters.mileageRange) return false
        // Color filter
        if (areaFilters.sameColor) {
          const normalize = (c: string) => {
            if (c.includes("ホワイト") || c.includes("パール") || c.includes("白")) return "white"
            if (c.includes("ブラック") || c.includes("黒")) return "black"
            return c
          }
          if (normalize(comp.color) !== normalize(item.color)) return false
        }
        return true
      })
      .sort((a, b) => a.price - b.price)
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
  const areaVehicles = getAreaVehicles(selectedItem)
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

      {/* Vehicle info bar */}
      <Card className="border-primary/20">
        <CardContent className="py-4 space-y-3">
          {/* Row 1: Basic specs + price */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-primary text-primary-foreground">自社在庫</Badge>
                <Badge variant="outline" className="font-mono">{selectedItem.modelCode}</Badge>
                <Badge variant="outline" className={selectedItem.status === "overpriced" ? "border-destructive text-destructive" : selectedItem.status === "underpriced" ? "border-blue-500 text-blue-600" : "border-green-500 text-green-600"}>
                  {selectedItem.status === "overpriced" ? "高価格" : selectedItem.status === "underpriced" ? "低価格" : "適正"}
                </Badge>
                <Badge variant="outline" className={selectedItem.daysOnMarket > 60 ? "border-destructive text-destructive" : selectedItem.daysOnMarket > 30 ? "border-amber-500 text-amber-600" : "border-green-500 text-green-600"}>
                  <Clock className="h-3 w-3 mr-1" />在庫{selectedItem.daysOnMarket}日
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{selectedItem.year}年{selectedItem.month}月</span>
                <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{selectedItem.mileage.toLocaleString()}km</span>
                <span>{selectedItem.color}</span>
                <span>{selectedItem.transmission} / {selectedItem.drivetrain}</span>
                <span>{selectedItem.fuelType}</span>
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" />{selectedItem.inspection}</span>
                <span className="flex items-center gap-1"><Wrench className="h-3 w-3" />修復歴: {selectedItem.repairHistory}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedItem.equipment.map((eq) => (
                  <Badge key={eq} variant="secondary" className="text-[10px] h-5">{eq}</Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-6 flex-shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground">現在支払総額</div>
                <div className="text-xl font-bold text-primary">¥{calculatePaymentTotal(selectedItem.currentPrice).toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">本体 ¥{selectedItem.currentPrice.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground">市場相場</div>
                <div className="text-base">¥{calculatePaymentTotal(selectedItem.marketPrice).toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">本体 ¥{selectedItem.marketPrice.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-muted-foreground">仕入価格</div>
                <div className="text-base">¥{selectedItem.purchasePrice.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">粗利 ¥{(selectedItem.currentPrice - selectedItem.purchasePrice).toLocaleString()}</div>
              </div>
              <div className="h-12 w-px bg-border flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button size="sm" className="gap-1.5" onClick={() => setStep("2a")}>
                  <Calculator className="h-3.5 w-3.5" />価格変更
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50" onClick={() => setStep("2b")}>
                  <Link2 className="h-3.5 w-3.5" />競合追従
                </Button>
              </div>
            </div>
          </div>
          {/* Row 2: Performance metrics */}
          <div className="flex items-center gap-4 pt-2 border-t">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{selectedItem.viewCount}</span> PV
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MessageSquare className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{selectedItem.inquiryCount}</span> 問合せ
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Heart className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{selectedItem.favoriteCount}</span> お気に入り
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              問合せ率 <span className="font-medium text-foreground">{selectedItem.viewCount > 0 ? ((selectedItem.inquiryCount / selectedItem.viewCount) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== STEP 1: 競合比較 ===== */}
      {step === 1 && (
        <>
          {/* Market Summary Cards */}
          {competitors.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-3 text-center">
                  <div className="text-[10px] text-muted-foreground">自社価格</div>
                  <div className="text-lg font-bold text-primary">¥{(selectedItem.currentPrice / 10000).toFixed(0)}万</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-3 text-center">
                  <div className="text-[10px] text-muted-foreground">他社最安</div>
                  <div className="text-lg font-bold">¥{(Math.min(...competitors.map(c => c.price)) / 10000).toFixed(0)}万</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-3 text-center">
                  <div className="text-[10px] text-muted-foreground">他社平均</div>
                  <div className="text-lg font-bold">¥{(Math.round(competitors.reduce((s, c) => s + c.price, 0) / competitors.length) / 10000).toFixed(0)}万</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-3 text-center">
                  <div className="text-[10px] text-muted-foreground">他社最高</div>
                  <div className="text-lg font-bold">¥{(Math.max(...competitors.map(c => c.price)) / 10000).toFixed(0)}万</div>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="py-3 text-center">
                  <div className="text-[10px] text-muted-foreground">他社台数</div>
                  <div className="text-lg font-bold">{competitors.length}台</div>
                </CardContent>
              </Card>
              <Card className={selectedItem.currentPrice > Math.round(competitors.reduce((s, c) => s + c.price, 0) / competitors.length) ? "bg-destructive/5 border-destructive/20" : "bg-green-50 border-green-200"}>
                <CardContent className="py-3 text-center">
                  <div className="text-[10px] text-muted-foreground">平均との差額</div>
                  <div className={`text-lg font-bold ${selectedItem.currentPrice > Math.round(competitors.reduce((s, c) => s + c.price, 0) / competitors.length) ? "text-destructive" : "text-green-600"}`}>
                    {selectedItem.currentPrice > Math.round(competitors.reduce((s, c) => s + c.price, 0) / competitors.length) ? "+" : ""}{((selectedItem.currentPrice - Math.round(competitors.reduce((s, c) => s + c.price, 0) / competitors.length)) / 10000).toFixed(0)}万
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Price Comparison Chart - Own vs Market */}
          {selectedItem.priceHistory.length > 0 && competitors.length > 0 && (() => {
            const ownPrice = selectedItem.currentPrice
            const relevantComps = competitors.filter(c => c.price >= ownPrice * 0.4 && c.price <= ownPrice * 2.0)
            const ownByMonth = new Map<string, number>()
            selectedItem.priceHistory.forEach(p => { const k = p.date.slice(0, 2) + "/01"; if (TIMELINE.includes(k)) ownByMonth.set(k, p.price) })
            const compByMonthArr = relevantComps.map(c => {
              const map = new Map<string, number>()
              c.priceHistory.forEach(p => { const k = p.date.slice(0, 2) + "/01"; if (TIMELINE.includes(k)) map.set(k, p.price) })
              return map
            })
            const ownMonths = TIMELINE.filter(m => ownByMonth.has(m))
            if (ownMonths.length === 0) return null
            const si = TIMELINE.indexOf(ownMonths[0])
            const active = TIMELINE.slice(si)
            let pOwn = ownByMonth.get(active[0]) ?? ownPrice
            const pComp = compByMonthArr.map(m => { for (const t of active) { if (m.has(t)) return m.get(t)! } return null })
            const chartData = active.map((month) => {
              if (ownByMonth.has(month)) pOwn = ownByMonth.get(month)!
              const prices: number[] = []
              compByMonthArr.forEach((m, ci) => { if (m.has(month)) pComp[ci] = m.get(month)!; if (pComp[ci] !== null) prices.push(pComp[ci]!) })
              return {
                date: month.replace("/01", "月"), own: pOwn,
                avgComp: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : pOwn,
                minComp: prices.length > 0 ? Math.min(...prices) : pOwn,
                maxComp: prices.length > 0 ? Math.max(...prices) : pOwn,
              }
            })
            return (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    価格推移比較
                  </CardTitle>
                  <CardDescription className="text-xs">自社 {selectedItem.model} {selectedItem.grade} と競合（{relevantComps.length}台）の全体平均推移</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                        <Tooltip formatter={(value: number, name: string) => {
                          const label = name === "own" ? `自社 ${selectedItem.model} ${selectedItem.grade}` : name === "avgComp" ? "他社平均" : name === "minComp" ? "他社最安" : "他社最高"
                          return [`\u00A5${value.toLocaleString()}`, label]
                        }} />
                        <Line type="monotone" dataKey="own" name="own" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }} />
                        <Line type="monotone" dataKey="avgComp" name="avgComp" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#f59e0b", strokeWidth: 1, r: 3 }} />
                        <Line type="monotone" dataKey="minComp" name="minComp" stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" dot={{ fill: "#10b981", r: 2 }} />
                        <Line type="monotone" dataKey="maxComp" name="maxComp" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" dot={{ fill: "#ef4444", r: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-4 mt-2 justify-center text-xs flex-wrap">
                    <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5" style={{ backgroundColor: "#2563eb" }} /> 自社 {selectedItem.model} {selectedItem.grade}</span>
                    <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: "#f59e0b" }} /> 他社平均</span>
                    <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: "#10b981" }} /> 他社最安</span>
                    <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: "#ef4444" }} /> 他社最高</span>
                  </div>
                </CardContent>
              </Card>
            )
          })()}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left: Competitor store comparison */}
            <Card className="border-indigo-500/20">
              <CardHeader className="pb-3 bg-indigo-500/5 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Store className="h-4 w-4 text-indigo-600" />
                      競合店比較（全エリア）
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs flex items-center gap-1 flex-wrap">
                      <span className="font-medium text-indigo-600">{selectedItem.model}</span>
                      {compFilters.yearRange > 0 && <Badge variant="outline" className="text-[10px] h-4">{`\u00B1${compFilters.yearRange}年`}</Badge>}
                      {compFilters.yearRange === 0 && <Badge variant="outline" className="text-[10px] h-4">同年式</Badge>}
                      <Badge variant="outline" className="text-[10px] h-4">{`\u00B1${(compFilters.mileageRange / 10000).toFixed(0)}万km`}</Badge>
                      {compFilters.sameColor && <Badge variant="outline" className="text-[10px] h-4">同色</Badge>}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent text-xs" onClick={() => setCompChartModalOpen(true)} disabled={competitors.length === 0}><TrendingUp className="h-3.5 w-3.5" />グラフ</Button>
                    <Dialog open={compFilterExpanded} onOpenChange={setCompFilterExpanded}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent text-xs"><Filter className="h-3.5 w-3.5" />絞り込み</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>競合店比較 絞り込み条件</DialogTitle>
                          <DialogDescription>年式・走行距離・色で絞り込みます</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">年式</Label>
                            <div className="flex gap-2">
                              {([{v:0,l:"同年式"},{v:1,l:"\u00B11年"},{v:2,l:"\u00B12年"}] as const).map(o => (
                                <Button key={o.v} type="button" variant={compFilters.yearRange === o.v ? "default" : "outline"} size="sm" onClick={() => setCompFilters(p => ({...p, yearRange: o.v}))}>{o.l}</Button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between"><Label className="text-sm font-medium">走行距離</Label><span className="text-sm text-muted-foreground">{`\u00B1${(compFilters.mileageRange / 10000).toFixed(1)}万km`}</span></div>
                            <Slider value={[compFilters.mileageRange]} onValueChange={([v]) => setCompFilters(p => ({...p, mileageRange: v}))} min={5000} max={50000} step={5000} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">同系色のみ</Label>
                            <Switch checked={compFilters.sameColor} onCheckedChange={(c) => setCompFilters(p => ({...p, sameColor: c}))} />
                          </div>
                        </div>
                        <DialogFooter className="flex justify-between sm:justify-between">
                          <Button type="button" variant="outline" onClick={() => setCompFilters({ yearRange: 2, mileageRange: 30000, sameColor: false })}>リセット</Button>
                          <Button type="button" onClick={() => setCompFilterExpanded(false)}>適用</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Badge className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 border-indigo-200">{competitors.length}台</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {competitors.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Store className="h-12 w-12 mb-3 opacity-30" />
                    <p>同型式の競合車両はありません</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[160px]">競合店</TableHead>
                          <TableHead>仕様</TableHead>
                          <TableHead className="text-center w-[90px]">在庫始期/日数</TableHead>
                          <TableHead className="text-right">価格</TableHead>
                          <TableHead className="text-right w-[80px]">差額</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {competitors.map((comp) => {
                          const pd = selectedItem.currentPrice - comp.price
                          return (
                            <TableRow key={comp.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setIndividualChartVehicle(comp)}>
                              <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-medium text-sm flex items-center gap-1"><Building2 className="h-3 w-3" />{comp.competitorName}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{comp.competitorArea}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm font-medium">{comp.grade}</span>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                                    <span>{comp.year}年{comp.month}月</span>
                                    <span>{comp.mileage.toLocaleString()}km</span>
                                    <span>{comp.color}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{comp.transmission}/{comp.drivetrain}</span>
                                    <span>{comp.inspection}</span>
                                    {comp.repairHistory !== "なし" && <Badge variant="outline" className="text-[9px] h-4 border-amber-300 text-amber-600">修復歴{comp.repairHistory}</Badge>}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex flex-col items-center gap-0.5">
                                  <span className="text-xs text-muted-foreground">{comp.listingDate.slice(5).replace("-", "/")}</span>
                                  <Badge variant="outline" className={`text-xs ${comp.daysOnMarket > 60 ? "border-destructive text-destructive" : comp.daysOnMarket > 30 ? "border-amber-400 text-amber-600" : "border-green-400 text-green-600"}`}>
                                    {comp.daysOnMarket}日
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex flex-col">
                                  <span className="font-bold">¥{calculatePaymentTotal(comp.price).toLocaleString()}</span>
                                  <span className="text-xs text-muted-foreground">本体 ¥{comp.price.toLocaleString()}</span>
                                  {comp.priceHistory.length >= 2 && (() => {
                                    const first = comp.priceHistory[0].price
                                    const drop = first - comp.price
                                    return drop > 0 ? <span className="text-[10px] text-destructive">累計 -{(drop / 10000).toFixed(0)}���値下</span> : null
                                  })()}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {pd > 0 ? <span className="text-destructive text-sm font-medium">+{(pd / 10000).toFixed(0)}万</span> : pd < 0 ? <span className="text-green-600 text-sm font-medium">{(pd / 10000).toFixed(0)}万</span> : <span className="text-muted-foreground text-sm">同額</span>}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}

              </CardContent>
            </Card>

            {/* Right: Area comparison */}
            <Card className="border-emerald-500/20">
              <CardHeader className="pb-3 bg-emerald-500/5 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      エリア別比較
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs flex items-center gap-1 flex-wrap">
                      <span className="font-medium text-emerald-600">{selectedItem.model}</span>
                      {areaFilters.yearRange > 0 && <Badge variant="outline" className="text-[10px] h-4">{`\u00B1${areaFilters.yearRange}年`}</Badge>}
                      {areaFilters.yearRange === 0 && <Badge variant="outline" className="text-[10px] h-4">同年式</Badge>}
                      <Badge variant="outline" className="text-[10px] h-4">{`\u00B1${(areaFilters.mileageRange / 10000).toFixed(0)}万km`}</Badge>
                      {areaFilters.sameColor && <Badge variant="outline" className="text-[10px] h-4">同色</Badge>}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={areaScope} onValueChange={(v) => setAreaScope(v as "prefecture" | "kanto" | "all")}>
                      <SelectTrigger className="w-[120px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prefecture">{OWN_STORE_AREA}</SelectItem>
                        <SelectItem value="kanto">関東圏</SelectItem>
                        <SelectItem value="all">全国</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent text-xs" onClick={() => setAreaChartModalOpen(true)} disabled={areaVehicles.length === 0}><TrendingUp className="h-3.5 w-3.5" />グラフ</Button>
                    <Dialog open={areaFilterExpanded} onOpenChange={setAreaFilterExpanded}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent text-xs"><Filter className="h-3.5 w-3.5" />絞り込み</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>エリア別比較 絞り込み条件</DialogTitle>
                          <DialogDescription>年式・走行距離・色で絞り込みます</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">年式</Label>
                            <div className="flex gap-2">
                              {([{v:0,l:"同年式"},{v:1,l:"\u00B11年"},{v:2,l:"\u00B12年"}] as const).map(o => (
                                <Button key={o.v} type="button" variant={areaFilters.yearRange === o.v ? "default" : "outline"} size="sm" onClick={() => setAreaFilters(p => ({...p, yearRange: o.v}))}>{o.l}</Button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between"><Label className="text-sm font-medium">走行距離</Label><span className="text-sm text-muted-foreground">{`\u00B1${(areaFilters.mileageRange / 10000).toFixed(1)}万km`}</span></div>
                            <Slider value={[areaFilters.mileageRange]} onValueChange={([v]) => setAreaFilters(p => ({...p, mileageRange: v}))} min={5000} max={50000} step={5000} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">同系色のみ</Label>
                            <Switch checked={areaFilters.sameColor} onCheckedChange={(c) => setAreaFilters(p => ({...p, sameColor: c}))} />
                          </div>
                        </div>
                        <DialogFooter className="flex justify-between sm:justify-between">
                          <Button type="button" variant="outline" onClick={() => setAreaFilters({ yearRange: 2, mileageRange: 30000, sameColor: false })}>リセット</Button>
                          <Button type="button" onClick={() => setAreaFilterExpanded(false)}>適用</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Badge className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 border-emerald-200">{areaVehicles.length}台</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                {/* Area summary stats */}
                {areaVehicles.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="rounded-md bg-muted/40 p-2 text-center">
                      <div className="text-[10px] text-muted-foreground">最安</div>
                      <div className="text-sm font-bold">¥{(Math.min(...areaVehicles.map(v => v.price)) / 10000).toFixed(0)}万</div>
                    </div>
                    <div className="rounded-md bg-muted/40 p-2 text-center">
                      <div className="text-[10px] text-muted-foreground">平均</div>
                      <div className="text-sm font-bold">¥{(Math.round(areaVehicles.reduce((s, v) => s + v.price, 0) / areaVehicles.length) / 10000).toFixed(0)}万</div>
                    </div>
                    <div className="rounded-md bg-muted/40 p-2 text-center">
                      <div className="text-[10px] text-muted-foreground">平均在庫日数</div>
                      <div className="text-sm font-bold">{Math.round(areaVehicles.reduce((s, v) => s + v.daysOnMarket, 0) / areaVehicles.length)}日</div>
                    </div>
                  </div>
                )}
                <ScrollArea className="h-[440px]">
                  {areaVehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mb-2 opacity-30" />
                      <p className="text-sm">該当エリアに競合車両がありません</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[160px]">競合店</TableHead>
                          <TableHead>仕様</TableHead>
                          <TableHead className="text-center w-[90px]">在庫始期/日数</TableHead>
                          <TableHead className="text-right">価格</TableHead>
                          <TableHead className="text-right w-[80px]">差額</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {areaVehicles.map((vehicle) => {
                          const pd2 = selectedItem.currentPrice - vehicle.price
                          return (
                            <TableRow key={vehicle.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setIndividualChartVehicle(vehicle)}>
                              <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-medium text-sm flex items-center gap-1"><Building2 className="h-3 w-3" />{vehicle.competitorName}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{vehicle.competitorArea}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm font-medium">{vehicle.grade}</span>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                                    <span>{vehicle.year}年{vehicle.month}月</span>
                                    <span>{vehicle.mileage.toLocaleString()}km</span>
                                    <span>{vehicle.color}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{vehicle.transmission}/{vehicle.drivetrain}</span>
                                    <span>{vehicle.inspection}</span>
                                    {vehicle.repairHistory !== "なし" && <Badge variant="outline" className="text-[9px] h-4 border-amber-300 text-amber-600">修復歴{vehicle.repairHistory}</Badge>}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex flex-col items-center gap-0.5">
                                  <span className="text-xs text-muted-foreground">{vehicle.listingDate.slice(5).replace("-", "/")}</span>
                                  <Badge variant="outline" className={`text-xs ${vehicle.daysOnMarket > 60 ? "border-destructive text-destructive" : vehicle.daysOnMarket > 30 ? "border-amber-400 text-amber-600" : "border-green-400 text-green-600"}`}>
                                    {vehicle.daysOnMarket}日
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex flex-col">
                                  <span className="font-bold">¥{calculatePaymentTotal(vehicle.price).toLocaleString()}</span>
                                  <span className="text-xs text-muted-foreground">本体 ¥{vehicle.price.toLocaleString()}</span>
                                  {vehicle.priceHistory.length >= 2 && (() => {
                                    const first = vehicle.priceHistory[0].price
                                    const drop = first - vehicle.price
                                    return drop > 0 ? <span className="text-[10px] text-destructive">累計 -{(drop / 10000).toFixed(0)}万値下</span> : null
                                  })()}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                {pd2 > 0 ? <span className="text-destructive text-sm font-medium">+{(pd2 / 10000).toFixed(0)}万</span> : pd2 < 0 ? <span className="text-green-600 text-sm font-medium">{(pd2 / 10000).toFixed(0)}万</span> : <span className="text-muted-foreground text-sm">同額</span>}
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

          {/* Competitor Chart Modal */}
          <Dialog open={compChartModalOpen} onOpenChange={setCompChartModalOpen}>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />競合店比較 価格推移グラフ</DialogTitle>
                <DialogDescription>自社 {selectedItem.model} {selectedItem.grade} と競合店（{competitors.length}台）の価格推移</DialogDescription>
              </DialogHeader>
              {(() => {
                const ownPrice = selectedItem.currentPrice
                const relevantComps = competitors.filter(c => c.price >= ownPrice * 0.4 && c.price <= ownPrice * 2.0)
                const ownByMonth = new Map<string, number>()
                selectedItem.priceHistory.forEach(p => { const k = p.date.slice(0, 2) + "/01"; if (TIMELINE.includes(k)) ownByMonth.set(k, p.price) })
                const compByMonthArr = relevantComps.map(c => {
                  const map = new Map<string, number>()
                  c.priceHistory.forEach(p => { const k = p.date.slice(0, 2) + "/01"; if (TIMELINE.includes(k)) map.set(k, p.price) })
                  return map
                })
                const ownMonths = TIMELINE.filter(m => ownByMonth.has(m))
                if (ownMonths.length === 0) return <p className="text-sm text-muted-foreground p-4">データがありません</p>
                const si = TIMELINE.indexOf(ownMonths[0])
                const active = TIMELINE.slice(si)
                let pOwn = ownByMonth.get(active[0]) ?? ownPrice
                const pComp = compByMonthArr.map(m => { for (const t of active) { if (m.has(t)) return m.get(t)! } return null })
                const chartData = active.map((month) => {
                  if (ownByMonth.has(month)) pOwn = ownByMonth.get(month)!
                  const prices: number[] = []
                  compByMonthArr.forEach((m, ci) => { if (m.has(month)) pComp[ci] = m.get(month)!; if (pComp[ci] !== null) prices.push(pComp[ci]!) })
                  return {
                    date: month.replace("/01", "月"), own: pOwn,
                    avgComp: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : pOwn,
                    minComp: prices.length > 0 ? Math.min(...prices) : pOwn,
                    maxComp: prices.length > 0 ? Math.max(...prices) : pOwn,
                  }
                })
                return (
                  <div className="space-y-4">
                    <div className="h-[340px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                          <Tooltip formatter={(value: number, name: string) => {
                            const label = name === "own" ? `自社 ${selectedItem.model} ${selectedItem.grade}` : name === "avgComp" ? "他社平均" : name === "minComp" ? "他社最安" : "他社最高"
                            return [`\u00A5${value.toLocaleString()}`, label]
                          }} />
                          <Line type="monotone" dataKey="own" name="own" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }} />
                          <Line type="monotone" dataKey="avgComp" name="avgComp" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#f59e0b", strokeWidth: 1, r: 3 }} />
                          <Line type="monotone" dataKey="minComp" name="minComp" stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" dot={{ fill: "#10b981", r: 2 }} />
                          <Line type="monotone" dataKey="maxComp" name="maxComp" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" dot={{ fill: "#ef4444", r: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 justify-center text-xs flex-wrap">
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5" style={{ backgroundColor: "#2563eb" }} /> 自社 {selectedItem.model} {selectedItem.grade}</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: "#f59e0b" }} /> 他社平均</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: "#10b981" }} /> 他社最安</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: "#ef4444" }} /> 他社最高</span>
                    </div>
                  </div>
                )
              })()}
            </DialogContent>
          </Dialog>

          {/* Area Chart Modal */}
          <Dialog open={areaChartModalOpen} onOpenChange={setAreaChartModalOpen}>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4" />エリア別比較 価格推移グラフ</DialogTitle>
                <DialogDescription>自社 {selectedItem.model} {selectedItem.grade} と{areaScope === "prefecture" ? OWN_STORE_AREA : areaScope === "kanto" ? "関東圏" : "全国"}（{areaVehicles.length}台）の価格推移</DialogDescription>
              </DialogHeader>
              {(() => {
                const ownPrice = selectedItem.currentPrice
                const relevantArea = areaVehicles.filter(c => c.price >= ownPrice * 0.4 && c.price <= ownPrice * 2.0)
                const ownByMonth = new Map<string, number>()
                selectedItem.priceHistory.forEach(p => { const k = p.date.slice(0, 2) + "/01"; if (TIMELINE.includes(k)) ownByMonth.set(k, p.price) })
                const areaByMonthArr = relevantArea.map(c => {
                  const map = new Map<string, number>()
                  c.priceHistory.forEach(p => { const k = p.date.slice(0, 2) + "/01"; if (TIMELINE.includes(k)) map.set(k, p.price) })
                  return map
                })
                const ownMonths = TIMELINE.filter(m => ownByMonth.has(m))
                if (ownMonths.length === 0) return <p className="text-sm text-muted-foreground p-4">データがありません</p>
                const si = TIMELINE.indexOf(ownMonths[0])
                const active = TIMELINE.slice(si)
                let pOwn = ownByMonth.get(active[0]) ?? ownPrice
                const pArea = areaByMonthArr.map(m => { for (const t of active) { if (m.has(t)) return m.get(t)! } return null })
                const chartData = active.map((month) => {
                  if (ownByMonth.has(month)) pOwn = ownByMonth.get(month)!
                  const prices: number[] = []
                  areaByMonthArr.forEach((m, ci) => { if (m.has(month)) pArea[ci] = m.get(month)!; if (pArea[ci] !== null) prices.push(pArea[ci]!) })
                  return {
                    date: month.replace("/01", "月"), own: pOwn,
                    avgArea: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : pOwn,
                    minArea: prices.length > 0 ? Math.min(...prices) : pOwn,
                    maxArea: prices.length > 0 ? Math.max(...prices) : pOwn,
                  }
                })
                return (
                  <div className="space-y-4">
                    <div className="h-[340px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`} tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                          <Tooltip formatter={(value: number, name: string) => {
                            const label = name === "own" ? `自社 ${selectedItem.model} ${selectedItem.grade}` : name === "avgArea" ? "エリア平均" : name === "minArea" ? "エリア最安" : "エリア最高"
                            return [`\u00A5${value.toLocaleString()}`, label]
                          }} />
                          <Line type="monotone" dataKey="own" name="own" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }} />
                          <Line type="monotone" dataKey="avgArea" name="avgArea" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#f59e0b", strokeWidth: 1, r: 3 }} />
                          <Line type="monotone" dataKey="minArea" name="minArea" stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" dot={{ fill: "#10b981", r: 2 }} />
                          <Line type="monotone" dataKey="maxArea" name="maxArea" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" dot={{ fill: "#ef4444", r: 2 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 justify-center text-xs flex-wrap">
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5" style={{ backgroundColor: "#2563eb" }} /> 自社 {selectedItem.model} {selectedItem.grade}</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: "#f59e0b" }} /> エリア平均</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: "#10b981" }} /> エリア最安</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5 border-t border-dashed" style={{ borderColor: "#ef4444" }} /> エリア最高</span>
                    </div>
                  </div>
                )
              })()}
            </DialogContent>
          </Dialog>

          {/* Individual Vehicle Chart Modal */}
          <Dialog open={individualChartVehicle !== null} onOpenChange={(open) => { if (!open) setIndividualChartVehicle(null) }}>
            <DialogContent className="sm:max-w-3xl">
              {individualChartVehicle && (() => {
                const v = individualChartVehicle
                // Show months based on the clicked vehicle's listing period only
                const monthsToShow = Math.min(Math.max(1, Math.ceil(v.daysOnMarket / 30)), TIMELINE.length)

                // Build price maps (only within TIMELINE range)
                const ownByMonth = new Map<string, number>()
                selectedItem.priceHistory.forEach(p => { const k = p.date.slice(0, 2) + "/01"; if (TIMELINE.includes(k)) ownByMonth.set(k, p.price) })
                const compByMonth = new Map<string, number>()
                v.priceHistory.forEach(p => { const k = p.date.slice(0, 2) + "/01"; if (TIMELINE.includes(k)) compByMonth.set(k, p.price) })

                const allKeys = new Set([...ownByMonth.keys(), ...compByMonth.keys()])
                if (allKeys.size === 0) return <p className="text-sm text-muted-foreground p-4">データがありません</p>

                // End at current month, go back monthsToShow
                const startIdx = Math.max(0, CURRENT_MONTH_IDX - monthsToShow + 1)
                const range = TIMELINE.slice(startIdx, CURRENT_MONTH_IDX + 1)

                let pOwn = ownByMonth.get(range[0]) ?? selectedItem.currentPrice
                let pComp = compByMonth.get(range[0]) ?? v.price
                const mergedData = range.map(month => {
                  if (ownByMonth.has(month)) pOwn = ownByMonth.get(month)!
                  if (compByMonth.has(month)) pComp = compByMonth.get(month)!
                  return { date: month.replace("/01", "月"), own: pOwn, competitor: pComp }
                })
                const ownLabel = `自社 ${selectedItem.model} ${selectedItem.grade}`
                const compLabel = `${v.competitorName} ${v.model} ${v.grade}`
                return (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-base">
                        <TrendingUp className="h-4 w-4" />
                        価格推移比較
                      </DialogTitle>
                      <DialogDescription className="text-xs">
                        {v.competitorName} / {v.model} {v.grade} / {v.year}年{v.month}月 / {v.mileage.toLocaleString()}km / {v.inspection} / 在庫{v.daysOnMarket}日
                      </DialogDescription>
                    </DialogHeader>
                    <div className="h-[340px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mergedData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                          <YAxis tickFormatter={(val) => `${(val / 10000).toFixed(0)}万`} tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                          <Tooltip formatter={(value: number, name: string) => [
                            `\u00A5${value.toLocaleString()}`,
                            name === "own" ? ownLabel : compLabel
                          ]} />
                          <Line type="monotone" dataKey="own" name="own" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }} />
                          <Line type="monotone" dataKey="competitor" name="competitor" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 justify-center text-xs flex-wrap">
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5" style={{ backgroundColor: "#2563eb" }} /> {ownLabel}</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 h-0.5" style={{ backgroundColor: "#f59e0b" }} /> {compLabel}</span>
                    </div>
                  </>
                )
              })()}
            </DialogContent>
          </Dialog>


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
              <CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4 text-emerald-600" />追従��象を選択</CardTitle>
              <CardDescription className="text-xs">価格変動に追従したい競合車両を選んでください</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ScrollArea className="h-[400px]">
                {competitors.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <Car className="h-12 w-12 mb-2 opacity-30" /><p className="text-sm">同型式の競合車両がありません</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {competitors.map((vehicle) => {
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
                              <p className="text-xs text-muted-foreground">{vehicle.grade} / {vehicle.year}年{vehicle.month}月 / {vehicle.mileage.toLocaleString()}km</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className={`text-[9px] h-4 ${vehicle.daysOnMarket > 60 ? "border-destructive text-destructive" : vehicle.daysOnMarket > 30 ? "border-amber-400 text-amber-600" : "border-green-400 text-green-600"}`}>在庫{vehicle.daysOnMarket}日</Badge>
                                <span className="text-[10px] text-muted-foreground">{vehicle.inspection}</span>
                              </div>
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
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{selectedTrackingTarget.competitorName}</p>
                        <p className="text-sm text-muted-foreground">{selectedTrackingTarget.manufacturer} {selectedTrackingTarget.model} {selectedTrackingTarget.grade}</p>
                        <p className="text-xs text-muted-foreground mt-1">{selectedTrackingTarget.year}年{selectedTrackingTarget.month}月 / {selectedTrackingTarget.mileage.toLocaleString()}km / {selectedTrackingTarget.color}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{selectedTrackingTarget.transmission}/{selectedTrackingTarget.drivetrain}</span>
                          <span>{selectedTrackingTarget.inspection}</span>
                          <Badge variant="outline" className={`text-[9px] h-4 ${selectedTrackingTarget.daysOnMarket > 60 ? "border-destructive text-destructive" : selectedTrackingTarget.daysOnMarket > 30 ? "border-amber-400 text-amber-600" : "border-green-400 text-green-600"}`}>在庫{selectedTrackingTarget.daysOnMarket}日</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">支払総額</p>
                        <p className="text-xl font-bold text-emerald-700">¥{calculatePaymentTotal(selectedTrackingTarget.price).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">本体 ¥{selectedTrackingTarget.price.toLocaleString()}</p>
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
                  <Label>{trackingOffsetType === "fixed" ? "���格差（円）" : "価格差（%）"}</Label>
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
                    <Alert className="bg-amber-50 border-amber-300"><AlertTriangle className="h-4 w-4 text-amber-600" /><AlertDescription className="text-sm">追従価格が下限を下回るため、下限総額 ¥{Number(trackingMinPrice).toLocaleString()} が適用��れます</AlertDescription></Alert>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5"><Label>自動追��を有効化</Label><p className="text-xs text-muted-foreground">相手���価格変更したら自動で追従</p></div>
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
