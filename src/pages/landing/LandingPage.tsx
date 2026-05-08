/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useState, useEffect, useRef, Fragment } from "react";

// ============================================================
// LANDING PAGE — Dayflow marketing site (WLD (4) 시안 이식)
// ============================================================

interface LandingProps {
  onGoToAuth?: () => void;
}

export function LandingPage({ onGoToAuth }: LandingProps = {}) {
  return (
    <div className="landing-root">
      <Nav onGoToAuth={onGoToAuth} />
      <Hero />
      <Features />
      <StatsBand />
      <InteractiveDemo />
      <Gallery />
      <Testimonials />
      <Faq />
      <CtaBand onGoToAuth={onGoToAuth} />
      <Footer />
    </div>
  );
}

// ---------- NAV ----------
function Nav({ onGoToAuth }: { onGoToAuth?: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  return (
    <header className="nav-wrap">
      <nav className="nav">
        <a href="#" className="nav-brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">D</span>
          <span className="brand-name">Dayflow</span>
        </a>
        <div className="nav-links">
          <a href="#features">기능</a>
          <a href="#demo">데모</a>
          <a href="#gallery">스크린샷</a>
          <a href="#/tools/crop">무료 도구</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="nav-cta">
          <button type="button" className="btn btn-ghost" onClick={onGoToAuth}>
            로그인
          </button>
          <button type="button" className="btn btn-primary" onClick={onGoToAuth}>
            무료로 시작하기 →
          </button>
        </div>
        <button
          className={"nav-burger " + (open ? "is-open" : "")}
          onClick={() => setOpen(o => !o)}
          aria-label="메뉴"
          aria-expanded={open}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>
      <div className={"mobile-menu " + (open ? "is-open" : "")}
           onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
        <div className="mobile-menu-inner">
          <a href="#features" onClick={() => setOpen(false)}>기능</a>
          <a href="#demo" onClick={() => setOpen(false)}>데모</a>
          <a href="#gallery" onClick={() => setOpen(false)}>스크린샷</a>
          <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
          <div className="mobile-menu-cta">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setOpen(false);
                onGoToAuth?.();
              }}
            >
              로그인
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setOpen(false);
                onGoToAuth?.();
              }}
            >
              무료로 시작하기 →
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

// ---------- HERO ----------
function Hero() {
  return (
    <Fragment>
      <HeroDesktop/>
      <HeroMobile/>
    </Fragment>
  );
}

function HeroDesktop() {
  return (
    <section className="hero hero-desktop">
      {/* paper deco */}
      <div className="paper-pin" style={{ top: -8, left: 60 }} />
      <div className="paper-pin yellow" style={{ top: 14, right: 80 }} />

      <div>
        <span className="hero-badge">
          <span className="dot">✦</span>
          <span><b>v2.0</b> 출시 · 종이 그대로의 감성으로</span>
        </span>
        <h1>
          하루를, 종이에<br/>적던 그대로.
          <span className="hand">— <span className="underline">디지털로 옮겼어요</span></span>
        </h1>
        <p className="lead">
          가계부 · 일정 · 메모 · 구독 관리까지. 손글씨로 끄적이던 그 자유로움은 그대로 두고, 자동 정리와 검색만 살짝 보태드릴게요.
        </p>
        <div className="hero-cta">
          <a href="#cta" className="btn btn-primary btn-lg">
            지금 무료로 시작하기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="#demo" className="btn btn-secondary btn-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>
            라이브 데모 보기
          </a>
        </div>
        <div className="hero-meta">
          <div className="stack">
            <div className="av" style={{background:'var(--pink)'}}>민</div>
            <div className="av" style={{background:'var(--blue)'}}>지</div>
            <div className="av" style={{background:'var(--green)'}}>현</div>
            <div className="av" style={{background:'var(--yellow)'}}>수</div>
          </div>
          <span><b style={{color:'var(--ink)'}}>12,400+</b>명이 사용 중</span>
          <span><span className="check">✓</span> 신용카드 등록 불필요</span>
        </div>
      </div>

      <div className="hero-preview">
        <div className="paper-tape" style={{ top: -10, left: '38%' }} />
        <div className="paper-tape pink" style={{ bottom: -12, right: 50, transform: 'rotate(5deg)' }} />
        <div className="sticker" style={{ top: -22, right: -8, transform: 'rotate(8deg)' }}>오늘 할 일 ✓</div>
        <div className="sticker pink" style={{ bottom: 28, left: -18, transform: 'rotate(-6deg)' }}>이번 달 -32% ↓</div>

        <div className="hero-preview-tilt">
          <div className="browser-frame">
            <div className="browser-bar">
              <div className="tl"><span/><span/><span/></div>
              <div className="url-bar">
                <div className="lock"/>
                dayflow.app/dashboard
              </div>
              <div style={{width: 20}}/>
            </div>
            <div className="browser-body">
              <PreviewApp/>
            </div>
          </div>
        </div>

        {/* curvy arrow doodle */}
        <svg className="arrow-curve" style={{ top: -40, left: -30, width: 90, height: 80 }} viewBox="0 0 90 80" fill="none">
          <path d="M10 20 Q 30 5, 60 20 T 80 60" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M76 56 L80 60 L74 64" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="handwave" style={{ position: 'absolute', top: -52, left: 40, transform: 'rotate(-4deg)' }}>이게 진짜 책상 같죠?</span>
      </div>
    </section>
  );
}

function HeroMobile() {
  return (
    <section className="hero-mobile">
      {/* layered paper background */}
      <div className="hm-paper-back" />
      <div className="hm-paper-mid" />

      {/* corner deco */}
      <div className="hm-tape-tl" />
      <div className="hm-pin" />

      {/* badge */}
      <span className="hm-badge">
        <span className="hm-badge-dot">✦</span>
        <b>v2.0</b> · 종이 그대로의 감성
      </span>

      {/* big handwritten title */}
      <h1 className="hm-title">
        <span className="hm-line1">하루를,</span>
        <span className="hm-line2"><span className="hm-hl">종이에 적던</span></span>
        <span className="hm-line3">그대로<span className="hm-period">.</span></span>
        <span className="hm-sub-hand">— 디지털로 옮겼어요</span>
      </h1>

      <p className="hm-lead">
        가계부·일정·메모·구독을 한 곳에. 손글씨의 자유로움은 그대로,<br/>
        정리는 자동으로.
      </p>

      {/* mini paper collage */}
      <div className="hm-collage">
        {/* receipt */}
        <div className="hm-receipt">
          <div className="hm-receipt-head">
            <span>DAYFLOW</span>
            <span>05.07</span>
          </div>
          <div className="hm-receipt-row"><span>아침 커피</span><span>4,500</span></div>
          <div className="hm-receipt-row"><span>점심</span><span>12,800</span></div>
          <div className="hm-receipt-row strike"><span>택시</span><span>9,200</span></div>
          <div className="hm-receipt-row"><span>책</span><span>18,000</span></div>
          <div className="hm-receipt-divider" />
          <div className="hm-receipt-total">
            <span>합계</span>
            <b>44,500원</b>
          </div>
          <div className="hm-receipt-foot">- 32% ↓ 잘 아꼈어요</div>
        </div>

        {/* postit todo */}
        <div className="hm-postit">
          <div className="hm-postit-tape" />
          <div className="hm-postit-h">오늘 할 일</div>
          <ul>
            <li className="done">아침 운동 30분</li>
            <li className="done">이메일 답장</li>
            <li>디자인 시안 발송</li>
            <li>저녁 7시 약속</li>
          </ul>
        </div>

        {/* sticker note */}
        <div className="hm-sticker">
          빵집<br/>들르기!
        </div>

        {/* mini calendar chip */}
        <div className="hm-cal">
          <div className="hm-cal-h">MAY</div>
          <div className="hm-cal-num">07</div>
          <div className="hm-cal-day">WED</div>
        </div>

        {/* tiny arrow */}
        <svg className="hm-arrow" viewBox="0 0 80 60" fill="none">
          <path d="M8 12 Q 30 4, 55 22 T 72 48" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M68 44 L72 48 L66 52" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="hm-handnote">전부 한 곳에 ✨</span>
      </div>

      {/* CTAs */}
      <div className="hm-cta">
        <a href="#cta" className="btn btn-primary btn-lg hm-cta-primary">
          지금 무료로 시작하기
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <a href="#demo" className="btn btn-secondary btn-lg hm-cta-secondary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg>
          라이브 데모 보기
        </a>
      </div>

      <div className="hm-meta">
        <div className="stack">
          <div className="av" style={{background:'var(--pink)'}}>민</div>
          <div className="av" style={{background:'var(--blue)'}}>지</div>
          <div className="av" style={{background:'var(--green)'}}>현</div>
          <div className="av" style={{background:'var(--yellow)'}}>수</div>
        </div>
        <span><b style={{color:'var(--ink)'}}>12,400+</b>명 사용 중</span>
      </div>
      <div className="hm-meta-sub">
        <span className="check">✓</span> 신용카드 등록 불필요 · 평생 무료 시작
      </div>
    </section>
  );
}

function PreviewApp() {
  return (
    <div className="preview-app">
      <div className="preview-side">
        <div className="pmark">D</div>
        <div className="pico on" title="홈"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg></div>
        <div className="pico" title="가계부"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg></div>
        <div className="pico" title="일정"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg></div>
        <div className="pico" title="메모"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M18 2l4 4-9 9H9v-4z"/></svg></div>
        <div className="pico" title="구독"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></div>
      </div>
      <div className="preview-main">
        <h3>안녕하세요, 민지님 <span className="hand">— 오늘도 화이팅!</span></h3>
        <div className="crumb">2026 · MAY · 07 · WED</div>
        <div className="preview-grid">
          <div className="pcard">
            <h4>이번 달 지출</h4>
            <div className="big">1,284<small>,000원</small></div>
            <div className="delta">▼ 전월比 32% 절약 · 잘하셨어요!</div>
            <div className="bar-mini" style={{marginTop: 12}}>
              <span style={{height:'40%'}}/><span style={{height:'62%'}}/><span style={{height:'48%'}}/>
              <span style={{height:'72%'}}/><span style={{height:'55%'}}/><span style={{height:'80%'}}/>
              <span className="hi" style={{height:'42%'}}/>
            </div>
          </div>
          <div className="pcard">
            <h4>오늘의 할 일</h4>
            <ul>
              <li className="done">아침 운동 30분</li>
              <li className="done">이메일 답장</li>
              <li>디자인 시안 발송</li>
              <li>저녁 약속 — 7시</li>
            </ul>
          </div>
          <div className="pcard" style={{gridColumn: 'span 2', display:'flex', gap:12, alignItems:'center'}}>
            <div style={{flex:1}}>
              <h4 style={{marginBottom:4}}>이번 주 일정</h4>
              <div style={{fontSize:13, color:'var(--ink-soft)', lineHeight:1.5}}>
                회의 <b>3</b> · 약속 <b>2</b> · 마감 <b>1</b>
              </div>
            </div>
            <div style={{display:'flex', gap:3}}>
              {[1,1,0,1,1,0,0].map((v,i)=>(
                <div key={i} style={{width:18, height:32, borderRadius:4, background: v?'var(--ink)':'var(--bg-paper)', border:'1px solid var(--line)'}}/>
              ))}
            </div>
          </div>
        </div>
        <div className="preview-note" style={{ bottom: 14, right: 14 }}>
          저녁엔 빵집 들르기!
        </div>
      </div>
    </div>
  );
}

// ---------- FEATURES ----------
function Features() {
  const feats = [
    {
      ico: 'pink', glyph: 'wallet',
      title: '가계부',
      desc: '카드도, 현금도, 상상의 비상금까지. 받아 적기만 하면 자동 분류돼요.',
      list: ['10초 만에 영수증 입력', '카테고리 자동 추천', '월별·주별 흐름 그래프'],
    },
    {
      ico: 'blue', glyph: 'cal',
      title: '일정',
      desc: '캘린더는 약속을 위한 게 아니에요. 하루의 리듬을 그리는 거죠.',
      list: ['반복·구글캘린더 연동', '메모와 일정 한 곳에', '오늘 카드로 한눈에 정리'],
    },
    {
      ico: 'green', glyph: 'note',
      title: '메모',
      desc: '머리에 떠오른 그 순간, 그대로. 마크다운도 지원하지만 안 써도 돼요.',
      list: ['폴더·태그로 정리', '버전 기록 30일 보관', '손글씨 폰트 옵션'],
    },
    {
      ico: 'yellow', glyph: 'repeat',
      title: '구독 관리',
      desc: '잊고 빠져나가던 그 5,900원. 이제는 미리 보고, 미리 정리하세요.',
      list: ['결제일 알림', '연간 환산 비교', '안 쓰는 구독 자동 감지'],
    },
  ];
  const glyph = (g) => {
    const p = { width:24, height:24, viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:1.8, strokeLinecap:"round", strokeLinejoin:"round" };
    if (g==='wallet') return <svg {...p}><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/><circle cx="16" cy="15" r="1.2"/></svg>;
    if (g==='cal') return <svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>;
    if (g==='note') return <svg {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M18 2l4 4-9 9H9v-4z"/></svg>;
    if (g==='repeat') return <svg {...p}><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
  };
  return (
    <section className="section" id="features">
      <div className="section-head">
        <div className="section-eyebrow">PRODUCT</div>
        <h2 className="section-title">하루의 모든 조각을 <span className="hand">한 책상 위에.</span></h2>
        <p className="section-sub">
          돈, 시간, 생각. 각각 다른 앱 4개를 오갈 필요가 없어요. Dayflow 한 곳에서 자연스럽게 흐르게 두세요.
        </p>
      </div>
      <div className="features-grid">
        {feats.map((f,i) => (
          <div key={i} className="feat">
            <div className={"feat-ico " + f.ico}>{glyph(f.glyph)}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <ul className="feat-list">
              {f.list.map((l,j) => (
                <li key={j}>
                  <span className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg></span>
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- STATS BAND ----------
function StatsBand() {
  return (
    <div className="section" style={{paddingTop: 0, paddingBottom: 0}}>
      <div className="stats-band">
        <div className="stat"><div className="num">12.4<small>K</small></div><div className="lbl">활성 사용자</div></div>
        <div className="stat"><div className="num">340<small>K+</small></div><div className="lbl">기록된 메모</div></div>
        <div className="stat"><div className="num">4.9<small>★</small></div><div className="lbl">평점 (App Store)</div></div>
        <div className="stat"><div className="num">17<small>분</small></div><div className="lbl">하루 평균 절약</div></div>
      </div>
    </div>
  );
}

// ---------- INTERACTIVE DEMO ----------
function InteractiveDemo() {
  const [tab, setTab] = useState('todo');
  return (
    <section className="section" id="demo">
      <div className="section-head center">
        <div className="section-eyebrow">LIVE DEMO</div>
        <h2 className="section-title" style={{margin:'0 auto 14px'}}>직접 한 번 <span className="hand">눌러보세요.</span></h2>
        <p className="section-sub">로그인 없이도, 여기서 바로 사용해볼 수 있어요. 입력해보고, 체크해보고, 지워보세요.</p>
      </div>
      <div className="demo">
        <div className="demo-side">
          <div>
            <div className="demo-eyebrow">— 한 번 끄적여보세요</div>
            <h3>입력 한 줄로,<br/>분류는 알아서.</h3>
            <p>메모처럼 적어도 Dayflow가 영수증인지, 일정인지, 그냥 생각인지 구분해서 자리를 잡아둬요.</p>
            <div className="demo-tabs">
              <button className={"demo-tab" + (tab==='todo'?' on':'')} onClick={()=>setTab('todo')}>✓ 할 일</button>
              <button className={"demo-tab" + (tab==='spend'?' on':'')} onClick={()=>setTab('spend')}>₩ 지출</button>
              <button className={"demo-tab" + (tab==='memo'?' on':'')} onClick={()=>setTab('memo')}>✎ 메모</button>
            </div>
          </div>
          <div className="demo-tip">
            <span>💡 Tip —</span>
            <kbd>Enter</kbd> 추가
            <kbd>⌘K</kbd> 전체 검색
          </div>
        </div>
        <div className="demo-stage">
          {tab==='todo' && <TodoDemo/>}
          {tab==='spend' && <SpendDemo/>}
          {tab==='memo' && <MemoDemo/>}
        </div>
      </div>
    </section>
  );
}

function TodoDemo() {
  const [items, setItems] = useState([
    { id:1, text:'디자인 시안 발송', tag:'할일', done:false },
    { id:2, text:'아침 운동 30분', tag:'할일', done:true },
    { id:3, text:'엄마한테 전화하기', tag:'할일', done:false },
  ]);
  const [val, setVal] = useState('');
  const add = () => {
    if (!val.trim()) return;
    setItems([{ id: Date.now(), text: val, tag:'할일', done:false }, ...items]);
    setVal('');
  };
  return (
    <>
      <div className="qa-input-row">
        <input className="qa-input" placeholder="떠오른 일을 적어보세요…" value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}/>
        <button className="qa-add" onClick={add}>추가</button>
      </div>
      <ul className="qa-list">
        {items.map(it => (
          <li key={it.id} className={"qa-item" + (it.done?' done':'')}>
            <button className="qa-check" onClick={()=>setItems(items.map(x=>x.id===it.id?{...x,done:!x.done}:x))}>
              {it.done && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>}
            </button>
            <span className="qa-text">{it.text}</span>
            <span className="qa-tag">#{it.tag}</span>
            <button className="qa-del" onClick={()=>setItems(items.filter(x=>x.id!==it.id))}>×</button>
          </li>
        ))}
      </ul>
    </>
  );
}

function SpendDemo() {
  const [bars, setBars] = useState([42, 65, 48, 72, 55, 80, 38]);
  const [cats] = useState([
    { color:'var(--pink)', name:'식비', amt:'₩ 384,200' },
    { color:'var(--blue)', name:'교통', amt:'₩ 92,400' },
    { color:'var(--yellow)', name:'쇼핑', amt:'₩ 218,000' },
    { color:'var(--green)', name:'기타', amt:'₩ 64,500' },
  ]);
  useEffect(() => {
    const t = setInterval(() => setBars(bars.map(()=> 30 + Math.floor(Math.random()*55))), 2400);
    return () => clearInterval(t);
  });
  return (
    <>
      <div className="spend-stat">
        <b>₩ 759,100</b>
        <span className="delta">▼ 전월比 32%</span>
      </div>
      <div className="spend-bars">
        {bars.map((h,i) => (
          <div key={i} className={"b" + (i===bars.length-1?' hi':'')} style={{height: h+'%'}}>
            <span className="lbl">{['월','화','수','목','금','토','일'][i]}</span>
          </div>
        ))}
      </div>
      <div className="spend-cats">
        {cats.map((c,i) => (
          <div key={i} className="spend-cat">
            <span className="swatch" style={{background:c.color}}/>
            <span className="name">{c.name}</span>
            <span className="amt">{c.amt}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function MemoDemo() {
  const [text, setText] = useState(`오늘의 메모

— 디자인 시스템 v2 회의록
색상 토큰을 3단으로 정리하기로 함
다크 모드는 oklch 기반으로

저녁엔 가까운 빵집 들르기 🥐`);
  return (
    <>
      <div className="memo-demo-wrap">
        <textarea value={text} onChange={e=>setText(e.target.value)} spellCheck={false}/>
      </div>
      <div className="memo-stat">
        <span><b>{text.length}</b>자</span>
        <span>·</span>
        <span><b>{text.split(/\s+/).filter(Boolean).length}</b>단어</span>
        <span>·</span>
        <span style={{marginLeft:'auto', color:'#4a8d5a'}}>● 자동 저장됨</span>
      </div>
    </>
  );
}

// ---------- GALLERY ----------
function Gallery() {
  return (
    <section className="section" id="gallery">
      <div className="section-head">
        <div className="section-eyebrow">SCREENSHOTS</div>
        <h2 className="section-title">화면이 곧 책상이에요.</h2>
        <p className="section-sub">테이프, 핀, 손글씨 — 진짜 종이에서 쓰던 그 감각을 디지털에 그대로 옮겼습니다.</p>
      </div>
      <div className="gallery">
        <div className="gframe">
          <div className="gframe-meta">
            <span className="chip">DESKTOP</span>
            <h4>이번 달 가계부</h4>
          </div>
          <div className="gframe-shot">
            <MiniLedger/>
          </div>
          <p className="gframe-cap"><b>한 줄 입력</b>이면 끝. 카테고리는 학습된 패턴으로 자동 분류되고, 월말엔 알아서 리포트가 나와요.</p>
        </div>
        <div className="gframe tall">
          <div className="gframe-meta">
            <span className="chip">MOBILE</span>
            <h4>들고 다니는 책상</h4>
          </div>
          <div className="gframe-shot" style={{padding:24, display:'grid', placeItems:'center'}}>
            <Phone/>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniLedger() {
  const items = [
    { ico:'☕', name:'어니언 성수', cat:'카페', date:'5/7 14:22', amt:'-7,500' },
    { ico:'🍱', name:'한솥도시락', cat:'식비', date:'5/7 12:08', amt:'-6,800' },
    { ico:'💼', name:'급여 입금', cat:'수입', date:'5/5 09:00', amt:'+3,200,000', plus:true },
    { ico:'🚇', name:'지하철 정기권', cat:'교통', date:'5/4 08:14', amt:'-62,000' },
    { ico:'🛒', name:'쿠팡', cat:'생필품', date:'5/3 21:42', amt:'-34,200' },
  ];
  return (
    <div className="mini-ledger">
      <div className="mlhead">
        <h5>5월 거래내역</h5>
        <span className="bal">잔액 ₩ 4,128,400</span>
      </div>
      {items.map((it,i) => (
        <div key={i} className="mli">
          <div className="ico-mini" style={{fontSize:14}}>{it.ico}</div>
          <div className="info">
            <b>{it.name}</b>
            <span>{it.cat} · {it.date}</span>
          </div>
          <span className={"amt " + (it.plus?'plus':'minus')}>{it.amt}</span>
        </div>
      ))}
    </div>
  );
}

function Phone() {
  return (
    <div className="phone">
      <div className="phone-screen">
        <div className="phone-bar"><span>9:41</span><span>•••</span></div>
        <h6>안녕하세요, 민지님<small>오늘은 좀 가볍네요</small></h6>
        <div className="phone-card" style={{background:'var(--yellow)', borderColor:'var(--yellow-edge)'}}>
          <b style={{display:'block', fontSize:10, color:'var(--ink-mute)', textTransform:'uppercase', letterSpacing:'0.08em'}}>이번 달 지출</b>
          <div style={{fontSize:20, fontWeight:800, marginTop:2}}>₩ 759K</div>
          <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--ink-soft)', marginTop:2}}>▼ 32% 절약</div>
        </div>
        <div className="phone-card">
          <b style={{display:'block', fontSize:10, color:'var(--ink-mute)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4}}>오늘 할 일</b>
          <div style={{display:'flex', flexDirection:'column', gap:4}}>
            <div style={{display:'flex', gap:6, alignItems:'center'}}>
              <span style={{width:10, height:10, borderRadius:3, background:'var(--ink)'}}/>
              <span style={{textDecoration:'line-through', color:'var(--ink-mute)'}}>아침 운동</span>
            </div>
            <div style={{display:'flex', gap:6, alignItems:'center'}}>
              <span style={{width:10, height:10, borderRadius:3, border:'1.5px solid var(--line-strong)'}}/>
              <span>디자인 발송</span>
            </div>
            <div style={{display:'flex', gap:6, alignItems:'center'}}>
              <span style={{width:10, height:10, borderRadius:3, border:'1.5px solid var(--line-strong)'}}/>
              <span>저녁 약속</span>
            </div>
          </div>
        </div>
        <div className="phone-card" style={{background:'var(--blue)', borderColor:'var(--blue-edge)'}}>
          <b style={{display:'block', fontSize:10, color:'var(--ink-mute)', textTransform:'uppercase', letterSpacing:'0.08em'}}>다음 일정</b>
          <div style={{fontSize:11, fontWeight:700, marginTop:2}}>저녁 약속 — 7:00 PM</div>
          <div style={{fontFamily:'var(--mono)', fontSize:9, color:'var(--ink-soft)', marginTop:2}}>망원동 · 2시간 후</div>
        </div>
      </div>
    </div>
  );
}

// ---------- TESTIMONIALS ----------
function Testimonials() {
  const t = [
    { txt:'기록을 남긴다는 게 부담스러웠는데, Dayflow는 내가 종이에 적던 느낌 그대로라 매일 열게 돼요.', name:'정민지', role:'프로덕트 디자이너', av:'민' },
    { txt:'가계부 따로, 캘린더 따로, 메모 따로 쓰던 게 한 곳에 들어와서 머리가 정리됐어요.', name:'김현수', role:'프리랜서 개발자', av:'현' },
    { txt:'마스킹 테이프랑 핀이 그려져 있는 게, 진짜 책상 같아서 웃었어요. 근데 그게 좋아요.', name:'이수진', role:'마케터 · 3년차', av:'지' },
  ];
  return (
    <section className="section">
      <div className="section-head center">
        <div className="section-eyebrow">VOICES</div>
        <h2 className="section-title" style={{margin:'0 auto 14px'}}>적던 사람들의 <span className="hand">한 마디.</span></h2>
        <p className="section-sub">Dayflow는 작은 디테일에 진심인 사람들을 위한 도구예요.</p>
      </div>
      <div className="testimonials">
        {t.map((x,i) => (
          <div key={i} className="postit">
            <div className="quote-mark">"</div>
            <p>{x.txt}</p>
            <div className="who">
              <div className="av">{x.av}</div>
              <div>
                <b>{x.name}</b>
                <span>{x.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- FAQ ----------
function Faq() {
  const items = [
    { q: '정말로 무료인가요?', a: '네. 핵심 기능 — 가계부 입력, 일정 등록, 메모, 구독 추적 — 은 무료로 평생 쓸 수 있어요. 내보내기·고급 통계·다중 기기 동기화는 Pro 플랜에 포함됩니다.' },
    { q: '데이터는 어디에 저장되나요?', a: '서울 리전의 암호화된 서버에 저장되며, 본인만 접근할 수 있어요. 언제든 한 번에 모든 데이터를 JSON·CSV로 내려받을 수 있습니다.' },
    { q: '다른 앱(노션, 구글 캘린더)과 연동되나요?', a: '구글·애플 캘린더는 양방향 동기화가 됩니다. 노션·Toss는 v2.1에서 지원 예정이에요.' },
    { q: '아이패드 손글씨도 지원되나요?', a: 'Apple Pencil 필기 입력은 모바일 앱에서 사용 가능하며, 메모 안에 자유롭게 그려넣을 수 있어요.' },
    { q: '구독을 해지하면 데이터가 사라지나요?', a: '아니요. 무료 플랜으로 자동 전환되며, 모든 기록은 그대로 유지됩니다.' },
  ];
  return (
    <section className="section" id="faq">
      <div className="section-head center">
        <div className="section-eyebrow">FAQ</div>
        <h2 className="section-title" style={{margin:'0 auto 14px'}}>자주 묻는 질문.</h2>
      </div>
      <div className="faq">
        {items.map((it, i) => (
          <details key={i} className="faq-item" open={i===0}>
            <summary className="faq-q">
              <span>{it.q}</span>
              <span className="plus">+</span>
            </summary>
            <div className="faq-a">{it.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ---------- CTA BAND ----------
function CtaBand({ onGoToAuth }: { onGoToAuth?: () => void }) {
  return (
    <section className="section" id="cta">
      <div className="cta-band">
        <h2>
          오늘부터,<br/>한 곳에서 정리해요.
          <span className="hand">— 5분이면 충분해요</span>
        </h2>
        <p>신용카드도, 약속도 필요 없어요. 그냥 첫 줄을 적어보세요. 나머지는 Dayflow가 함께 정리할게요.</p>
        <div style={{display:'inline-flex', gap:10, flexWrap:'wrap', justifyContent:'center'}}>
          <button type="button" className="btn btn-primary btn-xl" onClick={onGoToAuth}>
            무료로 시작하기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
          <a href="#demo" className="btn btn-secondary btn-xl">데모 둘러보기</a>
        </div>
        <div className="cta-foot">
          <span>✓ 신용카드 불필요</span>
          <span>✓ 1분 만에 시작</span>
          <span>✓ 언제든 데이터 내보내기</span>
        </div>
      </div>
    </section>
  );
}

// ---------- FOOTER ----------
function Footer() {
  const soc = (path) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{path}</svg>;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="foot-brand">
          <div style={{display:'flex', alignItems:'center', gap:10}}>
            <span className="brand-mark">D</span>
            <span className="brand-name">Dayflow</span>
          </div>
          <p>종이 위의 자유로움을, 디지털의 가벼움으로. 매일 쓰는 도구일수록 더 다정해야 한다고 믿어요.</p>
          <div className="foot-socials">
            <a href="#" className="foot-soc">{soc(<><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor"/></>)}</a>
            <a href="#" className="foot-soc">{soc(<path d="M22 5.8a8 8 0 0 1-2.4.7 4 4 0 0 0 1.8-2.2 8.4 8.4 0 0 1-2.6 1 4.1 4.1 0 0 0-7 3.7A11.6 11.6 0 0 1 3 4.7a4.1 4.1 0 0 0 1.3 5.5A4 4 0 0 1 2.4 9.7v.1a4.1 4.1 0 0 0 3.3 4 4 4 0 0 1-1.8.1 4.1 4.1 0 0 0 3.8 2.8A8.2 8.2 0 0 1 2 18.3a11.6 11.6 0 0 0 6.3 1.8c7.5 0 11.7-6.2 11.7-11.7v-.5A8.3 8.3 0 0 0 22 5.8z"/>)}</a>
            <a href="#" className="foot-soc">{soc(<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>)}</a>
          </div>
        </div>
        <div className="foot-col">
          <h5>제품</h5>
          <ul>
            <li><a href="#features">기능</a></li>
            <li><a href="#demo">데모</a></li>
            <li><a href="#">로드맵</a></li>
            <li><a href="#">가격</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>회사</h5>
          <ul>
            <li><a href="#">소개</a></li>
            <li><a href="#">블로그</a></li>
            <li><a href="#">채용</a></li>
            <li><a href="#">언론 보도</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>지원</h5>
          <ul>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#">고객센터</a></li>
            <li><a href="#">개인정보처리방침</a></li>
            <li><a href="#">이용약관</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bot">
        <span>© 2026 Dayflow Inc. · Made with ☕ in Seoul</span>
        <span>v2.0.4 · all systems operational ●</span>
      </div>
    </footer>
  );
}

window.Landing = Landing;
