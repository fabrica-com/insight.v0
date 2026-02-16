"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, TrendingDown, Minus, Filter, BarChart3, X, ChevronRight, Calendar, Car, Gauge, Clock, ArrowDownRight } from "lucide-react"
import { Label } from "@/components/ui/label"

// メーカーと車種のデータ
const manufacturers = {
  domestic: [
    { id: "toyota", name: "トヨタ" },
    { id: "honda", name: "ホンダ" },
    { id: "nissan", name: "日産" },
    { id: "mazda", name: "マツダ" },
    { id: "subaru", name: "スバル" },
    { id: "suzuki", name: "スズキ" },
    { id: "daihatsu", name: "ダイハツ" },
    { id: "mitsubishi", name: "三菱" },
  ],
  imported: [
    { id: "bmw", name: "BMW" },
    { id: "mercedes", name: "メルセデス・ベンツ" },
    { id: "audi", name: "アウディ" },
    { id: "volkswagen", name: "フォルクスワーゲン" },
    { id: "porsche", name: "ポルシェ" },
    { id: "volvo", name: "ボルボ" },
    { id: "mini", name: "MINI" },
    { id: "jeep", name: "ジープ" },
  ],
}

const vehicleModels: Record<string, { id: string; name: string; models: { id: string; name: string; grades: string[] }[] }[]> = {
  toyota: [
    { id: "prius", name: "プリウス", models: [
      { id: "prius-60", name: "60系 (2023-)", grades: ["S", "A", "Aプレミアム", "G", "Z"] },
      { id: "prius-50", name: "50系 (2015-2023)", grades: ["S", "A", "Aプレミアム", "E"] },
    ]},
    { id: "alphard", name: "アルファード", models: [
      { id: "alphard-40", name: "40系 (2023-)", grades: ["Z", "Z Premium", "Executive Lounge"] },
      { id: "alphard-30", name: "30系 (2015-2023)", grades: ["S", "SC", "Executive Lounge", "S Cパッケージ"] },
    ]},
    { id: "harrier", name: "ハリアー", models: [
      { id: "harrier-80", name: "80系 (2020-)", grades: ["S", "G", "Z", "Z Leather Package"] },
    ]},
    { id: "landcruiser", name: "ランドクルーザー", models: [
      { id: "lc-300", name: "300系 (2021-)", grades: ["GX", "AX", "VX", "ZX", "GR SPORT"] },
      { id: "lc-250", name: "250系 (2024-)", grades: ["GX", "VX", "ZX"] },
    ]},
    { id: "crown", name: "クラウン", models: [
      { id: "crown-16", name: "16代目 (2022-)", grades: ["Crossover RS", "Crossover G", "Sport RS", "Sedan"] },
    ]},
  ],
  honda: [
    { id: "nbox", name: "N-BOX", models: [
      { id: "nbox-3", name: "3代目 (2023-)", grades: ["G", "L", "EX", "Custom L", "Custom EX"] },
      { id: "nbox-2", name: "2代目 (2017-2023)", grades: ["G", "L", "EX", "Custom G", "Custom L"] },
    ]},
    { id: "freed", name: "フリード", models: [
      { id: "freed-3", name: "3代目 (2024-)", grades: ["G", "CROSSTAR", "Modulo X"] },
    ]},
    { id: "vezel", name: "ヴェゼル", models: [
      { id: "vezel-2", name: "2代目 (2021-)", grades: ["G", "e:HEV X", "e:HEV Z", "e:HEV PLaY"] },
    ]},
    { id: "stepwgn", name: "ステップワゴン", models: [
      { id: "stepwgn-6", name: "6代目 (2022-)", grades: ["AIR", "SPADA", "SPADA Premium Line"] },
    ]},
  ],
  bmw: [
    { id: "3series", name: "3シリーズ", models: [
      { id: "3series-g20", name: "G20/G21 (2019-)", grades: ["318i", "320i", "330i", "M340i", "320d"] },
    ]},
    { id: "5series", name: "5シリーズ", models: [
      { id: "5series-g60", name: "G60 (2023-)", grades: ["520i", "530i", "540i", "M550i"] },
    ]},
    { id: "x3", name: "X3", models: [
      { id: "x3-g45", name: "G45 (2024-)", grades: ["xDrive20i", "xDrive30i", "M40i"] },
    ]},
    { id: "x5", name: "X5", models: [
      { id: "x5-g05", name: "G05 (2019-)", grades: ["xDrive35d", "xDrive45e", "M50i"] },
    ]},
  ],
  mercedes: [
    { id: "cclass", name: "Cクラス", models: [
      { id: "cclass-w206", name: "W206 (2021-)", grades: ["C180", "C200", "C220d", "C300", "AMG C43"] },
    ]},
    { id: "eclass", name: "Eクラス", models: [
      { id: "eclass-w214", name: "W214 (2023-)", grades: ["E200", "E300", "E350", "AMG E53"] },
    ]},
    { id: "glc", name: "GLC", models: [
      { id: "glc-x254", name: "X254 (2022-)", grades: ["GLC200", "GLC220d", "GLC300", "AMG GLC43"] },
    ]},
  ],
}

// 走行距離フィルターオプション
const mileageOptions = [
  { id: "under5k", label: "0.5万km未満/年", value: "under5k" },
  { id: "5k-10k", label: "0.5〜1万km/年", value: "5k-10k" },
  { id: "10k-15k", label: "1〜1.5万km/年", value: "10k-15k" },
  { id: "15k-20k", label: "1.5〜2万km/年", value: "15k-20k" },
  { id: "over100k", label: "10万km以上", value: "over100k" },
]

// 過去24ヶ月の週次相場データを生成
const generateWeeklyPriceHistory = (basePrice: number, volatility: number = 0.02) => {
  const weeks = []
  const now = new Date()
  let avgPrice = basePrice
  const totalWeeks = 104 // 約24ヶ月分

  for (let i = totalWeeks - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
    const weekStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`
    
    // 週次の価格変動をシミュレート
    const change = (Math.random() - 0.5) * volatility
    avgPrice = avgPrice * (1 + change)
    const highPrice = avgPrice * (1.1 + Math.random() * 0.1)
    const lowPrice = avgPrice * (0.8 + Math.random() * 0.1)

    weeks.push({
      week: weekStr,
      average: Math.round(avgPrice),
      top20: Math.round(highPrice),
      bottom20: Math.round(lowPrice),
    })
  }
  return weeks
}

const weeklyPriceHistoryData = generateWeeklyPriceHistory(3500000)

// 相場サマリー統計データ（実データから算出）
const newCarPrice = 5200000
const currentAvg = weeklyPriceHistoryData[weeklyPriceHistoryData.length - 1].average
const avg2yAgo = weeklyPriceHistoryData[0].average // 104週前 = 約2年前
const avg1yAgo = weeklyPriceHistoryData[52].average // 52週前 = 約1年前
const avg6mAgo = weeklyPriceHistoryData[78].average // 78週前 = 約半年前

const marketSummaryStats = {
  avgInventoryDays: 42, // 平均在庫期間（日）
  newCarPrice,
  currentAvgPrice: currentAvg,
  depreciationFromNew: Math.round(((currentAvg - newCarPrice) / newCarPrice) * 1000) / 10,
  depreciation2y: Math.round(((currentAvg - avg2yAgo) / avg2yAgo) * 1000) / 10,
  depreciation1y: Math.round(((currentAvg - avg1yAgo) / avg1yAgo) * 1000) / 10,
  depreciation6m: Math.round(((currentAvg - avg6mAgo) / avg6mAgo) * 1000) / 10,
}

// グレード別の下落率データを生成（過去2年前を起点、週次平均値のみ）
const gradeColors = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"]
const generateGradeDepreciationData = (grades: string[]) => {
  const totalWeeks = 104
  const data = []
  // グレードごとの初期値と変動率
  const gradeParams = grades.map((_, idx) => ({
    rate: 0, // 0%から開始
    volatility: 0.003 + idx * 0.001,
    trend: -(0.1 + idx * 0.03) / totalWeeks, // グレードごとに異なる下落トレンド
  }))

  for (let i = 0; i < totalWeeks; i++) {
    const date = new Date(Date.now() - (totalWeeks - 1 - i) * 7 * 24 * 60 * 60 * 1000)
    const weekStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`
    const point: Record<string, string | number> = { week: weekStr }

    grades.forEach((grade, idx) => {
      const noise = (Math.random() - 0.5) * gradeParams[idx].volatility
      gradeParams[idx].rate += gradeParams[idx].trend + noise
      point[grade] = Math.round(gradeParams[idx].rate * 1000) / 10 // %表示
    })
    data.push(point)
  }
  return data
}

// デフォルトのグレード別データ（アルファード30系のグレードをデフォルト表示用）
const defaultGrades = ["S", "SC", "Executive Lounge", "S Cパッケージ"]
const defaultGradeDepreciationData = generateGradeDepreciationData(defaultGrades)

// 変動率に連動した価格履歴を生成（開始価格から終了価格への推移）
const generateLinkedPriceHistory = (startPrice: number, endPrice: number, months: number) => {
  const history = []
  const now = new Date()
  const totalChange = endPrice - startPrice
  const basePrice = (startPrice + endPrice) / 2
  
  // よりリアルな変動パターンを生成
  // シード値を使って一貫した波形を生成
  const waveAmplitude = basePrice * 0.08 // 価格の8%程度の振幅
  const waveFrequency = 2 + Math.random() * 2 // 2-4サイクル
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}`
    
    // 進捗率（0〜1）
    const progress = (months - 1 - i) / (months - 1)
    
    // ベースとなるトレンドライン
    const trendValue = startPrice + totalChange * progress
    
    // 波形による変動（サイン波 + ランダムノイズ）
    const waveValue = Math.sin(progress * Math.PI * waveFrequency) * waveAmplitude
    const randomNoise = (Math.random() - 0.5) * basePrice * 0.04 // 4%のランダムノイズ
    
    // 季節要因（夏と冬で価格変動）
    const monthIndex = (now.getMonth() - i + 12) % 12
    const seasonalFactor = Math.sin((monthIndex / 12) * Math.PI * 2) * basePrice * 0.03
    
    const avgPrice = trendValue + waveValue + randomNoise + seasonalFactor
    
    // 上位20%と下位20%の価格（平均価格を基準に変動）
    const top20 = avgPrice * (1.15 + Math.random() * 0.08)
    const bottom20 = avgPrice * (0.82 + Math.random() * 0.06)

    history.push({
      month: monthStr,
      average: Math.round(avgPrice),
      top20: Math.round(top20),
      bottom20: Math.round(bottom20),
    })
  }
  return history
}

// ランキングデータ（100車種）
// 階層: メーカー > 車種 > モデル > 型式 > グレード
// ランキングではモデルまでを表示
const generateRankingData = () => {
  const rankingData = []
  const allModels = [
    // メーカー, 車種, モデル, カテゴリ, タイプ
    { maker: "トヨタ", carName: "ランドクルーザー", model: "300系", category: "domestic", type: "SUV" },
    { maker: "トヨタ", carName: "アルファード", model: "40系", category: "domestic", type: "ミニバン" },
    { maker: "ポルシェ", carName: "911", model: "992型", category: "imported", type: "スポーツ" },
    { maker: "トヨタ", carName: "ハリアー", model: "80系", category: "domestic", type: "SUV" },
    { maker: "レクサス", carName: "LX", model: "600系", category: "domestic", type: "SUV" },
    { maker: "メルセデス", carName: "Gクラス", model: "W463", category: "imported", type: "SUV" },
    { maker: "トヨタ", carName: "プリウス", model: "60系", category: "domestic", type: "セダン" },
    { maker: "ホンダ", carName: "N-BOX", model: "JF5/6型", category: "kei", type: "軽自動車" },
    { maker: "スズキ", carName: "ジムニー", model: "JB64W型", category: "kei", type: "軽自動車" },
    { maker: "ダイハツ", carName: "タント", model: "LA650S型", category: "kei", type: "軽自動車" },
    { maker: "BMW", carName: "X5", model: "G05", category: "imported", type: "SUV" },
    { maker: "アウディ", carName: "Q7", model: "4M", category: "imported", type: "SUV" },
    { maker: "日産", carName: "GT-R", model: "R35", category: "domestic", type: "スポーツ" },
    { maker: "マツダ", carName: "CX-5", model: "KF系", category: "domestic", type: "SUV" },
    { maker: "スバル", carName: "レヴォーグ", model: "VN系", category: "domestic", type: "ワゴン" },
    { maker: "トヨタ", carName: "ヴェルファイア", model: "40系", category: "domestic", type: "ミニバン" },
    { maker: "ホンダ", carName: "ステップワゴン", model: "RP6/7/8型", category: "domestic", type: "ミニバン" },
    { maker: "日産", carName: "セレナ", model: "C28系", category: "domestic", type: "ミニバン" },
    { maker: "BMW", carName: "3シリーズ", model: "G20", category: "imported", type: "セダン" },
    { maker: "メルセデス", carName: "Cクラス", model: "W206", category: "imported", type: "セダン" },
    { maker: "トヨタ", carName: "RAV4", model: "50系", category: "domestic", type: "SUV" },
    { maker: "トヨタ", carName: "ヤリスクロス", model: "MXPB/MXPJ系", category: "domestic", type: "SUV" },
    { maker: "トヨタ", carName: "カローラクロス", model: "ZSG/ZVG系", category: "domestic", type: "SUV" },
    { maker: "トヨタ", carName: "シエンタ", model: "MXPC/MXPL系", category: "domestic", type: "ミニバン" },
    { maker: "トヨタ", carName: "ノア", model: "90系", category: "domestic", type: "ミニバン" },
    { maker: "トヨタ", carName: "ヴォクシー", model: "90系", category: "domestic", type: "ミニバン" },
    { maker: "ホンダ", carName: "フィット", model: "GR系", category: "domestic", type: "コンパクト" },
    { maker: "ホンダ", carName: "ヴェゼル", model: "RV系", category: "domestic", type: "SUV" },
    { maker: "ホンダ", carName: "シビック", model: "FL系", category: "domestic", type: "セダン" },
    { maker: "日産", carName: "ノート", model: "E13系", category: "domestic", type: "コンパクト" },
    { maker: "日産", carName: "エクストレイル", model: "T33系", category: "domestic", type: "SUV" },
    { maker: "日産", carName: "アリア", model: "FE0型", category: "domestic", type: "SUV" },
    { maker: "マツダ", carName: "CX-60", model: "KH系", category: "domestic", type: "SUV" },
    { maker: "マツダ", carName: "CX-8", model: "KG系", category: "domestic", type: "SUV" },
    { maker: "マツダ", carName: "MAZDA3", model: "BP系", category: "domestic", type: "セダン" },
    { maker: "スバル", carName: "フォレスター", model: "SK系", category: "domestic", type: "SUV" },
    { maker: "スバル", carName: "アウトバック", model: "BT系", category: "domestic", type: "ワゴン" },
    { maker: "三菱", carName: "アウトランダー", model: "GN系", category: "domestic", type: "SUV" },
    { maker: "三菱", carName: "デリカD:5", model: "CV系", category: "domestic", type: "ミニバン" },
    { maker: "スズキ", carName: "スペーシア", model: "MK53S型", category: "kei", type: "軽自動車" },
    { maker: "スズキ", carName: "ハスラー", model: "MR52S型", category: "kei", type: "軽自動車" },
    { maker: "スズキ", carName: "ワゴンR", model: "MH95S型", category: "kei", type: "軽自動車" },
    { maker: "ダイハツ", carName: "ムーヴキャンバス", model: "LA850S型", category: "kei", type: "軽自動車" },
    { maker: "ダイハツ", carName: "ロッキー", model: "A200S型", category: "domestic", type: "SUV" },
    { maker: "BMW", carName: "5シリーズ", model: "G30", category: "imported", type: "セダン" },
    { maker: "BMW", carName: "X3", model: "G01", category: "imported", type: "SUV" },
    { maker: "BMW", carName: "X1", model: "U11", category: "imported", type: "SUV" },
    { maker: "メルセデス", carName: "Eクラス", model: "W214", category: "imported", type: "セダン" },
    { maker: "メルセデス", carName: "GLC", model: "X254", category: "imported", type: "SUV" },
    { maker: "メルセデス", carName: "GLE", model: "V167", category: "imported", type: "SUV" },
    { maker: "アウディ", carName: "A4", model: "B9", category: "imported", type: "セダン" },
    { maker: "アウディ", carName: "A6", model: "C8", category: "imported", type: "セダン" },
    { maker: "アウディ", carName: "Q5", model: "FY", category: "imported", type: "SUV" },
    { maker: "フォルクスワーゲン", carName: "ゴルフ", model: "8型", category: "imported", type: "コンパクト" },
    { maker: "フォルクスワーゲン", carName: "ティグアン", model: "AD1", category: "imported", type: "SUV" },
    { maker: "ボルボ", carName: "XC60", model: "UB420", category: "imported", type: "SUV" },
    { maker: "ボルボ", carName: "XC90", model: "LB420", category: "imported", type: "SUV" },
    { maker: "ボルボ", carName: "V60", model: "ZB420", category: "imported", type: "ワゴン" },
    { maker: "MINI", carName: "クーパー", model: "F56", category: "imported", type: "コンパクト" },
    { maker: "MINI", carName: "クロスオーバー", model: "F60", category: "imported", type: "SUV" },
    { maker: "ジープ", carName: "ラングラー", model: "JL", category: "imported", type: "SUV" },
    { maker: "ジープ", carName: "グランドチェロキー", model: "WL", category: "imported", type: "SUV" },
    { maker: "ポルシェ", carName: "カイエン", model: "E3", category: "imported", type: "SUV" },
    { maker: "ポルシェ", carName: "マカン", model: "95B", category: "imported", type: "SUV" },
    { maker: "レクサス", carName: "RX", model: "450h+", category: "domestic", type: "SUV" },
    { maker: "レクサス", carName: "NX", model: "350h", category: "domestic", type: "SUV" },
    { maker: "レクサス", carName: "IS", model: "300h", category: "domestic", type: "セダン" },
    { maker: "トヨタ", carName: "GRヤリス", model: "GXPA16型", category: "domestic", type: "スポーツ" },
    { maker: "トヨタ", carName: "GR86", model: "ZN8型", category: "domestic", type: "スポーツ" },
    { maker: "スバル", carName: "BRZ", model: "ZD8型", category: "domestic", type: "スポーツ" },
    { maker: "ホンダ", carName: "シビック タイプR", model: "FL5型", category: "domestic", type: "スポーツ" },
    { maker: "日産", carName: "フェアレディZ", model: "RZ34型", category: "domestic", type: "スポーツ" },
    { maker: "スズキ", carName: "アルト", model: "HA37S型", category: "kei", type: "軽自動車" },
    { maker: "ダイハ���", carName: "ミライース", model: "LA350S型", category: "kei", type: "軽自動車" },
    { maker: "ホンダ", carName: "N-WGN", model: "JH3/4型", category: "kei", type: "軽自動車" },
    { maker: "日産", carName: "デイズ", model: "B40W型", category: "kei", type: "軽自動車" },
    { maker: "三菱", carName: "eKクロス", model: "B30W型", category: "kei", type: "軽自動車" },
    { maker: "スズキ", carName: "エブリイワゴン", model: "DA17W型", category: "kei", type: "軽自動車" },
    { maker: "ダイハツ", carName: "アトレー", model: "S700V型", category: "kei", type: "軽自動車" },
    { maker: "トヨタ", carName: "ピクシスメガ", model: "LA700A型", category: "kei", type: "軽自動車" },
    { maker: "BMW", carName: "iX", model: "i20", category: "imported", type: "SUV" },
    { maker: "BMW", carName: "i4", model: "G26", category: "imported", type: "セダン" },
    { maker: "メルセデス", carName: "EQS", model: "V297", category: "imported", type: "セダン" },
    { maker: "アウディ", carName: "e-tron GT", model: "F83", category: "imported", type: "セダン" },
    { maker: "ポルシェ", carName: "タイカン", model: "Y1A", category: "imported", type: "セダン" },
    { maker: "テスラ", carName: "モデル3", model: "Highland", category: "imported", type: "セダン" },
    { maker: "テスラ", carName: "モデルY", model: "MYAWD", category: "imported", type: "SUV" },
    { maker: "ヒョンデ", carName: "IONIQ 5", model: "NE1", category: "imported", type: "SUV" },
    { maker: "BYD", carName: "ATTO 3", model: "EA1", category: "imported", type: "SUV" },
    { maker: "トヨタ", carName: "bZ4X", model: "XEAM10型", category: "domestic", type: "SUV" },
    { maker: "日産", carName: "リーフ", model: "ZE1型", category: "domestic", type: "コンパクト" },
    { maker: "日産", carName: "サクラ", model: "B6AW型", category: "kei", type: "軽自動車" },
    { maker: "三菱", carName: "eKクロスEV", model: "B5AW型", category: "kei", type: "軽自動車" },
    { maker: "ホンダ", carName: "ZR-V", model: "RZ系", category: "domestic", type: "SUV" },
    { maker: "マツダ", carName: "MX-30", model: "DR系", category: "domestic", type: "SUV" },
    { maker: "レクサス", carName: "RZ", model: "450e", category: "domestic", type: "SUV" },
    { maker: "レクサス", carName: "UX", model: "300e", category: "domestic", type: "SUV" },
  ]

  const allVehicles = Object.keys(vehicleModels).reduce((acc, maker) => {
    return acc.concat(vehicleModels[maker])
  }, [])

  for (let i = 0; i < allModels.length; i++) {
    const vehicle = allModels[i]
    
    // 中古車は基本的に下落傾向。上位2車種のみ上昇、それ以外は下落
    let changeRate: number
    if (i === 0) {
      // 1位: 人気車種で上昇 (+3% ~ +8%)
      changeRate = 3 + Math.random() * 5
    } else if (i === 1) {
      // 2位: わずかに上昇 (+0.5% ~ +3%)
      changeRate = 0.5 + Math.random() * 2.5
    } else {
      // 3位以降: 下落 (-2% ~ -15%)
      // 順位が低いほど下落幅が大きくなる傾向
      const baseDecline = -2 - (i / allVehicles.length) * 8
      changeRate = baseDecline - Math.random() * 5
    }
    
    const avgPrice = Math.round(200 + Math.random() * 800) // 200万〜1000万円
    
    // 変動率に基づいて12ヶ月の価格履歴を生成
    const startPrice = avgPrice * 10000 / (1 + changeRate / 100)
    const endPrice = avgPrice * 10000
    const priceHistory = generateLinkedPriceHistory(startPrice, endPrice, 12)

    // 価格履歴から最高値・最安値を計算
    const allAverages = priceHistory.map(p => p.average)
    const allTop20 = priceHistory.map(p => p.top20)
    const allBottom20 = priceHistory.map(p => p.bottom20)
    
    rankingData.push({
      rank: i + 1,
      ...vehicle,
      avgPrice: avgPrice,
      changeRate: parseFloat(changeRate.toFixed(1)),
      volume: Math.round(50 + Math.random() * 500),
      priceHistory: priceHistory,
      // 詳細データ
      details: {
        yearStart: Math.round(priceHistory[0].average / 10000),
        yearEnd: Math.round(priceHistory[priceHistory.length - 1].average / 10000),
        highestPrice: Math.round(Math.max(...allTop20) / 10000),
        lowestPrice: Math.round(Math.min(...allBottom20) / 10000),
        avgMileage: Math.round(30000 + Math.random() * 50000),
        avgYear: 2020 + Math.floor(Math.random() * 4),
        monthlyVolume: Array.from({ length: 12 }, () => Math.round(10 + Math.random() * 50)),
      }
    })
  }

  // 下落が少ない順（上昇が多い順）にソート
  return rankingData.sort((a, b) => b.changeRate - a.changeRate).map((item, index) => ({
    ...item,
    rank: index + 1,
  }))
}

const rankingData = generateRankingData()

export function MarketTrends() {
  const [activeTab, setActiveTab] = useState<"trends" | "ranking">("trends")
  const [selectedMaker, setSelectedMaker] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedModelType, setSelectedModelType] = useState<string>("")
  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [selectedMileages, setSelectedMileages] = useState<string[]>(mileageOptions.map(o => o.value))
  const [allMileagesSelected, setAllMileagesSelected] = useState(true)
  const [showChart, setShowChart] = useState(false)

  // ランキングフィルター
  const [rankingCategory, setRankingCategory] = useState<string>("all")
  const [rankingMaker, setRankingMaker] = useState<string>("all")
  
  // 詳細表示用
  const [selectedVehicle, setSelectedVehicle] = useState<typeof rankingData[0] | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // メーカーリスト（国産＋輸入）
  const allMakers = [...manufacturers.domestic, ...manufacturers.imported]

  // 選択されたメーカーの車種リスト
  const availableVehicles = selectedMaker ? vehicleModels[selectedMaker] || [] : []

  // 選択された車種のモデルリスト
  const availableModelTypes = selectedModel
    ? availableVehicles.find(m => m.id === selectedModel)?.models || []
    : []

  // 選択されたモデルのグレードリ���ト
  const availableGrades = selectedModelType
    ? availableModelTypes.find(m => m.id === selectedModelType)?.grades || []
    : []

  // グレード別下落率データ（選択されたモデルに連動）
  const gradeDepreciationData = useMemo(() => {
    if (availableGrades.length > 0) {
      return generateGradeDepreciationData(availableGrades)
    }
    return defaultGradeDepreciationData
  }, [availableGrades])

  const displayGrades = availableGrades.length > 0 ? availableGrades : defaultGrades

  // 走行距離フィルターの処理
  const handleAllMileagesChange = (checked: boolean) => {
    setAllMileagesSelected(checked)
    if (checked) {
      setSelectedMileages(mileageOptions.map(o => o.value))
    } else {
      setSelectedMileages([])
    }
  }

  const handleMileageChange = (value: string, checked: boolean) => {
    if (checked) {
      const newSelected = [...selectedMileages, value]
      setSelectedMileages(newSelected)
      if (newSelected.length === mileageOptions.length) {
        setAllMileagesSelected(true)
      }
    } else {
      const newSelected = selectedMileages.filter(v => v !== value)
      setSelectedMileages(newSelected)
      setAllMileagesSelected(false)
    }
  }

  // ランキングのフィルタリング
  const filteredRanking = useMemo(() => {
    return rankingData.filter(item => {
      if (rankingCategory !== "all" && item.category !== rankingCategory) return false
      if (rankingMaker !== "all" && item.maker !== rankingMaker) return false
      return true
    })
  }, [rankingCategory, rankingMaker])

  // ユニークなメーカーリスト
  const uniqueMakers = useMemo(() => {
    const makers = new Set(rankingData.map(item => item.maker))
    return Array.from(makers).sort()
  }, [])

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight">車種別相場推移</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">過去2年間の相場推移とリセールバリューランキング</p>
      </div>

      {/* タブ */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "trends" | "ranking")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            相場推移
          </TabsTrigger>
          <TabsTrigger value="ranking" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            リセールランキング
          </TabsTrigger>
        </TabsList>

        {/* 相場推移タブ */}
        <TabsContent value="trends" className="space-y-6">
          {/* フィルター */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                車両絞り込み
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* メーカー選択 */}
                <div className="space-y-2">
                  <Label>メーカー</Label>
                  <Select value={selectedMaker} onValueChange={(v) => {
                    setSelectedMaker(v)
                    setSelectedModel("")
                    setSelectedModelType("")
                    setSelectedVariant("")
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="メーカーを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">国産車</div>
                      {manufacturers.domestic.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">輸入車</div>
                      {manufacturers.imported.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 車種選択 */}
                <div className="space-y-2">
                  <Label>車種</Label>
                  <Select 
                    value={selectedModel} 
                    onValueChange={(v) => {
                      setSelectedModel(v)
                      setSelectedModelType("")
                      setSelectedVariant("")
                    }}
                    disabled={!selectedMaker || selectedMaker === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="車種を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {availableVehicles.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* モデル選択 */}
                <div className="space-y-2">
                  <Label>モデル</Label>
                  <Select 
                    value={selectedModelType} 
                    onValueChange={(v) => {
                      setSelectedModelType(v)
                      setSelectedVariant("")
                    }}
                    disabled={!selectedModel || selectedModel === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="モデルを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {availableModelTypes.map(m => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* グレード選択 */}
                <div className="space-y-2">
                  <Label>グレード</Label>
                  <Select 
                    value={selectedVariant} 
                    onValueChange={setSelectedVariant}
                    disabled={!selectedModelType || selectedModelType === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="グレードを選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {availableGrades.map(v => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 走行距離フィルター */}
              <div className="mt-6 space-y-3">
                <Label>走行距離フィルター</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="all-mileage" 
                      checked={allMileagesSelected}
                      onCheckedChange={handleAllMileagesChange}
                    />
                    <label htmlFor="all-mileage" className="text-sm font-medium">
                      すべて
                    </label>
                  </div>
                  <div className="h-6 w-px bg-border" />
                  {mileageOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={option.id}
                        checked={selectedMileages.includes(option.value)}
                        onCheckedChange={(checked) => handleMileageChange(option.value, checked as boolean)}
                      />
                      <label htmlFor={option.id} className="text-sm">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <div className="flex justify-center border-t border-border px-6 py-4">
              <Button 
                size="lg"
                onClick={() => setShowChart(true)}
                className="gap-2 px-8"
              >
                <BarChart3 className="h-4 w-4" />
                相場情報を見る
              </Button>
            </div>
          </Card>

          {/* 相場グラフ（ボタン押下後に表示） */}
          {showChart && (<>
          <Card>
            <CardHeader>
              <CardTitle>過去24ヶ月の相場推移（週次平均）</CardTitle>
              <CardDescription>
                週次の平均値、上位20%平均、下位20%平均を表示
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyPriceHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => {
                        const parts = value.split("/")
                        return `${parts[0].slice(2)}/${parts[1]}`
                      }}
                      interval={7}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                      domain={["dataMin - 500000", "dataMax + 500000"]}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${(value / 10000).toFixed(1)}万円`, ""]}
                      labelFormatter={(label) => `週: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="stepAfter" 
                      dataKey="top20" 
                      name="上位20%平均" 
                      stroke="#22c55e" 
                      strokeWidth={1.5}
                      dot={false}
                    />
                    <Line 
                      type="stepAfter" 
                      dataKey="average" 
                      name="全体平均" 
                      stroke="#3b82f6" 
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line 
                      type="stepAfter" 
                      dataKey="bottom20" 
                      name="下位20%平均" 
                      stroke="#f97316" 
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* サマリー */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-green-500/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground">上位20%平均</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(weeklyPriceHistoryData[weeklyPriceHistoryData.length - 1].top20 / 10000).toFixed(0)}万円
                  </p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground">全体平均</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(weeklyPriceHistoryData[weeklyPriceHistoryData.length - 1].average / 10000).toFixed(0)}万円
                  </p>
                </div>
                <div className="rounded-lg bg-orange-500/10 p-4 text-center">
                  <p className="text-sm text-muted-foreground">下位20%平均</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {(weeklyPriceHistoryData[weeklyPriceHistoryData.length - 1].bottom20 / 10000).toFixed(0)}万円
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 相場推移データ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                相場推移データ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <p className="text-xs">平均在庫期間</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold">{marketSummaryStats.avgInventoryDays}<span className="text-sm font-normal text-muted-foreground ml-0.5">日</span></p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ArrowDownRight className="h-4 w-4" />
                    <p className="text-xs">新車からの下落率</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-red-600">{marketSummaryStats.depreciationFromNew}%</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">新車価格 {(marketSummaryStats.newCarPrice / 10000).toFixed(0)}万円</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingDown className="h-4 w-4" />
                    <p className="text-xs">過去2年の下落率</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-red-600">{marketSummaryStats.depreciation2y}%</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingDown className="h-4 w-4" />
                    <p className="text-xs">過去1年の下落率</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-red-600">{marketSummaryStats.depreciation1y}%</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingDown className="h-4 w-4" />
                    <p className="text-xs">過去半年の下落率</p>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-red-600">{marketSummaryStats.depreciation6m}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* グレード別下落率グラフ */}
          <Card>
            <CardHeader>
              <CardTitle>グレード別 下落率推移（過去2年）</CardTitle>
              <CardDescription>
                2年前を起点(0%)としたグレードごとの平均価格下落率
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={gradeDepreciationData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => {
                        const parts = value.split("/")
                        return `${parts[0].slice(2)}/${parts[1]}`
                      }}
                      interval={7}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                      domain={["dataMin - 2", "dataMax + 2"]}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                      labelFormatter={(label) => `週: ${label}`}
                    />
                    <Legend />
                    {displayGrades.map((grade, idx) => (
                      <Line 
                        key={grade}
                        type="stepAfter" 
                        dataKey={grade} 
                        name={grade} 
                        stroke={gradeColors[idx % gradeColors.length]} 
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          </>)}
        </TabsContent>

        {/* リセールランキングタブ */}
        <TabsContent value="ranking" className="space-y-6">
          {/* フィルター */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                ランキング絞り込み
              </CardTitle>
              <CardDescription>
                過去12ヶ月での価格下落率が低い（または上昇した）車種ランキング
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>カテゴリ</Label>
                  <Select value={rankingCategory} onValueChange={setRankingCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="domestic">国産車</SelectItem>
                      <SelectItem value="imported">輸入車</SelectItem>
                      <SelectItem value="kei">軽自動車</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>メーカー</Label>
                  <Select value={rankingMaker} onValueChange={setRankingMaker}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {uniqueMakers.map(maker => (
                        <SelectItem key={maker} value={maker}>{maker}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ランキングテーブル */}
          <Card>
            <CardHeader>
              <CardTitle>リセールバリューランキング TOP100</CardTitle>
              <CardDescription>
                {filteredRanking.length}件の車種を表示中 - 車種をクリックすると詳細���表示されます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 pr-4 font-medium">順位</th>
                      <th className="pb-3 pr-4 font-medium">メーカー</th>
                      <th className="pb-3 pr-4 font-medium">車種</th>
                      <th className="pb-3 pr-4 font-medium">モデル</th>
                      <th className="pb-3 pr-4 font-medium text-center">12ヶ月推移</th>
                      <th className="pb-3 pr-4 font-medium text-right">平均相場</th>
                      <th className="pb-3 pr-4 font-medium text-right">12ヶ月変動</th>
                      <th className="pb-3 pr-4 font-medium text-right">流通台数</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRanking.slice(0, 100).map((item, index) => (
                      <tr 
                        key={`${item.maker}-${item.carName}-${item.model}`} 
                        className="border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() => {
                          setSelectedVehicle(item)
                          setIsDetailOpen(true)
                        }}
                      >
                        <td className="py-3 pr-4">
                          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                            index < 3 ? "bg-amber-500 text-white" : 
                            index < 10 ? "bg-muted text-foreground" : "text-muted-foreground"
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-sm">{item.maker}</td>
                        <td className="py-3 pr-4 font-medium">{item.carName}</td>
                        <td className="py-3 pr-4 text-sm text-muted-foreground">{item.model}</td>
                        <td className="py-3 pr-4">
                          {/* ミニスパークライン */}
                          <div className="h-8 w-24">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={item.priceHistory}>
                                <defs>
                                  <linearGradient id={`sparkGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={item.changeRate >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={item.changeRate >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <Area 
                                  type="monotone" 
                                  dataKey="average" 
                                  stroke={item.changeRate >= 0 ? "#22c55e" : "#ef4444"}
                                  strokeWidth={1.5}
                                  fill={`url(#sparkGradient-${index})`}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-right font-medium">
                          {item.avgPrice}万円
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <Badge 
                            variant={item.changeRate > 0 ? "default" : item.changeRate < -5 ? "destructive" : "secondary"}
                            className={`${
                              item.changeRate > 0 
                                ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" 
                                : item.changeRate < -5 
                                  ? "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                                  : ""
                            }`}
                          >
                            {item.changeRate > 0 ? (
                              <TrendingUp className="mr-1 h-3 w-3" />
                            ) : item.changeRate < 0 ? (
                              <TrendingDown className="mr-1 h-3 w-3" />
                            ) : (
                              <Minus className="mr-1 h-3 w-3" />
                            )}
                            {item.changeRate > 0 ? "+" : ""}{item.changeRate}%
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-right text-sm text-muted-foreground">
                          {item.volume}台
                        </td>
                        <td className="py-3">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 詳細モーダル */}
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedVehicle && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Car className="h-5 w-5" />
                      {selectedVehicle.maker} {selectedVehicle.carName} {selectedVehicle.model}
                    </DialogTitle>
                    <DialogDescription>
                      過去12ヶ月の相場推移と詳細データ
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 pt-4">
                    {/* サマリーカード */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">現在の平均相場</p>
                        <p className="text-2xl font-bold">{selectedVehicle.avgPrice}万円</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">12ヶ月変動率</p>
                        <p className={`text-2xl font-bold ${selectedVehicle.changeRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {selectedVehicle.changeRate > 0 ? "+" : ""}{selectedVehicle.changeRate}%
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">最高値（12ヶ月）</p>
                        <p className="text-2xl font-bold text-green-600">{selectedVehicle.details.highestPrice}万円</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">最安値（12ヶ月）</p>
                        <p className="text-2xl font-bold text-orange-600">{selectedVehicle.details.lowestPrice}万円</p>
                      </div>
                    </div>

                    {/* 詳細グラフ */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">価格推移グラフ（12ヶ月）</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={selectedVehicle.priceHistory}>
                              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                              <XAxis 
                                dataKey="month" 
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => value.split("/")[1] + "月"}
                              />
                              <YAxis 
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                                domain={["dataMin - 200000", "dataMax + 200000"]}
                              />
                              <Tooltip 
                                formatter={(value: number) => [`${(value / 10000).toFixed(1)}��円`, ""]}
                                labelFormatter={(label) => `${label}`}
                              />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="top20" 
                                name="上位20%平均" 
                                stroke="#22c55e" 
                                strokeWidth={2}
                                dot={false}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="average" 
                                name="全体平均" 
                                stroke="#3b82f6" 
                                strokeWidth={3}
                                dot={{ r: 3 }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="bottom20" 
                                name="下位20%平均" 
                                stroke="#f97316" 
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 追加情報 */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Gauge className="h-4 w-4" />
                            車両スペック平均
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">平均走行距離</span>
                            <span className="font-medium">{(selectedVehicle.details.avgMileage / 10000).toFixed(1)}万km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">平均年式</span>
                            <span className="font-medium">{selectedVehicle.details.avgYear}年</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">流通台数</span>
                            <span className="font-medium">{selectedVehicle.volume}台</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">カテゴリ</span>
                            <Badge variant="outline">{selectedVehicle.type}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            価格変動サマリー
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">12ヶ月前の相場</span>
                            <span className="font-medium">{selectedVehicle.details.yearStart}万円</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">現在の相場</span>
                            <span className="font-medium">{selectedVehicle.details.yearEnd}万円</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">変動額</span>
                            <span className={`font-medium ${selectedVehicle.changeRate >= 0 ? "text-green-600" : "text-red-600"}`}>
                              {selectedVehicle.changeRate >= 0 ? "+" : ""}
                              {selectedVehicle.details.yearEnd - selectedVehicle.details.yearStart}万円
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">リセール評価</span>
                            <Badge className={
                              selectedVehicle.changeRate > 5 
                                ? "bg-green-500" 
                                : selectedVehicle.changeRate > 0 
                                  ? "bg-blue-500" 
                                  : selectedVehicle.changeRate > -5 
                                    ? "bg-yellow-500" 
                                    : "bg-red-500"
                            }>
                              {selectedVehicle.changeRate > 5 ? "非常に良い" : 
                               selectedVehicle.changeRate > 0 ? "良い" : 
                               selectedVehicle.changeRate > -5 ? "普通" : "注意"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}
