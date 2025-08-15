import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  User, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ChevronDown,
  Heart,
  Share2,
  Minus,
  Plus
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { LoadingPage } from '@/components/ui/loading';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { Offering } from '@/types';
import { offeringsApi, investmentsApi } from '@/services/api';
import { 
  formatKRW, 
  formatPercent, 
  formatDate, 
  getDDay, 
  calculateProgress,
  getCropEmoji,
  getRiskLevel 
} from '@/lib/utils';

export default function OfferingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [offering, setOffering] = useState<Offering | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lots, setLots] = useState(1);
  const [isInvesting, setIsInvesting] = useState(false);

  useEffect(() => {
    if (id) {
      loadOffering(id);
    }
  }, [id]);

  const loadOffering = async (offeringId: string) => {
    try {
      const response = await offeringsApi.getOffering(offeringId);
      if (response.success && response.data) {
        setOffering(response.data);
      } else {
        toast({
          title: '오류',
          description: '공모를 찾을 수 없습니다.',
          variant: 'destructive'
        });
        navigate('/market');
      }
    } catch (error) {
      console.error('Failed to load offering:', error);
      toast({
        title: '오류',
        description: '공모 정보를 불러오는데 실패했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvest = async () => {
    if (!offering) return;

    setIsInvesting(true);
    try {
      const response = await investmentsApi.createInvestment(offering.id, lots);
      if (response.success) {
        toast({
          title: '투자 완료',
          description: `${offering.title}에 ${lots}구좌 투자가 완료되었습니다. (모의)`,
        });
        navigate('/portfolio');
      } else {
        toast({
          title: '투자 실패',
          description: response.message || '투자에 실패했습니다.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Investment failed:', error);
      toast({
        title: '투자 실패',
        description: '투자 처리 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsInvesting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingPage message="공모 정보를 불러오는 중..." />
      </Layout>
    );
  }

  if (!offering) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">공모를 찾을 수 없습니다</h1>
          <Button onClick={() => navigate('/market')}>마켓으로 돌아가기</Button>
        </div>
      </Layout>
    );
  }

  const progress = calculateProgress(offering.lotsSold, offering.lotsTotal);
  const dDay = getDDay(offering.closeDate);
  const riskLevel = getRiskLevel(offering.expectedAPR);
  const cropEmoji = getCropEmoji(offering.crop);
  const totalAmount = lots * offering.lotPriceKRW;
  const expectedAnnualReturn = (totalAmount * offering.expectedAPR) / 100;
  const expectedMonthlyReturn = expectedAnnualReturn / 12;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{cropEmoji}</span>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">{offering.title}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">{offering.crop} · {offering.region}</Badge>
                  <Badge variant="default" className="bg-primary text-white">
                    {formatPercent(offering.expectedAPR)}
                  </Badge>
                  <Badge variant="outline" className={riskLevel.color}>
                    위험도 {riskLevel.level}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                관심
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                공유
              </Button>
            </div>
          </div>

          {/* 데모 안내 */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
            <p className="text-warning font-medium text-sm">
              ⚠️ 본 서비스는 학습·시연용 데모이며 실제 투자/배당이 아닙니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 상단 요약 */}
            <Card>
              <CardHeader>
                <CardTitle>투자 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-text-secondary">구좌당 가격</div>
                    <div className="text-lg font-semibold text-text-primary">
                      {formatKRW(offering.lotPriceKRW)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">목표 금액</div>
                    <div className="text-lg font-semibold text-text-primary">
                      {formatKRW(offering.lotsTotal * offering.lotPriceKRW)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">마감일</div>
                    <div className="text-lg font-semibold text-error">{dDay}</div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">예상 정산일</div>
                    <div className="text-lg font-semibold text-text-primary">
                      {formatDate(offering.settleDate)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">모집 현황</span>
                            <span className="text-sm font-medium text-text-primary">
                              {progress}% ({offering.lotsSold.toLocaleString()}/{offering.lotsTotal.toLocaleString()}구좌)
                            </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="text-sm text-text-secondary">
                    현재 모집금액: {formatKRW(offering.lotsSold * offering.lotPriceKRW)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 생산자 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>생산자 정보</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary-subtle rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">
                      {offering.producer.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-text-secondary mb-2">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{offering.producer.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{offering.producer.experience}년 경력</span>
                      </div>
                    </div>
                    <p className="text-text-secondary">{offering.producer.profile}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 상세 정보 */}
            <Card>
              <CardHeader>
                <CardTitle>상세 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="description">
                    <AccordionTrigger>공모 설명</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-text-secondary mb-4">{offering.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">재배 방식:</span> {offering.farmingMethod}
                        </div>
                        <div>
                          <span className="font-medium">구좌당 예상 수확량:</span> {offering.expectedYield}kg
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="pricing">
                    <AccordionTrigger>가격 가정</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>농가 수취가:</span>
                          <span className="font-medium">{formatKRW(offering.priceAssumptions.farmGatePrice)}/kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>도매가:</span>
                          <span className="font-medium">{formatKRW(offering.priceAssumptions.wholesalePrice)}/kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>예상 소매가:</span>
                          <span className="font-medium">{formatKRW(offering.priceAssumptions.retailPrice)}/kg</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="timeline">
                    <AccordionTrigger>진행 일정</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {offering.timeline.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className={`w-3 h-3 rounded-full mt-1 ${
                              item.status === 'completed' ? 'bg-success' :
                              item.status === 'in-progress' ? 'bg-warning' : 'bg-border'
                            }`} />
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-text-primary">{item.phase}</span>
                                <span className="text-sm text-text-secondary">
                                  {formatDate(item.expectedDate)}
                                </span>
                              </div>
                              <p className="text-sm text-text-secondary">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="risks">
                    <AccordionTrigger className="text-error">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span>투자 위험 고지</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {offering.riskNotes.map((risk, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-error mt-1">•</span>
                            <span className="text-text-secondary text-sm">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 - 투자 패널 */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>투자하기</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 구좌 수 선택 */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    구좌 수
                  </label>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLots(Math.max(1, lots - 1))}
                      disabled={lots <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={lots}
                      onChange={(e) => setLots(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLots(lots + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 투자 요약 */}
                <div className="space-y-3 p-4 bg-primary-subtle/30 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">투자 금액</span>
                    <span className="font-semibold text-text-primary">
                      {formatKRW(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">예상 연 수익</span>
                    <span className="font-semibold text-primary">
                      {formatKRW(expectedAnnualReturn)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">예상 월 배당</span>
                    <span className="font-semibold text-primary">
                      {formatKRW(expectedMonthlyReturn)}
                    </span>
                  </div>
                </div>

                {/* 투자 버튼 */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleInvest}
                  disabled={isInvesting}
                >
                  {isInvesting ? '투자 처리 중...' : `${formatKRW(totalAmount)} 투자하기`}
                </Button>

                <p className="text-xs text-text-muted text-center">
                  클릭 시 모의 투자가 실행됩니다. 실제 결제는 발생하지 않습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}