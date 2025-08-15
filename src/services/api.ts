// 모킹 API 서비스
import { 
  Offering, 
  Investment, 
  Payout, 
  WalletTransaction, 
  UserProfile,
  MarketFilters,
  SortOption,
  ApiResponse,
  PaginatedResponse
} from '@/types';
import { 
  STORAGE_KEYS, 
  initializeData,
  generateOfferingSeed,
  generateSampleInvestments,
  generateSamplePayouts,
  generateSampleWalletTransactions,
  defaultUserProfile,
  initialWalletBalance
} from '@/data/seedData';
import { generateId } from '@/lib/utils';

// 로컬 스토리지 헬퍼 함수들
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Storage save failed:', error);
  }
}

// 데이터 초기화
initializeData();

// 지연 시뮬레이션
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 공모 관련 API
export const offeringsApi = {
  // 전체 공모 목록 조회 (필터링, 정렬 지원)
  async getOfferings(
    filters: MarketFilters = {},
    sort: SortOption = 'newest',
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Offering>> {
    await delay(300);
    
    let offerings = getFromStorage<Offering[]>(STORAGE_KEYS.OFFERINGS, generateOfferingSeed());
    
    // 날짜 필드를 Date 객체로 변환
    offerings = offerings.map(offering => ({
      ...offering,
      closeDate: new Date(offering.closeDate),
      settleDate: new Date(offering.settleDate),
      timeline: offering.timeline.map(item => ({
        ...item,
        expectedDate: new Date(item.expectedDate)
      }))
    }));
    
    // 필터링
    if (filters.crop) {
      offerings = offerings.filter(o => o.crop === filters.crop);
    }
    if (filters.region) {
      offerings = offerings.filter(o => o.region === filters.region);
    }
    if (filters.minAPR) {
      offerings = offerings.filter(o => o.expectedAPR >= filters.minAPR);
    }
    if (filters.maxAPR) {
      offerings = offerings.filter(o => o.expectedAPR <= filters.maxAPR);
    }
    if (filters.closingSoon) {
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      offerings = offerings.filter(o => new Date(o.closeDate) <= threeDaysFromNow);
    }
    if (filters.newOfferings) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      offerings = offerings.filter(o => new Date(o.closeDate) >= sevenDaysAgo);
    }
    
    // 정렬
    switch (sort) {
      case 'yield_desc':
        offerings.sort((a, b) => b.expectedAPR - a.expectedAPR);
        break;
      case 'yield_asc':
        offerings.sort((a, b) => a.expectedAPR - b.expectedAPR);
        break;
      case 'closing_soon':
        offerings.sort((a, b) => new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime());
        break;
      case 'newest':
        offerings.sort((a, b) => new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime());
        break;
      case 'oldest':
        offerings.sort((a, b) => new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime());
        break;
    }
    
    // 페이지네이션
    const total = offerings.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOfferings = offerings.slice(startIndex, endIndex);
    
    return {
      data: paginatedOfferings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  // 단일 공모 상세 조회
  async getOffering(id: string): Promise<ApiResponse<Offering | null>> {
    await delay(200);
    
    const offerings = getFromStorage<Offering[]>(STORAGE_KEYS.OFFERINGS, generateOfferingSeed());
    const offering = offerings.find(o => o.id === id);
    
    // 날짜 필드가 문자열인 경우 Date 객체로 변환
    if (offering) {
      const convertedOffering = {
        ...offering,
        closeDate: typeof offering.closeDate === 'string' ? new Date(offering.closeDate) : offering.closeDate,
        settleDate: typeof offering.settleDate === 'string' ? new Date(offering.settleDate) : offering.settleDate,
        timeline: offering.timeline.map(item => ({
          ...item,
          expectedDate: typeof item.expectedDate === 'string' ? new Date(item.expectedDate) : item.expectedDate
        }))
      };
      
      return {
        data: convertedOffering,
        success: true
      };
    }
    
    return {
      data: null,
      success: true,
      message: '공모를 찾을 수 없습니다.'
    };
  },

  // 인기 공모 조회 (랜딩용)
  async getFeaturedOfferings(): Promise<ApiResponse<Offering[]>> {
    await delay(200);
    
    let offerings = getFromStorage<Offering[]>(STORAGE_KEYS.OFFERINGS, generateOfferingSeed());
    
    // 날짜 필드를 Date 객체로 변환
    offerings = offerings.map(offering => ({
      ...offering,
      closeDate: new Date(offering.closeDate),
      settleDate: new Date(offering.settleDate),
      timeline: offering.timeline.map(item => ({
        ...item,
        expectedDate: new Date(item.expectedDate)
      }))
    }));
    
    // 모집률이 높고 마감이 임박한 순으로 정렬하여 상위 3개 선택
    const featured = offerings
      .sort((a, b) => {
        const progressA = (a.lotsSold / a.lotsTotal) * 100;
        const progressB = (b.lotsSold / b.lotsTotal) * 100;
        return progressB - progressA;
      })
      .slice(0, 3);
    
    return {
      data: featured,
      success: true
    };
  }
};

// 투자 관련 API
export const investmentsApi = {
  // 투자하기 (모의)
  async createInvestment(
    offeringId: string, 
    lots: number
  ): Promise<ApiResponse<Investment>> {
    await delay(1000); // 결제 시뮬레이션
    
    const offerings = getFromStorage<Offering[]>(STORAGE_KEYS.OFFERINGS, generateOfferingSeed());
    const offering = offerings.find(o => o.id === offeringId);
    
    if (!offering) {
      return {
        data: null as any,
        success: false,
        message: '공모를 찾을 수 없습니다.'
      };
    }
    
    const amount = offering.lotPriceKRW * lots;
    const currentBalance = parseInt(localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE) || '0');
    
    if (currentBalance < amount) {
      return {
        data: null as any,
        success: false,
        message: '지갑 잔액이 부족합니다.'
      };
    }
    
    // 투자 기록 생성
    const investment: Investment = {
      id: generateId(),
      offeringId,
      lots,
      amountKRW: amount,
      createdAt: new Date(),
      status: 'confirmed'
    };
    
    // 투자 내역 저장
    const investments = getFromStorage<Investment[]>(STORAGE_KEYS.INVESTMENTS, []);
    investments.push(investment);
    saveToStorage(STORAGE_KEYS.INVESTMENTS, investments);
    
    // 공모 판매량 업데이트
    offering.lotsSold += lots;
    saveToStorage(STORAGE_KEYS.OFFERINGS, offerings);
    
    // 지갑 잔액 차감
    const newBalance = currentBalance - amount;
    saveToStorage(STORAGE_KEYS.WALLET_BALANCE, newBalance.toString());
    
    // 지갑 거래 내역 추가
    const walletTx: WalletTransaction = {
      id: generateId(),
      type: '투자',
      amountKRW: -amount,
      createdAt: new Date(),
      memo: `${offering.title} (${lots}구좌)`,
      status: 'completed'
    };
    
    const transactions = getFromStorage<WalletTransaction[]>(STORAGE_KEYS.WALLET_TRANSACTIONS, []);
    transactions.unshift(walletTx);
    saveToStorage(STORAGE_KEYS.WALLET_TRANSACTIONS, transactions);
    
    return {
      data: investment,
      success: true,
      message: '투자가 완료되었습니다.'
    };
  },

  // 내 투자 목록 조회
  async getMyInvestments(): Promise<ApiResponse<Investment[]>> {
    await delay(200);
    
    const investments = getFromStorage<Investment[]>(STORAGE_KEYS.INVESTMENTS, generateSampleInvestments());
    
    // 날짜 필드를 Date 객체로 변환
    const convertedInvestments = investments.map(investment => ({
      ...investment,
      createdAt: new Date(investment.createdAt)
    }));
    
    return {
      data: convertedInvestments,
      success: true
    };
  }
};

// 배당 관련 API
export const payoutsApi = {
  // 배당 내역 조회
  async getPayouts(): Promise<ApiResponse<Payout[]>> {
    await delay(200);
    
    const payouts = getFromStorage<Payout[]>(STORAGE_KEYS.PAYOUTS, generateSamplePayouts());
    
    return {
      data: payouts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      success: true
    };
  },

  // 배당 시뮬레이션 생성 (프로듀서 대시보드용)
  async simulatePayout(
    offeringId: string,
    salesVolume: number,
    averagePrice: number
  ): Promise<ApiResponse<Payout>> {
    await delay(500);
    
    const offerings = getFromStorage<Offering[]>(STORAGE_KEYS.OFFERINGS, []);
    const offering = offerings.find(o => o.id === offeringId);
    
    if (!offering) {
      return {
        data: null as any,
        success: false,
        message: '공모를 찾을 수 없습니다.'
      };
    }
    
    // 배당 계산 (판매금액의 10%를 배당률로 가정)
    const totalSales = salesVolume * averagePrice;
    const dividendPool = totalSales * 0.1; // 10% 배당
    const dividendPerLot = dividendPool / offering.lotsTotal;
    
    // 현재 월 배당 생성
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const payout: Payout = {
      id: generateId(),
      offeringId,
      period: currentMonth,
      amountKRW: Math.round(dividendPerLot),
      createdAt: new Date(),
      payoutType: 'dividend'
    };
    
    const payouts = getFromStorage<Payout[]>(STORAGE_KEYS.PAYOUTS, []);
    payouts.push(payout);
    saveToStorage(STORAGE_KEYS.PAYOUTS, payouts);
    
    return {
      data: payout,
      success: true,
      message: '배당이 시뮬레이션되었습니다.'
    };
  }
};

// 지갑 관련 API
export const walletApi = {
  // 잔액 조회
  async getBalance(): Promise<ApiResponse<number>> {
    await delay(100);
    
    const balance = parseInt(localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE) || '0');
    
    return {
      data: balance,
      success: true
    };
  },

  // 거래 내역 조회
  async getTransactions(): Promise<ApiResponse<WalletTransaction[]>> {
    await delay(200);
    
    const transactions = getFromStorage<WalletTransaction[]>(
      STORAGE_KEYS.WALLET_TRANSACTIONS, 
      generateSampleWalletTransactions()
    );
    
    return {
      data: transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      success: true
    };
  },

  // 충전하기 (모의)
  async deposit(amount: number): Promise<ApiResponse<WalletTransaction>> {
    await delay(800); // 결제 시뮬레이션
    
    const currentBalance = parseInt(localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE) || '0');
    const newBalance = currentBalance + amount;
    
    saveToStorage(STORAGE_KEYS.WALLET_BALANCE, newBalance.toString());
    
    const transaction: WalletTransaction = {
      id: generateId(),
      type: '충전',
      amountKRW: amount,
      createdAt: new Date(),
      memo: '모의 충전',
      status: 'completed'
    };
    
    const transactions = getFromStorage<WalletTransaction[]>(STORAGE_KEYS.WALLET_TRANSACTIONS, []);
    transactions.unshift(transaction);
    saveToStorage(STORAGE_KEYS.WALLET_TRANSACTIONS, transactions);
    
    return {
      data: transaction,
      success: true,
      message: '충전이 완료되었습니다.'
    };
  },

  // 출금하기 (모의)
  async withdraw(amount: number): Promise<ApiResponse<WalletTransaction>> {
    await delay(800);
    
    const currentBalance = parseInt(localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE) || '0');
    
    if (currentBalance < amount) {
      return {
        data: null as any,
        success: false,
        message: '잔액이 부족합니다.'
      };
    }
    
    const newBalance = currentBalance - amount;
    saveToStorage(STORAGE_KEYS.WALLET_BALANCE, newBalance.toString());
    
    const transaction: WalletTransaction = {
      id: generateId(),
      type: '출금',
      amountKRW: -amount,
      createdAt: new Date(),
      memo: '모의 출금',
      status: 'completed'
    };
    
    const transactions = getFromStorage<WalletTransaction[]>(STORAGE_KEYS.WALLET_TRANSACTIONS, []);
    transactions.unshift(transaction);
    saveToStorage(STORAGE_KEYS.WALLET_TRANSACTIONS, transactions);
    
    return {
      data: transaction,
      success: true,
      message: '출금이 완료되었습니다.'
    };
  }
};

// 사용자 프로필 API
export const userApi = {
  // 프로필 조회
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    await delay(100);
    
    const profile = getFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, defaultUserProfile);
    
    return {
      data: profile,
      success: true
    };
  },

  // 프로필 업데이트
  async updateProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    await delay(300);
    
    const currentProfile = getFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, defaultUserProfile);
    const updatedProfile = { ...currentProfile, ...updates };
    
    saveToStorage(STORAGE_KEYS.USER_PROFILE, updatedProfile);
    
    return {
      data: updatedProfile,
      success: true,
      message: '프로필이 업데이트되었습니다.'
    };
  }
};

// 포트폴리오 계산 유틸리티
export async function calculatePortfolioSummary() {
  const investments = await investmentsApi.getMyInvestments();
  const payouts = await payoutsApi.getPayouts();
  const offeringsResponse = await offeringsApi.getOfferings();
  
  if (!investments.success || !payouts.success) {
    return {
      totalInvested: 0,
      currentValue: 0,
      totalPayouts: 0,
      expectedMonthlyPayout: 0
    };
  }
  
  const totalInvested = investments.data.reduce((sum, inv) => sum + inv.amountKRW, 0);
  const totalPayouts = payouts.data.reduce((sum, payout) => sum + payout.amountKRW, 0);
  
  // 현재 가치는 투자금액과 동일하다고 가정 (실제로는 더 복잡한 평가가 필요)
  const currentValue = totalInvested;
  
  // 예상 월 배당은 연 수익률의 1/12로 계산
  const expectedMonthlyPayout = investments.data.reduce((sum, inv) => {
    const offering = offeringsResponse.data.find(o => o.id === inv.offeringId);
    if (offering) {
      const monthlyReturn = (inv.amountKRW * offering.expectedAPR / 100) / 12;
      return sum + monthlyReturn;
    }
    return sum;
  }, 0);
  
  return {
    totalInvested,
    currentValue,
    totalPayouts,
    expectedMonthlyPayout
  };
}