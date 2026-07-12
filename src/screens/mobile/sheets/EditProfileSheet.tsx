import { useState, useEffect } from "react";
import { Ico } from "@/screens/mobile/shared/Ico";
import { useEscapeKey } from "@/lib/useEscapeKey";
import styles from "@/screens/mobile/mobile.module.css";

// 실제 저장되는 값은 name 하나 — 아바타/사용자명/소개는 저장 로직이 생기기
// 전까지 노출하지 않는다 (풀스크린처럼 커 보이던 원인, docs/mobile-sheet-audit 참고).
export const EditProfileSheet = ({
  open,
  onClose,
  initialName,
  email,
  onSave,
}: any) => {
  const [name, setName] = useState(initialName || "");
  useEffect(() => {
    if (open) setName(initialName || "");
  }, [open, initialName]);
  useEscapeKey(() => onClose?.(), !!open);

  const save = () => onSave?.(name.trim() || initialName);

  return (
    <>
      <div
        role="presentation"
        className={`${styles.dfmSheetScrim} ${open ? styles.on : ""}`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="프로필 수정"
        className={`${styles.dfmSheet} ${styles.dfmSheetCompact} ${open ? styles.on : ""}`}
      >
        <div className={styles.dfmSheetGrip} />
        <div className={styles.dfmSheetHead}>
          <div className={styles.ttl}>
            프로필 수정<small>이름을 바꿀 수 있어요</small>
          </div>
          <button className={styles.close} onClick={onClose} aria-label="닫기">
            <Ico name="close" size={18} />
          </button>
        </div>

        <div className={styles.dfmSheetBody} style={{ padding: "0 18px 22px" }}>
          {/* name */}
          <div
            style={{
              padding: "4px 0 14px",
              borderBottom: "1px dashed var(--line)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              이름
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) save();
              }}
              placeholder="이름"
              style={{
                width: "100%",
                padding: "11px 12px",
                border: "1px solid var(--line)",
                borderRadius: 10,
                background: "var(--bg-paper)",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--ink)",
                outline: "none",
              }}
            />
          </div>

          {/* email (read-only) */}
          <div style={{ padding: "14px 0 4px" }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-mute)",
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              이메일
            </div>
            <div
              style={{
                padding: "11px 12px",
                border: "1px dashed var(--line)",
                borderRadius: 10,
                background: "var(--bg)",
                fontSize: 13,
                color: "var(--ink-mute)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{email}</span>
              <small style={{ fontSize: 10 }}>변경 불가</small>
            </div>
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 12,
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--ink)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              취소
            </button>
            <button
              onClick={save}
              style={{
                flex: 2,
                padding: "14px 0",
                borderRadius: 12,
                border: "none",
                background: "var(--ink)",
                color: "var(--bg-paper)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
