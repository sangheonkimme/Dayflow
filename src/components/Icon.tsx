import type { ReactElement } from "react";

// ============================================================
// ICONS — minimal stroked set
// ============================================================
interface IconProps {
  name: string;
  size?: number;
}

const Icon = ({ name, size = 18 }: IconProps) => {
  const s = size;
  const stroke = "currentColor";
  const sw = 1.6;
  const props = {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, ReactElement> = {
    home: (
      <>
        <path d="M3 11l9-8 9 8" />
        <path d="M5 10v10h14V10" />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <circle cx="16" cy="15" r="1.2" />
      </>
    ),
    repeat: (
      <>
        <path d="M17 1l4 4-4 4" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="M7 23l-4-4 4-4" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </>
    ),
    crop: (
      <>
        <path d="M6 2v16a2 2 0 0 0 2 2h14" />
        <path d="M2 6h16a2 2 0 0 1 2 2v14" />
      </>
    ),
    pdf: (
      <>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M14 3v6h6" />
      </>
    ),
    coin: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9h4a2 2 0 0 1 0 4H9v6" />
        <path d="M9 13h5" />
      </>
    ),
    cash: (
      <>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    note: (
      <>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
        <path d="M18 2l4 4-9 9H9v-4z" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </>
    ),
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    check: <path d="M5 12l5 5L20 7" />,
    x: (
      <>
        <path d="M18 6L6 18M6 6l12 12" />
      </>
    ),
    play: <path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none" />,
    pause: (
      <>
        <rect x="6" y="4" width="4" height="16" />
        <rect x="14" y="4" width="4" height="16" />
      </>
    ),
    reset: (
      <>
        <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
        <path d="M3 3v5h5" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    arrowUp: (
      <>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </>
    ),
    arrowDown: (
      <>
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </>
    ),
    trash: (
      <>
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      </>
    ),
    cal: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    sparkle: (
      <>
        <path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
      </>
    ),
    zap: <path d="M13 2L3 14h7l-1 8 10-12h-7z" />,
    coffee: (
      <>
        <path d="M18 8h1a3 3 0 0 1 0 6h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" />
        <path d="M6 1v3M10 1v3M14 1v3" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </>
    ),
    flame: (
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17a2.5 2.5 0 0 0 2.5-2.5c0-1.5-1-2.5-1-4A4.5 4.5 0 0 0 14 7c0 .5-.5 1-1 1-1 0-2-1-2-2.5C11 4 12 3 12 3c-3 0-6 3-6 7 0 1.5.5 2.5 1 3.5z" />
    ),
    copy: (
      <>
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
    folder: (
      <>
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </>
    ),
    star: (
      <>
        <path d="M12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158-3.245" />
      </>
    ),
    starFilled: (
      <path
        fill="currentColor"
        stroke="none"
        d="M8.243 7.34l-6.38.925l-.113.023a1 1 0 0 0-.44 1.684l4.622 4.499l-1.09 6.355l-.013.11a1 1 0 0 0 1.464.944l5.706-3l5.693 3l.1.046a1 1 0 0 0 1.352-1.1l-1.091-6.355l4.624-4.5l.078-.085a1 1 0 0 0-.633-1.62l-6.38-.926l-2.852-5.78a1 1 0 0 0-1.794 0l-2.853 5.78z"
      />
    ),
    pin: (
      <>
        <path d="M9 4v6l-2 4v2h10v-2l-2-4v-6" />
        <path d="M12 16v5" />
        <path d="M8 4h8" />
      </>
    ),
    pinFilled: (
      <path
        fill="currentColor"
        stroke="none"
        d="M16 3a1 1 0 0 1 .117 1.993l-.117.007v4.764l1.894 3.789a1 1 0 0 1 .1.331l.006.116v2a1 1 0 0 1-.883.993l-.117.007h-4v4a1 1 0 0 1-1.993.117l-.007-.117v-4h-4a1 1 0 0 1-.993-.883l-.007-.117v-2a1 1 0 0 1 .06-.34l.046-.107l1.894-3.791v-4.762a1 1 0 0 1-.117-1.993l.117-.007h8z"
      />
    ),
    tag: (
      <>
        <path d="M20 12L12 4H4v8l8 8z" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      </>
    ),
    bold: (
      <>
        <path d="M7 4h6a4 4 0 0 1 0 8H7zM7 12h7a4 4 0 0 1 0 8H7z" />
      </>
    ),
    italic: (
      <>
        <path d="M19 4h-9M14 20H5M15 4l-6 16" />
      </>
    ),
    list: (
      <>
        <path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" />
      </>
    ),
    image: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </>
    ),
    link: (
      <>
        <path d="M9 15l6-6" />
        <path d="M11 6l.463-.536a5 5 0 0 1 7.071 7.072l-.534.464" />
        <path d="M13 18l-.397.534a5.068 5.068 0 0 1-7.127 0a4.972 4.972 0 0 1 0-7.071l.524-.463" />
      </>
    ),
    more: (
      <>
        <path d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0" />
        <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0" />
        <path d="M18 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0" />
      </>
    ),
    history: (
      <>
        <path d="M12 8l0 4l2 2" />
        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
      </>
    ),
    quote: (
      <>
        <path d="M7 7h4v4H7zm0 4c0 3 1 4 3 5M13 7h4v4h-4zm0 4c0 3 1 4 3 5" />
      </>
    ),
    h1: (
      <>
        <path d="M4 4v16M14 4v16M4 12h10" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
  };
  return <svg {...props}>{paths[name] || null}</svg>;
};

export { Icon };
