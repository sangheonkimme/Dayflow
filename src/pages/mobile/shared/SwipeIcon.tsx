// @ts-nocheck
export const SwipeIcon = ({ name }) => {
  if (name === "edit")
    return (
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path
          d="M2 11l1-3 6-6 2 2-6 6-3 1zM8 4l2 2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  // default: trash
  return (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path
        d="M3 5h8M5 5V3.5A1 1 0 016 2.5h2a1 1 0 011 1V5M11 5l-.6 6.5A1 1 0 019.4 12.5H4.6a1 1 0 01-1-.9L3 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

// Drag horizontally to reveal one or more actions; release past threshold to fire the last action.
// Pass either `onDelete` (single action) OR `actions=[{label, color, onClick, icon}]`.
