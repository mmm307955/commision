import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Package, Heart, Settings, ChevronRight, Star, LogOut, Loader2 } from 'lucide-react';
import { StatusStepper, type OrderStatus } from '@/features/order/components/StatusStepper';
import { fetchMyOrders, type OrderData } from '@/features/order/api';
import { getUser, logout, isLoggedIn } from '@/features/auth/api';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: '입금 대기', color: '#d97706', bg: '#fef3c7' },
  PAID: { label: '입금 확인', color: '#2563eb', bg: '#dbeafe' },
  IN_PROGRESS: { label: '작업 중', color: '#7C3AED', bg: '#f3f0ff' },
  REVIEW: { label: '검토 중', color: '#0891b2', bg: '#e0f2fe' },
  COMPLETED: { label: '완료', color: '#059669', bg: '#d1fae5' },
  CANCELLED: { label: '취소됨', color: '#dc2626', bg: '#fef2f2' },
  // 기존 mock 데이터 호환
  pending_payment: { label: '입금 대기', color: '#d97706', bg: '#fef3c7' },
  in_progress: { label: '작업 중', color: '#7C3AED', bg: '#f3f0ff' },
  review: { label: '검토 중', color: '#0891b2', bg: '#e0f2fe' },
  completed: { label: '완료', color: '#059669', bg: '#d1fae5' },
};

const NAV_ITEMS = [
  { id: 'orders', label: '주문 내역', icon: Package },
  { id: 'wishlist', label: '찜한 커미션', icon: Heart },
  { id: 'reviews', label: '내 리뷰', icon: Star },
  { id: 'settings', label: '계정 설정', icon: Settings },
];

export function MyPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState('');

  // 로그인 안 된 경우 로그인 페이지로
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  // 주문 데이터 로드
  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchMyOrders();
        setOrders(data);
        if (data.length > 0) {
          setExpandedOrder(data[0].id);
        }
      } catch (err) {
        setOrderError('주문 데이터를 불러올 수 없습니다.');
      } finally {
        setLoadingOrders(false);
      }
    }
    if (isLoggedIn()) {
      loadOrders();
    }
  }, []);

  const totalSpent = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const completedCount = orders.filter((o) => o.status === 'COMPLETED' || o.status === 'completed').length;

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div
        className="py-10 px-4"
        style={{ background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #a78bfa 100%)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center border-2 border-white/50 overflow-hidden">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-white mb-1" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
                {user.nickname}
              </h1>
              <p className="text-purple-200 text-sm">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              title="로그아웃"
            >
              <LogOut className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: '총 주문', value: `${orders.length}건` },
              { label: '완료', value: `${completedCount}건` },
              { label: '총 결제', value: `₩${totalSpent.toLocaleString()}` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3 text-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                <div className="text-white text-base mb-0.5" style={{ fontWeight: 700 }}>
                  {stat.value}
                </div>
                <div className="text-purple-200 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Nav */}
          <div className="md:w-48 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors border-b border-gray-50 last:border-0"
                    style={{
                      backgroundColor: activeTab === item.id ? '#f3f0ff' : 'transparent',
                      color: activeTab === item.id ? '#7C3AED' : '#4b5563',
                      fontWeight: activeTab === item.id ? 600 : 400,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                    {activeTab === item.id && (
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-gray-800" style={{ fontWeight: 700 }}>주문 내역</h2>

                {loadingOrders ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" style={{ color: '#7C3AED' }} />
                    <p className="text-gray-400 text-sm">주문 내역을 불러오는 중...</p>
                  </div>
                ) : orderError ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <p className="text-gray-400 text-sm">{orderError}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <p className="text-gray-400 text-sm">주문 내역이 없습니다.</p>
                    <Link to="/" className="mt-3 inline-block text-sm text-purple-600 hover:underline">
                      커미션 둘러보기
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => {
                    const statusInfo = STATUS_MAP[order.status] || { label: order.status, color: '#6b7280', bg: '#f3f4f6' };
                    const isExpanded = expandedOrder === order.id;

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                      >
                        {/* Order Summary */}
                        <button
                          className="w-full p-5 flex items-start gap-4 text-left hover:bg-gray-50/50 transition-colors"
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        >
                          {order.commissionThumbnailUrl && (
                            <img
                              src={order.commissionThumbnailUrl}
                              alt={order.commissionTitle}
                              className="w-16 h-16 rounded-xl object-cover shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-sm text-gray-800 line-clamp-2" style={{ fontWeight: 600 }}>
                                {order.commissionTitle}
                              </h3>
                              <ChevronRight
                                className="w-4 h-4 text-gray-300 shrink-0 transition-transform"
                                style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}
                              />
                            </div>
                            <div className="text-xs text-gray-400 mb-2">
                              {order.creatorNickname} · {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                            </div>
                            <div className="flex items-center justify-between">
                              <span
                                className="px-2.5 py-1 rounded-full text-xs"
                                style={{
                                  backgroundColor: statusInfo.bg,
                                  color: statusInfo.color,
                                  fontWeight: 600,
                                }}
                              >
                                {statusInfo.label}
                              </span>
                              <span className="text-sm" style={{ color: '#7C3AED', fontWeight: 700 }}>
                                ₩{order.totalPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </button>

                        {/* Expanded: Stepper + Details */}
                        {isExpanded && (
                          <div className="border-t border-gray-50 p-5 space-y-5">
                            {/* Status Stepper */}
                            <div>
                              <div className="text-sm text-gray-700 mb-4" style={{ fontWeight: 600 }}>
                                진행 상황
                              </div>
                              <StatusStepper status={order.status.toLowerCase().replace('pending', 'pending_payment') as OrderStatus} />
                            </div>

                            {/* Selected Options */}
                            {order.selectedOptions && order.selectedOptions.length > 0 && (
                              <div>
                                <div className="text-sm text-gray-700 mb-2" style={{ fontWeight: 600 }}>
                                  선택한 옵션
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {order.selectedOptions.map((opt) => (
                                    <span
                                      key={opt.optionName}
                                      className="px-3 py-1 rounded-full text-xs"
                                      style={{ backgroundColor: '#f3f0ff', color: '#7C3AED' }}
                                    >
                                      {opt.optionName} (+₩{opt.optionPrice.toLocaleString()})
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Requirements */}
                            <div>
                              <div className="text-sm text-gray-700 mb-2" style={{ fontWeight: 600 }}>
                                요구사항
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 leading-relaxed">
                                {order.requestDetail}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-1">
                              {(order.status === 'COMPLETED' || order.status === 'completed') && (
                                <button
                                  className="flex-1 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90"
                                  style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)', fontWeight: 600 }}
                                >
                                  리뷰 작성
                                </button>
                              )}
                              {(order.status === 'PENDING' || order.status === 'pending_payment') && (
                                <button
                                  className="flex-1 py-2.5 rounded-xl text-sm text-white transition-all hover:opacity-90"
                                  style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)', fontWeight: 600 }}
                                >
                                  입금하기
                                </button>
                              )}
                              <button className="flex-1 py-2.5 rounded-xl text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                                창작자 문의
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="text-4xl mb-3">💜</div>
                <p className="text-gray-500 text-sm">찜한 커미션이 없습니다.</p>
                <Link to="/" className="mt-3 inline-block text-sm text-purple-600 hover:underline">
                  커미션 둘러보기
                </Link>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                <div className="text-4xl mb-3">⭐</div>
                <p className="text-gray-500 text-sm">작성한 리뷰가 없습니다.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
                <h2 className="text-gray-800" style={{ fontWeight: 700 }}>계정 설정</h2>
                {[
                  { label: '닉네임', value: user.nickname },
                  { label: '이메일', value: user.email },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between py-3 border-b border-gray-50">
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">{field.label}</div>
                      <div className="text-sm text-gray-700">{field.value}</div>
                    </div>
                    <button className="text-sm text-purple-600 hover:underline">수정</button>
                  </div>
                ))}
                <button className="w-full py-2.5 rounded-xl text-sm border border-red-200 text-red-500 hover:bg-red-50 transition-colors mt-4">
                  회원 탈퇴
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
