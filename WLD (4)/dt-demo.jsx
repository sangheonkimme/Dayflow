/* Dialog & Toast demo launcher — for embedding in PC + Mobile dashboards
   Renders a floating launcher (bottom-right inside device for mobile,
   bottom-right of viewport for PC) that opens a panel of triggers.
   When a trigger fires, toasts/dialogs render in their actual context.

   Usage:
     <DTDemoLauncher mode="pc" />     // position:fixed, document-level
     <DTDemoLauncher mode="mobile" /> // position:absolute, fits parent (device frame)
*/
/* global React, ReactDOM */
(function () {
  const { useState, useRef } = React;

  // ───── icons ─────
  const ic = {
    trash:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
    alert:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>,
    info:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
    check:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    close:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
    edit:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>,
    star:<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    undo:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/></svg>,
    bell:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  };

  function rIcon(svg, size) {
    return React.cloneElement(svg, { width: size, height: size });
  }

  function ToastItem({ t, onDismiss, mobile }) {
    const ico = t.kind === "loading" ? null :
      t.kind === "success" ? ic.check :
      t.kind === "error"   ? ic.close :
      t.kind === "warn"    ? ic.alert :
      t.kind === "undo"    ? ic.undo : ic.info;
    return (
      <div className={"toast live " + (mobile ? "top mobile " : "") + t.kind + (t.light ? " light" : "") + (mobile && t.message ? " detailed" : "") + (t.leaving ? " leaving" : "")}>
        <div className="t-ico">
          {t.kind === "loading" ? <div className="t-spinner" /> : rIcon(ico, 14)}
        </div>
        <div className="t-body">
          <p className="t-title">{t.title}</p>
          {t.message && <p className="t-msg">{t.message}</p>}
          {t.action && !mobile && <button className="t-action" onClick={() => { t.onAction && t.onAction(); onDismiss(); }}>{t.action}</button>}
        </div>
        {t.action && mobile && (
          <button className="t-action" style={{ marginTop: 0, alignSelf: "center" }} onClick={() => { t.onAction && t.onAction(); onDismiss(); }}>{t.action}</button>
        )}
        <button className="t-close" onClick={onDismiss}>{rIcon(ic.close, 12)}</button>
        {t.duration !== 0 && t.kind !== "loading" && <div className="t-progress"><span /></div>}
      </div>
    );
  }

  // ───── Dialog renderers ─────
  function DialogShell({ data, onClose, mobile }) {
    if (!data) return null;
    const stop = (e) => e.stopPropagation();
    const overlayStyle = mobile
      ? { position: "absolute", inset: 0, background: "rgba(20,16,8,0.4)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", display: "flex", alignItems: data.position === "bottom" ? "flex-end" : "center", justifyContent: "center", zIndex: 10001, padding: data.position === "bottom" ? 0 : 16, animation: "dt-fade .18s ease" }
      : { position: "fixed", inset: 0, background: "rgba(20,16,8,0.45)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", display: "grid", placeItems: "center", zIndex: 10001, animation: "dt-fade .18s ease" };
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div onClick={stop} style={{ width: mobile && data.position === "bottom" ? "100%" : (mobile ? "100%" : data.width || 440), maxWidth: mobile ? "100%" : data.width || 440, animation: "dt-pop .22s cubic-bezier(.2,.8,.2,1)" }}>
          {data.render({ close: onClose, mobile })}
        </div>
      </div>
    );
  }

  // ───── dialog content factories ─────
  function DangerDlg({ close, mobile }) {
    if (mobile) {
      return (
        <div className="dlg sheet">
          <div className="dlg-body">
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div className="dlg-icon danger">{rIcon(ic.alert, 26)}</div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <h3 className="dlg-title">메모를 삭제할까요?</h3>
                <p className="dlg-msg"><span className="quoted">5월 회의록</span>이 영구 삭제돼요. 되돌릴 수 없어요.</p>
              </div>
            </div>
          </div>
          <div className="dlg-foot stack" style={{ paddingBottom: 28 }}>
            <button className="dbtn danger lg full" onClick={close}>영구 삭제</button>
            <button className="dbtn ghost lg full" onClick={close}>취소</button>
          </div>
        </div>
      );
    }
    return (
      <div className="dlg" style={{ width: 440 }}>
        <button className="dlg-close" onClick={close}>{rIcon(ic.close, 16)}</button>
        <div className="dlg-body">
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div className="dlg-icon danger">{rIcon(ic.alert, 26)}</div>
            <div style={{ flex: 1, paddingTop: 4 }}>
              <h3 className="dlg-title">메모를 영구 삭제할까요?</h3>
              <p className="dlg-msg"><span className="quoted">5월 회의록 — 디자인 리뷰</span>가 휴지통을 거치지 않고 완전히 삭제돼요. 이 동작은 <b>되돌릴 수 없습니다.</b></p>
              <div className="dlg-warn-box">{rIcon(ic.alert, 14)}<span>3개의 첨부파일과 12개의 댓글이 함께 사라져요.</span></div>
            </div>
          </div>
        </div>
        <div className="dlg-foot">
          <button className="dbtn ghost" onClick={close}>취소</button>
          <button className="dbtn danger" onClick={close}>{rIcon(ic.trash, 14)} 영구 삭제</button>
        </div>
      </div>
    );
  }

  function ConfirmDlg({ close, mobile }) {
    if (mobile) return (
      <div className="dlg compact">
        <div className="dlg-body center" style={{ padding: "24px 22px 18px" }}>
          <h3 className="dlg-title">저장할까요?</h3>
          <p className="dlg-msg">변경사항이 있어요.</p>
        </div>
        <div className="dlg-foot full">
          <button className="dbtn" onClick={close}>취소</button>
          <button className="dbtn primary" onClick={close}>저장</button>
        </div>
      </div>
    );
    return (
      <div className="dlg" style={{ width: 420 }}>
        <div className="pin" />
        <button className="dlg-close" onClick={close}>{rIcon(ic.close, 16)}</button>
        <div className="dlg-body">
          <h3 className="dlg-title">변경사항을 저장할까요?</h3>
          <p className="dlg-msg">현재 메모에 저장하지 않은 변경사항이 있어요. 페이지를 떠나면 변경 내용이 사라집니다.</p>
        </div>
        <div className="dlg-foot">
          <button className="dbtn ghost" onClick={close}>저장 안 함</button>
          <button className="dbtn" onClick={close}>취소</button>
          <button className="dbtn primary" onClick={close}>저장하기</button>
        </div>
      </div>
    );
  }

  function InfoDlg({ close, mobile }) {
    if (mobile) return (
      <div className="dlg compact">
        <div className="dlg-body center" style={{ padding: "26px 22px 18px" }}>
          <div className="dlg-icon info">{rIcon(ic.star, 26)}</div>
          <h3 className="dlg-title">v2.0이 도착했어요</h3>
          <p className="dlg-msg">새 기능 3가지를 확인해보세요.</p>
        </div>
        <div className="dlg-foot stack" style={{ paddingBottom: 18 }}>
          <button className="dbtn primary full lg" onClick={close}>새 기능 보기</button>
          <button className="dbtn ghost full" onClick={close}>나중에</button>
        </div>
      </div>
    );
    return (
      <div className="dlg" style={{ width: 420 }}>
        <div className="tape" />
        <button className="dlg-close" onClick={close}>{rIcon(ic.close, 16)}</button>
        <div className="dlg-body center">
          <div className="dlg-icon info">{rIcon(ic.star, 26)}</div>
          <h3 className="dlg-title">v2.0 업데이트가 도착했어요 <span className="hand">— 새 기능 ✨</span></h3>
          <p className="dlg-msg">더 빠른 검색, 새 손글씨 폰트 3종, 그리고 캘린더 위젯이 추가됐어요.</p>
        </div>
        <div className="dlg-foot center">
          <button className="dbtn ghost" onClick={close}>나중에</button>
          <button className="dbtn primary" onClick={close}>릴리스 노트 →</button>
        </div>
      </div>
    );
  }

  function InputDlg({ close, mobile }) {
    if (mobile) return (
      <div className="dlg sheet">
        <div className="dlg-body" style={{ paddingBottom: 8 }}>
          <h3 className="dlg-title">폴더 이름</h3>
          <input className="dlg-input" defaultValue="2026 회의록" autoFocus />
        </div>
        <div className="dlg-foot" style={{ paddingBottom: 22 }}>
          <button className="dbtn ghost" style={{ flex: 1 }} onClick={close}>취소</button>
          <button className="dbtn primary" style={{ flex: 1 }} onClick={close}>저장</button>
        </div>
      </div>
    );
    return (
      <div className="dlg" style={{ width: 440 }}>
        <button className="dlg-close" onClick={close}>{rIcon(ic.close, 16)}</button>
        <div className="dlg-body">
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div className="dlg-icon neutral">{rIcon(ic.edit, 26)}</div>
            <div style={{ flex: 1, paddingTop: 2 }}>
              <h3 className="dlg-title">폴더 이름 바꾸기</h3>
              <p className="dlg-msg" style={{ fontSize: 13 }}>이 폴더 안의 모든 메모에 새 이름이 적용돼요.</p>
              <input className="dlg-input" defaultValue="2026 회의록" autoFocus />
              <div className="dlg-hint">14 / 50자 · 영문, 한글, 이모지 사용 가능</div>
            </div>
          </div>
        </div>
        <div className="dlg-foot">
          <button className="dbtn" onClick={close}>취소</button>
          <button className="dbtn primary" onClick={close}>이름 바꾸기</button>
        </div>
      </div>
    );
  }

  function SuccessDlg({ close, mobile }) {
    if (mobile) return (
      <div className="dlg compact">
        <div className="dlg-body center" style={{ padding: "28px 22px 20px" }}>
          <div className="dlg-icon success">{rIcon(ic.check, 26)}</div>
          <h3 className="dlg-title">결제 완료!</h3>
          <p className="dlg-msg">Pro 플랜이 활성화됐어요.</p>
        </div>
        <div className="dlg-foot center" style={{ paddingBottom: 20 }}>
          <button className="dbtn primary full lg" onClick={close}>확인</button>
        </div>
      </div>
    );
    return (
      <div className="dlg" style={{ width: 380 }}>
        <button className="dlg-close" onClick={close}>{rIcon(ic.close, 16)}</button>
        <div className="dlg-body center">
          <div className="dlg-icon success">{rIcon(ic.check, 26)}</div>
          <h3 className="dlg-title">결제가 완료됐어요!</h3>
          <p className="dlg-msg"><b>Pro 연간 플랜</b>이 활성화됐어요. 영수증을 이메일로 보내드렸습니다.</p>
        </div>
        <div className="dlg-foot center stack">
          <button className="dbtn primary full lg" onClick={close}>대시보드로 가기 →</button>
          <button className="dbtn ghost" onClick={close}>영수증 다시 보내기</button>
        </div>
      </div>
    );
  }

  // ───── Main launcher component ─────
  function DTDemoLauncher({ mode = "pc" }) {
    const mobile = mode === "mobile";
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [dialog, setDialog] = useState(null);
    const idRef = useRef(0);

    const push = (cfg) => {
      const id = ++idRef.current;
      setItems((arr) => [...arr, { id, ...cfg }]);
      if (cfg.duration !== 0) {
        const dur = cfg.duration || 4000;
        setTimeout(() => {
          setItems((arr) => arr.map((t) => t.id === id ? { ...t, leaving: true } : t));
          setTimeout(() => setItems((arr) => arr.filter((t) => t.id !== id)), 250);
        }, dur);
      }
      return id;
    };
    const dismiss = (id) => {
      setItems((arr) => arr.map((t) => t.id === id ? { ...t, leaving: true } : t));
      setTimeout(() => setItems((arr) => arr.filter((t) => t.id !== id)), 250);
    };

    const fireToast = (cfg) => {
      push({ ...cfg, mobile });
      setOpen(false);
    };
    const fireLoading = () => {
      const id = push({ kind: "loading", title: "업로드 중...", message: "design-v2.png · 2.4MB", duration: 0, mobile });
      setTimeout(() => {
        dismiss(id);
        push({ kind: "success", title: "업로드 완료!", message: "design-v2.png가 추가됐어요.", mobile });
      }, 2200);
      setOpen(false);
    };
    const fireDialog = (key) => {
      const map = {
        danger: { render: DangerDlg, position: "bottom" },
        confirm: { render: ConfirmDlg, position: "center" },
        info: { render: InfoDlg, position: "center" },
        input: { render: InputDlg, position: "bottom" },
        success: { render: SuccessDlg, position: "center" },
      };
      setDialog(map[key]);
      setOpen(false);
    };

    // launcher button position
    const root = mobile ? { position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10000, overflow: "hidden", borderRadius: 48 } : { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10000 };
    const fabStyle = mobile
      ? { position: "absolute", right: 14, bottom: 100, pointerEvents: "auto" }
      : { position: "absolute", right: 24, bottom: 24, pointerEvents: "auto" };
    const stackStyle = mobile
      ? { position: "absolute", top: 56, left: 12, right: 12, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "auto", zIndex: 10001 }
      : { position: "absolute", bottom: 24, right: 24, display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", pointerEvents: "auto", zIndex: 10001 };
    const panelStyle = mobile
      ? { position: "absolute", bottom: 158, right: 14, width: 240, pointerEvents: "auto" }
      : { position: "absolute", bottom: 84, right: 24, width: 280, pointerEvents: "auto" };

    return (
      <div style={root}>
        {/* FAB */}
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            ...fabStyle,
            width: mobile ? 48 : 56, height: mobile ? 48 : 56,
            borderRadius: "50%",
            background: "var(--ink, #1f1d18)",
            color: "var(--yellow, #ffe27a)",
            border: "none",
            cursor: "pointer",
            display: "grid", placeItems: "center",
            boxShadow: "0 6px 16px rgba(40,30,10,0.25), 0 14px 32px -10px rgba(40,30,10,0.3)",
            transform: open ? "scale(0.95) rotate(45deg)" : "scale(1) rotate(0)",
            transition: "transform .2s cubic-bezier(.2,.8,.2,1)",
          }}
          title="알림 데모 열기"
        >
          {open ? rIcon(ic.close, mobile ? 18 : 22) : rIcon(ic.bell, mobile ? 18 : 22)}
        </button>

        {/* Trigger panel */}
        {open && (
          <div style={{
            ...panelStyle,
            background: "var(--card, #fffdf6)",
            border: "1px solid var(--line, #e0d6bf)",
            borderRadius: 14,
            boxShadow: "0 8px 24px rgba(40,30,10,0.14), 0 24px 48px -16px rgba(40,30,10,0.2)",
            padding: mobile ? 10 : 14,
            fontFamily: "var(--sans)",
            animation: "dt-pop .18s cubic-bezier(.2,.8,.2,1)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-mute)", margin: "2px 4px 8px", textTransform: "uppercase" }}>토스트</div>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "1fr 1fr", gap: 6 }}>
              <DBtn onClick={() => fireToast({ kind: "success", title: "메모가 저장됐어요", message: "마지막 변경: 방금 전" })} dot="#2d7a3a">성공</DBtn>
              <DBtn onClick={() => fireToast({ kind: "error", title: "저장 실패", message: "네트워크를 확인해주세요." })} dot="#e25c4d">에러</DBtn>
              <DBtn onClick={() => fireToast({ kind: "warn", title: "저장 공간 부족", message: "남은 용량 12%" })} dot="#e8c84a">경고</DBtn>
              <DBtn onClick={() => fireToast({ kind: "info", title: "새 댓글이 달렸어요", message: '민지님이 댓글을 남겼어요.' })} dot="#7fc0e0">정보</DBtn>
              <DBtn onClick={() => fireToast({ kind: "undo", title: "메모가 삭제됐어요", action: "되돌리기", duration: 6000 })} dot="#1f1d18">Undo</DBtn>
              <DBtn onClick={fireLoading} dot="#ffe27a">로딩→성공</DBtn>
              {!mobile && <DBtn onClick={() => fireToast({ kind: "success", light: true, title: "체크리스트 완료!", message: "오늘 할 일 4개 끝." })} dot="#fff" style={{ gridColumn: "span 2" }}>라이트 · 성공</DBtn>}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-mute)", margin: "12px 4px 8px", textTransform: "uppercase" }}>다이얼로그</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <DBtn onClick={() => fireDialog("danger")} dot="#e25c4d">위험 · 삭제</DBtn>
              <DBtn onClick={() => fireDialog("confirm")} dot="#1f1d18">확인 · 저장</DBtn>
              <DBtn onClick={() => fireDialog("info")} dot="#7fc0e0">정보 · 안내</DBtn>
              <DBtn onClick={() => fireDialog("input")} dot="#8a8479">입력 · 이름</DBtn>
              <DBtn onClick={() => fireDialog("success")} dot="#2d7a3a" style={{ gridColumn: "span 2" }}>성공 · 결제 완료</DBtn>
            </div>
          </div>
        )}

        {/* Toast stack */}
        <div style={stackStyle}>
          {items.map((t) => (
            <ToastItem key={t.id} t={t} mobile={mobile} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>

        {/* Dialog */}
        {dialog && <DialogShell data={dialog} onClose={() => setDialog(null)} mobile={mobile} />}
      </div>
    );
  }

  function DBtn({ children, onClick, dot, style }) {
    return (
      <button onClick={onClick} style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "8px 10px",
        background: "var(--bg-paper, #f7f1e3)",
        border: "1px solid var(--line, #e0d6bf)",
        borderRadius: 8,
        fontFamily: "var(--sans)",
        fontSize: 12,
        fontWeight: 600,
        color: "var(--ink, #1f1d18)",
        cursor: "pointer",
        textAlign: "left",
        transition: "all .12s",
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ink, #1f1d18)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line, #e0d6bf)"; }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0, border: dot === "#fff" ? "1px solid #ccc" : "none" }} />
        <span>{children}</span>
      </button>
    );
  }

  // animations
  if (typeof document !== "undefined" && !document.getElementById("dt-demo-anim")) {
    const s = document.createElement("style");
    s.id = "dt-demo-anim";
    s.textContent = `
      @keyframes dt-fade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes dt-pop  { from { transform: translateY(8px) scale(.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
    `;
    document.head.appendChild(s);
  }

  window.DTDemoLauncher = DTDemoLauncher;
})();
