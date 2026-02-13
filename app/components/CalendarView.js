// app/components/CalendarView.js
"use client";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSchedule } from "../contexts/ScheduleContext";

export default function CalendarView() {
  const { calendarEvents, setCalendarEvents, selectedStudent, TEACHER } =
    useSchedule();
    
    const BUSINESS_START = 9; // 9時から
    const BUSINESS_END = 22; // 22時まで

  // 選択（ドラッグ）で予定を追加
  const handleDateSelect = (arg) => {
    if (!selectedStudent) {
      alert("上のリストから生徒（または自分）を選択してください！");
      return;
    }

    let startDate = arg.start;
    let endDate = arg.end;

// ★ 修正ポイント：終日エリアがクリックされたら「営業時間いっぱい」にする
    if (arg.allDay) {
      // 0時ではなく、8時にセット
      startDate.setHours(BUSINESS_START, 0, 0, 0);
      
      endDate = new Date(startDate);
      endDate.setHours(BUSINESS_END, 0, 0, 0);
    }
    const isTeacher = selectedStudent.id === TEACHER.id;
    const eventColor = isTeacher ? TEACHER.color : "#10b981";

    const newEvent = {
      id: Date.now(),
      title: selectedStudent.name,
      start: arg.start,
      end: arg.end,
      color: eventColor,
      allDay: false,
      resourceId: selectedStudent.id,
    };
    setCalendarEvents([...calendarEvents, newEvent]);
  };

  // クリックで削除
  const handleEventClick = (arg) => {
    if (confirm(`「${arg.event.title}」を削除しますか？`)) {
      setCalendarEvents((prev) =>
        prev.filter((e) => e.id !== Number(arg.event.id)),
      );
      arg.event.remove();
    }
  };

  return (
    <div className="flex-1 bg-white p-4 shadow-inner overflow-hidden">
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale="ja"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        events={calendarEvents}
        select={handleDateSelect}
        eventClick={handleEventClick}
        selectable={true}
        height="100%"
        slotMinTime="09:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={true}
      />
    </div>
  );
}
