import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-primary-subtle rounded-full flex items-center justify-center text-2xl">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-text-secondary mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

// 자주 사용되는 빈 상태들
export function EmptyOfferings() {
  return (
    <EmptyState
      icon="🌱"
      title="조건에 맞는 공모가 없습니다"
      description="필터를 조정하거나 다른 조건으로 검색해보세요."
    />
  );
}

export function EmptyPortfolio({ onAction }: { onAction: () => void }) {
  return (
    <EmptyState
      icon="📊"
      title="아직 투자한 공모가 없어요"
      description="마켓에서 첫 투자를 시작해보세요."
      action={{
        label: '투자 시작하기',
        onClick: onAction
      }}
    />
  );
}

export function EmptyPayouts() {
  return (
    <EmptyState
      icon="💰"
      title="아직 받은 배당이 없습니다"
      description="투자한 공모의 수확이 완료되면 배당을 받을 수 있습니다."
    />
  );
}

export function EmptyTransactions() {
  return (
    <EmptyState
      icon="💳"
      title="거래 내역이 없습니다"
      description="충전이나 투자를 시작하면 거래 내역이 표시됩니다."
    />
  );
}