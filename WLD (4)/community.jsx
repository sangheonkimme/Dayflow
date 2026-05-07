/* global React, Icon */
const { useState } = React;

// ============================================================
// COMMUNITY PAGE — Dayflow's social kick point
// 절약 인증, 챌린지, 랭킹, 절약 팁
// ============================================================
function CommunityPage() {
  const [tab, setTab] = useState("feed"); // feed | challenges | ranking | tips
  const [filter, setFilter] = useState("all"); // all | following | hot | nearby
  const [composerText, setComposerText] = useState("");
  const [likedIds, setLikedIds] = useState(new Set(["p2"]));
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [joinedChallenges, setJoinedChallenges] = useState(new Set(["c1"]));

  const toggleLike = (id) => {
    const next = new Set(likedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setLikedIds(next);
  };
  const toggleBookmark = (id) => {
    const next = new Set(bookmarkedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setBookmarkedIds(next);
  };
  const toggleJoin = (id) => {
    const next = new Set(joinedChallenges);
    next.has(id) ? next.delete(id) : next.add(id);
    setJoinedChallenges(next);
  };

  // ── Feed posts
  const posts = [
    {
      id: "p1",
      author: { name: "민지", avatar: "🦊", bg: "#ffd95e" },
      time: "방금 전",
      verified: true,
      body: <>오늘 점심은 <b>회사 도시락</b>으로 해결! 일주일째 외식 안 했더니 통장이 두꺼워지는 게 보여요 ㅎㅎ <span className="hashtag">#무지출챌린지</span> <span className="hashtag">#점심도시락</span></>,
      highlight: { emoji: "💸", num: "₩8,500", lbl: "오늘 절약액", meta: <><b>5일 연속</b><span>외식 0건</span></> },
      tags: ["#무지출챌린지", "#점심도시락", "#5일연속"],
      likes: 124, comments: 18, shares: 4,
    },
    {
      id: "p2",
      author: { name: "준호", avatar: "🐻", bg: "#cfe7ff" },
      time: "12분 전",
      body: <>11월 생활비 결산. 목표 200만 잡고 시작했는데 결국 178만 찍었습니다. 가장 큰 차이는 <b>쿠팡 알림 끈 거</b>… 진짜 이게 효과 어마어마함</>,
      receipt: {
        title: "11월 생활비 결산",
        rows: [
          ["식비", "₩542,000"],
          ["교통", "₩98,000"],
          ["여가/쇼핑", "₩220,000", "₩430,000"], // strike old
          ["고정 지출", "₩720,000"],
          ["기타", "₩200,000"],
        ],
        total: "₩1,780,000",
        target: "목표 ₩2,000,000",
      },
      tags: ["#가계부결산", "#11월", "#목표달성"],
      likes: 287, comments: 42, shares: 19,
    },
    {
      id: "tip-block",
      kind: "tip",
      eyebrow: "오늘의 절약 팁 · Editor's pick",
      title: "통신비 50% 줄이는 알뜰폰 이동 가이드",
      body: <>월 7만원짜리 요금제 → 알뜰폰 2.9만원으로 바꾸고 6개월 동안 ₩246,000 절약. 실제 경험담과 단계별 체크리스트까지 정리했어요.</>,
    },
    {
      id: "p3",
      author: { name: "서연", avatar: "🐰", bg: "#ffd4e3" },
      time: "1시간 전",
      verified: true,
      body: <>드디어 비상금 <b>500만원</b> 달성! 작년 이맘때 0원이었는데 1년 만에 여기까지 왔네요. 매주 일요일 자동이체 해두는 게 진짜 답이에요 🥹</>,
      highlight: { emoji: "🏆", num: "₩5,000,000", lbl: "비상금 적립 완료", meta: <><b>52주 챌린지 완주</b><span>2025.11 → 2026.11</span></> },
      tags: ["#52주챌린지", "#비상금", "#1년결산"],
      likes: 892, comments: 134, shares: 67,
    },
    {
      id: "p4",
      author: { name: "도현", avatar: "🐧", bg: "#d8e8f5" },
      time: "3시간 전",
      body: <>구독 정리 한 번 하고 나니까 월 <b>₩47,000</b>가 굳어요. 안 보던 OTT 두 개랑 잘 안 쓰던 헬스앱 정리한 게 컸음. 다들 한 번씩 점검해보세요…</>,
      images: 2,
      tags: ["#구독정리", "#OTT다이어트"],
      likes: 156, comments: 23, shares: 8,
    },
  ];

  // ── Trending tags
  const trends = [
    { rank: 1, tag: "#무지출챌린지", count: "1,284", hot: true },
    { rank: 2, tag: "#52주챌린지", count: "892" },
    { rank: 3, tag: "#커피값아끼기", count: "643" },
    { rank: 4, tag: "#가계부결산", count: "521" },
    { rank: 5, tag: "#구독정리", count: "418" },
    { rank: 6, tag: "#편의점탈출", count: "302" },
  ];

  // ── Challenges
  const challenges = [
    { id: "c1", emoji: "💸", title: "30일 무지출 챌린지", desc: "필수 지출 외 0원으로 한 달 살아보기", participants: 2743, progress: 53, days: "12 / 30일", theme: "yellow" },
    { id: "c2", emoji: "☕", title: "커피값 아끼기 30일", desc: "외부 카페 대신 사내/홈 커피로", participants: 1894, progress: 71, days: "21 / 30일", theme: "pink" },
    { id: "c3", emoji: "🎯", title: "52주 적금 챌린지", desc: "매주 늘려가는 자동 적립", participants: 4218, progress: 84, days: "44 / 52주", theme: "mint" },
    { id: "c4", emoji: "🍱", title: "도시락 14일 챌린지", desc: "점심값 절약 + 식단 관리", participants: 1102, progress: 28, days: "4 / 14일", theme: "ink" },
  ];

  // ── Leaderboard
  const ranks = [
    { rank: 1, name: "달팽이", avatar: "🐌", saved: "₩482,300", streak: 28 },
    { rank: 2, name: "지니", avatar: "🐹", saved: "₩418,500", streak: 24 },
    { rank: 3, name: "준호", avatar: "🐻", saved: "₩392,000", streak: 19 },
    { rank: 4, name: "민지", avatar: "🦊", saved: "₩351,200", streak: 17 },
    { rank: 7, name: "나비", avatar: "🦋", saved: "₩238,900", streak: 12, me: true },
  ];

  // ── Friend activity
  const friends = [
    { name: "지수", emoji: "🐱", bg: "#ffd95e", act: "방금 인증 · ₩6,200 절약", online: true },
    { name: "하늘", emoji: "🐶", bg: "#cfe7ff", act: "30일 무지출 12일차", online: true },
    { name: "예린", emoji: "🐹", bg: "#ffd4e3", act: "비상금 ₩200만 달성!", online: false },
    { name: "윤재", emoji: "🐢", bg: "#d8eedf", act: "어제 챌린지 완주", online: false },
  ];

  return (
    <div data-screen-label="05 커뮤니티">
      {/* HERO */}
      <div className="cm-hero">
        <div className="cm-hero-tape t1">절약은 자랑이다</div>
        <div className="cm-hero-tape t2">함께 돈 모으는 재미</div>
        <div className="cm-hero-inner">
          <div>
            <div className="cm-hero-eyebrow">Dayflow Community · 2026 · 11월</div>
            <h1 className="cm-hero-title">
              혼자 모으면 적금<span className="hand">함께 모으면 챌린지</span>
            </h1>
            <div className="cm-hero-sub">
              오늘 아낀 한 푼을 자랑하고, 누군가의 절약에 박수를 보내보세요.
              실제 가계부와 연결된 진짜 인증만 올라옵니다.
            </div>
            <div className="cm-hero-stats">
              <div className="cm-hero-stat">
                <div className="v"><span className="accent">2,743</span>명</div>
                <div className="l">이번 주 활성 멤버</div>
              </div>
              <div className="cm-hero-stat">
                <div className="v">₩42.8M</div>
                <div className="l">함께 절약한 금액</div>
              </div>
              <div className="cm-hero-stat">
                <div className="v">1,284</div>
                <div className="l">오늘 인증된 절약</div>
              </div>
              <div className="cm-hero-stat">
                <div className="v">3개</div>
                <div className="l">진행 중 챌린지</div>
              </div>
            </div>
          </div>
          <div className="cm-hero-cta">
            <button className="cm-hero-btn">
              <Icon name="sparkle" size={16} />
              오늘의 절약 인증하기
            </button>
            <button className="cm-hero-btn-ghost">
              <Icon name="users" size={13} />
              친구 초대 · 5명 함께하는 중
            </button>
          </div>
        </div>
      </div>

      {/* TAB STRIP */}
      <div className="cm-tabs">
        <div className={"cm-tab" + (tab === "feed" ? " on" : "")} onClick={() => setTab("feed")}>
          <Icon name="msg" size={14} /> 피드 <span className="badge">128</span>
        </div>
        <div className={"cm-tab" + (tab === "challenges" ? " on" : "")} onClick={() => setTab("challenges")}>
          <Icon name="target" size={14} /> 챌린지 <span className="badge">3</span>
        </div>
        <div className={"cm-tab" + (tab === "ranking" ? " on" : "")} onClick={() => setTab("ranking")}>
          <Icon name="trophy" size={14} /> 랭킹
        </div>
        <div className={"cm-tab" + (tab === "tips" ? " on" : "")} onClick={() => setTab("tips")}>
          <Icon name="bookmark" size={14} /> 절약 팁
        </div>
      </div>

      {/* 3-COL LAYOUT */}
      <div className="cm-layout">
        {/* LEFT RAIL */}
        <aside className="cm-rail">
          {/* My profile */}
          <div className="cm-me">
            <div className="cm-me-row">
              <div className="cm-me-avatar">🦋</div>
              <div>
                <div className="cm-me-name">나비</div>
                <div className="cm-me-sub">상위 12% · 12일 연속</div>
              </div>
            </div>
            <div className="cm-me-stats">
              <div className="cm-me-stat">
                <div className="v">23</div>
                <div className="l">인증</div>
              </div>
              <div className="cm-me-stat">
                <div className="v">₩238K</div>
                <div className="l">이번 달 절약</div>
              </div>
              <div className="cm-me-stat">
                <div className="v">3</div>
                <div className="l">챌린지</div>
              </div>
            </div>
          </div>

          {/* Friend activity */}
          <div className="card card-pad">
            <div className="cm-rail-h">
              친구 활동
              <span className="more">전체 →</span>
            </div>
            <div className="cm-friends">
              {friends.map(f => (
                <div className="cm-friend" key={f.name}>
                  <div className="cm-friend-av" style={{ background: f.bg }}>
                    {f.emoji}
                    {f.online && <span className="dot" />}
                  </div>
                  <div className="cm-friend-meta">
                    <div className="cm-friend-name">{f.name}</div>
                    <div className="cm-friend-act">{f.act}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending tags */}
          <div className="card card-pad">
            <div className="cm-rail-h">
              인기 태그
              <span className="more">실시간</span>
            </div>
            <div className="cm-trend">
              {trends.map(t => (
                <div key={t.rank} className={"cm-trend-row" + (t.hot ? " hot" : "")}>
                  <span className="cm-trend-rank">{t.rank}.</span>
                  <span className="cm-trend-tag">{t.tag}</span>
                  <span className="cm-trend-count">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER FEED */}
        <main className="cm-feed">
          {/* Composer */}
          <div className="cm-composer">
            <div className="cm-composer-av">🦋</div>
            <div className="cm-composer-body">
              <input
                className="cm-composer-input"
                placeholder="오늘은 얼마나 아끼셨나요? 자랑해보세요 ✨"
                value={composerText}
                onChange={e => setComposerText(e.target.value)}
              />
              <div className="cm-composer-row">
                <div className="cm-composer-tools">
                  <button className="cm-composer-tool" title="가계부에서 가져오기"><Icon name="wallet" size={15} /></button>
                  <button className="cm-composer-tool" title="이미지 첨부"><Icon name="image" size={15} /></button>
                  <button className="cm-composer-tool" title="태그"><Icon name="tag" size={15} /></button>
                  <button className="cm-composer-tool" title="챌린지 연결"><Icon name="target" size={15} /></button>
                </div>
                <button className="cm-composer-submit" disabled={!composerText.trim()}>
                  인증 올리기
                </button>
              </div>
            </div>
          </div>

          {/* Filter chips */}
          <div className="cm-filter-row">
            <span className="lbl">정렬</span>
            {[["all","전체"],["following","팔로우"],["hot","인기"],["nearby","주변"]].map(([k,l]) => (
              <span key={k} className={"cm-filter-chip" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>{l}</span>
            ))}
          </div>

          {/* Feed posts */}
          {posts.map(p => {
            if (p.kind === "tip") {
              return (
                <div key={p.id} className="cm-tip">
                  <div className="cm-tip-eyebrow">{p.eyebrow}</div>
                  <div className="cm-tip-title">{p.title}</div>
                  <div className="cm-tip-body">{p.body}</div>
                </div>
              );
            }
            return (
              <article key={p.id} className="cm-post">
                <div className="cm-post-head">
                  <div className="cm-post-av" style={{ background: p.author.bg }}>{p.author.avatar}</div>
                  <div className="cm-post-meta">
                    <div className="cm-post-name">
                      {p.author.name}
                      {p.verified && <span className="badge">✓ 가계부 인증</span>}
                    </div>
                    <div className="cm-post-time">
                      {p.time}<span className="sep">·</span>전체공개
                    </div>
                  </div>
                  <button className="cm-post-more"><Icon name="more" size={16} /></button>
                </div>

                <div className="cm-post-body">{p.body}</div>

                {p.highlight && (
                  <div className="cm-highlight">
                    <div className="cm-highlight-emoji">{p.highlight.emoji}</div>
                    <div>
                      <div className="cm-highlight-num">{p.highlight.num}</div>
                      <div className="cm-highlight-lbl">{p.highlight.lbl}</div>
                    </div>
                    <div className="cm-highlight-meta">{p.highlight.meta}</div>
                  </div>
                )}

                {p.receipt && (
                  <div className="cm-receipt">
                    <div className="cm-receipt-row" style={{ justifyContent: "center", fontWeight: 700, paddingBottom: 8 }}>
                      ▼ {p.receipt.title} ▼
                    </div>
                    {p.receipt.rows.map((r, i) => (
                      <div key={i} className="cm-receipt-row">
                        <span>{r[0]}</span>
                        <span>
                          {r[2] && <span className="strike" style={{ marginRight: 6 }}>{r[2]}</span>}
                          {r[1]}
                        </span>
                      </div>
                    ))}
                    <div className="cm-receipt-row total">
                      <span>합계</span>
                      <span>{p.receipt.total}</span>
                    </div>
                    <div className="cm-receipt-row" style={{ color: "#4a8d5a", fontWeight: 600 }}>
                      <span>{p.receipt.target}</span>
                      <span>-₩220,000 ✓</span>
                    </div>
                  </div>
                )}

                {p.images && (
                  <div className={"cm-imggrid g" + p.images}>
                    {Array.from({ length: p.images }).map((_, i) => (
                      <div key={i} className="cm-imggrid-cell placeholder">사진 {i + 1}</div>
                    ))}
                  </div>
                )}

                {p.tags && (
                  <div className="cm-tags">
                    {p.tags.map(t => <span key={t} className="chip">{t}</span>)}
                  </div>
                )}

                <div className="cm-actions">
                  <button className={"cm-action" + (likedIds.has(p.id) ? " on" : "")} onClick={() => toggleLike(p.id)}>
                    <Icon name="heart" size={15} />
                    <span className="count">{p.likes + (likedIds.has(p.id) ? 1 : 0)}</span>
                  </button>
                  <button className="cm-action">
                    <Icon name="msg" size={15} />
                    <span className="count">{p.comments}</span>
                  </button>
                  <button className="cm-action">
                    <Icon name="share" size={15} />
                    <span className="count">{p.shares}</span>
                  </button>
                  <button className={"cm-action share" + (bookmarkedIds.has(p.id) ? " on" : "")} onClick={() => toggleBookmark(p.id)}>
                    <Icon name="bookmark" size={15} />
                  </button>
                </div>
              </article>
            );
          })}
        </main>

        {/* RIGHT RAIL */}
        <aside className="cm-rail">
          {/* Live ranking */}
          <div className="card card-pad">
            <div className="cm-rail-h">
              이번 주 절약 랭킹
              <span className="more">11월 4주차</span>
            </div>
            <div className="cm-lb">
              {ranks.map(r => (
                <div key={r.rank} className={"cm-lb-row" + (r.rank <= 3 ? " top" + r.rank : "") + (r.me ? " me" : "")}>
                  <span className="cm-lb-rank">{r.rank}.</span>
                  <div className="cm-lb-medal">{r.avatar}</div>
                  <div className="cm-lb-meta">
                    <div className="cm-lb-name">{r.name}{r.me && " (나)"}</div>
                    <div className="cm-lb-sub">{r.saved} · {r.streak}일 연속</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini challenges */}
          <div className="card card-pad">
            <div className="cm-rail-h">
              참여 가능한 챌린지
              <span className="more">전체 →</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {challenges.slice(0, 3).map(c => (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: 8, borderRadius: 10, border: "1px solid var(--line)",
                  background: "var(--bg-paper)", cursor: "pointer"
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "var(--card)", border: "1px solid var(--line)",
                    display: "grid", placeItems: "center", fontSize: 16, flexShrink: 0
                  }}>{c.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>{c.title}</div>
                    <div style={{ fontSize: 10, color: "var(--ink-mute)", fontFamily: "var(--mono)" }}>
                      {c.participants.toLocaleString()}명 · {c.days}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="card card-pad" style={{
            background: "var(--ink)", color: "var(--yellow)", borderColor: "var(--ink)"
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>친구 초대하면</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
              ₩5,000 적립
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,226,122,0.7)", lineHeight: 1.5, marginBottom: 12 }}>
              친구가 가입하고 첫 인증하면 둘 다 받아요.
            </div>
            <button style={{
              width: "100%", padding: "9px 0", border: "1px solid var(--yellow)",
              background: "var(--yellow)", color: "var(--ink)",
              borderRadius: 8, fontFamily: "inherit", fontSize: 12, fontWeight: 700, cursor: "pointer"
            }}>초대 링크 복사</button>
          </div>
        </aside>
      </div>

      <div style={{
        marginTop: 32, paddingTop: 18,
        borderTop: "1px dashed var(--line)",
        fontSize: 12, color: "var(--ink-mute)",
        display: "flex", justifyContent: "space-between"
      }}>
        <span>© 2026 Dayflow Community · 절약은 외롭지 않다</span>
        <span>커뮤니티 가이드라인 · 신고하기</span>
      </div>
    </div>
  );
}

window.CommunityPage = CommunityPage;
