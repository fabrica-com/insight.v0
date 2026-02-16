"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Sparkles, TrendingUp, BarChart3, PieChart, History, Plus, Trash2, MessageSquare } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const suggestedQuestions = [
  { icon: TrendingUp, text: "今月の売れ筋車種TOP5を教えて" },
  { icon: BarChart3, text: "地域別の販売傾向を分析して" },
  { icon: PieChart, text: "価格帯別の在庫状況を教えて" },
]

const STORAGE_KEY = "symphony-ai-chat-history"

const loadChatHistory = (): ChatHistory[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return parsed.map((chat: any) => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }))
  } catch (error) {
    console.error("Failed to load chat history:", error)
    return []
  }
}

const saveChatHistory = (history: ChatHistory[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error("Failed to save chat history:", error)
  }
}

const generateChatTitle = (firstMessage: string): string => {
  const maxLength = 30
  return firstMessage.length > maxLength
    ? firstMessage.substring(0, maxLength) + "..."
    : firstMessage
}

export function AIAnalysisChat() {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(true)
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "こんにちは。Symphony Insight AIアシスタントです。市場データや販売分析について、お気軽にご質問ください。",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const histories = loadChatHistory()
    setChatHistories(histories)
    if (histories.length > 0) {
      const lastChat = histories[0]
      setCurrentChatId(lastChat.id)
      setMessages(lastChat.messages)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const saveCurrentChat = (updatedMessages: Message[]) => {
    if (updatedMessages.length <= 1) return // Don't save if only initial message

    const now = new Date()
    let updatedHistories: ChatHistory[]

    if (currentChatId) {
      // Update existing chat
      updatedHistories = chatHistories.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, messages: updatedMessages, updatedAt: now }
          : chat
      )
    } else {
      // Create new chat
      const firstUserMessage = updatedMessages.find((m) => m.role === "user")
      const newChat: ChatHistory = {
        id: Date.now().toString(),
        title: firstUserMessage ? generateChatTitle(firstUserMessage.content) : "新しいチャット",
        messages: updatedMessages,
        createdAt: now,
        updatedAt: now,
      }
      setCurrentChatId(newChat.id)
      updatedHistories = [newChat, ...chatHistories]
    }

    setChatHistories(updatedHistories)
    saveChatHistory(updatedHistories)
  }

  const handleSend = async (message?: string) => {
    const messageText = message || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(messageText),
        timestamp: new Date(),
      }
      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)
      setIsTyping(false)
      saveCurrentChat(finalMessages)
    }, 1500)
  }

  const handleNewChat = () => {
    setCurrentChatId(null)
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "こんにちは。Symphony Insight AIアシスタントです。市場データや販売分析について、お気軽にご質問ください。",
        timestamp: new Date(),
      },
    ])
    setShowHistory(false)
  }

  const handleLoadChat = (chatId: string) => {
    const chat = chatHistories.find((c) => c.id === chatId)
    if (chat) {
      setCurrentChatId(chat.id)
      setMessages(chat.messages)
      setShowHistory(false)
    }
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedHistories = chatHistories.filter((chat) => chat.id !== chatId)
    setChatHistories(updatedHistories)
    saveChatHistory(updatedHistories)

    if (currentChatId === chatId) {
      handleNewChat()
    }
  }

  const generateAIResponse = (question: string): string => {
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
ハイブリッド車と軽SUVの需要が引き続き高まっています。特にプリウスとハスラーの成長率が顕著です。`
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
- 特徴: 実用性とデザイン性のバランス

**その他エリア (全体の20%)**
- 最も人気: 軽自動車、軽トラック
- 平均販売価格: ¥1,250,000
- 特徴: 維持費の安さを重視

**インサイト:** 都市部ではコンパクトカーとプレミアム車、地方では軽自動車の需要が明確に分かれています。`
    }

    if (lowerQuestion.includes("価格") || lowerQuestion.includes("在庫")) {
      return `**価格帯別在庫状況**

**¥1,000,000未満**
- 在庫台数: 245台
- 平均在庫日数: 32日
- 回転率: やや低い

**¥1,000,000 - ¥1,500,000**
- 在庫台数: 412台
- 平均在庫日数: 24日
- 回転率: 良好

**¥1,500,000 - ¥2,000,000**
- 在庫台数: 378台
- 平均在庫日数: 19日
- 回転率: 非常に良好 ⭐

**¥2,000,000 - ¥3,000,000**
- 在庫台数: 289台
- 平均在庫日数: 28日
- 回転率: 良好

**¥3,000,000以上**
- 在庫台数: 156台
- 平均在庫日数: 45日
- 回転率: 低い

**推奨アクション:**
150万〜200万円の価格帯が最も回転率が高く、収益性も良好です。この価格帯の在庫を増やすことをお勧めします。`
    }

    return `ご質問ありがとうございます。「${question}」について分析いたします。

現在のデータベースから関連する情報を検索しています。具体的な車種名、地域名、価格帯などを指定していただくと、より詳細な分析結果をご提供できます。

以下のような質問も可能です:
- 特定の車種の販売動向
- 競合他社との比較分析
- 価格設定の最適化提案
- 地域別の需要予測`
  }

  const handleSuggestedQuestion = (question: string) => {
    handleSend(question)
  }

  return (
    <div className="flex h-full gap-4">
      <div
        className={cn(
          "flex flex-col gap-4 transition-all duration-300",
          showHistory ? "w-80" : "w-0 overflow-hidden"
        )}
      >
        {showHistory && (
          <Card className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <History className="h-4 w-4" />
                チャット履歴
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewChat}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                新規
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {chatHistories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  履歴がありません
                </p>
              ) : (
                chatHistories.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleLoadChat(chat.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-colors group hover:bg-accent",
                      currentChatId === chat.id
                        ? "bg-accent border-primary"
                        : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-3 w-3 flex-shrink-0" />
                          <p className="text-sm font-medium truncate">
                            {chat.title}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {chat.updatedAt.toLocaleDateString("ja-JP", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">AI分析アシスタント</h1>
              <p className="text-muted-foreground mt-1">自然言語でデータ分析と市場インサイトを取得</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            {showHistory ? "履歴を非表示" : "履歴を表示"}
          </Button>
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4 whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="max-w-[80%] rounded-lg bg-muted p-4">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="border-t border-border bg-muted/30 p-4">
              <p className="text-sm font-medium mb-3 text-muted-foreground">おすすめの質問:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleSuggestedQuestion(question.text)}
                  >
                    <question.icon className="h-4 w-4" />
                    {question.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="質問を入力してください..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="flex-1"
              />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
