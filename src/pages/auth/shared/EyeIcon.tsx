// @ts-nocheck
export const EyeIcon = ({ on, dark }) => (
  <button
    type="button"
    style={{
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 6,
      color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)",
    }}
  >
    {on ? (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ) : (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M3 3l18 18M10.6 6.1A11 11 0 0 1 12 6c6.5 0 10 6 10 6a18 18 0 0 1-3.3 3.9M6.6 6.6C3.6 8.4 2 12 2 12s3.5 7 10 7c1.6 0 3-.3 4.3-.8" />
      </svg>
    )}
  </button>
);

// pwd strength 0-3
