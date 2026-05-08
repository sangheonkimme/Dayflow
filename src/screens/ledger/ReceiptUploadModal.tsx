/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState, useRef, useEffect, useMemo } from "react";
import { Icon } from "@/components/Icon";
import { Modal } from "@/components/Modal";
import { useTransactions } from "@/data/transactions";
import { recent as selectRecent } from "@/data/transactions";

// ============================================================
// RECEIPT UPLOAD MODAL — 영수증 첨부 플로우
// ============================================================
function ReceiptUploadModal({ open, onClose, onAttach }) {
  const [stage, setStage] = useState("pick"); // pick / preview / scanning / done
  const [files, setFiles] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [linkTxn, setLinkTxn] = useState(null);
  const inputRef = useRef(null);
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const { all: allTxns } = useTransactions();
  const recentTxns = useMemo(() => {
    return selectRecent(allTxns, 4).map((t) => ({
      id: t.id,
      label: t.label,
      amount: t.amount,
      time: `${t.date.slice(5).replace("-", ".")} ${t.time ?? ""}`.trim(),
      cat: t.cat ?? "",
    }));
  }, [allTxns]);

  // OCR mock data revealed after scan
  const ocrResult = {
    merchant: "스타벅스 강남역점",
    address: "서울 강남구 강남대로 396",
    date: "2026-05-02 09:24",
    items: [
      { name: "아이스 아메리카노 T", price: 4500 },
      { name: "버터바", price: 2300 },
    ],
    total: 6800,
    payment: "신한카드 1234",
  };

  useEffect(() => {
    if (stage !== "scanning") return;
    setScanProgress(0);
    const id = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setStage("done");
          return 100;
        }
        return Math.min(100, p + Math.random() * 18 + 6);
      });
    }, 220);
    return () => clearInterval(id);
  }, [stage]);

  const handleFiles = (list) => {
    const arr = Array.from(list)
      .slice(0, 5)
      .map((f, i) => ({
        id: Date.now() + i,
        name: f.name,
        size: f.size,
        type: f.type,
        url: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
      }));
    setFiles(arr);
    setStage("preview");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const startScan = () => setStage("scanning");

  const reset = () => {
    setStage("pick");
    setFiles([]);
    setScanProgress(0);
    setLinkTxn(null);
  };

  const finish = () => {
    onAttach && onAttach({ files, txn: linkTxn, ocr: ocrResult });
    onClose();
    setTimeout(reset, 300);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="receipt-modal"
      overlayClassName="receipt-overlay"
    >
      <div className="modal-head">
        <div>
          <div className="modal-eyebrow">거래내역 · 가계부</div>
          <h3 className="modal-title">
            영수증 첨부 <span className="hand-sub">— 사진으로 자동 입력</span>
          </h3>
        </div>
        <button className="modal-close" onClick={onClose}>
          <Icon name="x" size={16} />
        </button>
      </div>

      {/* Step indicator */}
      <div className="receipt-steps">
        {[
          ["pick", "1", "업로드"],
          ["preview", "2", "미리보기"],
          ["scanning", "3", "스캔"],
          ["done", "4", "확인"],
        ].map(([k, n, l]) => {
          const order = ["pick", "preview", "scanning", "done"];
          const cur = order.indexOf(stage);
          const ix = order.indexOf(k);
          const cls = ix < cur ? "done" : ix === cur ? "on" : "";
          return (
            <div key={k} className={"rcpt-step " + cls}>
              <span className="rcpt-step-n">{ix < cur ? "✓" : n}</span>
              <span>{l}</span>
            </div>
          );
        })}
      </div>

      <div className="modal-body receipt-body">
        {/* === STAGE 1: PICK === */}
        {stage === "pick" && (
          <>
            <div
              className={"receipt-drop" + (isDragging ? " dragging" : "")}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              ref={dragRef}
            >
              <div className="receipt-drop-ico">📄</div>
              <b>여기로 드래그 또는 클릭해서 업로드</b>
              <small>JPG · PNG · HEIC · PDF · 최대 5장 · 파일당 10MB</small>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                hidden
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            <div className="receipt-or">또는 다른 방법으로</div>

            <div className="receipt-method-grid">
              <button
                className="rcpt-method"
                onClick={() => inputRef.current?.click()}
              >
                <span className="rm-ico bg-yellow">📷</span>
                <div>
                  <b>카메라로 촬영</b>
                  <small>지금 영수증을 찍어요</small>
                </div>
              </button>
              <button
                className="rcpt-method"
                onClick={() => inputRef.current?.click()}
              >
                <span className="rm-ico bg-mint">🖼️</span>
                <div>
                  <b>갤러리에서 선택</b>
                  <small>저장된 사진 불러오기</small>
                </div>
              </button>
              <button className="rcpt-method">
                <span className="rm-ico bg-pink">📧</span>
                <div>
                  <b>이메일에서 가져오기</b>
                  <small>영수증 메일 자동 수집</small>
                </div>
              </button>
              <button className="rcpt-method">
                <span className="rm-ico bg-blue">☁️</span>
                <div>
                  <b>드라이브 연결</b>
                  <small>구글 · 드롭박스</small>
                </div>
              </button>
            </div>

            <div className="receipt-tip">
              <span>💡</span>
              <div>
                <b>스캔 팁</b>
                <small>
                  밝은 곳에서 영수증 전체가 보이게 촬영하면 OCR 인식률이
                  올라가요. 구겨진 영수증은 평평하게 펴주세요.
                </small>
              </div>
            </div>
          </>
        )}

        {/* === STAGE 2: PREVIEW === */}
        {stage === "preview" && (
          <>
            <div className="receipt-preview-grid">
              {files.map((f) => (
                <div key={f.id} className="rcpt-thumb">
                  {f.url ? (
                    <img src={f.url} alt={f.name} />
                  ) : (
                    <div className="rcpt-thumb-pdf">
                      📄<span>PDF</span>
                    </div>
                  )}
                  <button
                    className="rcpt-thumb-x"
                    onClick={() => setFiles(files.filter((x) => x.id !== f.id))}
                  >
                    <Icon name="x" size={11} />
                  </button>
                  <div className="rcpt-thumb-name">{f.name}</div>
                </div>
              ))}
              <button
                className="rcpt-thumb add"
                onClick={() => inputRef.current?.click()}
              >
                <span>+</span>
                <small>추가</small>
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                hidden
                onChange={(e) =>
                  handleFiles([...files.map((f) => f), ...e.target.files])
                }
              />
            </div>

            <div className="receipt-options">
              <label className="rcpt-check">
                <input type="checkbox" defaultChecked />
                <span className="rcpt-check-box"></span>
                <span>OCR 자동 인식 — 가게명, 금액, 날짜 추출</span>
              </label>
              <label className="rcpt-check">
                <input type="checkbox" defaultChecked />
                <span className="rcpt-check-box"></span>
                <span>이미지 자동 보정 — 밝기 · 기울기 보정</span>
              </label>
              <label className="rcpt-check">
                <input type="checkbox" />
                <span className="rcpt-check-box"></span>
                <span>원본 클라우드 백업</span>
              </label>
            </div>
          </>
        )}

        {/* === STAGE 3: SCANNING === */}
        {stage === "scanning" && (
          <div className="receipt-scanning">
            <div className="rcpt-scan-card">
              {files[0]?.url ? (
                <img src={files[0].url} alt="scanning" />
              ) : (
                <div className="rcpt-scan-placeholder">📄</div>
              )}
              <div className="rcpt-scan-line" />
            </div>
            <div className="rcpt-scan-status">
              <b>영수증을 분석하고 있어요...</b>
              <div className="rcpt-progress">
                <div
                  className="rcpt-progress-bar"
                  style={{ width: scanProgress + "%" }}
                />
              </div>
              <small>{Math.floor(scanProgress)}% · 텍스트 추출 중</small>
            </div>
            <ul className="rcpt-scan-tasks">
              <li className={scanProgress > 20 ? "done" : ""}>이미지 보정</li>
              <li className={scanProgress > 50 ? "done" : ""}>
                텍스트 영역 감지
              </li>
              <li className={scanProgress > 80 ? "done" : ""}>
                가맹점 · 금액 추출
              </li>
              <li className={scanProgress >= 100 ? "done" : ""}>
                거래내역 매칭
              </li>
            </ul>
          </div>
        )}

        {/* === STAGE 4: DONE / OCR RESULT === */}
        {stage === "done" && (
          <div className="receipt-done">
            <div className="rcpt-done-head">
              <div className="rcpt-success">✓</div>
              <div>
                <b>인식 완료!</b>
                <small>아래 정보를 확인하고 거래내역에 연결해주세요</small>
              </div>
            </div>

            <div className="rcpt-ocr-card">
              <div className="rcpt-ocr-row big">
                <span>가맹점</span>
                <b>{ocrResult.merchant}</b>
              </div>
              <div className="rcpt-ocr-row">
                <span>일시</span>
                <b>{ocrResult.date}</b>
              </div>
              <div className="rcpt-ocr-row">
                <span>결제수단</span>
                <b>{ocrResult.payment}</b>
              </div>
              <div className="rcpt-ocr-divider" />
              {ocrResult.items.map((it, i) => (
                <div key={i} className="rcpt-ocr-row item">
                  <span>{it.name}</span>
                  <b>₩{it.price.toLocaleString()}</b>
                </div>
              ))}
              <div className="rcpt-ocr-divider" />
              <div className="rcpt-ocr-row total">
                <span>합계</span>
                <b>₩{ocrResult.total.toLocaleString()}</b>
              </div>
            </div>

            <div className="rcpt-link-section">
              <div className="rcpt-link-label">거래내역에 연결</div>
              <small className="rcpt-link-sub">
                동일 금액·시간대로 자동 매칭된 거래입니다
              </small>
              <div className="rcpt-link-list">
                {recentTxns.map((t) => (
                  <label
                    key={t.id}
                    className={
                      "rcpt-link-row" + (linkTxn === t.id ? " on" : "")
                    }
                  >
                    <input
                      type="radio"
                      name="linkTxn"
                      checked={linkTxn === t.id}
                      onChange={() => setLinkTxn(t.id)}
                    />
                    <div className="rcpt-link-body">
                      <b>{t.label}</b>
                      <small>
                        {t.time} · {t.cat}
                      </small>
                    </div>
                    <span className="rcpt-link-amt">
                      -₩{Math.abs(t.amount).toLocaleString()}
                    </span>
                    {t.label.includes("스타벅스") && (
                      <span className="rcpt-match-tag">자동 매칭</span>
                    )}
                  </label>
                ))}
                <label
                  className={
                    "rcpt-link-row new" + (linkTxn === "new" ? " on" : "")
                  }
                >
                  <input
                    type="radio"
                    name="linkTxn"
                    checked={linkTxn === "new"}
                    onChange={() => setLinkTxn("new")}
                  />
                  <div className="rcpt-link-body">
                    <b>+ 새 거래내역으로 추가</b>
                    <small>OCR 정보로 자동 입력해드려요</small>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="modal-foot">
        {stage !== "pick" && (
          <button
            className="timer-btn"
            onClick={() => {
              if (stage === "preview") setStage("pick");
              else if (stage === "done") setStage("preview");
            }}
          >
            ← 이전
          </button>
        )}
        <button
          className="timer-btn"
          onClick={onClose}
          style={{ marginLeft: stage === "pick" ? "auto" : 0 }}
        >
          취소
        </button>
        {stage === "preview" && (
          <button
            className="timer-btn primary"
            onClick={startScan}
            disabled={files.length === 0}
          >
            스캔 시작 →
          </button>
        )}
        {stage === "done" && (
          <button
            className="timer-btn primary"
            onClick={finish}
            disabled={!linkTxn}
          >
            {linkTxn === "new" ? "거래 추가하고 첨부" : "연결하고 첨부"}
          </button>
        )}
      </div>
    </Modal>
  );
}

export { ReceiptUploadModal };