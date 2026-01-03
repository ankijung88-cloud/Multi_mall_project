import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function Login() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') as 'personal' | 'company' | null;
    const navigate = useNavigate();
    const location = useLocation();
    const login = useAuthStore((state) => state.login);

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Redirect if invalid type
    useEffect(() => {
        if (type !== 'personal' && type !== 'company') {
            navigate('/');
        }
    }, [type, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Logic: If email is unknown, redirect to Signup
        const isKnownUser = email.startsWith('user') || email.startsWith('company') || email.startsWith('admin');

        // Logic check: Allow admin to bypass member check or strictly check?
        // For simplicity, let's keep the user's requested logic about "unknown ID":
        // But for "Auto-fill name", we need to actually FIND the user in mall_members.

        const members = JSON.parse(localStorage.getItem('mall_members') || '[]');
        const activeTab = type || 'personal'; // Default if null, though effect redirects

        if (activeTab === 'personal' || activeTab === 'company') {
            const foundUser = members.find((m: any) => m.email === email && m.type.toLowerCase() === activeTab);

            if (foundUser) {
                // User found, login with full data
                login(activeTab, foundUser);
                const from = (location.state as any)?.from;
                navigate(from || (activeTab === 'company' ? '/company' : '/personal'));
            } else {
                // If not found in DB
                if (isKnownUser) {
                    // It's a "demo" allowed ID (e.g. user@example.com) that might not be in DB yet? 
                    // Or implies we should create a mock session for them?
                    // Let's create a mock session user so the Name works.
                    login(activeTab, { name: 'Demo User', email: email, type: activeTab });
                    const from = (location.state as any)?.from;
                    navigate(from || (activeTab === 'company' ? '/company' : '/personal'));
                } else {
                    // Unknown ID
                    alert('등록되지 않은 아이디입니다. 회원가입 페이지로 이동합니다.');
                    navigate(`/signup?type=${activeTab}`);
                }
            }
        } else {
            // Admin Login (Login page doesn't usually handle admin param here, but just in case)
            // AdminLogin.tsx handles admin. Login.tsx is for personal/company.
        }

        setIsLoading(false);
    };

    const isCompany = type === 'company';

    return (
        <AuthLayout>
            <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
                <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                    <h2 className={clsx("mt-2 text-center text-3xl font-extrabold tracking-tight", isCompany ? "text-blue-900" : "text-emerald-900")}>
                        {isCompany ? '비즈니스 포털' : '회원 로그인'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isCompany ? '기업' : '개인'} 계정에 접속하려면 로그인하세요
                    </p>
                    <p className="text-xs text-gray-400 mt-1 text-center">('user@...' 또는 'company@...' 로 로그인해보세요)</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            이메일 주소
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={clsx(
                                    "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all",
                                    isCompany ? "focus:ring-blue-500 focus:border-blue-500" : "focus:ring-emerald-500 focus:border-emerald-500"
                                )}
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            비밀번호
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={clsx(
                                    "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all",
                                    isCompany ? "focus:ring-blue-500 focus:border-blue-500" : "focus:ring-emerald-500 focus:border-emerald-500"
                                )}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className={clsx("h-4 w-4 border-gray-300 rounded", isCompany ? "text-blue-600 focus:ring-blue-500" : "text-emerald-600 focus:ring-emerald-500")}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                로그인 유지
                            </label>
                        </div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className={clsx(
                                "w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all",
                                isCompany
                                    ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                    : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
                                isLoading && "opacity-75 cursor-not-allowed"
                            )}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                            ) : (
                                '로그인'
                            )}
                        </motion.button>
                    </div>

                    {/* Additional Options */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-3">
                            <Link
                                to={`/find-account?type=${type || 'personal'}&mode=id`}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                아이디 찾기
                            </Link>
                            <Link
                                to={`/find-account?type=${type || 'personal'}&mode=password`}
                                className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                비밀번호 찾기
                            </Link>
                            <Link
                                to={`/signup?type=${type || 'personal'}`}
                                className={clsx(
                                    "flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-xs font-bold rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2",
                                    isCompany ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
                                )}
                            >
                                회원가입
                            </Link>
                        </div>
                    </div>
                </form>
            </div >
        </AuthLayout >
    );
}
