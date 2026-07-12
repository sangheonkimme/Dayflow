export const Ico = ({ name, size = 22 }: any) => {
  const s = { width: size, height: size };
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths = {
    bell: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...stroke} />
        <path d="M10 21a2 2 0 0 0 4 0" {...stroke} />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" {...stroke} />
        <path
          d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1"
          {...stroke}
        />
      </>
    ),
    edit: (
      <>
        <path d="M3 17.5V21h3.5L17 10.5 13.5 7zM14.5 5.5l4 4" {...stroke} />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" {...stroke} />
        <path d="m21 21-4.3-4.3" {...stroke} />
      </>
    ),
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" {...stroke} />,
    home: (
      <>
        <path d="M3 11l9-8 9 8" {...stroke} />
        <path d="M5 10v10h14V10" {...stroke} />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="6" width="18" height="14" rx="2" {...stroke} />
        <path d="M3 10h14a2 2 0 0 0 0-4H6" {...stroke} />
        <circle cx="17" cy="13" r="1.5" fill="currentColor" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" {...stroke} />
      </>
    ),
    close: (
      <>
        <path d="M6 6l12 12M18 6L6 18" {...stroke} />
      </>
    ),
    cal: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" {...stroke} />
        <path d="M3 10h18M8 3v4M16 3v4" {...stroke} />
      </>
    ),
    menu: (
      <>
        <circle cx="5" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="19" cy="12" r="1.5" fill="currentColor" />
      </>
    ),
    coin: (
      <>
        <circle cx="12" cy="12" r="9" {...stroke} />
        <path
          d="M9 9.5c.8-1 2-1.5 3-1.5s3 .5 3 2-1.5 2-3 2-3 .5-3 2 1.5 2 3 2 2.5-.5 3-1.5M12 6v2M12 16v2"
          {...stroke}
        />
      </>
    ),
    crop: (
      <>
        <path
          d="M6 2v14a2 2 0 0 0 2 2h14M2 6h14a2 2 0 0 1 2 2v14"
          {...stroke}
        />
      </>
    ),
    pdf: (
      <>
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          {...stroke}
        />
        <path d="M14 2v6h6M8 13h2M8 17h6M14 13h2" {...stroke} />
      </>
    ),
    play: <path d="M6 4l14 8-14 8z" fill="currentColor" />,
    pause: (
      <>
        <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
        <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
      </>
    ),
    refresh: (
      <>
        <path
          d="M3 12a9 9 0 0 1 15.5-6.3L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3L3 16M3 21v-5h5"
          {...stroke}
        />
      </>
    ),
    chevL: <path d="m15 6-6 6 6 6" {...stroke} />,
    chevR: <path d="m9 6 6 6-6 6" {...stroke} />,
    bag: (
      <>
        <path d="M3 8h18l-2 12H5z" {...stroke} />
        <path d="M9 8a3 3 0 0 1 6 0" {...stroke} />
      </>
    ),
    bus: (
      <>
        <rect x="4" y="4" width="16" height="14" rx="2" {...stroke} />
        <path d="M4 12h16M8 18v2M16 18v2" {...stroke} />
        <circle cx="8" cy="15" r="1" fill="currentColor" />
        <circle cx="16" cy="15" r="1" fill="currentColor" />
      </>
    ),
    cup: (
      <>
        <path d="M3 8h13v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z" {...stroke} />
        <path d="M16 10h2a2 2 0 0 1 0 4h-2" {...stroke} />
      </>
    ),
    tag: (
      <>
        <path d="M2 12V4a2 2 0 0 1 2-2h8l10 10-10 10z" {...stroke} />
        <circle cx="7" cy="7" r="1.5" fill="currentColor" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V5l11-2v13" {...stroke} />
        <circle cx="6" cy="18" r="3" {...stroke} />
        <circle cx="17" cy="16" r="3" {...stroke} />
      </>
    ),
    cloud: (
      <>
        <path
          d="M7 18a4 4 0 0 1-1-7.9 6 6 0 0 1 11.6-1A4.5 4.5 0 0 1 17 18z"
          {...stroke}
        />
      </>
    ),
    check: <path d="m4 12 5 5L20 6" {...stroke} />,
    doc: (
      <>
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
          {...stroke}
        />
        <path d="M14 2v6h6M8 13h8M8 17h6" {...stroke} />
      </>
    ),
    heart: (
      <path
        d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"
        {...stroke}
      />
    ),
    msg: (
      <>
        <path
          d="M21 12a8 8 0 1 1-3.5-6.6L21 4l-1.4 3.5A8 8 0 0 1 21 12z"
          {...stroke}
        />
        <circle cx="9" cy="12" r="1" fill="currentColor" />
        <circle cx="13" cy="12" r="1" fill="currentColor" />
        <circle cx="17" cy="12" r="1" fill="currentColor" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3.5" {...stroke} />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" {...stroke} />
        <circle cx="17" cy="9" r="2.5" {...stroke} />
        <path d="M16 14a5 5 0 0 1 5.5 5" {...stroke} />
      </>
    ),
    fire: (
      <path
        d="M12 22a6 6 0 0 0 6-6c0-3-2-5-3-6.5-.5 1.5-1.5 2-2.5 1.5C13 9 14 7 13 4c-1.5 1-3 2.5-4 4.5-1 2-3 4-3 7a6 6 0 0 0 6 6.5z"
        {...stroke}
      />
    ),
    spark: (
      <>
        <path d="M12 3v6M12 15v6M3 12h6M15 12h6" {...stroke} />
        <path
          d="M5.5 5.5l3.5 3.5M15 15l3.5 3.5M5.5 18.5l3.5-3.5M15 9l3.5-3.5"
          {...stroke}
        />
      </>
    ),
    bookmark: <path d="M5 3h14v18l-7-4-7 4z" {...stroke} />,
    trophy: (
      <>
        <path d="M7 4h10v4a5 5 0 1 1-10 0z" {...stroke} />
        <path
          d="M7 6H4a2 2 0 0 0 3 4M17 6h3a2 2 0 0 1-3 4M9 14h6l1 6H8z"
          {...stroke}
        />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" style={s}>
      {paths[name]}
    </svg>
  );
};

// ───────── small primitives ─────────
