"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Zap,
  Trophy,
  BarChart3,
  MessageSquare,
  QrCode,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "ダッシュボード", icon: LayoutDashboard, href: "/" },
  { name: "競合分析", icon: Users, href: "/competitors" },
  { name: "価格最適化", icon: DollarSign, href: "/pricing" },
  { name: "メーカー・車種別相場推移", icon: BarChart3, href: "/market-trends" },
  { name: "売れ筋分析", icon: TrendingUp, href: "/trending" },
  { name: "AI分析・コンサルティング", icon: MessageSquare, href: "/chat" },
  { name: "買取・仕入推奨価格", icon: ShoppingCart, href: "/purchase-pricing" },
  { name: "レポート", icon: FileText, href: "/reports" },
  { name: "ランキング", icon: Trophy, href: "/rankings" },
  { name: "QRコード生成", icon: QrCode, href: "/qr-generator" },
]

export function DashboardSidebar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <aside
        className={cn(
          "relative flex flex-col border-r border-border bg-sidebar transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[260px]",
        )}
      />
    )
  }

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[260px]",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        {!collapsed && (
          <>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-chart-4 to-chart-1 text-white font-bold text-lg shadow-lg shadow-primary/20">
              <Zap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight">Symphony</span>
              <span className="text-[11px] text-primary font-semibold uppercase tracking-wider">Insight</span>
            </div>
          </>
        )}
        {collapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-chart-4 to-chart-1 text-white font-bold text-lg mx-auto shadow-lg shadow-primary/20">
            <Zap className="h-5 w-5" />
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10 font-medium transition-all",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <item.icon
                  className={cn("h-[18px] w-[18px] flex-shrink-0 transition-colors", isActive && "text-primary")}
                />
                {!collapsed && <span className="truncate text-left">{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link href="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 h-10 font-medium text-muted-foreground hover:text-foreground hover:bg-muted",
              collapsed && "justify-center px-2",
              pathname === "/settings" && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
            )}
          >
            <Settings className={cn("h-[18px] w-[18px] flex-shrink-0", pathname === "/settings" && "text-primary")} />
            {!collapsed && <span>設定</span>}
          </Button>
        </Link>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-card shadow-md hover:bg-muted"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
    </aside>
  )
}
