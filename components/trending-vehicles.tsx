"use client"

import { TrendingUp, ArrowUpRight, ChevronRight, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { cn } from "@/lib/utils"

const trendingData = [
  {
    make: "トヨタ",
    model: "アルファード",
    str: 28.5,
    listings: 234,
    sold: 67,
    avgPrice: 4250000,
    avgDays: 21,
    trend: "+8.3%",
  },
  {
    make: "ホンダ",
    model: "ヴェゼル",
    str: 24.2,
    listings: 189,
    sold: 46,
    avgPrice: 2890000,
    avgDays: 25,
    trend: "+5.1%",
  },
  {
    make: "トヨタ",
    model: "ハリアー",
    str: 22.8,
    listings: 167,
    sold: 38,
    avgPrice: 3680000,
    avgDays: 28,
    trend: "+3.2%",
  },
  {
    make: "日産",
    model: "セレナ",
    str: 21.5,
    listings: 198,
    sold: 43,
    avgPrice: 2650000,
    avgDays: 32,
    trend: "+2.8%",
  },
  {
    make: "マツダ",
    model: "CX-5",
    str: 19.3,
    listings: 156,
    sold: 30,
    avgPrice: 2750000,
    avgDays: 35,
    trend: "+1.5%",
  },
]

const chartData = trendingData.map((item) => ({
  name: item.model,
  str: item.str,
}))

export function TrendingVehicles() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
              <BarChart3 className="h-5 w-5 text-chart-1" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">売れ筋車両分析</CardTitle>
              <CardDescription>過去30日間のSell-Through Rate (STR) ランキング - 東京都内</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              地域変更
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary" asChild>
              <a href="/trending">
                詳細分析 <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-b border-border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">STRランキング</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-3 w-3 rounded bg-chart-1" />
              <span>Sell-Through Rate (%)</span>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 35]}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number) => [`${value}%`, "STR"]}
                />
                <Bar dataKey="str" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "hsl(var(--chart-1))" : "hsl(var(--muted-foreground)/0.3)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs text-muted-foreground">
                <th className="px-6 py-3 text-left font-medium">順位</th>
                <th className="px-6 py-3 text-left font-medium">車種</th>
                <th className="px-6 py-3 text-right font-medium">STR</th>
                <th className="px-6 py-3 text-right font-medium hidden sm:table-cell">掲載数</th>
                <th className="px-6 py-3 text-right font-medium hidden sm:table-cell">売却数</th>
                <th className="px-6 py-3 text-right font-medium hidden md:table-cell">平均価格</th>
                <th className="px-6 py-3 text-right font-medium hidden md:table-cell">平均日数</th>
                <th className="px-6 py-3 text-right font-medium">トレンド</th>
                <th className="px-6 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {trendingData.map((item, index) => (
                <tr
                  key={index}
                  className="group border-b border-border/50 transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                        index === 0 && "bg-chart-1/10 text-chart-1",
                        index === 1 && "bg-chart-2/10 text-chart-2",
                        index === 2 && "bg-chart-5/10 text-chart-5",
                        index > 2 && "bg-muted text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {item.make} {item.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-bold text-primary">{item.str}%</span>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground hidden sm:table-cell">{item.listings}台</td>
                  <td className="px-6 py-4 text-right font-medium hidden sm:table-cell">{item.sold}台</td>
                  <td className="px-6 py-4 text-right text-muted-foreground hidden md:table-cell">
                    ¥{(item.avgPrice / 10000).toFixed(0)}万
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground hidden md:table-cell">{item.avgDays}日</td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {item.trend}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
