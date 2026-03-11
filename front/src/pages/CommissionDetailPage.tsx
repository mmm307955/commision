import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Star, Clock, ChevronLeft, Shield, MessageCircle, Heart, Share2 } from 'lucide-react';
import { ImageCarousel } from '@/features/commission/components/ImageCarousel';
import { commissions } from '@/mocks/mockData';

export function CommissionDetailPage() {
  const { id } = useParams();
  const commission = commissions.find((c) => c.id === id);

  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(new Set());
  const [requirements, setRequirements] = useState('');
  const [ordered, setOrdered] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!commission) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">🎨</div>
        <p className="text-gray-500">커미션을 찾을 수 없습니다.</p>
        <Link to="/" className="text-sm text-purple-600 hover:underline">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const toggleOption = (optionId: string) => {
    setSelectedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }
      return next;
    });
  };

  const totalPrice =
    commission.basePrice +
    commission.options
      .filter((opt) => selectedOptions.has(opt.id))
      .reduce((sum, opt) => sum + opt.price, 0);

  const handleOrder = () => {
    if (!requirements.trim()) {
      alert('요구사항을 입력해주세요.');
      return;
    }
    setOrdered(true);
  };

  if (ordered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background: 'linear-gradient(135deg, #f3f0ff, #e9d5ff)' }}>
          🎉
        </div>
        <div className="text-center">
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: '1.4rem' }}>신청이 완료되었습니다!</h2>
          <p className="text-gray-500 text-sm">
            마이페이지에서 진행 상황을 확인할 수 있습니다.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 w-full max-w-sm shadow-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">커미션</span>
            <span className="text-gray-800" style={{ fontWeight: 500 }}>{commission.title}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">결제 금액</span>
            <span style={{ color: '#7C3AED', fontWeight: 600 }}>₩{totalPrice.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to="/mypage"
            className="px-6 py-3 rounded-full text-sm text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)' }}
          >
            마이페이지 보기
          </Link>
          <Link
            to="/"
            className="px-6 py-3 rounded-full text-sm border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            홈으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="flex items-center gap-1 hover:text-purple-600 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              커미션 목록
            </Link>
            <span>/</span>
            <span className="text-gray-600 line-clamp-1">{commission.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Info Area */}
          <div className="flex-1 space-y-6">
            {/* Image Carousel */}
            <ImageCarousel images={commission.images} title={commission.title} />

            {/* Creator Profile */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-gray-800 mb-4" style={{ fontWeight: 600 }}>창작자 정보</h3>
              <div className="flex items-start gap-4">
                <img
                  src={commission.creatorAvatar}
                  alt={commission.creatorNickname}
                  className="w-14 h-14 rounded-full object-cover border-2"
                  style={{ borderColor: '#e9d5ff' }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-gray-800" style={{ fontWeight: 600 }}>{commission.creatorNickname}</h4>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#f3f0ff', color: '#7C3AED' }}>
                      프로 창작자
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{commission.rating}</span>
                      <span className="text-gray-400">({commission.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>평균 {commission.deliveryDays}일</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    창의적이고 섬세한 아티스트로, 고객 만족을 최우선으로 생각합니다.
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full py-2.5 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                창작자에게 문의하기
              </button>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-gray-800 mb-4" style={{ fontWeight: 600 }}>커미션 상세 설명</h3>
              <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {commission.description}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-50">
                {commission.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: '#f3f0ff', color: '#7C3AED' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-gray-800 mb-4" style={{ fontWeight: 600 }}>구매 보호 안내</h3>
              <div className="space-y-3">
                {[
                  { icon: '🔒', title: '안전 결제', desc: '모든 결제는 암호화되어 안전하게 처리됩니다.' },
                  { icon: '🔄', title: '수정 보장', desc: '기본 2회 무료 수정이 포함됩니다.' },
                  { icon: '📦', title: '고해상도 납품', desc: 'PNG/PSD 원본 파일로 납품됩니다.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{item.title}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sticky Order Form */}
          <div className="lg:w-96">
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-50">
                  <div className="flex items-start justify-between mb-1">
                    <h2 className="text-gray-800 text-base line-clamp-2 flex-1 mr-2" style={{ fontWeight: 600 }}>
                      {commission.title}
                    </h2>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setLiked(!liked)}
                        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Heart
                          className="w-4 h-4"
                          fill={liked ? '#f43f5e' : 'none'}
                          strokeWidth={liked ? 0 : 2}
                          style={{ color: liked ? '#f43f5e' : '#9ca3af' }}
                        />
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{commission.rating}</span>
                    </div>
                    <span>·</span>
                    <span>리뷰 {commission.reviewCount}개</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {commission.deliveryDays}일
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Base Price */}
                  <div>
                    <div className="text-xs text-gray-400 mb-1">기본 가격</div>
                    <div className="text-xl" style={{ color: '#7C3AED', fontWeight: 700 }}>
                      ₩{commission.basePrice.toLocaleString()}
                    </div>
                  </div>

                  {/* Options */}
                  {commission.options.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-700 mb-2.5" style={{ fontWeight: 600 }}>추가 옵션</div>
                      <div className="space-y-2.5">
                        {commission.options.map((opt) => (
                          <label
                            key={opt.id}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={selectedOptions.has(opt.id)}
                                onChange={() => toggleOption(opt.id)}
                                className="sr-only"
                              />
                              <div
                                className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all"
                                style={{
                                  borderColor: selectedOptions.has(opt.id) ? '#7C3AED' : '#d1d5db',
                                  backgroundColor: selectedOptions.has(opt.id) ? '#7C3AED' : 'white',
                                }}
                              >
                                {selectedOptions.has(opt.id) && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-sm text-gray-700">{opt.label}</span>
                              <span className="text-sm" style={{ color: '#7C3AED', fontWeight: 500 }}>
                                +₩{opt.price.toLocaleString()}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Total Price */}
                  <div
                    className="rounded-xl p-4"
                    style={{ background: 'linear-gradient(135deg, #f3f0ff, #ede9fe)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">총 결제 금액</span>
                      <div className="text-right">
                        <div className="text-2xl" style={{ color: '#7C3AED', fontWeight: 700 }}>
                          ₩{totalPrice.toLocaleString()}
                        </div>
                        {selectedOptions.size > 0 && (
                          <div className="text-xs text-purple-400">
                            기본 + 옵션 {selectedOptions.size}개
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="text-sm text-gray-700 mb-2 block" style={{ fontWeight: 600 }}>
                      요구사항 입력 <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      placeholder={"어떤 그림을 원하시는지 자세히 알려주세요\n(예: 캐릭터 특징, 의상, 분위기, 배경 등)"}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 outline-none resize-none transition-all focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-100"
                    />
                    <div className="text-xs text-gray-400 text-right mt-1">
                      {requirements.length} 자
                    </div>
                  </div>

                  {/* Order Button */}
                  {commission.available ? (
                    <button
                      onClick={handleOrder}
                      className="w-full py-4 rounded-xl text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #7C3AED, #a78bfa)',
                        fontSize: '1rem',
                        fontWeight: 700,
                        boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35)',
                      }}
                    >
                      <Shield className="w-5 h-5" />
                      ₩{totalPrice.toLocaleString()} 신청하기
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-4 rounded-xl text-gray-400 bg-gray-100 cursor-not-allowed text-base"
                      style={{ fontWeight: 600 }}
                    >
                      현재 신청 마감 중
                    </button>
                  )}

                  <p className="text-xs text-gray-400 text-center">
                    신청 후 입금 확인 시 작업이 시작됩니다 · 수정 2회 포함
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
