"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Chrome,
  Download,
  CheckCircle2,
  Settings,
  Shield,
  Zap,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from "lucide-react"

interface ExtensionSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function ExtensionSetupModal({ open, onOpenChange, onComplete }: ExtensionSetupModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)

  const handleDownload = () => {
    setIsDownloading(true)
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false)
      setIsDownloaded(true)
      setCurrentStep(2)
    }, 2000)
  }

  const handleConfigure = () => {
    setIsConfigured(true)
    setCurrentStep(3)
  }

  const handleComplete = () => {
    onComplete()
    onOpenChange(false)
    // Reset state for next time
    setCurrentStep(1)
    setIsDownloaded(false)
    setIsConfigured(false)
  }

  const steps = [
    { number: 1, title: "拡張機能をダウンロード", completed: isDownloaded },
    { number: 2, title: "拡張機能を設定", completed: isConfigured },
    { number: 3, title: "設定完了", completed: false },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-4 text-white">
              <Chrome className="h-5 w-5" />
            </div>
            ブラウザ拡張機能のセットアップ
          </DialogTitle>
          <DialogDescription className="text-sm">
            競合店分析機能を利用するには、ブラウザ拡張機能のインストールと設定が必要です。
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between py-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                    step.completed
                      ? "border-green-500 bg-green-500 text-white"
                      : currentStep === step.number
                        ? "border-primary bg-primary text-white"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {step.completed ? <CheckCircle2 className="h-4 w-4" /> : step.number}
                </div>
                <span
                  className={`mt-1.5 text-xs ${currentStep === step.number ? "font-medium text-foreground" : "text-muted-foreground"}`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`mx-2 h-0.5 w-16 ${step.completed ? "bg-green-500" : "bg-muted-foreground/30"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[280px] rounded-lg border border-border bg-muted/30 p-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg border border-border bg-background p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <Chrome className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Symphony Insight データコレクター</h4>
                  <p className="mt-1 text-sm text-muted-foreground">Chrome / Edge 対応のブラウザ拡張機能</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="mr-1 h-3 w-3" />
                      安全な通信
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="mr-1 h-3 w-3" />
                      低負荷設計
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  公開情報のみを収集（ログイン不要のページのみ対象）
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  参照先サイトへの負荷を考慮した低頻度アクセス
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  データは貴社専用の暗号化領域に保存
                </p>
              </div>

              <Button className="w-full" size="lg" onClick={handleDownload} disabled={isDownloading || isDownloaded}>
                {isDownloading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ダウンロード中...
                  </>
                ) : isDownloaded ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    ダウンロード完了
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    拡張機能をダウンロード
                  </>
                )}
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <div>
                    <h4 className="font-medium text-amber-700 dark:text-amber-400">拡張機能のインストール手順</h4>
                    <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-medium text-amber-700 dark:text-amber-400">
                          1
                        </span>
                        ダウンロードしたファイルを解凍
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-medium text-amber-700 dark:text-amber-400">
                          2
                        </span>
                        Chrome で chrome://extensions を開く
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-medium text-amber-700 dark:text-amber-400">
                          3
                        </span>
                        「デベロッパーモード」をONにする
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-medium text-amber-700 dark:text-amber-400">
                          4
                        </span>
                        「パッケージ化されていない拡張機能を読み込む」をクリック
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-medium text-amber-700 dark:text-amber-400">
                          5
                        </span>
                        解凍したフォルダを選択
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <h4 className="flex items-center gap-2 font-medium">
                  <Settings className="h-4 w-4" />
                  拡張機能の設定
                </h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  拡張機能のアイコンをクリックし、以下の設定を行ってください：
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3" />
                    API キーを入力（設定画面で取得可能）
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3" />
                    データ収集頻度を選択（推奨: 1日1回）
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-3 w-3" />
                    対象サイトを確認
                  </li>
                </ul>
              </div>

              <Button className="w-full" size="lg" onClick={handleConfigure}>
                設定が完了しました
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">セットアップ完了</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                ブラウザ拡張機能の設定が完了しました。
                <br />
                競合店分析機能をご利用いただけます。
              </p>
              <div className="mt-6 rounded-lg border border-border bg-background p-4 text-left">
                <h4 className="text-sm font-medium">次のステップ</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    競合店のURLを追加して分析を開始
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    データは数時間後から表示されます
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {currentStep === 3 ? (
            <Button onClick={handleComplete} className="w-full sm:w-auto">
              競合店分析を開始する
            </Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              後で設定する
            </Button>
          )}
          <a
            href="#"
            className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            詳しいインストール手順を見る
            <ExternalLink className="h-3 w-3" />
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
