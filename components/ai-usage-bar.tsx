"use client"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock usage data
const AI_MONTHLY_LIMIT = 100000 // tokens per month
const AI_USED = 82000 // current usage

const CREDIT_OPTIONS = [
  { amount: 1000, tokens: 50000, label: "ライト", popular: false },
  { amount: 2000, tokens: 120000, label: "スタンダード", popular: true },
  { amount: 5000, tokens: 350000, label: "プロ", popular: false },
  { amount: 10000, tokens: 800000, label: "エンタープライズ", popular: false },
]

export function AiUsageBar({ compact = false }: { compact?: boolean }) {
  const [used] = useState(AI_USED)
  const [limit] = useState(AI_MONTHLY_LIMIT)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedCredit, setSelectedCredit] = useState<number | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [purchased, setPurchased] = useState(false)

  const percentage = Math.min((used / limit) * 100, 100)
  const remaining = Math.max(limit - used, 0)
  const isNearLimit = percentage >= 80
  const isOverLimit = percentage >= 100

  const handlePurchase = () => {
    if (selectedCredit === null) return
    setShowConfirm(true)
  }

  const handleConfirmPurchase = () => {
    setPurchased(true)
    setShowConfirm(false)
    setTimeout(() => {
      setPurchased(false)
      setShowPurchaseModal(false)
      setSelectedCredit(null)
    }, 2000)
  }

  if (compact) {
    return (
      <>
        <button
          type="button"
          className="flex items-center gap-2 w-full group"
          onClick={(isNearLimit || isOverLimit) ? () => setShowPurchaseModal(true) : undefined}
          title={`${(used / 1000).toFixed(0)}K / ${(limit / 1000).toFixed(0)}K トークン`}
        >
          <span className={cn(
            "text-[10px] font-medium whitespace-nowrap",
            isOverLimit ? "text-destructive" : isNearLimit ? "text-amber-600" : "text-muted-foreground"
          )}>
            {(used / 1000).toFixed(0)}K/{(limit / 1000).toFixed(0)}K
          </span>
          <Progress
            value={percentage}
            className={cn(
              "h-1.5 flex-1",
              isOverLimit
                ? "[&>div]:bg-destructive"
                : isNearLimit
                  ? "[&>div]:bg-amber-500"
                  : "[&>div]:bg-primary"
            )}
          />
        </button>
        {renderPurchaseModal()}
      </>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className={cn("h-4 w-4", isOverLimit ? "text-destructive" : isNearLimit ? "text-amber-500" : "text-primary")} />
            <span className="text-sm font-semibold">AI利用量</span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] px-1.5",
                isOverLimit
                  ? "border-destructive text-destructive bg-destructive/5"
                  : isNearLimit
                    ? "border-amber-400 text-amber-600 bg-amber-50"
                    : "border-border"
              )}
            >
              {new Date().getMonth() + 1}月
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">
            <span className={cn("font-bold", isOverLimit ? "text-destructive" : isNearLimit ? "text-amber-600" : "text-foreground")}>
              {(used / 1000).toFixed(0)}K
            </span>
            {" / "}{(limit / 1000).toFixed(0)}K トークン
          </span>
        </div>

        <Progress
          value={percentage}
          className={cn(
            "h-2.5",
            isOverLimit
              ? "[&>div]:bg-destructive"
              : isNearLimit
                ? "[&>div]:bg-amber-500"
                : "[&>div]:bg-primary"
          )}
        />

        <div className="flex items-center justify-between mt-2">
          <span className={cn(
            "text-xs",
            isOverLimit ? "text-destructive font-medium" : isNearLimit ? "text-amber-600" : "text-muted-foreground"
          )}>
            {isOverLimit
              ? "月間利用上限に達しました"
              : isNearLimit
                ? `残り${(remaining / 1000).toFixed(0)}Kトークン（上限間近）`
                : `残り${(remaining / 1000).toFixed(0)}Kトークン`
            }
          </span>
          {(isNearLimit || isOverLimit) && (
            <Button
              size="sm"
              variant={isOverLimit ? "default" : "outline"}
              className={cn(
                "h-7 text-xs gap-1",
                isOverLimit && "bg-primary hover:bg-primary/90"
              )}
              onClick={() => setShowPurchaseModal(true)}
            >
              <Sparkles className="h-3 w-3" />
              追加購入
            </Button>
          )}
        </div>
      </div>

      {renderPurchaseModal()}
    </>
  )

  function renderPurchaseModal() {
    return (
      <Dialog open={showPurchaseModal} onOpenChange={(open) => { setShowPurchaseModal(open); if (!open) { setSelectedCredit(null); setShowConfirm(false); setPurchased(false) } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI追加利用クーポン
            </DialogTitle>
            <DialogDescription>
              追加のAI利用枠を購入できます。料金は月額利用料と合わせてご請求となります。
            </DialogDescription>
          </DialogHeader>

          {purchased ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold">購入が完了しました</p>
              <p className="text-sm text-muted-foreground">追加のAI利用枠が反映されました</p>
            </div>
          ) : showConfirm ? (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-amber-800">購入確認</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      {CREDIT_OPTIONS.find(c => c.amount === selectedCredit)?.label}プラン
                      （{selectedCredit?.toLocaleString()}円 / {((CREDIT_OPTIONS.find(c => c.amount === selectedCredit)?.tokens ?? 0) / 1000).toFixed(0)}Kトークン）を購入します。
                      この料金は今月の月額利用料と合わせてご請求されます。
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setShowConfirm(false)}>戻る</Button>
                <Button onClick={handleConfirmPurchase}>購入を確定する</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              {CREDIT_OPTIONS.map((option) => (
                <Card
                  key={option.amount}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedCredit === option.amount
                      ? "border-primary ring-1 ring-primary bg-primary/[0.02]"
                      : "hover:border-primary/40 hover:bg-muted/30",
                    option.popular && selectedCredit !== option.amount && "border-primary/30"
                  )}
                  onClick={() => setSelectedCredit(option.amount)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        selectedCredit === option.amount
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}>
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{option.label}</span>
                          {option.popular && (
                            <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                              おすすめ
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          +{(option.tokens / 1000).toFixed(0)}Kトークン
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">{option.amount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground ml-0.5">円</span>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <p className="text-[11px] text-muted-foreground leading-relaxed px-1">
                ※ 購入したクーポンは当月内に限り有効です。未使用分の翌月繰越はできません。
              </p>

              <DialogFooter>
                <Button
                  className="w-full gap-2"
                  disabled={selectedCredit === null}
                  onClick={handlePurchase}
                >
                  <Sparkles className="h-4 w-4" />
                  {selectedCredit
                    ? `${selectedCredit.toLocaleString()}円のクーポンを購入`
                    : "プランを選択してください"
                  }
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }
}
