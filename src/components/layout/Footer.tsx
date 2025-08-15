import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-card-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 브랜드 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌱</span>
              </div>
              <span className="text-xl font-bold text-text-primary">GreenHarvest</span>
            </div>
            <p className="text-text-secondary mb-4">
              농산물의 가치를 수익으로. <br />
              판매 실적에 따라 배당이 들어오는 농산물 STO 데모.
            </p>
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <p className="text-sm text-warning font-medium">
                ⚠️ 데모 전용 · 실제 금융거래 불가 · 수익률·배당은 가정치입니다.
              </p>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">서비스</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/market" className="text-text-secondary hover:text-primary transition-colors">
                  마켓플레이스
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-text-secondary hover:text-primary transition-colors">
                  포트폴리오
                </Link>
              </li>
              <li>
                <Link to="/wallet" className="text-text-secondary hover:text-primary transition-colors">
                  지갑
                </Link>
              </li>
              <li>
                <Link to="/payouts" className="text-text-secondary hover:text-primary transition-colors">
                  배당 내역
                </Link>
              </li>
            </ul>
          </div>

          {/* 정보 */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">정보</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/legal" className="text-text-secondary hover:text-primary transition-colors">
                  법적 고지
                </Link>
              </li>
              <li>
                <Link to="/onboarding" className="text-text-secondary hover:text-primary transition-colors">
                  시작하기
                </Link>
              </li>
              <li>
                <Link to="/producer" className="text-text-secondary hover:text-primary transition-colors">
                  생산자 대시보드
                </Link>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-card-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-secondary text-sm">
              © 2024 GreenHarvest. 교육·시연 목적의 데모 서비스입니다.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <p className="text-xs text-text-muted">
                실제 투자/배당이 아닙니다 · 표시된 수익률은 가정에 기반한 예시입니다
              </p>
            </div>
          </div>
        </div>

        {/* 투자위험 고지 */}
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 mt-6">
          <h4 className="font-medium text-error mb-2">투자위험 고지</h4>
          <ul className="text-sm text-error space-y-1">
            <li>• 농산물 가격 변동으로 인한 손실 위험</li>
            <li>• 수확량 감소 및 판매 지연으로 인한 수익성 악화 가능성</li>
            <li>• 정산 지연 및 원금 손실 위험</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}