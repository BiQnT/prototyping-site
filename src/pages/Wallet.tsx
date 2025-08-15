import { useState, useEffect } from 'react';
import { Plus, Minus, Download, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoadingPage } from '@/components/ui/loading';
import { EmptyTransactions } from '@/components/ui/empty-state';
import { toast } from '@/hooks/use-toast';
import { WalletTransaction } from '@/types';
import { walletApi } from '@/services/api';
import { formatKRW, formatRelativeTime } from '@/lib/utils';

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [balanceResponse, transactionsResponse] = await Promise.all([
        walletApi.getBalance(),
        walletApi.getTransactions()
      ]);

      if (balanceResponse.success) {
        setBalance(balanceResponse.data);
      }

      if (transactionsResponse.success) {
        setTransactions(transactionsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = async () => {
    const amount = parseInt(depositAmount.replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: '오류',
        description: '올바른 금액을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    setIsDepositing(true);
    try {
      const response = await walletApi.deposit(amount);
      if (response.success) {
        toast({
          title: '충전 완료',
          description: `${formatKRW(amount)}이 충전되었습니다. (모의)`
        });
        setDepositAmount('');
        loadWalletData();
      } else {
        toast({
          title: '충전 실패',
          description: response.message || '충전에 실패했습니다.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Deposit failed:', error);
      toast({
        title: '충전 실패',
        description: '충전 처리 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount.replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: '오류',
        description: '올바른 금액을 입력해주세요.',
        variant: 'destructive'
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: '출금 실패',
        description: '잔액이 부족합니다.',
        variant: 'destructive'
      });
      return;
    }

    setIsWithdrawing(true);
    try {
      const response = await walletApi.withdraw(amount);
      if (response.success) {
        toast({
          title: '출금 완료',
          description: `${formatKRW(amount)}이 출금되었습니다. (모의)`
        });
        setWithdrawAmount('');
        loadWalletData();
      } else {
        toast({
          title: '출금 실패',
          description: response.message || '출금에 실패했습니다.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Withdraw failed:', error);
      toast({
        title: '출금 실패',
        description: '출금 처리 중 오류가 발생했습니다.',
        variant: 'destructive'
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatAmountInput = (value: string) => {
    const number = parseInt(value.replace(/,/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case '충전':
        return <ArrowDownLeft className="h-4 w-4 text-success" />;
      case '출금':
        return <ArrowUpRight className="h-4 w-4 text-error" />;
      case '투자':
        return <ArrowUpRight className="h-4 w-4 text-warning" />;
      case '배당':
        return <ArrowDownLeft className="h-4 w-4 text-primary" />;
      default:
        return <CreditCard className="h-4 w-4 text-text-muted" />;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) return 'text-success';
    if (type === '투자') return 'text-warning';
    return 'text-error';
  };

  if (isLoading) {
    return (
      <Layout>
        <LoadingPage message="지갑 정보를 불러오는 중..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">지갑</h1>
          <p className="text-text-secondary">
            투자 자금을 관리하고 거래 내역을 확인하세요
          </p>
        </div>

        {/* 잔액 카드 */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="text-sm text-text-secondary mb-2">사용 가능한 잔액</div>
              <div className="text-4xl font-bold text-text-primary mb-6">
                {formatKRW(balance)}
              </div>
              
              {/* 데모 안내 */}
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-warning font-medium text-sm">
                  ⚠️ 모의 지갑입니다. 실제 금융거래가 발생하지 않습니다.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* 충전 다이얼로그 */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="flex items-center space-x-2">
                      <Plus className="h-5 w-5" />
                      <span>충전</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>지갑 충전 (모의)</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          충전 금액
                        </label>
                        <Input
                          placeholder="금액을 입력하세요"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(formatAmountInput(e.target.value))}
                        />
                      </div>
                      <div className="flex space-x-2">
                        {[100000, 300000, 500000, 1000000].map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setDepositAmount(amount.toLocaleString())}
                          >
                            {formatKRW(amount)}
                          </Button>
                        ))}
                      </div>
                      <Button 
                        onClick={handleDeposit}
                        disabled={isDepositing || !depositAmount}
                        className="w-full"
                      >
                        {isDepositing ? '처리 중...' : '충전하기'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* 출금 다이얼로그 */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="flex items-center space-x-2">
                      <Minus className="h-5 w-5" />
                      <span>출금</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>지갑 출금 (모의)</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          출금 금액
                        </label>
                        <Input
                          placeholder="금액을 입력하세요"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(formatAmountInput(e.target.value))}
                        />
                        <p className="text-sm text-text-muted mt-1">
                          출금 가능 금액: {formatKRW(balance)}
                        </p>
                      </div>
                      <Button 
                        onClick={handleWithdraw}
                        disabled={isWithdrawing || !withdrawAmount}
                        className="w-full"
                      >
                        {isWithdrawing ? '처리 중...' : '출금하기'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 거래 내역 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>거래 내역</CardTitle>
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>내역 다운로드</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <EmptyTransactions />
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-card-border rounded-lg hover:bg-hover-bg transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-subtle rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">
                          {transaction.type}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {transaction.memo}
                        </div>
                        <div className="text-xs text-text-muted">
                          {formatRelativeTime(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${getTransactionColor(transaction.type, transaction.amountKRW)}`}>
                        {transaction.amountKRW > 0 ? '+' : ''}{formatKRW(transaction.amountKRW)}
                      </div>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {transaction.status === 'completed' ? '완료' : '진행중'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}