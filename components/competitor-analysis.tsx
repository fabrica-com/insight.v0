"use client"

import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>競合店分析</CardTitle>
            <CardDescription>商圏内（半径10km）の主要競合店</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            詳細 <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="yours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="competitor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
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

        <div className="space-y-3">
          {competitorData.map((competitor) => (
            <div
              key={competitor.name}
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1">
                <div className="font-medium">{competitor.name}</div>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span>在庫: {competitor.inventory}台</span>
                  <span>売却: {competitor.sold}台</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-semibold text-lg">{competitor.str}%</div>
                  <div className="text-xs text-muted-foreground">STR</div>
                </div>
                {competitor.trend === "up" ? (
                  <TrendingUp className="h-5 w-5 text-success" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
