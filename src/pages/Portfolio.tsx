import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Eye } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingPage } from '@/components/ui/loading';
import { EmptyPortfolio } from '@/components/ui/empty-state';
import { Investment, Offering } from '@/types';
import { investmentsApi, offeringsApi, calculatePortfolioSummary } from '@/services/api';
import { formatKRW, formatPercent, formatDate, getDDay, getCropEmoji } from '@/lib/utils';

interface InvestmentWithOffering extends Investment {
  offering: Offering;
}

export default function Portfolio() {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState<InvestmentWithOffering[]>([]);
  const [summary, setSummary] = useState({
    totalInvested: 0,
    currentValue: 0,
    totalPayouts: 0,
    expectedMonthlyPayout: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const [investmentsResponse, summaryData] = await Promise.all([
        investmentsApi.getMyInvestments(),
        calculatePortfolioSummary()
      ]);

      if (investmentsResponse.success) {
        // 각 투자에 대한 공모 정보 가져오기
        const investmentsWithOfferings = await Promise.all(
          investmentsResponse.data.map(async (investment) => {
            const offeringResponse = await offeringsApi.getOffering(investment.offeringId);
            return {
              ...investment,
              offering: offeringResponse.data!
            };
          })
        );

        setInvestments(investmentsWithOfferings);
      }

      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalReturn = summary.currentValue - summary.totalInvested + summary.totalPayouts;
  const totalReturnPercent = summary.totalInvested > 0 ? (totalReturn / summary.totalInvested) * 100 : 0;

  if (isLoading) {
    return (
      <Layout>
        <LoadingPage message="포트폴리오를 불러오는 중..." />
      </Layout>
    );
  }

  if (investments.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyPortfolio onAction={() => navigate('/market')} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">포트폴리오</h1>
          <p className="text-text-secondary">
            내 투자 현황과 수익을 확인하세요
          </p>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">총 투자금액</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatKRW(summary.totalInvested)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-subtle rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">현재 평가금액</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatKRW(summary.currentValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">총 수익</p>
                  <p className={`text-2xl font-bold ${
                    totalReturn >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {formatKRW(totalReturn)}
                  </p>
                  <p className={`text-sm ${
                    totalReturn >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {totalReturn >= 0 ? '+' : ''}{formatPercent(totalReturnPercent)}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  totalReturn >= 0 ? 'bg-success/10' : 'bg-error/10'
                }`}>
                  {totalReturn >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-success" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-error" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">이번 달 예상 배당</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatKRW(summary.expectedMonthlyPayout)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-subtle rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 투자 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>투자 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investments.map((investment) => {
                const cropEmoji = getCropEmoji(investment.offering.crop);
                const dDay = getDDay(investment.offering.closeDate);
                const progress = (investment.offering.lotsSold / investment.offering.lotsTotal) * 100;
                const expectedAnnualReturn = (investment.amountKRW * investment.offering.expectedAPR) / 100;
                const expectedMonthlyReturn = expectedAnnualReturn / 12;

                return (
                  <div key={investment.id} className="border border-card-border rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-subtle rounded-lg flex items-center justify-center text-xl">
                          {cropEmoji}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-text-primary mb-1">
                            {investment.offering.title}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary">
                              {investment.offering.crop} · {investment.offering.region}
                            </Badge>
                            <Badge variant="default" className="bg-primary text-white">
                              {formatPercent(investment.offering.expectedAPR)}
                            </Badge>
                          </div>
                          <p className="text-sm text-text-secondary">
                            투자일: {formatDate(investment.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/offerings/${investment.offering.id}`)}
                          className="flex items-center space-x-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>상세보기</span>
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-text-secondary">투자 구좌</div>
                        <div className="font-semibold text-text-primary">
                          {investment.lots}구좌
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary">투자 금액</div>
                        <div className="font-semibold text-text-primary">
                          {formatKRW(investment.amountKRW)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary">예상 월 배당</div>
                        <div className="font-semibold text-primary">
                          {formatKRW(expectedMonthlyReturn)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary">마감</div>
                        <div className="font-semibold text-text-primary">{dDay}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary">공모 진행률</span>
                        <span className="text-sm font-medium text-text-primary">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button onClick={() => navigate('/market')}>
            추가 투자하기
          </Button>
          <Button variant="outline" onClick={() => navigate('/payouts')}>
            배당 내역 보기
          </Button>
        </div>
      </div>
    </Layout>
  );
}