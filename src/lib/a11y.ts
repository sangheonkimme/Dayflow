import type { KeyboardEvent, SyntheticEvent } from "react";

// 클릭 가능한 비-버튼 요소(div 카드·행 등)에 spread 해서
// role/tabIndex + Enter·Space 키 활성화를 한 번에 부여한다.
// 진짜 버튼으로 바꿀 수 있으면 <button> 이 우선 — 이건 레이아웃상
// button 전환이 어려운 곳 전용 (jsx-a11y click-events-have-key-events 대응).
export function pressable(onActivate: (e: SyntheticEvent) => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onActivate(e);
      }
    },
  };
}
