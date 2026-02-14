# Interview Scheduler (面談日程自動調整システム)

教員と学生の面談日程調整を効率化するWebアプリケーションです。
「教員の空き時間」と「学生の希望時間」をマッチングし、**独自の再帰探索アルゴリズム**を用いて最小の日数で全員の面談を完了させるスケジュールを自動生成します。

##  デモ (Demo)
(例: https://interview-scheduler-two.vercel.app/)
> **⚠️ 注意 / Note**
> このアプリケーションは、FullCalendarによるドラッグ＆ドロップ操作を伴うため、**PCでの利用を推奨**しています。
> スマホではレイアウトや操作が最適化されていない可能性があります。

##  特徴 (Key Features)
- **アルゴリズムによる最適化**: 貪欲法(Greedy)だけでなく、**再帰探索(Backtracking)と枝刈り(Pruning)** を用いた独自ロジックを実装。局所解に陥らず、最適なスケジュールを導き出します。
- **直感的な操作**: FullCalendarをカスタマイズし、ドラッグ＆ドロップでの直感的なスケジュール調整を実現。
- **コンポーネント設計**: Reactのコンポーネント分割とCustom Hooks (`useSchedule`) による可読性の高いコード設計。

##  今後の展望 (Future Roadmap)
現在はプロトタイプ段階ですが、実運用に向けて以下の機能追加を予定しています。

- **データの永続化 (Persistence)**:
  - 現在はブラウザのリロードでデータがリセットされるため、**Supabase** や **Firebase** を導入してデータベース連携を行う予定です。
- **ユーザー認証 (Authentication)**:
  - 教員と学生、それぞれのログイン機能を実装し、セキュリティを強化する。
- **UI/UXの改善**:
  - スマートフォンでの閲覧・操作に対応させる（レスポンシブデザイン）。

## 🛠 使用技術 (Tech Stack)
- **Frontend**: Next.js (App Router), React
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Library**: FullCalendar, Lucide React

---
Created by Rin Ikeda