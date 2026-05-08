import { useState } from "react";
import { Topbar } from "@/components/Shell";
import { StickyNotes } from "@/pages/home/StickyNotes";
import { Checklist } from "@/pages/home/Checklist";
import { GeneralTimer } from "@/pages/home/timers/GeneralTimer";
import { Pomodoro } from "@/pages/home/timers/Pomodoro";
import { Stopwatch } from "@/pages/home/timers/Stopwatch";
import { MoneyFlow } from "@/pages/home/MoneyFlow";
import { MiniCalendar } from "@/pages/home/MiniCalendar";
import { ToolCard } from "@/pages/home/ToolCard";
import type { Tweaks, EventDraft } from "@/types";
import type { SetPreference } from "@/data/preferences";

interface HomePageProps {
  tweaks: Tweaks;
  setTweak: SetPreference;
  setActive: (key: string) => void;
  setSearchOpen: (open: boolean) => void;
  openTxn: () => void;
  openEvent: (editing?: EventDraft) => void;
  onEditTxn: (editing: any) => void;
}

export function HomePage({
  tweaks,
  setTweak,
  setActive,
  setSearchOpen,
  openTxn,
  openEvent,
  onEditTxn,
}: HomePageProps) {
  const [quickMemo, setQuickMemo] = useState("");
  const [memos, setMemos] = useState<string[]>([
    "운동 30분",
    "이메일 답장",
    "저녁 약속 7시",
  ]);
  const addQuickMemo = () => {
    if (!quickMemo.trim()) return;
    setMemos([quickMemo, ...memos].slice(0, 3));
    setQuickMemo("");
  };

  return (
    <>
      <Topbar
        dark={tweaks.dark}
        onToggleDark={() => setTweak("dark", !tweaks.dark)}
        onSearch={() => setSearchOpen(true)}
      />

      <div className="grid">
        <StickyNotes />
        <Checklist />
      </div>

      <div className="section-h" style={{ marginTop: 26 }}>
        <h2>도구 모음</h2>
        <span className="more">전체 보기 →</span>
      </div>
      <div className="grid">
        <ToolCard
          icon="coin"
          title="연봉 계산기"
          desc="실수령액을 간편하게 계산해보세요"
          items={["2026년 기준 세율 적용", "4대 보험 · 소득세 자동 계산"]}
          onClick={() => setActive("salary")}
        />
        <ToolCard
          icon="crop"
          title="이미지 자르기"
          desc="업로드한 이미지를 빠르게 자르고 내보내세요"
          items={["원하는 크기와 포맷 설정", "전체 화면 도구에서 사용 가능"]}
          onClick={() => setActive("crop")}
        />
        <ToolCard
          icon="pdf"
          title="이미지 → PDF"
          desc="여러 이미지를 하나의 PDF로 깔끔하게 합쳐요"
          items={["품질 유지와 순서 편집", "전체 화면 도구에서 진행"]}
          onClick={() => setActive("pdf")}
        />
      </div>

      <div className="section-h" style={{ marginTop: 26 }}>
        <h2>타이머</h2>
        <span className="more" onClick={() => setActive("settings")}>
          설정 →
        </span>
      </div>
      <div className="grid">
        <GeneralTimer />
        <Pomodoro />
        <Stopwatch />
      </div>

      <div className="section-h" style={{ marginTop: 26 }}>
        <h2>한눈에 보기</h2>
        <span className="more" onClick={() => setActive("ledger")}>
          자세히 →
        </span>
      </div>
      <div className="grid">
        <MoneyFlow
          onAdd={() => openTxn()}
          onOpenLedger={() => setActive("ledger")}
          onEditTxn={onEditTxn}
        />
        {tweaks.showCalendar && (
          <MiniCalendar
            onOpen={() => setActive("calendar")}
            memos={memos}
            quickMemo={quickMemo}
            setQuickMemo={setQuickMemo}
            addQuickMemo={addQuickMemo}
            onEditEvent={openEvent}
          />
        )}
      </div>

      <div
        style={{
          marginTop: 32,
          paddingTop: 18,
          borderTop: "1px dashed var(--line)",
          fontSize: 12,
          color: "var(--ink-mute)",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>© 2026 Dayflow Dashboard · Made with ☕ in Seoul</span>
        <span>v2.0 · 패치노트</span>
      </div>
    </>
  );
}
