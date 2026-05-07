// @ts-nocheck
import { useState, useEffect } from "react";
import { Ico } from "@/pages/mobile/shared/ico";
import { DfmSwitch } from "@/pages/mobile/shared/dfm-switch";

export const TimerSettingsSheet = ({ open, onClose, settings, onChange }) => {
  if (!settings) settings = { focus: 25, shortBreak: 5, longBreak: 15, sets: 4, sound: "차임", autoStart: false, vibrate: true };
  const set = (k, v) => onChange?.({ ...settings, [k]: v });
  const sounds = ["기본", "차임", "조약돌", "물방울", "무음"];
  const minutes = [15, 20, 25, 30, 45, 50, 60];
  const breakOpts = [3, 5, 10, 15];
  const longBreakOpts = [10, 15, 20, 30];
  const setsOpts = [2, 3, 4, 5, 6];

  const Row = ({ label, sub, children }) => (
    <div style={{ padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: sub || children ? 8 : 0 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      {children}
    </div>
  );

  const Chip = ({ active, onClick, children }) => (
    <button onClick={onClick}
      style={{
        padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600,
        border: "1px solid " + (active ? "var(--ink)" : "var(--line)"),
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--bg-paper)" : "var(--ink)",
        cursor: "pointer", fontFamily: "var(--mono)",
      }}>{children}</button>
  );

  return (
    <>
      <div className={`dfm-sheet-scrim ${open ? "on" : ""}`} onClick={onClose} />
      <div className={`dfm-sheet ${open ? "on" : ""}`}>
        <div className="dfm-sheet-grip" />
        <div className="dfm-sheet-head">
          <div className="ttl">타이머 설정<small>뽀모도로 · 알림</small></div>
          <button className="close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="dfm-sheet-body" style={{ padding: "0 18px 22px" }}>
          {/* Big preview pill */}
          <div style={{ background: "var(--yellow)", border: "1px solid var(--yellow-edge)", borderRadius: 14, padding: "16px 18px", margin: "6px 0 12px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", fontWeight: 600 }}>1세트 흐름</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                집중 {settings.focus}분 · 휴식 {settings.shortBreak}분
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 2 }}>
                {settings.sets}세트 후 긴 휴식 {settings.longBreak}분
              </div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--ink)", color: "var(--bg-paper)", display: "grid", placeItems: "center" }}>
              <Ico name="play" size={16} />
            </div>
          </div>

          <Row label="집중 시간" sub="한 세트당 몰입 시간 (분)">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {minutes.map(m => <Chip key={m} active={settings.focus === m} onClick={() => set("focus", m)}>{m}분</Chip>)}
            </div>
          </Row>

          <Row label="짧은 휴식" sub="세트 사이 휴식">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {breakOpts.map(m => <Chip key={m} active={settings.shortBreak === m} onClick={() => set("shortBreak", m)}>{m}분</Chip>)}
            </div>
          </Row>

          <Row label="긴 휴식" sub={`${settings.sets}세트 후`}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {longBreakOpts.map(m => <Chip key={m} active={settings.longBreak === m} onClick={() => set("longBreak", m)}>{m}분</Chip>)}
            </div>
          </Row>

          <Row label="세트 수" sub="긴 휴식까지 반복할 횟수">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {setsOpts.map(m => <Chip key={m} active={settings.sets === m} onClick={() => set("sets", m)}>{m}</Chip>)}
            </div>
          </Row>

          <Row label="알림 소리">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {sounds.map(s => <Chip key={s} active={settings.sound === s} onClick={() => set("sound", s)}>{s}</Chip>)}
            </div>
          </Row>

          {/* Toggles */}
          {[
            ["autoStart", "자동 시작", "휴식이 끝나면 다음 세트를 자동으로 시작"],
            ["vibrate",   "진동",       "소리와 함께 진동 알림"],
          ].map(([key, ttl, sub]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px dashed var(--line)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{ttl}</div>
                <div style={{ fontSize: 11, color: "var(--ink-mute)", marginTop: 2 }}>{sub}</div>
              </div>
              <button onClick={() => set(key, !settings[key])} aria-pressed={settings[key]}
                style={{
                  width: 44, height: 26, borderRadius: 999,
                  border: "1px solid " + (settings[key] ? "var(--ink)" : "var(--line)"),
                  background: settings[key] ? "var(--ink)" : "transparent",
                  padding: 0, cursor: "pointer", position: "relative", flexShrink: 0,
                }}>
                <span style={{
                  position: "absolute", top: 2, left: settings[key] ? 20 : 2,
                  width: 20, height: 20, borderRadius: "50%",
                  background: settings[key] ? "var(--bg-paper)" : "var(--ink-mute)",
                  transition: "left .15s",
                }} />
              </button>
            </div>
          ))}

          {/* actions */}
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button onClick={() => onChange?.({ focus: 25, shortBreak: 5, longBreak: 15, sets: 4, sound: "차임", autoStart: false, vibrate: true })}
              style={{ flex: 1, padding: "14px 0", borderRadius: 12, border: "1px solid var(--line)", background: "transparent", color: "var(--ink-mute)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              초기화
            </button>
            <button onClick={onClose}
              style={{ flex: 2, padding: "14px 0", borderRadius: 12, border: "none", background: "var(--ink)", color: "var(--bg-paper)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              저장하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

