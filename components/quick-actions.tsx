"use client"

import { Button } from "@/components/ui/button"
import { Plus, FileDown, RefreshCw } from "lucide-react"

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <RefreshCw className="h-4 w-4" />
        <span className="hidden sm:inline">更新</span>
      </Button>
      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
        <FileDown className="h-4 w-4" />
        <span className="hidden sm:inline">エクスポート</span>
      </Button>
      <Button size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">新規登録</span>
      </Button>
    </div>
  )
}
