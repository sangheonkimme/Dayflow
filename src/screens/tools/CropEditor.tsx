"use client";
import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import styles from "./ImageTools.module.css";

// 비율 프리셋. 자유는 undefined.
const RATIO_PRESETS: { id: string; label: string; sub: string; aspect?: number }[] = [
  { id: "free", label: "자유", sub: "비율 고정 X", aspect: undefined },
  { id: "1:1", label: "1 : 1", sub: "정사각", aspect: 1 },
  { id: "4:3", label: "4 : 3", sub: "기본", aspect: 4 / 3 },
  { id: "16:9", label: "16 : 9", sub: "와이드", aspect: 16 / 9 },
  { id: "9:16", label: "9 : 16", sub: "스토리", aspect: 9 / 16 },
  { id: "ig", label: "인스타", sub: "1080×1080", aspect: 1 },
  { id: "yt", label: "유튜브", sub: "1280×720", aspect: 16 / 9 },
  { id: "fb", label: "페북커버", sub: "1640×624", aspect: 1640 / 624 },
];

const FORMATS: { id: "jpeg" | "png" | "webp"; label: string; mime: string; ext: string }[] = [
  { id: "jpeg", label: "JPG", mime: "image/jpeg", ext: "jpg" },
  { id: "png", label: "PNG", mime: "image/png", ext: "png" },
  { id: "webp", label: "WebP", mime: "image/webp", ext: "webp" },
];

interface Props {
  file: File;
  onClear: () => void;
}

export function CropEditor({ file, onClear }: Props) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState(false);
  const [ratioId, setRatioId] = useState("free");
  const [formatId, setFormatId] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState(92);
  const [pixels, setPixels] = useState<Area | null>(null);
  const [exporting, setExporting] = useState(false);

  // file → object URL + 원본 크기 측정
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    const img = new Image();
    img.onload = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // 비율 프리셋 바뀌면 위치/줌 리셋 — 직전 crop 박스를 새 비율에 끼우면
  // 어색한 위치로 튐. 새 비율에 맞춰 가운데에서 다시 시작.
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, [ratioId]);

  const aspect = RATIO_PRESETS.find((p) => p.id === ratioId)?.aspect;
  const format = FORMATS.find((f) => f.id === formatId)!;
  const usesQuality = formatId !== "png";

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setPixels(areaPixels);
  }, []);

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlip(false);
    setRatioId("free");
  };

  const handleExport = async () => {
    if (!imageSrc || !pixels) return;
    setExporting(true);
    try {
      const blob = await renderCroppedBlob(imageSrc, pixels, rotation, flip, format.mime, quality / 100);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      downloadBlob(blob, `${baseName}_cropped.${format.ext}`);
    } catch (e) {
      console.error("[CropEditor] export failed", e);
      alert("내보내기에 실패했어요. 다른 이미지로 시도해보세요.");
    } finally {
      setExporting(false);
    }
  };

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const outW = pixels ? Math.round(pixels.width) : 0;
  const outH = pixels ? Math.round(pixels.height) : 0;

  return (
    <div className={styles.toolPage}>
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 자르기</div>
          <h1 className="page-title">
            이미지 자르기 <span className="hand-sub">— 깔끔하게 잘라내요</span>
          </h1>
          <div className="page-sub">
            {file.name} ·{" "}
            {imgSize ? `${imgSize.w} × ${imgSize.h} px` : "불러오는 중…"} · {fmtSize(file.size)}
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn" onClick={handleReset}>
            초기화
          </button>
          <button className="timer-btn" onClick={onClear}>
            다른 이미지
          </button>
          <button
            className="timer-btn primary"
            onClick={handleExport}
            disabled={!pixels || exporting}
          >
            {exporting ? "내보내는 중…" : "↓ 내보내기"}
          </button>
        </div>
      </div>

      <div className={styles.cropShell}>
        {/* LEFT — control rail */}
        <aside className={styles.cropRail}>
          <div className={styles.railSection}>
            <div className={styles.railH}>비율 프리셋</div>
            <div className={styles.ratioGrid}>
              {RATIO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  className={
                    ratioId === p.id ? `${styles.ratioCard} ${styles.on}` : styles.ratioCard
                  }
                  onClick={() => setRatioId(p.id)}
                  type="button"
                >
                  <b>{p.label}</b>
                  <small>{p.sub}</small>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.railSection}>
            <div className={styles.railH}>변환</div>
            <div className={styles.transRow}>
              <button onClick={() => setRotation((r) => (r - 90 + 360) % 360)} type="button">
                ↺ -90°
              </button>
              <button onClick={() => setRotation((r) => (r + 90) % 360)} type="button">
                ↻ +90°
              </button>
              <button
                className={flip ? styles.on : ""}
                onClick={() => setFlip((f) => !f)}
                type="button"
              >
                ⇆ 좌우반전
              </button>
            </div>
            <div className={styles.rotSlider}>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(+e.target.value)}
              />
              <span className={styles.rotVal}>{rotation}°</span>
            </div>
            <div className={styles.rotSlider} style={{ marginTop: 8 }}>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(+e.target.value)}
              />
              <span className={styles.rotVal}>{zoom.toFixed(2)}×</span>
            </div>
          </div>
        </aside>

        {/* CENTER — preview (interactive) */}
        <div className={styles.cropStage}>
          <div className={styles.stageToolbar}>
            <span className={styles.stageMeta}>미리보기 (드래그로 이동 · 스크롤로 줌)</span>
            <div className={styles.stageZoom}>
              <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(2)))} type="button">
                −
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(2)))} type="button">
                +
              </button>
              <span className={styles.div} />
              <button onClick={() => setZoom(1)} type="button">
                맞춤
              </button>
            </div>
          </div>
          <div className={styles.stageCanvas}>
            <div
              className={styles.stageImg}
              style={{ position: "relative", width: "100%", height: "100%", minHeight: 360 }}
            >
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  objectFit="contain"
                  // 극단적 비율 이미지(예: 가로로 긴 배너 + 1:1 프리셋)에서
                  // 이미지 밖 영역도 잡을 수 있게 — 짧은 변 전체 활용 가능.
                  // 영역 밖은 출력 시 투명으로 처리됨.
                  restrictPosition={false}
                  // 자동 minZoom 으로 zoom 이 강제 상승하는 동작 방지.
                  minZoom={0.5}
                  maxZoom={3}
                  transform={`translate(${crop.x}px, ${crop.y}px) rotate(${rotation}deg) scale(${zoom}) scaleX(${flip ? -1 : 1})`}
                />
              )}
            </div>
          </div>
          <div className={styles.stageFoot}>
            <span>
              출력 {outW} × {outH} {aspect ? `· ${ratioId}` : "· 자유"}
            </span>
            <span>{format.label.toUpperCase()}</span>
          </div>
        </div>

        {/* RIGHT — output options */}
        <aside className={styles.cropOut}>
          <div className={styles.railH}>내보내기</div>
          <div className={styles.formatRow}>
            {FORMATS.map((f) => (
              <button
                key={f.id}
                className={formatId === f.id ? styles.on : ""}
                onClick={() => setFormatId(f.id)}
                type="button"
              >
                {f.label}
              </button>
            ))}
          </div>
          {usesQuality && (
            <div className={styles.quality}>
              <div className={styles.qRow}>
                <span>품질</span>
                <b>{quality}</b>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={quality}
                onChange={(e) => setQuality(+e.target.value)}
              />
            </div>
          )}
          <div className={styles.railH} style={{ marginTop: 18 }}>
            다운로드
          </div>
          <button
            className={styles.dlBtn}
            onClick={handleExport}
            disabled={!pixels || exporting}
            type="button"
          >
            {exporting ? "내보내는 중…" : `↓ ${format.label}로 저장`}
          </button>
          <div className={styles.tipCard}>
            <span className={styles.hand}>팁 ✎</span>
            <p>SNS용은 1080px 너비 + 품질 88~92가 가장 안정적이에요.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지 로드 실패"));
    img.src = src;
  });
}

function rotatedBBox(w: number, h: number, deg: number) {
  const r = (deg * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(r) * w) + Math.abs(Math.sin(r) * h),
    height: Math.abs(Math.sin(r) * w) + Math.abs(Math.cos(r) * h),
  };
}

async function renderCroppedBlob(
  imageSrc: string,
  pixels: Area,
  rotation: number,
  flip: boolean,
  mime: string,
  quality: number,
): Promise<Blob> {
  const image = await loadImage(imageSrc);
  // 1) 회전/플립 적용한 큰 캔버스에 원본을 먼저 그림
  const bbox = rotatedBBox(image.naturalWidth, image.naturalHeight, rotation);
  const big = document.createElement("canvas");
  big.width = Math.round(bbox.width);
  big.height = Math.round(bbox.height);
  const bctx = big.getContext("2d");
  if (!bctx) throw new Error("canvas context unavailable");
  bctx.translate(big.width / 2, big.height / 2);
  bctx.rotate((rotation * Math.PI) / 180);
  bctx.scale(flip ? -1 : 1, 1);
  bctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

  // 2) 크롭 영역만 잘라낸 최종 캔버스
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(pixels.width));
  out.height = Math.max(1, Math.round(pixels.height));
  const octx = out.getContext("2d");
  if (!octx) throw new Error("canvas context unavailable");
  octx.drawImage(
    big,
    Math.round(pixels.x),
    Math.round(pixels.y),
    Math.round(pixels.width),
    Math.round(pixels.height),
    0,
    0,
    out.width,
    out.height,
  );

  return new Promise((resolve, reject) => {
    out.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob 실패"))),
      mime,
      mime === "image/png" ? undefined : quality,
    );
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
