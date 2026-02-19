"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SharedChatLayout } from "@/components/shared-chat-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Sparkles, Pencil, Trash2, MessageSquare, ArrowLeft, ArrowRight, X } from "lucide-react"

export interface CustomChatConfig {
  id: string
  name: string
  systemPrompt: string
  suggestedQuestions: string[]
  createdAt: string
  updatedAt: string
}

const CONFIGS_STORAGE_KEY = "symphony-custom-chat-configs"

const loadConfigs = (): CustomChatConfig[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(CONFIGS_STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored)
  } catch {
    return []
  }
}

const saveConfigs = (configs: CustomChatConfig[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(CONFIGS_STORAGE_KEY, JSON.stringify(configs))
}

// --- チャットリスト & 作成/編集画面 ---

function ChatConfigForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: CustomChatConfig
  onSave: (config: Omit<CustomChatConfig, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? "")
  const [systemPrompt, setSystemPrompt] = useState(initial?.systemPrompt ?? "")
  const [questions, setQuestions] = useState<string[]>(initial?.suggestedQuestions ?? [""])

  const handleAddQuestion = () => {
    if (questions.length < 6) setQuestions([...questions, ""])
  }

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx))
  }

  const handleQuestionChange = (idx: number, value: string) => {
    const updated = [...questions]
    updated[idx] = value
    setQuestions(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !systemPrompt.trim()) return
    onSave({
      name: name.trim(),
      systemPrompt: systemPrompt.trim(),
      suggestedQuestions: questions.filter((q) => q.trim() !== ""),
    })
  }

  const isValid = name.trim() && systemPrompt.trim()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="chat-name">チャット名 *</Label>
        <Input
          id="chat-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 在庫仕入れアドバイザー"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="system-prompt">システムプロンプト（AIの役割・指示） *</Label>
        <Textarea
          id="system-prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder={"例: あなたは中古車販売店向けの在庫仕入れアドバイザーです。\nオークション相場やトレンドに基づいて、最適な仕入れ戦略を提案してください。"}
          rows={6}
          required
          className="resize-y"
        />
        <p className="text-xs text-muted-foreground">
          AIがどのような役割で、どのように応答すべきかを具体的に記述してください
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>おすすめの質問（任意）</Label>
          {questions.length < 6 && (
            <Button type="button" variant="ghost" size="sm" onClick={handleAddQuestion} className="gap-1 text-xs h-7">
              <Plus className="h-3 w-3" />
              追加
            </Button>
          )}
        </div>
        {questions.map((q, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Input
              value={q}
              onChange={(e) => handleQuestionChange(idx, e.target.value)}
              placeholder={`質問 ${idx + 1}`}
              className="flex-1"
            />
            {questions.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveQuestion(idx)}
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit" disabled={!isValid} className="gap-2">
          <Sparkles className="h-4 w-4" />
          {initial ? "更新" : "作成"}
        </Button>
      </div>
    </form>
  )
}

// --- カスタムチャット会話画面 ---

function CustomChatConversation({
  config,
  onBack,
}: {
  config: CustomChatConfig
  onBack: () => void
}) {
  const storageKey = `symphony-custom-chat-${config.id}`

  const suggestedItems = config.suggestedQuestions.map((q) => ({
    icon: MessageSquare,
    text: q,
    color: "from-violet-500 to-purple-600",
  }))

  const generateResponse = (question: string): string => {
    // シミュレーション: システムプロンプトに基づいた応答を生成
    const prompt = config.systemPrompt.toLowerCase()
    const q = question.toLowerCase()

    // プロンプト内容に基づいたコンテキスト応答
    if (q.includes("教えて") || q.includes("分析") || q.includes("アドバイス")) {
      return `ご質問ありがとうございます。「${question}」について回答いたします。

【設定されたAIの役割】
${config.systemPrompt}

上記の専門性に基づき、以下のポイントをお伝えします：

1. まず現状の把握が重要です。具体的なデータや状況を教えていただけると、より的確なアドバイスが可能です。

2. 一般的な傾向として、この分野では以下の点が重要視されています：
   - データに基づいた意思決定
   - 市場トレンドの継続的な監視
   - 競合との差別化戦略

3. 次のステップとして、具体的なアクションプランを一緒に考えましょう。

追加の質問があればお気軽にどうぞ。`
    }

    if (q.includes("比較") || q.includes("違い") || q.includes("メリット") || q.includes("デメリット")) {
      return `「${question}」について比較分析いたします。

【比較のポイント】

それぞれのオプションについて、メリット・デメリットを整理すると：

**オプションA:**
- メリット: コスト効率が高い、導入が容易
- デメリット: スケーラビリティに限界

**オプションB:**
- メリット: 拡張性が高い、長期的なROI
- デメリット: 初期投資が大きい

より具体的な状況（予算、期間、優先事項など）を教えていただければ、最適な選択肢を絞り込めます。`
    }

    return `ご質問ありがとうございます。

「${question}」について、私の専門知識に基づいて回答いたします。

この領域では、いくつかの重要な観点があります。まず状況をより詳しく把握するために、以下を教えてください：

- 現在の具体的な状況や課題
- 達成したい目標やゴール
- これまでに試したことがあればその結果

これらの情報をもとに、具体的で実行可能なアドバイスを提供いたします。`
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 md:gap-4 lg:gap-6">
      <div className="flex shrink-0 items-center gap-3 md:gap-4 border-b border-border pb-3 md:pb-4 lg:pb-6">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight truncate">{config.name}</h1>
            <p className="text-xs text-muted-foreground truncate">{config.systemPrompt.slice(0, 60)}...</p>
          </div>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <SharedChatLayout
          storageKey={storageKey}
          initialMessage={`こんにちは。「${config.name}」としてお手伝いします。\n\n${config.systemPrompt.slice(0, 120)}${config.systemPrompt.length > 120 ? "..." : ""}\n\nお気軽にご質問ください。`}
          historyLabel="履歴"
          suggestedItems={suggestedItems.length > 0 ? suggestedItems : [{ icon: MessageSquare, text: "何ができますか？", color: "from-violet-500 to-purple-600" }]}
          suggestedLabel="おすすめの質問"
          generateResponse={generateResponse}
          theme="data-analysis"
          inputPlaceholder="質問を入力..."
          typingDelay={1500}
        />
      </div>
    </div>
  )
}

// --- メインコンポーネント ---

interface CustomChatProps {
  initialChatId?: string | null
}

export function CustomChat({ initialChatId }: CustomChatProps) {
  const [configs, setConfigs] = useState<CustomChatConfig[]>([])
  const [view, setView] = useState<"list" | "create" | "edit" | "chat">("list")
  const [editingConfig, setEditingConfig] = useState<CustomChatConfig | null>(null)
  const [activeChatConfig, setActiveChatConfig] = useState<CustomChatConfig | null>(null)

  useEffect(() => {
    const loaded = loadConfigs()
    setConfigs(loaded)
    if (initialChatId) {
      const found = loaded.find((c) => c.id === initialChatId)
      if (found) {
        setActiveChatConfig(found)
        setView("chat")
      }
    }
  }, [initialChatId])

  const handleCreate = (data: Omit<CustomChatConfig, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    const newConfig: CustomChatConfig = {
      ...data,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    }
    const updated = [newConfig, ...configs]
    setConfigs(updated)
    saveConfigs(updated)
    // 作成後すぐにチャット画面へ
    setActiveChatConfig(newConfig)
    setView("chat")
  }

  const handleUpdate = (data: Omit<CustomChatConfig, "id" | "createdAt" | "updatedAt">) => {
    if (!editingConfig) return
    const updated = configs.map((c) =>
      c.id === editingConfig.id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c,
    )
    setConfigs(updated)
    saveConfigs(updated)
    setEditingConfig(null)
    setView("list")
  }

  const handleDelete = (id: string) => {
    const updated = configs.filter((c) => c.id !== id)
    setConfigs(updated)
    saveConfigs(updated)
    // 関連するチャット履歴も削除
    if (typeof window !== "undefined") {
      localStorage.removeItem(`symphony-custom-chat-${id}`)
    }
  }

  const handleOpenChat = (config: CustomChatConfig) => {
    setActiveChatConfig(config)
    setView("chat")
  }

  // チャット画面
  if (view === "chat" && activeChatConfig) {
    return (
      <CustomChatConversation
        config={activeChatConfig}
        onBack={() => {
          setActiveChatConfig(null)
          setView("list")
        }}
      />
    )
  }

  // 作成画面
  if (view === "create") {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setView("list")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">新しいAIチャットを作成</h2>
            <p className="text-sm text-muted-foreground">独自のプロンプトでAIの役割をカスタマイズ</p>
          </div>
        </div>
        <ChatConfigForm onSave={handleCreate} onCancel={() => setView("list")} />
      </div>
    )
  }

  // 編集画面
  if (view === "edit" && editingConfig) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setEditingConfig(null); setView("list") }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">AIチャットを編集</h2>
            <p className="text-sm text-muted-foreground">{editingConfig.name}</p>
          </div>
        </div>
        <ChatConfigForm initial={editingConfig} onSave={handleUpdate} onCancel={() => { setEditingConfig(null); setView("list") }} />
      </div>
    )
  }

  // リスト画面
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold">カスタムAIチャット</h2>
          <p className="text-sm text-muted-foreground">独自のプロンプトでAIチャットを作成・管理</p>
        </div>
        <Button onClick={() => setView("create")} className="gap-2">
          <Plus className="h-4 w-4" />
          新規作成
        </Button>
      </div>

      {configs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Sparkles className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
              カスタムAIチャットがありません
            </h3>
            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground/70">
              独自のシステムプロンプトを設定して、目的に特化したAIチャットを作成できます。
            </p>
            <Button onClick={() => setView("create")} className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              最初のチャットを作成
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 新規作成カード */}
          <Card
            className="flex cursor-pointer items-center justify-center border-dashed transition-colors hover:border-primary/50 hover:bg-muted/30"
            onClick={() => setView("create")}
          >
            <CardContent className="flex flex-col items-center py-10">
              <Plus className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">新規作成</p>
            </CardContent>
          </Card>

          {/* 既存チャットカード */}
          {configs.map((config) => (
            <Card
              key={config.id}
              className="group cursor-pointer transition-colors hover:border-primary/50 hover:bg-muted/30"
              onClick={() => handleOpenChat(config)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base truncate">{config.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingConfig(config)
                        setView("edit")
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(config.id)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2 text-xs">
                  {config.systemPrompt}
                </CardDescription>
                {config.suggestedQuestions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {config.suggestedQuestions.slice(0, 2).map((q, i) => (
                      <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground truncate max-w-[140px]">
                        {q}
                      </span>
                    ))}
                    {config.suggestedQuestions.length > 2 && (
                      <span className="text-[10px] text-muted-foreground">+{config.suggestedQuestions.length - 2}</span>
                    )}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  チャットを開く
                  <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
