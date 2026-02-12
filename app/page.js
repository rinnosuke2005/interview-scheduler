"use client";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // 本体
import timeGridPlugin from "@fullcalendar/timegrid"; // 時間割（週・日）表示機能
import interactionPlugin from "@fullcalendar/interaction"; // ドラッグ＆ドロップ機能

export default function Home() {
  const init = [
    {
      id: 1,
      name: "A",
    },
    {
      id: 2,
      name: "B",
    },
    {
      id: 3,
      name: "C",
    },
  ];
  const TEACHER = { id: "teacher", name: "自分（教員）", color: "#3788d8" };

  const [students, setStudents] = useState(init);
  const [enteredStudent, setEnteredStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [algorithm, setAlgorithm] = useState("minimizeDays");
  const [maxTimes, setMaxTimes] = useState(0);
  const [interviewTime, setInterviewTime] = useState(0);
  // 初期値は「自分」にしておくと便利
  // カレンダーの予定データ
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [backupEvents, setBackupEvents] = useState([]);
  const [isExecuted, setIsExecuted] = useState(false);
  const addStudent = (e) => {
    e.preventDefault();
    if (enteredStudent === "") return;
    const newId = Date.now();
    const newStudent = { id: newId, name: enteredStudent };
    setStudents([...students, newStudent]);

    setEnteredStudent("");
  };
  // 生徒を削除する関数
  const deleteStudent = (indexToDelete) => {
    // filterを使って、「削除したいインデックス以外」の要素だけで新しい配列を作る
    const newStudents = students.filter((_, index) => index !== indexToDelete);
    setStudents(newStudents);

    // もし選択中の人が消されたら、選択を解除する（安全策）
    if (students[indexToDelete] === selectedStudent) {
      setSelectedStudent(null);
    }
  };

  // const handleDateClick = (arg) => {
  //   // 1. 誰も選択されていなかったら警告して終わる
  //   if (!selectedStudent) {
  //     alert("生徒を選択してください！");
  //     return;
  //   }
  //   // 2. 新しい予定オブジェクトを作る
  //   // ★ここから修正：終了時間を計算するロジック
  //   const startDate = arg.date; // クリックした時間 (Date型)

  //   // 入力された時間(分)を足して、終了時間を作る
  //   // もし0や未入力ならデフォルト30分にする
  //   const durationMinutes = interviewTime ? parseInt(interviewTime) : 30;
  //   const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  //   const newEvent = {
  //     id: Date.now(),
  //     title: selectedStudent.name,
  //     start: startDate,
  //     end: endDate, // 終了時間を指定すると、その長さの枠になる！
  //     allDay: false, // ★ここ重要：falseにすると時間表示になる
  //   };
  //   // 3. 予定リストに追加する
  //   setCalendarEvents([...calendarEvents, newEvent]);

  //   arg.view.calendar.unselect();
  // };

  // 予定をクリックした時の処理（削除）
  const handleEventClick = (arg) => {
    // JSの標準機能で確認ダイアログを出す
    if (confirm(`「${arg.event.title}」の予定を削除しますか？`)) {
      // クリックされた予定のID以外を残す (filter)
      // arg.event.id は文字列で来るので、Numberに変換して比較するのがコツ
      setCalendarEvents(
        calendarEvents.filter((event) => event.id !== Number(arg.event.id)),
      );

      // カレンダー上からも消すおまじない
      arg.event.remove();
    }
  };

  const handleDateSelect = (arg) => {
    if (!selectedStudent) {
      alert("生徒を選択してください！");
      return;
    }
    const isTeacher = selectedStudent.id === TEACHER.id;
    const eventColor = isTeacher ? TEACHER.color : "#10b981"; // 青 or 緑

    const newEvent = {
      id: Date.now(),
      title: selectedStudent.name,
      start: arg.start,
      end: arg.end, // 終了時間を指定すると、その長さの枠になる！
      color: eventColor,
      allDay: false, // ★ここ重要：falseにすると時間表示になる
      resourceId: selectedStudent.id,
    };
    // 3. 予定リストに追加する
    setCalendarEvents([...calendarEvents, newEvent]);
  };

const optimizeAlg = (allCandidates) => {
    // === Step 1: 日ごとの「人気度（ユニークな生徒数）」を集計 ===
    const dayScores = {}; 

    allCandidates.forEach(candidate => {
      // 日付ごとのキーを作る（例: "Mon Feb 10 2026"）
      const dayKey = candidate.start.toDateString();

      // まだキーがなければ、新しい「生徒ID入れ（Set）」を作る
      if (!dayScores[dayKey]) {
        dayScores[dayKey] = new Set();
      }

      // その日の箱に生徒IDを入れる（Setなので重複しない！）
      dayScores[dayKey].add(candidate.studentId);
    });

    // === Step 2: 「人気が高い日」順に並べ替える ===
    allCandidates.sort((a, b) => {
      const dayKeyA = a.start.toDateString();
      const dayKeyB = b.start.toDateString();

      // その日の人数（Setのサイズ）を取得
      const scoreA = dayScores[dayKeyA].size;
      const scoreB = dayScores[dayKeyB].size;

      // 比較1: 人数が多いほうが勝ち（降順）
      if (scoreA !== scoreB) {
        return scoreB - scoreA; 
      }
      
      // 比較2: 人数が同じなら、時間が早いほうが勝ち（昇順）
      return a.start - b.start; 
    });

    // === Step 3: 決定していく ===
    const result = [];
    const finishStudentIds = []; // 終わった生徒IDリスト

    for (const candidate of allCandidates) {
      // 1. すでに終わった生徒ならスキップ
      if (finishStudentIds.includes(candidate.studentId)) {
        continue;
      }

      // 2. 時間の重複チェック
      // (今回は日付がバラバラに来るので、決定済みリストと総当たりで比較する)
      let isOverlap = false;
      for (const scheduled of result) {
        // 重なり判定の公式: (開始A < 終了B) && (終了A > 開始B)
        if (candidate.start < scheduled.end && candidate.end > scheduled.start) {
          isOverlap = true;
          break; // 重なってたら即アウト
        }
      }

      // 重なってないなら採用！
      if (!isOverlap) {
        result.push(candidate);
        finishStudentIds.push(candidate.studentId);
      }
    }
    
    return result;
  };

  const matching = () => {
    if (isExecuted) {
      setCalendarEvents(backupEvents); // 1. バックアップから復元
      setIsExecuted(false); // 2. フラグを戻す
      return;
    }
    // === 実行モード (Execute) ===
    // 1. まず今の状態をバックアップ！ (これがないと消える)
    setBackupEvents(calendarEvents);
    const teacherEvents = calendarEvents.filter(
      (e) => e.resourceId === TEACHER.id,
    );
    const studentEvents = calendarEvents.filter(
      (e) => e.resourceId !== TEACHER.id,
    );

    let allCandidates = [];
    const duration = parseInt(interviewTime);

    studentEvents.forEach((studentEvent) => {
      teacherEvents.forEach((teacherEvent) => {
        // 1. まず重なり（Intersection）を計算
        const intersectStart = new Date(
          Math.max(studentEvent.start.getTime(), teacherEvent.start.getTime()),
        );
        const intersectEnd = new Date(
          Math.min(studentEvent.end.getTime(), teacherEvent.end.getTime()),
        );

        // 2. 重なりがあるなら、そこを「コマ」に分解する
        if (intersectStart < intersectEnd) {
          // さっき作った関数で分解！
          const slots = generateSlots(intersectStart, intersectEnd, duration);

          // 分解したコマを「候補リスト」に入れる
          slots.forEach((slot) => {
            allCandidates.push({
              id: Date.now() + Math.random(),
              title: `候補: ${studentEvent.title}`, // "候補: Aさん"
              start: slot.start,
              end: slot.end,
              resourceId: "candidate", // 仮のID
              color: "#ff9f89", // オレンジ

              // ★重要：後で「誰の候補か」判別するためにデータを持たせておく
              studentName: studentEvent.title,
              studentId: studentEvent.resourceId,
              
            });
          });
        }
      });
    });
    const result = optimizeAlg(allCandidates);
    // 3. 結果を表示
    if (result.length === 0) {
      alert("マッチングする時間がありませんでした...");
    } else {
      if (
        confirm(
          `${result.length}件の候補が見つかりました！表示を切り替えますか？`,
        )
      ) {
        setCalendarEvents(result); // カレンダーの中身を「結果」に置き換える
        setIsExecuted(true); // 2. フラグを戻す
      }
    }
  };

  // ★ 汎用関数：指定された期間を「面談時間」で分割して配列にする
  const generateSlots = (start, end, durationMinutes) => {
    const slots = [];
    let current = new Date(start);
    const endTime = new Date(end);
    // durationが0や未設定なら、無限ループ防止でデフォルト30分にする
    const safeDuration =
      durationMinutes && durationMinutes > 0 ? durationMinutes : 30; // C言語でいう while(current + duration <= end)
    while (true) {
      // 次の終了時間を計算
      const nextEnd = new Date(current.getTime() + safeDuration * 60000);
      // お尻がはみ出したら終了
      if (nextEnd > endTime) {
        break;
      }
      // コマを登録
      slots.push({
        start: new Date(current), // コピーを作成
        end: nextEnd,
      });
      // ポインタを進める (current += duration)
      current = nextEnd;
    }

    return slots;
  };

  return (
    <div className="h-screen flex flex-col ">
      <div className=" p-4 ">
        {/* {Sidebar} */}
        <h1 className="text-xl font-bold ">面談候補システム</h1>
        <>
          {/* {option(アルゴリズムの選択。時間、生徒の追加....)} */}
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            {/* {アルゴリズムの選定} */}
            <option value="minimizeDays">日数を最小化</option>
            <option value="minimizeRest">休憩時間を最小化</option>
          </select>
          {/* 面談回数 */}
          <div className="flex items-center">
            <span className="ml-1 text-sm font-bold text-gray-600">
              最大件数:
            </span>
            <input
              type="number"
              className="border border-gray-300 p-1 ml-2 w-20" // 少し幅を指定
              placeholder="回数"
              value={maxTimes}
              onChange={(e) => setMaxTimes(e.target.value)}
            />
            <span className="ml-1 text-sm font-bold text-gray-600">件</span>
          </div>

          {/* 面談時間 */}
          <div className="flex items-center">
            <span className="ml-1 text-sm font-bold text-gray-600 ">
              面談時間:
            </span>
            <input
              type="number"
              className="border border-gray-300 p-1 ml-2 w-20"
              placeholder="時間"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
            />
            <span className="ml-1 text-sm font-bold text-gray-600">分</span>
          </div>

          <form onSubmit={addStudent}>
            <input
              type="text"
              value={enteredStudent}
              onChange={(e) => setEnteredStudent(e.target.value)}
            />
            <button>追加</button>
          </form>
          {/* {実行ボタン} */}
          <button
            onClick={matching}
            className={`font-bold py-2 px-6 rounded shadow-lg transition text-white
            ${isExecuted ? "bg-gray-500 hover:bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {isExecuted ? "↩ 元に戻す" : "実行 🚀"}
          </button>
        </>
        <div className="bg-blue-200 p-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStudent(TEACHER)}
            className={`px-6 py-2 rounded-full font-bold border-2 transition shadow-md flex items-center gap-2
              ${
                selectedStudent.id === TEACHER.id
                  ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300" // 選択中
                  : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50" // 未選択
              }`}
          >
            {/* アイコンをつけると分かりやすい */}
            <span>👮‍♂️</span>
            {TEACHER.name}
          </button>

          {students.map((student, index) => {
            // 👈 indexを受け取るのがポイント
            const isSelected = selectedStudent === student;

            return (
              // 選択ボタンと削除ボタンをまとめるコンテナ
              <div key={student.id} className="flex gap-1">
                {/* 選択ボタン (既存のやつ) */}
                <button
                  onClick={() => setSelectedStudent(student)}
                  className={`px-4 py-2 rounded-full font-bold border transition whitespace-nowrap
                    ${
                      isSelected
                        ? "bg-slate-800 text-white shadow-lg"
                        : "bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                >
                  {student.name}
                </button>

                {/* ★削除ボタン (追加) */}
                <button
                  onClick={() => deleteStudent(index)} // indexを渡して削除
                  className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-600 shadow-sm"
                  title="削除"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-blue-100 p-4 ">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale="ja" // 日本語化
          events={calendarEvents}
          // dateClick={handleDateClick}
          eventClick={handleEventClick}
          select={handleDateSelect}
          selectable={true}
        />
      </div>

      <div></div>
    </div>
  );
}
