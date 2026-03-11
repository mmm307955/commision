import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { SlidersHorizontal, TrendingUp, Sparkles, Star, Search, X } from 'lucide-react';
import { CommissionCard } from '@/features/commission/components/CommissionCard';
import { commissions as mockCommissions } from '@/mocks/mockData';
import { fetchCommissions } from '@/features/commission/api';

const FILTER_TABS = [
  { id: 'all', label: '전체', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'popular', label: '인기순', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'rating', label: '평점순', icon: <Star className="w-3.5 h-3.5" /> },
  { id: 'available', label: '신청 가능', icon: null },
];

const PRICE_FILTERS = [
  { id: 'all', label: '전체 가격' },
  { id: 'under30', label: '3만원 이하' },
  { id: '30to60', label: '3~6만원' },
  { id: 'over60', label: '6만원 이상' },
];

export function HomePage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [activeTab, setActiveTab] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [commissions, setCommissions] = useState(mockCommissions);

  // 실제 API에서 커미션 데이터 가져오기 (실패 시 mock 유지)
  useEffect(() => {
    fetchCommissions()
      .then((data) => {
        if (data.length > 0) {
          const mapped = data.map((c) => ({
            id: String(c.id),
            title: c.title,
            description: c.description || '',
            basePrice: c.basePrice,
            creatorNickname: c.artistNickname,
            creatorAvatar: c.artistProfileImageUrl || '/placeholder-avatar.png',
            thumbnailUrl: c.thumbnailUrl || '/placeholder.png',
            images: c.thumbnailUrl ? [c.thumbnailUrl] : ['/placeholder.png'],
            tags: [],
            rating: 0,
            reviewCount: 0,
            deliveryDays: 7,
            available: c.status === 'OPEN',
            options: c.options.map((o) => ({
              id: String(o.id),
              label: o.optionName,
              price: o.additionalPrice,
            })),
          }));
          setCommissions(mapped as typeof mockCommissions);
        }
      })
      .catch(() => {
        // API 실패 시 mock 데이터 유지
      });
  }, []);

  const filtered = useMemo(() => {
    let result = [...commissions];

    // Search
    if (searchQuery) {
      result = result.filter(
        (c) =>
          c.title.includes(searchQuery) ||
          c.creatorNickname.includes(searchQuery) ||
          c.tags.some((t) => t.includes(searchQuery))
      );
    }

    // Tab filter
    if (activeTab === 'popular') {
      result = result.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (activeTab === 'rating') {
      result = result.sort((a, b) => b.rating - a.rating);
    } else if (activeTab === 'available') {
      result = result.filter((c) => c.available);
    }

    // Price filter
    if (priceFilter === 'under30') {
      result = result.filter((c) => c.basePrice < 30000);
    } else if (priceFilter === '30to60') {
      result = result.filter((c) => c.basePrice >= 30000 && c.basePrice <= 60000);
    } else if (priceFilter === 'over60') {
      result = result.filter((c) => c.basePrice > 60000);
    }

    return result;
  }, [searchQuery, activeTab, priceFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden py-14 px-4"
        style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #a78bfa 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white/90 text-sm mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            나만을 위한 그림, 지금 주문하세요
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1.3 }}>
            당신만의 특별한 아트워크를<br />만나보세요 🎨
          </h1>
          <p className="text-purple-100 text-sm mb-8 max-w-md mx-auto">
            개성 넘치는 창작자들의 커미션을 탐색하고,<br />나만을 위한 그림을 의뢰해보세요.
          </p>

          {/* Hero search bar */}
          <form
            className="max-w-sm mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement;
              window.location.href = `/?search=${encodeURIComponent(input.value)}`;
            }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                defaultValue={searchQuery}
                placeholder="찾고 싶은 커미션을 입력해보세요"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-gray-800 text-sm outline-none shadow-lg placeholder:text-gray-400"
              />
            </div>
          </form>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #c4b5fd, transparent)' }} />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? '#7C3AED' : 'white',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  border: `1.5px solid ${activeTab === tab.id ? '#7C3AED' : '#e5e7eb'}`,
                  fontWeight: activeTab === tab.id ? 600 : 400,
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            필터
          </button>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 self-center mr-2">가격대</span>
              {PRICE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPriceFilter(f.id)}
                  className="px-3 py-1.5 rounded-full text-sm transition-all"
                  style={{
                    backgroundColor: priceFilter === f.id ? '#f3f0ff' : '#f9fafb',
                    color: priceFilter === f.id ? '#7C3AED' : '#6b7280',
                    border: `1.5px solid ${priceFilter === f.id ? '#a78bfa' : '#e5e7eb'}`,
                    fontWeight: priceFilter === f.id ? 600 : 400,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search result notice */}
        {searchQuery && (
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
            <span>
              "<span className="text-purple-700" style={{ fontWeight: 600 }}>{searchQuery}</span>" 검색 결과 {filtered.length}개
            </span>
            <a href="/" className="flex items-center gap-1 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
              초기화
            </a>
          </div>
        )}

        {/* Commission Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {filtered.map((commission) => (
              <CommissionCard key={commission.id} commission={commission} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎨</div>
            <p className="text-gray-500 text-sm">검색 결과가 없습니다.</p>
            <a href="/" className="mt-4 inline-block text-sm text-purple-600 hover:underline">
              전체 커미션 보기
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
