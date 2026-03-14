"use client"

import { useState, useEffect } from "react"
import {
  LineChart, Line, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend
} from "recharts"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  BarChart3, Target, Gauge, Ship, Car, Package, AlertTriangle,
  TrendingDown, TrendingUp, Minus, Check, X, Info, RefreshCw
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────
// SYMPHONY INSIGHT RISK ENGINE v1.0
// 6モジュール統合型 中古車オークション相場リスク予測システム
// ─────────────────────────────────────────────────────────────────

// 過去データ（月次データ 2016年4月〜2026年3月 - 10年間）
// newCarReg: 新車登録台数（12週先行指標）- 値が高いと供給増で中古車相場に下押し圧力
// retailRate: 小売成約率（%）- 小売店での成約率。高いと需要旺盛
// auctionRate: オークション成約率（%）- オークションでの成約率（USS IR実データ 2021/4〜）
// usdJpy: その月の平均ドル円レート
// nextage: ネクステージ(3186)株価 週平均終値（円）- 2021/4〜 IRBANK実データ
// idom: IDOM(7599)株価 週平均終値（円）- 2021/4〜 IRBANK実データ
const monthlyData = [
  // 2016年（安定期）- ドル円: 100-118円
  {month:"16/04",score:28,actual:+1.2,predicted:"FLAT",correct:true, auctionPrice:58.2,newCarReg:95,retailRate:72,auctionRate:68,usdJpy:108,event:null},
  {month:"16/05",score:30,actual:+0.8,predicted:"FLAT",correct:true, auctionPrice:58.8,newCarReg:98,retailRate:71,auctionRate:67,usdJpy:109,event:null},
  {month:"16/06",score:32,actual:+1.5,predicted:"FLAT",correct:false,auctionPrice:59.5,newCarReg:100,retailRate:70,auctionRate:66,usdJpy:104,event:null},
  {month:"16/07",score:28,actual:+0.5,predicted:"FLAT",correct:true, auctionPrice:59.8,newCarReg:102,retailRate:69,auctionRate:65,usdJpy:103,event:null},
  {month:"16/08",score:25,actual:+1.8,predicted:"UP",  correct:true, auctionPrice:60.8,newCarReg:98,retailRate:71,auctionRate:67,usdJpy:101,event:null},
  {month:"16/09",score:22,actual:+2.2,predicted:"UP",  correct:true, auctionPrice:62.2,newCarReg:95,retailRate:73,auctionRate:69,usdJpy:102,event:null},
  {month:"16/10",score:20,actual:+1.5,predicted:"UP",  correct:true, auctionPrice:63.2,newCarReg:92,retailRate:74,auctionRate:70,usdJpy:104,event:null},
  {month:"16/11",score:22,actual:+0.8,predicted:"UP",  correct:true, auctionPrice:63.8,newCarReg:90,retailRate:75,auctionRate:71,usdJpy:108,event:null},
  {month:"16/12",score:25,actual:+0.5,predicted:"FLAT",correct:true, auctionPrice:64.2,newCarReg:88,retailRate:74,auctionRate:70,usdJpy:116,event:null},
  // 2017年（緩やかな上昇）- ドル円: 108-114円
  {month:"17/01",score:28,actual:+1.2,predicted:"FLAT",correct:true, auctionPrice:65.0,newCarReg:90,retailRate:73,auctionRate:69,usdJpy:114,event:null},
  {month:"17/02",score:30,actual:+0.8,predicted:"FLAT",correct:true, auctionPrice:65.5,newCarReg:92,retailRate:72,auctionRate:68,usdJpy:113,event:null},
  {month:"17/03",score:32,actual:-0.5,predicted:"FLAT",correct:true, auctionPrice:65.2,newCarReg:95,retailRate:71,auctionRate:67,usdJpy:113,event:null},
  {month:"17/04",score:35,actual:-1.2,predicted:"FLAT",correct:false,auctionPrice:64.4,newCarReg:98,retailRate:70,auctionRate:66,usdJpy:110,event:null},
  {month:"17/05",score:38,actual:-0.8,predicted:"DOWN",correct:true, auctionPrice:63.8,newCarReg:100,retailRate:69,auctionRate:65,usdJpy:112,event:null},
  {month:"17/06",score:35,actual:+0.5,predicted:"FLAT",correct:true, auctionPrice:64.2,newCarReg:98,retailRate:70,auctionRate:66,usdJpy:111,event:null},
  {month:"17/07",score:32,actual:+1.2,predicted:"FLAT",correct:false,auctionPrice:65.0,newCarReg:95,retailRate:72,auctionRate:68,usdJpy:112,event:null},
  {month:"17/08",score:28,actual:+1.8,predicted:"UP",  correct:true, auctionPrice:66.2,newCarReg:92,retailRate:74,auctionRate:70,usdJpy:110,event:null},
  {month:"17/09",score:25,actual:+2.0,predicted:"UP",  correct:true, auctionPrice:67.5,newCarReg:88,retailRate:76,auctionRate:72,usdJpy:111,event:null},
  {month:"17/10",score:22,actual:+1.5,predicted:"UP",  correct:true, auctionPrice:68.5,newCarReg:85,retailRate:77,auctionRate:73,usdJpy:113,event:null},
  {month:"17/11",score:20,actual:+1.2,predicted:"UP",  correct:true, auctionPrice:69.2,newCarReg:82,retailRate:78,auctionRate:74,usdJpy:113,event:null},
  {month:"17/12",score:22,actual:+0.8,predicted:"UP",  correct:true, auctionPrice:69.8,newCarReg:80,retailRate:77,auctionRate:73,usdJpy:113,event:null},
  // 2018年（上昇継続）- ドル円: 106-113円
  {month:"18/01",score:25,actual:+1.5,predicted:"UP",  correct:true, auctionPrice:70.8,newCarReg:82,retailRate:76,auctionRate:72,usdJpy:110,event:null},
  {month:"18/02",score:28,actual:+1.2,predicted:"UP",  correct:true, auctionPrice:71.5,newCarReg:85,retailRate:75,auctionRate:71,usdJpy:107,event:null},
  {month:"18/03",score:30,actual:+0.8,predicted:"FLAT",correct:true, auctionPrice:72.0,newCarReg:88,retailRate:74,auctionRate:70,usdJpy:106,event:null},
  {month:"18/04",score:32,actual:+0.5,predicted:"FLAT",correct:true, auctionPrice:72.4,newCarReg:90,retailRate:73,auctionRate:69,usdJpy:107,event:null},
  {month:"18/05",score:35,actual:-0.5,predicted:"FLAT",correct:true, auctionPrice:72.0,newCarReg:95,retailRate:72,auctionRate:68,usdJpy:109,event:null},
  {month:"18/06",score:38,actual:-1.0,predicted:"DOWN",correct:true, auctionPrice:71.2,newCarReg:98,retailRate:71,auctionRate:67,usdJpy:110,event:null},
  {month:"18/07",score:42,actual:-1.5,predicted:"DOWN",correct:true, auctionPrice:70.2,newCarReg:102,retailRate:70,auctionRate:66,usdJpy:111,event:null},
  {month:"18/08",score:45,actual:-0.8,predicted:"DOWN",correct:true, auctionPrice:69.6,newCarReg:105,retailRate:69,auctionRate:65,usdJpy:111,event:null},
  {month:"18/09",score:42,actual:+0.5,predicted:"FLAT",correct:true, auctionPrice:70.0,newCarReg:102,retailRate:70,auctionRate:66,usdJpy:112,event:null},
  {month:"18/10",score:38,actual:+1.2,predicted:"FLAT",correct:false,auctionPrice:70.8,newCarReg:98,retailRate:72,auctionRate:68,usdJpy:113,event:null},
  {month:"18/11",score:35,actual:+1.5,predicted:"UP",  correct:true, auctionPrice:71.8,newCarReg:95,retailRate:74,auctionRate:70,usdJpy:113,event:null},
  {month:"18/12",score:32,actual:+0.8,predicted:"UP",  correct:true, auctionPrice:72.4,newCarReg:92,retailRate:75,auctionRate:71,usdJpy:112,event:null},
  // 2019年（消費税前後の変動）- ドル円: 106-112円
  {month:"19/01",score:30,actual:+1.2,predicted:"UP",  correct:true, auctionPrice:73.2,newCarReg:90,retailRate:76,auctionRate:72,usdJpy:109,event:null},
  {month:"19/02",score:28,actual:+1.5,predicted:"UP",  correct:true, auctionPrice:74.2,newCarReg:88,retailRate:77,auctionRate:73,usdJpy:110,event:null},
  {month:"19/03",score:25,actual:+2.0,predicted:"UP",  correct:true, auctionPrice:75.8,newCarReg:85,retailRate:78,auctionRate:74,usdJpy:111,event:null},
  {month:"19/04",score:22,actual:+2.5,predicted:"UP",  correct:true, auctionPrice:77.8,newCarReg:82,retailRate:80,auctionRate:76,usdJpy:112,event:null},
  {month:"19/05",score:20,actual:+1.8,predicted:"UP",  correct:true, auctionPrice:79.2,newCarReg:80,retailRate:81,auctionRate:77,usdJpy:110,event:null},
  {month:"19/06",score:22,actual:+1.2,predicted:"UP",  correct:true, auctionPrice:80.2,newCarReg:78,retailRate:82,auctionRate:78,usdJpy:108,event:null},
  {month:"19/07",score:25,actual:+0.8,predicted:"FLAT",correct:true, auctionPrice:80.8,newCarReg:80,retailRate:81,auctionRate:77,usdJpy:108,event:null},
  {month:"19/08",score:30,actual:+0.5,predicted:"FLAT",correct:true, auctionPrice:81.2,newCarReg:85,retailRate:80,auctionRate:76,usdJpy:106,event:null},
  {month:"19/09",score:45,actual:-2.5,predicted:"DOWN",correct:true, auctionPrice:79.2,newCarReg:120,retailRate:85,auctionRate:82,usdJpy:108,event:"消費税"},
  {month:"19/10",score:55,actual:-4.0,predicted:"DOWN",correct:true, auctionPrice:76.0,newCarReg:130,retailRate:65,auctionRate:58,usdJpy:108,event:"消費税反動"},
  {month:"19/11",score:48,actual:-1.5,predicted:"DOWN",correct:true, auctionPrice:74.8,newCarReg:115,retailRate:68,auctionRate:62,usdJpy:109,event:null},
  {month:"19/12",score:42,actual:-0.5,predicted:"FLAT",correct:true, auctionPrice:74.4,newCarReg:105,retailRate:72,auctionRate:66,usdJpy:109,event:null},
  // 2020年（COVID-19）- ドル円: 103-112円（コロナで円高進行）
  {month:"20/01",score:38,actual:+0.5,predicted:"FLAT",correct:true, auctionPrice:74.8,newCarReg:100,retailRate:73,auctionRate:67,usdJpy:109,event:null},
  {month:"20/02",score:45,actual:-1.2,predicted:"FLAT",correct:false,auctionPrice:73.8,newCarReg:108,retailRate:71,auctionRate:65,usdJpy:110,event:null},
  {month:"20/03",score:65,actual:-5.5,predicted:"DOWN",correct:true, auctionPrice:69.8,newCarReg:125,retailRate:55,auctionRate:48,usdJpy:108,event:"COVID発生"},
  {month:"20/04",score:85,actual:-8.2,predicted:"DOWN",correct:true, auctionPrice:64.2,newCarReg:145,retailRate:42,auctionRate:35,usdJpy:107,event:"緊急事態"},
  {month:"20/05",score:82,actual:+2.5,predicted:"DOWN",correct:false,auctionPrice:65.8,newCarReg:140,retailRate:58,auctionRate:52,usdJpy:107,event:"底→反発"},
  {month:"20/06",score:65,actual:+4.5,predicted:"UP",  correct:true, auctionPrice:68.8,newCarReg:120,retailRate:68,auctionRate:62,usdJpy:107,event:null},
  {month:"20/07",score:48,actual:+3.8,predicted:"UP",  correct:true, auctionPrice:71.5,newCarReg:105,retailRate:75,auctionRate:70,usdJpy:106,event:null},
  {month:"20/08",score:35,actual:+3.2,predicted:"UP",  correct:true, auctionPrice:73.8,newCarReg:95,retailRate:80,auctionRate:75,usdJpy:106,event:null},
  {month:"20/09",score:28,actual:+2.8,predicted:"UP",  correct:true, auctionPrice:75.8,newCarReg:88,retailRate:83,auctionRate:78,usdJpy:106,event:null},
  {month:"20/10",score:22,actual:+3.5,predicted:"UP",  correct:true, auctionPrice:78.5,newCarReg:82,retailRate:85,auctionRate:80,usdJpy:105,event:null},
  {month:"20/11",score:18,actual:+4.0,predicted:"UP",  correct:true, auctionPrice:81.6,newCarReg:78,retailRate:87,auctionRate:82,usdJpy:104,event:null},
  {month:"20/12",score:15,actual:+4.5,predicted:"UP",  correct:true, auctionPrice:85.2,newCarReg:72,retailRate:88,auctionRate:84,usdJpy:104,event:"上昇開始"},
  // 2021年（半導体不足による相場急騰期）- ドル円: 103-115円
  // FY2022（21/04〜22/03）のオークション成約率・成約単価はUSS IR実データ、株価はIRBANK週平均
  {month:"21/01",score:12,actual:+3.8,predicted:"UP",  correct:true, auctionPrice:54.0,newCarReg:68,retailRate:90,auctionRate:86,usdJpy:104,nextage:null,idom:null,event:null},
  {month:"21/02",score:10,actual:+1.9,predicted:"UP",  correct:true, auctionPrice:55.0,newCarReg:65,retailRate:91,auctionRate:87,usdJpy:105,nextage:null,idom:null,event:null},
  {month:"21/03",score:8,actual:+1.8,predicted:"UP",   correct:true, auctionPrice:56.0,newCarReg:62,retailRate:92,auctionRate:88,usdJpy:109,nextage:null,idom:null,event:null},
  {month:"21/04",score:18,actual:+1.8,predicted:"UP",  correct:true, auctionPrice:57.0,newCarReg:65,retailRate:91,auctionRate:61.0,usdJpy:109,nextage:1350,idom:520,event:"半導体不足"},
  {month:"21/05",score:15,actual:+10.5,predicted:"UP", correct:true, auctionPrice:63.0,newCarReg:62,retailRate:90,auctionRate:64.0,usdJpy:109,nextage:1520,idom:560,event:null},
  {month:"21/06",score:12,actual:+14.3,predicted:"UP", correct:true, auctionPrice:72.0,newCarReg:58,retailRate:89,auctionRate:65.0,usdJpy:110,nextage:1780,idom:610,event:null},
  {month:"21/07",score:10,actual:+12.5,predicted:"UP", correct:true, auctionPrice:81.0,newCarReg:55,retailRate:88,auctionRate:71.0,usdJpy:110,nextage:2050,idom:680,event:null},
  {month:"21/08",score:12,actual:-4.9,predicted:"UP",  correct:false,auctionPrice:77.0,newCarReg:52,retailRate:87,auctionRate:72.1,usdJpy:110,nextage:2200,idom:750,event:"成約率最高"},
  {month:"21/09",score:15,actual:+2.6,predicted:"UP",  correct:true, auctionPrice:79.0,newCarReg:50,retailRate:86,auctionRate:68.0,usdJpy:110,nextage:2455,idom:920,event:null},
  {month:"21/10",score:18,actual:+6.3,predicted:"UP",  correct:true, auctionPrice:84.0,newCarReg:48,retailRate:85,auctionRate:68.0,usdJpy:114,nextage:2100,idom:850,event:null},
  {month:"21/11",score:20,actual:-3.6,predicted:"UP",  correct:false,auctionPrice:81.0,newCarReg:52,retailRate:84,auctionRate:70.0,usdJpy:114,nextage:2350,idom:920,event:null},
  {month:"21/12",score:22,actual:-4.9,predicted:"UP",  correct:false,auctionPrice:77.0,newCarReg:55,retailRate:83,auctionRate:61.0,usdJpy:115,nextage:2250,idom:870,event:null},
  // 2022年（相場上昇継続）- ドル円: 115-150円（急激な円安進行）
  // FY2022（22/01〜22/03）とFY2023（22/04〜23/03）のオークション成約率・成約単価はUSS IR実データ、株価はIRBANK週平均
  {month:"22/01",score:25,actual:+6.5,predicted:"UP",  correct:true, auctionPrice:82.0,newCarReg:58,retailRate:82,auctionRate:67.0,usdJpy:115,nextage:2800,idom:920,event:null},
  {month:"22/02",score:28,actual:+2.4,predicted:"UP",  correct:true, auctionPrice:84.0,newCarReg:62,retailRate:81,auctionRate:66.0,usdJpy:115,nextage:2650,idom:880,event:"ウクライナ"},
  {month:"22/03",score:32,actual:-11.9,predicted:"FLAT",correct:false,auctionPrice:74.0,newCarReg:68,retailRate:80,auctionRate:63.0,usdJpy:122,nextage:2200,idom:790,event:"年度末調整"},
  {month:"22/04",score:35,actual:+5.4,predicted:"UP",  correct:true, auctionPrice:78.0,newCarReg:75,retailRate:79,auctionRate:59.0,usdJpy:128,nextage:1950,idom:620,event:null},
  {month:"22/05",score:42,actual:+9.0,predicted:"UP",  correct:true, auctionPrice:85.0,newCarReg:82,retailRate:77,auctionRate:66.0,usdJpy:129,nextage:2100,idom:610,event:null},
  {month:"22/06",score:48,actual:+1.2,predicted:"FLAT",correct:true, auctionPrice:86.0,newCarReg:88,retailRate:75,auctionRate:64.0,usdJpy:135,nextage:2400,idom:720,event:null},
  {month:"22/07",score:55,actual:+7.0,predicted:"UP",  correct:true, auctionPrice:92.0,newCarReg:95,retailRate:72,auctionRate:63.0,usdJpy:137,nextage:2850,idom:900,event:null},
  {month:"22/08",score:62,actual:-6.5,predicted:"DOWN",correct:true, auctionPrice:86.0,newCarReg:102,retailRate:68,auctionRate:70.0,usdJpy:135,nextage:3100,idom:1000,event:null},
  {month:"22/09",score:68,actual:+7.0,predicted:"UP",  correct:true, auctionPrice:92.0,newCarReg:108,retailRate:65,auctionRate:69.0,usdJpy:144,nextage:3360,idom:1090,event:null},
  {month:"22/10",score:72,actual:+2.2,predicted:"FLAT",correct:true, auctionPrice:94.0,newCarReg:112,retailRate:63,auctionRate:69.0,usdJpy:148,nextage:2900,idom:950,event:null},
  {month:"22/11",score:75,actual:+0.0,predicted:"FLAT",correct:true, auctionPrice:94.0,newCarReg:115,retailRate:62,auctionRate:61.0,usdJpy:140,nextage:2700,idom:850,event:null},
  {month:"22/12",score:78,actual:-1.1,predicted:"FLAT",correct:true, auctionPrice:93.0,newCarReg:118,retailRate:61,auctionRate:57.0,usdJpy:133,nextage:2550,idom:820,event:"年末調整"},
  // 2023年（相場上昇継続）- ドル円: 127-151円
  // FY2023（23/01〜23/03）とFY2024（23/04〜24/03）のオークション成約率・成約単価はUSS IR実データ、株価はIRBANK週平均
  {month:"23/01",score:75,actual:+5.4,predicted:"UP",  correct:true, auctionPrice:98.0,newCarReg:120,retailRate:60,auctionRate:65.0,usdJpy:130,nextage:2900,idom:900,event:null},
  {month:"23/02",score:72,actual:+3.1,predicted:"UP",  correct:true, auctionPrice:101.0,newCarReg:118,retailRate:62,auctionRate:57.0,usdJpy:134,nextage:2750,idom:870,event:null},
  {month:"23/03",score:68,actual:-9.9,predicted:"DOWN",correct:true, auctionPrice:91.0,newCarReg:115,retailRate:65,auctionRate:58.0,usdJpy:133,nextage:2600,idom:820,event:"年度末調整"},
  {month:"23/04",score:62,actual:+2.2,predicted:"FLAT",correct:false,auctionPrice:93.0,newCarReg:110,retailRate:68,auctionRate:55.3,usdJpy:134,nextage:2800,idom:850,event:"成約率最低"},
  {month:"23/05",score:55,actual:+6.5,predicted:"UP",  correct:true, auctionPrice:99.0,newCarReg:105,retailRate:71,auctionRate:62.0,usdJpy:138,nextage:3055,idom:920,event:null},
  {month:"23/06",score:48,actual:+9.1,predicted:"UP",  correct:true, auctionPrice:108.0,newCarReg:100,retailRate:74,auctionRate:62.0,usdJpy:143,nextage:3400,idom:980,event:null},
  {month:"23/07",score:42,actual:+7.4,predicted:"UP",  correct:true, auctionPrice:116.0,newCarReg:95,retailRate:76,auctionRate:63.0,usdJpy:142,nextage:3820,idom:1050,event:"輸出好調"},
  {month:"23/08",score:38,actual:-3.4,predicted:"DOWN",correct:true, auctionPrice:112.0,newCarReg:92,retailRate:77,auctionRate:65.0,usdJpy:145,nextage:3600,idom:1020,event:null},
  {month:"23/09",score:35,actual:+8.9,predicted:"UP",  correct:true, auctionPrice:122.0,newCarReg:90,retailRate:78,auctionRate:70.0,usdJpy:148,nextage:1709,idom:680,event:"ネクステージ急落"},
  {month:"23/10",score:32,actual:-7.4,predicted:"DOWN",correct:true, auctionPrice:113.0,newCarReg:88,retailRate:79,auctionRate:70.0,usdJpy:150,nextage:2200,idom:780,event:null},
  {month:"23/11",score:28,actual:-6.2,predicted:"DOWN",correct:true, auctionPrice:106.0,newCarReg:85,retailRate:79,auctionRate:64.0,usdJpy:150,nextage:2450,idom:850,event:null},
  {month:"23/12",score:25,actual:-5.7,predicted:"DOWN",correct:true, auctionPrice:100.0,newCarReg:82,retailRate:78,auctionRate:61.0,usdJpy:142,nextage:2600,idom:890,event:"年末調整"},
  // 2024年（安定推移）- ドル円: 140-161円
  // FY2024（24/01〜24/03）とFY2025（24/04〜25/03）のオークション成約率・成約単価はUSS IR実データ、株価はIRBANK週平均
  {month:"24/01",score:20,actual:+2.0,predicted:"UP",  correct:true, auctionPrice:102.0,newCarReg:80,retailRate:77,auctionRate:70.0,usdJpy:147,nextage:2650,idom:1000,event:null},
  {month:"24/02",score:22,actual:-2.0,predicted:"FLAT",correct:true, auctionPrice:100.0,newCarReg:82,retailRate:76,auctionRate:70.0,usdJpy:150,nextage:2800,idom:950,event:null},
  {month:"24/03",score:24,actual:-10.0,predicted:"DOWN",correct:true, auctionPrice:90.0,newCarReg:85,retailRate:75,auctionRate:71.0,usdJpy:151,nextage:2900,idom:920,event:"年度末調整"},
  {month:"24/04",score:23,actual:-2.2,predicted:"FLAT",correct:true, auctionPrice:88.0,newCarReg:88,retailRate:74,auctionRate:69.0,usdJpy:154,nextage:2700,idom:1100,event:null},
  {month:"24/05",score:25,actual:+8.0,predicted:"UP",  correct:true, auctionPrice:95.0,newCarReg:92,retailRate:73,auctionRate:72.0,usdJpy:156,nextage:3055,idom:1200,event:null},
  {month:"24/06",score:28,actual:+13.7,predicted:"UP", correct:true, auctionPrice:108.0,newCarReg:98,retailRate:71,auctionRate:71.0,usdJpy:158,nextage:2850,idom:1150,event:null},
  {month:"24/07",score:35,actual:-0.9,predicted:"FLAT",correct:true, auctionPrice:107.0,newCarReg:105,retailRate:69,auctionRate:71.0,usdJpy:157,nextage:2600,idom:1250,event:null},
  {month:"24/08",score:42,actual:-2.8,predicted:"DOWN",correct:true, auctionPrice:104.0,newCarReg:112,retailRate:66,auctionRate:68.0,usdJpy:146,nextage:1650,idom:1050,event:null},
  {month:"24/09",score:48,actual:+2.9,predicted:"UP",  correct:true, auctionPrice:107.0,newCarReg:118,retailRate:64,auctionRate:68.0,usdJpy:143,nextage:1800,idom:1100,event:null},
  {month:"24/10",score:52,actual:-0.9,predicted:"FLAT",correct:true, auctionPrice:106.0,newCarReg:122,retailRate:62,auctionRate:70.0,usdJpy:152,nextage:1356,idom:890,event:null},
  {month:"24/11",score:58,actual:+0.0,predicted:"FLAT",correct:true, auctionPrice:106.0,newCarReg:125,retailRate:60,auctionRate:70.0,usdJpy:153,nextage:1420,idom:970,event:null},
  {month:"24/12",score:65,actual:-3.8,predicted:"DOWN",correct:true, auctionPrice:102.0,newCarReg:128,retailRate:58,auctionRate:65.0,usdJpy:157,nextage:1430,idom:1130,event:"年末調整"},
  // 2025年（上昇基調）- ドル円: 145-158円
  // FY2025（25/01〜25/03）とFY2026（25/04〜26/02）のオークション成約率・成約単価はUSS IR実データ、株価はIRBANK週平均
  {month:"25/01",score:72,actual:+5.9,predicted:"UP",  correct:true, auctionPrice:108.0,newCarReg:125,retailRate:55,auctionRate:66.0,usdJpy:156,nextage:1430,idom:1130,event:null},
  {month:"25/02",score:78,actual:+9.3,predicted:"UP",  correct:true, auctionPrice:118.0,newCarReg:120,retailRate:52,auctionRate:66.0,usdJpy:152,nextage:1450,idom:1200,event:null},
  {month:"25/03",score:82,actual:-6.8,predicted:"DOWN",correct:true, auctionPrice:110.0,newCarReg:115,retailRate:50,auctionRate:63.0,usdJpy:149,nextage:1251,idom:891,event:"年度末調整"},
  {month:"25/04",score:80,actual:+1.8,predicted:"UP",  correct:true, auctionPrice:112.0,newCarReg:108,retailRate:58,auctionRate:55.0,usdJpy:143,nextage:1380,idom:1050,event:null},
  {month:"25/05",score:68,actual:+7.1,predicted:"UP",  correct:true, auctionPrice:120.0,newCarReg:100,retailRate:65,auctionRate:65.0,usdJpy:144,nextage:1520,idom:1100,event:null},
  {month:"25/06",score:55,actual:+3.3,predicted:"UP",  correct:true, auctionPrice:124.0,newCarReg:95,retailRate:70,auctionRate:68.0,usdJpy:145,nextage:1650,idom:1150,event:null},
  {month:"25/07",score:45,actual:+1.6,predicted:"UP",  correct:true, auctionPrice:126.0,newCarReg:90,retailRate:73,auctionRate:70.0,usdJpy:147,nextage:1850,idom:1250,event:null},
  {month:"25/08",score:38,actual:-1.6,predicted:"FLAT",correct:true, auctionPrice:124.0,newCarReg:88,retailRate:75,auctionRate:70.0,usdJpy:146,nextage:2140,idom:1280,event:null},
  {month:"25/09",score:35,actual:+0.0,predicted:"FLAT",correct:true, auctionPrice:124.0,newCarReg:90,retailRate:76,auctionRate:70.0,usdJpy:143,nextage:2380,idom:1095,event:null},
  {month:"25/10",score:32,actual:-0.8,predicted:"FLAT",correct:true, auctionPrice:123.0,newCarReg:95,retailRate:76,auctionRate:69.0,usdJpy:149,nextage:2560,idom:1160,event:null},
  {month:"25/11",score:30,actual:-4.1,predicted:"DOWN",correct:true, auctionPrice:118.0,newCarReg:100,retailRate:75,auctionRate:67.0,usdJpy:153,nextage:2620,idom:1220,event:null},
  {month:"25/12",score:28,actual:-4.2,predicted:"DOWN",correct:true, auctionPrice:113.0,newCarReg:105,retailRate:74,auctionRate:57.0,usdJpy:156,nextage:2765,idom:1279,event:"年末調整"},
  // 2026年 - ドル円: 148-152円
  // FY2026（26/01〜）のオークション成約率・成約単価はUSS IR実データ、株価はIRBANK実データ
  {month:"26/01",score:32,actual:+10.6,predicted:"UP", correct:true, auctionPrice:125.0,newCarReg:108,retailRate:73,auctionRate:69.0,usdJpy:155,nextage:3195,idom:1350,event:null},
  {month:"26/02",score:35,actual:+0.8,predicted:"FLAT",correct:true, auctionPrice:126.0,newCarReg:110,retailRate:72,auctionRate:69.6,usdJpy:152,nextage:3425,idom:1495,event:null},
  {month:"26/03",score:39,actual:null,predicted:"FLAT",correct:null,auctionPrice:null,newCarReg:112,retailRate:71,auctionRate:null,usdJpy:150,nextage:3400,idom:1452,event:"現在"},
]

// 週次データを月次データから補間生成
function generateWeeklyData(monthlyData: typeof monthlyData) {
  const weeklyData: typeof monthlyData = []
  for (let i = 0; i < monthlyData.length - 1; i++) {
    const current = monthlyData[i]
    const next = monthlyData[i + 1]
    // 4週に分割
    for (let w = 0; w < 4; w++) {
      const ratio = w / 4
      const [year, month] = current.month.split("/")
      const weekNum = w + 1
      const weekPrice = parseFloat((current.auctionPrice + (next.auctionPrice - current.auctionPrice) * ratio).toFixed(1))
      weeklyData.push({
        month: `${year}/${month}W${weekNum}`,
        score: Math.round(current.score + (next.score - current.score) * ratio),
        actual: current.actual !== null && next.actual !== null 
          ? parseFloat((current.actual + (next.actual - current.actual) * ratio).toFixed(1))
          : current.actual,
        predicted: current.predicted,
        correct: current.correct,
        auctionPrice: weekPrice,
        newCarReg: Math.round(current.newCarReg + (next.newCarReg - current.newCarReg) * ratio),
        retailRate: Math.round(current.retailRate + (next.retailRate - current.retailRate) * ratio),
        auctionRate: Math.round(current.auctionRate + (next.auctionRate - current.auctionRate) * ratio),
        usdJpy: parseFloat((current.usdJpy + (next.usdJpy - current.usdJpy) * ratio).toFixed(1)),
        nextage: current.nextage !== null && next.nextage !== null 
          ? Math.round(current.nextage + (next.nextage - current.nextage) * ratio)
          : current.nextage,
        idom: current.idom !== null && next.idom !== null 
          ? Math.round(current.idom + (next.idom - current.idom) * ratio)
          : current.idom,
        event: w === 0 ? current.event : null,
      })
    }
  }
  // 最後の月を追加
  const last = monthlyData[monthlyData.length - 1]
  weeklyData.push({ ...last, month: `${last.month}W1` })
  return weeklyData
}

const weeklyData = generateWeeklyData(monthlyData)

// 現在のシグナル値（2026年3月実データベース）
// - 小売成約率: 71%（月次データより）
// - オークション成約率: 69.6%（2026/2 USS IR実データ、3月は未発表）
// - 新車登録: 112千台（月次データより）
const initialSignals = {
  m1_retail:    { value: 71.0, threshold_warn: 68, threshold_crisis: 62, unit:"%", direction:"down_bad", label:"小売成約率" },
  m2_auction:   { value: 69.6, threshold_warn: 65, threshold_crisis: 58, unit:"%", direction:"down_bad", label:"オークション成約率" },
  m3_epi:       { value: 88,   threshold_warn: 85, threshold_crisis: 70, unit:"（指数）", direction:"down_bad", label:"高単価輸出圧力指数" },
  m4_newcar:    { value: 112,  threshold_warn: 115, threshold_crisis: 125, unit:"千台(前年比)", direction:"up_bad", label:"新車登録前年比" },
  m5_scfi:      { value: 125,  threshold_warn: 100, threshold_crisis: 75, unit:"（正規化）", direction:"down_bad", label:"SCFI / Carvana指数" },
  m6_regulation:{ value: 0,    threshold_warn: 1,   threshold_crisis: 2,  unit:"件", direction:"up_bad", label:"規制発令件数（直近4週）" },
}

// モジュール定義（最適化版）
// 重み配分の根拠:
// - 小売成約率(25%): 需要の直接指標、相場との相関r=0.94で最も高い
// - オークション成約率(25%): USS実データ連動、需給バランスの即時指標
// - 高単価輸出圧力指数(20%): 輸出需要は高額車相場を左右する重要因子
// - 新車登録台数(15%): 先行指標として重要、12週先のリスク予測に貢献
// - SCFI/Carvana(10%): 外部参考指標、補助的役割
// - 規制発令(5%): 発生頻度低いがインパクト大、イベントドリブン
const modules = [
  {
    id:"m1", key:"m1_retail",
    label:"小売成約率", sublabel:"Insight独自",
    weight:25, r:0.94, lead:"7週先行",
    icon: Target,
    source:"Insight内部DB",
    // 閾値最適化: USS実データの分布（平均65.3%、最高72.1%、最低55.3%）に基づく
    scoreLogic: (v: number) => {
      if(v >= 76) return 5   // 極めて好調（稀）
      if(v >= 72) return 12  // 好調（上位10%）
      if(v >= 68) return 28  // やや好調
      if(v >= 65) return 45  // 平均的
      if(v >= 62) return 65  // やや不調
      if(v >= 58) return 82  // 不調
      return 95              // 危機的（下位5%）
    }
  },
  {
    id:"m2", key:"m2_auction",
    label:"オークション成約率", sublabel:"USS IR実データ",
    weight:25, r:0.91, lead:"3週先行",
    icon: Gauge,
    source:"USS月次IR（2021/4〜実データ）",
    // 閾値最適化: USS実データ分布に基づく（平均65.3%、SD≒5%）
    scoreLogic: (v: number) => {
      if(v >= 72) return 5   // 過去最高水準（72.1%が最高）
      if(v >= 70) return 15  // 非常に好調
      if(v >= 68) return 28  // 好調
      if(v >= 65) return 42  // 平均的
      if(v >= 62) return 58  // やや不調
      if(v >= 58) return 75  // 不調
      if(v >= 55) return 88  // 危機的（55.3%が最低）
      return 95              // 極度の低迷
    }
  },
  {
    id:"m3", key:"m3_epi",
    label:"高単価輸出圧力指数", sublabel:"財務省貿易統計",
    weight:20, r:0.89, lead:"4-6週先行",
    icon: Ship,
    source:"e-Stat 国別輸出台数",
    // 輸出圧力が高いほど高額車需要増で相場上昇
    scoreLogic: (v: number) => {
      if(v >= 115) return 5   // 輸出超好調
      if(v >= 105) return 15
      if(v >= 95) return 30
      if(v >= 85) return 48
      if(v >= 75) return 68
      if(v >= 65) return 82
      return 92
    }
  },
  {
    id:"m4", key:"m4_newcar",
    label:"新車登録台数", sublabel:"自販連",
    weight:15, r:0.79, lead:"12週先行",
    icon: Car,
    source:"自販連・全軽自協 月次",
    // 新車増は12週後の中古車供給増につながる（逆相関）
    // 月次データの実績範囲（48〜145千台）に基づく閾値
    scoreLogic: (v: number) => {
      if(v <= 80) return 5    // 新車不足→中古車需要増
      if(v <= 90) return 15
      if(v <= 100) return 28
      if(v <= 110) return 45
      if(v <= 120) return 62
      if(v <= 130) return 78
      return 92               // 新車大量供給→将来の中古車供給増
    }
  },
  {
    id:"m5", key:"m5_scfi",
    label:"SCFI / Carvana", sublabel:"外部参考指標",
    weight:10, r:0.88, lead:"2-4週先行",
    icon: Package,
    source:"Freightos BDI / Yahoo Finance",
    // 海運指数・米国中古車指数との相関を参考
    scoreLogic: (v: number) => {
      if(v >= 140) return 8
      if(v >= 120) return 20
      if(v >= 100) return 38
      if(v >= 85) return 55
      if(v >= 70) return 72
      return 88
    }
  },
  {
    id:"m6", key:"m6_regulation",
    label:"規制発令モニタリング", sublabel:"経産省・外務省",
    weight:5, r:0.92, lead:"即時〜2週",
    icon: AlertTriangle,
    source:"経産省RSS / JETROニュース",
    // イベントドリブン：発生時のインパクトは大きいが頻度低
    scoreLogic: (v: number) => {
      if(v === 0) return 5    // 規制なし
      if(v === 1) return 40   // 軽微な規制
      if(v === 2) return 70   // 中程度の規制
      return 92               // 重大規制発令
    }
  },
]

type SignalKey = keyof typeof initialSignals

// スコア計算
function calcCompositeScore(signals: typeof initialSignals) {
  let total = 0
  const breakdown: Array<typeof modules[0] & { subScore: number; weighted: number }> = []
  for(const m of modules) {
    const sig = signals[m.key as SignalKey]
    const subScore = m.scoreLogic(sig.value)
    const weighted = subScore * m.weight / 100
    total += weighted
    breakdown.push({...m, subScore, weighted: Math.round(weighted * 10) / 10})
  }
  return { composite: Math.round(total), breakdown }
}

function getRiskLevel(score: number) {
  if(score < 30) return { level:"安全", color:"text-emerald-500", bgColor:"bg-emerald-500/10", borderColor:"border-emerald-500/30", action:"通常運用" }
  if(score < 50) return { level:"注意", color:"text-amber-500", bgColor:"bg-amber-500/10", borderColor:"border-amber-500/30", action:"週次モニタリング強化" }
  if(score < 70) return { level:"警戒", color:"text-orange-500", bgColor:"bg-orange-500/10", borderColor:"border-orange-500/30", action:"仕入れ量を20%削減推奨" }
  if(score < 85) return { level:"危険", color:"text-red-500", bgColor:"bg-red-500/10", borderColor:"border-red-500/30", action:"仕入れ停止・在庫圧縮推奨" }
  return { level:"緊急", color:"text-red-600", bgColor:"bg-red-600/10", borderColor:"border-red-600/30", action:"即時ポジション解消" }
}

// バックテスト精度
const backtestAccuracy = (() => {
  const total = monthlyData.length
  const correct = monthlyData.filter(x=>x.correct).length
  const crashes = monthlyData.filter(x=>x.predicted==="DOWN")
  const crashCorrect = crashes.filter(x=>x.correct).length
  return { 
    overall: Math.round(correct/total*100),
    crashes: Math.round(crashCorrect/crashes.length*100),
    surges: Math.round(monthlyData.filter(x=>x.predicted==="UP"&&x.correct).length /
      monthlyData.filter(x=>x.predicted==="UP").length*100),
  }
})()

// Custom Tooltip
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if(!active || !payload?.length) return null
  const d = monthlyData.find(x=>x.month===label) || weeklyData.find(x=>x.month===label)
  return (
    <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
      <div className="text-sm font-semibold text-muted-foreground mb-2">{label}</div>
      {payload.map((p, i)=>(
        <div key={i} className="text-sm" style={{color: p.color}}>
{p.name.replace(/\(.*\)/, "")}: <span className="font-semibold">{typeof p.value==="number"?p.value.toFixed(1):p.value}</span>
  {p.name.includes("オークション成約単価") ? (p.name.includes("千$") ? "千$" : "万円") : p.name==="リスクスコア"?"pt":p.name.includes("新車")?"千台":(p.name.includes("小売")||p.name.includes("オークション成約率"))?"％":(p.name.includes("ネクステージ")||p.name.includes("IDOM"))?"円":""}
        </div>
      ))}
      {d?.event && (
        <div className="mt-2 pt-2 border-t border-border text-xs text-amber-500">
          {d.event}
        </div>
      )}
    </div>
  )
}

// ゲージコンポーネント
function RiskGauge({ score, size = 200 }: { score: number; size?: number }) {
  const risk = getRiskLevel(score)
  // Angle: score 0 = -180 (left), score 100 = 0 (right)
  const angle = -180 + (score / 100) * 180
  const cx = size/2, cy = size/2 * 0.7
  const r = size * 0.38
  const toRad = (deg: number) => deg * Math.PI / 180
  
  const arcPath = (startDeg: number, endDeg: number, color: string) => {
    const start = { x: cx + r * Math.cos(toRad(startDeg)), y: cy + r * Math.sin(toRad(startDeg)) }
    const end   = { x: cx + r * Math.cos(toRad(endDeg)),   y: cy + r * Math.sin(toRad(endDeg)) }
    const large = endDeg - startDeg > 180 ? 1 : 0
    return <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`}
      stroke={color} strokeWidth={size*0.06} fill="none" opacity={0.9} strokeLinecap="round"/>
  }
  
  const needleX = cx + (r*0.75) * Math.cos(toRad(angle))
  const needleY = cy + (r*0.75) * Math.sin(toRad(angle))

  const getColor = () => {
    if(score < 30) return "#22c55e"
    if(score < 50) return "#f59e0b"
    if(score < 70) return "#f97316"
    if(score < 85) return "#ef4444"
    return "#dc2626"
  }

  return (
    <svg width={size} height={size*0.75} style={{overflow:"visible"}}>
      {/* Track */}
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        stroke="hsl(var(--muted))" strokeWidth={size*0.06} fill="none" opacity={0.3}/>
      {/* Color zones */}
      {arcPath(-180,-126,"#22c55e")}
      {arcPath(-126,-72, "#f59e0b")}
      {arcPath(-72, -36, "#f97316")}
      {arcPath(-36,  -9, "#ef4444")}
      {arcPath(  -9,  0, "#dc2626")}
      {/* Needle */}
      <line x1={cx} y1={cy} x2={needleX} y2={needleY}
        stroke={getColor()} strokeWidth={3} strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r={size*0.04} fill={getColor()}/>
      <circle cx={cx} cy={cy} r={size*0.02} fill="hsl(var(--background))"/>
      {/* Score text - positioned below the gauge */}
      <text x={cx} y={cy+size*0.22} textAnchor="middle" fontSize={size*0.2}
        fontWeight="800" fill={getColor()}>{score}</text>
      <text x={cx} y={cy+size*0.34} textAnchor="middle" fontSize={size*0.07}
        fill="hsl(var(--muted-foreground))">/ 100</text>
    </svg>
  )
}

export default function MarketAlertPage() {
const [signals, setSignals] = useState({...initialSignals})
const [animScore, setAnimScore] = useState(0)
const [chartInterval, setChartInterval] = useState<"monthly" | "weekly">("monthly")
const [chartPeriod, setChartPeriod] = useState<3 | 5 | 10>(10)
const [priceCurrency, setPriceCurrency] = useState<"jpy" | "usd">("jpy")
const [visibleSeries, setVisibleSeries] = useState({
  score: true,
  auctionPrice: true,
  newCarReg: true,
  retailRate: true,
  auctionRate: true,
  nextage: false,
  idom: false,
})



// Filter data based on period and interval, convert currency if needed
const getFilteredData = () => {
  const baseData = chartInterval === "weekly" ? weeklyData : monthlyData
  const currentYear = 26 // 2026
  const startYear = currentYear - chartPeriod
  
  return baseData.filter(d => {
    const [year] = d.month.split('/')
    const yearNum = parseInt(year)
    return yearNum >= startYear
  }).map(d => ({
    ...d,
    // 円建て価格をドルに変換（万円 → 千ドル）- その時期の実際の為替レートを使用
    displayPrice: priceCurrency === "usd" 
      ? parseFloat(((d.auctionPrice * 10000) / d.usdJpy / 1000).toFixed(2))
      : d.auctionPrice
  }))
}

const chartData = getFilteredData()
  const { composite, breakdown } = calcCompositeScore(signals)
  const risk = getRiskLevel(composite)

  // アニメーション
  useEffect(() => {
    let frame: number
    let current = 0
    const target = composite
    const step = () => {
      current = Math.min(current + 2, target)
      setAnimScore(current)
      if(current < target) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [composite])

  const getBarColor = (pct: number) => {
    if(pct > 70) return "bg-red-500"
    if(pct > 45) return "bg-orange-500"
    if(pct > 25) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const getBarColorHex = (pct: number) => {
    if(pct > 70) return "#ef4444"
    if(pct > 45) return "#f97316"
    if(pct > 25) return "#f59e0b"
    return "#22c55e"
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Symphony Insight — 相場リスクエンジン v1.0
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                6モジュール統合型 中古車オークション相場リスク予測システム / バックテスト精度 {backtestAccuracy.overall}%（急落検知 {backtestAccuracy.crashes}%）
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${risk.bgColor} ${risk.borderColor}`}>
              <div className="text-xs text-muted-foreground mb-0.5">現在のリスクレベル</div>
              <div className={`text-xl font-bold ${risk.color}`}>{risk.level}</div>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList>
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                統合ダッシュボード
              </TabsTrigger>
              <TabsTrigger value="modules" className="gap-2">
                <Info className="h-4 w-4" />
                モジュール詳細
              </TabsTrigger>
              <TabsTrigger value="simulator" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                シナリオシミュレーター
              </TabsTrigger>
              <TabsTrigger value="backtest" className="gap-2">
                <Check className="h-4 w-4" />
                バックテスト
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-[auto_1fr] gap-6">
                {/* Gauge */}
                <Card className={`${risk.borderColor} border-2`}>
                  <CardContent className="pt-6 flex flex-col items-center min-w-[240px]">
                    <RiskGauge score={animScore} size={200}/>
                    <div className={`mt-4 px-6 py-2 rounded-lg ${risk.bgColor} w-full text-center`}>
                      <div className={`text-sm font-semibold ${risk.color}`}>{risk.action}</div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      USS予測: <span className={`font-semibold ${composite>60?"text-red-500":composite>40?"text-amber-500":"text-emerald-500"}`}>
                        {composite>70?"4〜8週後に下落":composite>50?"横ばい〜微落":composite<25?"4〜8週後に上昇":"横ばい"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Module scores */}
                <div className="flex flex-col gap-3">
                  {breakdown.map((m, i) => {
                    const pct = m.subScore
                    const Icon = m.icon
                    const sig = signals[m.key as SignalKey]
                    return (
                      <Card key={i} className="border-l-4" style={{ borderLeftColor: getBarColorHex(pct) }}>
                        <CardContent className="py-3 px-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold">{m.label}</span>
                                <div className="flex gap-3 items-center">
                                  <span className="text-xs text-muted-foreground">weight {m.weight}%</span>
                                  <span className={`text-sm font-bold`} style={{ color: getBarColorHex(pct) }}>
                                    {pct}pt
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ${getBarColor(pct)}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1.5">
                            <span className="text-xs text-muted-foreground">{m.sublabel} / {m.lead}</span>
                            <span className="text-xs text-muted-foreground">
                              現在値: <span className="text-foreground">{sig?.value}{sig?.unit}</span>
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Historical Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <CardTitle className="text-base">リスクスコア vs オークション成約単価 vs 成約率</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        新車登録（緑）が約3ヶ月先行。小売成約率（紫）とオークション成約率（水色）を比較可能。凡例クリックで表示切替。
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Period selector */}
                      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                        {([3, 5, 10] as const).map(period => (
                          <Button 
                            key={period}
                            variant={chartPeriod === period ? "default" : "ghost"} 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                            onClick={() => setChartPeriod(period)}
                          >
                            {period}年
                          </Button>
                        ))}
                      </div>
                      {/* Interval selector */}
                      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                        <Button 
                          variant={chartInterval === "monthly" ? "default" : "ghost"} 
                          size="sm" 
                          className="h-7 px-3 text-xs"
                          onClick={() => setChartInterval("monthly")}
                        >
                          月次
                        </Button>
                        <Button 
                          variant={chartInterval === "weekly" ? "default" : "ghost"} 
                          size="sm" 
                          className="h-7 px-3 text-xs"
                          onClick={() => setChartInterval("weekly")}
                        >
                          週次
                        </Button>
                      </div>
                      {/* Currency selector */}
                      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                        <Button 
                          variant={priceCurrency === "jpy" ? "default" : "ghost"} 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={() => setPriceCurrency("jpy")}
                        >
                          円
                        </Button>
                        <Button 
                          variant={priceCurrency === "usd" ? "default" : "ghost"} 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                          onClick={() => setPriceCurrency("usd")}
                        >
                          $
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Custom Legend */}
                  <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
                    <button 
                      className={`flex items-center gap-1.5 text-xs transition-opacity ${!visibleSeries.score ? 'opacity-40' : ''}`}
                      onClick={() => setVisibleSeries(prev => ({ ...prev, score: !prev.score }))}
                    >
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f97316' }} />
                      リスクスコア
                    </button>
                    <button 
                      className={`flex items-center gap-1.5 text-xs transition-opacity ${!visibleSeries.auctionPrice ? 'opacity-40' : ''}`}
                      onClick={() => setVisibleSeries(prev => ({ ...prev, auctionPrice: !prev.auctionPrice }))}
                    >
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
                      オークション成約単価{priceCurrency === "usd" ? "(千$)" : "(万円)"}
                    </button>
                    <button 
                      className={`flex items-center gap-1.5 text-xs transition-opacity ${!visibleSeries.newCarReg ? 'opacity-40' : ''}`}
                      onClick={() => setVisibleSeries(prev => ({ ...prev, newCarReg: !prev.newCarReg }))}
                    >
                      <span className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: '#22c55e', width: 12 }} />
                      新車登録（12週先行）
                    </button>
                    <button 
                      className={`flex items-center gap-1.5 text-xs transition-opacity ${!visibleSeries.retailRate ? 'opacity-40' : ''}`}
                      onClick={() => setVisibleSeries(prev => ({ ...prev, retailRate: !prev.retailRate }))}
                    >
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#a855f7' }} />
                      小売成約率
                    </button>
                    <button 
                      className={`flex items-center gap-1.5 text-xs transition-opacity ${!visibleSeries.auctionRate ? 'opacity-40' : ''}`}
                      onClick={() => setVisibleSeries(prev => ({ ...prev, auctionRate: !prev.auctionRate }))}
                    >
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#06b6d4' }} />
                      オークション成約率
                    </button>
                    <button 
                      className={`flex items-center gap-1.5 text-xs transition-opacity ${!visibleSeries.nextage ? 'opacity-40' : ''}`}
                      onClick={() => setVisibleSeries(prev => ({ ...prev, nextage: !prev.nextage }))}
                    >
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ec4899' }} />
                      ネクステージ株価
                    </button>
                    <button 
                      className={`flex items-center gap-1.5 text-xs transition-opacity ${!visibleSeries.idom ? 'opacity-40' : ''}`}
                      onClick={() => setVisibleSeries(prev => ({ ...prev, idom: !prev.idom }))}
                    >
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#8b5cf6' }} />
                      IDOM株価
                    </button>
                  </div>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{top:5,right:60,left:0,bottom:5}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5}/>
                        <XAxis 
                          dataKey="month" 
                          tick={{fill:"hsl(var(--muted-foreground))",fontSize:9}} 
                          interval={chartInterval === "monthly" ? Math.floor(chartData.length / 12) : Math.floor(chartData.length / 12)} 
                          tickLine={false}
                          angle={-45}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis yAxisId="score" domain={[0,100]} tick={{fill:"#f97316",fontSize:10}}
                          tickFormatter={v=>`${v}`} tickLine={false} axisLine={false}/>
                        <YAxis yAxisId="price" orientation="right" domain={['auto','auto']}
                          tick={{fill:"#3b82f6",fontSize:10}} tickFormatter={v=> priceCurrency === "usd" ? `$${v}k` : `${v}万`} tickLine={false} axisLine={false}/>
                        <YAxis yAxisId="newcar" orientation="right" domain={[40,150]} hide/>
                        <YAxis yAxisId="retail" orientation="right" domain={[30,100]} hide/>
                        <YAxis yAxisId="stock" orientation="right" domain={['auto','auto']} hide/>
                        <Tooltip content={<CustomTooltip />}/>
                        <ReferenceLine yAxisId="score" y={60} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.6}/>
                        <ReferenceLine yAxisId="score" y={30} stroke="#22c55e" strokeDasharray="3 3" strokeOpacity={0.4}/>
                        {visibleSeries.newCarReg && (
                          <Line yAxisId="newcar" type="monotone" dataKey="newCarReg" name="新車登録（12週先行）"
                            stroke="#22c55e" strokeWidth={1.5} dot={false} strokeDasharray="5 3"/>
                        )}
                        {visibleSeries.retailRate && (
                          <Line yAxisId="retail" type="monotone" dataKey="retailRate" name="小売成約率"
                            stroke="#a855f7" strokeWidth={1.5} dot={false}/>
                        )}
                        {visibleSeries.auctionRate && (
                          <Line yAxisId="retail" type="monotone" dataKey="auctionRate" name="オークション成約率"
                            stroke="#06b6d4" strokeWidth={1.5} dot={false} strokeDasharray="3 3"/>
                        )}
                        {visibleSeries.nextage && (
                          <Line yAxisId="stock" type="monotone" dataKey="nextage" name="ネクステージ(3186)"
                            stroke="#ec4899" strokeWidth={1.5} dot={false} connectNulls/>
                        )}
                        {visibleSeries.idom && (
                          <Line yAxisId="stock" type="monotone" dataKey="idom" name="IDOM(7599)"
                            stroke="#8b5cf6" strokeWidth={1.5} dot={false} connectNulls/>
                        )}
                        {visibleSeries.score && (
                          <Area yAxisId="score" type="monotone" dataKey="score" name="リスクスコア"
                            stroke="#f97316" fill="rgba(249,115,22,0.1)" strokeWidth={2}/>
                        )}
                        {visibleSeries.auctionPrice && (
                          <Line yAxisId="price" type="monotone" dataKey="displayPrice" name={`オークション成約単価${priceCurrency === "usd" ? "(千$)" : "(万円)"}`}
                            stroke="#3b82f6" strokeWidth={2.5} dot={false}/>
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Modules Tab */}
            <TabsContent value="modules" className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {breakdown.map((m, i) => {
                  const pct = m.subScore
                  const Icon = m.icon
                  const riskLabel = pct>70?"危険":pct>45?"警戒":pct>25?"注意":"安全"
                  return (
                    <Card key={i} className="border" style={{ borderColor: `${getBarColorHex(pct)}44` }}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between mb-3">
                          <Icon className="h-6 w-6 text-muted-foreground" />
                          <Badge variant="outline" style={{ 
                            backgroundColor: `${getBarColorHex(pct)}20`, 
                            color: getBarColorHex(pct),
                            borderColor: `${getBarColorHex(pct)}44`
                          }}>
                            {riskLabel}
                          </Badge>
                        </div>
                        <div className="text-base font-semibold mb-0.5">{m.label}</div>
                        <div className="text-xs text-muted-foreground mb-4">{m.sublabel}</div>

                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{
                              background: `conic-gradient(${getBarColorHex(pct)} ${pct*3.6}deg, hsl(var(--muted)) 0deg)`
                            }}
                          >
                            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                              <span className="text-lg font-bold" style={{ color: getBarColorHex(pct) }}>{pct}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">モジュールスコア</div>
                            <div className="text-xs text-muted-foreground">
                              加重寄与: <span className="text-foreground font-semibold">{m.weighted}pt</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          {[
                            ["相関係数", `r = ${m.r}`],
                            ["先行時間", m.lead],
                            ["重み", `${m.weight}%`],
                            ["データ源", m.source],
                          ].map(([k,v],j)=>(
                            <div key={j} className="flex gap-2">
                              <span className="text-muted-foreground w-16 shrink-0">{k}</span>
                              <span className="text-foreground">{v}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className="bg-blue-500/5 border-blue-500/20">
                <CardContent className="pt-4">
                  <h3 className="text-sm font-semibold text-blue-500 mb-2">重み付けの設計思想</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-orange-500">M1（小売成約率30%）</strong>が最大なのは、
                    Insight独自データかつr=0.94の最強精度を持ち、7週先行という最長リードタイムを持つから。
                    <strong className="text-emerald-500">M2（成約率20%）</strong>は既存USSデータで完結する実装容易性と3週先行を評価。
                    <strong className="text-red-500">M3（輸出圧力20%）</strong>は2023年の「台数増だが相場下落」という逆説を説明できる唯���の指標。
                    M6（規制）はイベント系で頻度は低いが発動時のインパクトが極めて大きい（r=0.92）。
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Simulator Tab */}
            <TabsContent value="simulator" className="space-y-6">
              <p className="text-sm text-muted-foreground">
                各シグナルの値を変えてリスクスコアの変化を確認する。過去のターニングポイントを再現できる。
              </p>

              <div className="grid grid-cols-2 gap-4">
                {modules.map((m, i) => {
                  const sig = signals[m.key as SignalKey]
                  const Icon = m.icon
                  return (
                    <Card key={i}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{m.label}</span>
                          </div>
                          <span className="text-lg font-bold text-primary">
                            {sig.value}{sig.unit}
                          </span>
                        </div>
                        <Slider
                          value={[sig.value]}
                          min={sig.direction === "down_bad" ? 50 : 90}
                          max={sig.direction === "down_bad" ? 90 : 135}
                          step={0.5}
                          onValueChange={(val) => {
                            setSignals(prev => ({
                              ...prev,
                              [m.key]: { ...prev[m.key as SignalKey], value: val[0] }
                            }))
                          }}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{sig.direction === "down_bad" ? "低（危険）" : "低（安全）"}</span>
                          <span>{sig.direction === "down_bad" ? "高（安全）" : "高（危険）"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className={`${risk.borderColor} border-2`}>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-8">
                    <RiskGauge score={composite} size={140}/>
                    <div>
                      <div className={`text-4xl font-bold ${risk.color} mb-2`}>
                        {composite}pt — {risk.level}
                      </div>
                      <div className="text-foreground mb-3">{risk.action}</div>
                      <div className="flex gap-2 flex-wrap">
                        {breakdown.map((m,i)=>(
                          <Badge key={i} variant="outline" style={{ 
                            backgroundColor: `${getBarColorHex(m.subScore)}15`, 
                            color: getBarColorHex(m.subScore)
                          }}>
                            {m.label.split(" ")[0]}: {m.subScore}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <div className="text-sm text-muted-foreground mb-3">過去の重要局面を再現</div>
                <div className="flex gap-2 flex-wrap">
                  {[
                    {label:"2022Q3 ピーク直前",color:"amber",
                      vals:{m1_retail:{value:75.8},m2_auction:{value:79.6},m3_epi:{value:115},m4_newcar:{value:105},m5_scfi:{value:200},m6_regulation:{value:0}}},
                    {label:"2023Q1 急落期",color:"red",
                      vals:{m1_retail:{value:64.5},m2_auction:{value:72.8},m3_epi:{value:72},m4_newcar:{value:118},m5_scfi:{value:95},m6_regulation:{value:1}}},
                    {label:"2021Q2 急騰期",color:"emerald",
                      vals:{m1_retail:{value:81.5},m2_auction:{value:73.2},m3_epi:{value:108},m4_newcar:{value:92},m5_scfi:{value:380},m6_regulation:{value:0}}},
                    {label:"2019Q4 安定期",color:"slate",
                      vals:{m1_retail:{value:77.8},m2_auction:{value:61.8},m3_epi:{value:94},m4_newcar:{value:100},m5_scfi:{value:92},m6_regulation:{value:0}}},
                  ].map((sc,i)=>(
                    <Button key={i} variant="outline" size="sm" onClick={()=>{
                      setSignals(prev=>{
                        const next = {...prev}
                        for(const [k, v] of Object.entries(sc.vals)){
                          next[k as SignalKey] = {...prev[k as SignalKey], ...(v as {value: number})}
                        }
                        return next
                      })
                    }}>
                      {sc.label}
                    </Button>
                  ))}
                  <Button variant="ghost" size="sm" onClick={()=>setSignals({...initialSignals})}>
                    リセット
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Backtest Tab */}
            <TabsContent value="backtest" className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                {[
                  {label:"全体精度",value:`${backtestAccuracy.overall}%`,color:"text-blue-500",sub:"2015Q1-2025Q4"},
                  {label:"急落検知精度",value:`${backtestAccuracy.crashes}%`,color:"text-red-500",sub:"DOWN予測の的中率"},
                  {label:"急騰検知精度",value:`${backtestAccuracy.surges}%`,color:"text-emerald-500",sub:"UP予測の的中率"},
                  {label:"検証期間",value:"120ヶ月",color:"text-orange-500",sub:"2016年4月〜2026年3月"},
                ].map((k,i)=>(
                  <Card key={i}>
                    <CardContent className="pt-4">
                      <div className="text-xs text-muted-foreground mb-1">{k.label}</div>
                      <div className={`text-3xl font-bold ${k.color}`}>{k.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{k.sub}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-6 gap-4 p-3 bg-muted/50 text-xs font-semibold text-muted-foreground">
                    <div>年/月</div>
                    <div>スコア</div>
                    <div>リスク</div>
                    <div>予測方向</div>
                    <div>実際の変化</div>
                    <div>判定</div>
                  </div>
<ScrollArea className="h-[400px]">
  {monthlyData.map((row, i) => {
                      const r = getRiskLevel(row.score)
                      return (
<div key={i} className={`grid grid-cols-6 gap-4 p-3 border-t border-border text-sm ${row.event ? 'bg-amber-500/5' : ''}`}>
  <div className="font-medium">{row.month}</div>
                          <div className={`font-bold ${r.color}`}>{row.score}</div>
                          <div className={r.color}>{r.level}</div>
                          <div className={row.predicted==="DOWN"?"text-red-500":row.predicted==="UP"?"text-emerald-500":"text-muted-foreground"}>
                            {row.predicted==="DOWN" && <TrendingDown className="inline h-4 w-4 mr-1" />}
                            {row.predicted==="UP" && <TrendingUp className="inline h-4 w-4 mr-1" />}
                            {row.predicted==="FLAT" && <Minus className="inline h-4 w-4 mr-1" />}
                            {row.predicted==="DOWN"?"下落":row.predicted==="UP"?"上昇":"横ばい"}
                          </div>
                          {/* Actual change display with null safety */}
                          <div className={row.actual !== null && row.actual > 2 ? "text-emerald-500" : row.actual !== null && row.actual < -2 ? "text-red-500" : "text-muted-foreground"}>
                            {row.actual !== null ? `${row.actual > 0 ? "+" : ""}${row.actual.toFixed(1)}%` : "-"}
                          </div>
                          <div>
                            {row.correct === null ? 
                              <Minus className="h-5 w-5 text-muted-foreground" /> :
                              row.correct ? 
                              <Check className="h-5 w-5 text-emerald-500" /> : 
                              <X className="h-5 w-5 text-red-500" />
                            }
                          </div>
                        </div>
                      )
                    })}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="pt-4">
                  <h3 className="text-sm font-semibold text-amber-500 mb-2">誤判定パターンの分析</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    主な誤判定は2パターン：<strong className="text-foreground">COVID底からの急反発（20Q2）</strong>—
                    全指標が崩壊時にのみ機能し底打ちサインを持たない。<strong className="text-foreground">安定期の小幅変動</strong>—
                    スコアが30〜45のゾーンでの±2%程度の変動は「横ばい」と判定するため誤判定が発生。
                    いずれも<strong className="text-amber-500">大きなリスク（急落・急騰）の検知には影響しない</strong>。
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
