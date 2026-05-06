// ============================================================
// POST_SEEDS / COMMENT_SEEDS — community feed (mobile-app.tsx)
// Post.stat is stored as the formatted display string ("12일 누적 ₩54,000")
// per the canonical Post type.
// ============================================================

import type { Post, Comment } from '@/data/seeds/types';

export const POST_SEEDS: Post[] = [
  {
    id: 'p1',
    author: '절약왕민지',
    avatar: '🌱',
    tag: '#11월무지출',
    time: '2시간 전',
    title: '오늘도 무지출 성공!',
    body: '회사 도시락 + 집에서 저녁 해먹기. 5일 연속이에요. 처음엔 힘들었는데 이제 습관이 되어가요 ☺️',
    stat: '오늘 지출 ₩0',
    likes: 142,
    comments: 18,
    badge: '🔥 5일 연속',
  },
  {
    id: 'p2',
    author: '커피요정',
    avatar: '☕',
    tag: '#커피값모으기',
    time: '5시간 전',
    title: '12일째 적금 인증',
    body: '스타벅스 대신 회사 커피머신. 오늘까지 ₩54,000 모았어요!',
    stat: '12일 누적 ₩54,000',
    likes: 89,
    comments: 12,
  },
  {
    id: 'p3',
    author: '지출체크',
    avatar: '📒',
    tag: '#가계부공유',
    time: '어제',
    title: '10월 결산 — 처음으로 +₩50만',
    body: '월급 받자마자 자동이체 + 주간 예산 ₩100,000 룰 지킨 결과예요. 다음 달은 +₩60만 도전!',
    stat: '10월 잔고 +₩523,000',
    likes: 256,
    comments: 41,
    badge: '🏆 베스트',
  },
  {
    id: 'p4',
    author: '구독정리꾼',
    avatar: '✂️',
    tag: '#구독다이어트',
    time: '2일 전',
    title: '안 쓰던 구독 4개 해지함',
    body: '넷플릭스, 멜론, 클라우드, 운동앱 — 다 해지하고 ₩47,000 절약. 진짜 필요한 것만 남기니 후련해요.',
    stat: '월 절약액 -₩47,000',
    likes: 178,
    comments: 24,
  },
];

export const COMMENT_SEEDS: Comment[] = [
  { id: 'c-p1-1', postId: 'p1', author: '단호박', avatar: '🎃', time: '2시간 전', body: '와 5일째 진짜 대단해요 👏', likes: 12 },
  { id: 'c-p1-2', postId: 'p1', author: '햇님',   avatar: '☀️', time: '1시간 전', body: '텀블러 같이 챙겨야겠어요!',     likes: 8 },
  { id: 'c-p1-3', postId: 'p1', author: '구름이', avatar: '☁️', time: '32분 전',  body: '저도 도전해볼게요',             likes: 3 },
  { id: 'c-p2-1', postId: 'p2', author: '초록이', avatar: '🌱', time: '3시간 전', body: '금액이 진짜 크네요 ㄷㄷ',         likes: 24 },
  { id: 'c-p2-2', postId: 'p2', author: '달님',   avatar: '🌙', time: '2시간 전', body: '도시락 메뉴 공유해주세요!',       likes: 14 },
  { id: 'c-p3-1', postId: 'p3', author: '별빛',   avatar: '✨', time: '5시간 전', body: '구독 정리 진짜 답이에요',         likes: 18 },
  { id: 'c-p4-1', postId: 'p4', author: '바다',   avatar: '🌊', time: '어제',     body: '배달은 진짜 무서워요…',           likes: 7 },
];
