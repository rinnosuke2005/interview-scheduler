// app/components/ControlPanel.js
"use client";
import Link from "next/link";
import { useSchedule } from "../contexts/ScheduleContext";

export default function ControlPanel() {
  const {
    students,
    addStudent,
    deleteStudent,
    selectedStudent,
    setSelectedStudent,
    TEACHER,
    algorithm,
    setAlgorithm,
    maxTimes,
    setMaxTimes,
    interviewTime,
    setInterviewTime,
    matching,
    isExecuted,
    enteredStudent,
    setEnteredStudent,
  } = useSchedule();

  const handleAdd = (e) => {
    e.preventDefault();
    addStudent(enteredStudent);
  };

  return (
    <div className="bg-white shadow-md border-b border-slate-200">
      {/* === トップバー === */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M3 10h18M8 2v4m8-4v4" />
            </svg>
          </span>
          面談候補システム
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          トップへ
        </Link>
      </div>

      {/* === 設定エリア === */}
      <div className="p-4">
        <div className="flex flex-wrap items-end gap-5">
          {/* アルゴリズム設定 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">最適化モード</label>
            <select
              className="rounded-lg border border-slate-300 bg-slate-50 p-2 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
            >
              <option value="minimizeDays">日数を最小化</option>
              <option value="minimizeBreaks">休憩時間を最小化</option>
            </select>
          </div>

          {/* 時間設定 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">面談時間 (分)</label>
            <input
              type="number"
              className="w-24 rounded-lg border border-slate-300 bg-slate-50 p-2 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
            />
          </div>

          {/* 最大面談件数設定 */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">
              最大面談件数 <span className="font-normal text-slate-400">(0=無制限)</span>
            </label>
            <input
              type="number"
              className="w-24 rounded-lg border border-slate-300 bg-slate-50 p-2 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              value={maxTimes}
              onChange={(e) => setMaxTimes(e.target.value)}
            />
          </div>

          {/* 生徒追加フォーム */}
          <form onSubmit={handleAdd} className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">生徒を追加</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="rounded-lg border border-slate-300 bg-slate-50 p-2 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                placeholder="名前を入力..."
                value={enteredStudent}
                onChange={(e) => setEnteredStudent(e.target.value)}
              />
              <button className="rounded-lg bg-slate-700 px-4 py-2 font-bold text-white transition hover:bg-slate-800">
                追加
              </button>
            </div>
          </form>

          {/* 実行ボタン */}
          <button
            onClick={matching}
            className={`ml-auto rounded-xl px-8 py-2.5 text-lg font-bold text-white shadow-lg transition hover:-translate-y-0.5
              ${isExecuted ? "bg-amber-500 shadow-amber-500/25 hover:bg-amber-600" : "bg-indigo-600 shadow-indigo-600/25 hover:bg-indigo-700"}`}
          >
            {isExecuted ? "↩ 予定を戻す" : "⚡ マッチング実行"}
          </button>
        </div>

        {/* 生徒選択エリア */}
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-slate-100 p-3">
          <span className="mr-2 text-sm font-bold text-slate-500">対象を選択:</span>
          <button
            onClick={() => setSelectedStudent(TEACHER)}
            className={`flex items-center gap-2 rounded-full border-2 px-4 py-2 font-bold shadow-sm transition
              ${
                selectedStudent?.id === TEACHER.id
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-blue-100 bg-white text-blue-600 hover:bg-blue-50"
              }`}
          >
            <span>🧑‍🏫</span> {TEACHER.name}
          </button>

          {students.map((student, index) => (
            <div key={student.id} className="group flex items-center gap-1">
              <button
                onClick={() => setSelectedStudent(student)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 font-bold transition
                  ${
                    selectedStudent?.id === student.id
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-md"
                      : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
                  }`}
              >
                {student.name}
              </button>
              <button
                onClick={() => deleteStudent(index)}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-red-400 text-xs text-white opacity-60 shadow-sm transition hover:bg-red-600 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* 操作ヒント */}
        <p className="mt-3 text-xs text-slate-400">
          💡 対象を選んでカレンダーをドラッグすると予定を追加できます。予定はドラッグで移動・リサイズ、右クリックで削除できます。
        </p>
      </div>
    </div>
  );
}
