"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Newspaper,
  ExternalLink,
  Sparkles,
  Send,
  Bot,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  TrendingUp,
  Car,
  Factory,
  Zap,
  Globe,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

// -- Types --
interface NewsItem {
  id: string
  title: string
  source: string
  url: string
  category: string
  publishedAt: string
  summary: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// -- Category config --
const categoryConfig: Record<string, { label: string; icon: typeof Car; className: string }> = {
  market: { label: "市場動向", icon: TrendingUp, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  maker: { label: "メーカー", icon: Factory, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  ev: { label: "EV・電動化", icon: Zap, className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  used: { label: "中古車", icon: Car, className: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  regulation: { label: "規制・法改正", icon: ShieldCheck, className: "bg-red-500/10 text-red-600 border-red-500/20" },
  global: { label: "海外", icon: Globe, className: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
}

// -- Today's date helper --
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
}

// -- Sample news data --
const generateNewsData = (): NewsItem[] => {
  const today = todayStr()
  return [
    { id: "1", title: "トヨタ、2026年度の国内生産計画を上方修正 SUV需要が牽引", source: "日本経済新聞", url: "#", category: "maker", publishedAt: today, summary: "トヨタ自動車は2026年度の国内生産計画を当初比5%上方修正。SUVモデルの好調な受注が背景。" },
    { id: "2", title: "中古車オークション相場、3月は高級セダンが下落傾向に", source: "Response", url: "#", category: "used", publishedAt: today, summary: "USS調べでは3月の中古車オークション相場で高級セダンが前月比2.3%下落。SUV・ミニバンは横ばい。" },
    { id: "3", title: "日産・ホンダ統合会社、EV専用プラットフォーム共同開発を正式発表", source: "日刊自動車新聞", url: "#", category: "ev", publishedAt: today, summary: "日産とホンダの統合新会社がEV専用プラットフォームの共同開発を正式に発表。2028年の市場投入を目指す。" },
    { id: "4", title: "自動車保険料、2026年4月から平均3.5%引き上げへ", source: "朝日新聞", url: "#", category: "regulation", publishedAt: today, summary: "損害保険各社は自動車保険料を4月から平均3.5%引き上げ。修理費の高騰と事故率の上昇が要因。" },
    { id: "5", title: "テスラ、日本市場向け新型コンパクトSUVを年内投入か", source: "Bloomberg", url: "#", category: "global", publishedAt: today, summary: "テスラが日本市場向けにコンパクトSUVの新型モデルを年内に投入する計画が明らかに。価格は400万円台を想定。" },
    { id: "6", title: "中古車販売大手ビッグモーター後継会社、再建計画の進捗を公開", source: "東洋経済", url: "#", category: "used", publishedAt: today, summary: "ビッグモーター後継のWECARSが再建計画の進捗状況を発表。店舗数の最適化と信頼回復策を進める。" },
    { id: "7", title: "スバル、新型レヴォーグにアイサイトX最新版を搭載", source: "Car Watch", url: "#", category: "maker", publishedAt: today, summary: "スバルは新型レヴォーグのマイナーチェンジモデルにアイサイトXの最新版を搭載すると発表。" },
    { id: "8", title: "国交省、2026年度の自動車関連税制の改正案を公表", source: "日本経済新聞", url: "#", category: "regulation", publishedAt: today, summary: "国土交通省は2026年度自動車関連税制の改正案を公表。環境性能割の基準見直しが盛り込まれた。" },
    { id: "9", title: "BYD、日本での販売店を年内50拠点に拡大へ", source: "NHK", url: "#", category: "global", publishedAt: today, summary: "中国の電気自動車メーカーBYDが日本国内の販売拠点を年内に50店舗まで拡大する方針を明らかに。" },
    { id: "10", title: "全国中古車販売台数、2月は前年同月比4.2%増", source: "自販連", url: "#", category: "market", publishedAt: today, summary: "日本自動車販売協会連合会の調べで2月の中古車販売台数は前年同月比4.2%増の約35万台となった。" },
    { id: "11", title: "マツダ、ロータリーエンジン搭載の新型PHEVを2027年投入へ", source: "Response", url: "#", category: "maker", publishedAt: today, summary: "マツダはロータリーエンジンを発電用に搭載したPHEVの新型モデルを2027年に投入する計画。" },
    { id: "12", title: "自動運転レベル4、高速道路での運用が今夏開始", source: "日経クロステック", url: "#", category: "ev", publishedAt: today, summary: "国交省は高速道路における自動運転レベル4の運用を今夏から一部区間で開始すると発表。物流分野から先行導入。" },
    { id: "13", title: "中古車輸出、東南アジア向けが過去最高を記録", source: "貿易統計", url: "#", category: "market", publishedAt: today, summary: "2月の中古車輸出台数は東南アジア向けが前年比15%増となり過去最高を記録。円安の影響が大きい。" },
    { id: "14", title: "ダイハツ、品質不正問題からの出荷再開後の販売動向", source: "朝日新聞", url: "#", category: "maker", publishedAt: today, summary: "ダイハツの出荷再開後の販売台数が回復基調に。軽自動車市場でのシェアは依然として不正前の水準には届かず。" },
    { id: "15", title: "急速充電インフラ、2026年度は全国2万基突破の見通し", source: "日本経済新聞", url: "#", category: "ev", publishedAt: today, summary: "経済産業省は急速充電器の設置数が2026年度中に2万基を突破する見通しを公表。補助金拡充が後押し。" },
    { id: "16", title: "ガリバー、AI査定システムを全店導入へ", source: "日刊自動車新聞", url: "#", category: "used", publishedAt: today, summary: "中古車大手のガリバーがAIを活用した査定システムを全店舗に導入すると発表。査定時間を大幅短縮。" },
    { id: "17", title: "米国の関税政策変更、日系自動車メーカーへの影響分析", source: "Bloomberg", url: "#", category: "global", publishedAt: today, summary: "米国の対日関税引き上げが日系メーカーの収益に影響。各社は現地生産拡大で対応を急ぐ。" },
    { id: "18", title: "軽自動車の新安全基準、2027年から段階的に適用", source: "NHK", url: "#", category: "regulation", publishedAt: today, summary: "国交省は軽自動車の衝突安全基準を2027年から段階的に強化。側面衝突の基準値を欧州水準に引き上げ。" },
  ]
}

// -- AI Daily Summary --
const dailySummary = `【本日の自動車業界まとめ】

■ 市場動向
中古車販売台数は前年比4.2%増と好調を維持。輸出市場では東南アジア向けが過去最高を記録しており、円安を追い風に海外需要が拡大しています。一方、オークション相場では高級セダンが下落傾向にあり、SUV・ミニバンとの二極化が進んでいます。

■ メーカー動向
トヨタは国内生産計画を上方修正。日産・ホンダの統合新会社はEV専用プラットフォーム共同開発を正式発表しました。マツダはロータリーエンジン搭載PHEVを2027年投入予定。ダイハツは品質不正問題からの回復途上にあります。

■ EV・次世代技術
自動運転レベル4が今夏から高速道路で運用開始。急速充電インフラは2026年度中に2万基突破の見通し。BYDは日本販売拠点を50店舗に拡大予定で、国内EV市場の競争が激化しています。

■ 中古車業界への示唆
ガリバーがAI査定システムを全店導入するなど、業界のDX化が加速。保険料の引き上げや関税政策の変更など、コスト面での注視が必要です。`

// -- AI response generator --
function generateAIResponse(question: string, news: NewsItem[]): string {
  const q = question.toLowerCase()
  if (q.includes("中古車") || q.includes("相場") || q.includes("オークション")) {
    return "中古車市場について本日のニュースからお伝えします。\n\n中古車オークション相場では高級セダンが前月比2.3%下落する一方、SUV・ミニバンは横ばいを維持しています。全国の中古車販売台数は2月に前年同月比4.2%増の約35万台と好調です。\n\nまた、中古車輸出は東南アジア向けが過去最高を記録しており、円安の恩恵を受けています。ガリバーのAI査定システム全店導入など、業界のデジタル化も進んでいます。\n\n仕入れ戦略としては、高級セダンの仕入れ価格に下落余地がある今が好機かもしれません。一方でSUV・ミニバンは引き続き需要が高い状態が続いています。"
  }
  if (q.includes("ev") || q.includes("電気") || q.includes("電動") || q.includes("充電")) {
    return "EV・電動化に関する本日のニュースをまとめます。\n\n1. **日産・ホンダ統合会社**がEV専用プラットフォームの共同開発を正式発表しました。2028年の市場投入を目指しています。\n2. **BYD**は日本国内の販売拠点を年内に50店舗まで拡大する方針です。\n3. **急速充電インフラ**は2026年度中に全国2万基突破の見通しで、補助金拡充が後押ししています。\n4. **自動運転レベル4**が今夏から高速道路で運用開始されます。\n\n中古車販売店としては、EV中古車の取り扱い体制整備（充電設備、バッテリー評価基準）を早期に進めることをお勧めします。"
  }
  if (q.includes("トヨタ") || q.includes("toyota")) {
    return "トヨタに関する本日のニュースです。\n\nトヨタ自動車は2026年度の国内生産計画を当初比5%上方修正しました。SUVモデルの好調な受注が背景にあります。\n\nこれは中古車市場にとって、将来的にSUVの供給増加につながる可能性がありますが、当面は新車の納期短縮により中古車への代替需要は落ち着く可能性があります。トヨタSUV系の在庫戦略を見直す良いタイミングかもしれません。"
  }
  if (q.includes("規制") || q.includes("税") || q.includes("保険") || q.includes("法")) {
    return "規制・法改正に関する本日のニュースをまとめます。\n\n1. **自動車保険料**が2026年4月から平均3.5%引き上げ。修理費高騰と事故率上昇が要因です。\n2. **自動車関連税制**の改正案が公表され、環境性能割の基準見直しが盛り込まれました。\n3. **軽自動車の安全基準**が2027年から段階的に強化されます。\n\nお客様への影響としては、保険料値上げにより総支払額が増加するため、購入時の説明やフォローが重要になります。環境性能割の見直しはエコカー減税対象車の需要に影響を与える可能性があります。"
  }
  return `ご質問ありがとうございます。本日の自動車業界ニュース${news.length}件をもとにお答えします。\n\n本日の主要トピックとしては、トヨタの生産計画上方修正、日産・ホンダのEVプラットフォーム共同開発、中古車市場の好調な販売台数（前年比4.2%増）、そして保険料引き上げなどがあります。\n\nより具体的な内容をお知りになりたい場合は、「中古車相場について教えて」「EV関連のニュースは？」「規制変更の影響は？」など、トピックを絞ってご質問ください。`
}

// ========================
// Main Component
// ========================
export function IndustryNews() {
  const [newsData] = useState<NewsItem[]>(generateNewsData)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showChat, setShowChat] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const filteredNews = selectedCategory === "all"
    ? newsData
    : newsData.filter((n) => n.category === selectedCategory)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isTyping])

  const handleSendMessage = () => {
    if (!chatInput.trim() || isTyping) return
    const userMsg: ChatMessage = { role: "user", content: chatInput.trim(), timestamp: new Date() }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = generateAIResponse(userMsg.content, newsData)
      setChatMessages((prev) => [...prev, { role: "assistant", content: response, timestamp: new Date() }])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggest = (q: string) => {
    setChatInput(q)
    setShowChat(true)
  }

  return (
    <div className="space-y-6">
      {/* AI Daily Summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-chart-4/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{"AI\u30CB\u30E5\u30FC\u30B9\u30B5\u30DE\u30EA\u30FC"}</CardTitle>
                <CardDescription className="text-xs">{todayStr()}{"  \u2022  "}{newsData.length}{"件のニュースを分析"}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setShowChat(true)
                }}
              >
                <Bot className="h-3.5 w-3.5" />
                {"AIに質問"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSummaryExpanded(!summaryExpanded)}
              >
                {summaryExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        {summaryExpanded && (
          <CardContent className="pt-0">
            <div className="rounded-lg bg-background/80 border p-4 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
              {dailySummary}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                "中古車相場の動向を詳しく教えて",
                "EV関連の最新動向は？",
                "規制変更が中古車販売に与える影響は？",
              ].map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-xs border-primary/30 hover:bg-primary/10 hover:text-primary"
                  onClick={() => handleSuggest(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* AI Chat (toggled) */}
      {showChat && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm">{"ニュースAIアシスタント"}</CardTitle>
                  <CardDescription className="text-xs">{"本日のニュースに基づいて回答します"}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)} className="text-xs text-muted-foreground">
                {"閉じる"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {/* Messages */}
            {chatMessages.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto space-y-3 rounded-lg border p-3 bg-muted/30">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}>
                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      msg.role === "assistant" ? "bg-primary/10" : "bg-muted",
                    )}>
                      {msg.role === "assistant" ? <Bot className="h-3.5 w-3.5 text-primary" /> : <User className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                    <div className={cn(
                      "rounded-xl px-3 py-2 text-sm leading-relaxed max-w-[85%] whitespace-pre-line",
                      msg.role === "assistant" ? "bg-background border" : "bg-primary text-primary-foreground",
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="rounded-xl px-3 py-2 text-sm bg-background border">
                      <span className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce [animation-delay:0.1s]">.</span>
                        <span className="animate-bounce [animation-delay:0.2s]">.</span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder={"ニュースについて質問..."}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isTyping}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          <Newspaper className="h-3.5 w-3.5 mr-1.5" />
          {"すべて"}
          <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">{newsData.length}</Badge>
        </Button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = newsData.filter((n) => n.category === key).length
          const Icon = config.icon
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
            >
              <Icon className="h-3.5 w-3.5 mr-1.5" />
              {config.label}
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">{count}</Badge>
            </Button>
          )
        })}
      </div>

      {/* News List */}
      <div className="space-y-3">
        {filteredNews.map((news) => {
          const cat = categoryConfig[news.category]
          const CatIcon = cat?.icon || Newspaper
          return (
            <a
              key={news.id}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="transition-all hover:shadow-md hover:border-primary/30 cursor-pointer">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border", cat?.className)}>
                    <CatIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{news.summary}</p>
                    <div className="flex items-center gap-3 pt-0.5">
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", cat?.className)}>
                        {cat?.label}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-medium">{news.source}</span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {news.publishedAt}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          )
        })}
      </div>

      {filteredNews.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Newspaper className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">{"該当するニュースがありません"}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
