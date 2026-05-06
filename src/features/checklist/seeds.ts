// ============================================================
// CHECKLIST_SEEDS — extracted from notes.tsx Checklist
// Mobile uses {text, tag, done} shape; we normalize to ChecklistTask.
// Mobile-specific 'tag' is preserved on the task as `time` fallback —
// the desktop Checklist already uses `time`. For mobile we'll display
// a static "할 일" tag if no time present.
// ============================================================

import type { ChecklistTask } from '@/types';

export const CHECKLIST_SEEDS: ChecklistTask[] = [
  { id: 1, text: '디자인 시스템 컬러 토큰 정리', done: true,  time: '오전 10:00' },
  { id: 2, text: '스티커 메모 컴포넌트 리팩토링', done: true,  time: '오전 11:30' },
  { id: 3, text: '포모도로 — 1세션',            done: false, time: '오후 1:00' },
  { id: 4, text: '팀 스탠드업',                 done: false, time: '오후 3:00' },
  { id: 5, text: '장보기 (우유, 빵)',           done: false, time: '오후 7:00' },
];
