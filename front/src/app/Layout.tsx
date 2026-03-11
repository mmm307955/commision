import { Outlet } from 'react-router';
import { Header } from '@/components/Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)' }}>
                <span className="text-white text-xs">🎨</span>
              </div>
              <span className="text-sm" style={{ color: '#7C3AED', fontWeight: 700 }}>커미미</span>
            </div>
            <p className="text-xs text-gray-400">
              © 2026 커미미(Comimi). 그림 커미션 플랫폼. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600">이용약관</a>
              <a href="#" className="hover:text-gray-600">개인정보처리방침</a>
              <a href="#" className="hover:text-gray-600">고객센터</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
