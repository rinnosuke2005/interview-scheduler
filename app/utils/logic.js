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
export const optimizeAlg = (allCandidates, maxLimit = 0) => {
  
  // 【NEW】制限用の変数を準備（0なら無制限として扱う）
  const dailyLimit = maxLimit > 0 ? maxLimit : 9999;

  // 1. 生徒数を確認
  const allStudentIds = new Set();
  allCandidates.forEach((c) => allStudentIds.add(c.studentId));
  const totalStudentCount = allStudentIds.size;

  // 2. 日付ごとに候補をまとめる
  const dayGroups = {};
  allCandidates.forEach((c) => {
    const key = c.start.toDateString();
    if (!dayGroups[key]) dayGroups[key] = [];
    dayGroups[key].push(c);
  });

  // 日付リスト
  const dateChoices = Object.values(dayGroups).sort((a, b) => b.length - a.length);

  // === 探索関数 ===
  let bestSolution = null;

  const search = (currentEvents, coveredIds, index, daysUsedCount) => {
    
    // 【枝刈り】日数オーバーなら終了
    if (bestSolution && daysUsedCount >= bestSolution.days) {
      return;
    }

    // 【ゴール達成】
    if (coveredIds.size === totalStudentCount) {
      if (!bestSolution || daysUsedCount < bestSolution.days) {
        bestSolution = { days: daysUsedCount, events: [...currentEvents] };
      }
      return;
    }

    // 【終了】
    if (index >= dateChoices.length) {
      return;
    }

    // === 分岐A: この日を「採用する」パターン ===
    const todaysCandidates = dateChoices[index];
    todaysCandidates.sort((a, b) => a.start - b.start);

    const pickedInThisDay = [];
    const newCoveredIds = new Set(coveredIds); // コピーを作成
    let addedSomethingNew = false;

    for (const cand of todaysCandidates) {
      // ▼▼▼【NEW】ここに追加！上限チェック ▼▼▼
      // すでにこの日の上限数まで積んでいたら、もう追加せずループを抜ける
      if (pickedInThisDay.length >= dailyLimit) {
        break; 
      }
      // ▲▲▲ 追加ここまで ▲▲▲

      // すでに救済済みの生徒ならスキップ
      if (newCoveredIds.has(cand.studentId)) continue;

      // 時間被りチェック
      let isOverlap = false;
      for (const picked of pickedInThisDay) {
        if (cand.start < picked.end && cand.end > picked.start) {
          isOverlap = true;
          break;
        }
      }

      // 採用！
      if (!isOverlap) {
        pickedInThisDay.push(cand);
        newCoveredIds.add(cand.studentId); // ここでIDセットに追加
        addedSomethingNew = true;
      }
    }

    // もしこの日で「誰か1人でも」新しく救えたなら、再帰を進める
    if (addedSomethingNew) {
      search(
        [...currentEvents, ...pickedInThisDay], 
        newCoveredIds, 
        index + 1,
        daysUsedCount + 1 
      );
    }

    // === 分岐B: この日は「採用しない」パターン ===
    search(currentEvents, coveredIds, index + 1, daysUsedCount);
  };

  // 3. 探索開始
  search([], new Set(), 0, 0);

  return bestSolution ? bestSolution.events : [];
};