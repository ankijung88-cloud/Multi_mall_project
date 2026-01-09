import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Building, Loader2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/useAuthStore';

export default function Signup() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') as 'personal' | 'company' | null;
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        businessNumber: ''
    });

    useEffect(() => {
        if (type !== 'personal' && type !== 'company') {
            navigate('/signup?type=personal');
        }
    }, [type, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Password Policy (8-12 chars, letter + number, special chars allowed)
        // Relaxed: Allow uppercase and common special characters
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&.\-_]{8,12}$/;
        if (!passwordRegex.test(formData.password)) {
            alert('비밀번호는 8~12자의 영문, 숫자, 특수문자(@$!%*#?&.-_)를 포함하여 입력해주세요.');
            return;
        }

        // Validation: Password Match
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                type: type === 'company' ? 'company' : 'personal',
                companyName: formData.companyName,
                businessNumber: formData.businessNumber
            });

            if (res.data.success) {
                // Auto login after signup
                login(type, res.data.user);
                navigate(type === 'company' ? '/company' : '/personal');
            } else {
                alert(res.data.message || '회원가입 실패');
            }
        } catch (error: any) {
            console.error("Signup failed:", error);
            alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const isCompany = type === 'company';
    const bgColor = isCompany ? 'bg-blue-600' : 'bg-emerald-600';
    const hoverColor = isCompany ? 'hover:bg-blue-700' : 'hover:bg-emerald-700';
    const ringColor = isCompany ? 'focus:ring-blue-500' : 'focus:ring-emerald-500';
    const textColor = isCompany ? 'text-blue-600' : 'text-emerald-600';

    return (
        <AuthLayout>
            <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
                {/* Type Switcher */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
                        <Link
                            to="?type=personal"
                            className={clsx(
                                "px-6 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                type === 'personal'
                                    ? "bg-white text-emerald-600 shadow-sm ring-1 ring-black/5"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            개인 회원
                        </Link>
                        <Link
                            to="?type=company"
                            className={clsx(
                                "px-6 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                type === 'company'
                                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            기업 회원
                        </Link>
                    </div>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                    <h2 className={clsx("mt-2 text-center text-3xl font-extrabold tracking-tight", isCompany ? "text-blue-900" : "text-emerald-900")}>
                        {isCompany ? '파트너 회원가입' : '회원가입'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {isCompany ? '기업' : '개인'} 회원으로 가입하고 혜택을 누리세요
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            성함
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all ${ringColor}`}
                                placeholder="홍길동"
                            />
                        </div>
                    </div>

                    {isCompany && (
                        <>
                            <div>
                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                                    회사명
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Building className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="companyName"
                                        name="companyName"
                                        type="text"
                                        required
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all ${ringColor}`}
                                        placeholder="(주)한국상사"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="businessNumber" className="block text-sm font-medium text-gray-700">
                                    사업자등록번호
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <input
                                        id="businessNumber"
                                        name="businessNumber"
                                        type="text"
                                        required
                                        value={formData.businessNumber}
                                        onChange={handleChange}
                                        className={`block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all ${ringColor}`}
                                        placeholder="000-00-00000"
                                    />
                                </div>
                            </div>
                        </>
                    )}

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
                                value={formData.email}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all ${ringColor}`}
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
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all ${ringColor}`}
                                placeholder="8~12자 영문/숫자/특수문자"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            비밀번호 확인
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-all ${ringColor}`}
                                placeholder="비밀번호 재입력"
                            />
                        </div>
                    </div>

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${bgColor} ${hoverColor} ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                            ) : (
                                '계정 생성'
                            )}
                        </motion.button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                이미 계정이 있으신가요?
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <Link to={`/login?type=${type}`} className={`font-medium ${textColor} hover:underline inline-flex items-center`}>
                            로그인하기
                            <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
