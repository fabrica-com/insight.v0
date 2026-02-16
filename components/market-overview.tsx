import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Target, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  {
    title: "総在庫台数",
    value: "234台",
    change: "+12台",
    changeType: "increase",
    icon: ShoppingCart,
    description: "前週比",
  },
  {
    title: "平均在庫日数",
    value: "42日",
    change: "-3日",
    changeType: "decrease",
    icon: Activity,
    description: "前週比",
  },
  {
    title: "今月の売却台数",
    value: "87台",
    change: "+23台",
    changeType: "increase",
    icon: TrendingUp,
    description: "前月比 +35.9%",
  },
  {
    title: "平均売却価格",
    value: "¥2,450,000",
    change: "+¥120,000",
    changeType: "increase",
    icon: DollarSign,
    description: "前月比",
  },
  {
    title: "在庫回転率",
    value: "8.7回/年",
    change: "+0.3回",
    changeType: "increase",
    icon: Target,
    description: "前月比",
  },
  {
    title: "価格最適化推奨",
    value: "23台",
    change: "要対応",
    changeType: "neutral",
    icon: TrendingDown,
    description: "長期在庫または高価格",
  },
]

export function MarketOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <Badge
                  variant={
                    stat.changeType === "increase"
                      ? "default"
                      : stat.changeType === "decrease"
                        ? "secondary"
                        : "outline"
                  }
                  className={
                    stat.changeType === "increase"
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : stat.changeType === "decrease"
                        ? "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20"
                        : ""
                  }
                >
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
