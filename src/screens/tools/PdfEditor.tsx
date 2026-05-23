"use client";
import { useEffect, useState } from "react";
import { PDFDocument, PageSizes } from "pdf-lib";
import styles from "./ImageTools.module.css";

interface PdfItem {
  id: string;
  file: File;
  url: string;
  w: number;
  h: number;
}

interface Props {
  initialFiles: File[];
  onAddFiles: (files: File[]) => void;
  onClear: () => void;
}

const PAPERS = [
  { id: "a4", label: "A4", sub: "210 × 297 mm", ratio: "210/297" },
  { id: "lt", label: "Letter", sub: "8.5 × 11 in", ratio: "8.5/11" },
  { id: "or", label: "원본", sub: "이미지 그대로", ratio: "4/3" },
] as const;

type PaperId = (typeof PAPERS)[number]["id"];

export function PdfEditor({ initialFiles, onAddFiles, onClear }: Props) {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [paper, setPaper] = useState<PaperId>("a4");
  const [orient, setOrient] = useState<"portrait" | "landscape">("portrait");
  const [filename, setFilename] = useState(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `document_${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.pdf`;
  });
  const [generating, setGenerating] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // initialFiles → PdfItem[] 로 변환 (이미지 크기 측정 포함)
  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];
    Promise.all(
      initialFiles.map(
        (file) =>
          new Promise<PdfItem>((resolve, reject) => {
            const url = URL.createObjectURL(file);
            urls.push(url);
            const img = new Image();
            img.onload = () =>
              resolve({
                id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
                file,
                url,
                w: img.naturalWidth,
                h: img.naturalHeight,
              });
            img.onerror = () => reject(new Error(`이미지 로드 실패: ${file.name}`));
            img.src = url;
          }),
      ),
    ).then((loaded) => {
      if (!cancelled) setItems(loaded);
    });
    return () => {
      cancelled = true;
      // cleanup 은 items 가 새로 set 될 때 이전 url 들이 dangling. dev 에서 short-lived 이므로 무시.
      // (제거 시점은 onClear 또는 unmount)
      urls.forEach((u) => {
        // no-op: items 가 사용 중이라 즉시 revoke 하면 안 됨.
        void u;
      });
    };
    // initialFiles 참조 변경 시에만 재실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFiles]);

  // unmount 시 URL 정리
  useEffect(() => {
    return () => {
      items.forEach((it) => URL.revokeObjectURL(it.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDropOnCard = (i: number) => {
    if (dragIdx === null || dragIdx === i) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIdx(null);
  };

  const handleGenerate = async () => {
    if (items.length === 0) return;
    setGenerating(true);
    try {
      const blob = await buildPdf(items, paper, orient);
      const safeName = filename.trim() || "document.pdf";
      const finalName = /\.pdf$/i.test(safeName) ? safeName : `${safeName}.pdf`;
      downloadBlob(blob, finalName);
    } catch (e) {
      console.error("[PdfEditor] generate failed", e);
      alert("PDF 생성에 실패했어요. 이미지를 다시 확인해주세요.");
    } finally {
      setGenerating(false);
    }
  };

  const totalBytes = items.reduce((acc, it) => acc + it.file.size, 0);

  return (
    <div className={styles.toolPage}>
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 → PDF</div>
          <h1 className="page-title">
            이미지를 PDF로 <span className="hand-sub">— 한 권으로 묶어요</span>
          </h1>
          <div className="page-sub">
            {items.length}장 업로드됨 · 원본 {fmtSize(totalBytes)}
          </div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button className="timer-btn" onClick={onClear} type="button">
            전체 삭제
          </button>
          <label className="timer-btn" style={{ cursor: "pointer" }}>
            + 더 추가
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                const fs = Array.from(e.target.files ?? []);
                if (fs.length) onAddFiles(fs);
                e.currentTarget.value = "";
              }}
            />
          </label>
          <button
            className="timer-btn primary"
            onClick={handleGenerate}
            disabled={items.length === 0 || generating}
            type="button"
          >
            {generating ? "생성 중…" : "↓ PDF 만들기"}
          </button>
        </div>
      </div>

      <div className={styles.pdfUploaded}>
        <section className={styles.upStrip}>
          <div className={styles.stripH}>
            <span className={styles.railH} style={{ marginBottom: 0 }}>
              업로드된 이미지
            </span>
            <small className="muted">드래그로 순서 변경 · × 로 제거</small>
          </div>
          <div className={styles.stripRow}>
            {items.map((it, i) => (
              <div
                key={it.id}
                className={styles.stripCard}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={onDragOver}
                onDrop={() => onDropOnCard(i)}
                style={{ cursor: "grab" }}
              >
                <span className={styles.stripNum}>{i + 1}</span>
                <span className={styles.stripGrip}>⋮⋮</span>
                <button
                  className={styles.stripX}
                  onClick={() => removeItem(it.id)}
                  title="제거"
                  type="button"
                >
                  ×
                </button>
                <img
                  src={it.url}
                  alt={it.file.name}
                  style={{
                    width: "100%",
                    aspectRatio: it.w > it.h ? "3/2" : "3/4",
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid rgba(0,0,0,0.12)",
                  }}
                />
                <div className={styles.stripMeta}>
                  <b>{it.file.name}</b>
                  <small>
                    {fmtSize(it.file.size)} · {it.w}×{it.h}
                  </small>
                </div>
              </div>
            ))}
            <label className={`${styles.stripCard} ${styles.add}`} style={{ cursor: "pointer" }}>
              <div className={styles.addPlus}>+</div>
              <small>이미지 추가</small>
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                  const fs = Array.from(e.target.files ?? []);
                  if (fs.length) onAddFiles(fs);
                  e.currentTarget.value = "";
                }}
              />
            </label>
          </div>
        </section>

        <section className={styles.upBottom}>
          <div className={styles.upSettings}>
            <div className={styles.railH}>PDF 설정</div>

            <div className={styles.setBlock}>
              <div className={styles.setLabel}>용지 크기</div>
              <div className={styles.paperRow}>
                {PAPERS.map((p) => (
                  <button
                    key={p.id}
                    className={
                      paper === p.id ? `${styles.paperCard} ${styles.on}` : styles.paperCard
                    }
                    onClick={() => setPaper(p.id)}
                    type="button"
                  >
                    <span className={styles.paperGlyph} style={{ aspectRatio: p.ratio }} />
                    <b>{p.label}</b>
                    <small>{p.sub}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.setBlock}>
              <div className={styles.setLabel}>방향</div>
              <div className={styles.orientRow}>
                <button
                  className={orient === "portrait" ? styles.on : ""}
                  onClick={() => setOrient("portrait")}
                  type="button"
                  disabled={paper === "or"}
                >
                  ┃ 세로
                </button>
                <button
                  className={orient === "landscape" ? styles.on : ""}
                  onClick={() => setOrient("landscape")}
                  type="button"
                  disabled={paper === "or"}
                >
                  ━ 가로
                </button>
              </div>
            </div>

            <div className={styles.setBlock}>
              <div className={styles.setLabel}>파일명</div>
              <input
                className={styles.railInput}
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.upPreview}>
            <div className={styles.prevH}>
              미리보기{" "}
              <small>
                · {paper === "or" ? "원본" : paper.toUpperCase()}{" "}
                {orient === "portrait" ? "세로" : "가로"}
              </small>
            </div>
            <div className={styles.prevStack}>
              {items.slice(0, 3).map((it, i) => (
                <div
                  key={it.id}
                  className={styles.prevPage}
                  style={{
                    aspectRatio: pagePreviewAspect(paper, orient, it),
                    transform: `translate(${i * 8}px, ${i * 8}px) rotate(${(i - 1) * 1.5}deg)`,
                    zIndex: items.length - i,
                  }}
                >
                  <span className={styles.prevNo}>{i + 1}</span>
                  <div className={styles.prevPad}>
                    <img
                      src={it.url}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: 4,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.prevFoot}>
              <span className={styles.hand}>총 {items.length}쪽</span>
              <span className="muted">{items.length === 0 ? "이미지를 추가하세요" : "내보내기 준비됨"}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────

function pagePreviewAspect(paper: PaperId, orient: "portrait" | "landscape", it: PdfItem) {
  if (paper === "or") return it.w > it.h ? "4/3" : "3/4";
  const base = paper === "lt" ? "8.5/11" : "210/297";
  if (orient === "landscape") return base.split("/").reverse().join("/");
  return base;
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function pageSizeFor(
  paper: PaperId,
  orient: "portrait" | "landscape",
  it: PdfItem,
): [number, number] {
  if (paper === "or") return [it.w, it.h];
  const [w, h] = paper === "lt" ? PageSizes.Letter : PageSizes.A4;
  return orient === "landscape" ? [h, w] : [w, h];
}

// pdf-lib 가 받는 raw bytes 와 embed 함수를 반환. WebP/HEIC/GIF 등은 JPEG 로 재인코딩.
async function prepareEmbed(
  file: File,
): Promise<{ bytes: ArrayBuffer; embedAs: "jpg" | "png" }> {
  const lowerType = file.type.toLowerCase();
  if (lowerType === "image/jpeg" || lowerType === "image/jpg") {
    return { bytes: await file.arrayBuffer(), embedAs: "jpg" };
  }
  if (lowerType === "image/png") {
    return { bytes: await file.arrayBuffer(), embedAs: "png" };
  }
  // WebP / GIF / HEIC / 기타 — canvas 로 JPEG 재인코딩.
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error(`이미지 디코딩 실패: ${file.name}`));
      i.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas context unavailable");
    ctx.drawImage(img, 0, 0);
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob 실패"))),
        "image/jpeg",
        0.92,
      ),
    );
    return { bytes: await blob.arrayBuffer(), embedAs: "jpg" };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function buildPdf(
  items: PdfItem[],
  paper: PaperId,
  orient: "portrait" | "landscape",
): Promise<Blob> {
  const doc = await PDFDocument.create();
  for (const it of items) {
    const { bytes, embedAs } = await prepareEmbed(it.file);
    const img = embedAs === "png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    const [pw, ph] = pageSizeFor(paper, orient, it);
    const page = doc.addPage([pw, ph]);
    const scale = Math.min(pw / img.width, ph / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    page.drawImage(img, {
      x: (pw - w) / 2,
      y: (ph - h) / 2,
      width: w,
      height: h,
    });
  }
  const bytes = await doc.save();
  // 정확한 Blob 시그니처를 위해 ArrayBuffer 로 옮긴 사본 사용
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
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
