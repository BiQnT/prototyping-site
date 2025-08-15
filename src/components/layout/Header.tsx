import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Menu, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();

  const navigation = [
    { name: '홈', href: '/', current: location.pathname === '/' },
    { name: '마켓', href: '/market', current: location.pathname === '/market' },
    { name: '포트폴리오', href: '/portfolio', current: location.pathname === '/portfolio' },
    { name: '지갑', href: '/wallet', current: location.pathname === '/wallet' },
  ];

  return (
    <header className="bg-white border-b border-card-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌱</span>
              </div>
              <span className="text-xl font-bold text-text-primary">GreenHarvest</span>
            </Link>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  item.current
                    ? 'text-primary bg-primary-subtle'
                    : 'text-text-secondary hover:text-text-primary hover:bg-hover-bg'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 우측 액션 */}
          <div className="flex items-center space-x-4">
            {/* 알림 */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                2
              </Badge>
            </Button>

            {/* 지갑 바로가기 */}
            <Link to="/wallet">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2">
                <Wallet className="h-4 w-4" />
                <span>지갑</span>
              </Button>
            </Link>

            {/* 사용자 메뉴 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-subtle rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden sm:block text-text-primary">김투자</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>프로필</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/portfolio" className="flex items-center w-full">
                    <span className="mr-2">📊</span>
                    <span>포트폴리오</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/payouts" className="flex items-center w-full">
                    <span className="mr-2">💰</span>
                    <span>배당 내역</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/producer" className="flex items-center w-full">
                    <span className="mr-2">🚜</span>
                    <span>프로듀서 대시보드</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 모바일 메뉴 */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}