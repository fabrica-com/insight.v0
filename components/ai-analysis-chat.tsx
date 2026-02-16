"use client"

import { SharedChatLayout } from "@/components/shared-chat-layout"
import { TrendingUp, BarChart3, PieChart } from "lucide-react"

const suggestedQuestions = [
  { icon: TrendingUp, text: "今月の売れ筋車種TOP5を教えて", color: "from-chart-2 to-success" },
  { icon: BarChart3, text: "地域別の販売傾向を分析して", color: "from-primary to-chart-4" },
  { icon: PieChart, text: "価格帯別の在庫状況を教えて", color: "from-chart-3 to-warning" },
]

const STORAGE_KEY = "symphony-ai-chat-history"
const INITIAL_MESSAGE =
  "こんにちは。Symphony Insight データ分析です。市場データや販売分析について、お気軽にご質問ください。"

function generateAIResponse(question: string): string {
  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes("売れ筋") || lowerQuestion.includes("top")) {
    return `**今月の売れ筋車種TOP5**

1. **トヨタ プリウス** - 販売台数: 342台 (前月比 +12%)
   - 平均販売価格: ¥2,180,000
   - 平均在庫日数: 18日

2. **ホンダ フィット** - 販売台数: 298台 (前月比 +8%)
   - 平均販売価格: ¥1,650,000
   - 平均在庫日数: 22日

3. **日産 ノート** - 販売台数: 276台 (前月比 +15%)
   - 平均販売価格: ¥1,480,000
   - 平均在庫日数: 20日

4. **トヨタ アクア** - 販売台数: 245台 (前月比 +5%)
   - 平均販売価格: ¥1,820,000
   - 平均在庫日数: 25日

5. **スズキ ハスラー** - 販売台数: 223台 (前月比 +18%)
   - 平均販売価格: ¥1,350,000
   - 平均在庫日数: 19日

**トレンド分析:**
ハイブリッド車と軽SUVの需要が引き続き高まっています。`
  }

  if (lowerQuestion.includes("地域") || lowerQuestion.includes("エリア")) {
    return `**地域別販売傾向分析**

**関東エリア (全体の38%)**
- 最も人気: コンパクトカー、ミニバン
- 平均販売価格: ¥2,150,000
- 特徴: プレミアムブランドの需要が高い

**関西エリア (全体の24%)**
- 最も人気: 軽自動車、ハイブリッド車
- 平均販売価格: ¥1,680,000
- 特徴: コストパフォーマンス重視

**中部エリア (全体の18%)**
- 最も人気: SUV、ステーションワゴン
- 平均販売価格: ¥1,920,000
- 特徴: 実用性とデザイン性のバランス`
  }

  if (lowerQuestion.includes("価格") || lowerQuestion.includes("在庫")) {
    return `**価格帯別在庫状況**

**¥1,000,000未満** - 在庫: 245台 / 回転率: やや低い
**¥1,000,000 - ¥1,500,000** - 在庫: 412台 / 回転率: 良好
**¥1,500,000 - ¥2,000,000** - 在庫: 378台 / 回転率: 非常に良好
**¥2,000,000 - ¥3,000,000** - 在庫: 289台 / 回転率: 良好
**¥3,000,000以上** - 在庫: 156台 / 回転率: 低い

**推奨:** 150万〜200万円の価格帯が最も回転率が高く、収益性も良好です。`
  }

  return `ご質問ありがとうございます。「${question}」について分析いたします。

具体的な車種名、地域名、価格帯などを指定していただくと、より詳細な分析結果をご提供できます。`
}

export function AIAnalysisChat() {
  return (
    <SharedChatLayout
      storageKey={STORAGE_KEY}
      initialMessage={INITIAL_MESSAGE}
      historyLabel="履歴"
      suggestedItems={suggestedQuestions}
      suggestedLabel="おすすめの質問"
      generateResponse={generateAIResponse}
      theme="data-analysis"
      inputPlaceholder="質問を入力..."
      typingDelay={1500}
    />
  )
}
