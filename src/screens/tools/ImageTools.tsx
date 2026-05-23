"use client";
import { useEffect, useRef, useState } from "react";
import { CropEditor } from "./CropEditor";
import { PdfEditor } from "./PdfEditor";
import styles from "./ImageTools.module.css";

// ============================================================
// IMAGE TOOLS — Crop & PDF 진입점 (드롭존 → Editor)
// 실작동: react-easy-crop (Crop), pdf-lib (PDF). 100% client-side.
// ============================================================

// 시안 placeholder. empty state 시각 일러스트로만 사용.
function SampleImg({
  aspect = "4 / 3",
  w = "100%",
  rotated = 0,
}: {
  aspect?: string;
  w?: string;
  rotated?: number;
}) {
  return (
    <div
      style={{
        width: w,
        aspectRatio: aspect,
        background:
          "repeating-linear-gradient(45deg, #cfb582 0 12px, #b89a64 12px 24px), linear-gradient(180deg, #d6bf85, #b89a64)",
        backgroundBlendMode: "multiply",
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 6,
        position: "relative",
        overflow: "hidden",
        transform: `rotate(${rotated}deg)`,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18)",
      }}
    >
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
    </div>
  );
}

// ─── CROP 진입 ────────────────────────────────────────────────

function CropEmpty({ onPick }: { onPick: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setDragOver] = useState(false);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const it of Array.from(items)) {
        if (it.kind === "file" && it.type.startsWith("image/")) {
          const f = it.getAsFile();
          if (f) {
            onPick(f);
            return;
          }
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [onPick]);

  return (
    <div className={styles.toolPage}>
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 자르기</div>
          <h1 className="page-title">
            이미지 자르기 <span className="hand-sub">— 시작해보세요</span>
          </h1>
          <div className="page-sub">JPG · PNG · WebP · GIF 지원 · 한 번에 한 장씩</div>
        </div>
      </div>

      <div
        className={styles.dropzone}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDragOver) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files[0];
          if (f && f.type.startsWith("image/")) onPick(f);
        }}
        style={isDragOver ? { background: "rgba(255, 215, 100, 0.12)" } : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.currentTarget.value = "";
          }}
        />
        <div className={styles.dzPile}>
          <SampleImg aspect="4/3" w="160px" rotated={-3} />
        </div>
        <h2>여기로 이미지를 끌어다 놓으세요</h2>
        <p>
          또는{" "}
          <button
            className={styles.dzLink}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            파일 선택
          </button>{" "}
          · 클립보드 붙여넣기 (⌘V) 도 지원해요
        </p>

        <div className={styles.dzFormats}>
          <span>JPG</span>
          <span>PNG</span>
          <span>WebP</span>
          <span>GIF</span>
        </div>

        <div className={styles.dzTips}>
          <div className={styles.tip}>
            <b>1.</b>
            <span>드래그로 자를 영역을 선택해요</span>
          </div>
          <div className={styles.tip}>
            <b>2.</b>
            <span>비율(1:1 / 16:9 / 자유)을 골라 정렬해요</span>
          </div>
          <div className={styles.tip}>
            <b>3.</b>
            <span>원하는 포맷·크기로 내보내요</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CropCanvasPage() {
  const [file, setFile] = useState<File | null>(null);
  return file ? (
    <CropEditor file={file} onClear={() => setFile(null)} />
  ) : (
    <CropEmpty onPick={setFile} />
  );
}

// ─── PDF 진입 ─────────────────────────────────────────────────

function PdfEmpty({ onPick }: { onPick: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setDragOver] = useState(false);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const imgs: File[] = [];
      for (const it of Array.from(items)) {
        if (it.kind === "file" && it.type.startsWith("image/")) {
          const f = it.getAsFile();
          if (f) imgs.push(f);
        }
      }
      if (imgs.length) onPick(imgs);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [onPick]);

  return (
    <div className={styles.toolPage}>
      <div className="page-head">
        <div>
          <div className="crumb">도구 · 이미지 → PDF</div>
          <h1 className="page-title">
            이미지를 PDF로 <span className="hand-sub">— 시작해보세요</span>
          </h1>
          <div className="page-sub">JPG · PNG · WebP · GIF 지원 · 여러 장 한꺼번에</div>
        </div>
      </div>

      <div
        className={styles.dropzone}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isDragOver) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const fs = Array.from(e.dataTransfer.files).filter((f) =>
            f.type.startsWith("image/"),
          );
          if (fs.length) onPick(fs);
        }}
        style={isDragOver ? { background: "rgba(255, 215, 100, 0.12)" } : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            const fs = Array.from(e.target.files ?? []);
            if (fs.length) onPick(fs);
            e.currentTarget.value = "";
          }}
        />
        <div className={styles.dzPile}>
          <SampleImg aspect="3/4" w="120px" rotated={-7} />
          <SampleImg aspect="3/4" w="120px" rotated={3} />
          <SampleImg aspect="3/4" w="120px" rotated={-2} />
        </div>
        <h2>여기로 이미지를 끌어다 놓으세요</h2>
        <p>
          또는{" "}
          <button
            className={styles.dzLink}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            파일 선택
          </button>{" "}
          · 클립보드 붙여넣기 (⌘V) 도 지원해요
        </p>

        <div className={styles.dzFormats}>
          <span>JPG</span>
          <span>PNG</span>
          <span>WebP</span>
          <span>GIF</span>
        </div>

        <div className={styles.dzTips}>
          <div className={styles.tip}>
            <b>1.</b>
            <span>여러 이미지를 한꺼번에 끌어다 놓아요</span>
          </div>
          <div className={styles.tip}>
            <b>2.</b>
            <span>드래그로 순서를 바꿀 수 있어요</span>
          </div>
          <div className={styles.tip}>
            <b>3.</b>
            <span>용지 크기(A4 / Letter / 원본) 선택 후 내보내기</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PdfCanvasPage() {
  const [files, setFiles] = useState<File[]>([]);
  return files.length > 0 ? (
    <PdfEditor
      initialFiles={files}
      onAddFiles={(more) => setFiles((prev) => [...prev, ...more])}
      onClear={() => setFiles([])}
    />
  ) : (
    <PdfEmpty onPick={setFiles} />
  );
}

export { CropCanvasPage, PdfCanvasPage };
