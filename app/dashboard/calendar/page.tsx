"use client";

import { CalendarPage } from "@/screens/calendar/CalendarPage";
import { useModalStore } from "@/store/modal";

export default function Page() {
  const openEvent = useModalStore((s) => s.openEvent);
  return <CalendarPage onAdd={() => openEvent()} onEditEvent={openEvent} />;
}
