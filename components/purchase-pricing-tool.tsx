"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Search } from 'lucide-react'

const manufacturers = ["トヨタ", "ホンダ", "日産", "マツダ", "スバル", "三菱", "スズキ", "ダイハツ"]
const models: Record<string, string[]> = {
  トヨタ: ["アルファード", "ヴェルファイア", "ハリアー", "プリウス", "クラウン"],
  ホンダ: ["ヴェゼル", "フリード", "ステップワゴン", "オデッセイ", "N-BOX"],
  日産: ["セレナ", "エクストレイル", "ノート", "リーフ", "スカイライン"],
  マツダ: ["CX-5", "CX-8", "MAZDA3", "MAZDA6", "ロードスター"],
}
const modelTypes = ["2.5S Cパッケージ", "2.5S Aパッケージ", "2.5X", "2.5G", "ハイブリッド"]
const grades = ["ベースグレード", "中間グレード", "上級グレード", "特別仕様車"]
const mileageRanges = ["0-2万km", "2-4万km", "4-6万km", "6-8万km", "8-10万km", "10万km以上"]
const colors = ["ホワイトパール", "ブラック", "シルバー", "レッド", "ブルー", "その他"]

interface PricingResult {
  optimalRange: { min: number; max: number }
  priceAnalysis: {
    price: number
    salesPrice: number
    grossProfit: number
    saleProb: number
    estimatedRank: number
    daysToSale: number
    trend: "up" | "down" | "stable"
  }[]
}

export function PurchasePricingTool() {
  const [manufacturer, setManufacturer] = useState("")
  const [model, setModel] = useState("")
  const [modelType, setModelType] = useState("")
  const [grade, setGrade] = useState("")
  const [mileage, setMileage] = useState("")
  const [color, setColor] = useState("")
  const [targetMargin, setTargetMargin] = useState("150000")
  const [result, setResult] = useState<PricingResult | null>(null)

  const handleAnalyze = () => {
    const basePrice = 3500000
    const margin = parseInt(targetMargin) || 150000
    
    const optimalMin = Math.round(basePrice * 0.9)
    const optimalMax = Math.round(basePrice * 1.0)
    
    let increment: number
    if (optimalMax <= 1000000) {
      increment = 10000
    } else if (optimalMax <= 2000000) {
      increment = 20000
    } else {
      increment = 30000
    }
    
    const priceList: number[] = []
    for (let price = optimalMin; price <= optimalMax; price += increment) {
      priceList.push(price)
    }
    
    if (priceList[priceList.length - 1] < optimalMax) {
      priceList.push(optimalMax)
    }
    
    const priceAt10PercentHigher = optimalMin * 1.1
    
    setResult({
      optimalRange: {
        min: optimalMin,
        max: optimalMax,
      },
      priceAnalysis: priceList.map((price, index) => {
        const salesPrice = price + margin
        
        // 販売可能性の計算：最安値で95%、10%高い価格で70%、それ以上は低下
        let saleProb: number
        if (price <= optimalMin) {
          saleProb = 95
        } else if (price <= priceAt10PercentHigher) {
          // optimalMin から priceAt10PercentHigher の間で 95% → 70% に線形減少
          const ratio = (price - optimalMin) / (priceAt10PercentHigher - optimalMin)
          saleProb = 95 - ratio * 25 // 95% から 70% まで
        } else {
          // priceAt10PercentHigher 以上では 70% からさらに低下
          const ratio = (price - priceAt10PercentHigher) / (optimalMax - priceAt10PercentHigher)
          saleProb = 70 - ratio * 20 // 70% から 50% まで
        }
        
        return {
          price,
          salesPrice,
          grossProfit: margin,
          saleProb: Math.round(Math.max(50, Math.min(95, saleProb))),
          estimatedRank: Math.round(1 + (price - optimalMin) / (optimalMax - optimalMin) * 5),
          daysToSale: Math.round(20 + (price - optimalMin) / (optimalMax - optimalMin) * 30),
          trend: price < optimalMin + (optimalMax - optimalMin) * 0.3 ? "up" : price > optimalMin + (optimalMax - optimalMin) * 0.7 ? "down" : "stable",
        }
      }),
    })
  }

  const canAnalyze = manufacturer && model && modelType && grade && mileage && color

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>車両スペック入力</CardTitle>
          <CardDescription>仕入れ検討中の車両情報を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">メーカー</Label>
              <Select value={manufacturer} onValueChange={setManufacturer}>
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
              <Select value={model} onValueChange={setModel} disabled={!manufacturer}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturer &&
                    models[manufacturer]?.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelType">モデル（型式）</Label>
              <Select value={modelType} onValueChange={setModelType} disabled={!model}>
                <SelectTrigger id="modelType">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {modelTypes.map((mt) => (
                    <SelectItem key={mt} value={mt}>
                      {mt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">グレード</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="grade">
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="targetMargin">目標粗利額（円）</Label>
            <Input
              id="targetMargin"
              type="number"
              value={targetMargin}
              onChange={(e) => setTargetMargin(e.target.value)}
              placeholder="150000"
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              仕入れ価格に加算する粗利額を設定します（販売価格の計算に使用）
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleAnalyze} disabled={!canAnalyze} size="lg">
              <Search className="mr-2 h-5 w-5" />
              価格分析を実行
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">仕入れ推奨価格帯</CardTitle>
              <CardDescription>
                {manufacturer} {model} {modelType} - {grade}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary">
                  ¥{result.optimalRange.min.toLocaleString()}
                </span>
                <span className="text-2xl text-muted-foreground">〜</span>
                <span className="text-4xl font-bold text-primary">
                  ¥{result.optimalRange.max.toLocaleString()}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                この価格帯での仕入れは、高い売却可能性と適正な掲載順位が期待できます
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>価格別シミュレーション</CardTitle>
              <CardDescription>
                仕入れ価格によって変動する販売指標（
                {result.optimalRange.max <= 1000000
                  ? "1万円刻み"
                  : result.optimalRange.max <= 2000000
                    ? "2万円刻み"
                    : "3万円刻み"}
                ）
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 pr-4 font-semibold">仕入れ価格</th>
                      <th className="pb-3 pr-4 font-semibold">販売価格</th>
                      <th className="pb-3 pr-4 font-semibold">粗利額</th>
                      <th className="pb-3 pr-4 font-semibold">販売可能性</th>
                      <th className="pb-3 pr-4 font-semibold">推定掲載順位</th>
                      <th className="pb-3 pr-4 font-semibold">推定販売日数</th>
                      <th className="pb-3 font-semibold">トレンド</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.priceAnalysis.map((analysis, index) => {
                      const isOptimal = analysis.saleProb >= 85 && analysis.saleProb <= 95
                      return (
                        <tr
                          key={index}
                          className={`border-b border-border/50 ${isOptimal ? "bg-primary/5" : ""}`}
                        >
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
                            <span className="font-semibold text-primary">
                              ¥{analysis.salesPrice.toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <span className="font-medium text-success">
                              ¥{analysis.grossProfit.toLocaleString()}
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

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Card className="border-success/50 bg-success/5">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">最高販売可能性</div>
                    <div className="mt-2 text-3xl font-bold text-success">
                      {Math.max(...result.priceAnalysis.map((a) => a.saleProb)).toFixed(1)}%
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      ¥
                      {result.priceAnalysis
                        .find((a) => a.saleProb === Math.max(...result.priceAnalysis.map((x) => x.saleProb)))
                        ?.price.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-chart-3/50 bg-chart-3/5">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">最短販売日数</div>
                    <div className="mt-2 text-3xl font-bold text-chart-3">
                      {Math.min(...result.priceAnalysis.map((a) => a.daysToSale))}日
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      ¥
                      {result.priceAnalysis
                        .find((a) => a.daysToSale === Math.min(...result.priceAnalysis.map((x) => x.daysToSale)))
                        ?.price.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/50 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">最高掲載順位</div>
                    <div className="mt-2 text-3xl font-bold text-primary">
                      {Math.min(...result.priceAnalysis.map((a) => a.estimatedRank))}位
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      ¥
                      {result.priceAnalysis
                        .find((a) => a.estimatedRank === Math.min(...result.priceAnalysis.map((x) => x.estimatedRank)))
                        ?.price.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
