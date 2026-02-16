"use client"

import { TrendingUp, ShoppingCart, Activity, Target, AlertCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "総在庫台数",
    value: "234",
    unit: "台",
    change: "+12",
    changePercent: "+5.4%",
    changeType: "increase" as const,
    icon: ShoppingCart,
    description: "前週比",
    sparkline: [180, 195, 210, 205, 215, 228, 234],
  },
  {
    title: "平均在庫日数",
    value: "42",
    unit: "日",
    change: "-3",
    changePercent: "-6.7%",
    changeType: "decrease" as const,
    icon: Activity,
    description: "前週比",
    sparkline: [52, 48, 50, 47, 45, 44, 42],
  },
  {
    title: "今月の売却台数",
    value: "87",
    unit: "台",
    change: "+23",
    changePercent: "+35.9%",
    changeType: "increase" as const,
    icon: TrendingUp,
    description: "前月比",
    sparkline: [45, 52, 58, 62, 71, 78, 87],
  },
  {
    title: "平均売却価格",
    value: "245",
    unit: "万円",
    change: "+12",
    changePercent: "+5.1%",
    changeType: "increase" as const,
    icon: Target,
    description: "前月比",
    sparkline: [220, 225, 232, 238, 240, 242, 245],
  },
  {
    title: "在庫回転率",
    value: "8.7",
    unit: "回/年",
    change: "+0.3",
    changePercent: "+3.6%",
    changeType: "increase" as const,
    icon: TrendingUp,
    description: "前月比",
    sparkline: [7.8, 8.0, 8.1, 8.3, 8.4, 8.5, 8.7],
  },
  {
    title: "要価格調整",
    value: "23",
    unit: "台",
    change: "要対応",
    changePercent: "",
    changeType: "neutral" as const,
    icon: AlertCircle,
    description: "長期在庫・高価格",
    sparkline: [28, 26, 25, 24, 23, 23, 23],
  },
]

function MiniSparkline({ data, type }: { data: number[]; type: "increase" | "decrease" | "neutral" }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - min) / range) * 100
      return `${x},${y}`
    })
    .join(" ")

  const color =
    type === "increase"
      ? "hsl(var(--success))"
      : type === "decrease"
        ? "hsl(var(--chart-2))"
        : "hsl(var(--muted-foreground))"

  return (
    <svg viewBox="0 0 100 100" className="h-8 w-16" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MarketOverview() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isPositive = stat.changeType === "increase"
        const isNegative = stat.changeType === "decrease"

        return (
          <Card
            key={stat.title}
            className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <MiniSparkline data={stat.sparkline} type={stat.changeType} />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.unit}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    isPositive && "text-success",
                    isNegative && "text-chart-2",
                    stat.changeType === "neutral" && "text-warning",
                  )}
                >
                  {isPositive && <ArrowUpRight className="h-4 w-4" />}
                  {isNegative && <ArrowDownRight className="h-4 w-4" />}
                  <span>{stat.change}</span>
                  {stat.changePercent && <span className="text-muted-foreground">({stat.changePercent})</span>}
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
