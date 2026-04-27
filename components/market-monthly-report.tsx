"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  TrendingDown,
  Car,
  Ship,
  Building2,
  AlertTriangle,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Gavel,
  Target,
  Globe,
  Lightbulb,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// ==================== 2026年3月号 レポートデータ ====================

const reportMeta = {
  title: "中古車市場月次レポート",
  subtitle: "2026年3月号",
  publishDate: "2026年4月",
  targetPeriod: "2026年3月実績",
  source: "車選びドットコム symphony事業本部",
  headline: "転換点を示す3月。新車の弱含み、中古車の底入れ、AA相場の調整、輸出構造の組み替え。",
}

// キーメトリクス
const keyMetrics = [
  { label: "新車登録", value: 49.1, unit: "万台", change: -1.8, isPositive: false },
  { label: "中古車登録", value: 79.6, unit: "万台", change: 2.5, isPositive: true },
  { label: "USS平均成約単価", value: 122, unit: "万円", change: 9.3, isPositive: true },
  { label: "USS成約率", value: 67.9, unit: "%", change: 2.1, isPositive: true, changeUnit: "pt" },
]

// エグゼクティブサマリー
const executiveSummary = [
  {
    title: "新車は8カ月連続で前年割れ",
    description: "新車登録は49.1万台で前年比1.8%減。普通車は7.3%減と弱含む一方、軽自動車は8.7%増で4カ月連続のプラス。市場の中軸が登録車から軽へ移る傾向が鮮明に。",
  },
  {
    title: "中古車が3カ月ぶりプラス",
    description: "普通車中古車登録は41.4万台で前年比1.2%増、3カ月ぶりに前年水準を回復。軽中古車も38.2万台で3.9%増。年度末の名義変更需要が市場全体を押し上げました。",
  },
  {
    title: "AA相場が調整局面に突入",
    description: "USS3月平均成約単価は122万円で前年比9.3%増を維持しつつ前月比16万円の急落。1月、2月の過去最高更新後、出品増で需給が緩み調整局面に入りました。",
  },
  {
    title: "輸出ハブ地殻変動",
    description: "ホルムズ海峡情勢でUAE向けが2月に14.5%減、タンザニアは116.9%増で首位浮上。アフリカ直送ルートへの仕向地ポートフォリオ組み替えが進行中。",
  },
  {
    title: "倒産は過去最多水準",
    description: "中古車販売店倒産は2025年通期で過去最多水準。仕入れ難、利益率低下、資金繰り悪化の三重苦。AA仕入れ依存型の小規模事業者ほど経営余地が縮小。",
  },
]

// 月別推移データ（2025年度）
const monthlyTrendData = [
  { month: "4月", newCar: 342878, newCarYoY: 110.5, usedCar: 544174, usedCarYoY: 100.7 },
  { month: "5月", newCar: 324069, newCarYoY: 103.7, usedCar: 506139, usedCarYoY: 96.3 },
  { month: "6月", newCar: 393162, newCarYoY: 105.2, usedCar: 535385, usedCarYoY: 105.8 },
  { month: "7月", newCar: 390512, newCarYoY: 96.4, usedCar: 570807, usedCarYoY: 101.3 },
  { month: "8月", newCar: 301219, newCarYoY: 91.7, usedCar: 461678, usedCarYoY: 98.8 },
  { month: "9月", newCar: 428216, newCarYoY: 97.6, usedCar: 547288, usedCarYoY: 106.7 },
  { month: "10月", newCar: 395189, newCarYoY: 98.2, usedCar: 568915, usedCarYoY: 99.1 },
  { month: "11月", newCar: 369721, newCarYoY: 94.9, usedCar: 466023, usedCarYoY: 91.9 },
  { month: "12月", newCar: 335459, newCarYoY: 101.7, usedCar: 525580, usedCarYoY: 103.3 },
  { month: "1月", newCar: 367748, newCarYoY: 97.7, usedCar: 466605, usedCarYoY: 96.5 },
  { month: "2月", newCar: 394965, newCarYoY: 96.5, usedCar: 500388, usedCarYoY: 100.4 },
  { month: "3月", newCar: 490640, newCarYoY: 98.2, usedCar: 796078, usedCarYoY: 102.5, highlight: true },
]

// 普通車新車ランキング
const newCarRanking = [
  { rank: 1, name: "ヤリス", maker: "トヨタ", sales: 13607, yoy: 82.6, note: "改良モデル投入で支持継続" },
  { rank: 2, name: "カローラ", maker: "トヨタ", sales: 12835, yoy: 78.5, note: "セダン／ツーリングの幅広さが強み" },
  { rank: 3, name: "シエンタ", maker: "トヨタ", sales: 11674, yoy: 92.3, note: "コンパクトミニバンとして使い勝手" },
  { rank: 4, name: "フリード", maker: "ホンダ", sales: 10932, yoy: 98.4, note: "ファミリー需要を取り込み前月5位から浮上" },
  { rank: 5, name: "ライズ", maker: "トヨタ", sales: 10646, yoy: 143.9, note: "コンパクトSUVで大幅伸長" },
  { rank: 6, name: "ヴェゼル", maker: "ホンダ", sales: 9519, yoy: 116.8, note: "SUVとしてトップ10入り" },
  { rank: 7, name: "ノート", maker: "日産", sales: 9169, yoy: 91.6, note: "日産勢のコンパクトカー主力" },
  { rank: 8, name: "ヴォクシー", maker: "トヨタ", sales: 8580, yoy: 116.6, note: "ミドルミニバン需要が底堅い" },
  { rank: 9, name: "ノア", maker: "トヨタ", sales: 8075, yoy: 95.0, note: "兄弟車ヴォクシーと並び存在感" },
  { rank: 10, name: "セレナ", maker: "日産", sales: 7794, yoy: 82.1, note: "日産勢の主力ミニバン" },
]

// 軽自動車新車ランキング
const keiCarRanking = [
  { rank: 1, name: "N-BOXシリーズ", maker: "ホンダ", sales: 21342, mom: 115.3, note: "軽自動車市場のフラッグシップ" },
  { rank: 2, name: "スペーシアシリーズ", maker: "スズキ", sales: 16039, mom: 111.1, note: "フルモデルチェンジ効果が継続" },
  { rank: 3, name: "ムーヴシリーズ", maker: "ダイハツ", sales: 14690, mom: 128.9, note: "新型効果で大幅伸長" },
  { rank: 4, name: "タントシリーズ", maker: "ダイハツ", sales: 14393, mom: 128.3, note: "3月に大きく台数を伸ばす" },
  { rank: 5, name: "ルークス", maker: "日産", sales: 11768, mom: 123.6, note: "日産勢の主力軽" },
  { rank: 6, name: "ハスラー", maker: "スズキ", sales: 9225, mom: 116.9, note: "個性派軽SUVとして安定" },
  { rank: 7, name: "デリカミニ／eKシリーズ", maker: "三菱", sales: 8353, mom: 153.4, note: "三菱／日産連合で急伸" },
  { rank: 8, name: "ワゴンR", maker: "スズキ", sales: 6792, mom: 121.6, note: "軽セダン系の代表格" },
  { rank: 9, name: "ミラ", maker: "ダイハツ", sales: 6432, mom: 133.9, note: "ダイハツ復活の追い風" },
  { rank: 10, name: "デイズ", maker: "日産", sales: 5433, mom: 109.7, note: "日産軽セダン系" },
]

// USS月次データ
const ussMonthlyData = [
  { month: "4月", listings: 327914, contracts: 200476, rate: 61.1, avgPrice: 1065, priceYoY: 94.9 },
  { month: "5月", listings: 290251, contracts: 187194, rate: 64.5, avgPrice: 1184, priceYoY: 98.4 },
  { month: "6月", listings: 289533, contracts: 183429, rate: 63.4, avgPrice: 1230, priceYoY: 99.2 },
  { month: "7月", listings: 306955, contracts: 203188, rate: 66.2, avgPrice: 1244, priceYoY: 99.0 },
  { month: "8月", listings: 233141, contracts: 162263, rate: 69.6, avgPrice: 1224, priceYoY: 98.5 },
  { month: "9月", listings: 276888, contracts: 194631, rate: 70.3, avgPrice: 1303, priceYoY: 105.1 },
  { month: "10月", listings: 314395, contracts: 216185, rate: 68.8, avgPrice: 1305, priceYoY: 105.7 },
  { month: "11月", listings: 292696, contracts: 199242, rate: 68.1, avgPrice: 1297, priceYoY: 109.6 },
  { month: "12月", listings: 256699, contracts: 169328, rate: 66.0, avgPrice: 1252, priceYoY: 110.5 },
  { month: "1月", listings: 272007, contracts: 189320, rate: 69.6, avgPrice: 1346, priceYoY: 107.7 },
  { month: "2月", listings: 294698, contracts: 205104, rate: 69.6, avgPrice: 1380, priceYoY: 109.5 },
  { month: "3月", listings: 349260, contracts: 237206, rate: 67.9, avgPrice: 1220, priceYoY: 109.3, highlight: true },
]

// 輸出仕向地データ（2026年2月）
const exportDestinations = [
  { country: "タンザニア", share2025: 4.2, share202602: 12.5, change: 116.9, isUp: true },
  { country: "UAE", share2025: 14.8, share202602: 10.7, change: -14.5, isUp: false },
  { country: "ロシア", share2025: 10.9, share202602: 9.8, change: -6.3, isUp: false },
  { country: "ニュージーランド", share2025: 8.5, share202602: 8.2, change: 5.2, isUp: true },
  { country: "オーストラリア", share2025: 6.2, share202602: 6.8, change: 12.1, isUp: true },
  { country: "モンゴル", share2025: 5.1, share202602: 5.9, change: 22.4, isUp: true },
  { country: "スリランカ", share2025: 4.8, share202602: 4.2, change: -8.3, isUp: false },
]

// 倒産統計
const bankruptcyStats = [
  { label: "2025年1-5月 倒産件数", value: "50件", change: "+56.3%", note: "13年ぶり高水準" },
  { label: "2025年1-9月 倒産件数", value: "82件", change: "", note: "過去10年で同期最多" },
  { label: "小規模倒産比率", value: "80%", change: "", note: "負債1億円未満" },
]

// 車選びドットコム 国産車ボディタイプ別
const domesticBodyTypeRanking = [
  { rank: 1, type: "軽自動車", share: 33.2, change: 0.7 },
  { rank: 2, type: "ミニバン／ワンボックス", share: 15.8, change: 0.5 },
  { rank: 3, type: "コンパクト／ハッチバック", share: 13.0, change: -0.1 },
  { rank: 4, type: "軽バン／軽ワゴン", share: 8.7, change: 0.3 },
  { rank: 5, type: "セダン／ハードトップ", share: 7.2, change: -0.2 },
]

// 車選びドットコム 国産車車種別
const domesticVehicleRanking = [
  { rank: 1, name: "プリウス", maker: "トヨタ", prevRank: 1, movement: "same" },
  { rank: 2, name: "N-BOX", maker: "ホンダ", prevRank: 4, movement: "up" },
  { rank: 3, name: "N-BOXカスタム", maker: "ホンダ", prevRank: 2, movement: "down" },
  { rank: 4, name: "セレナ", maker: "日産", prevRank: 3, movement: "down" },
  { rank: 5, name: "ハイゼットカーゴ", maker: "ダイハツ", prevRank: 5, movement: "same" },
  { rank: 6, name: "ワゴンR", maker: "スズキ", prevRank: 6, movement: "same" },
  { rank: 7, name: "アルファード", maker: "トヨタ", prevRank: 11, movement: "up" },
  { rank: 8, name: "タント", maker: "ダイハツ", prevRank: 9, movement: "up" },
  { rank: 9, name: "エブリイ", maker: "スズキ", prevRank: 7, movement: "down" },
  { rank: 10, name: "ハスラー", maker: "スズキ", prevRank: 8, movement: "down" },
]

// 輸入車車種別
const importVehicleRanking = [
  { rank: 1, name: "ミニ", maker: "BMW MINI", prevRank: 1, movement: "same" },
  { rank: 2, name: "500", maker: "フィアット", prevRank: 2, movement: "same" },
  { rank: 3, name: "ミニクロスオーバー", maker: "BMW MINI", prevRank: 4, movement: "up" },
  { rank: 4, name: "911", maker: "ポルシェ", prevRank: 3, movement: "down" },
  { rank: 5, name: "モデル3", maker: "テスラ", prevRank: 5, movement: "same" },
  { rank: 6, name: "Gクラス", maker: "メルセデス・ベンツ", prevRank: 7, movement: "up" },
  { rank: 7, name: "3シリーズセダン", maker: "BMW", prevRank: 8, movement: "up" },
  { rank: 8, name: "ミニクラブマン", maker: "BMW MINI", prevRank: 6, movement: "down" },
  { rank: 9, name: "Cクラスワゴン", maker: "メルセデス・ベンツ", prevRank: 10, movement: "up" },
  { rank: 10, name: "Eクラス", maker: "メルセデス・ベンツ", prevRank: 9, movement: "down" },
]

// チャートの色設定
const CHART_COLORS = {
  primary: "#3b82f6",
  secondary: "#10b981",
  accent: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
}

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"]

export function MarketMonthlyReport() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      {/* レポートヘッダー */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-widest mb-3">
            <div className="h-px w-6 bg-amber-400" />
            {reportMeta.subtitle}
            <div className="h-px w-6 bg-amber-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{reportMeta.title}</h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">{reportMeta.headline}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              発行: {reportMeta.publishDate}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              対象: {reportMeta.targetPeriod}
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {reportMeta.source}
            </span>
          </div>
        </div>
      </div>

      {/* キーメトリクス */}
      <div className="grid gap-4 md:grid-cols-4">
        {keyMetrics.map((metric, i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value}
                <span className="text-base font-normal text-muted-foreground ml-1">{metric.unit}</span>
              </div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {metric.isPositive ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={metric.isPositive ? "text-green-500" : "text-red-500"}>
                  {metric.change >= 0 ? "+" : ""}{metric.change}{metric.changeUnit || "%"}
                </span>
                <span className="text-muted-foreground">前年比</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* エグゼクティブサマリー */}
      <Card className="border-l-4 border-l-red-600 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-900/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs">EXECUTIVE SUMMARY</Badge>
          </div>
          <CardDescription className="text-base font-medium text-foreground mt-2">
            2026年3月の国内自動車市場は、年度末需要を背景に新車・中古車ともに前月比で大幅増となりました。一方で前年同月比では新車が依然として弱く、中古車は3カ月ぶりにプラスへ転じています。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {executiveSummary.map((point, i) => (
              <div
                key={i}
                className="relative p-4 bg-card border rounded-lg hover:border-primary/30 transition-colors"
              >
                <div className="absolute -top-3 right-3 text-4xl font-serif font-bold text-red-500/20">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="font-semibold text-sm mb-2 pr-8">{point.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* タブナビゲーション */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-5 h-11">
          <TabsTrigger value="overview" className="gap-1.5 text-xs">
            <Car className="h-3.5 w-3.5" />
            販売動向
          </TabsTrigger>
          <TabsTrigger value="auction" className="gap-1.5 text-xs">
            <Gavel className="h-3.5 w-3.5" />
            AA市場
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-1.5 text-xs">
            <Ship className="h-3.5 w-3.5" />
            輸出動向
          </TabsTrigger>
          <TabsTrigger value="rankings" className="gap-1.5 text-xs">
            <Target className="h-3.5 w-3.5" />
            ランキング
          </TabsTrigger>
          <TabsTrigger value="industry" className="gap-1.5 text-xs">
            <Building2 className="h-3.5 w-3.5" />
            業界動向
          </TabsTrigger>
        </TabsList>

        {/* === 販売動向タブ === */}
        <TabsContent value="overview" className="space-y-6">
          {/* 月別推移チャート */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                新車・中古車登録台数の月別推移
              </CardTitle>
              <CardDescription>2025年度（2025年4月〜2026年3月）</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrendData}>
                    <defs>
                      <linearGradient id="colorNewCar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorUsedCar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis 
                      tick={{ fill: "#6b7280", fontSize: 12 }} 
                      tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()}台`, ""]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Area
                      type="monotone"
                      dataKey="newCar"
                      name="新車登録"
                      stroke={CHART_COLORS.primary}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorNewCar)"
                    />
                    <Area
                      type="monotone"
                      dataKey="usedCar"
                      name="中古車登録"
                      stroke={CHART_COLORS.secondary}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorUsedCar)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* 月別データテーブル */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">月別推移データ</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>月</TableHead>
                      <TableHead className="text-right">新車登録</TableHead>
                      <TableHead className="text-right">前年比</TableHead>
                      <TableHead className="text-right">中古車登録</TableHead>
                      <TableHead className="text-right">前年比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlyTrendData.map((row) => (
                      <TableRow key={row.month} className={row.highlight ? "bg-red-50 dark:bg-red-900/10" : ""}>
                        <TableCell className="font-medium">{row.month}</TableCell>
                        <TableCell className="text-right font-mono">{row.newCar.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={row.newCarYoY >= 100 ? "text-green-500" : "text-red-500"}>
                            {row.newCarYoY.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-mono">{row.usedCar.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={row.usedCarYoY >= 100 ? "text-green-500" : "text-red-500"}>
                            {row.usedCarYoY.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* インサイトボックス */}
          <Card className="border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Lightbulb className="h-4 w-4" />
                <span className="text-xs font-semibold tracking-wider">INSIGHT / 流通量回復と良質玉不足のねじれ</span>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                3カ月ぶりにプラス転換した最大の要因は、新車販売の代替が進んだことです。新車の納期遅延が解消に向かう中で、買い替えに伴う下取り・買取の発生が増え、それが小売市場への供給を下支えしました。
              </p>
              <p>
                ただし、内訳を見ると<strong className="text-red-600 dark:text-red-400">依然として供給制約は残存</strong>しています。市場で求められやすい高年式・低走行の車両、いわゆる5年落ち相当の車両は2021年の新車減産の影響で慢性的に不足しており、AA落札単価の高止まりに直結しています。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === AAオークション市場タブ === */}
        <TabsContent value="auction" className="space-y-6">
          {/* USS実績サマリー */}
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "出品台数", value: "34.9万台", change: "+4.5%", isPositive: true },
              { label: "成約台数", value: "23.7万台", change: "+7.9%", isPositive: true },
              { label: "成約率", value: "67.9%", change: "+2.1pt", isPositive: true },
              { label: "平均成約単価", value: "122万円", change: "+9.3%", isPositive: true },
            ].map((stat, i) => (
              <Card key={i} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    {stat.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={stat.isPositive ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                    <span className="text-muted-foreground">前年比</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* USS価格推移チャート */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Gavel className="h-5 w-5 text-primary" />
                USS平均成約単価と出品台数の推移
              </CardTitle>
              <CardDescription>
                2月の過去最高138万円から3月は122万円へ調整。出品台数増加により需給バランスが緩和。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ussMonthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      tickFormatter={(v) => `${v}千円`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      tickFormatter={(v) => `${(v / 10000).toFixed(0)}万`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar yAxisId="right" dataKey="listings" name="出品台数" fill={CHART_COLORS.primary} opacity={0.3} />
                    <Bar yAxisId="left" dataKey="avgPrice" name="平均単価(千円)" fill={CHART_COLORS.accent} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* USS月次テーブル */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">USS月次データ詳細</CardTitle>
              <CardDescription>2025年度通期実績</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>月</TableHead>
                      <TableHead className="text-right">出品台数</TableHead>
                      <TableHead className="text-right">成約台数</TableHead>
                      <TableHead className="text-right">成約率</TableHead>
                      <TableHead className="text-right">平均単価</TableHead>
                      <TableHead className="text-right">単価前年比</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ussMonthlyData.map((row) => (
                      <TableRow key={row.month} className={row.highlight ? "bg-red-50 dark:bg-red-900/10" : ""}>
                        <TableCell className="font-medium">{row.month}</TableCell>
                        <TableCell className="text-right font-mono">{row.listings.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">{row.contracts.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{row.rate.toFixed(1)}%</TableCell>
                        <TableCell className="text-right font-mono">{row.avgPrice.toLocaleString()}千円</TableCell>
                        <TableCell className="text-right">
                          <span className={row.priceYoY >= 100 ? "text-green-500" : "text-red-500"}>
                            {row.priceYoY.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>通期</TableCell>
                      <TableCell className="text-right font-mono">3,504,437</TableCell>
                      <TableCell className="text-right font-mono">2,347,566</TableCell>
                      <TableCell className="text-right">67.0%</TableCell>
                      <TableCell className="text-right font-mono">1,255千円</TableCell>
                      <TableCell className="text-right text-green-500">104.1%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === 輸出動向タブ === */}
        <TabsContent value="export" className="space-y-6">
          {/* 輸出概要 */}
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "2025年 輸出総台数", value: "171.3万台", change: "+8.9%", isPositive: true },
              { label: "2026年2月 輸出台数", value: "14.4万台", change: "+5.5%", isPositive: true },
              { label: "主要仕向地", value: "UAE → タンザニア", note: "首位交代", isChange: true },
            ].map((stat, i) => (
              <Card key={i} className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.isChange ? (
                    <div className="flex items-center gap-1 text-xs mt-1 text-amber-500">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{stat.note}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs mt-1">
                      {stat.isPositive ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={stat.isPositive ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                      <span className="text-muted-foreground">前年比</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 仕向地シェア変化 */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                輸出仕向地シェアの変化
              </CardTitle>
              <CardDescription>
                ホルムズ海峡情勢により、UAE向けが減少しタンザニアが首位に浮上
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>仕向地</TableHead>
                    <TableHead className="text-right">2025年通年シェア</TableHead>
                    <TableHead className="text-right">2026年2月シェア</TableHead>
                    <TableHead className="text-right">前年同月比</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exportDestinations.map((row) => (
                    <TableRow key={row.country}>
                      <TableCell className="font-medium">{row.country}</TableCell>
                      <TableCell className="text-right">{row.share2025.toFixed(1)}%</TableCell>
                      <TableCell className="text-right font-semibold">{row.share202602.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">
                        <span className={`flex items-center justify-end gap-1 ${row.isUp ? "text-green-500" : "text-red-500"}`}>
                          {row.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {row.change >= 0 ? "+" : ""}{row.change.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* 戦略的示唆 */}
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Target className="h-4 w-4" />
                <span className="text-xs font-semibold tracking-wider">STRATEGIC IMPLICATION / ロジスティクスの分散</span>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                ホルムズ海峡の通常運航の本格回復は早ければ2026年後半とする見方が出ていますが、停戦交渉の状況次第ではさらに長期化するシナリオもあります。
              </p>
              <p>
                中古車輸出業者にとっては、UAE一極集中型のロジスティクスから、アフリカ直送、モンゴル経由（中央アジア・ロシア向け）、東南アジア直送など複数ルートへ分散する戦略の重要性が一気に高まっています。
              </p>
              <p>
                国内の販売店にとっても、輸出向けプレミアムが乗りやすかった<strong className="text-red-600 dark:text-red-400">ランドクルーザー、ハイエース、SUV系の相場が一時的に緩む可能性</strong>があります。
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === ランキングタブ === */}
        <TabsContent value="rankings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 普通車新車ランキング */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">普通車 新車販売ランキング</CardTitle>
                <CardDescription>2026年3月</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">順位</TableHead>
                        <TableHead>車種</TableHead>
                        <TableHead>メーカー</TableHead>
                        <TableHead className="text-right">販売台数</TableHead>
                        <TableHead className="text-right">前年比</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newCarRanking.map((car) => (
                        <TableRow key={car.rank}>
                          <TableCell>
                            <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                              car.rank === 1 ? "bg-yellow-500 text-white" :
                              car.rank === 2 ? "bg-gray-400 text-white" :
                              car.rank === 3 ? "bg-amber-600 text-white" : "bg-muted"
                            }`}>
                              {car.rank}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{car.name}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{car.maker}</TableCell>
                          <TableCell className="text-right font-mono">{car.sales.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <span className={car.yoy >= 100 ? "text-green-500" : "text-red-500"}>
                              {car.yoy.toFixed(1)}%
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* 軽自動車新車ランキング */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">軽自動車 新車販売ランキング</CardTitle>
                <CardDescription>2026年3月</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">順位</TableHead>
                        <TableHead>車種</TableHead>
                        <TableHead>メーカー</TableHead>
                        <TableHead className="text-right">販売台数</TableHead>
                        <TableHead className="text-right">前月比</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {keiCarRanking.map((car) => (
                        <TableRow key={car.rank}>
                          <TableCell>
                            <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                              car.rank === 1 ? "bg-yellow-500 text-white" :
                              car.rank === 2 ? "bg-gray-400 text-white" :
                              car.rank === 3 ? "bg-amber-600 text-white" : "bg-muted"
                            }`}>
                              {car.rank}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{car.name}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{car.maker}</TableCell>
                          <TableCell className="text-right font-mono">{car.sales.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-green-500">{car.mom.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* 車選びドットコム ランキング */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 国産車ランキング */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">車選びドットコム 国産車ランキング</CardTitle>
                <CardDescription>2026年3月 中古車販売動向</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">順位</TableHead>
                      <TableHead>車種</TableHead>
                      <TableHead>メーカー</TableHead>
                      <TableHead className="text-center">変動</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {domesticVehicleRanking.map((car) => (
                      <TableRow key={car.rank}>
                        <TableCell>
                          <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                            car.rank === 1 ? "bg-yellow-500 text-white" :
                            car.rank === 2 ? "bg-gray-400 text-white" :
                            car.rank === 3 ? "bg-amber-600 text-white" : "bg-muted"
                          }`}>
                            {car.rank}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{car.name}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{car.maker}</TableCell>
                        <TableCell className="text-center">
                          {car.movement === "up" && (
                            <Badge className="bg-green-100 text-green-700 text-[10px]">
                              <TrendingUp className="h-3 w-3 mr-0.5" />
                              {car.prevRank}位から
                            </Badge>
                          )}
                          {car.movement === "down" && (
                            <Badge variant="outline" className="text-red-500 text-[10px]">
                              <TrendingDown className="h-3 w-3 mr-0.5" />
                              {car.prevRank}位から
                            </Badge>
                          )}
                          {car.movement === "same" && (
                            <Badge variant="outline" className="text-muted-foreground text-[10px]">
                              維持
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 輸入車ランキング */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">車選びドットコム 輸入車ランキング</CardTitle>
                <CardDescription>2026年3月 中古車販売動向</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">順位</TableHead>
                      <TableHead>車種</TableHead>
                      <TableHead>メーカー</TableHead>
                      <TableHead className="text-center">変動</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importVehicleRanking.map((car) => (
                      <TableRow key={car.rank}>
                        <TableCell>
                          <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                            car.rank === 1 ? "bg-yellow-500 text-white" :
                            car.rank === 2 ? "bg-gray-400 text-white" :
                            car.rank === 3 ? "bg-amber-600 text-white" : "bg-muted"
                          }`}>
                            {car.rank}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{car.name}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{car.maker}</TableCell>
                        <TableCell className="text-center">
                          {car.movement === "up" && (
                            <Badge className="bg-green-100 text-green-700 text-[10px]">
                              <TrendingUp className="h-3 w-3 mr-0.5" />
                              {car.prevRank}位から
                            </Badge>
                          )}
                          {car.movement === "down" && (
                            <Badge variant="outline" className="text-red-500 text-[10px]">
                              <TrendingDown className="h-3 w-3 mr-0.5" />
                              {car.prevRank}位から
                            </Badge>
                          )}
                          {car.movement === "same" && (
                            <Badge variant="outline" className="text-muted-foreground text-[10px]">
                              維持
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* ボディタイプ別シェア */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">国産車 ボディタイプ別販売シェア</CardTitle>
              <CardDescription>2026年3月</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                {domesticBodyTypeRanking.map((type) => (
                  <div key={type.rank} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                        type.rank === 1 ? "bg-yellow-500 text-white" :
                        type.rank === 2 ? "bg-gray-400 text-white" :
                        type.rank === 3 ? "bg-amber-600 text-white" : "bg-muted"
                      }`}>
                        {type.rank}
                      </div>
                      <span className="text-sm font-medium">{type.type}</span>
                    </div>
                    <div className="text-2xl font-bold">{type.share}%</div>
                    <div className={`text-xs ${type.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {type.change >= 0 ? "+" : ""}{type.change}pt
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === 業界動向タブ === */}
        <TabsContent value="industry" className="space-y-6">
          {/* 倒産動向 */}
          <Card className="border-border/50 border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                中古車販売店の倒産動向
              </CardTitle>
              <CardDescription>
                2025年は過去最多水準の倒産件数を記録
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                {bankruptcyStats.map((stat, i) => (
                  <div key={i} className="p-4 rounded-lg border bg-red-50/50 dark:bg-red-900/10">
                    <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stat.value}</div>
                    {stat.change && (
                      <div className="text-xs text-red-500 mt-1">{stat.change}</div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">{stat.note}</div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  倒産が増えている直接的な要因は3つあります。第1に、AA相場の高騰に伴う仕入れ難。第2に、価格転嫁が進まず利益率が低下していること。第3に、ガソリン代・人件費・店舗費等のコスト増が資金繰りを圧迫していることです。
                </p>
                <p>
                  海外バイヤーとの仕入れ競争で「買い負け」する場面が増えており、特に独自の仕入れチャネルを持たない中小販売店ほど影響が大きくなっています。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 外部環境リスク */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">外部環境のリスク要因</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-amber-600">リスク1</Badge>
                  レアアース供給リスク
                </h4>
                <p className="text-sm text-muted-foreground">
                  中国は2025年末に軍民両用品目の日本向け輸出禁止措置を発表。日本のハイブリッド車・電動車製造に必要な磁石用レアアースの約7割を中国に依存しているため、規制が長期化すれば新車の納期遅延を再び招き、中古車相場の押し上げ要因となる可能性があります。
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-amber-600">リスク2</Badge>
                  ガソリン価格の変動
                </h4>
                <p className="text-sm text-muted-foreground">
                  2026年4月時点でレギュラー全国平均167円台まで下落し、3月の史上最高値190.8円から3週間で23円以上下落。ただし、原油価格はホルムズ情勢で上下動が激しく、ガソリン価格は短期的には補助金で抑えられているものの、原油上昇局面では値上がりが再燃するリスクがあります。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4月以降の見通し */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                4月以降の市場見通し
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200/50">
                  <h4 className="font-semibold text-sm mb-2">短期見通し（4〜6月）</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span>新車生産の安定化に伴って下取り発生が増えるかどうか</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span>ホルムズ海峡情勢の進展と輸出向け需要への影響</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span>レアアース供給リスクが顕在化するかどうか</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-purple-50/50 dark:bg-purple-900/10 border border-purple-200/50">
                  <h4 className="font-semibold text-sm mb-2">中期見通し（2026年下期）</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                      <span>新車供給の安定化と輸出環境の正常化が同時に進むシナリオでは、相場上昇トレンドにブレーキがかかる可能性</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                      <span>地政学リスクが長期化する場合は、AA相場は高止まりが継続する可能性</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 販売店の戦略課題 */}
          <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Lightbulb className="h-4 w-4" />
                <span className="text-xs font-semibold tracking-wider">三つの戦略軸</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "仕入れチャネルの多角化",
                    description: "AA仕入れに偏らない仕入れチャネルの多角化。販売店間の業販ネットワーク、買取の強化、未使用車仕入れ、リース返却車仕入れなど、複数の経路を持つことで仕入れ価格と確保力の両立を図る。"
                  },
                  {
                    title: "データドリブンな価格設定",
                    description: "相場の変動が激しい局面では、在庫日数の管理、車両ごとの粗利・回転率の可視化、適正価格の即時把握が利益確保の鍵。AIプライシングや販売実績ベースの相場参照を活用。"
                  },
                  {
                    title: "付帯収益の拡大",
                    description: "保証、整備、オートローン、保険、買取サービスなど、車両販売だけに依存しない収益構造への転換が、利幅縮小局面での経営安定に直結。"
                  }
                ].map((strategy, i) => (
                  <div key={i} className="p-4 rounded-lg border bg-card">
                    <h4 className="font-semibold text-sm mb-2 text-primary">{strategy.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{strategy.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
