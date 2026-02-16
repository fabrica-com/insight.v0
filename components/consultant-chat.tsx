"use client";

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Flame, History, Plus, Trash2, MessageSquare, Zap, Target, Megaphone, DollarSign, Users, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const suggestedTopics = [
  { icon: DollarSign, text: "売上が伸びなくて困ってる" },
  { icon: Target, text: "在庫が全然回転しない" },
  { icon: Megaphone, text: "SNSやった方がいい？" },
  { icon: Users, text: "紹介が全然来ない" },
  { icon: Phone, text: "問い合わせが少ない" },
  { icon: Zap, text: "何から始めればいい？" },
]

const STORAGE_KEY = "symphony-consultant-chat-history"

const loadChatHistory = (): ChatHistory[] => {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return parsed.map((chat: ChatHistory) => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map((msg: Message) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }))
  } catch {
    return []
  }
}

const saveChatHistory = (history: ChatHistory[]) => {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch {
    // ignore
  }
}

const generateChatTitle = (firstMessage: string): string => {
  const maxLength = 30
  return firstMessage.length > maxLength
    ? `${firstMessage.substring(0, maxLength)}...`
    : firstMessage
}

const INITIAL_MESSAGE = `おう、来たな。

俺は「中古車屋のドン」。年商50億を叩き出した男だ。
ベンツ3台、タワマン2つ持ってる。全部クルマで稼いだカネだ。

...で、お前は？
なんだその顔。どうせ「売れない」「カネない」「やる気ない」の三拍子だろ？

いいぜ。俺が叩き直してやる。

まず教えろ。お前の店、今どんな状態だ？
在庫何台？月何台売ってる？一番困ってることは何だ？

ダラダラ言い訳は聞かねぇ。事実だけ言え。
そしたら、お前でもできる「楽して儲かる方法」を教えてやるよ。`

const generateConsultantResponse = (question: string, messageCount: number): string => {
  const q = question.toLowerCase()

  // ========================================
  // PART 1: 初回〜序盤（3分ミッション）
  // ========================================
  if (messageCount <= 4) {
    if (q.includes("売上") || q.includes("売れない") || q.includes("伸びない")) {
      return `はぁ？ 売れない？

お前、今日在庫の写真何枚撮った？ 0枚？
そりゃ売れねぇわ。存在しない店から誰が買うんだよ。

いいか、今から3分で終わるミッションを出す。

**【今すぐやれ】在庫で一番キレイな車の写真を1枚撮れ。**
スマホでいい。ボンネットの上から斜め45度。空が映る角度だ。
それをインスタのストーリーに上げろ。文字は「入荷しました」だけでいい。

...え？ インスタやってない？

お前さぁ、令和だぞ？ TikTokもインスタもやってない中古車屋とか、
看板も出さずに「客が来ない」って泣いてるのと一緒だからな？

まず **インスタのアカウントを作れ。** 3分で終わる。
プロフィールに「中古車販売」「所在地」「電話番号」入れろ。以上。

これすらできねぇなら、お前は一生貧乏のままだ。
でもやれば、半年後にはベンツのハンドル握れる。どっちがいい？`
    }

    if (q.includes("在庫") || q.includes("回転") || q.includes("売れ残")) {
      return `在庫が回らねぇ？ 当たり前だろ。

いいか、中古車は「ナマモノ」だ。寿司と一緒。
仕入れた瞬間から腐り始めてんだよ。

お前の在庫、60日超えてるのあるだろ？ 正直に言え。

**【鉄の掟】60日で売れなかったら、もうそれは「負け」だ。**

俺のルール教えてやる：
- 0〜14日：定価で勝負
- 15〜30日：5%値下げ
- 31〜45日：10%下げて業販にも出す
- 46〜60日：赤字でも売る

「もったいない」？ バカ言え。
**在庫に100万円寝てる方がもったいねぇんだよ。**
その100万で次の車仕入れたら粗利20万取れるだろ？

今すぐやれ。在庫リスト開いて、45日超えてる車を3台ピックアップしろ。
明日のAA出品か、業販で声かけろ。

カネが回り始めたら、そこからが本番だ。
お前の店、まだ死んでねぇよ。`
    }

    if (q.includes("sns") || q.includes("インスタ") || q.includes("tiktok") || q.includes("ティック") || q.includes("動画") || q.includes("youtube")) {
      return `SNSやった方がいいかって？

当たり前だろ！！ 何を今さら聞いてんだ！

いいか、お前の店の最大の問題は **「存在を知られてない」** ことだ。
どんなに良い車揃えても、知られてなきゃ意味ねぇ。

**【優先順位はこれだ】**

1. **TikTok**（最優先）
   - **縦動画** で車紹介。30秒でいい
   - 「この車○○万円！」ってデカい字幕入れろ
   - 顔出さなくていい。車だけでOK
   - 1日1本。無理なら3日に1本
   - 撮った動画は **インスタのリールにも流し込め** （使い回しOK）

2. **Instagram**
   - リール = TikTokの使い回し。2倍おいしい
   - ストーリーで日常を発信「今日の入庫」「洗車しました」
   - プロフィールに電話番号とLINE

3. **Googleマップ（MEO）**
   - これ **無料で最強** 。写真30枚以上入れろ
   - 納車したら必ずクチコミ書いてもらえ

**【縦動画のコツ】**
- 車の外観は「ぐるっと一周」でOK
- BGMは流行りの曲を使え。TikTokが勝手にオススメしてくれる
- 字幕は必ず入れろ。音なしで見てるヤツが6割だ
- 車両画像の転載は著作権でアウト。**自分で撮れ。**

**【今日のミッション】**
TikTokアカウント作って、在庫1台をスマホで30秒撮れ。
テロップは後から入れればいい。まず1本上げろ。

最初から完璧目指すヤツは一生何もできねぇ。
恥ずかしい？ 恥ずかしいのは、カネがねぇことだろ？`
    }

    if (q.includes("紹介") || q.includes("口コミ") || q.includes("クチコミ")) {
      return `紹介が来ない？ そりゃそうだ。

**お前、紹介を「お願い」してねぇだろ？**

いいか、紹介ってのは「頼まないと来ない」んだよ。
お客は満足してても、黙ってたら紹介なんかしねぇ。

**【今すぐやれ】過去に車を買ってくれた客にLINE1通送れ。**

テンプレ教えてやる：

> 「○○さん、お車の調子いかがですか？
> もしお知り合いで車お探しの方がいたら、
> ぜひご紹介ください！
> ご紹介いただいた方には○○○○の特典をお付けします。」

これだけ。3分で終わる。

紹介の成約率は普通の問い合わせの **3〜5倍** だ。
広告費ゼロで最高の客が来る。これをやらないヤツはアホだ。

特典は何でもいい。オイル交換無料とか、洗車券とか。
大事なのは **「紹介してくれたら得がある」** って思わせること。
人間ってのは、何かもらったら返したくなる生き物なんだよ。

もう一個教えてやる。紹介プログラムの **「3段階ロケット」** だ：
- **1件紹介**：オイル交換無料
- **3件紹介**：車検時1万円引き
- **5件紹介**：次の車購入5万円引き

紹介する側にも「ゲーム感覚」が生まれる。
人間は「あと少しで次のレベル」が大好きなんだ。

さぁ、今すぐスマホ開け。LINE開け。1通送れ。`
    }

    if (q.includes("問い合わせ") || q.includes("集客") || q.includes("来店")) {
      return `問い合わせが少ない？

お前の店、ネットでどう見えてるか知ってるか？
「地域名 中古車」でググってみろ。お前の店、出てくるか？

出てこない？ じゃあ存在してないのと一緒だ。

**【最速で問い合わせを増やす方法】**

1. **Googleビジネスプロフィール** を今すぐ整えろ
   - 写真最低30枚（車・店内・外観）
   - 営業時間・電話番号・LINE、全部入れろ
   - 毎週1回「投稿」機能で入荷情報を上げろ

2. **クチコミを集めろ**
   - 過去のお客に片っ端からお願いしろ
   - 目標はまず **10件** 。★4.5以上を維持
   - クチコミが多い店 = 信頼できる店。これが社会的証明ってヤツだ

3. **媒体（カーセンサー・グーネット）の写真を全部撮り直せ**
   - 暗い写真、汚い写真は即アウト
   - 1台あたり最低20枚。室内、エンジンルーム、傷の有無も
   - **写真のクオリティだけで問い合わせが3倍変わるぞ**

**【今日のミッション】**
Googleで「お前の市区町村名 + 中古車」って検索しろ。
自分の店が何番目に出てくるか確認しろ。

現在地を知らなきゃ、目的地にはたどり着けねぇぞ。`
    }

    if (q.includes("何から") || q.includes("始め") || q.includes("やる気") || q.includes("わからない")) {
      return `何から始めればいいかわからない？

...よし。正直でいいぞ。嘘つくヤツよりマシだ。

いいか、俺が今から **「3分でできること」** を1つだけ出す。
これだけやれ。他は何もしなくていい。

**【ミッション】在庫で一番自信のある車の写真を3枚撮れ。**

条件：
- 外が明るい時間に撮る
- 車を洗ってから撮る（5分で拭くだけでいい）
- 正面、斜め前、室内の3枚

撮ったらどうするかは、次に教えてやる。
まず撮れ。話はそれからだ。

...なんで写真かって？

いいか、**中古車の商売は「見た目」が9割** だ。
同じ車でも、写真がキレイなだけで問い合わせが3倍変わる。これ、マジだぞ。

お前が思ってる以上に、お客はスマホで車を選んでる。
実物を見る前に、写真で「あり」か「なし」か決めてんだ。

さぁ、スマホ持って外出ろ。3分だ。
できたら報告しろ。次のステップ教えてやるから。`
    }

    // 序盤のデフォルト
    return `ほう、「${question}」か。

よし、まずお前の状況を教えろ。

- 店の規模は？（在庫何台くらいだ？）
- 月に何台売ってる？
- 一番困ってることは何だ？

全部じゃなくていい。1つでもいいから教えろ。

お前が思ってるよりシンプルな話だ。
中古車屋の商売は **「安く仕入れて、高く売る」** 。これだけ。

問題はそこに至るまでの「やり方」を知らねぇことだ。
でも大丈夫。俺が全部教えてやる。

**ただし条件がある。俺が出したミッションは必ずやれ。**
やらねぇヤツに教えることはねぇ。

さぁ、状況を吐け。`
  }

  // ========================================
  // PART 2: 中盤（セグメント別・戦略的アドバイス）
  // ========================================

  // --- 目標設定 ---
  if (q.includes("目標") || q.includes("年商") || q.includes("儲") || q.includes("いくら") || q.includes("稼")) {
    return `目標の話か。いいぞ。たまにはこういう話もしねぇとな。

お前、年商いくら目指してる？ ...言えない？
言えないってことは、決めてないってことだろ。

**目標のないヤツは、海図のない船と一緒だ。どこにもたどり着けねぇ。**

いいか、今から一緒に決めるぞ。

**【ステップ1：現状を数字にしろ】**
- 月に何台売ってる？
- 1台あたり粗利いくら？
- 月の固定費いくら？

**【ステップ2：逆算しろ】**
例えば月に10台、粗利1台30万なら月商300万。年商3,600万。
これじゃ食えねぇだろ？

じゃあどうするか。3つの方法がある：
1. **台数を増やす**（月10台→15台）
2. **粗利を上げる**（30万→40万）
3. **付帯収入を足す**（保険・車検・コーティングで+5万/台）

**月15台 × 粗利35万 + 付帯5万 = 月商600万。年商7,200万。**
ここまで来たら、社長、マジでベンツ買えるぞ？

**【ステップ3：紙に書いてパソコンの横に貼れ】**
「年商○○○○万円。月販○○台。1台粗利○○万円。」
毎日見ろ。脳みそに刷り込め。勝手に体が動き出す。

さぁ、今の数字を教えろ。一緒に計算してやるから。`
  }

  // --- LINE・連絡・CRM ---
  if (q.includes("ライン") || q.includes("line") || q.includes("連絡") || q.includes("crm") || q.includes("顧客管理")) {
    return `LINEの話か。いいところに目をつけたな。

**LINE公式アカウント、やってないなら今日作れ。無料だ。**

いいか、中古車屋にとってLINEは **最強の武器** だ。
電話は出ないヤツでもLINEは見る。これ、現実だ。

**【LINEでやるべきこと5つ】**

1. **問い合わせをLINEに誘導しろ**
   - 媒体の紹介文に「LINE問い合わせ歓迎！」って書け
   - QRコードを名刺・チラシ・店頭・SNSプロフに貼れ

2. **既存客は全員友だち登録させろ**
   - 納車時に「アフターフォローをLINEでします」って言え
   - 断るヤツほぼいない。これで **顧客リスト** が勝手にできる

3. **月1回は一斉配信しろ**
   - 「今月のおすすめ車両」「季節のメンテ情報」
   - **売り込みは3回に1回** 。残り2回は役立つ情報

4. **紹介依頼もLINEでやれ**
   - 「お知り合いで車探してる方いたらご紹介ください」
   - テンプレ1通送るだけ。最強の無料広告だ

5. **車検・点検のリマインドを送れ**
   - 「○○さん、そろそろ車検ですね！」
   - これで **リピート率が爆上がり** する

**ポイントは「売り込まない」こと。**
有益な情報を出し続けると、勝手に信頼される。
で、車が欲しくなった時に一番に思い出される。

人間ってのはな、タダで有益な情報くれる人には「お返ししたい」って思う生き物なんだ。これを利用しろ。

**【今日のミッション】**
LINE公式アカウント作れ。15分で終わる。
で、直近の納車客5人に「登録してください」って送れ。`
  }

  // --- 仕入れ・オークション ---
  if (q.includes("仕入") || q.includes("オークション") || q.includes("aa") || q.includes("買取") || q.includes("相場")) {
    return `仕入れの話か。ここが商売の **肝** だ。

いいか、中古車屋が潰れる原因の8割は **「仕入れミス」** だ。
売れねぇ車を高く買う。これだけで死ぬ。

**【仕入れの鉄則5箇条】**

1. **「売れる確信がある車だけ買え」**
   - 「なんとなく良さそう」で仕入れるな
   - 仕入れる前にカーセンサーで同条件を検索しろ
   - 直近30日で何台売れてるか確認しろ

2. **買取仕入れを増やせ**
   - AAより買取の方が粗利が出る。当たり前だ
   - 「査定無料」を掲げて、SNS・チラシで告知しろ
   - 納車客に「次もうちで売ってね」って必ず言え

3. **得意車種に絞れ（ランチェスター戦略）**
   - 全車種やるな。お前が詳しい車種だけに絞れ
   - 「○○市でジムニーならこの店」を目指せ
   - **小さい市場で1位を取れ。** それが弱者の戦い方だ

4. **1台の上限金額を決めろ**
   - 資金3000万なら、1台80万以下にしろ
   - 高い車は **受注仕入れ** （注文もらってから買う）

5. **在庫日数を管理しろ**
   - 14日で売れなきゃ値下げ。60日で損切り
   - **在庫は寿司だ。鮮度が命。**

**【AA落札の鉄則】**
相場の85%以下で買え。それ以上出すと粗利が消える。
我慢しろ。焦って高値で買うヤツは負ける。

あと、**下取り車は宝の山** だぞ。
納車時に「今の車どうします？」って聞くだけで仕入れになる。

さぁ、お前の在庫リスト、今すぐ開いて見直せ。`
  }

  // --- 接客・商談・クロージング ---
  if (q.includes("接客") || q.includes("商談") || q.includes("クロージング") || q.includes("お客") || q.includes("成約") || q.includes("値引き")) {
    return `接客か。よし、叩き込んでやる。

お前、客が来た時どうしてる？
まさか「いらっしゃいませ〜何かお探しですか〜」とかやってないよな？

**あのな、中古車の接客は「心理戦」だ。**

**【接客の5大テクニック】**

1. **まず「聞け」。売り込むな**
   - 最初の5分は質問だけしろ
   - 「どんな車を？」「ご家族は？」「通勤に？」
   - 客が自分で言ったニーズを覚えろ

2. **提案は「松竹梅」の3台だけ**
   - 「お手頃」「バランス型」「プレミアム」
   - 人間はな、**真ん中を選びたがる** んだ
   - だから「真ん中」に一番売りたい車を置け

3. **客が言ったことを繰り返せ**
   - 「安全性が大事っておっしゃいましたよね」
   - 「この車、安全評価で最高ランクです」
   - 自分で言ったことに矛盾したくないのが人間だ

4. **希少性を「事実」で伝えろ**
   - 「この色×グレード×走行距離、全国で○台しかありません」
   - 事実を言ってるだけ。嘘は絶対ダメだ
   - 中古車は一点もの。それ自体が最強の希少性

5. **値引きの代わりに「特典」を付けろ**
   - 値引き10万より、コーティング（原価2万）の方がお得に見える
   - 「値引きはできないけど、ガラスコーティングサービスします！」
   - **客は「得した」って思う。お前は粗利を守れる。**

**【禁止事項】**
- 「今日決めてくれたら安くします」← これ最悪。客に足元見られる
- 嘘の在庫数・競合情報 ← 信頼崩壊で紹介が来なくなる

さぁ、次のお客が来るまでに「松竹梅セット」を1組作っておけ。`
  }

  // --- 価格設定・ダイナミックプライシング ---
  if (q.includes("価格") || q.includes("値段") || q.includes("プライシング") || q.includes("高い") || q.includes("安い") || q.includes("利益率") || q.includes("粗利")) {
    return `価格の話か。ここを間違えるとマジで死ぬぞ。

いいか、中古車の価格設定は **「科学」** だ。
感覚でやってるヤツは絶対に負ける。

**【ダイナミックプライシングの鉄則】**

まず、在庫日数に応じて価格を自動調整しろ：

- **0〜14日**：強気価格（相場+5%）
  → 入荷直後が一番価値がある。焦って下げるな
- **15〜30日**：相場価格に調整
  → ここで動かなきゃアラート出せ
- **31〜45日**：相場-5%で攻める
  → 業販にも声かけ始めろ
- **46〜60日**：赤字覚悟で売り切る
  → **在庫コストの方が高い。** 資金を回せ
- **61日〜**：AA出品。もう抱えるな

**【粗利を守るコツ】**

1. **付帯商品で稼げ**
   - コーティング（原価2万→販売8万 = 粗利6万）
   - 延長保証（ほぼ粗利）
   - ドラレコ・ETC取付
   - 1台あたり+5〜10万の付帯利益を目指せ

2. **端数は「8」で終わらせろ**
   - 150万じゃなく **148.8万** 。これだけで安く見える
   - 人間の脳はそういう風にできてんだ

3. **比較対象を作れ**
   - 同じ車種でグレード違いを並べて見せろ
   - 「こっちが10万高いけど装備がこれだけ違います」
   - **比較がないと「高い」しか思わねぇんだよ**

お前、1台あたり粗利いくら取れてる？
20万以下だったら、やり方変えないとマジでヤバいぞ。`
  }

  // --- 保証・アフター ---
  if (q.includes("保証") || q.includes("アフター") || q.includes("クレーム") || q.includes("車検") || q.includes("整備") || q.includes("修理")) {
    return `保証とアフターの話か。よし、ここ超重要だ。

**いいか、中古車屋の利益は「売った後」にこそある。**

お前、売りっぱなしにしてないか？
それ、カネを捨ててるのと一緒だぞ。

**【アフターで稼ぐ5つの仕組み】**

1. **延長保証を必ず提案しろ**
   - 原価安くて、粗利がデカい。最高の商品だ
   - 「万が一の時に安心ですよ」← これで客も嬉しい

2. **車検を自社に囲い込め**
   - 納車時に「次の車検もうちでやりますね」って言え
   - 車検のリマインドをLINEで送れ（半年前・3ヶ月前・1ヶ月前）
   - **車検で戻ってきた客は次の車もうちで買う**

3. **コーティングを売れ**
   - 原価2万、販売8万。粗利6万。
   - 「納車前に施工しておきますか？」の一言でOK

4. **オイル交換パックを作れ**
   - 年3回パックで9,800円とか。先にカネをもらえ
   - 定期的に来店する = 接点が増える = 次も買ってくれる

5. **保険の代理店になれ**
   - 任意保険を紹介するだけで手数料が入る
   - 「納車と一緒に保険も見直しましょうか？」

**【クレーム対応の鉄則】**
- 24時間以内に対応しろ。放置したら終わりだ
- まず「ご不便おかけしてすみません」から入れ
- 解決策を3つ提示しろ。客に選ばせろ
- **クレームをちゃんと処理した客は、最強のファンになる**

お前の店、車検の戻り率何%だ？
50%以下なら、今すぐLINEでリマインド送り始めろ。`
  }

  // --- 差別化・地域戦略（ランチェスター）---
  if (q.includes("差別化") || q.includes("競合") || q.includes("大手") || q.includes("ビッグモーター") || q.includes("ネクステージ") || q.includes("地域") || q.includes("特化") || q.includes("勝てない")) {
    return `大手に勝てない？ 当たり前だ。正面から戦うからだよ。

いいか、お前みたいな小さい店が大手に勝つ方法は1つしかねぇ。

**「狭い場所で1位を取れ」**

これ、ランチェスター戦略って言うんだけどな。
小難しい名前は忘れていい。要は **「得意分野で地域一番になれ」** ってことだ。

**【具体的にどうするか】**

1. **車種を1〜3種類に絞れ**
   - ジムニー専門、アルファード専門、軽自動車専門...何でもいい
   - **「○○市でジムニーならあの店」** を目指せ
   - 大手は品揃えで勝つ。お前は **深さ** で勝て

2. **半径10km以内のお客だけ狙え**
   - 全国相手にすんな。近所の客を全員取れ
   - 「地域名 + 車種名」で検索1位を目指せ（MEO・SEO）

3. **「人」で勝負しろ**
   - 大手にできなくて、お前にできることは **「顔が見える接客」** だ
   - 納車後に手書きのお礼状を送れ
   - 1ヶ月点検の電話を入れろ
   - **客の名前と家族構成を覚えろ**

4. **複合収入で利益を太くしろ**
   - 車両販売だけじゃ薄利。これを足せ：
   - 車検・整備・コーティング・保険・ドラレコ取付・板金
   - 1台あたり **車両粗利 + 付帯5〜10万** が理想

**大手が100台売って1人も顔を覚えてない間に、**
**お前は30台売って30人全員と友だちになれ。**
それが小さい店の勝ち方だ。

お前の店の「得意車種」は何だ？ 教えろ。一緒に戦略を立ててやる。`
  }

  // --- 資金繰り ---
  if (q.includes("資金") || q.includes("お金") || q.includes("ローン") || q.includes("借金") || q.includes("キャッシュ") || q.includes("運転資金")) {
    return `資金繰りの話か。...正直でいいぞ。ここ隠すヤツは死ぬ。

いいか、中古車屋の最大の敵は **「在庫にカネが寝ること」** だ。

**【資金繰り改善の鉄則】**

1. **在庫回転率を上げろ**
   - 目標は **月2回転** 。在庫30台なら月60台売れってんじゃねぇ
   - 在庫30台 × 平均単価60万 = 1,800万
   - これが30日で売れて1,800万戻ってくるのが「1回転」
   - 60日かかったら「0.5回転」。これじゃ死ぬ

2. **仕入れ単価を下げろ**
   - 高い車を1台持つより、安い車を3台持て
   - 軽自動車は回転が速い。低単価で回すのも戦略だ

3. **受注仕入れを増やせ**
   - 高額車は「注文もらってからAAで買う」
   - 在庫リスク **ゼロ** 。これ最強だぞ

4. **前金をもらえ**
   - 契約時に頭金or手付金をもらえ
   - 「準備費用として○万円お預かりします」でOK
   - キャッシュが入るタイミングを早めろ

5. **固定費を見直せ**
   - 家賃、人件費、広告費。全部見直せ
   - 特に **使ってない有料媒体** があったら今すぐ解約しろ

**【やっちゃいけないこと】**
- 在庫を増やして売上を増やそうとする ← 逆。資金ショートする
- 高い車で一発逆転を狙う ← ギャンブルだ。確実に死ぬ

まず教えろ。今の在庫台数と月間販売台数。
そこから一緒に計算してやる。`
  }

  // --- 知人・紹介で売る ---
  if (q.includes("知人") || q.includes("友達") || q.includes("紹介") || q.includes("媒体以外") || q.includes("直販")) {
    return `知人に売る、紹介で売る。**最高の商売だ。**

いいか、カーセンサーやグーネットに金払って問い合わせ取るのも大事だけどな、
**一番利益率が高いのは「知り合いに売る」「紹介で売る」** だ。

なぜか？ 広告費ゼロ。値引き交渉も少ない。信頼が最初からある。

**【知人・紹介販売を増やす7つの方法】**

1. **「俺、中古車屋やってんだ」を言いまくれ**
   - 飲み会、同窓会、子供の学校行事、全部営業の場だ
   - 名刺100枚持ち歩け

2. **LINEの友だちリスト全員に告知しろ**
   - 「車の相談いつでも乗ります！」ってタイムラインに投稿
   - 個別に送る必要はねぇ。見てるヤツは見てる

3. **紹介カードを作れ**
   - 名刺サイズで「ご紹介で○○特典！」って書いたカード
   - 納車時に5枚渡せ。「お知り合いにどうぞ」

4. **既存客に定期的に連絡しろ**
   - 3ヶ月に1回でいい。「お車の調子どうですか？」
   - **売り込むな。聞くだけでいい。** それだけで思い出してもらえる

5. **地元のコミュニティに顔を出せ**
   - 商工会、ロータリー、地元のイベント
   - 「中古車の○○です」って覚えてもらえたら勝ち

6. **お客の車の「写真」を撮ってプレゼントしろ**
   - 納車式の写真。キレイに撮ってLINEで送れ
   - お客はそれをSNSに上げる。**タダで宣伝してくれる**

7. **紹介してくれた人を「特別扱い」しろ**
   - 紹介者には必ずお礼（品物じゃなく電話1本でもいい）
   - 「○○さんのおかげで商売できてます」← これ最強

**媒体に月50万払うより、紹介を月5件もらう方が儲かる。マジで。**

今日やることは1つ。過去のお客リストを開いて、
一番仲良かった客に「お元気ですか？」ってLINE送れ。以上。`
  }

  // --- やる気がない・サボりたい ---
  if (q.includes("やる気") || q.includes("めんどくさい") || q.includes("面倒") || q.includes("疲れ") || q.includes("サボ") || q.includes("楽")) {
    return `はっはっは！ やる気ない？ めんどくさい？

**いいぞ。俺はそういうヤツが大好きだ。**

だってな、やる気満々で24時間働けるヤツなんかいねぇんだよ。
いたとしても、そいつは半年で潰れる。

いいか、本当に頭のいいヤツは **「楽して稼ぐ仕組み」** を作るんだ。

**【怠け者が勝つ3つの仕組み】**

1. **一回やったら自動で回る仕組みを作れ**
   - TikTok動画 → 1回撮ったら勝手に再生される
   - LINE自動返信 → 問い合わせに24時間対応
   - クチコミ → 一回書いてもらったら永遠に残る

2. **「やらなきゃいけないこと」を減らせ**
   - 在庫写真撮影 → テンプレ化しろ。毎回考えるな
   - 契約書類 → フォーマット作って使い回せ
   - SNS投稿 → 曜日ごとにテーマ決めろ（月:入荷、水:お客の声、金:豆知識）

3. **サボっても売れる状態を目指せ**
   - 紹介が毎月5件来る仕組みがあれば、お前が寝てても売れる
   - クチコミが50件あれば、勝手に信頼される
   - SNSフォロワーが1000人いれば、新入荷の告知で問い合わせが来る

**つまりな、今ちょっと頑張って仕組みを作れば、**
**半年後にはマジでサボっても売れるようになる。**

お前の「楽したい」って気持ち、正しいよ。
ただ「楽するための努力」だけはしろ。

今日のミッション、1個だけでいいからやれ。
何にする？ 俺が選んでやろうか？`
  }

  // --- 台数具体的に言ってきた場合 ---
  if (q.match(/\d+台/) || q.match(/\d+万/) || q.includes("台売") || q.includes("粗利")) {
    return `おう、数字出してきたな。いいぞ。

数字を言えるヤツは見込みがある。
言えないヤツは現実から逃げてるだけだ。

よし、じゃあ俺の頭で計算してやる。

**【お前の店の「勝ちパターン」を作るぞ】**

まずはこの公式を頭に叩き込め：

**月間利益 = 販売台数 × 1台あたり粗利 + 付帯収入 - 固定費**

例えば：
- 月10台 × 粗利30万 = 300万
- 付帯収入（コーティング・保険・車検）= +50万
- 固定費（家賃・人件費・広告費）= -200万
- **月間利益 = 150万円**

この150万が200万になるには？

方法A: 台数を12台に増やす（+60万で210万）
方法B: 粗利を35万に上げる（+50万で200万）
方法C: 付帯を100万に増やす（+50万で200万）

**俺のおすすめはCだ。** なぜか？
台数増やすのは仕入れリスクがある。
粗利上げると売れなくなるかもしれない。
でも付帯を増やすのは、 **今いる客に「もう一声」かけるだけ** だ。

コーティング1台8万、保険の手数料1台3万、ドラレコ取付1台1.5万。
これ全部やるだけで1台あたり+12.5万。月10台で+125万だ。

さぁ、お前の具体的な数字を教えろ。
台数、粗利、固定費。この3つで全部わかる。`
  }

  // --- できた・やった報告 ---
  if (q.includes("やった") || q.includes("できた") || q.includes("撮った") || q.includes("送った") || q.includes("作った") || q.includes("やりました") || q.includes("しました")) {
    return `...おう。やったのか。

**偉いぞ。マジで。**

いいか、世の中の9割のヤツは **「やろうと思った」で終わる** 。
実際にやるヤツは1割しかいねぇ。
お前は今、その1割に入ったんだ。

よし、じゃあ次のステップだ。
ちょっとだけレベル上げるぞ。ビビるな。

**【次のミッション】**

今やったことを **「習慣」にしろ。**

- 写真撮ったなら → **毎日1台** 撮れ。朝イチでやれ
- LINE送ったなら → **週3人** に送れ。月火水で1人ずつ
- SNS投稿したなら → **週3回** 投稿しろ。曜日を決めろ
- アカウント作ったなら → **プロフィールを完成させろ** 。写真・住所・電話番号全部入れろ

1回やるのは誰でもできる。
**続けられるヤツだけが勝つ。**

でもな、毎日やれとは言わねぇ。
**週3回、決まった曜日にやれ。** これだけでいい。

来週、「今週○回やりました」って報告しろ。
俺が褒めてやる。...たまにはな。

さぁ、次は何に取り組む？`
  }

  // ========================================
  // PART 3: デフォルト応答（文脈から最適な返答）
  // ========================================
  return `ほう...「${question}」か。

いいぞ、その悩み、俺に全部吐き出せ。

ただな、お前に1つ聞きたい。

**お前、今月いくら稼ぎたいんだ？**

数字で言え。「もっと」とか「たくさん」はナシだ。
「月に○台売って、粗利○万円」。これを言えるか？

言えないなら、そこが問題だ。
ゴールのないマラソンを走ってるようなもんだぞ。

とりあえず、今一番困ってることを **1つだけ** 教えろ：

- 在庫が売れない → 写真の撮り方から教えてやる
- 問い合わせが来ない → SNS・MEOで集客する方法を叩き込む
- 利益が薄い → 価格設定と付帯商品で粗利を守る方法を教える
- 紹介が来ない → 紹介プログラムの作り方を伝授する
- 資金繰りがキツい → 在庫回転率の改善策を出す
- 大手に勝てない → 小さい店だから勝てる戦い方がある
- SNSがわからない → TikTok・インスタの始め方を1からやる
- 何をすればいいかわからない → 3分でできるミッションから始める

1つだけだ。全部言うな。
全部やろうとするから全部中途半端になるんだよ。

さぁ、選べ。`
}

export function ConsultantChat() {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: INITIAL_MESSAGE,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const histories = loadChatHistory()
    setChatHistories(histories)
    if (histories.length > 0) {
      const lastChat = histories[0]
      setCurrentChatId(lastChat.id)
      setMessages(lastChat.messages)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const saveCurrentChat = (updatedMessages: Message[]) => {
    if (updatedMessages.length <= 1) return
    const now = new Date()
    let updatedHistories: ChatHistory[]
    if (currentChatId) {
      updatedHistories = chatHistories.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: updatedMessages, updatedAt: now } : chat
      )
    } else {
      const firstUserMessage = updatedMessages.find((m) => m.role === "user")
      const newChat: ChatHistory = {
        id: Date.now().toString(),
        title: firstUserMessage ? generateChatTitle(firstUserMessage.content) : "新しい相談",
        messages: updatedMessages,
        createdAt: now,
        updatedAt: now,
      }
      setCurrentChatId(newChat.id)
      updatedHistories = [newChat, ...chatHistories]
    }
    setChatHistories(updatedHistories)
    saveChatHistory(updatedHistories)
  }

  const handleSend = async (message?: string) => {
    const messageText = message || input
    if (!messageText.trim()) return
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsTyping(true)

    const userMessageCount = updatedMessages.filter((m) => m.role === "user").length

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateConsultantResponse(messageText, userMessageCount),
        timestamp: new Date(),
      }
      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)
      setIsTyping(false)
      saveCurrentChat(finalMessages)
    }, 1800)
  }

  const handleNewChat = () => {
    setCurrentChatId(null)
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: INITIAL_MESSAGE,
        timestamp: new Date(),
      },
    ])
  }

  const handleLoadChat = (chatId: string) => {
    const chat = chatHistories.find((c) => c.id === chatId)
    if (chat) {
      setCurrentChatId(chat.id)
      setMessages(chat.messages)
    }
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updatedHistories = chatHistories.filter((chat) => chat.id !== chatId)
    setChatHistories(updatedHistories)
    saveChatHistory(updatedHistories)
    if (currentChatId === chatId) handleNewChat()
  }

  return (
    <div className="flex h-full gap-4">
      {/* 履歴サイドバー */}
      <div className={cn("flex flex-col gap-4 transition-all duration-300", showHistory ? "w-80" : "w-0 overflow-hidden")}>
        {showHistory && (
          <Card className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <History className="h-4 w-4" />
                相談履歴
              </h2>
              <Button variant="ghost" size="sm" onClick={handleNewChat} className="gap-2">
                <Plus className="h-4 w-4" />
                新規
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {chatHistories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  まだ相談履歴がありません
                </p>
              ) : (
                chatHistories.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleLoadChat(chat.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-colors group hover:bg-accent",
                      currentChatId === chat.id ? "bg-accent border-primary" : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-3 w-3 flex-shrink-0" />
                          <p className="text-sm font-medium truncate">{chat.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {chat.updatedAt.toLocaleDateString("ja-JP", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>
        )}
      </div>

      {/* メインチャット */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-end">
          <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)} className="gap-2">
            <History className="h-4 w-4" />
            {showHistory ? "履歴を非表示" : "履歴を表示"}
          </Button>
        </div>

        <Card className="flex flex-1 flex-col overflow-hidden border-red-500/20">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex-shrink-0">
                    <Flame className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4 whitespace-pre-wrap",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex-shrink-0">
                  <Flame className="h-4 w-4 text-white" />
                </div>
                <div className="max-w-[80%] rounded-lg bg-muted p-4">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* おすすめトピック */}
          {messages.length === 1 && (
            <div className="border-t border-border bg-muted/30 p-4">
              <p className="text-sm font-medium mb-3 text-muted-foreground">今のお悩みは？</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((topic, index) => (
                  <Button key={index} variant="outline" size="sm" className="gap-2 border-red-500/30 hover:bg-red-500/10 hover:text-red-600" onClick={() => handleSend(topic.text)}>
                    <topic.icon className="h-4 w-4" />
                    {topic.text}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 入力欄 */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="悩みを吐き出せ..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="flex-1"
              />
              <Button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
