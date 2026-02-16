"use client"

import { useState } from "react"
import { LayoutDashboard, TrendingUp, DollarSign, Users, MapPin, BarChart3, ShoppingCart, Settings, FileText, ChevronLeft, ChevronRight, Sparkles, Flame } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from 'next/navigation'

const navigation = [
  { name: "概要", icon: LayoutDashboard, href: "/" },
  { name: "競合分析", icon: Users, href: "/competitors" },
  { name: "価格最適化", icon: DollarSign, href: "/pricing" },
  { name: "売れ筋分析", icon: TrendingUp, href: "/trending" },
  { name: "車種別相場推移", icon: BarChart3, href: "/market-trends" },
  { name: "AI分析", icon: Sparkles, href: "/regional" },
  { name: "仕入れ推奨価格", icon: ShoppingCart, href: "/purchase-pricing" },
  { name: "レポート", icon: FileText, href: "/reports" },
  { name: "辛口コンサルタント", icon: Flame, href: "/consultant" },
]

export function DashboardSidebar({ defaultCollapsed = false }: { defaultCollapsed?: boolean }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        {!collapsed && (
          <>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">Symphony</span>
              <span className="text-xs text-primary font-medium">Insight</span>
            </div>
          </>
        )}
        {collapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg mx-auto">
            S
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-2">
        <Button variant="ghost" className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}>
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>設定</span>}
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-border bg-card shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </aside>
  )
}
