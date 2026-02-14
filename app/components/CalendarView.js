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
      start: startDate,
      end: endDate,
      color: eventColor,
      allDay: false,
      resourceId: selectedStudent.id,
    };
    setCalendarEvents([...calendarEvents, newEvent]);
  };

  const handleEventChange = (changeInfo) => {
    const { event } = changeInfo;

    setCalendarEvents((prevEvents) =>
      prevEvents.map((e) => {
        // IDが一致するイベントだけ時間を書き換える
        if (e.id === Number(event.id)) {
          return {
            ...e,
            start: event.start,
            end: event.end,
          };
        }
        return e;
      }),
    );
  };

  // クリックで削除
  // === 3. 右クリックで削除 ===
  const handleEventDidMount = (info) => {
    // 右クリック（contextmenu）イベントを登録
    info.el.addEventListener("contextmenu", (e) => {
      e.preventDefault(); // ブラウザの右クリックメニューを出さない

      if (confirm(`「${info.event.title}」を削除しますか？`)) {
        setCalendarEvents((prev) =>
          prev.filter((e) => e.id !== Number(info.event.id)),
        );
        info.event.remove();
      }
    });
  };

  return (
    <div className="flex-1 bg-white p-4 shadow-inner overflow-hidden">
      <style jsx global>{`
        .fc-timegrid-event {
          margin-right: 12px !important; /* ここがクリック用の隙間になる */
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); /* ついでに影をつけて見やすく */
        }
      `}</style>
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
        selectable={true}
        editable={true} // 編集（ドラッグ移動・リサイズ）OK！
        eventDrop={handleEventChange} // ドロップした時にデータを更新
        eventResize={handleEventChange} // リサイズした時にデータを更新
        slotEventOverlap={false} // これ重要！重なった予定を「横並び」にする
        eventDidMount={handleEventDidMount} // 右クリック削除の実装場所
        height="100%"
        slotMinTime="09:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={true}
      />
    </div>
  );
}
