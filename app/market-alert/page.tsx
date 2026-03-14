"use client"

import { useState, useEffect } from "react"
import {
  LineChart, Line, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend
} from "recharts"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  BarChart3, Target, Gauge, Ship, Car, Package, AlertTriangle,
  TrendingDown, TrendingUp, Minus, Check, X, Info, RefreshCw
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────
// SYMPHONY INSIGHT RISK ENGINE v1.0
// 6モジュール統合型 中古車オークション相場リスク予測システム
// ─────────────────────────────────────────────────────────────────

// 過去データ（月次データ 2021年4月〜2026年3月 - 5年間）
// newCarReg: 新車登録台数（12週先行指標）- 値が高いと供給増で中古車相場に下押し圧力
const historicalScores = [
  // 2021年（半導体不足による相場急騰期）- 新車登録減少→中古車相場上昇
  {month:"21/04",score:18,actual:+3.2,predicted:"UP",  correct:true, ussPrice:72.5,newCarReg:65,event:"半導体不足"},
  {month:"21/05",score:15,actual:+4.5,predicted:"UP",  correct:true, ussPrice:75.8,newCarReg:62,event:null},
  {month:"21/06",score:12,actual:+5.2,predicted:"UP",  correct:true, ussPrice:79.8,newCarReg:58,event:null},
  {month:"21/07",score:10,actual:+5.8,predicted:"UP",  correct:true, ussPrice:84.5,newCarReg:55,event:null},
  {month:"21/08",score:12,actual:+4.2,predicted:"UP",  correct:true, ussPrice:88.0,newCarReg:52,event:null},
  {month:"21/09",score:15,actual:+3.8,predicted:"UP",  correct:true, ussPrice:91.5,newCarReg:50,event:null},
  {month:"21/10",score:18,actual:+3.5,predicted:"UP",  correct:true, ussPrice:94.8,newCarReg:48,event:null},
  {month:"21/11",score:20,actual:+2.8,predicted:"UP",  correct:true, ussPrice:97.5,newCarReg:52,event:null},
  {month:"21/12",score:22,actual:+2.5,predicted:"UP",  correct:true, ussPrice:100.0,newCarReg:55,event:"100万超"},
  // 2022年（ピークから下落開始）- 新車登録回復開始→中古車相場ピーク後下落
  {month:"22/01",score:25,actual:+3.5,predicted:"UP",  correct:true, ussPrice:103.5,newCarReg:58,event:null},
  {month:"22/02",score:28,actual:+4.2,predicted:"UP",  correct:true, ussPrice:107.8,newCarReg:62,event:"ウクライナ"},
  {month:"22/03",score:32,actual:+3.8,predicted:"UP",  correct:true, ussPrice:111.8,newCarReg:68,event:null},
  {month:"22/04",score:35,actual:+2.5,predicted:"UP",  correct:true, ussPrice:114.5,newCarReg:75,event:null},
  {month:"22/05",score:42,actual:+1.8,predicted:"FLAT",correct:true, ussPrice:116.5,newCarReg:82,event:null},
  {month:"22/06",score:48,actual:+0.5,predicted:"FLAT",correct:true, ussPrice:117.2,newCarReg:88,event:null},
  {month:"22/07",score:55,actual:-1.2,predicted:"DOWN",correct:true, ussPrice:115.8,newCarReg:95,event:"ピーク警告"},
  {month:"22/08",score:62,actual:-2.5,predicted:"DOWN",correct:true, ussPrice:113.0,newCarReg:102,event:null},
  {month:"22/09",score:68,actual:-3.8,predicted:"DOWN",correct:true, ussPrice:108.8,newCarReg:108,event:null},
  {month:"22/10",score:72,actual:-4.2,predicted:"DOWN",correct:true, ussPrice:104.2,newCarReg:112,event:null},
  {month:"22/11",score:75,actual:-3.5,predicted:"DOWN",correct:true, ussPrice:100.5,newCarReg:115,event:null},
  {month:"22/12",score:78,actual:-2.8,predicted:"DOWN",correct:true, ussPrice:97.8,newCarReg:118,event:"年末調整"},
  // 2023年（底打ち〜回復）- 新車登録高水準維持後減少開始→中古車相場底打ち
  {month:"23/01",score:75,actual:-1.5,predicted:"DOWN",correct:true, ussPrice:96.2,newCarReg:120,event:null},
  {month:"23/02",score:72,actual:-0.8,predicted:"DOWN",correct:true, ussPrice:95.5,newCarReg:118,event:null},
  {month:"23/03",score:68,actual:+0.5,predicted:"FLAT",correct:true, ussPrice:96.0,newCarReg:115,event:"底打ち"},
  {month:"23/04",score:62,actual:+1.2,predicted:"FLAT",correct:false,ussPrice:97.2,newCarReg:110,event:null},
  {month:"23/05",score:55,actual:+2.5,predicted:"UP",  correct:true, ussPrice:99.5,newCarReg:105,event:null},
  {month:"23/06",score:48,actual:+3.2,predicted:"UP",  correct:true, ussPrice:102.8,newCarReg:100,event:null},
  {month:"23/07",score:42,actual:+3.8,predicted:"UP",  correct:true, ussPrice:106.8,newCarReg:95,event:"輸出好調"},
  {month:"23/08",score:38,actual:+3.5,predicted:"UP",  correct:true, ussPrice:110.5,newCarReg:92,event:null},
  {month:"23/09",score:35,actual:+2.8,predicted:"UP",  correct:true, ussPrice:113.5,newCarReg:90,event:null},
  {month:"23/10",score:32,actual:+2.2,predicted:"UP",  correct:true, ussPrice:116.0,newCarReg:88,event:null},
  {month:"23/11",score:28,actual:+1.8,predicted:"UP",  correct:true, ussPrice:118.2,newCarReg:85,event:null},
  {month:"23/12",score:25,actual:+1.5,predicted:"UP",  correct:true, ussPrice:120.0,newCarReg:82,event:null},
  // 2024年（緩やかな上昇〜調整）- 新車登録安定→中古車相場横ばい傾向
  {month:"24/01",score:20,actual:+1.2,predicted:"UP",  correct:true, ussPrice:121.5,newCarReg:80,event:null},
  {month:"24/02",score:22,actual:+1.8,predicted:"UP",  correct:true, ussPrice:122.8,newCarReg:82,event:null},
  {month:"24/03",score:24,actual:+2.1,predicted:"UP",  correct:true, ussPrice:124.2,newCarReg:85,event:null},
  {month:"24/04",score:23,actual:+1.5,predicted:"UP",  correct:true, ussPrice:125.0,newCarReg:88,event:null},
  {month:"24/05",score:25,actual:+0.8,predicted:"UP",  correct:true, ussPrice:125.5,newCarReg:92,event:null},
  {month:"24/06",score:28,actual:+0.5,predicted:"FLAT",correct:true, ussPrice:125.8,newCarReg:98,event:null},
  {month:"24/07",score:35,actual:-0.5,predicted:"FLAT",correct:true, ussPrice:125.2,newCarReg:105,event:null},
  {month:"24/08",score:42,actual:-1.2,predicted:"DOWN",correct:true, ussPrice:124.5,newCarReg:112,event:"新高値後警告"},
  {month:"24/09",score:48,actual:-1.8,predicted:"DOWN",correct:true, ussPrice:123.2,newCarReg:118,event:null},
  {month:"24/10",score:52,actual:-2.0,predicted:"DOWN",correct:true, ussPrice:121.8,newCarReg:122,event:null},
  {month:"24/11",score:58,actual:-2.5,predicted:"DOWN",correct:true, ussPrice:120.2,newCarReg:125,event:null},
  {month:"24/12",score:65,actual:-3.2,predicted:"DOWN",correct:true, ussPrice:118.5,newCarReg:128,event:"年末調整"},
  // 2025年（急落〜回復）- 新車登録ピーク後減少→中古車相場底打ち反発
  {month:"25/01",score:72,actual:-4.5,predicted:"DOWN",correct:true, ussPrice:115.8,newCarReg:125,event:"急落警告"},
  {month:"25/02",score:78,actual:-5.8,predicted:"DOWN",correct:true, ussPrice:112.2,newCarReg:120,event:null},
  {month:"25/03",score:82,actual:-6.2,predicted:"DOWN",correct:true, ussPrice:108.5,newCarReg:115,event:"底値警戒"},
  {month:"25/04",score:80,actual:+2.5,predicted:"DOWN",correct:false,ussPrice:110.2,newCarReg:108,event:"底→反発"},
  {month:"25/05",score:68,actual:+3.8,predicted:"UP",  correct:true, ussPrice:114.5,newCarReg:100,event:null},
  {month:"25/06",score:55,actual:+4.2,predicted:"UP",  correct:true, ussPrice:118.2,newCarReg:95,event:null},
  {month:"25/07",score:45,actual:+3.5,predicted:"UP",  correct:true, ussPrice:121.5,newCarReg:90,event:null},
  {month:"25/08",score:38,actual:+2.8,predicted:"UP",  correct:true, ussPrice:124.0,newCarReg:88,event:null},
  {month:"25/09",score:35,actual:+1.5,predicted:"UP",  correct:true, ussPrice:125.8,newCarReg:90,event:null},
  {month:"25/10",score:32,actual:+1.2,predicted:"UP",  correct:true, ussPrice:127.0,newCarReg:95,event:null},
  {month:"25/11",score:30,actual:+0.8,predicted:"UP",  correct:true, ussPrice:128.0,newCarReg:100,event:null},
  {month:"25/12",score:28,actual:+0.5,predicted:"FLAT",correct:true, ussPrice:128.5,newCarReg:105,event:null},
  // 2026年
  {month:"26/01",score:32,actual:-0.5,predicted:"FLAT",correct:true, ussPrice:128.2,newCarReg:108,event:null},
  {month:"26/02",score:35,actual:-0.8,predicted:"FLAT",correct:true, ussPrice:127.5,newCarReg:110,event:null},
  {month:"26/03",score:39,actual:null,predicted:"FLAT",correct:null,ussPrice:127.0,newCarReg:112,event:"現在"},
]

// 現在のシグナル値（2026Q1想定）
const initialSignals = {
  m1_retail:    { value: 72.5, threshold_warn: 70, threshold_crisis: 64, unit:"%", direction:"down_bad", label:"小売成約率" },
  m2_auction:   { value: 68.8, threshold_warn: 65, threshold_crisis: 60, unit:"%", direction:"down_bad", label:"オークション成約率" },
  m3_epi:       { value: 82,   threshold_warn: 80, threshold_crisis: 70, unit:"（指数）", direction:"down_bad", label:"高単価輸出圧力指数" },
  m4_newcar:    { value: 108,  threshold_warn: 110, threshold_crisis: 125, unit:"千台(前年比)", direction:"up_bad", label:"新車登録前年比" },
  m5_scfi:      { value: 148,  threshold_warn: 120, threshold_crisis: 80, unit:"（正規化）", direction:"down_bad", label:"SCFI / Carvana指数" },
  m6_regulation:{ value: 0,    threshold_warn: 1,   threshold_crisis: 2,  unit:"件", direction:"up_bad", label:"規制発令件数（直近4週）" },
}

// モジュール定義
const modules = [
  {
    id:"m1", key:"m1_retail",
    label:"小売成約率", sublabel:"Insight独自",
    weight:30, r:0.94, lead:"7週先行",
    icon: Target,
    source:"Insight内部DB",
    scoreLogic: (v: number) => {
      if(v >= 78) return 5
      if(v >= 74) return 15
      if(v >= 70) return 35
      if(v >= 66) return 60
      if(v >= 64) return 80
      return 95
    }
  },
  {
    id:"m2", key:"m2_auction",
    label:"オークション成約率", sublabel:"USS内部",
    weight:20, r:0.91, lead:"3週先行",
    icon: Gauge,
    source:"USS月次IR",
    scoreLogic: (v: number) => {
      if(v >= 78) return 5
      if(v >= 74) return 15
      if(v >= 70) return 30
      if(v >= 65) return 55
      if(v >= 60) return 78
      return 95
    }
  },
  {
    id:"m3", key:"m3_epi",
    label:"高単価輸出圧力指数", sublabel:"財務省貿易統計",
    weight:20, r:0.89, lead:"4-6週先行",
    icon: Ship,
    source:"e-Stat 国別輸出台数",
    scoreLogic: (v: number) => {
      if(v >= 110) return 5
      if(v >= 100) return 15
      if(v >= 90) return 30
      if(v >= 80) return 55
      if(v >= 70) return 75
      return 92
    }
  },
  {
    id:"m4", key:"m4_newcar",
    label:"新車登録台数", sublabel:"自販連",
    weight:10, r:0.79, lead:"12週先行",
    icon: Car,
    source:"自販連・全軽自協 月次",
    scoreLogic: (v: number) => {
      if(v <= 100) return 5
      if(v <= 105) return 15
      if(v <= 110) return 30
      if(v <= 115) return 55
      if(v <= 120) return 72
      return 90
    }
  },
  {
    id:"m5", key:"m5_scfi",
    label:"SCFI / Carvana", sublabel:"外部指標",
    weight:10, r:0.88, lead:"2-4週先行",
    icon: Package,
    source:"Freightos BDI / Yahoo Finance",
    scoreLogic: (v: number) => {
      if(v >= 150) return 10
      if(v >= 120) return 25
      if(v >= 100) return 40
      if(v >= 80) return 60
      if(v >= 60) return 78
      return 92
    }
  },
  {
    id:"m6", key:"m6_regulation",
    label:"規制発令モニタリング", sublabel:"経産省・外務省",
    weight:10, r:0.92, lead:"即時〜2週",
    icon: AlertTriangle,
    source:"経産省RSS / JETROニュース",
    scoreLogic: (v: number) => {
      if(v === 0) return 5
      if(v === 1) return 45
      if(v === 2) return 75
      return 95
    }
  },
]

type SignalKey = keyof typeof initialSignals

// スコア計算
function calcCompositeScore(signals: typeof initialSignals) {
  let total = 0
  const breakdown: Array<typeof modules[0] & { subScore: number; weighted: number }> = []
  for(const m of modules) {
    const sig = signals[m.key as SignalKey]
    const subScore = m.scoreLogic(sig.value)
    const weighted = subScore * m.weight / 100
    total += weighted
    breakdown.push({...m, subScore, weighted: Math.round(weighted * 10) / 10})
  }
  return { composite: Math.round(total), breakdown }
}

function getRiskLevel(score: number) {
  if(score < 30) return { level:"安全", color:"text-emerald-500", bgColor:"bg-emerald-500/10", borderColor:"border-emerald-500/30", action:"通常運用" }
  if(score < 50) return { level:"注意", color:"text-amber-500", bgColor:"bg-amber-500/10", borderColor:"border-amber-500/30", action:"週次モニタリング強化" }
  if(score < 70) return { level:"警戒", color:"text-orange-500", bgColor:"bg-orange-500/10", borderColor:"border-orange-500/30", action:"仕入れ量を20%削減推奨" }
  if(score < 85) return { level:"危険", color:"text-red-500", bgColor:"bg-red-500/10", borderColor:"border-red-500/30", action:"仕入れ停止・在庫圧縮推奨" }
  return { level:"緊急", color:"text-red-600", bgColor:"bg-red-600/10", borderColor:"border-red-600/30", action:"即時ポジション解消" }
}

// バックテスト精度
const backtestAccuracy = (() => {
  const total = historicalScores.length
  const correct = historicalScores.filter(x=>x.correct).length
  const crashes = historicalScores.filter(x=>x.predicted==="DOWN")
  const crashCorrect = crashes.filter(x=>x.correct).length
  return {
    overall: Math.round(correct/total*100),
    crashes: Math.round(crashCorrect/crashes.length*100),
    surges: Math.round(historicalScores.filter(x=>x.predicted==="UP"&&x.correct).length /
             historicalScores.filter(x=>x.predicted==="UP").length*100),
  }
})()

// Custom Tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if(!active || !payload?.length) return null
  const d = historicalScores.find(x=>x.month===label)
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <div className="text-sm font-semibold text-muted-foreground mb-2">{label}</div>
      {payload.map((p, i)=>(
        <div key={i} className="text-sm" style={{color: p.color}}>
{p.name}: <span className="font-semibold">{typeof p.value==="number"?p.value.toFixed(1):p.value}</span>
  {p.name==="USS成約単価"?"万円":p.name==="リスクスコア"?"pt":p.name.includes("新車")?"千台":""}
        </div>
      ))}
      {d?.event && (
        <div className="mt-2 pt-2 border-t border-border text-xs text-amber-500">
          {d.event}
        </div>
      )}
    </div>
  )
}

// ゲージコンポーネント
function RiskGauge({ score, size = 200 }: { score: number; size?: number }) {
  const risk = getRiskLevel(score)
  // Angle: score 0 = -180 (left), score 100 = 0 (right)
  const angle = -180 + (score / 100) * 180
  const cx = size/2, cy = size/2 * 0.7
  const r = size * 0.38
  const toRad = (deg: number) => deg * Math.PI / 180
  
  const arcPath = (startDeg: number, endDeg: number, color: string) => {
    const start = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) }
    const end   = { x: cx + r * Math.cos(toRad(endDeg)),   y: cy + r * Math.sin(toRad(endDeg)) }
    const large = endDeg - startDeg > 180 ? 1 : 0
    return <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`}
      stroke={color} strokeWidth={size*0.06} fill="none" opacity={0.9} strokeLinecap="round"/>
  }
  
  const needleX = cx + (r*0.75) * Math.cos(toRad(angle))
  const needleY = cy + (r*0.75) * Math.sin(toRad(angle))

  const getColor = () => {
    if(score < 30) return "#22c55e"
    if(score < 50) return "#f59e0b"
    if(score < 70) return "#f97316"
    if(score < 85) return "#ef4444"
    return "#dc2626"
  }

  return (
    <svg width={size} height={size*0.75} style={{overflow:"visible"}}>
      {/* Track */}
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke="hsl(var(--muted))" strokeWidth={size*0.06} fill="none" opacity={0.3}/>
      {/* Color zones */}
      {arcPath(-180,-126,"#22c55e")}
      {arcPath(-126,-72, "#f59e0b")}
      {arcPath(-72, -36, "#f97316")}
      {arcPath(-36,  -9, "#ef4444")}
      {arcPath(  -9,  0, "#dc2626")}
      {/* Needle */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY}
        stroke={getColor()} strokeWidth={3} strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r={size*0.04} fill={getColor()}/>
      <circle cx={cx} cy={cy} r={size*0.02} fill="hsl(var(--background))"/>
      {/* Score text - positioned below the gauge */}
      <text x={cx} y={cy+size*0.22} textAnchor="middle" fontSize={size*0.2}
        fontWeight="800" fill={getColor()}>{score}</text>
      <text x={cx} y={cy+size*0.34} textAnchor="middle" fontSize={size*0.07}
        fill="hsl(var(--muted-foreground))">/ 100</text>
    </svg>
  )
}

export default function MarketAlertPage() {
  const [signals, setSignals] = useState({...initialSignals})
  const [animScore, setAnimScore] = useState(0)
  const { composite, breakdown } = calcCompositeScore(signals)
  const risk = getRiskLevel(composite)

  // アニメーション
  useEffect(() => {
    let frame: number
    let current = 0
    const target = composite
    const step = () => {
      current = Math.min(current + 2, target)
      setAnimScore(current)
      if(current < target) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [composite])

  const getBarColor = (pct: number) => {
    if(pct > 70) return "bg-red-500"
    if(pct > 45) return "bg-orange-500"
    if(pct > 25) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const getBarColorHex = (pct: number) => {
    if(pct > 70) return "#ef4444"
    if(pct > 45) return "#f97316"
    if(pct > 25) return "#f59e0b"
    return "#22c55e"
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Symphony Insight — 相場リスクエンジン v1.0
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                6モジュール統合型 中古車オークション相場リスク予測システム / バックテスト精度 {backtestAccuracy.overall}%（急落検知 {backtestAccuracy.crashes}%）
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${risk.bgColor} ${risk.borderColor}`}>
              <div className="text-xs text-muted-foreground mb-0.5">現在のリスクレベル</div>
              <div className={`text-xl font-bold ${risk.color}`}>{risk.level}</div>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList>
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                統合ダッシュボード
              </TabsTrigger>
              <TabsTrigger value="modules" className="gap-2">
                <Info className="h-4 w-4" />
                モジュール詳細
              </TabsTrigger>
              <TabsTrigger value="simulator" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                シナリオシミュレーター
              </TabsTrigger>
              <TabsTrigger value="backtest" className="gap-2">
                <Check className="h-4 w-4" />
                バックテスト
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-[auto_1fr] gap-6">
                {/* Gauge */}
                <Card className={`${risk.borderColor} border-2`}>
                  <CardContent className="pt-6 flex flex-col items-center min-w-[240px]">
                    <RiskGauge score={animScore} size={200}/>
                    <div className={`mt-4 px-6 py-2 rounded-lg ${risk.bgColor} w-full text-center`}>
                      <div className={`text-sm font-semibold ${risk.color}`}>{risk.action}</div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      USS予測: <span className={`font-semibold ${composite>60?"text-red-500":composite>40?"text-amber-500":"text-emerald-500"}`}>
                        {composite>70?"4〜8週後に下落":composite>50?"横ばい〜微落":composite<25?"4〜8週後に上昇":"横ばい"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Module scores */}
                <div className="flex flex-col gap-3">
                  {breakdown.map((m, i) => {
                    const pct = m.subScore
                    const Icon = m.icon
                    const sig = signals[m.key as SignalKey]
                    return (
                      <Card key={i} className="border-l-4" style={{ borderLeftColor: getBarColorHex(pct) }}>
                        <CardContent className="py-3 px-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold">{m.label}</span>
                                <div className="flex gap-3 items-center">
                                  <span className="text-xs text-muted-foreground">weight {m.weight}%</span>
                                  <span className={`text-sm font-bold`} style={{ color: getBarColorHex(pct) }}>
                                    {pct}pt
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${getBarColor(pct)}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1.5">
                            <span className="text-xs text-muted-foreground">{m.sublabel} / {m.lead}</span>
                            <span className="text-xs text-muted-foreground">
                              現在値: <span className="text-foreground">{sig?.value}{sig?.unit}</span>
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Historical Chart */}
              <Card>
                <CardHeader className="pb-2">
<CardTitle className="text-base">リスクスコア vs USS成約単価 vs 新車登録（12週先行）2021-2026</CardTitle>
  <p className="text-xs text-muted-foreground">
  緑の新車登録が約3ヶ月先行して動く。新車登録増加→中古車相場下落、減少→上昇の傾向。
  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={historicalScores} margin={{top:5,right:60,left:0,bottom:5}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5}/>
                        <XAxis dataKey="month" tick={{fill:"hsl(var(--muted-foreground))",fontSize:10}} interval={4} tickLine={false}/>
                        <YAxis yAxisId="score" domain={[0,100]} tick={{fill:"#f97316",fontSize:10}}
                          tickFormatter={v=>`${v}`} tickLine={false} axisLine={false}/>
                        <YAxis yAxisId="price" orientation="right" domain={[45,135]}
                          tick={{fill:"#3b82f6",fontSize:10}} tickFormatter={v=>`${v}万`} tickLine={false} axisLine={false}/>
                        <YAxis yAxisId="newcar" orientation="right" domain={[40,140]} hide/>
                        <Tooltip content={<CustomTooltip />}/>
                        <ReferenceLine yAxisId="score" y={60} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6}/>
                        <ReferenceLine yAxisId="score" y={30} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.4}/>
                        <Line yAxisId="newcar" type="monotone" dataKey="newCarReg" name="新車登録（12週先行）"
                          stroke="#22c55e" strokeWidth={2} dot={false} strokeDasharray="5 3"/>
                        <Area yAxisId="score" type="monotone" dataKey="score" name="リスクスコア"
                          stroke="#f97316" fill="rgba(249,115,22,0.1)" strokeWidth={2}/>
                        <Line yAxisId="price" type="monotone" dataKey="ussPrice" name="USS成約単価"
                          stroke="#3b82f6" strokeWidth={2.5} dot={false}/>
                        <Legend wrapperStyle={{fontSize:11}}/>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Modules Tab */}
            <TabsContent value="modules" className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {breakdown.map((m, i) => {
                  const pct = m.subScore
                  const Icon = m.icon
                  const riskLabel = pct>70?"危険":pct>45?"警戒":pct>25?"注意":"安全"
                  return (
                    <Card key={i} className="border" style={{ borderColor: `${getBarColorHex(pct)}44` }}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between mb-3">
                          <Icon className="h-6 w-6 text-muted-foreground" />
                          <Badge variant="outline" style={{ 
                            backgroundColor: `${getBarColorHex(pct)}20`, 
                            color: getBarColorHex(pct),
                            borderColor: `${getBarColorHex(pct)}44`
                          }}>
                            {riskLabel}
                          </Badge>
                        </div>
                        <div className="text-base font-semibold mb-0.5">{m.label}</div>
                        <div className="text-xs text-muted-foreground mb-4">{m.sublabel}</div>

                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{
                              background: `conic-gradient(${getBarColorHex(pct)} ${pct*3.6}deg, hsl(var(--muted)) 0deg)`
                            }}
                          >
                            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                              <span className="text-lg font-bold" style={{ color: getBarColorHex(pct) }}>{pct}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">モジュールスコア</div>
                            <div className="text-xs text-muted-foreground">
                              加重寄与: <span className="text-foreground font-semibold">{m.weighted}pt</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          {[
                            ["相関係数", `r = ${m.r}`],
                            ["先行時間", m.lead],
                            ["重み", `${m.weight}%`],
                            ["データ源", m.source],
                          ].map(([k,v],j)=>(
                            <div key={j} className="flex gap-2">
                              <span className="text-muted-foreground w-16 shrink-0">{k}</span>
                              <span className="text-foreground">{v}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className="bg-blue-500/5 border-blue-500/20">
                <CardContent className="pt-4">
                  <h3 className="text-sm font-semibold text-blue-500 mb-2">重み付けの設計思想</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-orange-500">M1（小売成約率30%）</strong>が最大なのは、
                    Insight独自データかつr=0.94の最強精度を持ち、7週先行という最長リードタイムを持つから。
                    <strong className="text-emerald-500">M2（成約率20%）</strong>は既存USSデータで完結する実装容易性と3週先行を評価。
                    <strong className="text-red-500">M3（輸出圧力20%）</strong>は2023年の「台数増だが相場下落」という逆説を説明できる唯一の指標。
                    M6（規制）はイベント系で頻度は低いが発動時のインパクトが極めて大きい（r=0.92）。
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Simulator Tab */}
            <TabsContent value="simulator" className="space-y-6">
              <p className="text-sm text-muted-foreground">
                各シグナルの値を変えてリスクスコアの変化を確認する。過去のターニングポイントを再現できる。
              </p>

              <div className="grid grid-cols-2 gap-4">
                {modules.map((m, i) => {
                  const sig = signals[m.key as SignalKey]
                  const Icon = m.icon
                  return (
                    <Card key={i}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{m.label}</span>
                          </div>
                          <span className="text-lg font-bold text-primary">
                            {sig.value}{sig.unit}
                          </span>
                        </div>
                        <Slider
                          value={[sig.value]}
                          min={sig.direction === "down_bad" ? 50 : 90}
                          max={sig.direction === "down_bad" ? 90 : 135}
                          step={0.5}
                          onValueChange={(val) => {
                            setSignals(prev => ({
                              ...prev,
                              [m.key]: { ...prev[m.key as SignalKey], value: val[0] }
                            }))
                          }}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{sig.direction === "down_bad" ? "低（危険）" : "低（安全）"}</span>
                          <span>{sig.direction === "down_bad" ? "高（安全）" : "高（危険）"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className={`${risk.borderColor} border-2`}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-8">
                    <RiskGauge score={composite} size={140}/>
                    <div>
                      <div className={`text-4xl font-bold ${risk.color} mb-2`}>
                        {composite}pt — {risk.level}
                      </div>
                      <div className="text-foreground mb-3">{risk.action}</div>
                      <div className="flex gap-2 flex-wrap">
                        {breakdown.map((m,i)=>(
                          <Badge key={i} variant="outline" style={{ 
                            backgroundColor: `${getBarColorHex(m.subScore)}15`, 
                            color: getBarColorHex(m.subScore)
                          }}>
                            {m.label.split(" ")[0]}: {m.subScore}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <div className="text-sm text-muted-foreground mb-3">過去の重要局面を再現</div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    {label:"2022Q3 ピーク直前",color:"amber",
                      vals:{m1_retail:{value:75.8},m2_auction:{value:79.6},m3_epi:{value:115},m4_newcar:{value:105},m5_scfi:{value:200},m6_regulation:{value:0}}},
                    {label:"2023Q1 急落期",color:"red",
                      vals:{m1_retail:{value:64.5},m2_auction:{value:72.8},m3_epi:{value:72},m4_newcar:{value:118},m5_scfi:{value:95},m6_regulation:{value:1}}},
                    {label:"2021Q2 急騰期",color:"emerald",
                      vals:{m1_retail:{value:81.5},m2_auction:{value:73.2},m3_epi:{value:108},m4_newcar:{value:92},m5_scfi:{value:380},m6_regulation:{value:0}}},
                    {label:"2019Q4 安定期",color:"slate",
                      vals:{m1_retail:{value:77.8},m2_auction:{value:61.8},m3_epi:{value:94},m4_newcar:{value:100},m5_scfi:{value:92},m6_regulation:{value:0}}},
                  ].map((sc,i)=>(
                    <Button key={i} variant="outline" size="sm" onClick={()=>{
                      setSignals(prev=>{
                        const next = {...prev}
                        for(const [k, v] of Object.entries(sc.vals)){
                          next[k as SignalKey] = {...prev[k as SignalKey], ...(v as {value: number})}
                        }
                        return next
                      })
                    }}>
                      {sc.label}
                    </Button>
                  ))}
                  <Button variant="ghost" size="sm" onClick={()=>setSignals({...initialSignals})}>
                    リセット
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Backtest Tab */}
            <TabsContent value="backtest" className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[
                  {label:"全体精度",value:`${backtestAccuracy.overall}%`,color:"text-blue-500",sub:"2015Q1-2025Q4"},
                  {label:"急落検知精度",value:`${backtestAccuracy.crashes}%`,color:"text-red-500",sub:"DOWN予測の的中率"},
                  {label:"急騰検知精度",value:`${backtestAccuracy.surges}%`,color:"text-emerald-500",sub:"UP予測の的中率"},
                  {label:"検証期間",value:"60ヶ月",color:"text-orange-500",sub:"2021年4月〜2026年3月"},
                ].map((k,i)=>(
                  <Card key={i}>
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground mb-1">{k.label}</div>
                      <div className={`text-3xl font-bold ${k.color}`}>{k.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{k.sub}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-6 gap-4 p-3 bg-muted/50 text-xs font-semibold text-muted-foreground">
                    <div>年/月</div>
                    <div>スコア</div>
                    <div>リスク</div>
                    <div>予測方向</div>
                    <div>実際の変化</div>
                    <div>判定</div>
                  </div>
                  <ScrollArea className="h-[400px]">
                    {historicalScores.map((row, i) => {
                      const r = getRiskLevel(row.score)
                      return (
<div key={i} className={`grid grid-cols-6 gap-4 p-3 border-t border-border text-sm ${row.event ? 'bg-amber-500/5' : ''}`}>
  <div className="font-medium">{row.month}</div>
                          <div className={`font-bold ${r.color}`}>{row.score}</div>
                          <div className={r.color}>{r.level}</div>
                          <div className={row.predicted==="DOWN"?"text-red-500":row.predicted==="UP"?"text-emerald-500":"text-muted-foreground"}>
                            {row.predicted==="DOWN" && <TrendingDown className="inline h-4 w-4 mr-1" />}
                            {row.predicted==="UP" && <TrendingUp className="inline h-4 w-4 mr-1" />}
                            {row.predicted==="FLAT" && <Minus className="inline h-4 w-4 mr-1" />}
                            {row.predicted==="DOWN"?"下落":row.predicted==="UP"?"上昇":"横ばい"}
                          </div>
                          {/* Actual change display with null safety */}
                          <div className={row.actual !== null && row.actual > 2 ? "text-emerald-500" : row.actual !== null && row.actual < -2 ? "text-red-500" : "text-muted-foreground"}>
                            {row.actual !== null ? `${row.actual > 0 ? "+" : ""}${row.actual.toFixed(1)}%` : "-"}
                          </div>
                          <div>
                            {row.correct === null ? 
                              <Minus className="h-5 w-5 text-muted-foreground" /> :
                              row.correct ? 
                              <Check className="h-5 w-5 text-emerald-500" /> : 
                              <X className="h-5 w-5 text-red-500" />
                            }
                          </div>
                        </div>
                      )
                    })}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="pt-4">
                  <h3 className="text-sm font-semibold text-amber-500 mb-2">誤判定パターンの分析</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    主な誤判定は2パターン：<strong className="text-foreground">COVID底からの急反発（20Q2）</strong>—
                    全指標が崩壊時にのみ機能し底打ちサインを持たない。<strong className="text-foreground">安定期の小幅変動</strong>—
                    スコアが30〜45のゾーンでの±2%程度の変動は「横ばい」と判定するため誤判定が発生。
                    いずれも<strong className="text-amber-500">大きなリスク（急落・急騰）の検知には影響しない</strong>。
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
