const days = ["月", "火", "水", "木", "金"];
const hours = ["9", "10", "11", "12", "13"];

// 静的なデモ用イベント（col: 0-4, top/height は %）
const events = [
  { col: 0, top: 8, h: 18, label: "佐藤", tone: "emerald" },
  { col: 0, top: 30, h: 18, label: "鈴木", tone: "emerald" },
  { col: 1, top: 20, h: 18, label: "高橋", tone: "emerald" },
  { col: 2, top: 8, h: 30, label: "空き", tone: "ink" },
  { col: 2, top: 42, h: 18, label: "田中", tone: "emerald" },
  { col: 3, top: 30, h: 18, label: "伊藤", tone: "emerald" },
  { col: 4, top: 14, h: 24, label: "空き", tone: "ink" },
];

const tones = {
  emerald: "bg-emerald-500/15 border-emerald-500/40 text-emerald-700",
  ink: "bg-foreground/5 border-foreground/15 text-muted-foreground",
};

export default function SchedulePreview() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xl shadow-black/5">
      {/* ブラウザ風ツールバー */}
      <div className="flex items-center gap-2 border-b bg-secondary/50 px-4 py-3">
        <span className="size-3 rounded-full bg-foreground/15" />
        <span className="size-3 rounded-full bg-foreground/15" />
        <span className="size-3 rounded-full bg-foreground/15" />
        <span className="ml-3 hidden text-xs text-muted-foreground sm:block">
          面談スケジューラー — 週表示
        </span>
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-[2.5rem_repeat(5,1fr)] text-xs">
        {/* ヘッダー行 */}
        <div className="border-b border-r py-2" />
        {days.map((d) => (
          <div
            key={d}
            className="border-b border-r py-2 text-center font-medium text-muted-foreground last:border-r-0"
          >
            {d}
          </div>
        ))}

        {/* 時間ラベル列 + イベント領域 */}
        <div className="border-r">
          {hours.map((h) => (
            <div
              key={h}
              className="flex h-12 items-start justify-end border-b pr-1.5 pt-0.5 text-[10px] text-muted-foreground"
            >
              {h}:00
            </div>
          ))}
        </div>

        {/* 5日分の列 */}
        {days.map((d, col) => (
          <div key={d} className="relative border-r last:border-r-0">
            {hours.map((h) => (
              <div key={h} className="h-12 border-b" />
            ))}
            {events
              .filter((e) => e.col === col)
              .map((e, i) => (
                <div
                  key={i}
                  className={`absolute inset-x-1 rounded-md border px-1.5 py-1 text-[10px] font-medium ${tones[e.tone]}`}
                  style={{ top: `${e.top}%`, height: `${e.h}%` }}
                >
                  {e.label}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
