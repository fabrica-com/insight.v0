"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Send,
  User,
  History,
  Plus,
  Trash2,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Bot,
  Flame,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface SuggestedItem {
  icon: LucideIcon
  text: string
  color?: string
}

export interface SharedChatLayoutProps {
  storageKey: string
  initialMessage: string
  historyLabel?: string
  suggestedItems: SuggestedItem[]
  suggestedLabel?: string
  generateResponse: (question: string, messageCount?: number) => string
  theme: "data-analysis" | "consultant" | "ceo" | "cfo" | "cmo" | "grant" | "chro"
  inputPlaceholder?: string
  typingDelay?: number
}

const loadChatHistory = (storageKey: string): ChatHistory[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(storageKey)
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

const saveChatHistory = (storageKey: string, history: ChatHistory[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(storageKey, JSON.stringify(history))
  } catch (error) {
    console.error("Failed to save chat history:", error)
  }
}

const generateChatTitle = (firstMessage: string): string => {
  const maxLength = 30
  return firstMessage.length > maxLength ? firstMessage.substring(0, maxLength) + "..." : firstMessage
}

export function SharedChatLayout({
  storageKey,
  initialMessage,
  historyLabel = "履歴",
  suggestedItems,
  suggestedLabel = "おすすめの質問",
  generateResponse,
  theme,
  inputPlaceholder = "質問を入力...",
  typingDelay = 1500,
}: SharedChatLayoutProps) {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(true)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: initialMessage,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [thinkingPhase, setThinkingPhase] = useState(0)
  const [displayedContent, setDisplayedContent] = useState("")
  const [isRevealing, setIsRevealing] = useState(false)
  const [fullResponseContent, setFullResponseContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const thinkingMessages = [
    "質問を分析中...",
    "情報を整理中...",
    "回答を生成中...",
    "最適な提案を検討中...",
  ]

  // Rotate thinking messages while waiting
  useEffect(() => {
    if (!isTyping) {
      setThinkingPhase(0)
      return
    }
    const interval = setInterval(() => {
      setThinkingPhase((prev) => (prev + 1) % thinkingMessages.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [isTyping, thinkingMessages.length])

  // Character-by-character reveal effect
  useEffect(() => {
    if (!isRevealing || !fullResponseContent) return

    let currentIndex = 0
    const content = fullResponseContent
    const chunkSize = 1 // one character per tick for slower, readable reveal

    const reveal = () => {
      currentIndex += chunkSize
      if (currentIndex >= content.length) {
        setDisplayedContent(content)
        setIsRevealing(false)
        setFullResponseContent("")
        return
      }
      setDisplayedContent(content.slice(0, currentIndex))
      revealTimerRef.current = setTimeout(reveal, 35)
    }

    revealTimerRef.current = setTimeout(reveal, 35)
    return () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current)
    }
  }, [isRevealing, fullResponseContent])

  useEffect(() => {
    const histories = loadChatHistory(storageKey)
    setChatHistories(histories)
    if (histories.length > 0) {
      const lastChat = histories[0]
      setCurrentChatId(lastChat.id)
      setMessages(lastChat.messages)
    }
  }, [storageKey])

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
    saveChatHistory(storageKey, updatedHistories)
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

    const userMessageCount = updatedMessages.filter((m) => m.role === "user").length

    setTimeout(() => {
      const responseContent = generateResponse(messageText, userMessageCount)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date(),
      }
      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)
      setIsTyping(false)
      // Start the character reveal
      setFullResponseContent(responseContent)
      setDisplayedContent("")
      setIsRevealing(true)
      saveCurrentChat(finalMessages)
    }, typingDelay)
  }

  const handleNewChat = () => {
    setCurrentChatId(null)
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: initialMessage,
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
    saveChatHistory(storageKey, updatedHistories)

    if (currentChatId === chatId) {
      handleNewChat()
    }
  }

  const isConsultant = theme === "consultant"

  const themeConfig: Record<string, { avatarIcon: typeof Bot; avatarClass: string; borderClass: string; buttonClass: string; suggestBorderClass: string }> = {
    "data-analysis": {
      avatarIcon: Bot,
      avatarClass: "rounded-lg bg-gradient-to-br from-chart-4 to-primary text-white",
      borderClass: "border-border/50",
      buttonClass: "",
      suggestBorderClass: "",
    },
    consultant: {
      avatarIcon: Flame,
      avatarClass: "rounded-full bg-gradient-to-br from-red-500 to-orange-600",
      borderClass: "border-red-500/20",
      buttonClass: "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white",
      suggestBorderClass: "border-red-500/30 hover:bg-red-500/10 hover:text-red-600",
    },
    ceo: {
      avatarIcon: Bot,
      avatarClass: "rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white",
      borderClass: "border-amber-500/20",
      buttonClass: "bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white",
      suggestBorderClass: "border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-700",
    },
    cfo: {
      avatarIcon: Bot,
      avatarClass: "rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 text-white",
      borderClass: "border-emerald-500/20",
      buttonClass: "bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white",
      suggestBorderClass: "border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-700",
    },
    cmo: {
      avatarIcon: Bot,
      avatarClass: "rounded-lg bg-gradient-to-br from-sky-500 to-sky-700 text-white",
      borderClass: "border-sky-500/20",
      buttonClass: "bg-gradient-to-r from-sky-500 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white",
      suggestBorderClass: "border-sky-500/30 hover:bg-sky-500/10 hover:text-sky-700",
    },
    grant: {
      avatarIcon: Bot,
      avatarClass: "rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 text-white",
      borderClass: "border-violet-500/20",
      buttonClass: "bg-gradient-to-r from-violet-500 to-violet-700 hover:from-violet-600 hover:to-violet-800 text-white",
      suggestBorderClass: "border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-700",
    },
    chro: {
      avatarIcon: Bot,
      avatarClass: "rounded-lg bg-gradient-to-br from-rose-500 to-rose-700 text-white",
      borderClass: "border-rose-500/20",
      buttonClass: "bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white",
      suggestBorderClass: "border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-700",
    },
  }

  const tc = themeConfig[theme] || themeConfig["data-analysis"]
  const AvatarIcon = tc.avatarIcon

  return (
    <div className="flex h-full min-h-0 gap-3">
      {!showHistory && (
        <div className="flex shrink-0 items-start pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(true)}
            className="gap-1.5 h-8 text-xs"
          >
            <History className="h-3.5 w-3.5" />
            履歴を表示
          </Button>
        </div>
      )}

      <div
        className={cn("flex min-h-0 flex-col transition-all duration-300", showHistory ? "hidden md:flex w-64 lg:w-72" : "w-0 overflow-hidden")}
      >
        {showHistory && (
          <Card className="flex h-full min-h-0 flex-col border-border/50">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                {historyLabel}
              </h2>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={handleNewChat} className="h-7 gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  新規
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(false)}
                  className="h-7 text-xs text-muted-foreground"
                  title="履歴を非表示"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-2 space-y-1">
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

      <div className="flex min-h-0 flex-1 flex-col">
        <Card
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            tc.borderClass,
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center flex-shrink-0 shadow-sm",
                      tc.avatarClass,
                    )}
                  >
                    <AvatarIcon className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[600px] rounded-xl px-4 py-3 whitespace-pre-wrap text-sm leading-relaxed",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/70",
                  )}
                >
                  {/* Show typing reveal for the last assistant message */}
                  {message.role === "assistant" &&
                   isRevealing &&
                   message.id === messages[messages.length - 1]?.id
                    ? <>
                        {displayedContent}
                        <span className="inline-block w-0.5 h-4 bg-foreground/70 animate-pulse ml-0.5 align-text-bottom" />
                      </>
                    : message.content}
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 items-center justify-center flex-shrink-0 rounded-lg bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center flex-shrink-0",
                    tc.avatarClass,
                  )}
                >
                  <AvatarIcon className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div className="rounded-xl bg-muted/70 px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1">
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground animate-pulse transition-all duration-300">
                      {thinkingMessages[thinkingPhase]}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="shrink-0 border-t border-border/50 bg-muted/30 p-4">
              <p className="text-xs font-medium mb-3 text-muted-foreground">{suggestedLabel}</p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {suggestedItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(item.text)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors text-left group",
                      tc.suggestBorderClass,
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0",
                        item.color ? `bg-gradient-to-br ${item.color} text-white` : "bg-muted",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium flex-1">{item.text}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="shrink-0 border-t border-border/50 p-3">
            <div className="flex gap-2">
              <Input
                placeholder={inputPlaceholder}
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
                disabled={!input.trim() || isTyping || isRevealing}
                size="icon"
                className={cn(
                  "h-10 w-10",
                  tc.buttonClass,
                )}
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
