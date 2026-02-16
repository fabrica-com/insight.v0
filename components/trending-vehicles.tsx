"use client"

import { TrendingUp, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              売れ筋車両分析
            </CardTitle>
            <CardDescription>過去30日間のSell-Through Rate (STR) ランキング - 東京都内</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              地域変更
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="/trending">
                詳細分析 <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="str" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-sm text-muted-foreground">
                <th className="pb-3 text-left font-medium">順位</th>
                <th className="pb-3 text-left font-medium">車種</th>
                <th className="pb-3 text-right font-medium">STR</th>
                <th className="pb-3 text-right font-medium">掲載数</th>
                <th className="pb-3 text-right font-medium">売却数</th>
                <th className="pb-3 text-right font-medium">平均価格</th>
                <th className="pb-3 text-right font-medium">平均売却日数</th>
                <th className="pb-3 text-right font-medium">トレンド</th>
              </tr>
            </thead>
            <tbody>
              {trendingData.map((item, index) => (
                <tr key={index} className="border-b border-border/50 transition-colors hover:bg-muted/50">
                  <td className="py-4">
                    <Badge variant="outline" className="w-8 justify-center">
                      {index + 1}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <div>
                      <div className="font-semibold">
                        {item.make} {item.model}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <span className="font-bold text-lg text-primary">{item.str}%</span>
                  </td>
                  <td className="py-4 text-right text-muted-foreground">{item.listings}台</td>
                  <td className="py-4 text-right font-medium">{item.sold}台</td>
                  <td className="py-4 text-right text-muted-foreground">¥{(item.avgPrice / 10000).toFixed(0)}万</td>
                  <td className="py-4 text-right text-muted-foreground">{item.avgDays}日</td>
                  <td className="py-4 text-right">
                    <Badge variant="default" className="bg-success/10 text-success hover:bg-success/20">
                      {item.trend}
                    </Badge>
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
