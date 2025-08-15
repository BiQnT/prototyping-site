// 농산물 STO 투자 플랫폼 타입 정의

export interface Producer {
  name: string;
  profile: string;
  location: string;
  experience: number;
}

export interface Offering {
  id: string;
  title: string;
  crop: string;
  region: string;
  lotPriceKRW: number;
  lotsTotal: number;
  lotsSold: number;
  expectedAPR: number;
  closeDate: Date;
  settleDate: Date;
  producer: Producer;
  riskNotes: string[];
  timeline: TimelineItem[];
  coverImageURL: string;
  description: string;
  farmingMethod: string;
  expectedYield: number; // kg per lot
  priceAssumptions: {
    farmGatePrice: number; // 농가 수취가
    wholesalePrice: number; // 도매가
    retailPrice: number; // 소매 예상가
  };
}

export interface TimelineItem {
  phase: string;
  description: string;
  expectedDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Investment {
  id: string;
  offeringId: string;
  lots: number;
  amountKRW: number;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Payout {
  id: string;
  offeringId: string;
  period: string; // YYYY-MM
  amountKRW: number;
  createdAt: Date;
  payoutType: 'dividend' | 'principal';
}

export interface WalletTransaction {
  id: string;
  type: '충전' | '출금' | '배당' | '투자' | '환불';
  amountKRW: number;
  createdAt: Date;
  memo: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  totalInvestedKRW: number;
  totalPayoutKRW: number;
  portfolioValueKRW: number;
}

export interface ProducerUpdate {
  id: string;
  offeringId: string;
  salesVolume: number; // kg
  averagePrice: number; // KRW per kg
  updatedAt: Date;
  notes: string;
}

// 필터 및 정렬 옵션
export interface MarketFilters {
  crop?: string;
  region?: string;
  minAPR?: number;
  maxAPR?: number;
  closingSoon?: boolean;
  newOfferings?: boolean;
}

export type SortOption = 'yield_desc' | 'yield_asc' | 'closing_soon' | 'newest' | 'oldest';

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}