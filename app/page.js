"use client";
import { ScheduleProvider } from "./contexts/ScheduleContext";
import ControlPanel from "./components/ControlPanel";
import CalendarView from "./components/CalendarView";

export default function Home() {
  return (
    <ScheduleProvider>
      <div className="h-screen flex flex-col bg-slate-50 text-slate-900">
        {/* 上：操作パネル */}
        <ControlPanel />
        
        {/* 下：カレンダー表示（残りの高さを全部使う） */}
        <CalendarView />
      </div>
    </ScheduleProvider>
  );
}