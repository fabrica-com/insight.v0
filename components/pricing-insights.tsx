"use client"

import { DollarSign, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link" // Linkをインポート

const pricingAlerts = [
  {
    vehicle: "トヨタ アルファード 2.5S",
    year: 2020,
    currentPrice: 4280000,
    marketPrice: 3950000,
    status: "overpriced",
    daysOnMarket: 67,
    recommendation: "¥3,980,000に値下げ推奨",
  },
  {
    vehicle: "ホンダ ヴェゼル e:HEV Z",
    year: 2021,
    currentPrice: 2890000,
    marketPrice: 2920000,
    status: "optimal",
    daysOnMarket: 23,
    recommendation: "価格は適正範囲",
  },
  {
    vehicle: "日産 セレナ e-POWER",
    year: 2019,
    currentPrice: 2450000,
    marketPrice: 2680000,
    status: "underpriced",
    daysOnMarket: 8,
    recommendation: "¥2,680,000への値上げ検討",
  },
  {
    vehicle: "マツダ CX-5 XD",
    year: 2020,
    currentPrice: 2750000,
    marketPrice: 2580000,
    status: "overpriced",
    daysOnMarket: 45,
    recommendation: "¥2,650,000に値下げ推奨",
  },
]

export function PricingInsights() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>価格最適化</CardTitle>
            <CardDescription>市場価格と比較した自社在庫の分析</CardDescription>
          </div>
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              詳細分析 <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pricingAlerts.map((alert, index) => (
            <div key={index} className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{alert.vehicle}</span>
                    <Badge variant="outline" className="text-xs">
                      {alert.year}年
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">現在価格:</span>
                      <span className="ml-1 font-medium">¥{alert.currentPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">市場相場:</span>
                      <span className="ml-1 font-medium">¥{alert.marketPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">在庫:</span>
                      <span className="ml-1 font-medium">{alert.daysOnMarket}日</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{alert.recommendation}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    alert.status === "overpriced"
                      ? "destructive"
                      : alert.status === "underpriced"
                        ? "default"
                        : "secondary"
                  }
                  className={
                    alert.status === "optimal"
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : alert.status === "underpriced"
                        ? "bg-chart-3/10 text-chart-3 hover:bg-chart-3/20"
                        : ""
                  }
                >
                  {alert.status === "overpriced" && "高価格"}
                  {alert.status === "underpriced" && "低価格"}
                  {alert.status === "optimal" && "適正"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
