// Deterministic seeded random to avoid SSR/client hydration mismatch
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// 広域エリア定義（プライバシー保護のため都道府県ではなく広域エリア）
export const REGIONS = [
  { id: "kanto", name: "関東エリア", prefectures: ["東京都", "神奈川県", "千葉県", "埼玉県", "茨城県", "栃木県", "群馬県"] },
  { id: "tokai", name: "東海エリア", prefectures: ["愛知県", "静岡県", "岐阜県", "三重県"] },
  { id: "kansai", name: "関西エリア", prefectures: ["大阪府", "兵庫県", "京都府", "奈良県", "滋賀県", "和歌山県"] },
  { id: "hokkaido", name: "北海道エリア", prefectures: ["北海道"] },
  { id: "tohoku", name: "東北エリア", prefectures: ["宮城県", "福島県", "岩手県", "青森県", "秋田県", "山形県"] },
  { id: "hokuriku", name: "北陸・甲信越エリア", prefectures: ["新潟県", "長野県", "富山県", "石川県", "福井県", "山梨県"] },
  { id: "chugoku", name: "中国エリア", prefectures: ["広島県", "岡山県", "山口県", "島根県", "鳥取県"] },
  { id: "shikoku", name: "四国エリア", prefectures: ["香川県", "愛媛県", "徳島県", "高知県"] },
  { id: "kyushu", name: "九州・沖縄エリア", prefectures: ["福岡県", "熊本県", "鹿児島県", "長崎県", "大分県", "宮崎県", "佐賀県", "沖縄県"] },
] as const

export type RegionId = typeof REGIONS[number]["id"]

export const ALL_REGIONS = ["all", ...REGIONS.map(r => r.id)] as const

// メーカー・車種データ
export const MANUFACTURERS = [
  "トヨタ",
  "ホンダ",
  "日産",
  "マツダ",
  "スバル",
  "三菱",
  "スズキ",
  "ダイハツ",
  "レクサス",
  "BMW",
  "メルセデス・ベンツ",
  "アウディ",
] as const

export type Manufacturer = typeof MANUFACTURERS[number]

export const VEHICLE_MODELS: Record<Manufacturer, { name: string; grades: string[] }[]> = {
  "トヨタ": [
    { name: "アルファード", grades: ["2.5S Cパッケージ", "2.5S", "2.5X", "エグゼクティブラウンジ", "S Aパッケージ"] },
    { name: "ハリアー", grades: ["Z レザーパッケージ", "Z", "G", "S"] },
    { name: "プリウス", grades: ["Z", "G", "X", "U"] },
    { name: "ランドクルーザー", grades: ["ZX", "GR SPORT", "VX", "AX"] },
    { name: "クラウン", grades: ["RS アドバンスト", "RS", "G アドバンスト", "G"] },
    { name: "ヴォクシー", grades: ["S-Z", "S-G", "ハイブリッドS-Z"] },
  ],
  "ホンダ": [
    { name: "ヴェゼル", grades: ["e:HEV Z", "e:HEV X", "G", "X"] },
    { name: "ステップワゴン", grades: ["スパーダ プレミアムライン", "スパーダ", "エアー"] },
    { name: "フリード", grades: ["CROSSTAR", "G", "B"] },
    { name: "N-BOX", grades: ["カスタム L ターボ", "カスタム L", "L"] },
  ],
  "日産": [
    { name: "セレナ", grades: ["e-POWER ルキシオン", "e-POWER ハイウェイスターV", "ハイウェイスターV"] },
    { name: "エクストレイル", grades: ["X e-4ORCE", "G e-4ORCE", "X"] },
    { name: "ノート", grades: ["e-POWER オーラ", "e-POWER X", "X"] },
  ],
  "マツダ": [
    { name: "CX-5", grades: ["XD エクスクルーシブモード", "XD Lパッケージ", "XD プロアクティブ", "20S"] },
    { name: "CX-8", grades: ["XD Lパッケージ", "XD プロアクティブ", "25S"] },
    { name: "MAZDA3", grades: ["ファストバック XD Lパッケージ", "セダン 20S", "ファストバック 20S"] },
  ],
  "スバル": [
    { name: "フォレスター", grades: ["STI Sport", "アドバンス", "ツーリング"] },
    { name: "レヴォーグ", grades: ["STI Sport R", "GT-H", "GT"] },
    { name: "アウトバック", grades: ["リミテッド EX", "X-BREAK EX"] },
  ],
  "三菱": [
    { name: "アウトランダー", grades: ["P", "G", "M"] },
    { name: "デリカD:5", grades: ["P", "G パワーパッケージ", "M"] },
  ],
  "スズキ": [
    { name: "ジムニー", grades: ["XC", "XL", "XG"] },
    { name: "スイフト", grades: ["スポーツ", "ハイブリッドMZ", "ハイブリッドMG"] },
    { name: "ハスラー", grades: ["Jスタイル", "ハイブリッドX", "ハイブリッドG"] },
  ],
  "ダイハツ": [
    { name: "タント", grades: ["カスタムRS", "カスタムX", "X"] },
    { name: "ロッキー", grades: ["プレミアム", "X"] },
  ],
  "レクサス": [
    { name: "NX", grades: ["450h+ Fスポーツ", "350h Fスポーツ", "250"] },
    { name: "RX", grades: ["500h Fスポーツ パフォーマンス", "450h+", "350h"] },
    { name: "LX", grades: ["600 エグゼクティブ", "600 オフロード"] },
  ],
  "BMW": [
    { name: "3シリーズ", grades: ["M340i xDrive", "320d xDrive", "320i"] },
    { name: "X3", grades: ["M40i", "xDrive20d", "xDrive20i"] },
    { name: "X5", grades: ["M60i", "xDrive40d", "xDrive35d"] },
  ],
  "メルセデス・ベンツ": [
    { name: "Cクラス", grades: ["C300 AMGライン", "C200 アバンギャルド", "C180"] },
    { name: "Eクラス", grades: ["E300 AMGライン", "E200 アバンギャルド"] },
    { name: "GLC", grades: ["GLC300 4MATIC", "GLC200 スポーツ"] },
  ],
  "アウディ": [
    { name: "A4", grades: ["45 TFSI クワトロ Sライン", "40 TFSI Sライン", "35 TFSI"] },
    { name: "Q5", grades: ["55 TFSI e クワトロ", "45 TFSI クワトロ", "40 TDI クワトロ"] },
  ],
}

// 小売実績データの型定義
export interface RetailSalesRecord {
  id: string
  manufacturer: Manufacturer
  model: string
  grade: string
  year: number
  mileage: number
  color: string
  region: RegionId
  soldPrice: number
  listingDays: number
  soldDate: string
}

// オークション落札データの型定義
export interface AuctionRecord {
  id: string
  manufacturer: Manufacturer
  model: string
  modelCode: string // 型式
  grade: string
  year: number
  mileage: number
  color: string
  hasInspection: boolean // 車検有無
  region: RegionId
  auctionPrice: number
  auctionDate: string
  auctionName: string
}

// 業販価格計算（オークション価格 × 1.1 + 15,000円）
export function calculateWholesalePrice(auctionPrice: number): number {
  return Math.round(auctionPrice * 1.1 + 15000)
}

// 小売実績集計データの型定義
export interface RetailSalesSummary {
  manufacturer: Manufacturer
  model: string
  grade: string
  yearRange: string
  avgPrice: number
  minPrice: number
  maxPrice: number
  totalSales: number
  avgListingDays: number
  region: RegionId
}

// 業販価格集計データの型定義
export interface WholesalePriceSummary {
  manufacturer: Manufacturer
  model: string
  modelCode: string // 型式
  grade: string
  color: string // 色
  year: number // 年式（単一）
  hasInspection: boolean // 車検有無
  avgAuctionPrice: number
  calculatedWholesalePrice: number
  region: RegionId
}

// カラーリスト
const COLORS = [
  "ホワイトパール",
  "ブラック",
  "シルバー",
  "ダークブルー",
  "レッド",
  "グレー",
  "ブラウン",
  "ホワイト",
  "ブルー",
]

// オークション会場名
const AUCTION_NAMES = [
  "USS東京",
  "USS横浜",
  "USS名古屋",
  "USS大阪",
  "USS福岡",
  "HAA神戸",
  "TAA関東",
  "JU東京",
  "JU愛知",
]

// 型式コードマッピング
const MODEL_CODES: Record<string, string> = {
  "アルファード": "AGH30W",
  "ハリアー": "MXUA80",
  "プリウス": "ZVW50",
  "ランドクルーザー": "VJA300W",
  "クラウン": "AZSH20",
  "ヴォクシー": "ZWR90W",
  "ヴェゼル": "RV5",
  "ステップワゴン": "RP8",
  "フリード": "GB7",
  "N-BOX": "JF5",
  "セレナ": "C28",
  "エクストレイル": "T33",
  "ノート": "E13",
  "CX-5": "KF5P",
  "CX-8": "KG5P",
  "MAZDA3": "BP8P",
  "フォレスター": "SK9",
  "レヴォーグ": "VN5",
  "アウトバック": "BT5",
  "アウトランダー": "GN0W",
  "デリカD:5": "CV1W",
  "ジムニー": "JB64W",
  "スイフト": "ZC33S",
  "ハスラー": "MR52S",
  "タント": "LA650S",
  "ロッキー": "A200S",
  "NX": "AAZH26",
  "RX": "AALH16",
  "LX": "VJA310W",
  "3シリーズ": "G20",
  "X3": "G01",
  "X5": "G05",
  "Cクラス": "W206",
  "Eクラス": "W214",
  "GLC": "X254",
  "A4": "8W",
  "Q5": "FY",
}

// 小売実績データ生成
function generateRetailSalesData(): RetailSalesRecord[] {
  const rand = seededRandom(123)
  const records: RetailSalesRecord[] = []
  let idCounter = 1

  for (const manufacturer of MANUFACTURERS) {
    const models = VEHICLE_MODELS[manufacturer]
    for (const modelData of models) {
      for (const grade of modelData.grades) {
        // 各グレードにつき複数のエリアでデータを生成
        const numRecords = Math.floor(rand() * 8) + 3
        for (let i = 0; i < numRecords; i++) {
          const year = 2019 + Math.floor(rand() * 6) // 2019-2024
          const basePrice = getBasePrice(manufacturer, modelData.name, grade, year, rand)
          const priceVariation = (rand() - 0.5) * basePrice * 0.15
          const soldPrice = Math.round((basePrice + priceVariation) / 10000) * 10000

          records.push({
            id: `RS${String(idCounter++).padStart(5, "0")}`,
            manufacturer,
            model: modelData.name,
            grade,
            year,
            mileage: Math.floor(rand() * 80000) + 5000,
            color: COLORS[Math.floor(rand() * COLORS.length)],
            region: REGIONS[Math.floor(rand() * REGIONS.length)].id,
            soldPrice,
            listingDays: Math.floor(rand() * 60) + 5,
            soldDate: generateRandomDate(rand),
          })
        }
      }
    }
  }

  return records
}

// オークション落札データ生成
function generateAuctionData(): AuctionRecord[] {
  const rand = seededRandom(456)
  const records: AuctionRecord[] = []
  let idCounter = 1

  for (const manufacturer of MANUFACTURERS) {
    const models = VEHICLE_MODELS[manufacturer]
    for (const modelData of models) {
      for (const grade of modelData.grades) {
        const numRecords = Math.floor(rand() * 6) + 2
        for (let i = 0; i < numRecords; i++) {
          const year = 2019 + Math.floor(rand() * 6)
          const basePrice = getBasePrice(manufacturer, modelData.name, grade, year, rand)
          // オークション価格は小売価格より10-20%低い
          const auctionPrice = Math.round((basePrice * (0.75 + rand() * 0.1)) / 10000) * 10000

          records.push({
            id: `AU${String(idCounter++).padStart(5, "0")}`,
            manufacturer,
            model: modelData.name,
            modelCode: MODEL_CODES[modelData.name] || "不明",
            grade,
            year,
            mileage: Math.floor(rand() * 80000) + 5000,
            color: COLORS[Math.floor(rand() * COLORS.length)],
            hasInspection: rand() > 0.3, // 70%の確率で車検あり
            region: REGIONS[Math.floor(rand() * REGIONS.length)].id,
            auctionPrice,
            auctionDate: generateRandomDate(rand),
            auctionName: AUCTION_NAMES[Math.floor(rand() * AUCTION_NAMES.length)],
          })
        }
      }
    }
  }

  return records
}

// ��ース価格の計算（メーカー・車種・グレード・年式に基づく）
function getBasePrice(manufacturer: Manufacturer, model: string, grade: string, year: number, rand: () => number): number {
  // メーカー係数
  const manufacturerMultiplier: Record<string, number> = {
    "トヨタ": 1.0,
    "ホンダ": 0.95,
    "日産": 0.9,
    "マツダ": 0.85,
    "スバル": 0.9,
    "三菱": 0.85,
    "スズキ": 0.7,
    "ダイハツ": 0.65,
    "レクサス": 1.5,
    "BMW": 1.3,
    "メルセデス・ベンツ": 1.4,
    "アウディ": 1.25,
  }

  // 車種ベース価格
  const modelBasePrices: Record<string, number> = {
    "アルファード": 4500000,
    "ハリアー": 3800000,
    "プリウス": 3200000,
    "ランドクルーザー": 7500000,
    "クラウン": 4200000,
    "ヴォクシー": 3000000,
    "ヴェゼル": 2800000,
    "ステップワゴン": 3200000,
    "フリード": 2500000,
    "N-BOX": 1800000,
    "セレナ": 3200000,
    "エクストレイル": 3500000,
    "ノート": 2200000,
    "CX-5": 3000000,
    "CX-8": 3500000,
    "MAZDA3": 2800000,
    "フォレスター": 3200000,
    "レヴォーグ": 3500000,
    "アウトバック": 4000000,
    "アウトランダー": 4500000,
    "デリカD:5": 4000000,
    "ジムニー": 2000000,
    "スイフト": 1800000,
    "ハスラー": 1500000,
    "タント": 1500000,
    "ロッキー": 2000000,
    "NX": 5500000,
    "RX": 7500000,
    "LX": 12000000,
    "3シリーズ": 5000000,
    "X3": 6500000,
    "X5": 9500000,
    "Cクラス": 5500000,
    "Eクラス": 7500000,
    "GLC": 7000000,
    "A4": 5000000,
    "Q5": 6500000,
  }

  // グレード係数（上位グレードほど高い）
  const gradeIndex = VEHICLE_MODELS[manufacturer].find(m => m.name === model)?.grades.indexOf(grade) ?? 0
  const gradeMultiplier = 1.0 - gradeIndex * 0.08

  // 年式係数（1年につき5-8%減価）
  const yearDepreciation = (2024 - year) * (0.05 + rand() * 0.03)

  const basePrice = modelBasePrices[model] || 3000000
  const finalPrice = basePrice * (manufacturerMultiplier[manufacturer] || 1.0) * gradeMultiplier * (1 - yearDepreciation)

  return Math.max(500000, finalPrice)
}

// ランダム日付生成（過去1年以内）
function generateRandomDate(rand: () => number): string {
  const now = new Date()
  const daysAgo = Math.floor(rand() * 365)
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  return date.toISOString().split("T")[0]
}

// 小売実績を集計
export function aggregateRetailSales(
  records: RetailSalesRecord[],
  filters: {
    manufacturer?: Manufacturer
    model?: string
    region?: RegionId
  }
): RetailSalesSummary[] {
  let filtered = [...records]

  if (filters.manufacturer) {
    filtered = filtered.filter(r => r.manufacturer === filters.manufacturer)
  }
  if (filters.model) {
    filtered = filtered.filter(r => r.model === filters.model)
  }
  if (filters.region) {
    filtered = filtered.filter(r => r.region === filters.region)
  }

  // グループ化キー: manufacturer + model + grade + region
  const groups = new Map<string, RetailSalesRecord[]>()
  for (const record of filtered) {
    const key = `${record.manufacturer}|${record.model}|${record.grade}|${record.region}`
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(record)
  }

  const summaries: RetailSalesSummary[] = []
  for (const [key, group] of groups) {
    const [manufacturer, model, grade, region] = key.split("|")
    const years = group.map(r => r.year)
    const minYear = Math.min(...years)
    const maxYear = Math.max(...years)
    const prices = group.map(r => r.soldPrice)
    const listingDays = group.map(r => r.listingDays)

    summaries.push({
      manufacturer: manufacturer as Manufacturer,
      model,
      grade,
      yearRange: minYear === maxYear ? `${minYear}年` : `${minYear}-${maxYear}年`,
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      totalSales: group.length,
      avgListingDays: Math.round(listingDays.reduce((a, b) => a + b, 0) / listingDays.length),
      region: region as RegionId,
    })
  }

  return summaries.sort((a, b) => b.totalSales - a.totalSales)
}

// オークションデータから業販価格を集計（各レコードを個別の車両として扱う）
export function aggregateWholesalePrices(
  records: AuctionRecord[],
  filters: {
    manufacturer?: Manufacturer
    model?: string
    region?: RegionId
  }
): WholesalePriceSummary[] {
  let filtered = [...records]

  if (filters.manufacturer) {
    filtered = filtered.filter(r => r.manufacturer === filters.manufacturer)
  }
  if (filters.model) {
    filtered = filtered.filter(r => r.model === filters.model)
  }
  if (filters.region) {
    filtered = filtered.filter(r => r.region === filters.region)
  }

  // 各レコードを個別の車両として扱う
  const summaries: WholesalePriceSummary[] = filtered.map(record => ({
    manufacturer: record.manufacturer,
    model: record.model,
    modelCode: record.modelCode,
    grade: record.grade,
    color: record.color,
    year: record.year,
    hasInspection: record.hasInspection,
    avgAuctionPrice: record.auctionPrice,
    calculatedWholesalePrice: calculateWholesalePrice(record.auctionPrice),
    region: record.region,
  }))

  return summaries.sort((a, b) => b.calculatedWholesalePrice - a.calculatedWholesalePrice)
}

// エクスポートするデータセット
export const retailSalesData = generateRetailSalesData()
export const auctionData = generateAuctionData()

// ユーティリティ: 地域名を取得
export function getRegionName(regionId: RegionId): string {
  return REGIONS.find(r => r.id === regionId)?.name ?? regionId
}

// ユーティリティ: 車種リストを取得
export function getModelsForManufacturer(manufacturer: Manufacturer): string[] {
  return VEHICLE_MODELS[manufacturer]?.map(m => m.name) ?? []
}

// ユーティリティ: グレードリストを取得
export function getGradesForModel(manufacturer: Manufacturer, model: string): string[] {
  return VEHICLE_MODELS[manufacturer]?.find(m => m.name === model)?.grades ?? []
}

// 価格フォーマット
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return "¥---"
  }
  return `¥${price.toLocaleString()}`
}

// 万円フォーマット
export function formatPriceInMan(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return "---万円"
  }
  return `${Math.round(price / 10000)}万円`
}
