import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { MarketFilters, SortOption } from '@/types';

interface OfferingFiltersProps {
  filters: MarketFilters;
  sort: SortOption;
  onFiltersChange: (filters: MarketFilters) => void;
  onSortChange: (sort: SortOption) => void;
}

const crops = ['토마토', '한라봉', '샤인머스켓', '딸기', '감자', '사과', '배'];
const regions = ['제주', '완도', '김천', '논산', '강원', '경남', '전남'];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'yield_desc', label: '수익률 높은 순' },
  { value: 'yield_asc', label: '수익률 낮은 순' },
  { value: 'closing_soon', label: '마감 임박순' },
  { value: 'newest', label: '신규순' },
];

export function OfferingFilters({ filters, sort, onFiltersChange, onSortChange }: OfferingFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({});
  };

  const getSortLabel = () => {
    return sortOptions.find(option => option.value === sort)?.label || '신규순';
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        {/* 필터 버튼 */}
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>필터</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="start">
            <DropdownMenuLabel>농산물 종류</DropdownMenuLabel>
            {crops.map(crop => (
              <DropdownMenuItem
                key={crop}
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    crop: filters.crop === crop ? undefined : crop
                  });
                }}
                className={filters.crop === crop ? 'bg-primary-subtle' : ''}
              >
                <span className="mr-2">{crop === filters.crop ? '✓' : ''}</span>
                {crop}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel>지역</DropdownMenuLabel>
            {regions.map(region => (
              <DropdownMenuItem
                key={region}
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    region: filters.region === region ? undefined : region
                  });
                }}
                className={filters.region === region ? 'bg-primary-subtle' : ''}
              >
                <span className="mr-2">{region === filters.region ? '✓' : ''}</span>
                {region}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuLabel>특별 필터</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                onFiltersChange({
                  ...filters,
                  closingSoon: !filters.closingSoon
                });
              }}
              className={filters.closingSoon ? 'bg-primary-subtle' : ''}
            >
              <span className="mr-2">{filters.closingSoon ? '✓' : ''}</span>
              마감 임박
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onFiltersChange({
                  ...filters,
                  newOfferings: !filters.newOfferings
                });
              }}
              className={filters.newOfferings ? 'bg-primary-subtle' : ''}
            >
              <span className="mr-2">{filters.newOfferings ? '✓' : ''}</span>
              신규 공모
            </DropdownMenuItem>

            {activeFiltersCount > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearFilters} className="text-error">
                  필터 초기화
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 활성 필터 표시 */}
        <div className="flex items-center space-x-2">
          {filters.crop && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{filters.crop}</span>
              <button
                onClick={() => onFiltersChange({ ...filters, crop: undefined })}
                className="ml-1 hover:text-error"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.region && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{filters.region}</span>
              <button
                onClick={() => onFiltersChange({ ...filters, region: undefined })}
                className="ml-1 hover:text-error"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.closingSoon && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>마감 임박</span>
              <button
                onClick={() => onFiltersChange({ ...filters, closingSoon: undefined })}
                className="ml-1 hover:text-error"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.newOfferings && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>신규 공모</span>
              <button
                onClick={() => onFiltersChange({ ...filters, newOfferings: undefined })}
                className="ml-1 hover:text-error"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* 정렬 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center space-x-2">
            <span>{getSortLabel()}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sortOptions.map(option => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={sort === option.value ? 'bg-primary-subtle' : ''}
            >
              <span className="mr-2">{sort === option.value ? '✓' : ''}</span>
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}