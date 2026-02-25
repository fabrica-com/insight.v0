// Deterministic seeded random to avoid SSR/client hydration mismatch
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export interface StoreData {
  id: number
  name: string
  prefecture: string
  revenue: number
  salesVolume: number
  avgInventory: number
  turnoverRate: string
  inventoryDays: number
  change: number
}

const storeNames = [
  "カーセレクト東京",
  "オートギャラリー横浜",
  "ドリームモータース大阪",
  "プレミアムカーズ名古屋",
  "スピードオート福岡",
  "北海道カーセンター",
  "千葉モーターズ",
  "埼玉オートプラザ",
  "東京ベストカー",
  "横浜カーズ",
  "大阪プレミアム",
  "名古屋オートマーケット",
  "福岡カーステーション",
  "札幌モータース",
  "千葉カーワールド",
  "埼玉オートギャラリー",
  "銀座カーセレクト",
  "みなとみらいオート",
  "梅田カーズ",
  "栄モータース",
]

const prefectures = ["東京都", "神奈川県", "大阪府", "愛知県", "福岡県", "北海道", "千葉県", "埼玉県"]

export const allPrefectures = ["すべて", ...prefectures]

function generateStoreData(): StoreData[] {
  const rand = seededRandom(42)
  return storeNames.map((name, idx) => ({
    id: idx + 1,
    name,
    prefecture: prefectures[idx % prefectures.length],
    revenue: Math.floor(rand() * 500000000) + 50000000,
    salesVolume: Math.floor(rand() * 300) + 20,
    avgInventory: Math.floor(rand() * 150) + 10,
    turnoverRate: (rand() * 10 + 2).toFixed(1),
    inventoryDays: Math.floor(rand() * 60) + 15,
    change: Math.floor(rand() * 20) - 10,
  }))
}

export const allStores = generateStoreData()

export function getStoreById(id: number): StoreData | undefined {
  return allStores.find((s) => s.id === id)
}
