import { Ico } from "@/screens/mobile/shared/Ico";
import { useEscapeKey } from "@/lib/useEscapeKey";
import styles from "@/screens/mobile/mobile.module.css";

export const ReceiptSheet = ({ txn, onClose }: any) => {
  const open = !!txn;
  useEscapeKey(() => onClose?.(), open);
  // synthesize receipt-like data based on txn
  const data = txn || {};

  // produce a barcode pattern (deterministic from name)
  const seed = (data.name || "x")
    .split("")
    .reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = Array.from({ length: 36 }, (_, i) => {
    const v = (seed * (i + 7) * 31) % 7;
    return v < 2 ? 1 : v < 5 ? 2 : 3;
  });

  // detail line items (faked per merchant)
  const items = (() => {
    const a = Math.abs(data.amt || 0);
    if (data.name?.includes("스타벅스"))
      return [
        { name: "아이스 카페 라떼 T", qty: 1, price: 5800 },
        { name: "에그 베이컨 샌드위치", qty: 1, price: 6500 },
      ];
    if (data.name?.includes("이마트"))
      return [
        { name: "유기농 우유 900ml", qty: 2, price: 6900 },
        { name: "한돈 삼겹살 500g", qty: 1, price: 21800 },
        { name: "신선란 30구", qty: 1, price: 8400 },
        { name: "아오리 사과 1.5kg", qty: 1, price: 14900 },
        { name: "오뚜기 진라면", qty: 2, price: 5400 },
      ];
    if (data.name?.includes("GS25"))
      return [
        { name: "포카리스웨트 620ml", qty: 1, price: 2400 },
        { name: "허니버터칩", qty: 1, price: 1900 },
        { name: "도시락 - 제육볶음", qty: 1, price: 4150 },
      ];
    if (data.name?.includes("지하철"))
      return [{ name: "교통카드 단건 결제", qty: 1, price: a }];
    if (data.name?.includes("넷플릭스"))
      return [{ name: "프리미엄 정기결제 (월)", qty: 1, price: a }];
    if (data.name?.includes("탐앤탐스"))
      return [{ name: "아메리카노 R", qty: 1, price: a }];
    if (data.name?.includes("무신사"))
      return [{ name: "옥스포드 셔츠 (스카이)", qty: 1, price: a }];
    if (data.name?.includes("월세"))
      return [{ name: "11월 월세 자동이체", qty: 1, price: a }];
    if (data.name?.includes("급여"))
      return [
        { name: "기본급", qty: 1, price: 3300000 },
        { name: "직책수당", qty: 1, price: 200000 },
        { name: "식대 비과세", qty: 1, price: 200000 },
        { name: "(공제) 4대 보험·세금", qty: 1, price: -50000 },
      ];
    return [{ name: data.name || "결제", qty: 1, price: a }];
  })();

  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const total = Math.abs(data.amt || subtotal);

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
        aria-label="거래 상세"
        className={`${styles.dfmSheet} ${open ? styles.on : ""}`}
      >
        <div className={styles.dfmSheetGrip} />
        <div className={styles.dfmSheetHead}>
          <div className={styles.ttl}>{data.income ? "수입 상세" : "결제 상세"}</div>
          <button className={styles.close} onClick={onClose} aria-label="닫기">
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={styles.dfmSheetBody}>
          <div className={styles.dfmReceipt}>
            <div className={styles.dfmReceiptStore}>
              <div className={styles.name}>{data.name || ""}</div>
              <div className={styles.meta}>
                {data.income ? "Dayflow · 수입 입력" : "사업자 123-45-67890"}{" "}
                <br />
                서울 강남구 테헤란로 152 · 02-1234-5678
              </div>
            </div>

            <hr />

            <div className={styles.dfmReceiptRows}>
              <div className={styles.dfmReceiptRow}>
                <span className={styles.lbl}>
                  {data.sub?.split("·")[0]?.trim() || "거래일시"}
                </span>
                <span className={styles.val}>
                  2026.11.{data.name?.includes("급여") ? "11" : "14"}
                </span>
              </div>
              <div className={styles.dfmReceiptRow}>
                <span className={styles.lbl}>분류</span>
                <span className={styles.val}>{data.cat || "-"}</span>
              </div>
              <div className={styles.dfmReceiptRow}>
                <span className={styles.lbl}>결제수단</span>
                <span className={styles.val}>
                  {data.income ? "신한은행 입금" : "신한 체크카드"}
                </span>
              </div>
            </div>

            <hr />

            <div className={styles.dfmReceiptRows}>
              {items.map((it, i) => (
                <div key={i} className={styles.dfmReceiptRow}>
                  <span className={styles.lbl}>
                    {it.name}
                    <span className={styles.qty}>×{it.qty}</span>
                  </span>
                  <span className={styles.val}>
                    {it.price > 0 ? "" : "-"}
                    {Math.abs(it.price * it.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.dfmReceiptTotal}>
              <span>합계</span>
              <span>
                {data.income ? "+" : ""}₩{total.toLocaleString()}
              </span>
            </div>

            <div className={styles.dfmReceiptPay}>
              <span>승인번호 30041892</span>
              <span>14:32:08</span>
            </div>

            <div className={styles.dfmReceiptFoot}>
              감사합니다 · 교환·환불은 영수증 지참
              <br />
              www.dayflow.app · 자동 동기화됨
            </div>

            <div className={styles.dfmReceiptBarcode}>
              {bars.map((w, i) => (
                <i key={i} style={{ width: w + "px" }} />
              ))}
            </div>
          </div>

          <div className={styles.dfmMetaBlock}>
            <h4>메모</h4>
            <div className={`${styles.dfmMemo} ${data.memo ? "" : styles.empty}`}>
              {data.memo || "메모를 추가하면 영수증과 함께 저장돼요."}
            </div>
          </div>

          <div className={styles.dfmMetaBlock}>
            <h4>태그</h4>
            <div className={styles.dfmMetaTags}>
              {(data.tags || ["#점심", "#팀회식", "#증빙필요"]).map((t, i) => (
                <span key={i} className={styles.tag}>
                  {t}
                </span>
              ))}
              <span className={`${styles.tag} ${styles.add}`}>+ 태그</span>
            </div>
          </div>

          <div className={styles.dfmMetaBlock}>
            <h4>첨부 사진</h4>
            <div className={styles.dfmPhotoRow}>
              <div className={styles.dfmPhoto}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                  <path d="m3 17 5-5 5 5 4-4 4 4" />
                </svg>
              </div>
              <div className={`${styles.dfmPhoto} ${styles.add}`}>+</div>
            </div>
          </div>

          <div className={styles.dfmActionRow}>
            <button className={styles.dfmActionBtn}>
              <Ico name="refresh" size={14} /> 다시 분류
            </button>
            <button className={`${styles.dfmActionBtn} ${styles.primary}`}>메모 편집</button>
          </div>
          <button
            className={`${styles.dfmActionBtn} ${styles.danger}`}
            style={{ marginTop: 8, width: "100%" }}
          >
            거래 삭제
          </button>
        </div>
      </div>
    </>
  );
};

// txn detail handler exposed via window for simplicity (avoiding context boilerplate)
const _openTxnRef = null;
