import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Legal() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">법적 고지</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-error">⚠️ 중요 고지사항</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-text-secondary">
                <p><strong>본 서비스는 교육·시연 목적의 데모이며, 실제 청약/투자/배당이 아닙니다.</strong></p>
                <p>표시된 수익률은 가정에 기반한 예시이며, 실제 투자 결과를 보장하지 않습니다.</p>
                <p>모든 거래는 가상으로 진행되며, 실제 금융거래가 발생하지 않습니다.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>투자위험 고지</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-text-secondary">
                <li>• 농산물 가격 변동으로 인한 손실 위험</li>
                <li>• 수확량 감소 및 판매 지연으로 인한 수익성 악화 가능성</li>
                <li>• 정산 지연 및 원금 손실 위험</li>
                <li>• 기상 이변, 병충해 등으로 인한 예상 수익률 미달 가능성</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}