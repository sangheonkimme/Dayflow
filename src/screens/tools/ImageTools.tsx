"use client";
import { useState } from "react";
import { Icon } from "@/components/Icon";

// ============================================================
// IMAGE TOOLS — Crop & PDF detail pages
// Two design-canvas presentations, each with 2-3 variants.
// ============================================================

// ─── Sample image placeholder ───────────────────────────────
const SampleImg = ({
  aspect = "4 / 3",
  w = "100%",
  h,
  label = "샘플 이미지",
  muted = false,
  rotated = 0,
  flipped = false,
}: any) => (
  <div
    style={{
      width: w,
      height: h,
      aspectRatio: h ? undefined : aspect,
      background: muted
        ? "#e9e3d4"
        : "repeating-linear-gradient(45deg, #cfb582 0 12px, #b89a64 12px 24px), linear-gradient(180deg, #d6bf85, #b89a64)",
      backgroundBlendMode: "multiply",
      border: "1px solid rgba(0,0,0,0.12)",
      borderRadius: 6,
      position: "relative",
      overflow: "hidden",
      transform: `rotate(${rotated}deg) scaleX(${flipped ? -1 : 1})`,
      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
    }}
  >
    {/* faux landscape silhouette */}
    <svg
      viewBox="0 0 200 150"
      preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <circle cx="155" cy="35" r="14" fill="#fff5d6" opacity="0.85" />
      <path
        d="M0 110 L40 85 L70 95 L110 65 L140 80 L180 60 L200 75 L200 150 L0 150 Z"
        fill="rgba(40,35,25,0.55)"
      />
      <path
        d="M0 130 L50 110 L90 120 L130 100 L170 115 L200 105 L200 150 L0 150 Z"
        fill="rgba(20,15,10,0.7)"
      />
    </svg>
    <span
      style={{
        position: "absolute",
        bottom: 6,
        right: 8,
        fontSize: 9,
        fontFamily: "ui-monospace, monospace",
        color: "rgba(255,255,255,0.65)",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </span>
  </div>
);

// ============================================================
// CROP — variant A · Classic editor (toolbar left, preview right)
// ============================================================
function CropClassic({ density = "comfy" }) {
  const [ratio, setRatio] = useState("4:3");
  const [rot, setRot] = useState(0);
  const [flip, setFlip] = useState(false);

  const presets = [
    { id: "free", label: "자유", sub: "비율 고정 X" },
    { id: "1:1", label: "1 : 1", sub: "정사각" },
    { id: "4:3", label: "4 : 3", sub: "기본" },
    { id: "16:9", label: "16 : 9", sub: "와이드" },
    { id: "9:16", label: "9 : 16", sub: "스토리" },
    { id: "ig", label: "인스타", sub: "1080×1080" },
    { id: "yt", label: "유튜브", sub: "1280×720" },
    { id: "fb", label: "페북커버", sub: "1640×624" },
  ];

  return (
    <div className="tool-page">
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 자르기</div>
          <h1 className="page-title">
            이미지 자르기 <span className="hand-sub">— 깔끔하게 잘라내요</span>
          </h1>
          <div className="page-sub">원본 1920 × 1280 px · 1.4 MB · JPEG</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn">초기화</button>
          <button className="timer-btn primary">↓ 내보내기</button>
        </div>
      </div>

      <div className="crop-shell">
        {/* LEFT — control rail */}
        <aside className="crop-rail">
          <div className="rail-section">
            <div className="rail-h">비율 프리셋</div>
            <div className="ratio-grid">
              {presets.map((p) => (
                <button
                  key={p.id}
                  className={"ratio-card" + (ratio === p.id ? " on" : "")}
                  onClick={() => setRatio(p.id)}
                >
                  <RatioGlyph id={p.id} />
                  <b>{p.label}</b>
                  <small>{p.sub}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="rail-section">
            <div className="rail-h">자유 입력</div>
            <div className="num-grid">
              <label>
                <span>W</span>
                <input defaultValue="1080" />
                <em>px</em>
              </label>
              <label>
                <span>H</span>
                <input defaultValue="810" />
                <em>px</em>
              </label>
              <label>
                <span>X</span>
                <input defaultValue="120" />
                <em>px</em>
              </label>
              <label>
                <span>Y</span>
                <input defaultValue="60" />
                <em>px</em>
              </label>
            </div>
          </div>

          <div className="rail-section">
            <div className="rail-h">변환</div>
            <div className="trans-row">
              <button
                className={rot === -90 ? "on" : ""}
                onClick={() => setRot(rot - 90)}
              >
                ↺ -90°
              </button>
              <button
                className={rot === 90 ? "on" : ""}
                onClick={() => setRot(rot + 90)}
              >
                ↻ +90°
              </button>
              <button
                className={flip ? "on" : ""}
                onClick={() => setFlip(!flip)}
              >
                ⇆ 좌우반전
              </button>
            </div>
            <div className="rot-slider">
              <input
                type="range"
                min="-45"
                max="45"
                value={rot % 360 > 45 ? 0 : rot}
                onChange={(e) => setRot(+e.target.value)}
              />
              <span className="rot-val">{rot}°</span>
            </div>
          </div>
        </aside>

        {/* CENTER — preview */}
        <div className="crop-stage">
          <div className="stage-toolbar">
            <span className="stage-meta">미리보기</span>
            <div className="stage-zoom">
              <button>−</button>
              <span>62%</span>
              <button>+</button>
              <span className="div" />
              <button>맞춤</button>
              <button>1:1</button>
            </div>
          </div>
          <div className="stage-canvas">
            <div className="stage-img">
              <SampleImg aspect="3/2" />
              <div className="crop-overlay">
                <div className="crop-grid">
                  {[...Array(9)].map((_, i) => (
                    <span key={i} />
                  ))}
                </div>
                {[...Array(8)].map((_, i) => (
                  <span key={i} className={`crop-h h-${i}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="stage-foot">
            <span>출력 1080 × 810 · 4:3</span>
            <span>예상 용량 ≈ 240 KB</span>
          </div>
        </div>

        {/* RIGHT — output options */}
        <aside className="crop-out">
          <div className="rail-h">내보내기</div>
          <div className="format-row">
            {["JPG", "PNG", "WebP"].map((f) => (
              <button key={f} className={f === "JPG" ? "on" : ""}>
                {f}
              </button>
            ))}
          </div>
          <div className="quality">
            <div className="q-row">
              <span>품질</span>
              <b>92</b>
            </div>
            <input type="range" min="0" max="100" defaultValue="92" />
          </div>
          <div className="rail-h" style={{ marginTop: 18 }}>
            다운로드
          </div>
          <button className="dl-btn">↓ JPG로 저장</button>
          <button className="dl-btn ghost">클립보드 복사</button>
          <div className="tip-card">
            <span className="hand">팁 ✎</span>
            <p>SNS용은 1080px 너비 + 품질 88~92가 가장 안정적이에요.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ============================================================
// CROP — variant B · Big preview, floating toolbar (focused work)
// ============================================================
function CropFocus() {
  const [ratio, setRatio] = useState("16:9");
  return (
    <div className="tool-page focus">
      <div className="focus-head">
        <div className="focus-title">
          <Icon name="crop" size={18} />
          <h2>이미지 자르기</h2>
          <span className="muted">sunset_over_lake.jpg</span>
        </div>
        <div className="focus-actions">
          <button className="timer-btn">취소</button>
          <button className="timer-btn primary">완료 · 저장</button>
        </div>
      </div>

      <div className="focus-stage">
        <div className="focus-img">
          <SampleImg aspect="16/9" />
          <div className="crop-overlay big">
            <div className="crop-grid">
              {[...Array(9)].map((_, i) => (
                <span key={i} />
              ))}
            </div>
            {[...Array(8)].map((_, i) => (
              <span key={i} className={`crop-h h-${i}`} />
            ))}
          </div>
        </div>

        {/* Floating bottom toolbar */}
        <div className="float-bar">
          <div className="float-group">
            <span className="fg-label">비율</span>
            {["1:1", "4:3", "16:9", "9:16", "자유"].map((r) => (
              <button
                key={r}
                className={ratio === r ? "on" : ""}
                onClick={() => setRatio(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <span className="bar-sep" />
          <div className="float-group">
            <span className="fg-label">변환</span>
            <button title="-90°">↺</button>
            <button title="+90°">↻</button>
            <button title="좌우반전">⇆</button>
            <button title="상하반전">⇅</button>
          </div>
          <span className="bar-sep" />
          <div className="float-group">
            <span className="fg-label">출력</span>
            <button className="on">JPG</button>
            <button>PNG</button>
            <button>WebP</button>
            <span className="q-mini">Q 92</span>
          </div>
        </div>

        {/* Floating crumb chip */}
        <div className="crop-readout">
          1920 × 1080 → <b>1280 × 720</b> · 16:9
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CROP — variant C · Batch processing (multi-image)
// ============================================================
function CropBatch() {
  const items = [
    {
      id: 1,
      name: "IMG_2401.jpg",
      size: "3.2 MB",
      status: "done",
      out: "1080×1080",
    },
    {
      id: 2,
      name: "IMG_2402.jpg",
      size: "2.8 MB",
      status: "done",
      out: "1080×1080",
    },
    {
      id: 3,
      name: "IMG_2403.jpg",
      size: "4.1 MB",
      status: "now",
      out: "처리 중…",
    },
    {
      id: 4,
      name: "IMG_2404.jpg",
      size: "1.9 MB",
      status: "wait",
      out: "대기",
    },
    {
      id: 5,
      name: "IMG_2405.jpg",
      size: "3.6 MB",
      status: "wait",
      out: "대기",
    },
    {
      id: 6,
      name: "IMG_2406.jpg",
      size: "2.1 MB",
      status: "wait",
      out: "대기",
    },
  ];
  return (
    <div className="tool-page">
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 자르기 · 일괄</div>
          <h1 className="page-title">
            일괄 자르기 <span className="hand-sub">— 한꺼번에 처리해요</span>
          </h1>
          <div className="page-sub">총 6장 · 같은 비율로 일괄 적용</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn">+ 더 추가</button>
          <button className="timer-btn primary">▶ 처리 시작</button>
        </div>
      </div>

      <div className="batch-shell">
        <div className="batch-settings">
          <div className="rail-h">공통 설정</div>
          <div className="bs-row">
            <span>비율</span>
            <select defaultValue="1:1">
              <option>자유</option>
              <option>1:1</option>
              <option>4:3</option>
              <option>16:9</option>
            </select>
          </div>
          <div className="bs-row">
            <span>출력</span>
            <select defaultValue="JPG">
              <option>JPG</option>
              <option>PNG</option>
              <option>WebP</option>
            </select>
          </div>
          <div className="bs-row">
            <span>품질</span>
            <input type="range" min="0" max="100" defaultValue="90" />
          </div>
          <div className="bs-row">
            <span>파일명</span>
            <input defaultValue="cropped_{n}.jpg" />
          </div>
          <div className="bs-progress">
            <div className="bs-progress-bar">
              <span style={{ width: "38%" }} />
            </div>
            <small>2 / 6 완료 · 예상 1분 12초 남음</small>
          </div>
        </div>

        <div className="batch-grid">
          {items.map((it) => (
            <div key={it.id} className={"batch-card s-" + it.status}>
              <div className="bc-thumb">
                <SampleImg aspect="1/1" />
                {it.status === "done" && <span className="bc-check">✓</span>}
                {it.status === "now" && <span className="bc-spin" />}
              </div>
              <div className="bc-meta">
                <b>{it.name}</b>
                <small>
                  {it.size} · {it.out}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PDF — variant A · Storyboard layout (sortable cards + sidebar)
// ============================================================
function PdfStoryboard() {
  const pages = [
    { id: 1, name: "표지.png", size: "1.2 MB" },
    { id: 2, name: "목차.png", size: "0.8 MB" },
    { id: 3, name: "01_intro.jpg", size: "2.1 MB" },
    { id: 4, name: "02_chart.png", size: "1.4 MB" },
    { id: 5, name: "03_table.png", size: "1.1 MB" },
    { id: 6, name: "04_summary.jpg", size: "1.8 MB" },
  ];
  return (
    <div className="tool-page">
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 → PDF</div>
          <h1 className="page-title">
            이미지를 PDF로 <span className="hand-sub">— 한 권으로 묶어요</span>
          </h1>
          <div className="page-sub">
            {pages.length}장 · 예상 PDF 용량 8.4 MB
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn">+ 이미지 추가</button>
          <button className="timer-btn primary">↓ PDF 만들기</button>
        </div>
      </div>

      <div className="pdf-shell">
        <aside className="pdf-rail">
          <div className="rail-section">
            <div className="rail-h">용지</div>
            <div className="paper-row">
              {[
                { id: "a4", label: "A4", sub: "210 × 297" },
                { id: "lt", label: "Letter", sub: "8.5 × 11" },
                { id: "or", label: "원본", sub: "이미지 크기" },
              ].map((p, i) => (
                <button
                  key={p.id}
                  className={"paper-card" + (i === 0 ? " on" : "")}
                >
                  <span
                    className="paper-glyph"
                    style={{
                      aspectRatio:
                        p.id === "lt"
                          ? "8.5/11"
                          : p.id === "or"
                            ? "4/3"
                            : "210/297",
                    }}
                  />
                  <b>{p.label}</b>
                  <small>{p.sub}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="rail-section">
            <div className="rail-h">방향 / 정렬</div>
            <div className="orient-row">
              <button className="on">세로</button>
              <button>가로</button>
            </div>
            <div className="orient-row" style={{ marginTop: 8 }}>
              <button>장당 1장</button>
              <button>2장 (분할)</button>
            </div>
          </div>

          <div className="rail-section">
            <div className="rail-h">파일명</div>
            <input
              className="rail-input"
              defaultValue="document_2026-05-03.pdf"
            />
          </div>
        </aside>

        <div className="pdf-board">
          <div className="board-h">
            <span>
              페이지 순서 <small>(드래그로 변경)</small>
            </span>
            <span className="muted">{pages.length}장</span>
          </div>
          <div className="page-grid">
            {pages.map((p, i) => (
              <div key={p.id} className="page-card">
                <span className="page-num">{i + 1}</span>
                <span className="page-grip">⋮⋮</span>
                <SampleImg aspect="3/4" muted={i % 2 === 1} />
                <div className="page-name">{p.name}</div>
                <small>{p.size}</small>
              </div>
            ))}
            <div className="page-card add">
              <div className="add-plus">+</div>
              <small>이미지 추가</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PDF — variant B · Empty drop zone (first-run state)
// ============================================================
function PdfEmpty() {
  return (
    <div className="tool-page">
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 → PDF</div>
          <h1 className="page-title">
            이미지를 PDF로 <span className="hand-sub">— 시작해보세요</span>
          </h1>
          <div className="page-sub">
            JPG · PNG · HEIC 지원 · 최대 100장 · 50 MB
          </div>
        </div>
      </div>

      <div className="dropzone">
        <div className="dz-pile">
          <SampleImg aspect="3/4" w="120px" rotated={-7} />
          <SampleImg aspect="3/4" w="120px" rotated={3} />
          <SampleImg aspect="3/4" w="120px" rotated={-2} />
        </div>
        <h2>여기로 이미지를 끌어다 놓으세요</h2>
        <p>
          또는 <button className="dz-link">파일 선택</button> · 클립보드
          붙여넣기 (⌘V) 도 지원해요
        </p>

        <div className="dz-formats">
          <span>JPG</span>
          <span>PNG</span>
          <span>HEIC</span>
          <span>WebP</span>
          <span>GIF</span>
        </div>

        <div className="dz-tips">
          <div className="tip">
            <b>1.</b>
            <span>여러 이미지를 한꺼번에 끌어다 놓아요</span>
          </div>
          <div className="tip">
            <b>2.</b>
            <span>드래그로 순서를 바꿀 수 있어요</span>
          </div>
          <div className="tip">
            <b>3.</b>
            <span>용지 크기 (A4 / Letter / 원본) 선택 후 내보내기</span>
          </div>
        </div>

        <div className="dz-sample">
          <span className="hand">미리 체험해보기 →</span>
          <button className="timer-btn">샘플 3장으로 시작</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PDF — variant B2 · After upload (3 images uploaded)
// ============================================================
function PdfUploaded() {
  const [paper, setPaper] = useState("a4");
  const [orient, setOrient] = useState("portrait");
  const uploaded = [
    { id: 1, name: "01_intro.jpg", size: "2.1 MB", w: 1920, h: 1280 },
    { id: 2, name: "02_chart.png", size: "1.4 MB", w: 1600, h: 1200 },
    { id: 3, name: "03_summary.jpg", size: "1.8 MB", w: 1920, h: 2560 },
  ];
  const totalSize = "5.3 MB";

  return (
    <div className="tool-page">
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 → PDF</div>
          <h1 className="page-title">
            이미지를 PDF로 <span className="hand-sub">— 거의 다 됐어요</span>
          </h1>
          <div className="page-sub">
            {uploaded.length}장 업로드됨 · 원본 {totalSize} · 예상 PDF 3.8 MB
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn">전체 삭제</button>
          <button className="timer-btn">+ 더 추가</button>
          <button className="timer-btn primary">↓ PDF 만들기</button>
        </div>
      </div>

      <div className="pdf-uploaded">
        {/* TOP — uploaded preview strip */}
        <section className="up-strip">
          <div className="strip-h">
            <span className="rail-h" style={{ marginBottom: 0 }}>
              업로드된 이미지
            </span>
            <small className="muted">
              드래그로 순서 변경 · 클릭으로 미리보기
            </small>
          </div>
          <div className="strip-row">
            {uploaded.map((img, i) => (
              <div
                key={img.id}
                className={"strip-card" + (i === 0 ? " active" : "")}
              >
                <span className="strip-num">{i + 1}</span>
                <span className="strip-grip">⋮⋮</span>
                <button className="strip-x" title="제거">
                  ×
                </button>
                <SampleImg
                  aspect={img.w > img.h ? "3/2" : "3/4"}
                  muted={i % 2 === 1}
                />
                <div className="strip-meta">
                  <b>{img.name}</b>
                  <small>
                    {img.size} · {img.w}×{img.h}
                  </small>
                </div>
              </div>
            ))}
            <div className="strip-card add">
              <div className="add-plus">+</div>
              <small>이미지 추가</small>
              <span className="hand">또는 끌어다 놓기</span>
            </div>
          </div>
        </section>

        {/* BOTTOM — settings + summary */}
        <section className="up-bottom">
          <div className="up-settings">
            <div className="rail-h">PDF 설정</div>

            <div className="set-block">
              <div className="set-label">용지 크기</div>
              <div className="paper-row">
                {[
                  {
                    id: "a4",
                    label: "A4",
                    sub: "210 × 297 mm",
                    ratio: "210/297",
                  },
                  {
                    id: "lt",
                    label: "Letter",
                    sub: "8.5 × 11 in",
                    ratio: "8.5/11",
                  },
                  {
                    id: "or",
                    label: "원본",
                    sub: "이미지 그대로",
                    ratio: "4/3",
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    className={"paper-card" + (paper === p.id ? " on" : "")}
                    onClick={() => setPaper(p.id)}
                  >
                    <span
                      className="paper-glyph"
                      style={{ aspectRatio: p.ratio }}
                    />
                    <b>{p.label}</b>
                    <small>{p.sub}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="set-block">
              <div className="set-label">방향</div>
              <div className="orient-row">
                <button
                  className={orient === "portrait" ? "on" : ""}
                  onClick={() => setOrient("portrait")}
                >
                  ┃ 세로
                </button>
                <button
                  className={orient === "landscape" ? "on" : ""}
                  onClick={() => setOrient("landscape")}
                >
                  ━ 가로
                </button>
              </div>
            </div>

            <div className="set-block">
              <div className="set-label">파일명</div>
              <input
                className="rail-input"
                defaultValue="document_2026-05-03.pdf"
              />
            </div>
          </div>

          {/* Live preview */}
          <div className="up-preview">
            <div className="prev-h">
              미리보기{" "}
              <small>
                · {paper === "or" ? "원본" : paper.toUpperCase()}{" "}
                {orient === "portrait" ? "세로" : "가로"}
              </small>
            </div>
            <div className="prev-stack">
              {uploaded.map((img, i) => (
                <div
                  key={img.id}
                  className="prev-page"
                  style={{
                    aspectRatio:
                      orient === "portrait"
                        ? paper === "lt"
                          ? "8.5/11"
                          : paper === "or"
                            ? "3/4"
                            : "210/297"
                        : paper === "lt"
                          ? "11/8.5"
                          : paper === "or"
                            ? "4/3"
                            : "297/210",
                    transform: `translate(${i * 8}px, ${i * 8}px) rotate(${(i - 1) * 1.5}deg)`,
                    zIndex: uploaded.length - i,
                  }}
                >
                  <span className="prev-no">{i + 1}</span>
                  <div className="prev-pad">
                    <SampleImg
                      aspect={img.w > img.h ? "3/2" : "3/4"}
                      muted={i % 2 === 1}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="prev-foot">
              <span className="hand">총 {uploaded.length}쪽</span>
              <span className="muted">예상 3.8 MB</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ============================================================
// PDF — variant C · Spread / book preview (live PDF preview)
// ============================================================
function PdfSpread() {
  const pages = [
    { id: 1, name: "표지" },
    { id: 2, name: "01" },
    { id: 3, name: "02" },
    { id: 4, name: "03" },
    { id: 5, name: "04" },
    { id: 6, name: "05" },
  ];
  return (
    <div className="tool-page">
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 → PDF · 미리보기</div>
          <h1 className="page-title">
            PDF 미리보기 <span className="hand-sub">— 펼쳐서 확인해요</span>
          </h1>
          <div className="page-sub">A4 세로 · 6 페이지 · 8.4 MB 예상</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn">← 편집으로</button>
          <button className="timer-btn primary">↓ 다운로드</button>
        </div>
      </div>

      <div className="spread-shell">
        <aside className="spread-thumbs">
          <div className="rail-h">{pages.length}장</div>
          {pages.map((p, i) => (
            <div
              key={p.id}
              className={"spread-thumb" + (i === 1 || i === 2 ? " on" : "")}
            >
              <span className="t-num">{i + 1}</span>
              <SampleImg aspect="3/4" />
            </div>
          ))}
        </aside>

        <div className="spread-stage">
          <div className="spread-bg">
            <div className="spread-book">
              <div className="spread-page left">
                <div className="page-no">2</div>
                <SampleImg aspect="3/4" />
              </div>
              <div className="spread-page right">
                <div className="page-no">3</div>
                <SampleImg aspect="3/4" muted />
              </div>
            </div>
          </div>
          <div className="spread-controls">
            <button>← 이전</button>
            <span className="spread-pos">2 — 3 / 6</span>
            <button>다음 →</button>
            <span className="div" />
            <button>맞춤</button>
            <button>100%</button>
            <button>200%</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RatioGlyph({ id }) {
  const map = {
    free: [22, 14],
    "1:1": [16, 16],
    "4:3": [22, 16],
    "16:9": [26, 14],
    "9:16": [12, 22],
    ig: [18, 18],
    yt: [24, 14],
    fb: [26, 10],
  };
  const [w, h] = map[id] || [20, 14];
  return <span className="ratio-glyph" style={{ width: w, height: h }} />;
}

// ============================================================
// CANVAS PAGES — wrappers exposing both tools as DesignCanvas
// ============================================================
function CropEmpty({ onPickSample }: { onPickSample?: () => void }) {
  return (
    <div className="tool-page">
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 자르기</div>
          <h1 className="page-title">
            이미지 자르기 <span className="hand-sub">— 시작해보세요</span>
          </h1>
          <div className="page-sub">
            JPG · PNG · HEIC 지원 · 최대 50 MB · 한 번에 한 장씩
          </div>
        </div>
      </div>

      <div className="dropzone">
        <div className="dz-pile">
          <SampleImg aspect="4/3" w="160px" rotated={-3} />
        </div>
        <h2>여기로 이미지를 끌어다 놓으세요</h2>
        <p>
          또는 <button className="dz-link">파일 선택</button> · 클립보드
          붙여넣기 (⌘V) 도 지원해요
        </p>

        <div className="dz-formats">
          <span>JPG</span>
          <span>PNG</span>
          <span>HEIC</span>
          <span>WebP</span>
          <span>GIF</span>
        </div>

        <div className="dz-tips">
          <div className="tip">
            <b>1.</b>
            <span>드래그로 자를 영역을 선택해요</span>
          </div>
          <div className="tip">
            <b>2.</b>
            <span>비율(1:1 / 16:9 / 자유) 을 골라 정렬해요</span>
          </div>
          <div className="tip">
            <b>3.</b>
            <span>원하는 포맷·크기로 내보내요</span>
          </div>
        </div>

        <div className="dz-sample">
          <span className="hand">미리 체험해보기 →</span>
          <button className="timer-btn" onClick={onPickSample}>
            샘플 이미지로 시작
          </button>
        </div>
      </div>
    </div>
  );
}

function CropCanvasPage() {
  const [state, setState] = useState<"empty" | "loaded">("empty");
  const [variant, setVariant] = useState("classic");
  const renderLoaded = () => {
    if (variant === "focus") return <CropFocus />;
    if (variant === "batch") return <CropBatch />;
    return <CropClassic />;
  };
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="variant-switch">
        <span className="vs-label">상태</span>
        <button
          className={state === "empty" ? "on" : ""}
          onClick={() => setState("empty")}
        >
          업로드 전
        </button>
        <button
          className={state === "loaded" ? "on" : ""}
          onClick={() => setState("loaded")}
        >
          업로드 후
        </button>
        {state === "loaded" && (
          <>
            <span className="vs-label" style={{ marginLeft: 12 }}>
              모드
            </span>
            <button
              className={variant === "classic" ? "on" : ""}
              onClick={() => setVariant("classic")}
            >
              기본
            </button>
            <button
              className={variant === "focus" ? "on" : ""}
              onClick={() => setVariant("focus")}
            >
              포커스 모드 <span className="pro-badge">PRO</span>
            </button>
            <button
              className={variant === "batch" ? "on" : ""}
              onClick={() => setVariant("batch")}
            >
              일괄 처리 <span className="pro-badge">PRO</span>
            </button>
          </>
        )}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {state === "empty" ? (
          <CropEmpty onPickSample={() => setState("loaded")} />
        ) : (
          renderLoaded()
        )}
      </div>
    </div>
  );
}

function PdfCanvasPage() {
  const [state, setState] = useState("empty");
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="variant-switch">
        <span className="vs-label">상태</span>
        <button
          className={state === "empty" ? "on" : ""}
          onClick={() => setState("empty")}
        >
          업로드 전
        </button>
        <button
          className={state === "uploaded" ? "on" : ""}
          onClick={() => setState("uploaded")}
        >
          업로드 후 (3장)
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
        {state === "empty" ? <PdfEmpty /> : <PdfUploaded />}
      </div>
    </div>
  );
}

export { CropCanvasPage, PdfCanvasPage };
