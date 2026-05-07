// ============================================================
// DAILY_LOG_SEEDS — 최근 30일 (mood/oneLine 다양하게)
// ============================================================

import type { DailyLog, Mood } from '@/shared/data/seeds/types';

const today = new Date();
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const moods: Mood[] = ['fire', 'happy', 'calm', 'happy', 'sleepy', 'fire', 'tired', 'calm', 'happy', 'fire'];
const lines = [
  '디자인 시안 미팅 잘 끝났다. 오후엔 카피 정리만 하면 끝!',
  '운동 다녀와서 머리가 맑아졌다. 작업 집중 잘 됨.',
  '커피 너무 많이 마셨나? 잠이 안 와...',
  '오늘 팀 분위기 좋았다. 신규 프로젝트 킥오프.',
  '비 와서 우울. 책이나 읽자.',
  '오랜만에 친구랑 저녁. 즐거웠다.',
  '월요일이라 그런가 피곤하다. 일찍 자야지.',
  '코드 리뷰 통과! 작은 성취가 즐거워.',
  '주말 잘 보냈다. 다음 주도 화이팅.',
  '차분한 하루. 책 한 권 다 읽었다.',
  '점심에 먹은 비빔밥이 진짜였다.',
  '회의 너무 많아서 정작 일은 못 함.',
  '날씨 좋아서 산책. 머리가 깨끗해졌다.',
];

const seeds: DailyLog[] = [];
for (let i = 0; i < 30; i++) {
  const d = new Date(today);
  d.setDate(today.getDate() - i);
  const id = ymd(d);
  seeds.push({
    id,
    date: id,
    mood: moods[i % moods.length] as Mood,
    oneLine: lines[i % lines.length] as string,
  });
}

export const DAILY_LOG_SEEDS: DailyLog[] = seeds;
