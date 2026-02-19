// app/components/ControlPanel.js
"use client";
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
    <div className="p-4 bg-white shadow-md border-b">
      <h1 className="text-xl font-bold mb-4 text-slate-800">
        面談候補システム
      </h1>

      <div className="flex flex-wrap items-end gap-6 mb-6">
        {/* アルゴリズム設定 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500">
            最適化モード
          </label>
          <select
            className="border border-gray-300 p-2 rounded bg-gray-50"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="minimizeDays">日数を最小化</option>
            <option value="minimizeRest">休憩時間を最小化</option>
          </select>
        </div>

        {/* 時間設定 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500">
            面談時間 (分)
          </label>
          <input
            type="number"
            className="border border-gray-300 p-2 rounded w-24 bg-gray-50"
            value={interviewTime}
            onChange={(e) => setInterviewTime(e.target.value)}
          />
        </div>
        {/* 最大面談件数設定 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500">
            最大面談件数
          </label>
          <input
            type="number"
            className="border border-gray-300 p-2 rounded w-24 bg-gray-50"
            value={maxTimes}
            onChange={(e) => setMaxTimes(e.target.value)}
          />
        </div>

        {/* 生徒追加フォーム */}
        <form onSubmit={handleAdd} className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500">生徒を追加</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded bg-gray-50"
              placeholder="名前を入力..."
              value={enteredStudent}
              onChange={(e) => setEnteredStudent(e.target.value)}
            />
            <button className="bg-slate-700 text-white px-4 py-2 rounded font-bold hover:bg-slate-800 transition">
              追加
            </button>
          </div>
        </form>

        {/* 実行ボタン */}
        <button
          onClick={matching}
          className={`font-bold py-2 px-8 rounded-lg shadow-lg transition text-white text-lg
            ${isExecuted ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {isExecuted ? "↩ 予定を戻す" : "マッチング実行 🚀"}
        </button>
      </div>

      {/* 生徒選択エリア */}
      <div className="bg-slate-100 p-3 rounded-xl flex flex-wrap gap-2 items-center">
        <span className="text-sm font-bold text-slate-500 mr-2">
          対象を選択:
        </span>
        <button
          onClick={() => setSelectedStudent(TEACHER)}
          className={`px-4 py-2 rounded-full font-bold border-2 transition shadow-sm flex items-center gap-2
            ${
              selectedStudent?.id === TEACHER.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-600 border-blue-100 hover:bg-blue-50"
            }`}
        >
          <span>👮‍♂️</span> {TEACHER.name}
        </button>

        {students.map((student, index) => (
          <div key={student.id} className="flex items-center gap-1 group">
            <button
              onClick={() => setSelectedStudent(student)}
              className={`px-4 py-2 rounded-full font-bold border transition whitespace-nowrap
                ${
                  selectedStudent?.id === student.id
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-emerald-300"
                }`}
            >
              {student.name}
            </button>
            <button
              onClick={() => deleteStudent(index)}
              className="bg-red-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 shadow-sm opacity-60 group-hover:opacity-100 transition"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
