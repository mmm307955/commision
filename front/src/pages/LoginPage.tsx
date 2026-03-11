import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Palette, Eye, EyeOff } from 'lucide-react';
import { login, register, saveAuth } from '@/features/auth/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function LoginPage() {
    const navigate = useNavigate();
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (isRegister) {
                result = await register({ email, password, nickname });
            } else {
                result = await login({ email, password });
            }
            saveAuth(result);
            navigate('/');
            window.location.reload(); // Header 상태 반영
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error;
            if (msg) {
                setError(msg);
            } else if (err.response?.status === 401) {
                setError('이메일 또는 비밀번호가 일치하지 않습니다.');
            } else if (err.response?.status === 409) {
                setError('이미 사용 중인 이메일 또는 닉네임입니다.');
            } else {
                setError('서버와 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth2Login = (provider: 'google' | 'kakao') => {
        window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f3e8ff 100%)' }}>
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED, #a78bfa)' }}>
                            <Palette className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl" style={{ color: '#7C3AED', fontWeight: 700, letterSpacing: '-0.02em' }}>
                            커미미
                        </span>
                    </Link>
                    <p className="text-gray-500 text-sm mt-2">
                        {isRegister ? '새 계정을 만들어보세요' : '로그인하고 커미션을 시작하세요'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-gray-800 text-center mb-6" style={{ fontWeight: 700, fontSize: '1.3rem' }}>
                        {isRegister ? '회원가입' : '로그인'}
                    </h2>

                    {error && (
                        <div className="mb-4 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2' }}>
                            {error}
                        </div>
                    )}

                    {/* Social Login Buttons */}
                    {!isRegister && (
                        <div className="space-y-3 mb-6">
                            <button
                                type="button"
                                onClick={() => handleOAuth2Login('google')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-[0.98]"
                                style={{ fontWeight: 500 }}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                                </svg>
                                Google로 계속하기
                            </button>

                            <button
                                type="button"
                                onClick={() => handleOAuth2Login('kakao')}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-transparent text-sm transition-all hover:opacity-90 active:scale-[0.98]"
                                style={{
                                    backgroundColor: '#FEE500',
                                    color: '#191919',
                                    fontWeight: 500,
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 0C4.029 0 0 3.13 0 6.99c0 2.486 1.644 4.671 4.121 5.912l-1.05 3.852c-.094.344.301.616.592.408L7.88 14.41c.367.033.74.05 1.12.05 4.971 0 9-3.13 9-6.99S13.971 0 9 0z" fill="#191919" />
                                </svg>
                                카카오로 계속하기
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 py-1">
                                <div className="flex-1 h-px bg-gray-200"></div>
                                <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>또는 이메일로</span>
                                <div className="flex-1 h-px bg-gray-200"></div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1.5" style={{ fontWeight: 500 }}>이메일</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition-all focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-100"
                            />
                        </div>

                        {/* Nickname (register only) */}
                        {isRegister && (
                            <div>
                                <label className="block text-sm text-gray-600 mb-1.5" style={{ fontWeight: 500 }}>닉네임</label>
                                <input
                                    type="text"
                                    required
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="커미미에서 사용할 이름"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition-all focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1.5" style={{ fontWeight: 500 }}>비밀번호</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={isRegister ? '8자 이상 입력해주세요' : '비밀번호'}
                                    className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition-all focus:border-purple-300 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, #7C3AED, #a78bfa)',
                                fontWeight: 600,
                                boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
                            }}
                        >
                            {loading ? '처리 중...' : isRegister ? '회원가입' : '로그인'}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        {isRegister ? (
                            <>
                                이미 계정이 있으신가요?{' '}
                                <button
                                    onClick={() => { setIsRegister(false); setError(''); }}
                                    className="hover:underline"
                                    style={{ color: '#7C3AED', fontWeight: 600 }}
                                >
                                    로그인
                                </button>
                            </>
                        ) : (
                            <>
                                아직 계정이 없으신가요?{' '}
                                <button
                                    onClick={() => { setIsRegister(true); setError(''); }}
                                    className="hover:underline"
                                    style={{ color: '#7C3AED', fontWeight: 600 }}
                                >
                                    회원가입
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    © 2026 커미미(Comimi). 그림 커미션 플랫폼.
                </p>
            </div>
        </div>
    );
}
