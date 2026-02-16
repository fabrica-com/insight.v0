"use client"

import { ArrowUpRight, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

const pricingAlerts = [
  {
    vehicle: "トヨタ アルファード 2.5S",
    year: 2020,
    currentPrice: 4280000,
    marketPrice: 3950000,
    status: "overpriced",
    daysOnMarket: 67,
    recommendation: "¥3,980,000に値下げ推奨",
    diff: -330000,
  },
  {
    vehicle: "ホンダ ヴェゼル e:HEV Z",
    year: 2021,
    currentPrice: 2890000,
    marketPrice: 2920000,
    status: "optimal",
    daysOnMarket: 23,
    recommendation: "価格は適正範囲",
    diff: 30000,
  },
  {
    vehicle: "日産 セレナ e-POWER",
    year: 2019,
    currentPrice: 2450000,
    marketPrice: 2680000,
    status: "underpriced",
    daysOnMarket: 8,
    recommendation: "¥2,680,000への値上げ検討",
    diff: 230000,
  },
  {
    vehicle: "マツダ CX-5 XD",
    year: 2020,
    currentPrice: 2750000,
    marketPrice: 2580000,
    status: "overpriced",
    daysOnMarket: 45,
    recommendation: "¥2,650,000に値下げ推奨",
    diff: -170000,
  },
]

const statusConfig = {
  overpriced: {
    label: "高価格",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  underpriced: {
    label: "低価格",
    className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  optimal: {
    label: "適正",
    className: "bg-success/10 text-success border-success/20",
  },
}

export function PricingInsights() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">価格最適化</CardTitle>
            <CardDescription>市場価格と比較した自社在庫の分析</CardDescription>
          </div>
          <Link href="/pricing">
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
              詳細分析 <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-destructive/5 p-3 text-center">
            <div className="text-2xl font-bold text-destructive">2</div>
            <div className="text-xs text-muted-foreground">高価格</div>
          </div>
          <div className="rounded-lg bg-success/5 p-3 text-center">
            <div className="text-2xl font-bold text-success">1</div>
            <div className="text-xs text-muted-foreground">適正</div>
          </div>
          <div className="rounded-lg bg-chart-2/5 p-3 text-center">
            <div className="text-2xl font-bold text-chart-2">1</div>
            <div className="text-xs text-muted-foreground">低価格</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {pricingAlerts.map((alert, index) => {
            const config = statusConfig[alert.status as keyof typeof statusConfig]

            return (
              <div
                key={index}
                className="group flex items-center justify-between p-4 transition-colors hover:bg-muted/50 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{alert.vehicle}</span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {alert.year}年
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">現在:</span>
                      <span className="font-medium">¥{(alert.currentPrice / 10000).toFixed(0)}万</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">相場:</span>
                      <span className="font-medium">¥{(alert.marketPrice / 10000).toFixed(0)}万</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">在庫:</span>
                      <span
                        className={cn(
                          "font-medium",
                          alert.daysOnMarket > 60 && "text-destructive",
                          alert.daysOnMarket > 30 && alert.daysOnMarket <= 60 && "text-warning",
                        )}
                      >
                        {alert.daysOnMarket}日
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant="outline" className={cn("border", config.className)}>
                    {config.label}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
