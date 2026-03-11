import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { saveAuth } from '@/features/auth/api';
import { Palette, Loader2 } from 'lucide-react';

/**
 * OAuth2 소셜 로그인 콜백 페이지.
 * 백엔드에서 리다이렉트된 URL의 쿼리 파라미터에서 JWT 토큰과 사용자 정보를 추출하여 저장합니다.
 */
export function OAuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const nickname = searchParams.get('nickname');
        const role = searchParams.get('role');

        if (token && userId && email && nickname && role) {
            saveAuth({
                token,
                userId: Number(userId),
                email,
                nickname,
                role,
            });
            // 홈으로 이동 후 상태 반영
            navigate('/');
            window.location.reload();
        } else {
            setError('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }, [searchParams, navigate]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f3e8ff 100%)' }}>
                <div className="text-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)' }}>
                        <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2' }}>
                        {error}
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2.5 rounded-xl text-white text-sm transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)', fontWeight: 600 }}
                    >
                        로그인 페이지로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f3e8ff 100%)' }}>
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#7C3AED' }} />
                <p className="text-gray-500 text-sm">로그인 처리 중...</p>
            </div>
        </div>
    );
}
