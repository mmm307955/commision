import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Search, User, Menu, X, Palette, Bell, Heart, LogOut } from 'lucide-react';
import { getUser, logout, isLoggedIn } from '@/features/auth/api';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const user = getUser();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)' }}>
              <Palette className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg hidden sm:block" style={{ color: '#7C3AED', fontWeight: 700, letterSpacing: '-0.02em' }}>
              커미미
            </span>
          </Link>

          {/* Search Bar - desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="커미션 검색하기..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm outline-none transition-all focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </form>

          {/* Nav Actions - desktop */}
          <div className="hidden md:flex items-center gap-2">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
              <Heart className="w-5 h-5" />
            </button>

            {loggedIn ? (
              <>
                <Link
                  to="/mypage"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all ${location.pathname === '/mypage'
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <User className="w-4 h-4" />
                  {user?.nickname || '마이페이지'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full text-sm text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)' }}
              >
                로그인
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-gray-100 pt-3">
            <form onSubmit={handleSearch} className="flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="커미션 검색하기..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-sm outline-none"
                />
              </div>
            </form>
            <div className="flex flex-col gap-2">
              {loggedIn ? (
                <>
                  <Link
                    to="/mypage"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    {user?.nickname || '마이페이지'}
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-white"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  로그인 / 회원가입
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
