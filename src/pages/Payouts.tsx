import { useState, useEffect } from 'react';
import { Download, TrendingUp, Calendar } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingPage } from '@/components/ui/loading';
import { EmptyPayouts } from '@/components/ui/empty-state';
import { Payout, Offering } from '@/types';
import { payoutsApi, offeringsApi } from '@/services/api';
import { formatKRW, formatDate, getCropEmoji } from '@/lib/utils';

interface PayoutWithOffering extends Payout {
  offering: Offering;
}

export default function Payouts() {
  const [payouts, setPayouts] = useState<PayoutWithOffering[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<PayoutWithOffering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');

  useEffect(() => {
    loadPayouts();
  }, []);

  useEffect(() => {
    filterPayouts();
  }, [payouts, selectedPeriod, selectedCrop]);

  const loadPayouts = async () => {
    try {
      const payoutsResponse = await payoutsApi.getPayouts();
      
      if (payoutsResponse.success) {
        // 각 배당에 대한 공모 정보 가져오기
        const payoutsWithOfferings = await Promise.all(
          payoutsResponse.data.map(async (payout) => {
            const offeringResponse = await offeringsApi.getOffering(payout.offeringId);
            return {
              ...payout,
              offering: offeringResponse.data!
            };
          })
        );

        setPayouts(payoutsWithOfferings);
      }
    } catch (error) {
      console.error('Failed to load payouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPayouts = () => {
    let filtered = [...payouts];

    if (selectedPeriod !== 'all') {
      filtered = filtered.filter(payout => payout.period === selectedPeriod);
    }

    if (selectedCrop !== 'all') {
      filtered = filtered.filter(payout => payout.offering.crop === selectedCrop);
    }

    setFilteredPayouts(filtered);
  };

  const totalPayouts = payouts.reduce((sum, payout) => sum + payout.amountKRW, 0);
  const uniquePeriods = [...new Set(payouts.map(p => p.period))].sort().reverse();
  const uniqueCrops = [...new Set(payouts.map(p => p.offering.crop))];

  const exportToCSV = () => {
    const headers = ['날짜', '공모명', '농산물', '지역', '배당금액', '배당유형'];
    const csvData = filteredPayouts.map(payout => [
      formatDate(payout.createdAt),
      payout.offering.title,
      payout.offering.crop,
      payout.offering.region,
      payout.amountKRW.toString(),
      payout.payoutType === 'dividend' ? '배당' : '원금'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `배당내역_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingPage message="배당 내역을 불러오는 중..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">배당 내역</h1>
          <p className="text-text-secondary">
            받은 배당금과 수익을 확인하세요
          </p>
        </div>

        {/* 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">총 배당금액</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatKRW(totalPayouts)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-subtle rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">배당 횟수</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {payouts.length}회
                  </p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">평균 배당금액</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {formatKRW(payouts.length > 0 ? totalPayouts / payouts.length : 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <span className="text-success font-bold">평균</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 필터 및 액션 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-text-primary">기간:</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {uniquePeriods.map(period => (
                        <SelectItem key={period} value={period}>
                          {period}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-text-primary">농산물:</label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {uniqueCrops.map(crop => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={exportToCSV}
                disabled={filteredPayouts.length === 0}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>CSV 다운로드</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 배당 내역 */}
        <Card>
          <CardHeader>
            <CardTitle>
              배당 내역 ({filteredPayouts.length}건)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPayouts.length === 0 ? (
              <EmptyPayouts />
            ) : (
              <div className="space-y-4">
                {filteredPayouts.map((payout) => {
                  const cropEmoji = getCropEmoji(payout.offering.crop);

                  return (
                    <div key={payout.id} className="border border-card-border rounded-lg p-6 hover:bg-hover-bg transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-primary-subtle rounded-lg flex items-center justify-center text-xl">
                            {cropEmoji}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-text-primary mb-1">
                              {payout.offering.title}
                            </h3>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="secondary">
                                {payout.offering.crop} · {payout.offering.region}
                              </Badge>
                              <Badge variant={payout.payoutType === 'dividend' ? 'default' : 'outline'}>
                                {payout.payoutType === 'dividend' ? '배당' : '원금'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-text-secondary">배당 기간:</span>
                                <span className="ml-2 font-medium text-text-primary">
                                  {payout.period}
                                </span>
                              </div>
                              <div>
                                <span className="text-text-secondary">지급일:</span>
                                <span className="ml-2 font-medium text-text-primary">
                                  {formatDate(payout.createdAt)}
                                </span>
                              </div>
                              <div>
                                <span className="text-text-secondary">생산자:</span>
                                <span className="ml-2 font-medium text-text-primary">
                                  {payout.offering.producer.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {formatKRW(payout.amountKRW)}
                          </div>
                          <div className="text-sm text-text-secondary">
                            배당금액
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}