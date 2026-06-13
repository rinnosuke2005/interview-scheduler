import Link from "next/link";
import {
  CalendarDays,
  Sparkles,
  MousePointerClick,
  CheckCheck,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SchedulePreview from "@/components/site/SchedulePreview";

const features = [
  {
    icon: Sparkles,
    title: "再帰探索アルゴリズム",
    desc: "貪欲法に頼らず、バックトラッキングと枝刈りで探索。局所解を避け、本当に最小の日数に収まる組み合わせを導きます。",
  },
  {
    icon: MousePointerClick,
    title: "ドラッグ＆ドロップ操作",
    desc: "空き時間も希望時間も、カレンダーをなぞるだけ。予定の移動・リサイズ・削除もマウス操作だけで完結します。",
  },
  {
    icon: CheckCheck,
    title: "ベストエフォート・マッチング",
    desc: "全員分の枠が取れない時も、成立件数が最大になる組み合わせを算出。1日の上限件数や休憩時間の最小化にも対応。",
  },
];

const steps = [
  { n: "01", title: "空き時間を入力", desc: "教員の空き時間と各学生の希望時間を、カレンダー上にドラッグで登録します。" },
  { n: "02", title: "条件を設定", desc: "面談時間・1日の最大件数・最適化モード（日数最小／休憩最小）を選びます。" },
  { n: "03", title: "ワンクリックで生成", desc: "「マッチング実行」を押すだけ。最小の日数で全員分の予定が並びます。" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CalendarDays className="size-4" />
            </span>
            面談スケジューラー
          </Link>
          <Button asChild size="sm">
            <Link href="/scheduler">
              アプリを開く
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative">
        {/* 控えめなドットグリッド背景 */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--border) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-12 text-center">
          <Badge variant="outline" className="mx-auto bg-background">
            <Sparkles className="text-emerald-500" />
            最適化アルゴリズムを搭載
          </Badge>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">
            面談の日程調整を、
            <br className="hidden sm:block" />
            <span className="text-emerald-600">数クリックで終わらせる。</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            教員の空き時間と学生の希望時間をマッチングし、最小の日数で全員分の面談スケジュールを自動生成します。
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/scheduler">
                今すぐ試す
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">特徴を見る</a>
            </Button>
          </div>
          <p className="mt-5 text-xs text-muted-foreground/80">
            インストール不要・ドラッグ操作のためPCでのご利用を推奨
          </p>
        </div>

        {/* プロダクトプレビュー */}
        <div className="mx-auto max-w-5xl px-6 pb-20">
          <SchedulePreview />
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="border-t bg-secondary/40">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-emerald-600">Features</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">調整の手間を減らす、3つの軸。</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="gap-4 transition-colors hover:border-foreground/20">
                <CardContent className="flex flex-col gap-4">
                  <span className="flex size-10 items-center justify-center rounded-lg border bg-background text-foreground">
                    <f.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {f.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-emerald-600">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">使い方は3ステップ。</h2>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="bg-card p-7">
              <span className="font-mono text-sm font-medium text-muted-foreground">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border bg-primary px-8 py-14 text-center text-primary-foreground">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            面倒な日程調整を、もう終わりに。
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/70">
            ブラウザを開いて、今すぐ最適なスケジュールを作りましょう。
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8">
            <Link href="/scheduler">
              アプリを開く
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-7 text-sm text-muted-foreground sm:flex-row">
          <span>面談日程自動調整システム</span>
          <span>Created by Rin Ikeda</span>
        </div>
      </footer>
    </main>
  );
}
