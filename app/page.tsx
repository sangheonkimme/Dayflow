// Phase 1 placeholder. Phase 2 에서 LandingPage 를 RSC + 인터랙티브 클라이언트
// 컴포넌트로 분리해 이식 예정. 지금은 빈 Next 셸이 떠있는지 확인용.

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
        color: "#1f1d18",
        background: "#efe9dc",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 48, marginBottom: 12 }}>Dayflow</h1>
        <p style={{ color: "#8a8479" }}>
          Next.js 셸 부트스트랩 — Phase 1 placeholder.
          <br />
          Phase 2 에서 라우트별 페이지 이식이 진행됩니다.
        </p>
      </div>
    </main>
  );
}
