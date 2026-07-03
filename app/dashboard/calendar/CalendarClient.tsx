"use client";

import { CalendarPage } from "@/screens/calendar/CalendarPage";
import { useModalStore } from "@/store/modal";
import type { EventDraft } from "@/types";

export default function Page() {
  const openEvent = useModalStore((s) => s.openEvent);
  return (
    <CalendarPage
      onAdd={(draft?: EventDraft) => openEvent(draft)}
      onEditEvent={openEvent}
    />
  );
}
