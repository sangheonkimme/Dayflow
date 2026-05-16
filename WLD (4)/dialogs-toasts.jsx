/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard, DCPostIt */
const { useState, useEffect, useRef } = React;

// =============================================================
// Tiny icons
// =============================================================
const I = {
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>,
  info: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>,
  star: <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  undo: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/></svg>,
  upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><path d="M12 3v12"/></svg>,
};

// =============================================================
// Reusable Dialog primitives
// =============================================================
function DlgClose() {
  return <button className="dlg-close" aria-label="닫기">{React.cloneElement(I.close, { width: 16, height: 16 })}</button>;
}
function DlgIcon({ kind, icon }) {
  return <div className={"dlg-icon " + kind}>{icon}</div>;
}

// =============================================================
// PC DIALOG VARIANTS (440px)
// =============================================================
function DangerDeleteDialog() {
  return (
    <div className="dlg" style={{ width: 440 }}>
      <DlgClose />
      <div className="dlg-body">
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <DlgIcon kind="danger" icon={I.alert} />
          <div style={{ flex: 1, paddingTop: 4 }}>
            <h3 className="dlg-title">메모를 영구 삭제할까요?</h3>
            <p className="dlg-msg">
              <span className="quoted">5월 회의록 — 디자인 리뷰</span>가 휴지통을 거치지 않고 완전히 삭제돼요. 이 동작은 <b>되돌릴 수 없습니다.</b>
            </p>
            <div className="dlg-warn-box">
              {React.cloneElement(I.alert, { width: 14, height: 14 })}
              <span>3개의 첨부파일과 12개의 댓글이 함께 사라져요.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="dlg-foot">
        <button className="dbtn ghost">취소</button>
        <button className="dbtn danger">{React.cloneElement(I.trash, { width: 14, height: 14 })} 영구 삭제</button>
      </div>
    </div>
  );
}

function ConfirmDialog() {
  return (
    <div className="dlg" style={{ width: 420 }}>
      <div className="pin" />
      <DlgClose />
      <div className="dlg-body">
        <h3 className="dlg-title">변경사항을 저장할까요?</h3>
        <p className="dlg-msg">현재 메모에 저장하지 않은 변경사항이 있어요. 페이지를 떠나면 변경 내용이 사라집니다.</p>
      </div>
      <div className="dlg-foot">
        <button className="dbtn ghost">저장 안 함</button>
        <button className="dbtn">취소</button>
        <button className="dbtn primary">저장하기</button>
      </div>
    </div>
  );
}

function InfoDialog() {
  return (
    <div className="dlg" style={{ width: 420 }}>
      <div className="tape" />
      <DlgClose />
      <div className="dlg-body center">
        <DlgIcon kind="info" icon={I.star} />
        <h3 className="dlg-title">v2.0 업데이트가 도착했어요 <span className="hand">— 새 기능 ✨</span></h3>
        <p className="dlg-msg">
          더 빠른 검색, 새 손글씨 폰트 3종, 그리고 캘린더 위젯이 추가됐어요. 자세한 내용은 릴리스 노트에서 확인하세요.
        </p>
      </div>
      <div className="dlg-foot center">
        <button className="dbtn ghost">나중에 보기</button>
        <button className="dbtn primary">릴리스 노트 보기 →</button>
      </div>
    </div>
  );
}

function InputDialog() {
  return (
    <div className="dlg" style={{ width: 440 }}>
      <DlgClose />
      <div className="dlg-body">
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <DlgIcon kind="neutral" icon={I.edit} />
          <div style={{ flex: 1, paddingTop: 2 }}>
            <h3 className="dlg-title">폴더 이름 바꾸기</h3>
            <p className="dlg-msg" style={{ fontSize: 13 }}>이 폴더 안의 모든 메모에 새 이름이 적용돼요.</p>
            <input className="dlg-input" defaultValue="2026 회의록" autoFocus />
            <div className="dlg-hint">14 / 50자 · 영문, 한글, 이모지 사용 가능</div>
          </div>
        </div>
      </div>
      <div className="dlg-foot">
        <button className="dbtn">취소</button>
        <button className="dbtn primary">이름 바꾸기</button>
      </div>
    </div>
  );
}

function SuccessDialog() {
  return (
    <div className="dlg" style={{ width: 380 }}>
      <DlgClose />
      <div className="dlg-body center">
        <DlgIcon kind="success" icon={I.check} />
        <h3 className="dlg-title">결제가 완료됐어요!</h3>
        <p className="dlg-msg">
          <b>Pro 연간 플랜</b>이 활성화됐어요. 영수증을<br/>이메일로 보내드렸습니다.
        </p>
      </div>
      <div className="dlg-foot center stack">
        <button className="dbtn primary full lg">대시보드로 가기 →</button>
        <button className="dbtn ghost">영수증 다시 보내기</button>
      </div>
    </div>
  );
}

// =============================================================
// Toasts — declarative
// =============================================================
function Toast({ kind = "info", title, message, action, light = false, mobile = false, withProgress = false, withClose = true }) {
  const ico =
    kind === "success" ? I.check :
    kind === "error"   ? I.close :
    kind === "warn"    ? I.alert :
    kind === "info"    ? I.info :
    kind === "undo"    ? I.undo :
    kind === "loading" ? null   : I.info;
  return (
    <div className={"toast " + kind + (light ? " light" : "") + (mobile ? " mobile" : "") + (mobile && message ? " detailed" : "")}>
      <div className="t-ico">
        {kind === "loading" ? <div className="t-spinner" /> : React.cloneElement(ico, { width: 14, height: 14 })}
      </div>
      <div className="t-body">
        <p className="t-title">{title}</p>
        {message && <p className="t-msg">{message}</p>}
        {action && <button className="t-action">{action}</button>}
      </div>
      {withClose && <button className="t-close" aria-label="닫기">{React.cloneElement(I.close, { width: 12, height: 12 })}</button>}
      {withProgress && <div className="t-progress"><span /></div>}
    </div>
  );
}

// =============================================================
// Stage frames — show dialog "in context"
// =============================================================
function PCStage({ children }) {
  return <div className="stage">{children}</div>;
}
function MobileStage({ children, position = "center", dimmed = true }) {
  return (
    <div className={"mstage" + (dimmed ? " dimmed" : "")}>
      <div className="mstage-status">
        <span>9:41</span>
        <span className="dots"><span/><span/><span/></span>
      </div>
      <div className="mstage-app" />
      <div className={"mstage-dlg " + position}>{children}</div>
    </div>
  );
}

// =============================================================
// MOBILE DIALOG VARIANTS (smaller widths, sheet style)
// =============================================================
function MDangerDelete() {
  return (
    <div className="dlg sheet">
      <div className="dlg-body">
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <DlgIcon kind="danger" icon={I.alert} />
          <div style={{ flex: 1, paddingTop: 4 }}>
            <h3 className="dlg-title">메모를 삭제할까요?</h3>
            <p className="dlg-msg">
              <span className="quoted">5월 회의록</span>이 영구 삭제돼요. 되돌릴 수 없어요.
            </p>
          </div>
        </div>
      </div>
      <div className="dlg-foot stack" style={{ paddingBottom: 28 }}>
        <button className="dbtn danger lg full">영구 삭제</button>
        <button className="dbtn ghost lg full">취소</button>
      </div>
    </div>
  );
}
function MConfirm() {
  return (
    <div className="dlg compact">
      <div className="dlg-body center" style={{ padding: "24px 22px 18px" }}>
        <h3 className="dlg-title">저장할까요?</h3>
        <p className="dlg-msg">변경사항이 있어요.</p>
      </div>
      <div className="dlg-foot full">
        <button className="dbtn">취소</button>
        <button className="dbtn primary">저장</button>
      </div>
    </div>
  );
}
function MInfo() {
  return (
    <div className="dlg compact">
      <div className="dlg-body center" style={{ padding: "26px 22px 18px" }}>
        <DlgIcon kind="info" icon={I.star} />
        <h3 className="dlg-title">v2.0이 도착했어요</h3>
        <p className="dlg-msg">새 기능 3가지를 확인해보세요.</p>
      </div>
      <div className="dlg-foot stack" style={{ paddingBottom: 18 }}>
        <button className="dbtn primary full lg">새 기능 보기</button>
        <button className="dbtn ghost full">나중에</button>
      </div>
    </div>
  );
}
function MInput() {
  return (
    <div className="dlg sheet">
      <div className="dlg-body" style={{ paddingBottom: 8 }}>
        <h3 className="dlg-title">폴더 이름</h3>
        <input className="dlg-input" defaultValue="2026 회의록" autoFocus />
      </div>
      <div className="dlg-foot" style={{ paddingBottom: 22 }}>
        <button className="dbtn ghost" style={{ flex: 1 }}>취소</button>
        <button className="dbtn primary" style={{ flex: 1 }}>저장</button>
      </div>
    </div>
  );
}
function MSuccess() {
  return (
    <div className="dlg compact">
      <div className="dlg-body center" style={{ padding: "28px 22px 20px" }}>
        <DlgIcon kind="success" icon={I.check} />
        <h3 className="dlg-title">결제 완료!</h3>
        <p className="dlg-msg">Pro 플랜이 활성화됐어요.</p>
      </div>
      <div className="dlg-foot center" style={{ paddingBottom: 20 }}>
        <button className="dbtn primary full lg">확인</button>
      </div>
    </div>
  );
}

// =============================================================
// Live toast manager
// =============================================================
const ToastCtx = React.createContext(null);
function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
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
  return (
    <ToastCtx.Provider value={{ push, dismiss }}>
      {children}
      <div className="toast-stack bottom-right">
        {items.filter(t => !t.mobile).map((t) => (
          <div key={t.id} className={"toast live " + t.kind + (t.light ? " light" : "") + (t.leaving ? " leaving" : "")}>
            <div className="t-ico">
              {t.kind === "loading" ? <div className="t-spinner" /> : React.cloneElement(
                t.kind === "success" ? I.check :
                t.kind === "error" ? I.close :
                t.kind === "warn" ? I.alert :
                t.kind === "undo" ? I.undo : I.info,
                { width: 14, height: 14 }
              )}
            </div>
            <div className="t-body">
              <p className="t-title">{t.title}</p>
              {t.message && <p className="t-msg">{t.message}</p>}
              {t.action && (
                <button className="t-action" onClick={() => { t.onAction && t.onAction(); dismiss(t.id); }}>
                  {t.action}
                </button>
              )}
            </div>
            <button className="t-close" onClick={() => dismiss(t.id)}>{React.cloneElement(I.close, { width: 12, height: 12 })}</button>
            {t.duration !== 0 && t.kind !== "loading" && <div className="t-progress"><span /></div>}
          </div>
        ))}
      </div>
      <div className="toast-stack top-mobile">
        {items.filter(t => t.mobile).map((t) => (
          <div key={t.id} className={"toast live top mobile " + t.kind + (t.message ? " detailed" : "") + (t.leaving ? " leaving" : "")}>
            <div className="t-ico">
              {t.kind === "loading" ? <div className="t-spinner" /> :
                React.cloneElement(
                  t.kind === "success" ? I.check :
                  t.kind === "error" ? I.close :
                  t.kind === "warn" ? I.alert :
                  t.kind === "undo" ? I.undo : I.info,
                  { width: 14, height: 14 })}
            </div>
            <div className="t-body">
              <p className="t-title">{t.title}</p>
              {t.message && <p className="t-msg">{t.message}</p>}
            </div>
            {t.action && (
              <button className="t-action" onClick={() => { t.onAction && t.onAction(); dismiss(t.id); }} style={{ marginTop: 0, alignSelf: "center" }}>
                {t.action}
              </button>
            )}
            <button className="t-close" onClick={() => dismiss(t.id)}>{React.cloneElement(I.close, { width: 12, height: 12 })}</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function DemoCard() {
  const ctx = React.useContext(ToastCtx);
  const fire = (cfg) => ctx.push(cfg);
  return (
    <div className="demo-card">
      <h3 className="demo-h">▶ 직접 눌러보기 — 라이브 데모</h3>
      <p className="demo-sub">버튼을 누르면 실제로 토스트가 떴다 사라져요. 4초 자동 종료, 닫기 버튼으로 즉시 닫기 가능.</p>

      <div className="demo-row-h">PC 토스트 (우측 하단)</div>
      <div className="demo-row">
        <button className="demo-btn" onClick={() => fire({ kind: "success", title: "메모가 저장됐어요", message: "마지막 변경: 방금 전" })}>
          <span className="dot success" /> 성공
        </button>
        <button className="demo-btn" onClick={() => fire({ kind: "error", title: "저장에 실패했어요", message: "네트워크를 확인하고 다시 시도해주세요." })}>
          <span className="dot error" /> 에러
        </button>
        <button className="demo-btn" onClick={() => fire({ kind: "warn", title: "저장 공간이 거의 찼어요", message: "남은 용량 12% — 정리가 필요해요." })}>
          <span className="dot warn" /> 경고
        </button>
        <button className="demo-btn" onClick={() => fire({ kind: "info", title: "새 댓글이 달렸어요", message: "민지님이 \"디자인 리뷰\"에 댓글을 남겼어요." })}>
          <span className="dot info" /> 정보
        </button>
        <button className="demo-btn" onClick={() => fire({ kind: "undo", title: "메모가 삭제됐어요", action: "되돌리기", duration: 6000 })}>
          <span className="dot undo" /> Undo
        </button>
        <button className="demo-btn" onClick={() => {
          const id = fire({ kind: "loading", title: "업로드 중...", message: "design-v2.png · 2.4MB", duration: 0 });
          setTimeout(() => {
            ctx.dismiss(id);
            fire({ kind: "success", title: "업로드 완료!", message: "design-v2.png가 추가됐어요." });
          }, 2400);
        }}>
          <span className="dot loading" /> 로딩 → 성공
        </button>
      </div>

      <div className="demo-row-h">PC 페이퍼 라이트 토스트</div>
      <div className="demo-row">
        <button className="demo-btn" onClick={() => fire({ kind: "success", light: true, title: "체크리스트 완료!", message: "오늘 할 일 4개 모두 끝." })}>
          <span className="dot success" /> Light · 성공
        </button>
        <button className="demo-btn" onClick={() => fire({ kind: "info", light: true, title: "동기화됐어요", message: "iPhone에서 메모 3개 가져옴." })}>
          <span className="dot info" /> Light · 정보
        </button>
        <button className="demo-btn" onClick={() => fire({ kind: "warn", light: true, title: "초안이 자동 저장 안 됨", action: "지금 저장" })}>
          <span className="dot warn" /> Light · 액션
        </button>
      </div>

      <div className="demo-row-h">모바일 토스트 (상단)</div>
      <div className="demo-row">
        <button className="demo-btn" onClick={() => fire({ kind: "success", title: "저장됐어요 ✓", mobile: true })}>
          <span className="dot success" /> 모바일 · 성공
        </button>
        <button className="demo-btn" onClick={() => fire({ kind: "error", title: "연결이 끊어졌어요", mobile: true })}>
          <span className="dot error" /> 모바일 · 에러
        </button>
        <button className="demo-btn" onClick={() => fire({ kind: "undo", title: "삭제됨", action: "되돌리기", duration: 5000, mobile: true })}>
          <span className="dot undo" /> 모바일 · Undo
        </button>
      </div>
    </div>
  );
}

// =============================================================
// CANVAS
// =============================================================
function App() {
  return (
    <ToastProvider>
      <DesignCanvas>
        <DCSection id="intro" title="알림창 & 토스트 시안" subtitle="PC + 모바일 공용 디자인 시스템 · 페이퍼 무드 + 모던 디테일">
          <DCArtboard id="overview" label="개요" width={760} height={300}>
            <div className="dt-intro">
              <h2>디자인 원칙</h2>
              <ul>
                <li><b>다이얼로그</b> — 사용자의 결정이 필요할 때만. 아이콘 + 제목 + 한 줄 설명 + 명확한 버튼.</li>
                <li><b>토스트</b> — 결과/상태 알림. 4초 후 자동 사라짐, 닫기 + 액션 버튼은 옵션.</li>
                <li><b>위치</b> — PC: 우측 하단 누적 / 모바일: 상단 한 줄 (한 손 시인성).</li>
                <li>위험 액션은 <span className="yel">빨간 강조</span>, 성공은 초록, 정보는 파랑·노랑.</li>
                <li>다크(잉크) 토스트가 기본. <b>Light</b> 변형은 페이퍼 무드를 더 살릴 때 사용.</li>
              </ul>
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="pc-dialog" title="PC 다이얼로그" subtitle="440px 기준 · 디밍된 페이지 위에 떠있는 모습">
          <DCArtboard id="pc-danger" label="위험 — 영구 삭제" width={580} height={420}>
            <PCStage><DangerDeleteDialog /></PCStage>
          </DCArtboard>
          <DCArtboard id="pc-confirm" label="확인 — 변경사항 저장" width={580} height={420}>
            <PCStage><ConfirmDialog /></PCStage>
          </DCArtboard>
          <DCArtboard id="pc-info" label="정보 — 업데이트 안내" width={580} height={420}>
            <PCStage><InfoDialog /></PCStage>
          </DCArtboard>
          <DCArtboard id="pc-input" label="입력 — 폴더 이름 변경" width={580} height={420}>
            <PCStage><InputDialog /></PCStage>
          </DCArtboard>
          <DCArtboard id="pc-success" label="성공 — 결제 완료" width={580} height={420}>
            <PCStage><SuccessDialog /></PCStage>
          </DCArtboard>
        </DCSection>

        <DCSection id="mobile-dialog" title="모바일 다이얼로그" subtitle="375px 기준 · 시트(하단) 또는 센터 다이얼로그">
          <DCArtboard id="m-danger" label="위험 — 시트" width={300} height={580}>
            <MobileStage position="bottom"><MDangerDelete /></MobileStage>
          </DCArtboard>
          <DCArtboard id="m-confirm" label="확인 — 센터" width={300} height={580}>
            <MobileStage position="center"><MConfirm /></MobileStage>
          </DCArtboard>
          <DCArtboard id="m-info" label="정보 — 센터" width={300} height={580}>
            <MobileStage position="center"><MInfo /></MobileStage>
          </DCArtboard>
          <DCArtboard id="m-input" label="입력 — 시트" width={300} height={580}>
            <MobileStage position="bottom"><MInput /></MobileStage>
          </DCArtboard>
          <DCArtboard id="m-success" label="성공 — 센터" width={300} height={580}>
            <MobileStage position="center"><MSuccess /></MobileStage>
          </DCArtboard>
        </DCSection>

        <DCSection id="pc-toast" title="PC 토스트" subtitle="다크(잉크) 기본 + 페이퍼 라이트 변형">
          <DCArtboard id="t-success" label="성공" width={460} height={120}>
            <div style={{ padding: 24 }}>
              <Toast kind="success" title="메모가 저장됐어요" message="마지막 변경: 방금 전" withProgress />
            </div>
          </DCArtboard>
          <DCArtboard id="t-error" label="에러" width={460} height={120}>
            <div style={{ padding: 24 }}>
              <Toast kind="error" title="저장에 실패했어요" message="네트워크를 확인하고 다시 시도해주세요." />
            </div>
          </DCArtboard>
          <DCArtboard id="t-warn" label="경고" width={460} height={120}>
            <div style={{ padding: 24 }}>
              <Toast kind="warn" title="저장 공간이 거의 찼어요" message="남은 용량 12% — 정리가 필요해요." />
            </div>
          </DCArtboard>
          <DCArtboard id="t-info" label="정보" width={460} height={120}>
            <div style={{ padding: 24 }}>
              <Toast kind="info" title="새 댓글이 달렸어요" message='민지님이 "디자인 리뷰"에 댓글을 남겼어요.' />
            </div>
          </DCArtboard>
          <DCArtboard id="t-undo" label="Undo (액션 포함)" width={460} height={120}>
            <div style={{ padding: 24 }}>
              <Toast kind="undo" title="메모가 삭제됐어요" action="되돌리기" />
            </div>
          </DCArtboard>
          <DCArtboard id="t-loading" label="진행 중 (스피너)" width={460} height={120}>
            <div style={{ padding: 24 }}>
              <Toast kind="loading" title="업로드 중..." message="design-v2.png · 2.4MB" />
            </div>
          </DCArtboard>
          <DCArtboard id="t-light-success" label="라이트 · 성공" width={460} height={120}>
            <div style={{ padding: 24, background: "var(--bg-paper)" }}>
              <Toast kind="success" light title="체크리스트 완료!" message="오늘 할 일 4개 모두 끝." />
            </div>
          </DCArtboard>
          <DCArtboard id="t-light-warn" label="라이트 · 액션 포함" width={460} height={120}>
            <div style={{ padding: 24, background: "var(--bg-paper)" }}>
              <Toast kind="warn" light title="초안이 자동 저장 안 됨" action="지금 저장" />
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="m-toast" title="모바일 토스트" subtitle="화면 상단 · 한 줄 핵심 메시지 · 좌우 풀폭">
          <DCArtboard id="mt-success" label="성공" width={300} height={300}>
            <MobileStage position="top-toast" dimmed={false}>
              <Toast kind="success" mobile title="저장됐어요 ✓" />
            </MobileStage>
          </DCArtboard>
          <DCArtboard id="mt-error" label="에러" width={300} height={300}>
            <MobileStage position="top-toast" dimmed={false}>
              <Toast kind="error" mobile title="연결이 끊어졌어요" />
            </MobileStage>
          </DCArtboard>
          <DCArtboard id="mt-undo" label="Undo (액션)" width={300} height={300}>
            <MobileStage position="top-toast" dimmed={false}>
              <Toast kind="undo" mobile title="삭제됨" action="되돌리기" />
            </MobileStage>
          </DCArtboard>
          <DCArtboard id="mt-loading" label="로딩" width={300} height={300}>
            <MobileStage position="top-toast" dimmed={false}>
              <Toast kind="loading" mobile title="업로드 중..." />
            </MobileStage>
          </DCArtboard>
          <DCArtboard id="mt-detailed" label="2줄 상세" width={300} height={300}>
            <MobileStage position="top-toast" dimmed={false}>
              <Toast kind="info" mobile title="새 댓글" message='민지님이 "디자인 리뷰"에 댓글' />
            </MobileStage>
          </DCArtboard>
        </DCSection>

        <DCSection id="demo" title="인터랙티브 데모" subtitle="버튼을 눌러 실제 토스트 동작을 확인해보세요">
          <DCArtboard id="demo-card" label="라이브 토스트" width={760} height={460}>
            <DemoCard />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </ToastProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
