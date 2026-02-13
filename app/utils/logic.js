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
export const optimizeAlg = (allCandidates) => {
  const dayScores = {};

  // 1. 日ごとの人気度集計
  allCandidates.forEach((candidate) => {
    const dayKey = candidate.start.toDateString();
    if (!dayScores[dayKey]) dayScores[dayKey] = new Set();
    dayScores[dayKey].add(candidate.studentId);
  });

  // 2. ソート（人気順 ＞ 時間順）
  allCandidates.sort((a, b) => {
    const scoreA = dayScores[a.start.toDateString()].size;
    const scoreB = dayScores[b.start.toDateString()].size;
    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.start - b.start;
  });

  // 3. 決定処理
  const result = [];
  const finishStudentIds = [];

  for (const candidate of allCandidates) {
    if (finishStudentIds.includes(candidate.studentId)) continue;

    let isOverlap = false;
    for (const scheduled of result) {
      if (candidate.start < scheduled.end && candidate.end > scheduled.start) {
        isOverlap = true;
        break;
      }
    }

    if (!isOverlap) {
      result.push(candidate);
      finishStudentIds.push(candidate.studentId);
    }
  }

  return result;
};