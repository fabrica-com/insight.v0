"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, TrendingUp, FileText, Globe, ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, BarChart3, Users, Package, Building2, Activity, Target } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts"

// Market Overview Data
const marketTrendData = [
  { month: "7月", marketSales: 1250, exportVolume: 450, avgPrice: 2850000 },
  { month: "8月", marketSales: 1320, exportVolume: 480, avgPrice: 2920000 },
  { month: "9月", marketSales: 1180, exportVolume: 420, avgPrice: 2880000 },
  { month: "10月", marketSales: 1450, exportVolume: 520, avgPrice: 3050000 },
  { month: "11月", marketSales: 1580, exportVolume: 580, avgPrice: 3100000 },
  { month: "12月", marketSales: 1750, exportVolume: 650, avgPrice: 3150000 },
]

const strRankingData = [
  { month: "7月", rank: 3, str: 85.2 },
  { month: "8月", rank: 2, str: 88.5 },
  { month: "9月", rank: 4, str: 82.1 },
  { month: "10月", rank: 2, str: 89.4 },
  { month: "11月", rank: 1, str: 92.3 },
  { month: "12月", rank: 1, str: 94.8 },
]

// Company Specific Data
const companyPerformanceData = [
  { month: "7月", sales: 87, target: 80, revenue: 245000000 },
  { month: "8月", sales: 92, target: 85, revenue: 268000000 },
  { month: "9月", sales: 78, target: 85, revenue: 221000000 },
  { month: "10月", sales: 95, target: 90, revenue: 287000000 },
  { month: "11月", sales: 103, target: 95, revenue: 312000000 },
  { month: "12月", sales: 118, target: 100, revenue: 356000000 },
]

const competitorComparisonData = [
  { subject: '価格競争力', A: 120, B: 110, fullMark: 150 },
  { subject: '在庫回転率', A: 98, B: 130, fullMark: 150 },
  { subject: '顧客満足度', A: 86, B: 130, fullMark: 150 },
  { subject: '成約率', A: 99, B: 100, fullMark: 150 },
  { subject: '在庫数', A: 85, B: 90, fullMark: 150 },
  { subject: 'ブランド力', A: 65, B: 85, fullMark: 150 },
]

// Export destination data (Reused)
const exportData = [
  { country: "ニュージーランド", count: 45, revenue: 98500000, share: 32.5 },
  { country: "オーストラリア", count: 38, revenue: 87200000, share: 27.4 },
  { country: "UAE", count: 28, revenue: 72100000, share: 20.2 },
  { country: "ロシア", count: 22, revenue: 48900000, share: 15.9 },
  { country: "その他", count: 6, revenue: 11300000, share: 4.0 },
]

const CHART_COLORS = {
  primary: '#3b82f6', // Blue
  secondary: '#10b981', // Green
  accent: '#f59e0b', // Orange
  purple: '#a855f7', // Purple
  pink: '#ec4899', // Pink
  red: '#ef4444', // Red
  teal: '#14b8a6', // Teal
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#ec4899']

// Mock data for trending vehicles ranking to replace STR ranking chart
const trendingRankingData = [
  { rank: 1, make: "トヨタ", model: "アルファード", str: 28.5, listings: 234, sold: 67, trend: 8.3 },
  { rank: 2, make: "ホンダ", model: "ヴェゼル", str: 24.2, listings: 189, sold: 46, trend: 5.1 },
  { rank: 3, make: "トヨタ", model: "ハリアー", str: 22.8, listings: 167, sold: 38, trend: 3.2 },
  { rank: 4, make: "メルセデス・ベンツ", model: "Cクラス", str: 21.8, listings: 145, sold: 32, trend: 4.5 },
  { rank: 5, make: "日産", model: "セレナ", str: 21.5, listings: 198, sold: 43, trend: 2.8 },
]

export function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState<"market" | "company">("market")

  const handleDownload = (reportType: string) => {
    console.log("[v0] Downloading report:", reportType)
    // PDF generation logic would go here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">レポート</h1>
          <p className="text-muted-foreground mt-1">市場分析と自社パフォーマンスの統合レポート</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          期間選択: 2024年下半期
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "market" | "company")} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="market" className="gap-2 text-base py-3">
            <Globe className="h-5 w-5" />
            全体（市場動向）
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2 text-base py-3">
            <Building2 className="h-5 w-5" />
            個社（自社分析）
          </TabsTrigger>
        </TabsList>

        {/* Market Overview Tab */}
        <TabsContent value="market" className="space-y-6 data-[state=inactive]:hidden">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">市場総販売台数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8,530台</div>
                <div className="flex items-center gap-1 text-sm mt-2">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                  <span className="text-success">+12.4%</span>
                  <span className="text-muted-foreground">前年同期比</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">輸出比率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">36.4%</div>
                <div className="flex items-center gap-1 text-sm mt-2">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                  <span className="text-success">+4.2pt</span>
                  <span className="text-muted-foreground">前年同期比</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">平均市場価格</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">¥2.98M</div>
                <div className="flex items-center gap-1 text-sm mt-2">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                  <span className="text-success">+5.8%</span>
                  <span className="text-muted-foreground">前年同期比</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>市場売れ行き状況・輸出動向</CardTitle>
                <CardDescription>国内販売と輸出台数の推移</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={marketTrendData}>
                      <defs>
                        <linearGradient id="colorMarket" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorExport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.4}/>
                          <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="marketSales" name="国内市場販売" stroke={CHART_COLORS.primary} strokeWidth={2} fillOpacity={1} fill="url(#colorMarket)" />
                      <Area type="monotone" dataKey="exportVolume" name="輸出台数" stroke={CHART_COLORS.secondary} strokeWidth={2} fillOpacity={1} fill="url(#colorExport)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>売れ筋ランキング（STR順）</CardTitle>
                <CardDescription>高回転率車両トップ5</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="pb-2 text-left font-medium">順位</th>
                        <th className="pb-2 text-left font-medium">車種</th>
                        <th className="pb-2 text-right font-medium">STR</th>
                        <th className="pb-2 text-right font-medium">トレンド</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trendingRankingData.map((vehicle) => (
                        <tr key={vehicle.rank} className="border-b border-border/50 last:border-0">
                          <td className="py-3">
                            <Badge variant="outline" className="w-6 h-6 p-0 justify-center font-bold">
                              {vehicle.rank}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="font-medium">{vehicle.model}</div>
                            <div className="text-xs text-muted-foreground">{vehicle.make}</div>
                          </td>
                          <td className="py-3 text-right">
                            <span className="font-bold text-primary">{vehicle.str.toFixed(1)}%</span>
                          </td>
                          <td className="py-3 text-right">
                            <Badge variant={vehicle.trend > 0 ? "default" : "secondary"} className="text-xs px-1">
                              {vehicle.trend > 0 ? "+" : ""}{vehicle.trend}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  ※ STR: Sales Through Rate (販売率)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>輸出先国別シェア</CardTitle>
                <CardDescription>主要輸出国の構成比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={exportData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="share"
                        label={({ country, share }) => `${country} ${share}%`}
                      >
                        {exportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  輸出レポート
                </CardTitle>
                <CardDescription>詳細な国別・車種別輸出データ</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleDownload("export")} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  PDFダウンロード
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  新車情報レポート
                </CardTitle>
                <CardDescription>市場に投入された新規車両の分析</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleDownload("new-vehicles")} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  PDFダウンロード
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Company Analysis Tab */}
        <TabsContent value="company" className="space-y-6 data-[state=inactive]:hidden">
          {/* Executive Summary */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                エグゼクティブサマリー
              </CardTitle>
              <CardDescription>経営層向け重要インサイト</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  好調な販売実績
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  下半期の販売台数は前年比+15.2%と大幅に伸長。特に12月は過去最高の118台を記録し、STR（販売率）でも市場1位を獲得しました。高価格帯SUVの在庫回転率向上が主な要因です。
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    課題と対策
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    軽自動車セグメントでの競合シェア拡大が見られます。価格競争力の強化と、オンライン商談の成約率改善（現在99% vs 競合100%）が急務です。
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    輸出戦略
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ニュージーランド向けの輸出が好調（シェア32.5%）。円安傾向を活かし、オーストラリア市場への在庫配分を20%増加させることを推奨します。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>自社販売動向 vs 目標</CardTitle>
                <CardDescription>月次販売目標の達成状況</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={companyPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-muted-foreground" />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="sales" name="実績" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" name="目標" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>競合比較分析</CardTitle>
                <CardDescription>自社(A) vs 市場平均(B)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competitorComparisonData}>
                      <PolarGrid className="stroke-muted" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                      <Radar name="自社" dataKey="A" stroke={CHART_COLORS.primary} fill={CHART_COLORS.primary} fillOpacity={0.5} strokeWidth={2} />
                      <Radar name="市場平均" dataKey="B" stroke={CHART_COLORS.teal} fill={CHART_COLORS.teal} fillOpacity={0.5} strokeWidth={2} />
                      <Legend />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  週次レポート
                </CardTitle>
                <CardDescription>直近1週間の詳細販売データ</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleDownload("weekly")} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  PDFダウンロード
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  月次レポート
                </CardTitle>
                <CardDescription>月間パフォーマンスの完全な分析</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleDownload("monthly")} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  PDFダウンロード
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
