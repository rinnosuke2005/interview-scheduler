// app/utils/logic.js

// ★ 汎用関数：指定された期間を「面談時間」で分割して配列にする
export const generateSlots = (start, end, durationMinutes) => {
  const slots = [];
  let current = new Date(start);
  const endTime = new Date(end);
  const safeDuration =
    durationMinutes && durationMinutes > 0 ? durationMinutes : 30;

  while (true) {
    const nextEnd = new Date(current.getTime() + safeDuration * 60000);
    if (nextEnd > endTime) break;

    slots.push({
      start: new Date(current),
      end: nextEnd,
    });
    current = nextEnd;
  }
  return slots;
};

const calcGap = (events) => {
  if (events.length <= 1) return 0;

  // 1. 日付ごとに予定をグループ分けする
  const byDay = {};
  events.forEach((e) => {
    const date = e.start.toDateString();
    if (!byDay[date]) byDay[date] = [];
    byDay[date].push(e);
  });

  let totalGap = 0;

  // 2. 日ごとに「次の予定の開始時間 - 今の予定の終了時間」を足していく
  for (const date in byDay) {
    const dayEvents = byDay[date].sort((a, b) => a.start - b.start);
    for (let i = 0; i < dayEvents.length - 1; i++) {
      totalGap += dayEvents[i + 1].start - dayEvents[i].end;
    }
  }
  return totalGap;
};

// ★ アルゴリズム：日数を最小化する
// export const optimizeAlg = (allCandidates) => {
//   const dayScores = {};

//   // 1. 日ごとの人気度集計
//   allCandidates.forEach((candidate) => {
//     const dayKey = candidate.start.toDateString();
//     if (!dayScores[dayKey]) dayScores[dayKey] = new Set();
//     dayScores[dayKey].add(candidate.studentId);
//   });

//   // 2. ソート（人気順 ＞ 時間順）
//   allCandidates.sort((a, b) => {
//     const scoreA = dayScores[a.start.toDateString()].size;
//     const scoreB = dayScores[b.start.toDateString()].size;
//     if (scoreA !== scoreB) return scoreB - scoreA;
//     return a.start - b.start;
//   });

//   // 3. 決定処理
//   const result = [];
//   const finishStudentIds = [];

//   for (const candidate of allCandidates) {
//     if (finishStudentIds.includes(candidate.studentId)) continue;

//     let isOverlap = false;
//     for (const scheduled of result) {
//       if (candidate.start < scheduled.end && candidate.end > scheduled.start) {
//         isOverlap = true;
//         break;
//       }
//     }

//     if (!isOverlap) {
//       result.push(candidate);
//       finishStudentIds.push(candidate.studentId);
//     }
//   }

//   return result;
// };

// app/utils/logic.js

// ★ 真・最適化アルゴリズム（再帰探索）
// ★ 真・最適化アルゴリズム（修正版：1日に複数人を詰め込む）
// 【NEW】引数に maxLimit を追加（デフォルト0＝無制限）
// export const optimizeAlg = (
//   allCandidates,
//   maxLimit = 0,
//   algorithm = "minimizeDays",
// ) => {
//   // 【NEW】制限用の変数を準備（0なら無制限として扱う）
//   const dailyLimit = maxLimit > 0 ? maxLimit : 9999;

//   // 1. 生徒数を確認
//   const allStudentIds = new Set();
//   allCandidates.forEach((c) => allStudentIds.add(c.studentId));
//   const totalStudentCount = allStudentIds.size;

//   // 2. 日付ごとに候補をまとめる
//   const dayGroups = {};
//   allCandidates.forEach((c) => {
//     const key = c.start.toDateString();
//     if (!dayGroups[key]) dayGroups[key] = [];
//     dayGroups[key].push(c);
//   });

//   // 日付リスト
//   const dateChoices = Object.values(dayGroups).sort(
//     (a, b) => b.length - a.length,
//   );

//   // === 探索関数 ===
//   let bestSolution = null;

//   const search = (currentEvents, coveredIds, index, daysUsedCount) => {
//     // ▼▼▼ 【NEW】今のスケジュールの「すきま時間」を計算 ▼▼▼
//     const currentGap =
//       algorithm === "minimizeBreaks" ? calcGap(currentEvents) : 0;

//     // ▼▼▼ 【NEW】ベスト記録の更新ロジック ▼▼▼
//     let isBetter = false;
//     if (!bestSolution) {
//       isBetter = true; // 最初は無条件でベスト
//     } else if (coveredIds.size > bestSolution.coveredCount) {
//       isBetter = true; // 1人でも多く救えるなら絶対そっちが良い（Best Effort）
//     } else if (coveredIds.size === bestSolution.coveredCount) {
//       // 人数が同じ場合の「質の勝負」
//       if (algorithm === "minimizeDays" && daysUsedCount < bestSolution.days) {
//         isBetter = true; // 日数最小化モード：日数が少ない方が勝ち
//       } else if (
//         algorithm === "minimizeBreaks" &&
//         currentGap < bestSolution.gap
//       ) {
//         isBetter = true; // 休憩最小化モード：すきま時間が短い方が勝ち
//       }
//     }

//     if (isBetter) {
//       bestSolution = {
//         coveredCount: coveredIds.size,
//         days: daysUsedCount,
//         gap: currentGap, // gap（すきま時間）も記録しておく
//         events: [...currentEvents],
//       };
//     }

//     // 【ゴール達成】
//     if (coveredIds.size === totalStudentCount) {
//       // ※「日程最小化」の時はここで探索を打ち切ってもOKですが、
//       // 「休憩最小化」の時はもっと隙間が少ない神スケジュールがあるかもしれないので、
//       // 探索を続行させます。
//       if (algorithm === "minimizeDays") {
//         return;
//       }
//     }
//     // ▲▲▲ 変更ここまで ▲▲▲

//     // 【終了】
//     if (index >= dateChoices.length) {
//       return;
//     }

//     // === 分岐A: この日を「採用する」パターン ===
//     const todaysCandidates = dateChoices[index];
//     todaysCandidates.sort((a, b) => a.start - b.start);

//     const pickedInThisDay = [];
//     const newCoveredIds = new Set(coveredIds); // コピーを作成
//     let addedSomethingNew = false;

//     for (const cand of todaysCandidates) {
//       // ▼▼▼【NEW】ここに追加！上限チェック ▼▼▼
//       // すでにこの日の上限数まで積んでいたら、もう追加せずループを抜ける
//       if (pickedInThisDay.length >= dailyLimit) {
//         break;
//       }
//       // ▲▲▲ 追加ここまで ▲▲▲

//       // すでに救済済みの生徒ならスキップ
//       if (newCoveredIds.has(cand.studentId)) continue;

//       // 時間被りチェック
//       let isOverlap = false;
//       for (const picked of pickedInThisDay) {
//         if (cand.start < picked.end && cand.end > picked.start) {
//           isOverlap = true;
//           break;
//         }
//       }

//       // 採用！
//       if (!isOverlap) {
//         pickedInThisDay.push(cand);
//         newCoveredIds.add(cand.studentId); // ここでIDセットに追加
//         addedSomethingNew = true;
//       }
//     }

//     // もしこの日で「誰か1人でも」新しく救えたなら、再帰を進める
//     if (addedSomethingNew) {
//       search(
//         [...currentEvents, ...pickedInThisDay],
//         newCoveredIds,
//         index + 1,
//         daysUsedCount + 1,
//       );
//     }

//     // === 分岐B: この日は「採用しない」パターン ===
//     search(currentEvents, coveredIds, index + 1, daysUsedCount);
//   };

//   // 3. 探索開始
//   search([], new Set(), 0, 0);

//   return bestSolution ? bestSolution.events : [];
// };

// 【NEW】真・最適化アルゴリズム（生徒ベースのバックトラッキング）
export const optimizeAlg = (allCandidates, maxLimit = 0, algorithm = "minimizeDays") => {
  const dailyLimit = maxLimit > 0 ? maxLimit : 9999;

  // 1. 【変更】「日付」ではなく「生徒ごと」に候補をまとめる
  const byStudent = {};
  allCandidates.forEach((c) => {
    if (!byStudent[c.studentId]) byStudent[c.studentId] = [];
    byStudent[c.studentId].push(c);
  });
  const studentIds = Object.keys(byStudent);
  const totalStudentCount = studentIds.length;

  let bestSolution = null;

  // === 探索関数 ===
  // studentIndex: 今「何人目の生徒」の予定を組んでいるか
  const search = (studentIndex, currentEvents) => {
    const currentDays = new Set(currentEvents.map(e => e.start.toDateString())).size;
    const currentGap = algorithm === "minimizeBreaks" ? calcGap(currentEvents) : 0;
    const coveredCount = currentEvents.length;

    // 【超重要：枝刈り(Pruning)】
    // 残りの生徒全員を救えたとしても、今のベスト人数に届かないなら、これ以上探すのは無駄なので打ち切る
    if (bestSolution && (coveredCount + (totalStudentCount - studentIndex)) < bestSolution.coveredCount) {
      return;
    }

    // ▼ ベスト記録の更新ロジック（そのまま）
    let isBetter = false;
    if (!bestSolution) {
      isBetter = true;
    } else if (coveredCount > bestSolution.coveredCount) {
      isBetter = true;
    } else if (coveredCount === bestSolution.coveredCount) {
      if (algorithm === "minimizeDays" && currentDays < bestSolution.days) {
        isBetter = true;
      } else if (algorithm === "minimizeBreaks" && currentGap < bestSolution.gap) {
        isBetter = true;
      }
    }

    if (isBetter) {
      bestSolution = {
        coveredCount,
        days: currentDays,
        gap: currentGap,
        events: [...currentEvents],
      };
    }

    // 【終了条件】全生徒をチェックし終わった
    if (studentIndex >= totalStudentCount) return;

    // 今チェックしている生徒の「希望日リスト」を取り出す
    const currentStudentId = studentIds[studentIndex];
    const slotsForStudent = byStudent[currentStudentId] || [];

    // === 分岐A: この生徒を「どれかの希望枠に入れる」パターン ===
    for (const slot of slotsForStudent) {
      const dateStr = slot.start.toDateString();
      const countOnDay = currentEvents.filter(e => e.start.toDateString() === dateStr).length;

      if (countOnDay >= dailyLimit) continue; // 1日の件数制限チェック

      // 時間被りチェック
      let isOverlap = false;
      for (const scheduled of currentEvents) {
        if (slot.start < scheduled.end && slot.end > scheduled.start) {
          isOverlap = true; break;
        }
      }

      if (!isOverlap) {
        // 問題なければこの生徒をスケジュールに加えて、次の生徒へ進む！
        search(studentIndex + 1, [...currentEvents, slot]);
      }
    }

    // === 分岐B: この生徒を「諦める（スキップする）」パターン ===
    // ※「Best Effort」機能のために、あえてこの人を入れない宇宙線も探索します
    search(studentIndex + 1, currentEvents);
  };

  // 3. 0人目の生徒から探索スタート！
  search(0, []);

  return bestSolution ? bestSolution.events : [];
};