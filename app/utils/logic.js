// app/utils/logic.js

// ★ 汎用関数：指定された期間を「面談時間」で分割して配列にする
export const generateSlots = (start, end, durationMinutes) => {
  const slots = [];
  let current = new Date(start);
  const endTime = new Date(end);
  const safeDuration = durationMinutes && durationMinutes > 0 ? durationMinutes : 30;

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
export const optimizeAlg = (allCandidates) => {
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

  // 日付リスト（候補が多い順に並べると早く見つかりやすい）
  const dateChoices = Object.values(dayGroups).sort((a, b) => b.length - a.length);

  // === 探索関数 ===
  // bestSolution: { days: 日数, events: [予定リスト] }
  let bestSolution = null;

  const search = (currentEvents, coveredIds, index, daysUsedCount) => {
    
    // 【枝刈り】今の時点で、すでにベスト記録より「日数」が多くなっていたら無駄なので終了
    if (bestSolution && daysUsedCount >= bestSolution.days) {
      return;
    }

    // 【ゴール達成】全員カバーできた？
    if (coveredIds.size === totalStudentCount) {
      // 記録更新！（日数が少ない、または日数が同じなら予定数が多い＝効率が良い）
      if (!bestSolution || daysUsedCount < bestSolution.days) {
        bestSolution = { days: daysUsedCount, events: [...currentEvents] };
      }
      return;
    }

    // 【終了】もう日付がない
    if (index >= dateChoices.length) {
      return;
    }

    // === 分岐A: この日を「採用する」パターン ===
    // その日の候補の中から、重ならないように最大限詰め込む（ここが修正ポイント！）
    const todaysCandidates = dateChoices[index];
    
    // 時間順に並べる（詰め込みやすくするため）
    todaysCandidates.sort((a, b) => a.start - b.start);

    const pickedInThisDay = [];
    const newCoveredIds = new Set(coveredIds);
    let addedSomethingNew = false;

    for (const cand of todaysCandidates) {
      // すでに救済済みの生徒ならスキップ
      if (newCoveredIds.has(cand.studentId)) continue;

      // この日すでに選んだ人たちと時間が被ってないかチェック
      let isOverlap = false;
      for (const picked of pickedInThisDay) {
        if (cand.start < picked.end && cand.end > picked.start) {
          isOverlap = true;
          break;
        }
      }

      // 被ってないなら採用！
      if (!isOverlap) {
        pickedInThisDay.push(cand);
        newCoveredIds.add(cand.studentId);
        addedSomethingNew = true;
      }
    }

    // もしこの日で「誰か1人でも」新しく救えたなら、この分岐を進める
    if (addedSomethingNew) {
      search(
        [...currentEvents, ...pickedInThisDay], 
        newCoveredIds, 
        index + 1,
        daysUsedCount + 1 // 日数を+1カウント
      );
    }

    // === 分岐B: この日は「採用しない」パターン ===
    // まだベストが見つかっていない、または、この日を飛ばしても可能性がある場合
    search(currentEvents, coveredIds, index + 1, daysUsedCount);
  };

  // 3. 探索開始
  search([], new Set(), 0, 0);

  // 見つかった解の「イベントリスト」を返す。ダメなら空配列。
  return bestSolution ? bestSolution.events : [];
};

