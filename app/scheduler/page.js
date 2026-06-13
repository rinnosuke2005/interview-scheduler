"use client";
import { ScheduleProvider } from "../contexts/ScheduleContext";
import ControlPanel from "../components/ControlPanel";
import CalendarView from "../components/CalendarView";

export default function SchedulerPage() {
  return (
    <ScheduleProvider>
      <div className="flex h-screen flex-col bg-secondary/30 text-foreground">
        {/* 上：操作パネル */}
        <ControlPanel />

        {/* 下：カレンダー表示（残りの高さを全部使う） */}
        <CalendarView />
      </div>
    </ScheduleProvider>
  );
}
