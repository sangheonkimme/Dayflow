import { SettingRow } from "@/screens/settings/SettingRow";
import { ToggleSwitch } from "@/screens/settings/ToggleSwitch";

export const LedgerSettingsSection = ({ tweaks, setTweak }: any) => {
  const payday = tweaks.payday || 25;
  const paydayType = tweaks.paydayType || "fixed";
  const currency = tweaks.currency || "KRW";
  const startDay = tweaks.cycleStart || "payday";
  return (
    <>
      <div className="settings-group">
        <h3>월급일 · 가계부 주기</h3>
        <SettingRow label="월급일 유형" sub="실제 입금 패턴에 맞춰 선택하세요">
          <select
            className="set-input"
            value={paydayType}
            onChange={(e) => setTweak("paydayType", e.target.value)}
          >
            <option value="fixed">매월 고정일</option>
            <option value="lastDay">매월 말일</option>
            <option value="firstDay">매월 1일</option>
            <option value="custom">사용자 지정</option>
          </select>
        </SettingRow>
        {paydayType === "fixed" && (
          <SettingRow
            label="월급일 (매월)"
            sub="이 날짜를 기준으로 D-day와 가계부 주기가 계산돼요"
          >
            <div className="payday-pick">
              <input
                type="number"
                min="1"
                max="31"
                className="set-input"
                style={{
                  minWidth: 80,
                  textAlign: "center",
                  fontFamily: "var(--mono)",
                  fontWeight: 700,
                }}
                value={payday}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 1 && v <= 31) setTweak("payday", v);
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  fontWeight: 600,
                }}
              >
                일
              </span>
            </div>
          </SettingRow>
        )}
        <SettingRow label="가계부 주기 시작일" sub="한 달 통계의 시작점">
          <select
            className="set-input"
            value={startDay}
            onChange={(e) => setTweak("cycleStart", e.target.value)}
          >
            <option value="payday">월급일 기준</option>
            <option value="1st">매월 1일</option>
            <option value="custom">사용자 지정</option>
          </select>
        </SettingRow>
        <SettingRow label="주말일 때 처리" sub="월급일이 주말/공휴일이면" comingSoon>
          <select className="set-input" defaultValue="prev">
            <option value="prev">앞당겨서 입금</option>
            <option value="next">뒤로 미뤄서 입금</option>
            <option value="exact">그대로 표시</option>
          </select>
        </SettingRow>
      </div>

      <div className="settings-group">
        <h3>예산 · 한도</h3>
        <SettingRow label="월 예산 알림" sub="예산의 80% 도달 시 알림" comingSoon>
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="기본 통화">
          <select
            className="set-input"
            value={currency}
            onChange={(e) => setTweak("currency", e.target.value)}
          >
            <option value="KRW">원 (₩)</option>
            <option value="USD">달러 ($)</option>
            <option value="JPY">엔 (¥)</option>
            <option value="EUR">유로 (€)</option>
          </select>
        </SettingRow>
        <SettingRow label="천 단위 표기" sub="₩1,000,000 vs 1백만" comingSoon>
          <select className="set-input" defaultValue="comma">
            <option value="comma">콤마 (1,000,000)</option>
            <option value="korean">한글 (1백만)</option>
            <option value="short">단축 (1M)</option>
          </select>
        </SettingRow>
      </div>

      <div className="settings-group">
        <h3>카테고리 · 자동 분류</h3>
        <SettingRow
          label="자동 카테고리 인식"
          sub="가맹점명으로 카테고리 자동 분류"
          comingSoon
        >
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow
          label="정기 결제 자동 등록"
          sub="동일 금액 반복 시 구독으로 추정"
          comingSoon
        >
          <ToggleSwitch on={true} />
        </SettingRow>
        <SettingRow label="카테고리 관리" comingSoon>
          <button className="timer-btn">편집</button>
        </SettingRow>
      </div>
    </>
  );
};
