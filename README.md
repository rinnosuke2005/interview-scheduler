# Interview Scheduler (面談日程自動調整システム)

教員と学生の面談日程調整を効率化するWebアプリケーションです。
「教員の空き時間」と「学生の希望時間」をマッチングし、**独自の再帰探索アルゴリズム**を用いて最小の日数で全員の面談を完了させるスケジュールを自動生成します。

## 🚀 デモ (Demo)
**[ここにVercelのURLを貼る]**
(例: https://interview-scheduler-two.vercel.app/)

## ✨ 特徴 (Key Features)
- **アルゴリズムによる最適化**: 貪欲法(Greedy)だけでなく、**再帰探索(Backtracking)と枝刈り(Pruning)** を用いた独自ロジックを実装。局所解に陥らず、最適なスケジュールを導き出します。
- **直感的な操作**: FullCalendarをカスタマイズし、ドラッグ＆ドロップでの直感的なスケジュール調整を実現。
- **コンポーネント設計**: Reactのコンポーネント分割とCustom Hooks (`useSchedule`) による可読性の高いコード設計。

## 🛠 使用技術 (Tech Stack)
- **Frontend**: Next.js (App Router), React
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Library**: FullCalendar, Lucide React
- **Environment**: WSL2 (Ubuntu), VS Code

---
Created by Rin Ikeda