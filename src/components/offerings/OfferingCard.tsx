import { Link } from 'react-router-dom';
import { Calendar, MapPin, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Offering } from '@/types';
import { 
  formatKRW, 
  formatPercent, 
  getDDay, 
  calculateProgress,
  getCropEmoji,
  getRiskLevel 
} from '@/lib/utils';

interface OfferingCardProps {
  offering: Offering;
  variant?: 'default' | 'featured';
}

export function OfferingCard({ offering, variant = 'default' }: OfferingCardProps) {
  const progress = calculateProgress(offering.lotsSold, offering.lotsTotal);
  const dDay = getDDay(offering.closeDate);
  const riskLevel = getRiskLevel(offering.expectedAPR);
  const isClosingSoon = dDay.includes('D-') && parseInt(dDay.split('-')[1]) <= 3;
  const cropEmoji = getCropEmoji(offering.crop);

  return (
    <Card className={`group hover:shadow-md transition-all duration-200 ${
      variant === 'featured' ? 'border-primary/20 bg-primary-subtle/30' : ''
    }`}>
      <CardContent className="p-6">
        {/* 상단 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{cropEmoji}</span>
            <div>
              <Badge variant="secondary" className="mb-1">
                {offering.crop} · {offering.region}
              </Badge>
              {isClosingSoon && (
                <Badge variant="destructive" className="ml-2">
                  마감 임박
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-primary">
              {formatPercent(offering.expectedAPR)}
            </div>
            <div className="text-xs text-text-muted">예상연수익률</div>
          </div>
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors">
          {offering.title}
        </h3>

        {/* 생산자 정보 */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-primary-subtle rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-medium text-text-primary">{offering.producer.name}</div>
            <div className="text-xs text-text-secondary">{offering.producer.location}</div>
          </div>
        </div>

        {/* 모집 현황 */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-secondary">모집 현황</span>
            <span className="text-sm font-medium text-text-primary">
              {progress}% ({offering.lotsSold}/{offering.lotsTotal}구좌)
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* 투자 정보 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-text-secondary">구좌당 가격</div>
            <div className="font-semibold text-text-primary">{formatKRW(offering.lotPriceKRW)}</div>
          </div>
          <div>
            <div className="text-sm text-text-secondary">목표 금액</div>
            <div className="font-semibold text-text-primary">
              {formatKRW(offering.lotsTotal * offering.lotPriceKRW)}
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{dDay}</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4" />
            <span className={riskLevel.color}>위험도 {riskLevel.level}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <div className="flex space-x-2 w-full">
          <Button variant="outline" size="sm" className="flex-1">
            관심
          </Button>
          <Link to={`/offerings/${offering.id}`} className="flex-1">
            <Button size="sm" className="w-full">
              투자하기
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}