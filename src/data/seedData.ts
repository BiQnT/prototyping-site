import { Offering, Investment, Payout, WalletTransaction, UserProfile } from '@/types';
import { generateId } from '@/lib/utils';

// 시드 데이터 생성 함수들

export function generateOfferingSeed(): Offering[] {
  const baseDate = new Date();
  
  return [
    {
      id: 'offering-1',
      title: '제주 하우스 토마토 겨울작 투자',
      crop: '토마토',
      region: '제주',
      lotPriceKRW: 50000,
      lotsTotal: 500,
      lotsSold: 358,
      expectedAPR: 12.5,
      closeDate: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000), // 14일 후
      settleDate: new Date(baseDate.getTime() + 180 * 24 * 60 * 60 * 1000), // 6개월 후
      producer: {
        name: '김농부',
        profile: '30년 경력의 토마토 재배 전문가',
        location: '제주시 한림읍',
        experience: 30
      },
      riskNotes: [
        '기상 악화로 인한 수확량 감소 위험',
        '시장 가격 변동에 따른 수익성 변화',
        '병충해 발생 가능성'
      ],
      timeline: [
        {
          phase: '파종 및 재배',
          description: '우수 품종 토마토 모종 정식 및 초기 관리',
          expectedDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          phase: '생육 관리',
          description: '영양 관리 및 병충해 방제',
          expectedDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000),
          status: 'in-progress'
        },
        {
          phase: '수확',
          description: '최적 숙도 토마토 수확',
          expectedDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          phase: '판매 및 정산',
          description: '도매시장 출하 및 투자자 배당 지급',
          expectedDate: new Date(baseDate.getTime() + 120 * 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ],
      coverImageURL: '/api/placeholder/tomato-farm',
      description: '제주 청정 지역에서 재배되는 프리미엄 토마토입니다. 하우스 시설을 통한 연중 재배로 안정적인 수확량을 보장합니다.',
      farmingMethod: '친환경 하우스 재배',
      expectedYield: 25, // kg per lot
      priceAssumptions: {
        farmGatePrice: 1800, // 원/kg
        wholesalePrice: 2500, // 원/kg
        retailPrice: 4000 // 원/kg
      }
    },
    {
      id: 'offering-2',
      title: '완도 한라봉 프리미엄 투자',
      crop: '한라봉',
      region: '완도',
      lotPriceKRW: 80000,
      lotsTotal: 300,
      lotsSold: 189,
      expectedAPR: 15.8,
      closeDate: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      settleDate: new Date(baseDate.getTime() + 150 * 24 * 60 * 60 * 1000), // 5개월 후
      producer: {
        name: '박과수',
        profile: '25년 감귤류 재배 전문, 완도군 우수농업인',
        location: '완도군 생일면',
        experience: 25
      },
      riskNotes: [
        '한파로 인한 동해 피해 가능성',
        '당도 기준 미달 시 가격 하락',
        '출하 시기 집중으로 인한 가격 변동'
      ],
      timeline: [
        {
          phase: '과실 비대',
          description: '한라봉 열매 크기 증가 및 당도 축적',
          expectedDate: new Date(baseDate.getTime() - 60 * 24 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          phase: '착색 및 성숙',
          description: '과실 착색 진행 및 당도 상승',
          expectedDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000),
          status: 'in-progress'
        },
        {
          phase: '수확',
          description: '당도 13도 이상 한라봉 수확',
          expectedDate: new Date(baseDate.getTime() + 60 * 24 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          phase: '선별 및 판매',
          description: '크기별 선별 후 프리미엄 시장 출하',
          expectedDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ],
      coverImageURL: '/api/placeholder/hallabong-farm',
      description: '완도의 따뜻한 기후에서 자란 프리미엄 한라봉입니다. 높은 당도와 뛰어난 품질로 시장에서 인정받고 있습니다.',
      farmingMethod: '친환경 노지 재배',
      expectedYield: 30, // kg per lot
      priceAssumptions: {
        farmGatePrice: 3500, // 원/kg
        wholesalePrice: 5000, // 원/kg
        retailPrice: 8000 // 원/kg
      }
    },
    {
      id: 'offering-3',
      title: '김천 샤인머스켓 고급품 투자',
      crop: '샤인머스켓',
      region: '김천',
      lotPriceKRW: 120000,
      lotsTotal: 200,
      lotsSold: 87,
      expectedAPR: 18.2,
      closeDate: new Date(baseDate.getTime() + 21 * 24 * 60 * 60 * 1000), // 21일 후
      settleDate: new Date(baseDate.getTime() + 240 * 24 * 60 * 60 * 1000), // 8개월 후
      producer: {
        name: '이포도',
        profile: '샤인머스켓 재배 15년, 농촌진흥청 인증 우수농가',
        location: '김천시 대덕면',
        experience: 15
      },
      riskNotes: [
        '장마철 병해 발생 위험',
        '고급품 시장 수요 변동성',
        '수확 시기 조절 실패 시 품질 저하'
      ],
      timeline: [
        {
          phase: '새순 관리',
          description: '샤인머스켓 새순 정리 및 순지르기',
          expectedDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          phase: '송이 솎기',
          description: '품질 향상을 위한 송이 솎기 작업',
          expectedDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          phase: '수확',
          description: '당도 18도 이상 샤인머스켓 수확',
          expectedDate: new Date(baseDate.getTime() + 180 * 24 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          phase: '프리미엄 판매',
          description: '백화점 및 고급 유통망 출하',
          expectedDate: new Date(baseDate.getTime() + 210 * 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ],
      coverImageURL: '/api/placeholder/shine-muscat-farm',
      description: '김천의 최적 기후 조건에서 재배되는 프리미엄 샤인머스켓입니다. 높은 당도와 아삭한 식감이 특징입니다.',
      farmingMethod: '시설하우스 재배',
      expectedYield: 20, // kg per lot
      priceAssumptions: {
        farmGatePrice: 8000, // 원/kg
        wholesalePrice: 12000, // 원/kg
        retailPrice: 20000 // 원/kg
      }
    },
    {
      id: 'offering-4',
      title: '논산 논산딸기 수출품 투자',
      crop: '딸기',
      region: '논산',
      lotPriceKRW: 40000,
      lotsTotal: 600,
      lotsSold: 423,
      expectedAPR: 11.2,
      closeDate: new Date(baseDate.getTime() + 10 * 24 * 60 * 60 * 1000), // 10일 후
      settleDate: new Date(baseDate.getTime() + 120 * 24 * 60 * 60 * 1000), // 4개월 후
      producer: {
        name: '최딸기',
        profile: '논산딸기 재배 20년, 수출 전문 농가',
        location: '논산시 연무읍',
        experience: 20
      },
      riskNotes: [
        '수출 검역 기준 미달 위험',
        '환율 변동에 따른 수익성 변화',
        '저온 피해로 인한 생육 지연'
      ],
      timeline: [
        {
          phase: '정식 및 활착',
          description: '우수 품종 딸기 모종 정식',
          expectedDate: new Date(baseDate.getTime() - 45 * 24 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          phase: '생육 관리',
          description: '온도 및 습도 관리, 영양 공급',
          expectedDate: new Date(baseDate.getTime() + 15 * 24 * 60 * 60 * 1000),
          status: 'in-progress'
        },
        {
          phase: '수확',
          description: '수출 규격 딸기 수확 및 선별',
          expectedDate: new Date(baseDate.getTime() + 75 * 24 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          phase: '수출 판매',
          description: '동남아시아 수출 및 내수 판매',
          expectedDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ],
      coverImageURL: '/api/placeholder/strawberry-farm',
      description: '논산의 대표 특산품인 논산딸기로 수출 규격의 고품질 딸기를 재배합니다.',
      farmingMethod: '스마트팜 하우스 재배',
      expectedYield: 15, // kg per lot
      priceAssumptions: {
        farmGatePrice: 4000, // 원/kg
        wholesalePrice: 6000, // 원/kg
        retailPrice: 10000 // 원/kg
      }
    },
    {
      id: 'offering-5',
      title: '강원 감자 가공용 투자',
      crop: '감자',
      region: '강원',
      lotPriceKRW: 25000,
      lotsTotal: 800,
      lotsSold: 645,
      expectedAPR: 8.5,
      closeDate: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3일 후
      settleDate: new Date(baseDate.getTime() + 210 * 24 * 60 * 60 * 1000), // 7개월 후
      producer: {
        name: '강감자',
        profile: '강원도 고랭지 감자 재배 35년 베테랑',
        location: '강원도 평창군',
        experience: 35
      },
      riskNotes: [
        '기상 이변으로 인한 수확량 변동',
        '가공업체 수요 변화',
        '저장 중 품질 저하 가능성'
      ],
      timeline: [
        {
          phase: '파종',
          description: '고랭지 감자 파종 작업',
          expectedDate: new Date(baseDate.getTime() + 45 * 24 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          phase: '생육 관리',
          description: '김매기 및 병충해 방제',
          expectedDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          phase: '수확',
          description: '기계수확 및 선별 작업',
          expectedDate: new Date(baseDate.getTime() + 150 * 24 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          phase: '가공업체 납품',
          description: '대형 가공업체 계약 납품',
          expectedDate: new Date(baseDate.getTime() + 180 * 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ],
      coverImageURL: '/api/placeholder/potato-farm',
      description: '강원도 고랭지에서 재배되는 가공용 감자입니다. 대형 가공업체와의 계약 재배로 안정적인 판로를 확보했습니다.',
      farmingMethod: '친환경 노지 재배',
      expectedYield: 50, // kg per lot
      priceAssumptions: {
        farmGatePrice: 800, // 원/kg
        wholesalePrice: 1200, // 원/kg
        retailPrice: 2000 // 원/kg
      }
    }
  ];
}

// 기본 사용자 프로필
export const defaultUserProfile: UserProfile = {
  id: 'user-1',
  name: '김투자',
  email: 'investor@example.com',
  phone: '010-1234-5678',
  address: '서울시 강남구 테헤란로 123',
  kycStatus: 'verified',
  totalInvestedKRW: 0,
  totalPayoutKRW: 0,
  portfolioValueKRW: 0
};

// 초기 지갑 잔액
export const initialWalletBalance = 1000000; // 100만원

// 샘플 투자 내역
export function generateSampleInvestments(): Investment[] {
  return [
    {
      id: generateId(),
      offeringId: 'offering-1',
      lots: 5,
      amountKRW: 250000,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'confirmed'
    },
    {
      id: generateId(),
      offeringId: 'offering-2',
      lots: 3,
      amountKRW: 240000,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'confirmed'
    }
  ];
}

// 샘플 배당 내역
export function generateSamplePayouts(): Payout[] {
  return [
    {
      id: generateId(),
      offeringId: 'offering-1',
      period: '2024-01',
      amountKRW: 12500,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      payoutType: 'dividend'
    }
  ];
}

// 샘플 지갑 거래 내역
export function generateSampleWalletTransactions(): WalletTransaction[] {
  return [
    {
      id: generateId(),
      type: '충전',
      amountKRW: 1000000,
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      memo: '모의 충전',
      status: 'completed'
    },
    {
      id: generateId(),
      type: '투자',
      amountKRW: -250000,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      memo: '제주 하우스 토마토 겨울작 투자 (5구좌)',
      status: 'completed'
    },
    {
      id: generateId(),
      type: '투자',
      amountKRW: -240000,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      memo: '완도 한라봉 프리미엄 투자 (3구좌)',
      status: 'completed'
    },
    {
      id: generateId(),
      type: '배당',
      amountKRW: 12500,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      memo: '제주 하우스 토마토 1월 배당',
      status: 'completed'
    }
  ];
}

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  OFFERINGS: 'greenharvest_offerings',
  INVESTMENTS: 'greenharvest_investments',
  PAYOUTS: 'greenharvest_payouts',
  WALLET_TRANSACTIONS: 'greenharvest_wallet_transactions',
  WALLET_BALANCE: 'greenharvest_wallet_balance',
  USER_PROFILE: 'greenharvest_user_profile'
};

// 데이터 초기화 함수
export function initializeData() {
  // 기존 데이터 삭제 후 재설정 (날짜 문제 해결)
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // 새로운 시드 데이터로 초기화
  localStorage.setItem(STORAGE_KEYS.OFFERINGS, JSON.stringify(generateOfferingSeed()));
  localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(generateSampleInvestments()));
  localStorage.setItem(STORAGE_KEYS.PAYOUTS, JSON.stringify(generateSamplePayouts()));
  localStorage.setItem(STORAGE_KEYS.WALLET_TRANSACTIONS, JSON.stringify(generateSampleWalletTransactions()));
  localStorage.setItem(STORAGE_KEYS.WALLET_BALANCE, initialWalletBalance.toString());
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultUserProfile));
}