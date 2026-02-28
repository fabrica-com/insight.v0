"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Info,
  Link2,
  Store,
  Save,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InventoryUrl {
  id: string
  name: string
  url: string
  status: "valid" | "invalid" | "unchecked"
}

interface CompetitorStore {
  id: string
  name: string
  url: string
  status: "valid" | "invalid" | "unchecked"
}

const COMPETITOR_STORAGE_KEY = "symphony-insight-competitors"
const MAX_COMPETITORS = 5

function loadCompetitors(): CompetitorStore[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(COMPETITOR_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveCompetitors(stores: CompetitorStore[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(COMPETITOR_STORAGE_KEY, JSON.stringify(stores))
}

const STORAGE_KEY = "symphony-insight-inventory-urls"

function loadUrls(): InventoryUrl[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveUrls(urls: InventoryUrl[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urls))
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

export default function SettingsPage() {
  const [urls, setUrls] = useState<InventoryUrl[]>([])
  const [newName, setNewName] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [saveMessage, setSaveMessage] = useState("")
  const [mounted, setMounted] = useState(false)

  // Competitor stores
  const [competitors, setCompetitors] = useState<CompetitorStore[]>([])
  const [compNewName, setCompNewName] = useState("")
  const [compNewUrl, setCompNewUrl] = useState("")
  const [compSaveMessage, setCompSaveMessage] = useState("")

  useEffect(() => {
    setMounted(true)
    setUrls(loadUrls())
    setCompetitors(loadCompetitors())
  }, [])

  const handleAddUrl = () => {
    if (!newUrl.trim()) return

    const entry: InventoryUrl = {
      id: Date.now().toString(),
      name: newName.trim() || extractDomain(newUrl.trim()),
      url: newUrl.trim(),
      status: isValidUrl(newUrl.trim()) ? "valid" : "invalid",
    }

    const updated = [...urls, entry]
    setUrls(updated)
    saveUrls(updated)
    setNewName("")
    setNewUrl("")
  }

  const handleRemoveUrl = (id: string) => {
    const updated = urls.filter((u) => u.id !== id)
    setUrls(updated)
    saveUrls(updated)
  }

  const handleUpdateUrl = (id: string, field: "name" | "url", value: string) => {
    const updated = urls.map((u) => {
      if (u.id !== id) return u
      const newEntry = { ...u, [field]: value }
      if (field === "url") {
        newEntry.status = isValidUrl(value) ? "valid" : value.trim() ? "invalid" : "unchecked"
      }
      return newEntry
    })
    setUrls(updated)
  }

  const handleSaveAll = () => {
    saveUrls(urls)
    setSaveMessage("保存しました")
    setTimeout(() => setSaveMessage(""), 2000)
  }

  // Competitor handlers
  const handleAddCompetitor = () => {
    if (!compNewUrl.trim() || competitors.length >= MAX_COMPETITORS) return
    const entry: CompetitorStore = {
      id: Date.now().toString(),
      name: compNewName.trim() || extractDomain(compNewUrl.trim()),
      url: compNewUrl.trim(),
      status: isValidUrl(compNewUrl.trim()) ? "valid" : "invalid",
    }
    const updated = [...competitors, entry]
    setCompetitors(updated)
    saveCompetitors(updated)
    setCompNewName("")
    setCompNewUrl("")
  }

  const handleRemoveCompetitor = (id: string) => {
    const updated = competitors.filter((c) => c.id !== id)
    setCompetitors(updated)
    saveCompetitors(updated)
  }

  const handleUpdateCompetitor = (id: string, field: "name" | "url", value: string) => {
    const updated = competitors.map((c) => {
      if (c.id !== id) return c
      const newEntry = { ...c, [field]: value }
      if (field === "url") {
        newEntry.status = isValidUrl(value) ? "valid" : value.trim() ? "invalid" : "unchecked"
      }
      return newEntry
    })
    setCompetitors(updated)
  }

  const handleSaveCompetitors = () => {
    saveCompetitors(competitors)
    setCompSaveMessage("保存しました")
    setTimeout(() => setCompSaveMessage(""), 2000)
  }

  function extractDomain(urlStr: string): string {
    try {
      return new URL(urlStr).hostname
    } catch {
      return "不明なサイト"
    }
  }

  if (!mounted) return null

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1000px] space-y-6">
            <div className="border-b border-border pb-6">
              <h1 className="text-2xl font-bold tracking-tight">設定</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                アカウントおよびデータ取得に関する設定
              </p>
            </div>

            {/* Inventory URL Configuration Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">在庫情報URL設定</CardTitle>
                    <CardDescription>
                      自社の店舗在庫が掲載されているURLを登録してください
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Info banner */}
                <div className="flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-4 dark:border-sky-900 dark:bg-sky-950/40">
                  <Info className="h-5 w-5 text-sky-600 dark:text-sky-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-sky-900 dark:text-sky-300">
                      シンフォニーシリーズ未使用の方へ
                    </p>
                    <p className="text-sky-700 dark:text-sky-400/80 leading-relaxed">
                      在庫管理にシンフォニーシリーズをご利用でない場合、
                      自社の在庫情報が掲載されているWEBサイトのURLを登録することで、
                      在庫データを自動取得して分析に活用できます。
                      カーセンサー、グーネット等の掲載ページや自社サイトの在庫ページURLをご登録ください。
                    </p>
                  </div>
                </div>

                {/* Add new URL form */}
                <div className="rounded-lg border border-dashed border-border p-4 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Plus className="h-4 w-4" />
                    新しいURLを追加
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
                    <div className="space-y-1.5">
                      <Label htmlFor="new-name" className="text-xs text-muted-foreground">
                        表示名（任意）
                      </Label>
                      <Input
                        id="new-name"
                        placeholder="例: カーセンサー掲載"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="new-url" className="text-xs text-muted-foreground">
                        在庫ページURL
                      </Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="new-url"
                            placeholder="https://kurumaerabi.com/shop/..."
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            className="pl-9"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddUrl()
                            }}
                          />
                        </div>
                        <Button onClick={handleAddUrl} disabled={!newUrl.trim()}>
                          <Plus className="h-4 w-4 mr-1.5" />
                          追加
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registered URLs list */}
                {urls.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-foreground">
                        登録済みURL（{urls.length}件）
                      </h3>
                      <div className="flex items-center gap-2">
                        {saveMessage && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {saveMessage}
                          </span>
                        )}
                        <Button size="sm" onClick={handleSaveAll}>
                          <Save className="h-3.5 w-3.5 mr-1.5" />
                          保存
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {urls.map((entry) => (
                        <div
                          key={entry.id}
                          className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:border-border/80 transition-colors"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted flex-shrink-0 mt-0.5">
                            <Store className="h-4 w-4 text-muted-foreground" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
                              <Input
                                value={entry.name}
                                onChange={(e) => handleUpdateUrl(entry.id, "name", e.target.value)}
                                className="h-8 text-sm"
                                placeholder="表示名"
                              />
                              <div className="relative">
                                <Link2 className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  value={entry.url}
                                  onChange={(e) => handleUpdateUrl(entry.id, "url", e.target.value)}
                                  className="h-8 text-sm pl-8 font-mono"
                                  placeholder="https://..."
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] h-5",
                                  entry.status === "valid"
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                                    : entry.status === "invalid"
                                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                                      : "border-border bg-muted text-muted-foreground",
                                )}
                              >
                                {entry.status === "valid" && (
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                )}
                                {entry.status === "invalid" && (
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                )}
                                {entry.status === "valid"
                                  ? "URL有効"
                                  : entry.status === "invalid"
                                    ? "URL無効"
                                    : "未確認"}
                              </Badge>
                              {entry.status === "valid" && (
                                <a
                                  href={entry.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  開く
                                </a>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={() => handleRemoveUrl(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">削除</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                      <Globe className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">URLが登録されていません</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[300px]">
                      上のフォームから、自社の在庫情報が掲載されているWEBサイトのURLを追加してください
                    </p>
                  </div>
                )}

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  ※お客様の責任において登録したURLから在庫データを自動的にローカルに保存し、分析に活用します。取得は通常閲覧の範囲内で行われます。
                </p>
              </CardContent>
            </Card>

            {/* Competitor Store Registration Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Store className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">競合店一括登録</CardTitle>
                    <CardDescription>
                      競合店の在庫ページURLを登録すると、自動的にデータを取得し比較分析に活用します
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {competitors.length} / {MAX_COMPETITORS}店舗
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Info */}
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
                  <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-amber-900 dark:text-amber-300">
                      競合分析の精度を高めるために
                    </p>
                    <p className="text-amber-700 dark:text-amber-400/80 leading-relaxed">
                      同一商圏の競合店を最大{MAX_COMPETITORS}店舗まで登録できます。
                      カーセンサーやグーネット等での競合店の在庫ページURLを登録すると、
                      価格帯・在庫構成・回転率などを自動比較し、AI分析レポートに反映されます。
                    </p>
                  </div>
                </div>

                {/* Add form */}
                {competitors.length < MAX_COMPETITORS ? (
                  <div className="rounded-lg border border-dashed border-border p-4 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Plus className="h-4 w-4" />
                      競合店を追加
                      <span className="text-xs text-muted-foreground font-normal">
                        （残り{MAX_COMPETITORS - competitors.length}店舗登録可能）
                      </span>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-[200px_1fr]">
                      <div className="space-y-1.5">
                        <Label htmlFor="comp-name" className="text-xs text-muted-foreground">
                          店舗名
                        </Label>
                        <Input
                          id="comp-name"
                          placeholder="例: ABC中古車センター"
                          value={compNewName}
                          onChange={(e) => setCompNewName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="comp-url" className="text-xs text-muted-foreground">
                          在庫ページURL
                        </Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="comp-url"
                              placeholder="https://www.carsensor.net/shop/..."
                              value={compNewUrl}
                              onChange={(e) => setCompNewUrl(e.target.value)}
                              className="pl-9"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddCompetitor()
                              }}
                            />
                          </div>
                          <Button onClick={handleAddCompetitor} disabled={!compNewUrl.trim()}>
                            <Plus className="h-4 w-4 mr-1.5" />
                            追加
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    登録上限（{MAX_COMPETITORS}店舗）に達しています。追加するには既存の店舗を削除してください。
                  </div>
                )}

                {/* Registered competitors list */}
                {competitors.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-foreground">
                        登録済み競合店（{competitors.length}件）
                      </h3>
                      <div className="flex items-center gap-2">
                        {compSaveMessage && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {compSaveMessage}
                          </span>
                        )}
                        <Button size="sm" onClick={handleSaveCompetitors}>
                          <Save className="h-3.5 w-3.5 mr-1.5" />
                          保存
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {competitors.map((entry, idx) => (
                        <div
                          key={entry.id}
                          className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:border-border/80 transition-colors"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500/10 flex-shrink-0 mt-0.5">
                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{idx + 1}</span>
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="grid gap-2 sm:grid-cols-[180px_1fr]">
                              <Input
                                value={entry.name}
                                onChange={(e) => handleUpdateCompetitor(entry.id, "name", e.target.value)}
                                className="h-8 text-sm"
                                placeholder="店舗名"
                              />
                              <div className="relative">
                                <Link2 className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  value={entry.url}
                                  onChange={(e) => handleUpdateCompetitor(entry.id, "url", e.target.value)}
                                  className="h-8 text-sm pl-8 font-mono"
                                  placeholder="https://..."
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] h-5",
                                  entry.status === "valid"
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                                    : entry.status === "invalid"
                                      ? "border-destructive/30 bg-destructive/10 text-destructive"
                                      : "border-border bg-muted text-muted-foreground",
                                )}
                              >
                                {entry.status === "valid" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {entry.status === "invalid" && <AlertCircle className="h-3 w-3 mr-1" />}
                                {entry.status === "valid" ? "URL有効" : entry.status === "invalid" ? "URL無効" : "未確認"}
                              </Badge>
                              {entry.status === "valid" && (
                                <a
                                  href={entry.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-muted-foreground hover:text-primary flex items-center gap-0.5 transition-colors"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  開く
                                </a>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={() => handleRemoveCompetitor(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">削除</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                      <Store className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">競合店が登録されていません</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[320px]">
                      上のフォームから競合店の在庫ページURLを登録すると、比較分析レポートに反映されます
                    </p>
                  </div>
                )}

                {/* Hint */}
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    URLの探し方
                  </h4>
                  <ul className="text-[11px] text-muted-foreground leading-relaxed space-y-1">
                    <li>1. カーセンサーやグーネットで競合店名を検索</li>
                    <li>2. 競合店の在庫一覧ページを開く</li>
                    <li>3. ブラウザのアドレスバーからURLをコピーして貼り付け</li>
                  </ul>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
                    ※競合店データは比較分析の目的のみに使用され、第三者に共有されることはありません。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
