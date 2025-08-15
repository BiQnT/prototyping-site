import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, Award, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OfferingCard } from '@/components/offerings/OfferingCard';
import { Layout } from '@/components/layout/Layout';
import { LoadingGrid } from '@/components/ui/loading';
import { Offering } from '@/types';
import { offeringsApi } from '@/services/api';
import { formatKRW } from '@/lib/utils';

export default function Index() {
  const navigate = useNavigate();
  const [featuredOfferings, setFeaturedOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedOfferings = async () => {
      try {
        const response = await offeringsApi.getFeaturedOfferings();
        if (response.success) {
          setFeaturedOfferings(response.data);
        }
      } catch (error) {
        console.error('Failed to load featured offerings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedOfferings();
  }, []);

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: '투명한 수익 구조',
      description: '실제 농산물 판매 실적에 연동된 배당으로 투명하고 공정한 수익을 제공합니다.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: '안전한 투자',
      description: '검증된 생산자와 계약 재배를 통해 투자 위험을 최소화합니다.'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: '프리미엄 농산물',
      description: '엄선된 고품질 농산물에만 투자하여 안정적인 수익성을 확보합니다.'
    }
  ];

  const stats = [
    { label: '누적 투자금액', value: '250억원', desc: '지금까지 모집된 총 투자금액' },
    { label: '평균 수익률', value: '12.5%', desc: '연환산 평균 수익률' },
    { label: '성공한 공모', value: '128건', desc: '성공적으로 완료된 공모 수' },
    { label: '투자자', value: '15,000명', desc: '누적 투자자 수' }
  ];

  return (
    <Layout>
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-primary-subtle via-white to-primary-subtle/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6">
              농산물의 가치를 <br />
              <span className="text-primary">수익으로</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              판매 실적에 따라 배당이 들어오는 농산물 STO 데모. <br />
              실제 농가와 함께하는 투명하고 안전한 투자를 경험해보세요.
            </p>
            
            {/* 데모 안내 */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-warning font-medium text-sm">
                ⚠️ 본 서비스는 교육·시연 목적의 데모이며, 실제 청약/투자/배당이 아닙니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                size="lg" 
                className="flex items-center space-x-2"
                onClick={() => navigate('/onboarding')}
              >
                <Play className="h-5 w-5" />
                <span>시작하기</span>
              </Button>
              <Link to="/market">
                <Button variant="outline" size="lg" className="flex items-center space-x-2">
                  <span>마켓 둘러보기</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-text-secondary">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 진행 중인 공모 */}
      <section className="py-16 bg-primary-subtle/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              지금 투자 가능한 공모
            </h2>
            <p className="text-xl text-text-secondary">
              검증된 농가의 고품질 농산물에 투자하세요
            </p>
          </div>

          {isLoading ? (
            <LoadingGrid count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredOfferings.map((offering) => (
                <OfferingCard 
                  key={offering.id} 
                  offering={offering} 
                  variant="featured" 
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Link to="/market">
              <Button size="lg" variant="outline" className="flex items-center space-x-2">
                <span>모든 공모 보기</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 특징 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              왜 GreenHarvest일까요?
            </h2>
            <p className="text-xl text-text-secondary">
              농산물 투자의 새로운 패러다임을 제시합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary-subtle rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 시작해보세요
          </h2>
          <p className="text-xl opacity-90 mb-8">
            3분만에 가입하고 첫 투자를 시작할 수 있습니다
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/onboarding')}
              className="flex items-center space-x-2"
            >
              <span>무료로 시작하기</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link to="/legal">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                법적 고지 확인
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}