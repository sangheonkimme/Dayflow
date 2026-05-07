// ============================================================
// CHECKLIST_SEEDS — 오늘의 할 일 (현실적인 12개 항목 데모)
// ============================================================

import type { ChecklistTask } from '@/types';

export const CHECKLIST_SEEDS: ChecklistTask[] = [
  { id: 1,  text: '디자인 시스템 컬러 토큰 정리',     done: true,  time: '오전 9:30' },
  { id: 2,  text: '아침 스탠드업',                    done: true,  time: '오전 10:00' },
  { id: 3,  text: '메일 답장 (5건)',                  done: true,  time: '오전 10:30' },
  { id: 4,  text: '시안 v3 업로드',                   done: true,  time: '오전 11:00' },
  { id: 5,  text: '점심 약속 — 민지',                 done: false, time: '오후 12:30' },
  { id: 6,  text: '포모도로 1세션 — 카피 정리',       done: false, time: '오후 1:30' },
  { id: 7,  text: '팀 1:1 (지수)',                    done: false, time: '오후 3:00' },
  { id: 8,  text: '프로젝트 회고 작성',               done: false, time: '오후 4:30' },
  { id: 9,  text: '운동 — 헬스장',                    done: false, time: '오후 6:30' },
  { id: 10, text: '장보기 (우유, 빵, 과일)',          done: false, time: '오후 7:30' },
  { id: 11, text: '집에서 책 30분',                   done: false, time: '밤 10:00' },
  { id: 12, text: '내일 일정 미리 보기',              done: false, time: '밤 10:30' },
];
