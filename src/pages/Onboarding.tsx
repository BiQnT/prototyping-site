import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

export default function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      toast({
        title: '약관 동의 필요',
        description: '서비스 이용을 위해 약관에 동의해주세요.',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'KYC 완료 (모의)',
      description: '본인 인증이 완료되었습니다. 투자를 시작할 수 있습니다.'
    });
    navigate('/market');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">시작하기</h1>
          <p className="text-text-secondary">간단한 정보 입력으로 투자를 시작하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>본인 인증 (모의)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">이름</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">휴대폰 번호</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="010-0000-0000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">주소</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="서울시 강남구..."
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({...formData, agreeTerms: !!checked})}
                  />
                  <label htmlFor="terms" className="text-sm">서비스 이용약관에 동의합니다</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) => setFormData({...formData, agreePrivacy: !!checked})}
                  />
                  <label htmlFor="privacy" className="text-sm">개인정보 처리방침에 동의합니다</label>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                인증 완료하기 (모의)
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}