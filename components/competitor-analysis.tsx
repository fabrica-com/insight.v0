"use client"

import { ArrowUpRight, ArrowDownRight, TrendingUp, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"

const competitorData = [
  { name: "オートプラザ新宿", inventory: 312, sold: 45, str: 22.3, trend: "up" },
  { name: "カーセレクト渋谷", inventory: 278, sold: 38, str: 19.8, trend: "up" },
  { name: "モーターランド品川", inventory: 245, sold: 31, str: 17.2, trend: "down" },
  { name: "ドライブセンター目黒", inventory: 198, sold: 28, str: 16.5, trend: "up" },
]

const chartData = [
  { date: "1/1", yours: 234, competitor: 278 },
  { date: "1/8", yours: 228, competitor: 285 },
  { date: "1/15", yours: 242, competitor: 281 },
  { date: "1/22", yours: 234, competitor: 278 },
  { date: "1/29", yours: 239, competitor: 275 },
  { date: "2/5", yours: 234, competitor: 278 },
]

export function CompetitorAnalysis() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">競合店分析</CardTitle>
            <CardDescription>商圏内（半径10km）の主要競合店</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
              詳細 <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">自社在庫</span>
            <span className="font-semibold">234台</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">競合平均</span>
            <span className="font-semibold">278台</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[180px] px-4 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="yours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="competitor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="yours"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#yours)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="competitor"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#competitor)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="divide-y divide-border">
          {competitorData.map((competitor, index) => (
            <div
              key={competitor.name}
              className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{competitor.name}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>在庫 {competitor.inventory}台</span>
                    <span>売却 {competitor.sold}台</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-lg font-bold">{competitor.str}%</div>
                  <div className="text-xs text-muted-foreground">STR</div>
                </div>
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    competitor.trend === "up" ? "bg-success/10" : "bg-muted",
                  )}
                >
                  {competitor.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
