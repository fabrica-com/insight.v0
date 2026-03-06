"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Newspaper,
  ExternalLink,
  Sparkles,
  Send,
  Bot,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  TrendingUp,
  Car,
  Factory,
  Zap,
  Globe,
  ShieldCheck,
  Calendar,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

// -- Types --
interface NewsItem {
  id: string
  title: string
  source: string
  url: string
  category: string
  publishedAt: string
  summary: string
  detailedSummary: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// -- Category config --
const categoryConfig: Record<string, { label: string; icon: typeof Car; className: string }> = {
  market: { label: "市場動向", icon: TrendingUp, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  maker: { label: "メーカー", icon: Factory, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  ev: { label: "EV・電動化", icon: Zap, className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  used: { label: "中古車", icon: Car, className: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
  regulation: { label: "規制・法改正", icon: ShieldCheck, className: "bg-red-500/10 text-red-600 border-red-500/20" },
  global: { label: "海外", icon: Globe, className: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" },
}

// -- Date helpers --
const formatDate = (d: Date) => {
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`
}

const todayStr = () => formatDate(new Date())

const getDaysAgo = (days: number) => {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return formatDate(d)
}

const isWithinDays = (dateStr: string, days: number) => {
  const [y, m, d] = dateStr.split("/").map(Number)
  const newsDate = new Date(y, m - 1, d)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  cutoff.setHours(0, 0, 0, 0)
  return newsDate >= cutoff
}

// -- Sample news data with past month --
const generateNewsData = (): NewsItem[] => {
  return [
    // Today
    { id: "1", title: "トヨタ、2026年度の国内生産計画を上方修正 SUV需要が牽引", source: "日本経済新聞", url: "https://www.nikkei.com/", category: "maker", publishedAt: getDaysAgo(0), summary: "トヨタ自動車は2026年度の国内生産計画を当初比5%上方修正。SUVモデルの好調な受注が背景。", detailedSummary: "トヨタ自動車は5日、2026年度の国内生産計画を当初比5%上方修正すると発表した。主力のSUVモデル「RAV4」「ハリアー」への受注が好調なことが背景にある。\n\n同社の佐藤恒治社長は「半導体不足の解消と生産効率の改善により、お客様のご期待に応えられる体制が整ってきた」とコメント。愛知県内の主力工場では、年間生産能力を約10万台増強する見通し。\n\n【中古車販売店への影響】\n新車の納期短縮により、中古車への代替需要は一時的に落ち着く可能性があります。一方で、下取り車両の増加により仕入れ環境は改善が見込まれます。特にトヨタSUV系の在庫戦略を見直す好機と言えるでしょう。" },
    { id: "2", title: "中古車オークション相場、3月は高級セダンが下落傾向に", source: "Response", url: "https://response.jp/", category: "used", publishedAt: getDaysAgo(0), summary: "USS調べでは3月の中古車オークション相場で高級セダンが前月比2.3%下落。SUV・ミニバンは横ばい。", detailedSummary: "中古車オークション大手のUSSが発表した3月の相場動向によると、高級セダン（クラウン、マークX、フーガなど）の落札価格が前月比2.3%下落した。一方、SUVとミニバンは横ばいを維持している。\n\n下落の背景には、法人需要の減少とセダン離れの継続がある。特に5年以上経過した高級セダンは、維持費の高さから敬遠される傾向が強まっている。\n\n【カテゴリ別動向】\n・高級セダン：-2.3%\n・コンパクトカー：+0.8%\n・SUV：+0.2%\n・ミニバン：-0.1%\n・軽自動車：+1.5%\n\n【仕入れ戦略への示唆】\n高級セダンの仕入れ価格に下落余地がある今、程度の良い個体を選別して仕入れる好機かもしれません。ただし、在庫回転率には注意が必要です。" },
    { id: "3", title: "日産・ホンダ統合会社、EV専用プラットフォーム共同開発を正式発表", source: "日刊自動車新聞", url: "https://www.netdenjd.com/", category: "ev", publishedAt: getDaysAgo(0), summary: "日産とホンダの統合新会社がEV専用プラットフォームの共同開発を正式に発表。2028年の市場投入を目指す。", detailedSummary: "日産自動車とホンダが設立した統合新会社「NH Alliance」は5日、次世代EV専用プラットフォームの共同開発を正式に発表した。2028年の市場投入を目指し、開発投資は約1兆円規模となる見通し。\n\n新プラットフォームは、軽自動車からSUVまで幅広い車種に対応可能なモジュール構造を採用。バッテリー容量は40kWhから100kWhまでスケーラブルに対応し、航続距離は最大600kmを目標としている。\n\n【技術的特徴】\n・800V高電圧アーキテクチャ採用\n・全固体電池への将来対応を考慮した設計\n・OTA（Over-The-Air）による継続的なソフトウェア更新\n\n【中古車市場への影響】\n2028年以降、両社の新世代EVが市場に登場することで、現行EVの中古車価格に影響が出る可能性があります。EV中古車の在庫管理には、技術世代の違いを意識した戦略が重要になってきます。" },
    // 1 day ago
    { id: "4", title: "自動車保険料、2026年4月から平均3.5%引き上げへ", source: "朝日新聞", url: "https://www.asahi.com/", category: "regulation", publishedAt: getDaysAgo(1), summary: "損害保険各社は自動車保険料を4月から平均3.5%引き上げ。修理費の高騰と事故率の上昇が要因。", detailedSummary: "損害保険大手各社は、自動車保険料を2026年4月から平均3.5%引き上げると発表した。引き上げは2年連続となる。\n\n【値上げの主な要因】\n1. 修理費の高騰：先進安全装備（ADAS）搭載車の修理費が従来車の1.5〜2倍に\n2. 部品価格の上昇：半導体を含む電子部品の価格高騰が継続\n3. 事故率の微増：コロナ禍後の交通量回復に伴う事故件数の増加\n\n【保険会社別の引き上げ率】\n・東京海上日動：+3.8%\n・損保ジャパン：+3.5%\n・三井住友海上：+3.3%\n・あいおいニッセイ同和：+3.2%\n\n【中古車販売への影響】\nお客様の車両維持コストが増加するため、購入時の総支払額説明がより重要になります。また、修理費が高くなりやすいADAS搭載車については、保険料への影響を事前に説明することでクレーム予防につながります。" },
    { id: "5", title: "テスラ、日本市場向け新型コンパクトSUVを年内投入か", source: "Bloomberg", url: "https://www.bloomberg.co.jp/", category: "global", publishedAt: getDaysAgo(1), summary: "テスラが日本市場向けにコンパクトSUVの新型モデルを年内に投入する計画が明らかに。価格は400万円台を想定。", detailedSummary: "米テスラが日本市場向けにコンパクトSUVの新型モデル「Model Q（仮称）」を年内に投入する計画が、関係者への取材で明らかになった。価格は補助金適用前で450万円前後を想定している。\n\n【予想されるスペック】\n・バッテリー容量：55kWh\n・航続距離：約400km（WLTC）\n・全長：約4,400mm（Model Yより約250mm短い）\n・駆動方式：RWD（後輪駆動）\n\n日本市場では、BYDやヒョンデなど海外メーカーのEV攻勢が続いており、テスラとしても価格帯を下げた車種で対抗する狙いがある。\n\n【中古車市場への示唆】\n新型投入により、現行Model 3やModel Yの中古車価格に下押し圧力がかかる可能性があります。テスラ中古車を扱う場合は、新型の発表タイミングを意識した価格設定が重要です。" },
    // 2 days ago
    { id: "6", title: "中古車販売大手ビッグモーター後継会社、再建計画の進捗を公開", source: "東洋経済", url: "https://toyokeizai.net/", category: "used", publishedAt: getDaysAgo(2), summary: "ビッグモーター後継のWECARSが再建計画の進捗状況を発表。店舗数の最適化と信頼回復策を進める。", detailedSummary: "ビッグモーター後継のWECARS株式会社は、再建計画の進捗状況を公開した。店舗数は不正発覚前の250店舗から現在140店舗に縮小しており、2026年度末までに120店舗体制を目指す。\n\n【再建計画の主なポイント】\n1. 店舗最適化：不採算店舗の閉鎖と主要エリアへの集中\n2. 人材刷新：経営陣の完全刷新と従業員研修の強化\n3. コンプライアンス体制：第三者委員会の常設と内部通報制度の整備\n4. 顧客対応：過去の不正被害者への補償プログラム継続\n\n【業界への影響】\n同社の縮小により、年間約15万台の取扱台数が市場から減少。中小販売店にとっては商機拡大のチャンスとも言える。一方、業界全体の信頼回復には引き続き各社の透明性ある経営が求められる。" },
    { id: "7", title: "スバル、新型レヴォーグにアイサイトX最新版を搭載", source: "Car Watch", url: "https://car.watch.impress.co.jp/", category: "maker", publishedAt: getDaysAgo(2), summary: "スバルは新型レヴォーグのマイナーチェンジモデルにアイサイトXの最新版を搭載すると発表。", detailedSummary: "スバルは、レヴォーグのマイナーチェンジモデルを発表し、運転支援システム「アイサイトX」の最新版（Ver.2）を搭載すると発表した。発売は2026年5月を予定。\n\n【アイサイトX Ver.2の新機能】\n・交差点での右左折支援機能\n・渋滞時ハンズオフ走行の対応速度を50km/hから65km/hに拡大\n・緊急時の自動路肩退避機能\n・AIによる歩行者の動き予測精度向上\n\n【価格帯】\n・GT：363万円（+8万円）\n・GT-H：396万円（+8万円）\n・STI Sport：440万円（+10万円）\n\n【中古車市場への影響】\n旧型レヴォーグの買い替え需要が増加する可能性があり、下取り・買取りの問い合わせ増加が見込まれます。アイサイトのバージョン違いが中古車価格に影響を与えるため、査定時の確認ポイントとして重要です。" },
    // 3-4 days ago
    { id: "8", title: "国交省、2026年度の自動車関連税制の改正案を公表", source: "日本経済新聞", url: "https://www.nikkei.com/", category: "regulation", publishedAt: getDaysAgo(3), summary: "国土交通省は2026年度自動車関連税制の改正案を公表。環境性能割の基準見直しが盛り込まれた。", detailedSummary: "国土交通省は2026年度の自動車関連税制の改正案を公表した。環境性能割の基準見直しとエコカー減税の延長が主な内容となっている。\n\n【改正の主なポイント】\n1. 環境性能割\n・非課税対象をEV・PHEVに限定（従来のHVは1%課税に）\n・燃費基準達成度による段階的課税を強化\n\n2. エコカー減税\n・2027年4月まで2年延長\n・ただし、減税対象の燃費基準を5%引き上げ\n\n3. 自動車税（種別割）\n・13年超の重課税率を15%から18%に引き上げ\n\n【中古車販売への影響】\n13年超車両の税負担増により、該当車両の販売価格への圧力が強まる可能性があります。また、HVの環境性能割課税により、HV中古車の需要に変化が生じる可能性も。税制変更のタイミングに合わせた在庫調整を検討してください。" },
    { id: "9", title: "BYD、日本での販売店を年内50拠点に拡大へ", source: "NHK", url: "https://www3.nhk.or.jp/", category: "global", publishedAt: getDaysAgo(3), summary: "中国の電気自動車メーカーBYDが日本国内の販売拠点を年内に50店舗まで拡大する方針を明らかに。", detailedSummary: "中国の電気自動車（EV）最大手BYDは、日本国内の販売拠点を2026年末までに50店舗まで拡大する方針を明らかにした。現在の22店舗から倍増以上となる計画。\n\n【BYDジャパンの販売計画】\n・2026年販売目標：2万台（2025年実績：8,000台見込み）\n・新規出店地域：北陸、山陰、四国など未進出エリア\n・販売モデル：ATTO 3、ドルフィン、シールに加え、新型SUV投入予定\n\n【価格競争力】\n・ドルフィン：363万円〜（補助金適用で約280万円〜）\n・ATTO 3：440万円〜（補助金適用で約360万円〜）\n\n【中古車市場への影響】\n日本市場でのBYD車の増加に伴い、将来的にBYD中古車の流通も増える見込みです。ただし、中国メーカーのリセールバリューは未知数であり、EV中古車の在庫リスクを考慮した慎重な対応が必要です。" },
    // 5-7 days ago
    { id: "10", title: "全国中古車販売台数、2月は前年同月比4.2%増", source: "自販連", url: "https://www.jada.or.jp/", category: "market", publishedAt: getDaysAgo(5), summary: "日本自動車販売協会連合会の調べで2月の中古車販売台数は前年同月比4.2%増の約35万台となった。", detailedSummary: "日本自動車販売協会連合会（自販連）が発表した2月の中古車販売統計によると、登録車の中古車販売台数は前年同月比4.2%増の約35万台となり、5ヶ月連続で前年を上回った。\n\n【カテゴリ別販売動向】\n・軽自動車：+6.3%（価格帯の手頃さが支持）\n・コンパクトカー：+5.1%\n・SUV：+3.8%\n・ミニバン：+2.5%\n・セダン：-1.2%\n\n【地域別動向】\n・首都圏：+3.5%\n・中部：+4.8%\n・近畿：+4.0%\n・九州：+5.5%\n\n【市場分析】\n新車の納期正常化に伴い、下取り車両の流通が増加していることが背景にある。また、物価上昇を受けて新車から中古車へシフトする消費者も増えている。今後も堅調な需要が続く見通しだが、在庫確保の競争激化には注意が必要。" },
    { id: "11", title: "マツダ、ロータリーエンジン搭載の新型PHEVを2027年投入へ", source: "Response", url: "https://response.jp/", category: "maker", publishedAt: getDaysAgo(6), summary: "マツダはロータリーエンジンを発電用に搭載したPHEVの新型モデルを2027年に投入する計画。", detailedSummary: "マツダは、ロータリーエンジンを発電用として搭載するプラグインハイブリッド（PHEV）の新型モデルを2027年に投入する計画を発表した。MX-30 Rotary-EVの技術を発展させた次世代モデルとなる。\n\n【予想されるスペック】\n・EV航続距離：100km以上\n・ロータリー発電によるレンジエクステンダー航続距離：+600km\n・システム出力：200PS以上\n・車格：CX-5クラスのSUV\n\n【ロータリー採用のメリット】\n・コンパクトで軽量な発電ユニット\n・低振動・低騒音\n・水素燃料への対応可能性\n\nマツダの丸本社長は「ロータリーエンジンの新たな価値を提案したい」とコメントしている。\n\n【中古車市場への示唆】\n現行MX-30 Rotary-EVのリセールバリューは、新型投入により影響を受ける可能性があります。一方、ロータリーファンからの根強い人気により、一定の需要は維持される見込みです。" },
    { id: "12", title: "自動運転レベル4、高速道路での運用が今夏開始", source: "日経クロステック", url: "https://xtech.nikkei.com/", category: "ev", publishedAt: getDaysAgo(6), summary: "国交省は高速道路における自動運転レベル4の運用を今夏から一部区間で開始すると発表。物流分野から先行導入。", detailedSummary: "国土交通省は、高速道路における自動運転レベル4（特定条件下での完全自動運転）の運用を2026年夏から一部区間で開始すると発表した。物流分野でのトラック隊列走行から先行導入する。\n\n【運用開始区間】\n・新東名高速道路：御殿場JCT〜浜松いなさJCT（約145km）\n・制限速度：80km/h\n・対象車両：大型トラック（隊列走行）\n\n【レベル4自動運転の定義】\n特定条件下（ODD：運行設計領域）において、システムがすべての運転操作を担当。ドライバーによる監視は不要だが、ODDを超える場合は人間が対応する必要がある。\n\n【今後の展望】\n2027年度には乗用車向けのレベル4サービス開始も視野に入れている。自動運転タクシーの実用化も並行して進められている。\n\n【中古車市場への影響】\n自動運転対応車両と非対応車両で、将来的に中古車価格に差が出る可能性があります。特に高速道路を多用する法人顧客への提案では、自動運転対応の有無が訴求ポイントになり得ます。" },
    // 8-14 days ago
    { id: "13", title: "中古車輸出、東南アジア向けが過去最高を記録", source: "貿易統計", url: "https://www.customs.go.jp/", category: "market", publishedAt: getDaysAgo(8), summary: "2月の中古車輸出台数は東南アジア向けが前年比15%増となり過去最高を記録。円安の影響が大きい。", detailedSummary: "財務省の貿易統計によると、2026年2月の中古車輸出台数は前年同月比12%増の約14万台となり、特に東南アジア向けが15%増と過去最高を記録した。\n\n【地域別輸出動向】\n・東南アジア：+15%（タイ、インドネシア、マレーシア中心）\n・中東：+8%（UAE、サウジアラビア）\n・アフリカ：+5%\n・ロシア・CIS：-20%（経済制裁の影響継続）\n\n【輸出好調の背景】\n1. 円安の継続（1ドル=150円台）\n2. 東南アジアでの日本車人気\n3. 現地の中古車ローン市場の発達\n\n【人気車種】\n1位：トヨタ ハイエース\n2位：トヨタ プリウス\n3位：日産 エクストレイル\n\n【販売店への示唆】\n輸出需要の高まりにより、国内オークション相場にも影響が出ています。特にハイエースやランドクルーザーなど輸出人気車種は、国内販売用の在庫確保が困難になる可能性があります。仕入れルートの多角化を検討してください。" },
    { id: "14", title: "ダイハツ、品質不正問題からの出荷再開後の販売動向", source: "朝日新聞", url: "https://www.asahi.com/", category: "maker", publishedAt: getDaysAgo(10), summary: "ダイハツの出荷再開後の販売台数が回復基調に。軽自動車市場でのシェアは依然として不正前の水準には届かず。", detailedSummary: "ダイハツ工業の品質不正問題に伴う出荷停止から約1年が経過し、販売台数は徐々に回復基調にある。ただし、軽自動車市場でのシェアは不正発覚前の水準には届いていない。\n\n【販売動向】\n・2026年2月販売台数：約4.2万台（前年同月比+35%）\n・軽自動車市場シェア：約28%（不正前：約33%）\n・主力車種「タント」：前年比+40%\n\n【回復の背景】\n1. 全車種の出荷再開完了\n2. 補償プログラムによる顧客信頼の回復\n3. 新型車（ロッキーHEV等）の投入効果\n\n【課題】\n・ブランドイメージの完全回復には時間を要する\n・スズキへの顧客流出が一部で継続\n\n【中古車市場への影響】\nダイハツ中古車の価格は、不正発覚直後の下落から回復傾向にあります。特に程度の良いタントやムーヴは、新車の納期正常化後も堅調な需要が見込まれます。" },
    { id: "15", title: "急速充電インフラ、2026年度は全国2万基突破の見通し", source: "日本経済新聞", url: "https://www.nikkei.com/", category: "ev", publishedAt: getDaysAgo(12), summary: "経済産業省は急速充電器の設置数が2026年度中に2万基を突破する見通しを公表。補助金拡充が後押し。", detailedSummary: "経済産業省は、急速充電器（出力50kW以上）の設置数が2026年度中に全国で2万基を突破する見通しを発表した。補助金の拡充とEV普及に伴い、設置ペースが加速している。\n\n【充電インフラの現状】\n・急速充電器：約15,000基（2025年度末見込み）\n・普通充電器：約30,000基\n・2026年度設置目標：急速+5,000基、普通+8,000基\n\n【補助金制度】\n・急速充電器（90kW以上）：設置費用の2/3補助（上限500万円）\n・急速充電器（50kW以上）：設置費用の1/2補助（上限300万円）\n\n【設置場所の傾向】\n・高速道路SA/PA：充実化が進む\n・商業施設：大型ショッピングモールを中心に増加\n・コンビニ：ローソン、ファミリーマートが積極展開\n\n【中古車販売店への示唆】\nEV中古車の取り扱いを検討している店舗は、充電設備の導入も視野に入れてください。補助金を活用することで、初期投資を抑えることが可能です。また、近隣の充電スポット情報は、EV購入検討客への重要なセールスポイントになります。" },
    // 15-21 days ago
    { id: "16", title: "ガリバー、AI査定システムを全店導入へ", source: "日刊自動車新聞", url: "https://www.netdenjd.com/", category: "used", publishedAt: getDaysAgo(15), summary: "中古車大手のガリバーがAIを活用した査定システムを全店舗に導入すると発表。査定時間を大幅短縮。", detailedSummary: "中古車販売大手のガリバーインターナショナル（IDOM）は、AIを活用した車両査定システムを全国約460店舗に導入すると発表した。2026年6月までに全店展開を完了する予定。\n\n【AI査定システムの特徴】\n1. 画像認識AIによる外装・内装の自動評価\n2. 過去の取引データ（100万件以上）に基づく価格算出\n3. 査定時間：従来40分→約15分に短縮\n4. 査定精度：人間の熟練査定士と同等レベルを実現\n\n【導入効果の見込み】\n・査定スタッフの生産性：約2.5倍向上\n・顧客の待ち時間：約60%削減\n・査定結果のばらつき：大幅に減少\n\n【業界への影響】\n大手チェーンのDX化が進むことで、中小販売店との効率格差が拡大する可能性があります。一方、AIでは評価しきれない「人間ならではの接客」や「地域密着のサービス」で差別化を図ることも重要です。\n\n中小販売店向けのAI査定サービスも複数登場しており、導入検討の価値はあるでしょう。" },
    { id: "17", title: "米国の関税政策変更、日系自動車メーカーへの影響分析", source: "Bloomberg", url: "https://www.bloomberg.co.jp/", category: "global", publishedAt: getDaysAgo(18), summary: "米国の対日関税引き上げが日系メーカーの収益に影響。各社は現地生産拡大で対応を急ぐ。", detailedSummary: "米国の新たな関税政策により、日本から輸出する完成車への関税が従来の2.5%から25%に引き上げられる見通しとなり、日系自動車メーカーの収益に大きな影響が出ている。\n\n【各社への影響度】\n・トヨタ：年間約2,000億円の利益押し下げ要因（試算）\n・ホンダ：年間約800億円\n・日産：年間約500億円\n・マツダ：年間約400億円\n\n【各社の対応策】\n1. 米国現地生産の拡大\n　・トヨタ：ケンタッキー工場の生産能力増強\n　・ホンダ：オハイオ工場でのEV生産開始\n2. メキシコ生産の活用（USMCA協定による関税免除）\n3. 輸出車種の見直し（高付加価値車への集中）\n\n【為替への影響】\n関税引き上げによる日本からの輸出減少は、長期的には円安要因となる可能性があります。\n\n【中古車市場への影響】\n米国向け中古車輸出も関税対象となる可能性があり、輸出業者の動向には注意が必要です。国内中古車流通量に影響を与える可能性があります。" },
    // 22-30 days ago
    { id: "18", title: "軽自動車の新安全基準、2027年から段階的に適用", source: "NHK", url: "https://www3.nhk.or.jp/", category: "regulation", publishedAt: getDaysAgo(22), summary: "国交省は軽自動車の衝突安全基準を2027年から段階的に強化。側面衝突の基準値を欧州水準に引き上げ。", detailedSummary: "国土交通省は、軽自動車の衝突安全基準を2027年から段階的に強化する方針を発表した。側面衝突の基準値を欧州水準に引き上げることで、乗員保護性能の向上を図る。\n\n【新基準の概要】\n1. 側面衝突試験\n　・現行：時速55km → 新基準：時速60km\n　・衝突角度の追加（斜め衝突試験の導入）\n2. 後面衝突試験\n　・燃料タンク保護基準の強化\n3. 歩行者保護\n　・ボンネット衝撃吸収基準の厳格化\n\n【適用スケジュール】\n・2027年4月：新型車に適用\n・2029年4月：継続生産車に適用\n\n【メーカーへの影響】\n・車両重量の増加（推定+30〜50kg）\n・製造コストの上昇（1台あたり+5〜8万円）\n・一部車種の統廃合の可能性\n\n【中古車市場への影響】\n新基準適用後、旧基準車との安全性能差が明確になります。将来的に旧基準車の価格に下落圧力がかかる可能性があるため、在庫の回転を意識した戦略が重要です。" },
    { id: "19", title: "ホンダ、軽EVのN-VAN e:の受注好調 月販目標の3倍に", source: "日本経済新聞", url: "https://www.nikkei.com/", category: "ev", publishedAt: getDaysAgo(25), summary: "ホンダの軽商用EV「N-VAN e:」の受注が月販目標の3倍を記録。法人需要が牽引。", detailedSummary: "ホンダは、2025年10月に発売した軽商用EV「N-VAN e:」の受注が好調であると発表した。発売から4ヶ月で累計受注台数は約1.2万台に達し、月販目標（1,000台）の3倍のペースで推移している。\n\n【受注の内訳】\n・法人：約75%\n・個人：約25%\n\n【人気グレード】\n1位：e: L4（4人乗り）：45%\n2位：e: FUN（2人乗り）：35%\n3位：e: G（2人乗り・商用）：20%\n\n【法人顧客の主な業種】\n・配送・物流：約40%\n・建設・工事：約20%\n・介護・福祉：約15%\n・その他サービス業：約25%\n\n【価格帯】\n・e: G：243万円〜\n・e: L4：269万円〜\n・CEV補助金適用で約55万円引き\n\n【中古車市場への示唆】\nN-VAN e:の中古車流通は数年先になりますが、法人使用車両のリースアップが始まると一定の流通量が見込まれます。バッテリー状態の評価方法を早期に習得しておくことをお勧めします。" },
    { id: "20", title: "カーシェア市場、2025年度は前年比18%成長の見通し", source: "矢野経済研究所", url: "https://www.yano.co.jp/", category: "market", publishedAt: getDaysAgo(28), summary: "国内カーシェア市場が拡大を続け、2025年度は前年比18%成長の見通し。若年層の車離れと環境意識が背景。", detailedSummary: "矢野経済研究所の調査によると、国内カーシェアリング市場は2025年度に前年比18%成長し、市場規模は約680億円に達する見通しとなった。\n\n【市場成長の要因】\n1. 若年層の「所有から利用へ」の意識変化\n2. 都市部での駐車場コスト高騰\n3. 環境意識の高まり（必要な時だけ車を使う）\n4. サービスの利便性向上（アプリ予約、ワンウェイ利用）\n\n【主要事業者のシェア】\n・タイムズカー：約45%\n・カレコ：約25%\n・オリックスカーシェア：約15%\n・その他：約15%\n\n【ステーション数推移】\n・2023年度：約2.0万か所\n・2024年度：約2.4万か所\n・2025年度：約2.9万か所（見込み）\n\n【中古車販売への影響】\n若年層のファーストカー購入が遅れる傾向にあり、エントリーモデルの需要に影響を与えています。一方、カーシェア経験者が「やはり自分の車が欲しい」と感じて中古車を購入するケースも増えており、カーシェアを「試乗機会」と捉えた販促アプローチも有効かもしれません。" },
  ]
}

// -- AI Daily Summary --
const dailySummary = `【本日の自動車業界まとめ】

■ 市場動向
中古車販売台数は前年比4.2%増と好調を維持。輸出市場では東南アジア向けが過去最高を記録しており、円安を追い風に海外需要が拡大しています。一方、オークション相場では高級セダンが下落傾向にあり、SUV・ミニバンとの二極化が進んでいます。

■ メーカー動向
トヨタは国内生産計画を上方修正。日産・ホンダの統合新会社はEV専用プラットフォーム共同開発を正式発表しました。マツダはロータリーエンジン搭載PHEVを2027年投入予定。ダイハツは品質不正問題からの回復途上にあります。

■ EV・次世代技術
自動運転レベル4が今夏から高速道路で運用開始。急速充電インフラは2026年度中に2万基突破の見通し。BYDは日本販売拠点を50店舗に拡大予定で、国内EV市場の競争が激化しています。

■ 中古車業界への示唆
ガリバーがAI査定システムを全店導入するなど、業界のDX化が加速。保険料の引き上げや関税政策の変更など、コスト面での注視が必要です。`

// -- AI response generator --
function generateAIResponse(question: string, news: NewsItem[]): string {
  const q = question.toLowerCase()
  if (q.includes("中古車") || q.includes("相場") || q.includes("オークション")) {
    return "中古車市場について本日のニュースからお伝えします。\n\n中古車オークション相場では高級セダンが前月比2.3%下落する一方、SUV・ミニバンは横ばいを維持しています。全国の中古車販売台数は2月に前年同月比4.2%増の約35万台と好調です。\n\nまた、中古車輸出は東南アジア向けが過去最高を記録しており、円安の恩恵を受けています。ガリバーのAI査定システム全店導入など、業界のデジタル化も進んでいます。\n\n仕入れ戦略としては、高級セダンの仕入れ価格に下落余地がある今が好機かもしれません。一方でSUV・ミニバンは引き続き需要が高い状態が続いています。"
  }
  if (q.includes("ev") || q.includes("電気") || q.includes("電動") || q.includes("充電")) {
    return "EV・電動化に関する本日のニュースをまとめます。\n\n1. **日産・ホンダ統合会社**がEV専用プラットフォームの共同開発を正式発表しました。2028年の市場投入を目指しています。\n2. **BYD**は日本国内の販売拠点を年内に50店舗まで拡大する方針です。\n3. **急速充電インフラ**は2026年度中に全国2万基突破の見通しで、補助金拡充が後押ししています。\n4. **自動運転レベル4**が今夏から高速道路で運用開始されます。\n\n中古車販売店としては、EV中古車の取り扱い体制整備（充電設備、バッテリー評価基準）を早期に進めることをお勧めします。"
  }
  if (q.includes("トヨタ") || q.includes("toyota")) {
    return "トヨタに関する本日のニュースです。\n\nトヨタ自動車は2026年度の国内生産計画を当初比5%上方修正しました。SUVモデルの好調な受注が背景にあります。\n\nこれは中古車市場にとって、将来的にSUVの供給増加につながる可能性がありますが、当面は新車の納期短縮により中古車への代替需要は落ち着く可能性があります。トヨタSUV系の在庫戦略を見直す良いタイミングかもしれません。"
  }
  if (q.includes("規制") || q.includes("税") || q.includes("保険") || q.includes("法")) {
    return "規制・法改正に関する本日のニュースをまとめます。\n\n1. **自動車保険料**が2026年4月から平均3.5%引き上げ。修理費高騰と事故率上昇が要因です。\n2. **自動車関連税制**の改正案が公表され、環境性能割の基準見直しが盛り込まれました。\n3. **軽自動車の安全基準**が2027年から段階的に強化されます。\n\nお客様への影響としては、保険料値上げにより総支払額が増加するため、購入時の説明やフォローが重要になります。環境性能割の見直しはエコカー減税対象車の需要に影響を与える可能性があります。"
  }
  return `ご質問ありがとうございます。本日の自動車業界ニュース${news.length}件をもとにお答えします。\n\n本日の主要トピックとしては、トヨタの生産計画上方修正、日産・ホンダのEVプラットフォーム共同開発、中古車市場の好調な販売台数（前年比4.2%増）、そして保険料引き上げなどがあります。\n\nより具体的な内容をお知りになりたい場合は、「中古車相場について教えて」「EV関連のニュースは？」「規制変更の影響は？」など、トピックを絞ってご質問ください。`
}

// ========================
// Main Component
// ========================
// Date range options
const dateRangeOptions = [
  { value: "today", label: "今日", days: 0 },
  { value: "3days", label: "3日間", days: 3 },
  { value: "week", label: "1週間", days: 7 },
  { value: "2weeks", label: "2週間", days: 14 },
  { value: "month", label: "1ヶ月", days: 30 },
]

export function IndustryNews() {
  const [newsData] = useState<NewsItem[]>(generateNewsData)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDateRange, setSelectedDateRange] = useState<string>("month")
  const [showChat, setShowChat] = useState(false)
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Filter by category and date range
  const dateRangeDays = dateRangeOptions.find(d => d.value === selectedDateRange)?.days ?? 30
  const filteredNews = newsData
    .filter((n) => selectedCategory === "all" || n.category === selectedCategory)
    .filter((n) => isWithinDays(n.publishedAt, dateRangeDays))

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, isTyping])

  const handleSendMessage = () => {
    if (!chatInput.trim() || isTyping) return
    const userMsg: ChatMessage = { role: "user", content: chatInput.trim(), timestamp: new Date() }
    setChatMessages((prev) => [...prev, userMsg])
    setChatInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = generateAIResponse(userMsg.content, newsData)
      setChatMessages((prev) => [...prev, { role: "assistant", content: response, timestamp: new Date() }])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggest = (q: string) => {
    setChatInput(q)
    setShowChat(true)
  }

  return (
    <div className="space-y-6">
      {/* AI Daily Summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-chart-4/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{"AI\u30CB\u30E5\u30FC\u30B9\u30B5\u30DE\u30EA\u30FC"}</CardTitle>
                <CardDescription className="text-xs">{todayStr()}{"  \u2022  "}{newsData.length}{"件のニュースを分析"}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  setShowChat(true)
                }}
              >
                <Bot className="h-3.5 w-3.5" />
                {"AIに質問"}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSummaryExpanded(!summaryExpanded)}
              >
                {summaryExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        {summaryExpanded && (
          <CardContent className="pt-0">
            <div className="rounded-lg bg-background/80 border p-4 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
              {dailySummary}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                "中古車相場の動向を詳しく教えて",
                "EV関連の最新動向は？",
                "規制変更が中古車販売に与える影響は？",
              ].map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-xs border-primary/30 hover:bg-primary/10 hover:text-primary"
                  onClick={() => handleSuggest(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* AI Chat (toggled) */}
      {showChat && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm">{"ニュースAIアシスタント"}</CardTitle>
                  <CardDescription className="text-xs">{"本日のニュースに基づいて回答します"}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowChat(false)} className="text-xs text-muted-foreground">
                {"閉じる"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {/* Messages */}
            {chatMessages.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto space-y-3 rounded-lg border p-3 bg-muted/30">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-2", msg.role === "user" && "flex-row-reverse")}>
                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      msg.role === "assistant" ? "bg-primary/10" : "bg-muted",
                    )}>
                      {msg.role === "assistant" ? <Bot className="h-3.5 w-3.5 text-primary" /> : <User className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                    <div className={cn(
                      "rounded-xl px-3 py-2 text-sm leading-relaxed max-w-[85%] whitespace-pre-line",
                      msg.role === "assistant" ? "bg-background border" : "bg-primary text-primary-foreground",
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="rounded-xl px-3 py-2 text-sm bg-background border">
                      <span className="flex gap-1">
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce [animation-delay:0.1s]">.</span>
                        <span className="animate-bounce [animation-delay:0.2s]">.</span>
                      </span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder={"ニュースについて質問..."}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isTyping}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Date Range Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{"期間:"}</span>
          <div className="flex items-center gap-1">
            {dateRangeOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={selectedDateRange === opt.value ? "default" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setSelectedDateRange(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
        >
          <Newspaper className="h-3.5 w-3.5 mr-1.5" />
          {"すべて"}
          <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">{filteredNews.length}</Badge>
        </Button>
        {Object.entries(categoryConfig).map(([key, config]) => {
          const count = filteredNews.filter((n) => n.category === key).length
          const Icon = config.icon
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
            >
              <Icon className="h-3.5 w-3.5 mr-1.5" />
              {config.label}
              <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">{count}</Badge>
            </Button>
          )
        })}
      </div>

      {/* News List */}
      <div className="space-y-3">
        {filteredNews.map((news) => {
          const cat = categoryConfig[news.category]
          const CatIcon = cat?.icon || Newspaper
          return (
            <div
              key={news.id}
              className="block group cursor-pointer"
              onClick={() => setSelectedNews(news)}
            >
              <Card className="transition-all hover:shadow-md hover:border-primary/30">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border", cat?.className)}>
                    <CatIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-muted-foreground">{"詳細を見る"}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{news.summary}</p>
                    <div className="flex items-center gap-3 pt-0.5">
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", cat?.className)}>
                        {cat?.label}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-medium">{news.source}</span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {news.publishedAt}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      {filteredNews.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Newspaper className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">{"該当するニュースがありません"}</p>
          </CardContent>
        </Card>
      )}

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={(open) => !open && setSelectedNews(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedNews && (() => {
            const cat = categoryConfig[selectedNews.category]
            const CatIcon = cat?.icon || Newspaper
            return (
              <>
                <DialogHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border", cat?.className)}>
                      <CatIcon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={cn("text-xs", cat?.className)}>
                        {cat?.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground font-medium">{selectedNews.source}</span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {selectedNews.publishedAt}
                      </span>
                    </div>
                  </div>
                  <DialogTitle className="text-lg leading-snug pr-6">
                    {selectedNews.title}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    {selectedNews.summary}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                  {/* Detailed Summary */}
                  <div className="rounded-lg bg-muted/50 border p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">{"AIによる詳細サマリー"}</span>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                      {selectedNews.detailedSummary}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setChatInput(`「${selectedNews.title}」について詳しく教えて`)
                        setShowChat(true)
                        setSelectedNews(null)
                      }}
                    >
                      <Bot className="h-4 w-4 mr-1.5" />
                      {"AIに質問する"}
                    </Button>
                    <Button
                      size="sm"
                      asChild
                    >
                      <a href={selectedNews.url} target="_blank" rel="noopener noreferrer">
                        {"配信元で読む"}
                        <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
