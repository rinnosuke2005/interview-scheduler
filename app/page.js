import Link from "next/link";

const features = [
  {
    title: "アルゴリズムによる最適化",
    desc: "貪欲法だけに頼らず、再帰探索（バックトラッキング）と枝刈りを用いた独自ロジックで、局所解に陥らない最適なスケジュールを導き出します。",
    icon: (
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
    ),
  },
  {
    title: "直感的なドラッグ＆ドロップ",
    desc: "FullCalendar をカスタマイズし、空き時間も希望時間もドラッグするだけで登録。予定の移動・リサイズ・削除もマウスひとつで完結します。",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18M8 2v4m8-4v4" />
      </>
    ),
  },
  {
    title: "ベストエフォート・マッチング",
    desc: "全員分の枠が取れない場合でも、最も多くの面談を成立させる組み合わせを自動で算出。1日あたりの件数上限や休憩時間の最小化にも対応します。",
    icon: (
      <>
        <path d="M20 6 9 17l-5-5" />
      </>
    ),
  },
];

const steps = [
  { num: "01", title: "空き時間を入力", desc: "教員の空き時間と、各学生の希望時間をカレンダー上にドラッグで登録します。" },
  { num: "02", title: "条件を設定", desc: "面談時間・1日の最大件数・最適化モード（日数最小 / 休憩最小）を選びます。" },
  { num: "03", title: "ワンクリックで自動生成", desc: "「マッチング実行」を押すだけ。最小の日数で全員分の面談予定が完成します。" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18M8 2v4m8-4v4" />
              </svg>
            </span>
            面談スケジューラー
          </div>
          <Link
            href="/scheduler"
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-900"
          >
            アプリを開く
          </Link>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-slate-50" />
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            再帰探索アルゴリズム搭載
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            面談の日程調整を、
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">
              ワンクリックで自動化。
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            教員の空き時間と学生の希望時間をマッチングし、独自の最適化アルゴリズムで
            <br className="hidden sm:block" />
            最小の日数で全員分の面談スケジュールを自動生成します。
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/scheduler"
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              今すぐ試す
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              特徴を見る
            </a>
          </div>
          <p className="mt-6 text-xs text-slate-400">
            ※ ドラッグ＆ドロップ操作のため、PC（パソコン）でのご利用を推奨しています。
          </p>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">特徴</h2>
          <p className="mt-3 text-slate-600">調整の手間を減らす、3つのコア機能。</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  {f.icon}
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-800">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">使い方は3ステップ</h2>
            <p className="mt-3 text-slate-600">入力して、設定して、実行するだけ。</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num} className="relative rounded-2xl bg-slate-50 p-8">
                <span className="text-4xl font-extrabold text-indigo-200">{s.num}</span>
                <h3 className="mt-3 text-lg font-bold text-slate-800">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-8 py-16 text-center shadow-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-3xl font-extrabold text-white">面倒な日程調整を、もう終わりに。</h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            インストール不要。ブラウザを開いて、今すぐ最適なスケジュールを作りましょう。
          </p>
          <Link
            href="/scheduler"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
          >
            アプリを開く
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row">
          <span>面談日程自動調整システム</span>
          <span>Created by Rin Ikeda</span>
        </div>
      </footer>
    </main>
  );
}
