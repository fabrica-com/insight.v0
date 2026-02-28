import { Bell, Search, ChevronDown, Command, BarChart3, Car, Globe, FileText, Megaphone, Users, ShieldCheck, Truck, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Link from "next/link"

const symphonyApps = [
  { name: "Insight", desc: "市場分析", icon: BarChart3, color: "bg-blue-500", href: "/" },
  { name: "Inventory", desc: "在庫管理", icon: Car, color: "bg-emerald-500", href: "#" },
  { name: "Export", desc: "輸出管理", icon: Globe, color: "bg-violet-500", href: "#" },
  { name: "CRM", desc: "顧客管理", icon: Users, color: "bg-amber-500", href: "#" },
  { name: "Auction", desc: "オークション", icon: Truck, color: "bg-rose-500", href: "#" },
  { name: "Marketing", desc: "集客・広告", icon: Megaphone, color: "bg-pink-500", href: "#" },
  { name: "Documents", desc: "書類管理", icon: FileText, color: "bg-cyan-500", href: "#" },
  { name: "Compliance", desc: "法令遵守", icon: ShieldCheck, color: "bg-slate-500", href: "#" },
  { name: "Admin", desc: "管理設定", icon: Settings, color: "bg-gray-500", href: "#" },
]

function AppLauncherGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <circle cx="3" cy="3" r="1.8" />
      <circle cx="9" cy="3" r="1.8" />
      <circle cx="15" cy="3" r="1.8" />
      <circle cx="3" cy="9" r="1.8" />
      <circle cx="9" cy="9" r="1.8" />
      <circle cx="15" cy="9" r="1.8" />
      <circle cx="3" cy="15" r="1.8" />
      <circle cx="9" cy="15" r="1.8" />
      <circle cx="15" cy="15" r="1.8" />
    </svg>
  )
}

export function DashboardHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card/50 backdrop-blur-sm px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <Input
            placeholder="検索..."
            className="pl-10 pr-20 h-9 bg-muted/50 border-transparent focus:bg-background focus:border-border transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <AppLauncherGrid />
              <span className="sr-only">Symphony シリーズ</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[320px] p-0">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold">Symphony シリーズ</p>
              <p className="text-xs text-muted-foreground">アプリを選択して切り替え</p>
            </div>
            <div className="grid grid-cols-3 gap-1 p-2">
              {symphonyApps.map((app) => (
                <Link
                  key={app.name}
                  href={app.href}
                  className="flex flex-col items-center gap-1.5 rounded-lg p-3 text-center transition-colors hover:bg-muted/80"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${app.color} text-white`}>
                    <app.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium leading-tight">{app.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{app.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 h-9 pl-2 pr-3">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-chart-4 text-primary-foreground flex items-center justify-center font-semibold text-xs">
                A
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-sm font-medium leading-none">オートギャラリー東京</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>アカウント</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">プロフィール</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">設定</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>サポート</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>ログアウト</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
