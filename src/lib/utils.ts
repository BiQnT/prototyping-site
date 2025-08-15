import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 한국 원화 포맷터
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// 숫자를 천 단위 콤마로 포맷
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

// 퍼센트 포맷터
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// D-Day 계산
export function getDDay(targetDate: Date | string): string {
  const today = new Date();
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  
  if (isNaN(target.getTime())) {
    return '마감일 미정';
  }
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return '마감';
  if (diffDays === 0) return 'D-Day';
  return `D-${diffDays}`;
}

// 날짜 포맷터
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // 유효하지 않은 날짜 체크
  if (!dateObj || isNaN(dateObj.getTime())) {
    return '날짜 미정';
  }
  
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

// 짧은 날짜 포맷터
export function formatShortDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return '--/--/--';
  }
  return new Intl.DateTimeFormat('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

// 상대 시간 포맷터
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!dateObj || isNaN(dateObj.getTime())) {
    return '시간 미정';
  }
  
  const diff = now.getTime() - dateObj.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return '방금 전';
}

// 모집률 계산
export function calculateProgress(sold: number, total: number): number {
  return Math.round((sold / total) * 100);
}

// 연환산 수익률 표시
export function formatAPR(apr: number): string {
  return `연 ${formatPercent(apr)}`;
}

// 농산물 이모지 매핑
export function getCropEmoji(crop: string): string {
  const emojiMap: Record<string, string> = {
    '토마토': '🍅',
    '한라봉': '🍊',
    '샤인머스켓': '🍇',
    '딸기': '🍓',
    '감자': '🥔',
    '사과': '🍎',
    '배': '🍐',
    '복숭아': '🍑',
    '체리': '🍒',
    '바나나': '🍌',
    '수박': '🍉',
    '참외': '🍈'
  };
  return emojiMap[crop] || '🌱';
}

// 위험도 레벨 계산 (APR 기반)
export function getRiskLevel(apr: number): { level: string; color: string; } {
  if (apr <= 8) return { level: '낮음', color: 'text-success' };
  if (apr <= 15) return { level: '보통', color: 'text-warning' };
  return { level: '높음', color: 'text-error' };
}

// 배당 계산 (시뮬레이션)
export function calculateDividend(
  salesAmount: number,
  dividendRate: number,
  totalLots: number,
  myLots: number
): number {
  return (salesAmount * dividendRate / 100 / totalLots) * myLots;
}

// 문자열 자르기
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// 랜덤 ID 생성
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}