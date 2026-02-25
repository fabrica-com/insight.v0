"use client"

import { useState, useRef, useCallback } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { jsPDF } from "jspdf"
import {
  Star,
  Instagram,
  MessageCircle,
  Globe,
  Link2,
  Download,
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Printer,
  QrCode,
  Smartphone,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// --- Types ---
interface QREntry {
  id: string
  label: string
  url: string
  type: string
}

interface PaperSize {
  name: string
  widthMm: number
  heightMm: number
}

// --- Constants ---
const PRESETS = [
  {
    id: "google-review",
    label: "Google口コミ",
    icon: Star,
    placeholder: "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID",
    description: "GoogleマップのPlaceIDを含むレビューURL",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    placeholder: "https://www.instagram.com/your_account/",
    description: "Instagramプロフィールページ",
  },
  {
    id: "line",
    label: "LINE公式",
    icon: MessageCircle,
    placeholder: "https://lin.ee/XXXXXXX",
    description: "LINE公式アカウントの友だち追加URL",
  },
  {
    id: "homepage",
    label: "ホームページ",
    icon: Globe,
    placeholder: "https://www.example.com",
    description: "自社ホームページURL",
  },
  {
    id: "custom",
    label: "カスタムURL",
    icon: Link2,
    placeholder: "https://...",
    description: "任意のURLを入力",
  },
]

const PAPER_SIZES: PaperSize[] = [
  { name: "L型スタンド (83x55mm)", widthMm: 83, heightMm: 55 },
  { name: "名刺サイズ (91x55mm)", widthMm: 91, heightMm: 55 },
  { name: "A6 (105x148mm)", widthMm: 105, heightMm: 148 },
  { name: "A5 (148x210mm)", widthMm: 148, heightMm: 210 },
  { name: "A4 (210x297mm)", widthMm: 210, heightMm: 297 },
]

export function QRCodeGenerator() {
  // --- State ---
  const [activePreset, setActivePreset] = useState("google-review")
  const [url, setUrl] = useState("")
  const [qrSize, setQrSize] = useState(200)
  const [storeName, setStoreName] = useState("")
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [selectedPaper, setSelectedPaper] = useState("L型スタンド (83x55mm)")
  const [customWidthMm, setCustomWidthMm] = useState(83)
  const [customHeightMm, setCustomHeightMm] = useState(55)

  // Batch entries
  const [batchEntries, setBatchEntries] = useState<QREntry[]>([])

  // Multi-face A4
  const [multiCols, setMultiCols] = useState(2)
  const [multiRows, setMultiRows] = useState(4)

  const qrRef = useRef<HTMLDivElement>(null)

  const currentPreset = PRESETS.find((p) => p.id === activePreset)
  const currentPaper = PAPER_SIZES.find((p) => p.name === selectedPaper)
  const paperW = currentPaper?.widthMm ?? customWidthMm
  const paperH = currentPaper?.heightMm ?? customHeightMm

  // --- Helpers ---
  const getQrCanvas = useCallback((): HTMLCanvasElement | null => {
    if (!qrRef.current) return null
    return qrRef.current.querySelector("canvas")
  }, [])

  const getCanvasDataUrl = useCallback((): string | null => {
    const canvas = getQrCanvas()
    if (!canvas) return null
    return canvas.toDataURL("image/png")
  }, [getQrCanvas])

  // --- Download PNG ---
  const downloadPng = useCallback(() => {
    const dataUrl = getCanvasDataUrl()
    if (!dataUrl) return
    const link = document.createElement("a")
    link.download = `qr-${activePreset}-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  }, [getCanvasDataUrl, activePreset])

  // --- Copy to clipboard ---
  const copyToClipboard = useCallback(async () => {
    const canvas = getQrCanvas()
    if (!canvas) return
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"))
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      }
    } catch {
      // fallback: no-op
    }
  }, [getQrCanvas])

  // --- Generate single-card PDF ---
  const generatePdf = useCallback(() => {
    const dataUrl = getCanvasDataUrl()
    if (!dataUrl) return

    const pdf = new jsPDF({
      orientation: paperW > paperH ? "landscape" : "portrait",
      unit: "mm",
      format: [paperW, paperH],
    })

    // Background
    pdf.setFillColor(255, 255, 255)
    pdf.rect(0, 0, paperW, paperH, "F")

    // Layout calculations
    const margin = Math.min(paperW, paperH) * 0.06
    const usableW = paperW - margin * 2
    const usableH = paperH - margin * 2

    // Text area
    let textY = margin
    const hasTitle = title.trim().length > 0
    const hasSubtitle = subtitle.trim().length > 0
    const hasStore = storeName.trim().length > 0

    if (hasStore) {
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(Math.min(7, usableH * 0.08))
      pdf.setTextColor(120, 120, 120)
      pdf.text(storeName, paperW / 2, textY + 3, { align: "center" })
      textY += 4
    }

    if (hasTitle) {
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(Math.min(10, usableH * 0.12))
      pdf.setTextColor(30, 30, 30)
      pdf.text(title, paperW / 2, textY + 4, { align: "center" })
      textY += 5.5
    }

    if (hasSubtitle) {
      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(Math.min(6, usableH * 0.06))
      pdf.setTextColor(100, 100, 100)
      pdf.text(subtitle, paperW / 2, textY + 3, { align: "center" })
      textY += 4
    }

    // QR code area
    const qrAreaH = usableH - (textY - margin) - 2
    const qrDrawSize = Math.min(usableW * 0.85, qrAreaH * 0.9)
    const qrX = (paperW - qrDrawSize) / 2
    const qrY = textY + (qrAreaH - qrDrawSize) / 2

    pdf.addImage(dataUrl, "PNG", qrX, qrY, qrDrawSize, qrDrawSize)

    pdf.save(`qr-card-${activePreset}.pdf`)
  }, [getCanvasDataUrl, paperW, paperH, title, subtitle, storeName, activePreset])

  // --- Generate A4 multi-face PDF ---
  const generateMultiFacePdf = useCallback(() => {
    const dataUrl = getCanvasDataUrl()
    if (!dataUrl) return

    const a4W = 210
    const a4H = 297
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

    const cellW = a4W / multiCols
    const cellH = a4H / multiRows

    // Draw cut guides
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.2)
    pdf.setLineDashPattern([2, 2], 0)

    for (let c = 1; c < multiCols; c++) {
      pdf.line(c * cellW, 0, c * cellW, a4H)
    }
    for (let r = 1; r < multiRows; r++) {
      pdf.line(0, r * cellH, a4W, r * cellH)
    }

    // Fill cells
    for (let r = 0; r < multiRows; r++) {
      for (let c = 0; c < multiCols; c++) {
        const cx = c * cellW
        const cy = r * cellH
        const margin = 3
        const innerW = cellW - margin * 2
        const innerH = cellH - margin * 2

        let textOffset = 0

        if (storeName.trim()) {
          pdf.setFont("helvetica", "normal")
          pdf.setFontSize(5)
          pdf.setTextColor(120, 120, 120)
          pdf.text(storeName, cx + cellW / 2, cy + margin + 3, { align: "center" })
          textOffset += 4
        }

        if (title.trim()) {
          pdf.setFont("helvetica", "bold")
          pdf.setFontSize(7)
          pdf.setTextColor(30, 30, 30)
          pdf.text(title, cx + cellW / 2, cy + margin + textOffset + 3, { align: "center" })
          textOffset += 4.5
        }

        if (subtitle.trim()) {
          pdf.setFont("helvetica", "normal")
          pdf.setFontSize(4.5)
          pdf.setTextColor(100, 100, 100)
          pdf.text(subtitle, cx + cellW / 2, cy + margin + textOffset + 2.5, { align: "center" })
          textOffset += 3.5
        }

        const qrArea = innerH - textOffset - 2
        const qrS = Math.min(innerW * 0.8, qrArea * 0.85)
        const qrX = cx + (cellW - qrS) / 2
        const qrY = cy + margin + textOffset + (qrArea - qrS) / 2

        pdf.addImage(dataUrl, "PNG", qrX, qrY, qrS, qrS)
      }
    }

    pdf.save(`qr-multiface-${multiCols}x${multiRows}.pdf`)
  }, [getCanvasDataUrl, multiCols, multiRows, storeName, title, subtitle])

  // --- Batch PDF using hidden rendered canvases ---
  const batchContainerRef = useRef<HTMLDivElement>(null)

  const generateBatchPdf = useCallback(() => {
    if (batchEntries.length === 0 || !batchContainerRef.current) return

    const canvases = batchContainerRef.current.querySelectorAll("canvas")
    if (canvases.length === 0) return

    const pdf = new jsPDF({
      orientation: paperW > paperH ? "landscape" : "portrait",
      unit: "mm",
      format: [paperW, paperH],
    })

    canvases.forEach((canvas, idx) => {
      if (idx > 0) pdf.addPage([paperW, paperH], paperW > paperH ? "landscape" : "portrait")
      const dataUrl = canvas.toDataURL("image/png")

      const margin = Math.min(paperW, paperH) * 0.08
      let textY = margin
      const entry = batchEntries[idx]

      if (entry?.label) {
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(Math.min(8, paperH * 0.08))
        pdf.setTextColor(30, 30, 30)
        pdf.text(entry.label, paperW / 2, textY + 3, { align: "center" })
        textY += 5
      }

      const qrArea = paperH - textY - margin
      const qrS = Math.min(paperW - margin * 2, qrArea) * 0.85
      const qrX = (paperW - qrS) / 2
      const qrY = textY + (qrArea - qrS) / 2

      pdf.addImage(dataUrl, "PNG", qrX, qrY, qrS, qrS)
    })

    pdf.save(`qr-batch-${Date.now()}.pdf`)
  }, [batchEntries, paperW, paperH])

  // --- Batch add ---
  const addBatchEntry = useCallback(() => {
    setBatchEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label: currentPreset?.label ?? "QR",
        url: "",
        type: activePreset,
      },
    ])
  }, [activePreset, currentPreset])

  const removeBatchEntry = useCallback((id: string) => {
    setBatchEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const updateBatchEntry = useCallback((id: string, url: string) => {
    setBatchEntries((prev) => prev.map((e) => (e.id === id ? { ...e, url } : e)))
  }, [])

  return (
    <div className="flex-1 space-y-6">
      {/* Preset Selection */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <QrCode className="h-5 w-5 text-primary" />
            QRコード種別
          </CardTitle>
          <CardDescription>用途に合わせたプリセットを選択してください</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PRESETS.map((preset) => {
              const Icon = preset.icon
              const isActive = activePreset === preset.id
              return (
                <button
                  key={preset.id}
                  onClick={() => setActivePreset(preset.id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                    isActive
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{preset.label}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Settings Panel */}
        <div className="space-y-6 xl:col-span-2">
          {/* URL Input */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">URL設定</CardTitle>
              <CardDescription>{currentPreset?.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qr-url">リンク先URL</Label>
                <Input
                  id="qr-url"
                  placeholder={currentPreset?.placeholder}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="store-name">店舗名（任意）</Label>
                  <Input
                    id="store-name"
                    placeholder="例: ABC自動車"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">タイトル（任意）</Label>
                  <Input
                    id="title"
                    placeholder="例: 口コミをお願いします"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">サブテキスト（任意）</Label>
                  <Input
                    id="subtitle"
                    placeholder="例: カメラで読み取ってください"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Size & Paper Settings */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">出力設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>QRコードサイズ（プレビュー）</Label>
                  <span className="text-sm font-medium text-muted-foreground">{qrSize}px</span>
                </div>
                <Slider
                  value={[qrSize]}
                  onValueChange={(v) => setQrSize(v[0])}
                  min={100}
                  max={400}
                  step={10}
                />
              </div>

              <div className="space-y-2">
                <Label>用紙サイズ</Label>
                <Select value={selectedPaper} onValueChange={setSelectedPaper}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAPER_SIZES.map((p) => (
                      <SelectItem key={p.name} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">カスタムサイズ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedPaper === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>幅 (mm)</Label>
                    <Input
                      type="number"
                      value={customWidthMm}
                      onChange={(e) => setCustomWidthMm(Number(e.target.value))}
                      min={20}
                      max={300}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>高さ (mm)</Label>
                    <Input
                      type="number"
                      value={customHeightMm}
                      onChange={(e) => setCustomHeightMm(Number(e.target.value))}
                      min={20}
                      max={420}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced Tabs */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">拡張機能</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="multiface">
                <TabsList className="w-full">
                  <TabsTrigger value="multiface" className="flex-1">
                    <Printer className="mr-1.5 h-3.5 w-3.5" />
                    A4面付け印刷
                  </TabsTrigger>
                  <TabsTrigger value="batch" className="flex-1">
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    一括シート
                  </TabsTrigger>
                </TabsList>

                {/* Multi-face */}
                <TabsContent value="multiface" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    同じQRコードをA4用紙に複数配置し、切り分けて使用できます。商談テーブル用スタンドカードに最適です。
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>横の列数</Label>
                      <Select value={String(multiCols)} onValueChange={(v) => setMultiCols(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n}列
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>縦の行数</Label>
                      <Select value={String(multiRows)} onValueChange={(v) => setMultiRows(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <SelectItem key={n} value={String(n)}>
                              {n}行
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">
                        {multiCols} x {multiRows} = {multiCols * multiRows}枚
                      </p>
                      <p className="text-muted-foreground">
                        1枚あたり約 {Math.floor(210 / multiCols)}mm x {Math.floor(297 / multiRows)}mm
                      </p>
                    </div>
                  </div>
                  <Button onClick={generateMultiFacePdf} disabled={!url} className="w-full">
                    <Printer className="mr-2 h-4 w-4" />
                    A4面付けPDFを生成
                  </Button>
                </TabsContent>

                {/* Batch */}
                <TabsContent value="batch" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    複数の異なるQRコードをまとめて1枚のシートに出力できます。Google口コミ、LINE、Instagramなどを1枚に集約。
                  </p>
                  {batchEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-2">
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {entry.label}
                      </Badge>
                      <Input
                        placeholder="URLを入力..."
                        value={entry.url}
                        onChange={(e) => updateBatchEntry(entry.id, e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeBatchEntry(entry.id)} className="shrink-0">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addBatchEntry} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    QRコードを追加
                  </Button>
                  {batchEntries.length > 0 && (
                    <Button onClick={generateBatchPdf} className="w-full">
                      <FileText className="mr-2 h-4 w-4" />
                      一括シートPDFを生成
                    </Button>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">プレビュー</CardTitle>
              <CardDescription>
                {paperW}mm x {paperH}mm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Card Preview */}
              <div
                className="mx-auto flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-4"
                style={{
                  aspectRatio: `${paperW}/${paperH}`,
                  maxWidth: "100%",
                }}
              >
                {storeName && (
                  <p className="mb-0.5 text-[10px] text-muted-foreground">{storeName}</p>
                )}
                {title && (
                  <p className="mb-1 text-center text-sm font-bold text-foreground">{title}</p>
                )}
                {subtitle && (
                  <p className="mb-2 text-center text-[10px] text-muted-foreground">{subtitle}</p>
                )}
                <div ref={qrRef} className="flex items-center justify-center">
                  <QRCodeCanvas
                    value={url || "https://example.com"}
                    size={Math.min(qrSize, 280)}
                    level="H"
                    marginSize={2}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={generatePdf} disabled={!url} className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  PDF出力
                </Button>
                <Button variant="outline" onClick={downloadPng} disabled={!url} className="w-full">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  PNG保存
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={copyToClipboard} disabled={!url} className="w-full">
                  <Copy className="mr-2 h-4 w-4" />
                  コピー
                </Button>
                <Button variant="outline" onClick={downloadPng} disabled={!url} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  ダウンロード
                </Button>
              </div>

              {/* Tips */}
              <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground space-y-1.5">
                <p className="font-medium text-foreground text-sm">活用アイデア</p>
                <ul className="space-y-1 list-disc pl-3.5">
                  <li>商談席のL型スタンドに口コミ誘導QRを設置</li>
                  <li>納車時にLINE友だち追加QRカードを同封</li>
                  <li>店頭POPにInstagramフォローQRを掲示</li>
                  <li>見積書・請求書にHP誘導QRを印字</li>
                  <li>展示車のプライスボードにQRを添付</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Use Cases Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">商談席での活用シーン</CardTitle>
          <CardDescription>QRコードをさまざまな場面で活用し、顧客接点を最大化</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Star,
                title: "MEO口コミ誘導",
                desc: "商談後・納車後にGoogleレビューへ自然に誘導。口コミ数増加でMEO順位向上。",
              },
              {
                icon: MessageCircle,
                title: "LINE友だち追加",
                desc: "LINE公式でアフターフォロー。車検・点検リマインドで継続的な関係構築。",
              },
              {
                icon: Instagram,
                title: "SNSフォロー誘導",
                desc: "InstagramやTikTokでの在庫紹介をフォロワーに届け、来店促進。",
              },
              {
                icon: FileText,
                title: "アンケート収集",
                desc: "Googleフォーム等のアンケートQRで顧客の声を収集。サービス改善に活用。",
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Hidden batch QR canvases for PDF generation */}
      {batchEntries.length > 0 && (
        <div ref={batchContainerRef} className="sr-only" aria-hidden="true">
          {batchEntries.map((entry) => (
            <QRCodeCanvas
              key={entry.id}
              value={entry.url || "https://example.com"}
              size={256}
              level="H"
              marginSize={2}
            />
          ))}
        </div>
      )}
    </div>
  )
}
