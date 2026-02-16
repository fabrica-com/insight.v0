"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Send,
  Bot,
  User,
  TrendingUp,
  BarChart3,
  PieChart,
  History,
  Plus,
  Trash2,
  MessageSquare,
  ArrowRight,
} from "lucide-react"
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
  { icon: TrendingUp, text: "今月の売れ筋車種TOP5を教えて", color: "from-chart-2 to-success" },
  { icon: BarChart3, text: "地域別の販売傾向を分析して", color: "from-primary to-chart-4" },
  { icon: PieChart, text: "価格帯別の在庫状況を教えて", color: "from-chart-3 to-warning" },
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
  return firstMessage.length > maxLength ? firstMessage.substring(0, maxLength) + "..." : firstMessage
}

export function AIAnalysisChat() {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(true)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "こんにちは。Symphony Insight AIアシスタントです。市場データや販売分析について、お気軽にご質問ください。",
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
    if (updatedMessages.length <= 1) return

    const now = new Date()
    let updatedHistories: ChatHistory[]

    if (currentChatId) {
      updatedHistories = chatHistories.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: updatedMessages, updatedAt: now } : chat,
      )
    } else {
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
        content:
          "こんにちは。Symphony Insight AIアシスタントです。市場データや販売分析について、お気軽にご質問ください。",
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

  return (
    <div className="flex h-full gap-4">
      <div
        className={cn("flex flex-col gap-3 transition-all duration-300", showHistory ? "w-72" : "w-0 overflow-hidden")}
      >
        {showHistory && (
          <Card className="flex h-full flex-col border-border/50">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                履歴
              </h2>
              <Button variant="ghost" size="sm" onClick={handleNewChat} className="h-7 gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                新規
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {chatHistories.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">履歴がありません</p>
              ) : (
                chatHistories.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleLoadChat(chat.id)}
                    className={cn(
                      "w-full text-left p-2.5 rounded-lg transition-colors group",
                      currentChatId === chat.id ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <MessageSquare className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                          <p className="text-xs font-medium truncate">{chat.title}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {chat.updatedAt.toLocaleDateString("ja-JP", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="gap-1.5 h-8 text-xs"
          >
            <History className="h-3.5 w-3.5" />
            {showHistory ? "履歴を非表示" : "履歴を表示"}
          </Button>
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden border-border/50">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-chart-4 to-primary text-white flex-shrink-0 shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-4 py-3 whitespace-pre-wrap text-sm leading-relaxed",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/70",
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-chart-4 to-primary text-white flex-shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-xl bg-muted/70 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="border-t border-border/50 bg-muted/30 p-4">
              <p className="text-xs font-medium mb-3 text-muted-foreground">おすすめの質問</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(question.text)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors text-left group"
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white flex-shrink-0",
                        question.color,
                      )}
                    >
                      <question.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium flex-1">{question.text}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border/50 p-3">
            <div className="flex gap-2">
              <Input
                placeholder="質問を入力..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="flex-1 h-10 bg-muted/50 border-transparent focus:bg-background focus:border-border"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                size="icon"
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
