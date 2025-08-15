import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { OfferingCard } from '@/components/offerings/OfferingCard';
import { OfferingFilters } from '@/components/offerings/OfferingFilters';
import { LoadingGrid } from '@/components/ui/loading';
import { EmptyOfferings } from '@/components/ui/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Grid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Offering, MarketFilters, SortOption } from '@/types';
import { offeringsApi } from '@/services/api';
import { formatKRW, formatPercent, getDDay, calculateProgress } from '@/lib/utils';

export default function Market() {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<MarketFilters>({});
  const [sort, setSort] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadOfferings();
  }, [filters, sort, currentPage]);

  const loadOfferings = async () => {
    setIsLoading(true);
    try {
      const response = await offeringsApi.getOfferings(filters, sort, currentPage, 12);
      setOfferings(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load offerings:', error);
      setOfferings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: MarketFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  const filteredOfferings = offerings.filter(offering => 
    searchQuery === '' || 
    offering.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offering.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
    offering.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const OfferingListItem = ({ offering }: { offering: Offering }) => {
    const progress = calculateProgress(offering.lotsSold, offering.lotsTotal);
    const dDay = getDDay(offering.closeDate);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-subtle rounded-lg flex items-center justify-center text-2xl">
                🌱
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="secondary">{offering.crop}</Badge>
                  <Badge variant="outline">{offering.region}</Badge>
                  <Badge variant="default" className="bg-primary text-white">
                    {formatPercent(offering.expectedAPR)}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {offering.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {offering.producer.name} · {offering.producer.location}
                </p>
              </div>
            </div>
            
            <div className="text-right space-y-2">
              <div>
                <div className="text-sm text-text-secondary">구좌당</div>
                <div className="font-semibold">{formatKRW(offering.lotPriceKRW)}</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">모집률</div>
                <div className="font-semibold text-primary">{progress}%</div>
              </div>
              <div>
                <div className="text-sm text-text-secondary">마감</div>
                <div className="font-semibold">{dDay}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">마켓플레이스</h1>
          <p className="text-text-secondary">
            다양한 농산물 투자 기회를 찾아보세요. 총 {offerings.length}개의 공모가 진행 중입니다.
          </p>
        </div>

        {/* 검색 */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="공모명, 농산물, 지역으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* 필터 및 뷰 모드 */}
        <div className="flex items-center justify-between mb-6">
          <OfferingFilters
            filters={filters}
            sort={sort}
            onFiltersChange={handleFiltersChange}
            onSortChange={handleSortChange}
          />
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 결과 */}
        {isLoading ? (
          <LoadingGrid count={12} />
        ) : filteredOfferings.length === 0 ? (
          <EmptyOfferings />
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOfferings.map((offering) => (
                  <OfferingCard key={offering.id} offering={offering} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOfferings.map((offering) => (
                  <OfferingListItem key={offering.id} offering={offering} />
                ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  이전
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}