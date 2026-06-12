// 설정 > 데이터 내보내기 유틸 — 순수 함수(브라우저 전용 다운로드 트리거 포함).
// 도메인 데이터는 호출부(DataSection)에서 훅으로 모아 넘긴다.

import type { Txn } from "@/types";

/** CSV 셀 이스케이프 — 콤마/따옴표/줄바꿈 포함 시 큰따옴표로 감싸고 내부 따옴표는 중복 처리. */
const csvCell = (value: unknown): string => {
  const s = value == null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** 가계부(거래내역) → CSV 문자열. Excel 한글 깨짐 방지용 BOM 포함. */
export const buildTransactionsCsv = (txns: readonly Txn[]): string => {
  const headers = [
    "날짜",
    "시간",
    "구분",
    "내용",
    "카테고리",
    "결제수단",
    "금액",
    "메모",
  ];
  const rows = txns.map((t) =>
    [
      t.date,
      t.time ?? "",
      t.type === "in" ? "수입" : "지출",
      t.label,
      t.cat ?? "",
      t.pay ?? "",
      t.amount,
      t.memo ?? t.note ?? "",
    ]
      .map(csvCell)
      .join(","),
  );
  return "﻿" + [headers.join(","), ...rows].join("\r\n");
};

/** 전체 데이터 → 정렬된 JSON 문자열(버전/시각 메타 포함). */
export const buildFullExportJson = (payload: Record<string, unknown>): string =>
  JSON.stringify(
    { version: 1, exportedAt: new Date().toISOString(), data: payload },
    null,
    2,
  );

/** 문자열 콘텐츠를 파일로 다운로드. */
export const triggerDownload = (
  filename: string,
  content: string,
  mime: string,
): void => {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

/** "dayflow-export-YYYY-MM-DD.ext" 형태 파일명 생성. */
export const exportFilename = (base: string, ext: string): string => {
  const date = new Date().toISOString().slice(0, 10);
  return `${base}-${date}.${ext}`;
};
