import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { payoutsApi } from '@/services/api';

export default function Producer() {
  const [updateData, setUpdateData] = useState({
    offeringId: 'offering-1',
    salesVolume: '',
    averagePrice: ''
  });

  const handleSimulatePayout = async () => {
    const volume = parseFloat(updateData.salesVolume);
    const price = parseFloat(updateData.averagePrice);
    
    if (!volume || !price) {
      toast({
        title: '입력 오류',
        description: '판매량과 평균 단가를 모두 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await payoutsApi.simulatePayout(updateData.offeringId, volume, price);
      if (response.success) {
        toast({
          title: '배당 시뮬레이션 완료',
          description: '투자자들에게 배당이 지급되었습니다. (모의)'
        });
        setUpdateData({...updateData, salesVolume: '', averagePrice: ''});
      }
    } catch (error) {
      toast({
        title: '시뮬레이션 실패',
        description: '배당 시뮬레이션에 실패했습니다.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">프로듀서 대시보드</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>판매 실적 업데이트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">판매량 (kg)</label>
              <Input
                type="number"
                value={updateData.salesVolume}
                onChange={(e) => setUpdateData({...updateData, salesVolume: e.target.value})}
                placeholder="1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">평균 단가 (원/kg)</label>
              <Input
                type="number"
                value={updateData.averagePrice}
                onChange={(e) => setUpdateData({...updateData, averagePrice: e.target.value})}
                placeholder="2500"
              />
            </div>
            <Button onClick={handleSimulatePayout} className="w-full">
              배당 시뮬레이션 실행
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}