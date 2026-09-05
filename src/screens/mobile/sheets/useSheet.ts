import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

/**
 * 모바일 바텀시트 공용 동작 훅.
 * 전 시트가 동일한 래퍼 구조(scrim + .dfmSheet + grip + head + body)를
 * 공유하므로, 열림/닫힘 부수동작을 한 곳에서 처리한다.
 *
 * - ESC 키로 닫기 (기존 useEscapeKey 흡수)
 * - grip/head 드래그로 스냅 전환 (medium ↔ large) — snaps 지정 시
 * - 최소 스냅에서 임계 초과로 끌어내리면 닫기 (swipe-down)
 *
 * DOM 접근이 필요한 focus trap / 드래그는 sheetRef 로 공유한다.
 */

type Snap = "medium" | "large";

interface UseSheetOptions {
  open: boolean;
  onClose: () => void;
  /** medium/large 리사이즈 스냅. 생략 시 고정 높이(드래그는 닫기 용도만). */
  snaps?: Snap[];
}

// medium 스냅 높이 (.dfm 프레임 대비 %). large 는 CSS max-height(88%) 그대로.
const MEDIUM_HEIGHT = "60%";
// large → medium 로 내려앉는 드래그 임계.
const SNAP_DOWN_PX = 70;
// medium → large 로 되돌리는 위로-드래그 임계.
const SNAP_UP_PX = 40;

export function useSheet({ open, onClose, snaps }: UseSheetOptions) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const hasSnaps = !!snaps && snaps.length > 1;

  const [snap, setSnap] = useState<Snap>("large");
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

  // 드래그 추적용 (리렌더 유발 없이 최신값 유지).
  const draggingRef = useRef(false);
  const startY = useRef(0);
  const startT = useRef(0);
  const rawDy = useRef(0);

  // 재오픈 시 스냅/드래그 초기화.
  useEffect(() => {
    if (open) {
      setSnap("large");
      setDragY(0);
    }
  }, [open]);

  // ESC 닫기.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    // 헤더 내부의 컨트롤(닫기 버튼 등) 조작은 드래그로 가로채지 않는다.
    if ((e.target as HTMLElement).closest("button,a,input,textarea,select")) {
      return;
    }
    draggingRef.current = true;
    startY.current = e.clientY;
    startT.current = performance.now();
    rawDy.current = 0;
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    rawDy.current = e.clientY - startY.current;
    // 아래로 끄는 것만 시각 반영 (위로는 스냅 판정에만 사용).
    setDragY(Math.max(0, rawDy.current));
  }, []);

  const endDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    const dy = rawDy.current;
    setDragY(0);
    if (!hasSnaps) return;
    // large 에서 충분히 내리면 medium, medium 에서 충분히 올리면 large.
    if (snap === "large" && dy > SNAP_DOWN_PX) setSnap("medium");
    else if (snap === "medium" && dy < -SNAP_UP_PX) setSnap("large");
  }, [hasSnaps, snap]);

  const sheetStyle: CSSProperties = {
    ...(hasSnaps && snap === "medium" ? { height: MEDIUM_HEIGHT } : {}),
    ...(dragging
      ? { transform: `translateY(${dragY}px)`, transition: "none" }
      : {}),
  };

  const gripHandlers = {
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };

  return { sheetRef, gripHandlers, sheetStyle, snap };
}
