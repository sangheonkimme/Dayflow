// @ts-nocheck
import { useState, useRef } from "react";
import { SwipeIcon } from "@/pages/mobile/shared/SwipeIcon";

export const SwipeRow = ({ children, onDelete, actions, actionLabel = "삭제", revealWidth }) => {
  // build actions array
  const acts = actions && actions.length
    ? actions
    : (onDelete ? [{ label: actionLabel, color: "delete", onClick: onDelete, icon: "trash" }] : []);
  const perWidth = 76;
  const totalWidth = revealWidth ?? perWidth * acts.length;

  const [dx, setDx] = useState(0);
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const startX = useRef(0);
  const startDx = useRef(0);
  const dragging = useRef(false);
  const moved = useRef(false);

  const onStart = (clientX) => {
    startX.current = clientX;
    startDx.current = dx;
    dragging.current = true;
    moved.current = false;
    setAnimating(false);
  };
  const onMove = (clientX) => {
    if (!dragging.current) return;
    const delta = clientX - startX.current;
    if (Math.abs(delta) > 4) moved.current = true;
    let next = startDx.current + delta;
    // only allow swipe-left (negative); rubber band on right
    if (next > 0) next = next * 0.25;
    // sticky stop at the reveal width — needs extra pull to go further into full-swipe territory
    if (acts.length && next < -totalWidth) {
      const over = -next - totalWidth;
      next = -totalWidth - over * 0.45;
    }
    if (next < -totalWidth * 1.8) next = -totalWidth * 1.8 + (next + totalWidth * 1.8) * 0.2;
    setDx(next);
  };
  const onEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (!acts.length) { setAnimating(true); setDx(0); return; }
    setAnimating(true);
    // far-swipe → fire last action (usually delete)
    if (dx < -totalWidth * 1.8) {
      const last = acts[acts.length - 1];
      if (last.color === "delete") {
        setRemoving(true);
        setDx(-600);
        setTimeout(() => last.onClick?.(), 220);
      } else {
        setDx(0); setOpen(false);
        last.onClick?.();
      }
      return;
    }
    // sticky reveal: open as soon as user pulls past ~25% of reveal width, snap to fully open
    if (dx < -totalWidth * 0.25) { setDx(-totalWidth); setOpen(true); }
    else { setDx(0); setOpen(false); }
  };

  // touch handlers
  const onTouchStart = (e) => onStart(e.touches[0].clientX);
  const onTouchMove  = (e) => onMove(e.touches[0].clientX);
  const onTouchEnd   = () => onEnd();
  // mouse handlers (for desktop preview)
  const onMouseDown = (e) => {
    onStart(e.clientX);
    const move = (ev) => onMove(ev.clientX);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      onEnd();
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // suppress click if we actually swiped
  const onClickCapture = (e) => {
    if (moved.current || open) {
      e.stopPropagation();
      e.preventDefault();
      moved.current = false;
      // tap outside on open row → close
      if (open) { setAnimating(true); setDx(0); setOpen(false); }
    }
  };

  const handleAction = (e, a) => {
    e.stopPropagation();
    if (a.color === "delete") {
      setAnimating(true);
      setRemoving(true);
      setDx(-600);
      setTimeout(() => a.onClick?.(), 220);
    } else {
      setAnimating(true);
      setDx(0); setOpen(false);
      a.onClick?.();
    }
  };

  return (
    <div className={"dfm-swipe" + (removing ? " removing" : "")}>
      {acts.length > 0 && (
        <div className="dfm-swipe-actions" style={{ width: totalWidth }}>
          {acts.map((a, i) => (
            <button
              key={i}
              className={`dfm-swipe-action act-${a.color || "neutral"}`}
              onClick={(e) => handleAction(e, a)}
              aria-label={a.label}
            >
              <SwipeIcon name={a.icon} />
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      )}
      <div
        className={"dfm-swipe-content" + (animating ? " anim" : "")}
        style={{ transform: `translateX(${dx}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onClickCapture={onClickCapture}
      >
        {children}
      </div>
    </div>
  );
}


// ────────────────────────────────────────────────
// HOME — fully designed
// ────────────────────────────────────────────────
