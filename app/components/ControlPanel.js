// app/components/ControlPanel.js
"use client";
import Link from "next/link";
import {
  CalendarDays,
  ArrowLeft,
  Zap,
  RotateCcw,
  GraduationCap,
  X,
  Info,
} from "lucide-react";
import { useSchedule } from "../contexts/ScheduleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="border-b bg-card">
      {/* === トップバー === */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CalendarDays className="size-4" />
          </span>
          面談スケジューラー
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="size-4" />
            トップへ
          </Link>
        </Button>
      </div>

      {/* === 設定エリア === */}
      <div className="p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* 最適化モード */}
          <div className="flex flex-col gap-1.5">
            <Label>最適化モード</Label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimizeDays">日数を最小化</SelectItem>
                <SelectItem value="minimizeBreaks">休憩時間を最小化</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 面談時間 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="interviewTime">面談時間 (分)</Label>
            <Input
              id="interviewTime"
              type="number"
              className="w-24"
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
            />
          </div>

          {/* 最大面談件数 */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="maxTimes">
              最大面談件数{" "}
              <span className="font-normal text-muted-foreground/70">(0=無制限)</span>
            </Label>
            <Input
              id="maxTimes"
              type="number"
              className="w-24"
              value={maxTimes}
              onChange={(e) => setMaxTimes(e.target.value)}
            />
          </div>

          {/* 生徒を追加 */}
          <form onSubmit={handleAdd} className="flex flex-col gap-1.5">
            <Label htmlFor="addStudent">生徒を追加</Label>
            <div className="flex gap-2">
              <Input
                id="addStudent"
                type="text"
                className="w-44"
                placeholder="名前を入力..."
                value={enteredStudent}
                onChange={(e) => setEnteredStudent(e.target.value)}
              />
              <Button type="submit" variant="secondary">
                追加
              </Button>
            </div>
          </form>

          {/* 実行ボタン */}
          <Button
            onClick={matching}
            size="lg"
            variant={isExecuted ? "outline" : "default"}
            className="ml-auto"
          >
            {isExecuted ? (
              <>
                <RotateCcw className="size-4" />
                予定を戻す
              </>
            ) : (
              <>
                <Zap className="size-4" />
                マッチング実行
              </>
            )}
          </Button>
        </div>

        {/* 対象選択 */}
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border bg-secondary/40 p-2.5">
          <span className="mr-1 text-xs font-medium text-muted-foreground">
            対象を選択
          </span>

          <Button
            onClick={() => setSelectedStudent(TEACHER)}
            size="sm"
            variant={selectedStudent?.id === TEACHER.id ? "default" : "outline"}
            className="rounded-full bg-card"
          >
            <GraduationCap className="size-4" />
            {TEACHER.name}
          </Button>

          {students.map((student, index) => {
            const active = selectedStudent?.id === student.id;
            return (
              <div key={student.id} className="group flex items-center">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(student)}
                  className={`inline-flex h-8 items-center rounded-full border px-3.5 text-sm font-medium transition-colors cursor-pointer ${
                    active
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-input bg-card hover:bg-secondary"
                  }`}
                >
                  {student.name}
                </button>
                <button
                  type="button"
                  onClick={() => deleteStudent(index)}
                  aria-label={`${student.name} を削除`}
                  className="ml-0.5 flex size-5 items-center justify-center rounded-full text-muted-foreground opacity-0 transition hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* 操作ヒント */}
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info className="size-3.5" />
          対象を選んでカレンダーをドラッグで予定を追加。移動・リサイズはドラッグ、削除は右クリック。
        </p>
      </div>
    </div>
  );
}
