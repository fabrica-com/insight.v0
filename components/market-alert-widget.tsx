"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, TrendingDown, TrendingUp, Minus, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

// リスクスコア計算用のモジュール定義
const modules = [
  { key: "m1_retail", weight: 30, scoreLogic: (v: number) => v >= 78 ? 5 : v >= 74 ? 15 : v >= 70 ? 35 : v >= 66 ? 60 : v >= 64 ? 80 : 95 },
  { key: "m2_auction", weight: 20, scoreLogic: (v: number) => v >= 78 ? 5 : v >= 74 ? 15 : v >= 70 ? 30 : v >= 65 ? 55 : v >= 60 ? 78 : 95 },
  { key: "m3_epi", weight: 20, scoreLogic: (v: number) => v >= 110 ? 5 : v >= 100 ? 15 : v >= 90 ? 30 : v >= 80 ? 55 : v >= 70 ? 75 : 92 },
  { key: "m4_newcar", weight: 10, scoreLogic: (v: number) => v <= 100 ? 5 : v <= 105 ? 15 : v <= 110 ? 30 : v <= 115 ? 55 : v <= 120 ? 72 : 90 },
  { key: "m5_scfi", weight: 10, scoreLogic: (v: number) => v >= 150 ? 10 : v >= 120 ? 25 : v >= 100 ? 40 : v >= 80 ? 60 : v >= 60 ? 78 : 92 },
  { key: "m6_regulation", weight: 10, scoreLogic: (v: number) => v === 0 ? 5 : v === 1 ? 45 : v === 2 ? 75 : 95 },
]

// 現在のシグナル値（2026Q1想定）
const currentSignals: Record<string, number> = {
  m1_retail: 72.5,
  m2_auction: 68.8,
  m3_epi: 82,
  m4_newcar: 108,
  m5_scfi: 148,
  m6_regulation: 0,
}

function calcCompositeScore() {
  let total = 0
  for (const m of modules) {
    const subScore = m.scoreLogic(currentSignals[m.key])
    total += (subScore * m.weight) / 100
  }
  return Math.round(total)
}

function getRiskLevel(score: number) {
  if (score < 30) return { level: "安全", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", trend: "up" as const }
  if (score < 50) return { level: "注意", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", trend: "flat" as const }
  if (score < 70) return { level: "警戒", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", trend: "down" as const }
  if (score < 85) return { level: "危険", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", trend: "down" as const }
  return { level: "緊急", color: "text-red-600", bg: "bg-red-600/15", border: "border-red-600/40", trend: "down" as const }
}

export function MarketAlertWidget({ collapsed = false }: { collapsed?: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [animScore, setAnimScore] = useState(0)
  const score = calcCompositeScore()
  const risk = getRiskLevel(score)

  useEffect(() => {
    let frame: number
    let current = 0
    const step = () => {
      current = Math.min(current + 2, score)
      setAnimScore(current)
      if (current < score) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [score])

  const TrendIcon = risk.trend === "up" ? TrendingUp : risk.trend === "down" ? TrendingDown : Minus

  if (collapsed) {
    return (
      <div className="px-2 py-2">
        <div
          className={cn(
            "flex items-center justify-center w-full h-10 rounded-lg border transition-all",
            risk.bg,
            risk.border
          )}
          title={`相場リスク: ${risk.level} (${score}pt)`}
        >
          <AlertTriangle className={cn("h-4 w-4", risk.color)} />
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 py-2">
      <div
        className={cn(
          "rounded-lg border transition-all overflow-hidden",
          risk.bg,
          risk.border
        )}
      >
        {/* Header - always visible */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-background/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className={cn("h-4 w-4", risk.color)} />
            <span className="text-xs font-semibold text-foreground">相場アラート</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={cn("text-sm font-bold tabular-nums", risk.color)}>
              {animScore}
            </span>
            <span className="text-[10px] text-muted-foreground">pt</span>
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="px-3 pb-3 space-y-2.5 border-t border-border/50">
            {/* Risk level badge */}
            <div className="flex items-center justify-between pt-2">
              <div className={cn("px-2 py-0.5 rounded text-xs font-bold", risk.bg, risk.color, "border", risk.border)}>
                {risk.level}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendIcon className={cn("h-3.5 w-3.5", risk.color)} />
                <span>
                  {score > 60 ? "下落予測" : score < 25 ? "上昇予測" : "横ばい"}
                </span>
              </div>
            </div>

            {/* Mini gauge */}
            <div className="space-y-1">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    score < 30 ? "bg-emerald-500" :
                    score < 50 ? "bg-amber-500" :
                    score < 70 ? "bg-orange-500" : "bg-red-500"
                  )}
                  style={{ width: `${score}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-muted-foreground">
                <span>安全</span>
                <span>注意</span>
                <span>警戒</span>
                <span>危険</span>
              </div>
            </div>

            {/* Key indicators */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="flex justify-between px-1.5 py-1 rounded bg-background/50">
                <span className="text-muted-foreground">小売成約率</span>
                <span className="font-medium">{currentSignals.m1_retail}%</span>
              </div>
              <div className="flex justify-between px-1.5 py-1 rounded bg-background/50">
                <span className="text-muted-foreground">AA成約率</span>
                <span className="font-medium">{currentSignals.m2_auction}%</span>
              </div>
              <div className="flex justify-between px-1.5 py-1 rounded bg-background/50">
                <span className="text-muted-foreground">輸出圧力</span>
                <span className="font-medium">{currentSignals.m3_epi}</span>
              </div>
              <div className="flex justify-between px-1.5 py-1 rounded bg-background/50">
                <span className="text-muted-foreground">新車登録</span>
                <span className="font-medium">{currentSignals.m4_newcar}%</span>
              </div>
            </div>

            {/* Action recommendation */}
            <div className={cn("text-[10px] px-2 py-1.5 rounded", risk.bg, risk.color)}>
              {score < 30 && "通常運用 - 積極的な仕入れ推奨"}
              {score >= 30 && score < 50 && "週次モニタリング強化"}
              {score >= 50 && score < 70 && "仕入れ量20%削減推奨"}
              {score >= 70 && score < 85 && "仕入れ停止・在庫圧縮推奨"}
              {score >= 85 && "緊急 - 即時ポジション解消"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
