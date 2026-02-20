// app/contexts/ScheduleContext.js
"use client";
import { createContext, useState, useContext } from "react";
import { optimizeAlg, generateSlots } from "../utils/logic"; // さっき作ったロジックを読み込む

// 1. Contextを作る
const ScheduleContext = createContext();

// 2. Providerを作る
export const ScheduleProvider = ({ children }) => {
  // === ここに page.js の state を全部持ってくる ===
  const [students, setStudents] = useState([
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "C" },
  ]);
  const TEACHER = { id: "teacher", name: "自分（教員）", color: "#3788d8" };

  const [enteredStudent, setEnteredStudent] = useState("");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [backupEvents, setBackupEvents] = useState([]);
  const [isExecuted, setIsExecuted] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(students[0]); // 初期値
  const [algorithm, setAlgorithm] = useState("minimizeDays");
  const [maxTimes, setMaxTimes] = useState(0);
  const [interviewTime, setInterviewTime] = useState(30); // 初期値30分にしておくと安全

  // === 関数（アクション）もここに移動 ===

  // 生徒追加
  const addStudent = (name) => {
    if (!name) return;
    const newStudent = { id: Date.now(), name };
    setStudents([...students, newStudent]);
    setEnteredStudent(""); // 入力欄をクリア
  };

  // 生徒削除
  const deleteStudent = (indexToDelete) => {
    const studentToDelete = students[indexToDelete];
    const newStudents = students.filter((_, index) => index !== indexToDelete);
    setStudents(newStudents);
    // 選択中の人が消されたら選択解除
    if (selectedStudent && studentToDelete.id === selectedStudent.id) {
      setSelectedStudent(null);
    }
  };

  // 実行ボタンのロジック
  const matching = () => {
    if (isExecuted) {
      setCalendarEvents(backupEvents);
      setIsExecuted(false);
      return;
    }

    setBackupEvents(calendarEvents);

    const teacherEvents = calendarEvents.filter(
      (e) => e.resourceId === TEACHER.id,
    );
    const studentEvents = calendarEvents.filter(
      (e) => e.resourceId !== TEACHER.id,
    );

    let allCandidates = [];
    const duration = interviewTime ? parseInt(interviewTime) : 30;

    studentEvents.forEach((studentEvent) => {
      teacherEvents.forEach((teacherEvent) => {
        const intersectStart = new Date(
          Math.max(studentEvent.start.getTime(), teacherEvent.start.getTime()),
        );
        const intersectEnd = new Date(
          Math.min(studentEvent.end.getTime(), teacherEvent.end.getTime()),
        );

        if (intersectStart < intersectEnd) {
          const slots = generateSlots(intersectStart, intersectEnd, duration);
          slots.forEach((slot) => {
            allCandidates.push({
              id: Date.now() + Math.random(),
              title: `決定: ${studentEvent.title}`,
              start: slot.start,
              end: slot.end,
              resourceId: "result",
              color: "#ff9f89",
              studentId: studentEvent.resourceId,
            });
          });
        }
      });
    });

    if (allCandidates.length === 0) {
      alert("マッチングする時間がありませんでした...");
      return;
    }

    const result = optimizeAlg(allCandidates, maxTimes, algorithm);
    // ▼▼▼ 【NEW】結果の判定とメッセージ出し分け ▼▼▼
    const matchedCount = result.length; // 組めた件数
    const targetCount = studentEvents.length; // 元々の希望者の数

    if (matchedCount === 0) {
      alert("条件に合う候補が1件も見つかりませんでした...");
    } else if (matchedCount === targetCount) {
      // 全員成功パターン
      if (confirm(`完璧です！全員（${matchedCount}件）のスケジュールが組めました！適用しますか？`)) {
        setCalendarEvents(result);
        setIsExecuted(true);
      }
    } else {
      // 一部のみ成功（妥協）パターン
      if (confirm(`全員は組めませんでしたが、${matchedCount}人 のスケジュールを最大化して組みました。\nこの状態で適用しますか？`)) {
        setCalendarEvents(result);
        setIsExecuted(true);
      }
    }

  };

  // 3. 値をまとめて公開する
  const value = {
    students,
    setStudents,
    calendarEvents,
    setCalendarEvents,
    selectedStudent,
    setSelectedStudent,
    enteredStudent,
    setEnteredStudent,
    addStudent,
    deleteStudent,
    matching,
    isExecuted,
    TEACHER,
    algorithm,
    setAlgorithm,
    maxTimes,
    setMaxTimes,
    interviewTime,
    setInterviewTime,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};

// 4. 簡単に使うためのカスタムフック
export const useSchedule = () => useContext(ScheduleContext);
