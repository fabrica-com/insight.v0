"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Plus,
  X,
  Link2,
  Store,
  MapPin,
  Loader2,
  Check,
  Search,
  Info,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PREFECTURES, MUNICIPALITIES, suggestStores } from "@/lib/location-data"

const PIE_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"]

interface Competitor {
  id: string
  name: string
  region: string
  distance: string
  isOwnCompany?: boolean
  url?: string
  addedAt?: Date
}

const INITIAL_COMPETITORS: Competitor[] = [
  { id: "own-company", name: "自社（マイカーセンター）", region: "東京都港区", distance: "0km", isOwnCompany: true },
]

const SAMPLE_FETCHED_DATA: Record<string, Partial<Competitor>> = {
  "kurumaerabi.com": {
    name: "カーセレクト東京",
    region: "東京都渋谷区",
  },
  default: {
    name: "不明な店舗",
    region: "地域不明",
  },
}

const COMPETITOR_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

const YEAR_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#84cc16", "#64748b"]

export function CompetitorComparison() {
  const [competitors, setCompetitors] = useState<Competitor[]>(INITIAL_COMPETITORS)
  const [selectedCompetitors, setSelectedCompetitors] = useState(["own-company"])
  const [hiddenCompetitors, setHiddenCompetitors] = useState<string[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("3months")
  const [trendPeriodType, setTrendPeriodType] = useState<"6months" | "12months" | "yearly">("6months")
  const [turnoverPeriod, setTurnoverPeriod] = useState<"6months" | "1year" | "5years">("6months")

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [competitorUrl, setCompetitorUrl] = useState("")
  const [isLoadingUrl, setIsLoadingUrl] = useState(false)
  const [fetchedCompetitor, setFetchedCompetitor] = useState<{
    name: string
    location: string
    distance: string
    url: string
  } | null>(null)

  const [selectedPrefecture, setSelectedPrefecture] = useState("")
  const [selectedMunicipality, setSelectedMunicipality] = useState("")
  const [storeNameQuery, setStoreNameQuery] = useState("")
  const [isStorePopoverOpen, setIsStorePopoverOpen] = useState(false)
  const [registrationMode, setRegistrationMode] = useState<"location" | "url">("location")

  const filteredMunicipalities = useMemo(() => {
    if (!selectedPrefecture) return []
    return MUNICIPALITIES[selectedPrefecture] || []
  }, [selectedPrefecture])

  const suggestedStores = useMemo(() => {
    return suggestStores(selectedPrefecture, selectedMunicipality, storeNameQuery)
  }, [selectedPrefecture, selectedMunicipality, storeNameQuery])

  const handlePrefectureChange = (value: string) => {
    setSelectedPrefecture(value)
    setSelectedMunicipality("")
    setStoreNameQuery("")
    setFetchedCompetitor(null)
  }

  const handleStoreSelect = (store: { name: string; municipality: string; url?: string }) => {
    setStoreNameQuery(store.name)
    setSelectedMunicipality(store.municipality)
    setIsStorePopoverOpen(false)

    const prefectureName = PREFECTURES.find((p) => p.code === selectedPrefecture)?.name || ""
    const distance = `${(Math.random() * 20 + 1).toFixed(1)}km`

    setFetchedCompetitor({
      name: store.name,
      location: `${prefectureName}${store.municipality}`,
      distance,
      url: store.url || "",
    })
  }

  const handleManualStoreConfirm = () => {
    if (!storeNameQuery.trim() || !selectedPrefecture) return

    const prefectureName = PREFECTURES.find((p) => p.code === selectedPrefecture)?.name || ""
    const distance = `${(Math.random() * 20 + 1).toFixed(1)}km`

    setFetchedCompetitor({
      name: storeNameQuery,
      location: `${prefectureName}${selectedMunicipality}`,
      distance,
      url: "",
    })
  }

  const resetAddDialog = () => {
    setCompetitorUrl("")
    setFetchedCompetitor(null)
    setSelectedPrefecture("")
    setSelectedMunicipality("")
    setStoreNameQuery("")
    setRegistrationMode("location")
  }

  const visibleCompetitors = selectedCompetitors.filter((id) => !hiddenCompetitors.includes(id))

  const parseStoreUrl = (url: string): { isValid: boolean; domain: string; storeId: string } => {
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname.replace("www.", "")
      const supportedDomains = ["kurumaerabi.com"]
      const isSupported = supportedDomains.some((d) => domain.includes(d))
      const pathParts = urlObj.pathname.split("/").filter(Boolean)
      const storeId = pathParts[pathParts.length - 1] || `store-${Date.now()}`
      return { isValid: isSupported, domain, storeId }
    } catch {
      return { isValid: false, domain: "", storeId: "" }
    }
  }

  const fetchStoreData = async (url: string): Promise<Competitor | null> => {
    const { isValid, domain, storeId } = parseStoreUrl(url)
    if (!isValid) {
      return null
    }
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const sampleData = SAMPLE_FETCHED_DATA[domain] || SAMPLE_FETCHED_DATA["default"]
    const distance = `${(Math.random() * 20 + 1).toFixed(1)}km`
    const newCompetitor: Competitor = {
      id: `comp-${storeId}-${Date.now()}`,
      name: sampleData.name || "店舗名取得中...",
      region: sampleData.region || "地域取得中...",
      distance,
      url,
      addedAt: new Date(),
    }
    return newCompetitor
  }

  const handleUrlSubmit = async () => {
    if (!competitorUrl.trim()) {
      return
    }
    setIsLoadingUrl(true)
    setFetchedCompetitor(null)
    try {
      const competitor = await fetchStoreData(competitorUrl)
      if (competitor) {
        setFetchedCompetitor({
          name: competitor.name,
          location: competitor.region || "地域不明",
          distance: competitor.distance || "不明",
          url: competitor.url || "",
        })
      }
    } catch {
      // Error handling
    } finally {
      setIsLoadingUrl(false)
    }
  }

  const handleAddFetchedCompetitor = () => {
    if (fetchedCompetitor && competitors.length < 5) {
      const newCompetitorEntry: Competitor = {
        id: `comp-${Date.now()}`,
        name: fetchedCompetitor.name,
        region: fetchedCompetitor.location,
        distance: fetchedCompetitor.distance,
        url: fetchedCompetitor.url,
        addedAt: new Date(),
      }
      setCompetitors([...competitors, newCompetitorEntry])
      setSelectedCompetitors([...selectedCompetitors, newCompetitorEntry.id])
      setHiddenCompetitors(hiddenCompetitors.filter((id) => id !== newCompetitorEntry.id))
      resetAddDialog()
      setIsAddDialogOpen(false)
    }
  }

  const toggleCompetitorVisibility = (competitorId: string) => {
    if (hiddenCompetitors.includes(competitorId)) {
      setHiddenCompetitors(hiddenCompetitors.filter((id) => id !== competitorId))
    } else {
      setHiddenCompetitors([...hiddenCompetitors, competitorId])
    }
  }

  const handleRemoveCompetitor = (competitorId: string) => {
    const competitor = competitors.find((c) => c.id === competitorId)
    if (competitor?.isOwnCompany) {
      return
    }
    if (competitors.length > 1) {
      setCompetitors(competitors.filter((c) => c.id !== competitorId))
      setSelectedCompetitors(selectedCompetitors.filter((id) => id !== competitorId))
      setHiddenCompetitors(hiddenCompetitors.filter((id) => id !== competitorId))
    }
  }

  const currentSnapshot = selectedCompetitors.map((id, index) => {
    const competitor = competitors.find((c) => c.id === id)
    const isOwn = competitor?.isOwnCompany
    return {
      id,
      name: competitor?.name || "",
      inventoryCount: isOwn ? 180 : 120 + index * 30,
      inventoryValue: isOwn ? 720000000 : 450000000 + index * 100000000,
      avgPrice: isOwn ? 1500000 : 1200000 + index * 200000,
      avgInventoryDays: isOwn ? 38 : 45 + index * 10,
      turnoverRate: isOwn ? 9.5 : Number.parseFloat((8.2 - index * 0.5).toFixed(1)),
    }
  })

  const currentYear = 2024
  const yearDistributionStacked = selectedCompetitors.map((id, index) => {
    const competitor = competitors.find((c) => c.id === id)
    const isOwn = competitor?.isOwnCompany

    const counts = isOwn
      ? {
          [`${currentYear}年`]: 20,
          [`${currentYear - 1}年`]: 28,
          [`${currentYear - 2}年`]: 32,
          [`${currentYear - 3}年`]: 25,
          [`${currentYear - 4}年`]: 18,
          [`${currentYear - 5}年`]: 15,
          [`${currentYear - 6}年`]: 12,
          [`${currentYear - 7}年`]: 8,
          それ以前: 10,
        }
      : {
          [`${currentYear}年`]: 12 + index * 3,
          [`${currentYear - 1}年`]: 18 + index * 4,
          [`${currentYear - 2}年`]: 22 + index * 2,
          [`${currentYear - 3}年`]: 15 - index * 1,
          [`${currentYear - 4}年`]: 12 + index * 1,
          [`${currentYear - 5}年`]: 10 - index * 1,
          [`${currentYear - 6}年`]: 8 + index * 1,
          [`${currentYear - 7}年`]: 5 + index * 1,
          それ以前: 8 + index * 2,
        }

    const sum = Object.values(counts).reduce((a, b) => a + b, 0)

    return {
      name: competitor?.name || "",
      [`${currentYear}年`]: (counts[`${currentYear}年`] / sum) * 100,
      [`${currentYear - 1}年`]: (counts[`${currentYear - 1}年`] / sum) * 100,
      [`${currentYear - 2}年`]: (counts[`${currentYear - 2}年`] / sum) * 100,
      [`${currentYear - 3}年`]: (counts[`${currentYear - 3}年`] / sum) * 100,
      [`${currentYear - 4}年`]: (counts[`${currentYear - 4}年`] / sum) * 100,
      [`${currentYear - 5}年`]: (counts[`${currentYear - 5}年`] / sum) * 100,
      [`${currentYear - 6}年`]: (counts[`${currentYear - 6}年`] / sum) * 100,
      [`${currentYear - 7}年`]: (counts[`${currentYear - 7}年`] / sum) * 100,
      それ以前: (counts["それ以前"] / sum) * 100,
    }
  })

  const manufacturerData = selectedCompetitors.map((id, index) => {
    const competitor = competitors.find((c) => c.id === id)
    const isOwn = competitor?.isOwnCompany
    return {
      name: competitor?.name || "",
      data: isOwn
        ? [
            { name: "トヨタ", value: 35 },
            { name: "日産", value: 22 },
            { name: "ホンダ", value: 20 },
            { name: "マツダ", value: 10 },
            { name: "BMW", value: 6 },
            { name: "メルセデス・ベンツ", value: 5 },
            { name: "その他", value: 2 },
          ]
        : [
            { name: "トヨタ", value: 30 + index * 3 },
            { name: "日産", value: 20 - index * 2 },
            { name: "ホンダ", value: 18 + index * 1 },
            { name: "マツダ", value: 12 - index * 1 },
            { name: "BMW", value: 8 + index * 1 },
            { name: "メルセデス・ベンツ", value: 7 + index * 1 },
            { name: "その他", value: 5 },
          ],
    }
  })

  const vehicleTypeData = [
    {
      type: "セダン",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 28 : 25 + i * 3])),
    },
    {
      type: "SUV",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 32 : 30 - i * 2])),
    },
    {
      type: "ワゴン",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 18 : 15 + i * 1])),
    },
    {
      type: "ミニバン",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 15 : 20 - i * 1])),
    },
    {
      type: "コンパクト",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 7 : 10 + i * 2])),
    },
  ]

  const priceDistribution = [
    {
      range: "50万以下",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5 : 8 + i * 2])),
    },
    {
      range: "50-100万",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 18 : 20 + i * 3])),
    },
    {
      range: "100-150万",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 28 : 25 - i * 2])),
    },
    {
      range: "150-200万",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 25 : 22 + i * 1])),
    },
    {
      range: "200-300万",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 16 : 15 - i * 1])),
    },
    {
      range: "300万以上",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 8 : 10 + i * 2])),
    },
  ]

  const originData = selectedCompetitors.map((id, index) => {
    const competitor = competitors.find((c) => c.id === id)
    const isOwn = competitor?.isOwnCompany
    return {
      name: competitor?.name || "",
      data: isOwn
        ? [
            { name: "国産車", value: 65 },
            { name: "輸入車", value: 20 },
            { name: "軽自動車", value: 15 },
          ]
        : [
            { name: "国産車", value: 60 - index * 5 },
            { name: "輸入車", value: 25 + index * 3 },
            { name: "軽自動車", value: 15 + index * 2 },
          ],
    }
  })

  const inventoryTrend = [
    {
      month: "1月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 170 : 110 + i * 25])),
    },
    {
      month: "2月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 175 : 115 + i * 28])),
    },
    {
      month: "3月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 185 : 125 + i * 30])),
    },
    {
      month: "4月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 178 : 118 + i * 27])),
    },
    {
      month: "5月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 182 : 122 + i * 29])),
    },
    {
      month: "6月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 180 : 120 + i * 30])),
    },
  ]

  const inventoryDaysTrend = [
    {
      month: "1月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 42 : 50 + i * 12])),
    },
    {
      month: "2月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 40 : 48 + i * 11])),
    },
    {
      month: "3月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 37 : 45 + i * 10])),
    },
    {
      month: "4月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 39 : 47 + i * 11])),
    },
    {
      month: "5月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 38 : 46 + i * 10])),
    },
    {
      month: "6月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 38 : 45 + i * 10])),
    },
  ]

  const inventoryValueTrend = [
    {
      month: "1月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 680 : 420 + i * 95])),
    },
    {
      month: "2月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 695 : 435 + i * 98])),
    },
    {
      month: "3月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 730 : 460 + i * 102])),
    },
    {
      month: "4月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 710 : 445 + i * 99])),
    },
    {
      month: "5月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 725 : 455 + i * 100])),
    },
    {
      month: "6月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 720 : 450 + i * 100])),
    },
  ]

  const salesVolumeTrend6Months = [
    {
      month: "7月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 30 : 20 + i * 5])),
    },
    {
      month: "8月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 28 : 18 + i * 4])),
    },
    {
      month: "9月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 35 : 25 + i * 6])),
    },
    {
      month: "10月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 38 : 28 + i * 7])),
    },
    {
      month: "11月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 42 : 32 + i * 8])),
    },
    {
      month: "12月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 45 : 35 + i * 9])),
    },
  ]

  const salesVolumeTrend12Months = [
    {
      month: "1月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 28 : 18 + i * 5])),
    },
    {
      month: "2月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 32 : 22 + i * 6])),
    },
    {
      month: "3月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 38 : 28 + i * 7])),
    },
    {
      month: "4月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 34 : 24 + i * 6])),
    },
    {
      month: "5月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 36 : 26 + i * 6])),
    },
    {
      month: "6月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 40 : 30 + i * 7])),
    },
    {
      month: "7月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 30 : 20 + i * 5])),
    },
    {
      month: "8月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 28 : 18 + i * 4])),
    },
    {
      month: "9月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 35 : 25 + i * 6])),
    },
    {
      month: "10月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 38 : 28 + i * 7])),
    },
    {
      month: "11月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 42 : 32 + i * 8])),
    },
    {
      month: "12月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 45 : 35 + i * 9])),
    },
  ]

  const revenueTrend6Months = [
    {
      month: "7月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 4200 : 2200 + i * 700])),
    },
    {
      month: "8月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 3900 : 2000 + i * 650])),
    },
    {
      month: "9月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 4800 : 2600 + i * 800])),
    },
    {
      month: "10月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5200 : 2900 + i * 850])),
    },
    {
      month: "11月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5600 : 3200 + i * 900])),
    },
    {
      month: "12月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 6000 : 3500 + i * 950])),
    },
  ]

  const revenueTrend12Months = [
    {
      month: "1月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 3800 : 2000 + i * 600])),
    },
    {
      month: "2月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 4200 : 2400 + i * 700])),
    },
    {
      month: "3月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5000 : 3000 + i * 850])),
    },
    {
      month: "4月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 4500 : 2600 + i * 750])),
    },
    {
      month: "5月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 4800 : 2800 + i * 780])),
    },
    {
      month: "6月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5200 : 3200 + i * 850])),
    },
    {
      month: "7月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 4200 : 2200 + i * 700])),
    },
    {
      month: "8月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 3900 : 2000 + i * 650])),
    },
    {
      month: "9月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 4800 : 2600 + i * 800])),
    },
    {
      month: "10月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5200 : 2900 + i * 850])),
    },
    {
      month: "11月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 5600 : 3200 + i * 900])),
    },
    {
      month: "12月",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 6000 : 3500 + i * 950])),
    },
  ]

  const inventoryTrendYearly = [
    {
      year: "2020年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 145 : 95 + i * 20])),
    },
    {
      year: "2021年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 158 : 105 + i * 22])),
    },
    {
      year: "2022年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 165 : 110 + i * 25])),
    },
    {
      year: "2023年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 173 : 115 + i * 27])),
    },
    {
      year: "2024年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 180 : 120 + i * 30])),
    },
  ]

  const inventoryDaysTrendYearly = [
    {
      year: "2020年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 48 : 55 + i * 13])),
    },
    {
      year: "2021年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 45 : 52 + i * 12])),
    },
    {
      year: "2022年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 42 : 48 + i * 11])),
    },
    {
      year: "2023年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 40 : 47 + i * 10])),
    },
    {
      year: "2024年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 38 : 45 + i * 10])),
    },
  ]

  const inventoryValueTrendYearly = [
    {
      year: "2020年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 580 : 380 + i * 85])),
    },
    {
      year: "2021年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 632 : 410 + i * 90])),
    },
    {
      year: "2022年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 665 : 430 + i * 95])),
    },
    {
      year: "2023年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 695 : 445 + i * 98])),
    },
    {
      year: "2024年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 720 : 450 + i * 100])),
    },
  ]

  const salesVolumeTrendYearly = [
    {
      year: "2020年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 360 : 240 + i * 60])),
    },
    {
      year: "2021年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 380 : 260 + i * 65])),
    },
    {
      year: "2022年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 395 : 275 + i * 68])),
    },
    {
      year: "2023年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 410 : 290 + i * 70])),
    },
    {
      year: "2024年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 420 : 300 + i * 72])),
    },
  ]

  const revenueTrendYearly = [
    {
      year: "2020年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 54000 : 28000 + i * 9000])),
    },
    {
      year: "2021年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 57000 : 31000 + i * 9500])),
    },
    {
      year: "2022年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 59000 : 33000 + i * 10000])),
    },
    {
      year: "2023年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 62000 : 35000 + i * 10500])),
    },
    {
      year: "2024年",
      ...Object.fromEntries(selectedCompetitors.map((id, i) => [id, id === "own-company" ? 65000 : 38000 + i * 11000])),
    },
  ]

  const turnoverComparisonData = [
    {
      category: "新規入庫",
      ...Object.fromEntries(
        selectedCompetitors.map((id, index) => {
          const competitor = competitors.find((c) => c.id === id)
          const isOwn = competitor?.isOwnCompany
          return [id, isOwn ? 45 : 35 + index * 8]
        }),
      ),
    },
    {
      category: "売却済み",
      ...Object.fromEntries(
        selectedCompetitors.map((id, index) => {
          const competitor = competitors.find((c) => c.id === id)
          const isOwn = competitor?.isOwnCompany
          return [id, isOwn ? 43 : 32 + index * 7]
        }),
      ),
    },
    {
      category: "純増",
      ...Object.fromEntries(
        selectedCompetitors.map((id, index) => {
          const competitor = competitors.find((c) => c.id === id)
          const isOwn = competitor?.isOwnCompany
          return [id, isOwn ? 2 : 3 + index * 1]
        }),
      ),
    },
  ]

  const turnoverTrend6Months = [
    {
      month: "7月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 42 : 32 + i * 7,
            sold: id === "own-company" ? 40 : 30 + i * 6,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "8月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 45 : 35 + i * 8,
            sold: id === "own-company" ? 43 : 33 + i * 7,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "9月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 48 : 38 + i * 8,
            sold: id === "own-company" ? 46 : 36 + i * 7,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "10月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 44 : 34 + i * 7,
            sold: id === "own-company" ? 42 : 32 + i * 6,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "11月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 46 : 36 + i * 8,
            sold: id === "own-company" ? 44 : 34 + i * 7,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "12月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 45 : 35 + i * 8,
            sold: id === "own-company" ? 43 : 32 + i * 7,
            net: id === "own-company" ? 2 : 3 + i * 1,
          },
        ]),
      ),
    },
  ]

  const turnoverTrend1Year = [
    {
      month: "1月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 40 : 30 + i * 7,
            sold: id === "own-company" ? 38 : 28 + i * 6,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "2月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 42 : 32 + i * 7,
            sold: id === "own-company" ? 40 : 30 + i * 7,
            net: id === "own-company" ? 2 : 2 + i * 0,
          },
        ]),
      ),
    },
    {
      month: "3月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 50 : 40 + i * 9,
            sold: id === "own-company" ? 48 : 38 + i * 8,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "4月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 43 : 33 + i * 7,
            sold: id === "own-company" ? 41 : 31 + i * 6,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "5月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 44 : 34 + i * 8,
            sold: id === "own-company" ? 42 : 32 + i * 7,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "6月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 45 : 35 + i * 8,
            sold: id === "own-company" ? 43 : 33 + i * 7,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "7月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 42 : 32 + i * 7,
            sold: id === "own-company" ? 40 : 30 + i * 6,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "8月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 45 : 35 + i * 8,
            sold: id === "own-company" ? 43 : 33 + i * 7,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "9月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 48 : 38 + i * 8,
            sold: id === "own-company" ? 46 : 36 + i * 7,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "10月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 44 : 34 + i * 7,
            sold: id === "own-company" ? 42 : 32 + i * 6,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "11月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 46 : 36 + i * 8,
            sold: id === "own-company" ? 44 : 34 + i * 7,
            net: id === "own-company" ? 2 : 2 + i * 1,
          },
        ]),
      ),
    },
    {
      month: "12月",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 45 : 35 + i * 8,
            sold: id === "own-company" ? 43 : 32 + i * 7,
            net: id === "own-company" ? 2 : 3 + i * 1,
          },
        ]),
      ),
    },
  ]

  const turnoverTrend5Years = [
    {
      year: "2020年",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 480 : 360 + i * 84,
            sold: id === "own-company" ? 460 : 340 + i * 80,
            net: id === "own-company" ? 20 : 20 + i * 4,
          },
        ]),
      ),
    },
    {
      year: "2021年",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 510 : 380 + i * 90,
            sold: id === "own-company" ? 485 : 360 + i * 85,
            net: id === "own-company" ? 25 : 20 + i * 5,
          },
        ]),
      ),
    },
    {
      year: "2022年",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 520 : 395 + i * 93,
            sold: id === "own-company" ? 495 : 375 + i * 88,
            net: id === "own-company" ? 25 : 20 + i * 5,
          },
        ]),
      ),
    },
    {
      year: "2023年",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 535 : 410 + i * 96,
            sold: id === "own-company" ? 510 : 390 + i * 92,
            net: id === "own-company" ? 25 : 20 + i * 4,
          },
        ]),
      ),
    },
    {
      year: "2024年",
      ...Object.fromEntries(
        selectedCompetitors.map((id, i) => [
          id,
          {
            newArrivals: id === "own-company" ? 540 : 420 + i * 96,
            sold: id === "own-company" ? 515 : 395 + i * 90,
            net: id === "own-company" ? 25 : 25 + i * 6,
          },
        ]),
      ),
    },
  ]

  const getTurnoverTrendData = () => {
    switch (turnoverPeriod) {
      case "6months":
        return { data: turnoverTrend6Months, xKey: "month" }
      case "1year":
        return { data: turnoverTrend1Year, xKey: "month" }
      case "5years":
        return { data: turnoverTrend5Years, xKey: "year" }
      default:
        return { data: turnoverTrend6Months, xKey: "month" }
    }
  }

  const getSalesVolumeData = () => {
    switch (trendPeriodType) {
      case "6months":
        return salesVolumeTrend6Months
      case "12months":
        return salesVolumeTrend12Months
      case "yearly":
        return salesVolumeTrendYearly
    }
  }

  const getRevenueData = () => {
    switch (trendPeriodType) {
      case "6months":
        return revenueTrend6Months
      case "12months":
        return revenueTrend12Months
      case "yearly":
        return revenueTrendYearly
    }
  }

  const getXAxisDataKey = () => {
    return trendPeriodType === "yearly" ? "year" : "month"
  }

  return (
    <div className="flex-1 space-y-6 p-8 overflow-y-auto bg-background">
      {/* Header section with add competitor dialog */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            登録済み競合店
<Badge variant="secondary">{competitors.length}/5</Badge>
  </h2>
  <p className="text-sm text-muted-foreground mt-0.5">比較したい競合店を選択してください（最大5店舗）</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open)
              if (!open) {
                resetAddDialog()
              }
            }}
          >
            <DialogTrigger asChild>
              <Button disabled={competitors.length >= 5} className="gap-2">
                <Plus className="h-4 w-4" />
                競合店を追加
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  競合店を追加
                </DialogTitle>
                <DialogDescription>地域と店舗名を入力するか、店舗ページURLから追加できます</DialogDescription>
              </DialogHeader>

              <Tabs
                value={registrationMode}
                onValueChange={(v) => setRegistrationMode(v as "location" | "url")}
                className="mt-2"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="location" className="gap-2">
                    <MapPin className="h-4 w-4" />
                    地域から検索
                  </TabsTrigger>
                  <TabsTrigger value="url" className="gap-2">
                    <Link2 className="h-4 w-4" />
                    URLから追加
                  </TabsTrigger>
                </TabsList>

                {/* 地域から検索タブ */}
                <TabsContent value="location" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      都道府県 <span className="text-destructive">*</span>
                    </Label>
                    <Select value={selectedPrefecture} onValueChange={handlePrefectureChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="都道府県を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREFECTURES.map((pref) => (
                          <SelectItem key={pref.code} value={pref.code}>
                            {pref.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">市区町村</Label>
                    <Select
                      value={selectedMunicipality}
                      onValueChange={setSelectedMunicipality}
                      disabled={!selectedPrefecture}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedPrefecture ? "市区町村を選択" : "先に都道府県を選択"} />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredMunicipalities.map((muni) => (
                          <SelectItem key={muni} value={muni}>
                            {muni}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      店舗名 <span className="text-destructive">*</span>
                    </Label>
                    <Popover open={isStorePopoverOpen} onOpenChange={setIsStorePopoverOpen}>
                      <PopoverTrigger asChild>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={selectedPrefecture ? "店舗名を入力（候補から選択可能）" : "先に都道府県を選択"}
                            value={storeNameQuery}
                            onChange={(e) => {
                              setStoreNameQuery(e.target.value)
                              setIsStorePopoverOpen(true)
                              setFetchedCompetitor(null)
                            }}
                            onFocus={() => selectedPrefecture && setIsStorePopoverOpen(true)}
                            disabled={!selectedPrefecture}
                            className="pl-10"
                          />
                        </div>
                      </PopoverTrigger>
                      {selectedPrefecture && suggestedStores.length > 0 && (
                        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                          <Command>
                            <CommandList>
                              <CommandGroup heading="候補店舗">
                                {suggestedStores.map((store) => (
                                  <CommandItem
                                    key={store.name}
                                    value={store.name}
                                    onSelect={() => handleStoreSelect(store)}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">{store.name}</span>
                                      <span className="text-xs text-muted-foreground">{store.municipality}</span>
                                    </div>
                                    {storeNameQuery === store.name && <Check className="ml-auto h-4 w-4" />}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      )}
                    </Popover>
                    {selectedPrefecture && storeNameQuery && !fetchedCompetitor && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 bg-transparent"
                        onClick={handleManualStoreConfirm}
                      >
                        「{storeNameQuery}」で登録
                      </Button>
                    )}
                  </div>
                </TabsContent>

                {/* URLから追加タブ */}
                <TabsContent value="url" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-url" className="text-sm font-medium">
                      店舗ページURL
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="store-url"
                          placeholder="https://kurumaerabi.com/shop/..."
                          value={competitorUrl}
                          onChange={(e) => {
                            setCompetitorUrl(e.target.value)
                          }}
                          className="pl-10"
                          disabled={isLoadingUrl}
                        />
                      </div>
                      <Button
                        onClick={handleUrlSubmit}
                        disabled={isLoadingUrl || !competitorUrl.trim()}
                        variant="secondary"
                      >
                        {isLoadingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : "取得"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    車選びドットコム等の店舗ページURLに対応しています
                  </p>
                </TabsContent>
              </Tabs>

              {/* 取得した店舗プレビュー */}
              {fetchedCompetitor && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{fetchedCompetitor.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{fetchedCompetitor.location}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>{fetchedCompetitor.distance}</span>
                      </div>
                      {fetchedCompetitor.url && (
                        <a
                          href={fetchedCompetitor.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          店舗ページを開く
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={handleAddFetchedCompetitor} disabled={!fetchedCompetitor}>
                  追加する
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Registered competitors list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {competitors.map((competitor, index) => (
          <div
            key={competitor.id}
            className={`
              relative flex items-center gap-3 p-3 rounded-lg border transition-all
              ${
                !hiddenCompetitors.includes(competitor.id)
                  ? "bg-background border-border shadow-sm"
                  : "bg-muted/30 border-transparent opacity-60"
              }
            `}
          >
            <button onClick={() => toggleCompetitorVisibility(competitor.id)} className="flex-shrink-0">
              <div
                className={`
                  w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
                  ${
                    !hiddenCompetitors.includes(competitor.id)
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  }
                `}
                style={{
                  borderColor: !hiddenCompetitors.includes(competitor.id)
                    ? COMPETITOR_COLORS[index % COMPETITOR_COLORS.length]
                    : undefined,
                  backgroundColor: !hiddenCompetitors.includes(competitor.id)
                    ? COMPETITOR_COLORS[index % COMPETITOR_COLORS.length]
                    : undefined,
                }}
              >
                {!hiddenCompetitors.includes(competitor.id) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-foreground truncate">{competitor.name}</span>
                {competitor.isOwnCompany && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    自社
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{competitor.region}</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{competitor.distance}</span>
              </div>
            </div>

            {!competitor.isOwnCompany && (
              <button
                onClick={() => handleRemoveCompetitor(competitor.id)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}

        {competitors.length < 5 && competitors.length > 0 && (
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-border/50 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">競合店を追加</span>
          </button>
        )}
      </div>

      {competitors.length === 1 && (
        <div className="text-center py-8 text-muted-foreground">
          <Store className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">競合店を追加して比較分析を始めましょう</p>
          <Button variant="outline" className="mt-3 bg-transparent" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            最初の競合店を追加
          </Button>
        </div>
      )}

      <Alert className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-xs text-amber-800 dark:text-amber-300">
          <strong className="text-amber-600 dark:text-amber-400">注記：</strong>
          表示される分析データは、お客様の指定したエリア・条件の公開情報を基にしたものです。取得したデータは貴社内での検討資料としてのみご利用ください。
        </AlertDescription>
      </Alert>

      {selectedCompetitors.length > 1 && visibleCompetitors.length > 0 && (
        <>
          {/* 現在のスナップショット比較 */}
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <h3 className="text-lg font-semibold mb-4 text-foreground">現在のスナップショット比較</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-muted-foreground">店舗名</TableHead>
                    <TableHead className="text-right text-muted-foreground">在庫台数</TableHead>
                    <TableHead className="text-right text-muted-foreground">在庫金額</TableHead>
                    <TableHead className="text-right text-muted-foreground">平均価格</TableHead>
                    <TableHead className="text-right text-muted-foreground">平均在庫日数</TableHead>
                    <TableHead className="text-right text-muted-foreground">回転率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSnapshot
                    .filter((row) => !hiddenCompetitors.includes(row.id))
                    .map((row, index) => {
                      const competitor = competitors.find((c) => c.id === row.id)
                      return (
                        <TableRow key={row.id} className="border-border/30">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    COMPETITOR_COLORS[selectedCompetitors.indexOf(row.id) % COMPETITOR_COLORS.length],
                                }}
                              />
                              <span className="text-foreground">{row.name}</span>
                              {competitor?.isOwnCompany && (
                                <Badge variant="secondary" className="text-xs">
                                  自社
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-foreground">{row.inventoryCount}台</TableCell>
                          <TableCell className="text-right text-foreground">
                            {(row.inventoryValue / 100000000).toFixed(1)}億円
                          </TableCell>
                          <TableCell className="text-right text-foreground">
                            {(row.avgPrice / 10000).toFixed(0)}万円
                          </TableCell>
                          <TableCell className="text-right text-foreground">{row.avgInventoryDays}日</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-foreground">{row.turnoverRate}</span>
                              {index === 0 ? (
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                              ) : row.turnoverRate > 7 ? (
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-rose-500" />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* タブによる詳細比較 */}
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-muted/50">
              <TabsTrigger value="inventory" className="data-[state=active]:bg-background">
                在庫構成
              </TabsTrigger>
              <TabsTrigger value="price" className="data-[state=active]:bg-background">
                価格分析
              </TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-background">
                トレンド
              </TabsTrigger>
              <TabsTrigger value="turnover" className="data-[state=active]:bg-background">
                入出庫
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-background">
                販売実績
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="mt-6">
              <div className="space-y-6">
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <h4 className="text-sm font-semibold mb-4 text-foreground">年式分布比較</h4>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={yearDistributionStacked.filter((d) =>
                          visibleCompetitors.some((id) => {
                            const comp = competitors.find((c) => c.id === id)
                            return comp?.name === d.name
                          }),
                        )}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          tickFormatter={(v) => `${v}%`}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={110}
                          tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                        {[
                          `${currentYear}年`,
                          `${currentYear - 1}年`,
                          `${currentYear - 2}年`,
                          `${currentYear - 3}年`,
                          `${currentYear - 4}年`,
                          `${currentYear - 5}年`,
                          `${currentYear - 6}年`,
                          `${currentYear - 7}年`,
                          "それ以前",
                        ].map((year, idx) => (
                          <Bar key={year} dataKey={year} stackId="a" fill={YEAR_COLORS[idx]} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                    <h4 className="text-sm font-semibold mb-4 text-foreground">メーカー比率比較</h4>
                    <div
                      className="grid gap-6"
                      style={{
                        gridTemplateColumns: `repeat(${Math.min(manufacturerData.length, 4)}, minmax(0, 1fr))`,
                      }}
                    >
                      {manufacturerData
                        .filter((compData) =>
                          competitors.find(
                            (c) =>
                              c.name === compData.name &&
                              (selectedCompetitors.includes(c.id) || c.isOwnCompany) &&
                              !hiddenCompetitors.includes(c.id),
                          ),
                        )
                        .slice(0, 4)
                        .map((compData) => (
                          <div key={compData.name} className="text-center">
                            <p className="text-xs font-medium mb-2 truncate text-foreground">{compData.name}</p>
                            <div className="h-[140px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={compData.data.map((item, index) => ({
                                      ...item,
                                      fill: PIE_COLORS[index % PIE_COLORS.length],
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={55}
                                    paddingAngle={2}
                                    dataKey="value"
                                  />
                                  <Tooltip
                                    formatter={(value: number) => [`${value}%`, ""]}
                                    contentStyle={{
                                      backgroundColor: "hsl(var(--card))",
                                      border: "1px solid hsl(var(--border))",
                                      borderRadius: "8px",
                                      color: "hsl(var(--foreground))",
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {manufacturerData[0]?.data.map((entry, idx) => (
                        <div key={entry.name} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                          <span className="text-xs text-muted-foreground">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                    <h4 className="text-sm font-semibold mb-4 text-foreground">車種タイプ分布</h4>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={vehicleTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                          <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              color: "hsl(var(--foreground))",
                            }}
                          />
                          <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                          {visibleCompetitors.map((id) => {
                            const comp = competitors.find((c) => c.id === id)
                            return (
                              <Bar
                                key={id}
                                dataKey={id}
                                name={comp?.name}
                                fill={COMPETITOR_COLORS[selectedCompetitors.indexOf(id) % COMPETITOR_COLORS.length]}
                              />
                            )
                          })}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                    <h4 className="text-sm font-semibold mb-4 text-foreground">国産車/輸入車比率</h4>
                    <div
                      className="grid gap-6"
                      style={{
                        gridTemplateColumns: `repeat(${Math.min(originData.length, 4)}, minmax(0, 1fr))`,
                      }}
                    >
                      {originData
                        .filter((compData) =>
                          competitors.find(
                            (c) =>
                              c.name === compData.name &&
                              (selectedCompetitors.includes(c.id) || c.isOwnCompany) &&
                              !hiddenCompetitors.includes(c.id),
                          ),
                        )
                        .slice(0, 4)
                        .map((compData) => (
                          <div key={compData.name} className="text-center">
                            <p className="text-xs font-medium mb-2 truncate text-foreground">{compData.name}</p>
                            <div className="h-[140px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={compData.data.map((item, index) => ({
                                      ...item,
                                      fill: PIE_COLORS[index % PIE_COLORS.length],
                                    }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={55}
                                    paddingAngle={2}
                                    dataKey="value"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                  />
                                  <Tooltip
                                    formatter={(value: number) => [`${value}%`, ""]}
                                    contentStyle={{
                                      backgroundColor: "hsl(var(--card))",
                                      border: "1px solid hsl(var(--border))",
                                      borderRadius: "8px",
                                      color: "hsl(var(--foreground))",
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {originData[0]?.data.map((entry, idx) => (
                        <div key={entry.name} className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                          <span className="text-xs text-muted-foreground">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="price" className="mt-6">
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h4 className="text-sm font-semibold mb-4 text-foreground">価格帯分布比較</h4>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={priceDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                      <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, ""]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--foreground))",
                        }}
                      />
                      <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                      {visibleCompetitors.map((id) => {
                        const comp = competitors.find((c) => c.id === id)
                        return (
                          <Bar
                            key={id}
                            dataKey={id}
                            name={comp?.name}
                            fill={COMPETITOR_COLORS[selectedCompetitors.indexOf(id) % COMPETITOR_COLORS.length]}
                          />
                        )
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="mt-6">
              <div className="flex justify-end mb-4">
                <Select
                  value={trendPeriodType}
                  onValueChange={(v) => setTrendPeriodType(v as "6months" | "12months" | "yearly")}
                >
                  <SelectTrigger className="w-[150px] bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">直近6ヶ月</SelectItem>
                    <SelectItem value="12months">直近12ヶ月</SelectItem>
                    <SelectItem value="yearly">年次推移</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <h4 className="text-sm font-semibold mb-4 text-foreground">在庫台数推移</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendPeriodType === "yearly" ? inventoryTrendYearly : inventoryTrend}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis
                          dataKey={trendPeriodType === "yearly" ? "year" : "month"}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                        {visibleCompetitors.map((id) => {
                          const comp = competitors.find((c) => c.id === id)
                          return (
                            <Line
                              key={id}
                              type="monotone"
                              dataKey={id}
                              name={comp?.name}
                              stroke={COMPETITOR_COLORS[selectedCompetitors.indexOf(id) % COMPETITOR_COLORS.length]}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          )
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <h4 className="text-sm font-semibold mb-4 text-foreground">平均在庫日数推移</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendPeriodType === "yearly" ? inventoryDaysTrendYearly : inventoryDaysTrend}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis
                          dataKey={trendPeriodType === "yearly" ? "year" : "month"}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          formatter={(value: number) => [`${value}日`, ""]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                        {visibleCompetitors.map((id) => {
                          const comp = competitors.find((c) => c.id === id)
                          return (
                            <Line
                              key={id}
                              type="monotone"
                              dataKey={id}
                              name={comp?.name}
                              stroke={COMPETITOR_COLORS[selectedCompetitors.indexOf(id) % COMPETITOR_COLORS.length]}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          )
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <h4 className="text-sm font-semibold mb-4 text-foreground">在庫金額推移（百万円）</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={trendPeriodType === "yearly" ? inventoryValueTrendYearly : inventoryValueTrend}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis
                          dataKey={trendPeriodType === "yearly" ? "year" : "month"}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          formatter={(value: number) => [`${value}百万円`, ""]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                        {visibleCompetitors.map((id) => {
                          const comp = competitors.find((c) => c.id === id)
                          return (
                            <Line
                              key={id}
                              type="monotone"
                              dataKey={id}
                              name={comp?.name}
                              stroke={COMPETITOR_COLORS[selectedCompetitors.indexOf(id) % COMPETITOR_COLORS.length]}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          )
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="turnover" className="mt-6">
              <div className="flex justify-end mb-4">
                <Select
                  value={turnoverPeriod}
                  onValueChange={(v) => setTurnoverPeriod(v as "6months" | "1year" | "5years")}
                >
                  <SelectTrigger className="w-[150px] bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">直近6ヶ月</SelectItem>
                    <SelectItem value="1year">直近1年</SelectItem>
                    <SelectItem value="5years">直近5年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <h4 className="text-sm font-semibold mb-4 text-foreground">入出庫サマリー（期間累計）</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={turnoverComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                        {visibleCompetitors.map((id) => {
                          const comp = competitors.find((c) => c.id === id)
                          return (
                            <Bar
                              key={id}
                              dataKey={id}
                              name={comp?.name}
                              fill={COMPETITOR_COLORS[selectedCompetitors.indexOf(id) % COMPETITOR_COLORS.length]}
                            />
                          )
                        })}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <h4 className="text-sm font-semibold mb-4 text-foreground">新規入庫推移</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getTurnoverTrendData().data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis
                          dataKey={getTurnoverTrendData().xKey}
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          formatter={(value: { newArrivals: number }) => {
                            if (typeof value === "object" && value.newArrivals !== undefined) {
                              return [`${value.newArrivals}台`, "新規入庫"]
                            }
                            return [value, ""]
                          }}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                        {visibleCompetitors.map((id) => {
                          const comp = competitors.find((c) => c.id === id)
                          return (
                            <Line
                              key={id}
                              type="monotone"
                              dataKey={(d) => d[id]?.newArrivals}
                              name={comp?.name}
                              stroke={COMPETITOR_COLORS[selectedCompetitors.indexOf(id) % COMPETITOR_COLORS.length]}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          )
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">販売実績推移</h3>
                <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                  <button
                    onClick={() => setTrendPeriodType("6months")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      trendPeriodType === "6months"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    6か月推移
                  </button>
                  <button
                    onClick={() => setTrendPeriodType("12months")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      trendPeriodType === "12months"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    1年推移（月次）
                  </button>
                  <button
                    onClick={() => setTrendPeriodType("yearly")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      trendPeriodType === "yearly"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    年次推移
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <h4 className="text-sm font-semibold mb-4 text-foreground">販売台数推移</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getSalesVolumeData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey={getXAxisDataKey()} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          formatter={(value: number) => [`${value}台`, ""]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                        {visibleCompetitors.map((id) => {
                          const comp = competitors.find((c) => c.id === id)
                          return (
                            <Line
                              key={id}
                              type="monotone"
                              dataKey={id}
                              name={comp?.name}
                              stroke={COMPETITOR_COLORS[selectedCompetitors.indexOf(id) % COMPETITOR_COLORS.length]}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          )
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <h4 className="text-sm font-semibold mb-4 text-foreground">売上推移（万円）</h4>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getRevenueData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis dataKey={getXAxisDataKey()} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          formatter={(value: number) => [`${value.toLocaleString()}万円`, ""]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--foreground))",
                          }}
                        />
                        <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                        {visibleCompetitors.map((id) => {
                          const comp = competitors.find((c) => c.id === id)
                          return (
                            <Line
                              key={id}
                              type="monotone"
                              dataKey={id}
                              name={comp?.name}
                              stroke={COMPETITOR_COLORS[selectedCompetitors.indexOf(id) % COMPETITOR_COLORS.length]}
                              strokeWidth={2}
                              dot={{ r: 4 }}
                            />
                          )
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

    </div>
  )
}
