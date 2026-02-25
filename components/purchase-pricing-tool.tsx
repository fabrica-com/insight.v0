"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  Info,
  Minus,
  Car,
  Gauge,
  Palette,
  Settings2,
  Sun,
  Armchair,
  Tv,
  QrCode,
  Send,
  FileText,
  CheckCircle2,
  User,
  ClipboardCheck,
  ImagePlus,
  Loader2,
} from "lucide-react"

const manufacturers = ["トヨタ", "ホンダ", "日産", "マツダ", "スバル", "三菱", "スズキ", "ダイハツ"]
const models: Record<string, string[]> = {
  トヨタ: ["アルファード", "ヴェルファイア", "ハリアー", "プリウス", "クラウン"],
  ホンダ: ["ヴェゼル", "フリード", "ステップワゴン", "オデッセイ", "N-BOX"],
  日産: ["セレナ", "エクストレイル", "ノート", "リーフ", "スカイライン"],
  マツダ: ["CX-5", "CX-8", "MAZDA3", "MAZDA6", "ロードスター"],
}

type GenerationData = {
  id: string
  name: string
  years: string
  modelCode: string // Added model code (型式)
  image: string
  count: number
}

const carGenerations: Record<string, GenerationData[]> = {
  アルファード: [
    {
      id: "gen1",
      name: "40系",
      years: "2023年06月～",
      modelCode: "AAHH40W",
      image: "/placeholder.svg?height=60&width=100&text=40系",
      count: 1033,
    },
    {
      id: "gen2",
      name: "30系",
      years: "2015年01月～2023年05月",
      modelCode: "AGH30W/GGH30W",
      image: "/placeholder.svg?height=60&width=100&text=30系",
      count: 5156,
    },
    {
      id: "gen3",
      name: "20系",
      years: "2008年05月～2014年12月",
      modelCode: "ANH20W/GGH20W",
      image: "/placeholder.svg?height=60&width=100&text=20系",
      count: 695,
    },
    {
      id: "gen4",
      name: "10系",
      years: "2002年05月～2008年04月",
      modelCode: "ANH10W/MNH10W",
      image: "/placeholder.svg?height=60&width=100&text=10系",
      count: 89,
    },
  ],
}

// Fallback data for other cars
const defaultGenerations: GenerationData[] = [
  {
    id: "gen_curr",
    name: "現行モデル",
    years: "2020年～",
    modelCode: "XXX000",
    image: "/placeholder.svg?height=60&width=100&text=Current",
    count: 1200,
  },
  {
    id: "gen_prev",
    name: "先代モデル",
    years: "2015年～2020年",
    modelCode: "XXX999",
    image: "/placeholder.svg?height=60&width=100&text=Previous",
    count: 3400,
  },
]

const mileageRanges = [
  "1万km未満",
  "1万～2万km",
  "2万～3万km",
  "3万～4万km",
  "4万～5万km",
  "5万～6万km",
  "6万～7万km",
  "7万～8万km",
  "8万～9万km",
  "9万～10万km",
  "10万～11万km",
  "11万～12万km",
  "12万～13万km",
  "13万～14万km",
  "14万～15万km",
  "15万km以上",
]

const colors = ["ホワイトパール", "ブラック", "シルバー", "グレー", "ブルー", "レッド", "その他"]

interface PriceDifferential {
  factor: string
  condition: string
  priceDiff: number
  impact: "positive" | "negative" | "neutral"
  isSelected?: boolean
}

interface PricingResult {
  optimalPrice: number // Single price instead of range
  searchConditions: {
    manufacturer: string
    model: string
    generation: string
    modelCode: string
    mileage: string
    color: string
    is4WD: boolean
  }
  priceDifferentials: PriceDifferential[]
  priceAnalysis: {
    price: number
    saleProb: number
    estimatedRank: number
    daysToSale: number
    trend: "up" | "down" | "stable"
  }[]
}

export function PurchasePricingTool() {
  const [manufacturer, setManufacturer] = useState("トヨタ")
  const [model, setModel] = useState("アルファード")
  const [selectedGeneration, setSelectedGeneration] = useState<string>("gen1")
  const [mileage, setMileage] = useState("3万km〜4万km")
  const [color, setColor] = useState("ブラック")
  const [grade, setGrade] = useState("S Cパッケージ")
  const [hasSunroof, setHasSunroof] = useState<boolean | "unknown">("unknown")
  const [hasLeatherSeat, setHasLeatherSeat] = useState<boolean | "unknown">("unknown")
  const [hasTVNavi, setHasTVNavi] = useState<boolean | "unknown">("unknown")
  const [result, setResult] = useState<PricingResult | null>(null)

  const [chassisNumber, setChassisNumber] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const auctionImageRef = useRef<HTMLInputElement>(null)
  const [auctionImageName, setAuctionImageName] = useState<string>("")
  const [isProcessingAuctionImage, setIsProcessingAuctionImage] = useState(false)

  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [accidentHistory, setAccidentHistory] = useState<string>("none")
  const [evaluationScore, setEvaluationScore] = useState<string>("")
  const [comments, setComments] = useState("")

  const [grossProfit, setGrossProfit] = useState<number>(300000) // デフォルト30万円

  const handleManufacturerChange = (v: string) => {
    setManufacturer(v)
    setModel("")
    setSelectedGeneration("")
  }

  const handleModelChange = (v: string) => {
    setModel(v)
    setSelectedGeneration("")
  }

  const handleAnalyze = () => {
    // 選択された型式から4WD判定
    const currentGenerations = model ? carGenerations[model] || defaultGenerations : []
    const selectedGenerationData = currentGenerations.find((g) => g.id === selectedGeneration)
    const is4WD = selectedGenerationData?.modelCode?.includes("4WD") || false

    // 選択した色の価格差を基準にする
    const colorPrices: Record<string, number> = {
      ブラック: 0,
      ホワイトパール: 50000,
      シルバー: -30000,
      ダークブルー: -50000,
      ワインレッド: -80000,
      グレー: -40000,
      ブラウン: -60000,
      その他: -100000,
    }

    const selectedColor = color || "ブラック"
    const selectedColorPrice = colorPrices[selectedColor] || 0

    const gradePrices: Record<string, number> = {
      "Executive Lounge": 850000,
      "Executive Lounge S": 750000,
      GF: 400000,
      G: 200000,
      "S Cパッケージ": 0,
      S: -180000,
      X: -350000,
    }

    const selectedGrade = grade || "S Cパッケージ"
    const selectedGradePrice = gradePrices[selectedGrade] || 0

    // 基本推奨価格を計算
    const basePrice = 3200000
    const optimalPrice =
      basePrice +
      selectedGradePrice +
      selectedColorPrice +
      (is4WD ? 200000 : 0) +
      (hasSunroof === true ? 180000 : 0) +
      (hasLeatherSeat === true ? 150000 : 0) +
      (hasTVNavi === true ? 100000 : 0)

    const priceList = []
    for (let i = -4; i <= 5; i++) {
      priceList.push(optimalPrice + i * 50000)
    }

    const priceDifferentials: PriceDifferential[] = [
      ...Object.entries(gradePrices).map(([gradeName, price]) => ({
        factor: "グレード",
        condition: gradeName === selectedGrade ? `${gradeName}（選択中）` : gradeName,
        priceDiff: price - selectedGradePrice,
        impact: (price - selectedGradePrice > 0
          ? "positive"
          : price - selectedGradePrice < 0
            ? "negative"
            : "neutral") as "positive" | "negative" | "neutral",
        isSelected: gradeName === selectedGrade,
      })),

      // 走行距離差分（選択した範囲を基準に）
      {
        factor: "走行距離",
        condition: "1万km少ない",
        priceDiff: 120000,
        impact: "positive" as const,
        isSelected: false,
      },
      {
        factor: "走行距離",
        condition: `${mileage || "3万km〜4万km"}（選択中）`,
        priceDiff: 0,
        impact: "neutral" as const,
        isSelected: true,
      },
      {
        factor: "走行距離",
        condition: "1万km多い",
        priceDiff: -100000,
        impact: "negative" as const,
        isSelected: false,
      },
      {
        factor: "走行距離",
        condition: "2万km多い",
        priceDiff: -220000,
        impact: "negative" as const,
        isSelected: false,
      },

      //ボディカラー差分（選択した色を基準に）
      ...Object.entries(colorPrices).map(([colorName, price]) => ({
        factor: "ボディカラー",
        condition: colorName === selectedColor ? `${colorName}（選択中）` : colorName,
        priceDiff: price - selectedColorPrice,
        impact: (price - selectedColorPrice > 0
          ? "positive"
          : price - selectedColorPrice < 0
            ? "negative"
            : "neutral") as "positive" | "negative" | "neutral",
        isSelected: colorName === selectedColor,
      })),

      // 4WD差分
      {
        factor: "駆動方式",
        condition: is4WD ? "4WD（選択中）" : "4WD",
        priceDiff: is4WD ? 0 : 200000,
        impact: is4WD ? ("neutral" as const) : ("positive" as const),
        isSelected: is4WD,
      },
      {
        factor: "駆動方式",
        condition: is4WD ? "2WD（FF）" : "2WD（FF）（選択中）",
        priceDiff: is4WD ? -200000 : 0,
        impact: is4WD ? ("negative" as const) : ("neutral" as const),
        isSelected: !is4WD,
      },

      {
        factor: "サンルーフ",
        condition: hasSunroof === true ? "装備あり（選択中）" : "装備あり",
        priceDiff: hasSunroof === true ? 0 : 180000,
        impact: hasSunroof === true ? ("neutral" as const) : ("positive" as const),
        isSelected: hasSunroof === true,
      },
      {
        factor: "サンルーフ",
        condition:
          hasSunroof === false ? "装備なし（選択中）" : hasSunroof === "unknown" ? "装備なし（基準）" : "装備なし",
        priceDiff: hasSunroof === true ? -180000 : 0,
        impact: hasSunroof === true ? ("negative" as const) : ("neutral" as const),
        isSelected: hasSunroof === false || hasSunroof === "unknown",
      },
      {
        factor: "革シート",
        condition: hasLeatherSeat === true ? "装備あり（選択中）" : "装備あり",
        priceDiff: hasLeatherSeat === true ? 0 : 150000,
        impact: hasLeatherSeat === true ? ("neutral" as const) : ("positive" as const),
        isSelected: hasLeatherSeat === true,
      },
      {
        factor: "革シート",
        condition:
          hasLeatherSeat === false
            ? "装備なし（選択中）"
            : hasLeatherSeat === "unknown"
              ? "装備なし（基準）"
              : "装備なし",
        priceDiff: hasLeatherSeat === true ? -150000 : 0,
        impact: hasLeatherSeat === true ? ("negative" as const) : ("neutral" as const),
        isSelected: hasLeatherSeat === false || hasLeatherSeat === "unknown",
      },
      {
        factor: "TVナビ",
        condition: hasTVNavi === true ? "純正装備あり（選択中）" : "純正装備あり",
        priceDiff: hasTVNavi === true ? 0 : 100000,
        impact: hasTVNavi === true ? ("neutral" as const) : ("positive" as const),
        isSelected: hasTVNavi === true,
      },
      {
        factor: "TVナビ",
        condition:
          hasTVNavi === false ? "社外/なし（選択中）" : hasTVNavi === "unknown" ? "社外/なし（基準）" : "社外/なし",
        priceDiff: hasTVNavi === true ? -100000 : 0,
        impact: hasTVNavi === true ? ("negative" as const) : ("neutral" as const),
        isSelected: hasTVNavi === false || hasTVNavi === "unknown",
      },
    ]

    setResult({
      optimalPrice,
      searchConditions: {
        manufacturer,
        model,
        generation: selectedGenerationData?.name || "",
        modelCode: selectedGenerationData?.modelCode || "",
        mileage: mileage || "3万km〜4万km",
        color: selectedColor,
        is4WD,
      },
      priceAnalysis: priceList.map((price, index) => {
        const diff = price - optimalPrice
        let saleProb: number
        if (diff <= -150000) {
          saleProb = 98
        } else if (diff <= -100000) {
          saleProb = 96
        } else if (diff <= -50000) {
          saleProb = 94
        } else if (diff <= 0) {
          saleProb = 90
        } else if (diff <= 50000) {
          saleProb = 80
        } else if (diff <= 100000) {
          saleProb = 70
        } else if (diff <= 150000) {
          saleProb = 60
        } else {
          saleProb = 50
        }

        let estimatedRank: number
        if (diff <= -150000) {
          estimatedRank = 1
        } else if (diff <= -100000) {
          estimatedRank = 2
        } else if (diff <= -50000) {
          estimatedRank = 3
        } else if (diff <= 0) {
          estimatedRank = 5
        } else if (diff <= 50000) {
          estimatedRank = 8
        } else if (diff <= 100000) {
          estimatedRank = 12
        } else if (diff <= 150000) {
          estimatedRank = 18
        } else {
          estimatedRank = 25
        }

        let daysToSale: number
        if (diff <= -150000) {
          daysToSale = 7
        } else if (diff <= -100000) {
          daysToSale = 10
        } else if (diff <= -50000) {
          daysToSale = 14
        } else if (diff <= 0) {
          daysToSale = 21
        } else if (diff <= 50000) {
          daysToSale = 30
        } else if (diff <= 100000) {
          daysToSale = 45
        } else if (diff <= 150000) {
          daysToSale = 60
        } else {
          daysToSale = 90
        }

        return {
          price,
          saleProb: Math.round(Math.max(50, Math.min(98, saleProb))),
          estimatedRank,
          daysToSale,
          trend: diff < 0 ? ("up" as const) : diff > 0 ? ("down" as const) : ("stable" as const),
        }
      }),
      priceDifferentials,
    })
  }

  const handleQRUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // デモ用: QRコードから車体番号を読み取ったと仮定
      setTimeout(() => {
        setChassisNumber("AGH30-0123456")
      }, 500)
    }
  }

  const handleAuctionImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAuctionImageName(file.name)
      setIsProcessingAuctionImage(true)
      // デモ用: 出品票画像からOCRで車両情報を読み取ったと仮定
      setTimeout(() => {
        setChassisNumber("AGH30-0123456")
        setManufacturer("トヨタ")
        setModel("アルファード")
        setSelectedGeneration("gen2")
        setMileage("3万～4万km")
        setColor("ブラック")
        setGrade("S Cパッケージ")
        setIsProcessingAuctionImage(false)
      }, 1500)
    }
  }

  const prepareSubmitData = () => {
    return {
      chassisNumber,
      manufacturer,
      model,
      generation: selectedGenerationData?.name,
      modelCode: selectedGenerationData?.modelCode,
      mileage,
      color,
      grade: grade !== "none" ? grade : "未選択",
      options: {
        sunroof: hasSunroof,
        leatherSeat: hasLeatherSeat,
        tvNavi: hasTVNavi,
      },
      // Assuming 'result' is the object holding the analysis data
      recommendedPrice: result?.optimalPrice,
      accidentHistory,
      evaluationScore,
      comments,
      // Add gross profit to submitted data
      grossProfit,
    }
  }

  const handleSendToApprover = () => {
    setShowConfirmDialog(false)
    // 実際の送信処理をここに実装
    console.log("送信データ:", prepareSubmitData())
    setShowSuccessDialog(true)
  }

  const canAnalyze = manufacturer && model && selectedGeneration

  const currentGenerations = model ? carGenerations[model] || defaultGenerations : []
  const selectedGenerationData = currentGenerations.find((gen) => gen.id === selectedGeneration)
  const currentModels = manufacturer ? models[manufacturer] || [] : []

  const grades = ["Executive Lounge", "Executive Lounge S", "GF", "G", "S Cパッケージ", "S", "X"]

  // Alias for clarity in template
  const analysisResult = result

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            車両スペック入力
          </CardTitle>
          <CardDescription>査定対象車両の情報を入力してください</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border rounded-lg p-4 bg-muted/10">
            <Label className="text-base font-semibold flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4" />
              車両情報の入力方法
            </Label>
            <div className="grid gap-4 md:grid-cols-3">
              {/* 車体番号入力 */}
              <div className="space-y-2">
                <Label htmlFor="chassisNumber">車体番号（車台番号）</Label>
                <Input
                  id="chassisNumber"
                  placeholder="例: AGH30-0123456"
                  value={chassisNumber}
                  onChange={(e) => setChassisNumber(e.target.value)}
                />
              </div>

              {/* QRコード読み取り */}
              <div className="space-y-2">
                <Label>QRコード読み取り</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    QRコードをアップロード
                  </Button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleQRUpload} />
                </div>
              </div>

              {/* オークション出品票画像 */}
              <div className="space-y-2">
                <Label>オークション出品票</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => auctionImageRef.current?.click()}
                    disabled={isProcessingAuctionImage}
                  >
                    {isProcessingAuctionImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        読み取り中...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="mr-2 h-4 w-4" />
                        出品票画像をアップロード
                      </>
                    )}
                  </Button>
                  <input
                    ref={auctionImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAuctionImageUpload}
                  />
                </div>
                {auctionImageName && !isProcessingAuctionImage && (
                  <p className="text-xs text-muted-foreground truncate">{auctionImageName}</p>
                )}
              </div>
            </div>

            {/* 読み取り結果メッセージ */}
            {chassisNumber && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 p-2 rounded">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {auctionImageName
                  ? <>出品票から車両情報を取得しました（車体番号: {chassisNumber}）</>
                  : <>車体番号を取得しました: {chassisNumber}</>
                }
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">メーカー</Label>
              <Select value={manufacturer} onValueChange={handleManufacturerChange}>
                <SelectTrigger id="manufacturer">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">車名</Label>
              <Select value={model} onValueChange={handleModelChange} disabled={!manufacturer}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {currentModels.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {model && (
            <div className="space-y-4 mb-6 border rounded-lg p-4 bg-muted/10">
              <Label className="text-base font-semibold">モデル（型式）選択</Label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {currentGenerations.map((gen) => {
                  const isSelected = selectedGeneration === gen.id
                  return (
                    <div
                      key={gen.id}
                      className={`border rounded-md bg-background p-3 cursor-pointer hover:border-primary/50 transition-all ${isSelected && "border-primary bg-primary/5 ring-1 ring-primary"}`}
                      onClick={() => setSelectedGeneration(gen.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-5 w-5 rounded border border-primary flex items-center justify-center shrink-0 ${isSelected && "bg-primary text-primary-foreground"}`}
                        >
                          {isSelected && <Car className="h-3 w-3" />}
                        </div>
                        <div className="h-14 w-20 bg-muted rounded flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={gen.image || "/placeholder.svg"}
                            alt={gen.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base">{gen.name}</div>
                          <div className="text-xs text-muted-foreground">型式: {gen.modelCode}</div>
                          <div className="text-xs text-muted-foreground">{gen.years}</div>
                          <div className="text-xs text-muted-foreground">掲載台数: {gen.count}台</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {selectedGenerationData && (
                <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 p-2 rounded">
                  <Car className="h-4 w-4" />
                  選択中: {selectedGenerationData.name} ({selectedGenerationData.modelCode})
                </div>
              )}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="mileage">走行距離</Label>
              <Select value={mileage} onValueChange={setMileage}>
                <SelectTrigger id="mileage">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {mileageRanges.map((mr) => (
                    <SelectItem key={mr} value={mr}>
                      {mr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">色</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger id="color">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">
                グレード <span className="text-xs text-muted-foreground">（任意）</span>
              </Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未選択</SelectItem>
                  {grades.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-muted/10">
            <Label className="text-base font-semibold flex items-center gap-2 mb-4">
              <Settings2 className="h-4 w-4" />
              オプション <span className="text-xs text-muted-foreground font-normal">（任意）</span>
            </Label>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Sun className="h-4 w-4" /> サンルーフ
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={hasSunroof === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHasSunroof(true)}
                  >
                    あり
                  </Button>
                  <Button
                    type="button"
                    variant={hasSunroof === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHasSunroof(false)}
                  >
                    なし
                  </Button>
                  <Button
                    type="button"
                    variant={hasSunroof === "unknown" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setHasSunroof("unknown")}
                  >
                    不明
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Armchair className="h-4 w-4" /> 革シート
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={hasLeatherSeat === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHasLeatherSeat(true)}
                  >
                    あり
                  </Button>
                  <Button
                    type="button"
                    variant={hasLeatherSeat === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHasLeatherSeat(false)}
                  >
                    なし
                  </Button>
                  <Button
                    type="button"
                    variant={hasLeatherSeat === "unknown" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setHasLeatherSeat("unknown")}
                  >
                    不明
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Tv className="h-4 w-4" /> TVナビ（純正）
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={hasTVNavi === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHasTVNavi(true)}
                  >
                    あり
                  </Button>
                  <Button
                    type="button"
                    variant={hasTVNavi === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHasTVNavi(false)}
                  >
                    なし
                  </Button>
                  <Button
                    type="button"
                    variant={hasTVNavi === "unknown" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setHasTVNavi("unknown")}
                  >
                    不明
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleAnalyze}
            className="w-full"
            size="lg"
            disabled={!manufacturer || !model || !selectedGeneration}
          >
            <Calculator className="mr-2 h-4 w-4" />
            価格分析を実行
          </Button>
        </CardContent>
      </Card>

      {analysisResult && (
        <>
          <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
            <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-xs text-red-700 dark:text-red-300">
              <span className="font-semibold text-red-600 dark:text-red-400">注記：</span>
              表示される分析データは、お客様のブラウザ機能を利用して、お客様の指定したエリア・条件の公開情報を収集・解析したものです。
              ※取得したデータは貴社内での検討資料としてのみご利用ください。
              <span className="ml-2 cursor-pointer text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">
                [詳しい利用条件はこちら &gt;]
              </span>
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">検索条件</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-sm">
                  {analysisResult.searchConditions.manufacturer} {analysisResult.searchConditions.model}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {analysisResult.searchConditions.generation}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  型式: {analysisResult.searchConditions.modelCode}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  走行: {analysisResult.searchConditions.mileage}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  色: {analysisResult.searchConditions.color}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {analysisResult.searchConditions.is4WD ? "4WD" : "2WD"}
                </Badge>
                {grade && grade !== "none" && (
                  <Badge variant="outline" className="text-sm">
                    グレード: {grade}
                  </Badge>
                )}
                {hasSunroof !== "unknown" && (
                  <Badge variant="outline" className="text-sm">
                    サンルーフ: {hasSunroof === true ? "あり" : "なし"}
                  </Badge>
                )}
                {hasLeatherSeat !== "unknown" && (
                  <Badge variant="outline" className="text-sm">
                    革シート: {hasLeatherSeat === true ? "あり" : "なし"}
                  </Badge>
                )}
                {hasTVNavi !== "unknown" && (
                  <Badge variant="outline" className="text-sm">
                    TVナビ: {hasTVNavi === true ? "あり" : "なし"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">買取・仕入推奨価格</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-primary">¥{analysisResult.optimalPrice.toLocaleString()}</span>
                <span className="text-lg text-muted-foreground">（±2.5万円）</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                この価格での仕入れは、高い売却可能性と適正な掲載順位が期待できます
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                条件別価格差分析
              </CardTitle>
              <CardDescription>選択条件を基準（±0）とした各要因の価格差</CardDescription>
            </CardHeader>
            <CardContent>
              {/* グレード */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4" /> グレード
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>グレード</TableHead>
                      <TableHead className="text-right">価格差</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResult.priceDifferentials
                      .filter((d) => d.factor === "グレード")
                      .map((diff, idx) => (
                        <TableRow key={idx} className={diff.isSelected ? "bg-primary/10" : ""}>
                          <TableCell className={diff.isSelected ? "font-semibold" : ""}>{diff.condition}</TableCell>
                          <TableCell
                            className={`text-right font-mono ${diff.priceDiff > 0 ? "text-green-600" : diff.priceDiff < 0 ? "text-red-600" : ""}`}
                          >
                            {diff.priceDiff > 0 ? "+" : ""}
                            {diff.priceDiff === 0 ? "±0" : `${diff.priceDiff.toLocaleString()}円`}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* 走行距離 */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Gauge className="h-4 w-4" /> 走行距離
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>走行距離</TableHead>
                      <TableHead className="text-right">価格差</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResult.priceDifferentials
                      .filter((d) => d.factor === "走行距離")
                      .map((diff, idx) => (
                        <TableRow key={idx} className={diff.isSelected ? "bg-primary/10" : ""}>
                          <TableCell className={diff.isSelected ? "font-semibold" : ""}>{diff.condition}</TableCell>
                          <TableCell
                            className={`text-right font-mono ${diff.priceDiff > 0 ? "text-green-600" : diff.priceDiff < 0 ? "text-red-600" : ""}`}
                          >
                            {diff.priceDiff > 0 ? "+" : ""}
                            {diff.priceDiff === 0 ? "±0" : `${diff.priceDiff.toLocaleString()}円`}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* ボディカラー */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4" /> ボディカラー
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>カラー</TableHead>
                      <TableHead className="text-right">価格差</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResult.priceDifferentials
                      .filter((d) => d.factor === "ボディカラー")
                      .map((diff, idx) => (
                        <TableRow key={idx} className={diff.isSelected ? "bg-primary/10" : ""}>
                          <TableCell className={diff.isSelected ? "font-semibold" : ""}>{diff.condition}</TableCell>
                          <TableCell
                            className={`text-right font-mono ${diff.priceDiff > 0 ? "text-green-600" : diff.priceDiff < 0 ? "text-red-600" : ""}`}
                          >
                            {diff.priceDiff > 0 ? "+" : ""}
                            {diff.priceDiff === 0 ? "±0" : `${diff.priceDiff.toLocaleString()}円`}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* 駆動方式（4WD） */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4" /> 駆動方式
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>駆動方式</TableHead>
                      <TableHead className="text-right">価格差</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResult.priceDifferentials
                      .filter((d) => d.factor === "駆動方式")
                      .map((diff, idx) => (
                        <TableRow key={idx} className={diff.isSelected ? "bg-primary/10" : ""}>
                          <TableCell className={diff.isSelected ? "font-semibold" : ""}>{diff.condition}</TableCell>
                          <TableCell
                            className={`text-right font-mono ${diff.priceDiff > 0 ? "text-green-600" : diff.priceDiff < 0 ? "text-red-600" : ""}`}
                          >
                            {diff.priceDiff > 0 ? "+" : ""}
                            {diff.priceDiff === 0 ? "±0" : `${diff.priceDiff.toLocaleString()}円`}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* 重要オプション */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4" /> 重要オプション
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>オプション</TableHead>
                      <TableHead>状態</TableHead>
                      <TableHead className="text-right">価格差</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisResult.priceDifferentials
                      .filter((d) => ["サンルーフ", "革シート", "TVナビ"].includes(d.factor))
                      .map((diff, idx) => (
                        <TableRow key={idx} className={diff.isSelected ? "bg-primary/10" : ""}>
                          <TableCell className={diff.isSelected ? "font-semibold" : ""}>{diff.factor}</TableCell>
                          <TableCell className={diff.isSelected ? "font-semibold" : ""}>{diff.condition}</TableCell>
                          <TableCell
                            className={`text-right font-mono ${diff.priceDiff > 0 ? "text-green-600" : diff.priceDiff < 0 ? "text-red-600" : ""}`}
                          >
                            {diff.priceDiff > 0 ? "+" : ""}
                            {diff.priceDiff === 0 ? "±0" : `${diff.priceDiff.toLocaleString()}円`}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* 価格別シミュレーション */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                価格別シミュレーション
              </CardTitle>
              <CardDescription>推奨価格帯（±2.5万円）内での売却予測</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <Label htmlFor="grossProfit" className="whitespace-nowrap font-medium">
                  目標粗利額
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">¥</span>
                  <Input
                    id="grossProfit"
                    type="number"
                    value={grossProfit}
                    onChange={(e) => setGrossProfit(Number(e.target.value))}
                    className="w-32"
                    step={10000}
                    min={0}
                  />
                  <span className="text-sm text-muted-foreground">（税抜き）</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 pr-4 font-semibold">
                        仕入価格
                        <br />
                        <span className="text-xs font-normal text-muted-foreground">（税抜き）</span>
                      </th>
                      <th className="pb-3 pr-4 font-semibold">
                        仕入価格
                        <br />
                        <span className="text-xs font-normal text-muted-foreground">（税込み）</span>
                      </th>
                      <th className="pb-3 pr-4 font-semibold">
                        小売価格
                        <br />
                        <span className="text-xs font-normal text-muted-foreground">（税抜き）</span>
                      </th>
                      <th className="pb-3 pr-4 font-semibold">
                        小売価格
                        <br />
                        <span className="text-xs font-normal text-muted-foreground">（税込み）</span>
                      </th>
                      <th className="pb-3 pr-4 font-semibold">販売可能性</th>
                      <th className="pb-3 pr-4 font-semibold">推定掲載順位</th>
                      <th className="pb-3 pr-4 font-semibold">推定販売日数</th>
                      <th className="pb-3 font-semibold">トレンド</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.priceAnalysis.map((analysis, index) => {
                      const isOptimal = analysis.saleProb >= 85 && analysis.saleProb <= 95
                      const purchasePriceIncludingTax = Math.round(analysis.price * 1.1)
                      const retailPriceExcludingTax = analysis.price + grossProfit
                      const retailPriceIncludingTax = Math.round(retailPriceExcludingTax * 1.1)
                      return (
                        <tr key={index} className={`border-b border-border/50 ${isOptimal ? "bg-primary/5" : ""}`}>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">¥{analysis.price.toLocaleString()}</span>
                              {isOptimal && (
                                <Badge variant="default" className="text-xs">
                                  推奨
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="font-medium text-muted-foreground">
                              ¥{purchasePriceIncludingTax.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="font-medium">¥{retailPriceExcludingTax.toLocaleString()}</span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="font-medium text-primary">
                              ¥{retailPriceIncludingTax.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    analysis.saleProb >= 70
                                      ? "bg-success"
                                      : analysis.saleProb >= 50
                                        ? "bg-chart-3"
                                        : "bg-destructive"
                                  }`}
                                  style={{ width: `${analysis.saleProb}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{analysis.saleProb.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm">{analysis.estimatedRank}位前後</span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="text-sm">{analysis.daysToSale}日</span>
                          </td>
                          <td className="py-4">
                            {analysis.trend === "up" && (
                              <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                上昇
                              </Badge>
                            )}
                            {analysis.trend === "down" && (
                              <Badge variant="destructive" className="bg-destructive/10">
                                <TrendingDown className="mr-1 h-3 w-3" />
                                下降
                              </Badge>
                            )}
                            {analysis.trend === "stable" && (
                              <Badge variant="secondary">
                                <Minus className="mr-1 h-3 w-3" />
                                安定
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                査定データ送信
              </CardTitle>
              <CardDescription>入力した車両情報と分析結果を決裁者に送信します</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowSubmitDialog(true)} className="w-full" size="lg" variant="default">
                <Send className="mr-2 h-4 w-4" />
                査定データを送信する
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              査定情報の追加入力
            </DialogTitle>
            <DialogDescription>査定に必要な追加情報を入力してください</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 車両情報サマリー */}
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Car className="h-4 w-4" />
                車両情報
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">車体番号:</span> {chassisNumber || "未入力"}
                </div>
                <div>
                  <span className="text-muted-foreground">メーカー:</span> {manufacturer}
                </div>
                <div>
                  <span className="text-muted-foreground">車名:</span> {model}
                </div>
                <div>
                  <span className="text-muted-foreground">型式:</span> {selectedGenerationData?.modelCode}
                </div>
                <div>
                  <span className="text-muted-foreground">走行距離:</span> {mileage}
                </div>
                <div>
                  <span className="text-muted-foreground">色:</span> {color}
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">推奨価格:</span>{" "}
                  <span className="font-bold text-primary">{analysisResult?.optimalPrice?.toLocaleString()}</span>
                </div>
                {/* Display gross profit */}
                <div className="col-span-2">
                  <span className="text-muted-foreground">仕入（買取）価格</span>{" "}
                  <span className="font-bold text-primary">
                    {analysisResult?.optimalPrice && grossProfit !== undefined
                      ? (analysisResult.optimalPrice - grossProfit).toLocaleString()
                      : "---"}
                  </span>
                </div>
              </div>
            </div>

            {/* 事故の有無 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">事故の有無</Label>
              <RadioGroup value={accidentHistory} onValueChange={setAccidentHistory}>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="accident-none" />
                    <Label htmlFor="accident-none" className="font-normal cursor-pointer">
                      なし
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minor" id="accident-minor" />
                    <Label htmlFor="accident-minor" className="font-normal cursor-pointer">
                      軽微（修復歴なし）
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="repaired" id="accident-repaired" />
                    <Label htmlFor="accident-repaired" className="font-normal cursor-pointer">
                      修復歴あり
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unknown" id="accident-unknown" />
                    <Label htmlFor="accident-unknown" className="font-normal cursor-pointer">
                      不明
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* 評価点 */}
            <div className="space-y-3">
              <Label htmlFor="evaluationScore" className="text-base font-semibold">
                評価点
              </Label>
              <Select value={evaluationScore} onValueChange={setEvaluationScore}>
                <SelectTrigger id="evaluationScore">
                  <SelectValue placeholder="評価点を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">S（極上車）</SelectItem>
                  <SelectItem value="6">6点（優良車）</SelectItem>
                  <SelectItem value="5">5点（良好車）</SelectItem>
                  <SelectItem value="4.5">4.5点（標準上）</SelectItem>
                  <SelectItem value="4">4点（標準）</SelectItem>
                  <SelectItem value="3.5">3.5点（標準下）</SelectItem>
                  <SelectItem value="3">3点（要整備）</SelectItem>
                  <SelectItem value="2">2点以下（粗悪車）</SelectItem>
                  <SelectItem value="R">R（修復歴あり）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* コメント */}
            <div className="space-y-3">
              <Label htmlFor="comments" className="text-base font-semibold">
                コメント・備考
              </Label>
              <Textarea
                id="comments"
                placeholder="車両の状態、気に��る点、交渉ポイントなどを入力してください"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              キャンセル
            </Button>
            <Button
              onClick={() => {
                setShowSubmitDialog(false)
                setShowConfirmDialog(true)
              }}
            >
              内容確認へ進む
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              送信内容の確認
            </DialogTitle>
            <DialogDescription>以下の内容で決裁者に送信します。内容をご確認ください。</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="border rounded-lg divide-y">
              <div className="grid grid-cols-3 p-3 bg-muted/30">
                <div className="font-semibold">項目</div>
                <div className="col-span-2 font-semibold">内容</div>
              </div>
              <div className="grid grid-cols-3 p-3">
                <div className="text-muted-foreground">車体番号</div>
                <div className="col-span-2">{chassisNumber || "未入力"}</div>
              </div>
              <div className="grid grid-cols-3 p-3">
                <div className="text-muted-foreground">車両</div>
                <div className="col-span-2">
                  {manufacturer} {model} {selectedGenerationData?.name}
                </div>
              </div>
              <div className="grid grid-cols-3 p-3">
                <div className="text-muted-foreground">型式</div>
                <div className="col-span-2">{selectedGenerationData?.modelCode}</div>
              </div>
              <div className="grid grid-cols-3 p-3">
                <div className="text-muted-foreground">走行距離・色</div>
                <div className="col-span-2">
                  {mileage} / {color}
                </div>
              </div>
              <div className="grid grid-cols-3 p-3">
                <div className="text-muted-foreground">推奨買取価格</div>
                <div className="col-span-2 font-bold text-primary">
                  {analysisResult?.optimalPrice?.toLocaleString()}
                </div>
              </div>
              {/* Display gross profit and purchase price */}
              <div className="grid grid-cols-3 p-3">
                <div className="text-muted-foreground">目標粗利</div>
                <div className="col-span-2">{grossProfit !== undefined ? grossProfit.toLocaleString() : "---"}円</div>
              </div>
              <div className="grid grid-cols-3 p-3">
                <div className="text-muted-foreground">仕入（買取）価格</div>
                <div className="col-span-2 font-bold text-primary">
                  {analysisResult?.optimalPrice && grossProfit !== undefined
                    ? (analysisResult.optimalPrice - grossProfit).toLocaleString()
                    : "---"}
                </div>
              </div>
              <div className="grid grid-cols-3 p-3">
                <div className="text-muted-foreground">事故の有無</div>
                <div className="col-span-2">
                  {accidentHistory === "none" && "なし"}
                  {accidentHistory === "minor" && "軽微（修復歴なし）"}
                  {accidentHistory === "repaired" && "修復歴あり"}
                  {accidentHistory === "unknown" && "不明"}
                </div>
              </div>
              <div className="grid grid-cols-3 p-3">
                <div className="text-muted-foreground">評価点</div>
                <div className="col-span-2">{evaluationScore || "未選択"}</div>
              </div>
              <div className="grid grid-cols-3 p-3">
                <div className="text-muted-foreground">コメント</div>
                <div className="col-span-2">{comments || "なし"}</div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false)
                setShowSubmitDialog(true)
              }}
            >
              戻る
            </Button>
            <Button onClick={handleSendToApprover} className="bg-green-600 hover:bg-green-700">
              <User className="mr-2 h-4 w-4" />
              決裁者に送信
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              送信完了
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-lg font-medium mb-2">査定データを送信しました</p>
            <p className="text-muted-foreground">決裁者からの回答をお待ちください</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)} className="w-full">
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
