import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, ShoppingCart, LogIn, ClipboardList } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/useAuthStore';
import { useCart } from '../context/CartContext';
import CartModal from '../components/CartModal';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { userType, logout, isAuthenticated, viewMode } = useAuthStore();
    const navigate = useNavigate();
    const { toggleCart, totalItems } = useCart();

    // Determine current view mode: prioritize userType (if logged in), otherwise viewMode (set by Landing Pages)
    // Default to 'personal' if neither is set
    const activeType = userType || viewMode || 'personal';
    const isCompany = activeType === 'company';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) {
            navigate('/login?type=personal');
            return;
        }
        action();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className={clsx(
                "bg-white shadow-sm sticky top-0 z-50 transition-colors duration-300",
                isCompany ? "border-b-4 border-blue-600" : "border-b-4 border-emerald-500"
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center relative">
                        <div className="flex items-center space-x-8">
                            <Link to={isCompany ? '/company' : '/personal'} className="flex items-center space-x-2">
                                <div className={clsx(
                                    "p-2 rounded-lg text-white",
                                    isCompany ? "bg-blue-600" : "bg-emerald-500"
                                )}>
                                    <ShoppingBag size={24} />
                                </div>
                                <span className="text-xl font-bold text-gray-800">
                                    {isCompany ? 'BizMall' : 'LifeStyle'}
                                </span>
                            </Link>
                        </div>

                        {/* Centered Navigation Menu */}
                        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
                            {[
                                { name: '홈', path: isCompany ? '/company' : '/personal' },
                                { name: '쇼핑', path: '/shop' },
                                { name: 'K-Culture', path: '/partners' },
                                { name: '에이전트', path: '/agents' },
                                { name: 'Personal', path: '/contents' },
                                { name: '커뮤니티', path: '#' },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={clsx(
                                        "text-base font-medium transition-colors",
                                        "text-gray-600 hover:text-gray-900",
                                        isCompany
                                            ? "hover:text-blue-600"
                                            : "hover:text-emerald-500",
                                        item.name === 'Personal' && (isCompany ? "text-blue-600" : "text-emerald-500")
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => handleAuthAction(() => navigate('/order-history'))}
                                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                                title="Order History"
                            >
                                <ClipboardList size={24} />
                            </button>

                            <button
                                onClick={() => handleAuthAction(toggleCart)}
                                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ShoppingCart size={24} />
                                {totalItems > 0 && (
                                    <span className={clsx(
                                        "absolute -top-1 -right-1 text-xs font-bold text-white px-1.5 py-0.5 rounded-full",
                                        isCompany ? "bg-blue-600" : "bg-emerald-500"
                                    )}>
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            <span className="text-sm font-medium text-gray-500">
                                {isCompany ? '기업 회원' : '개인 회원'}
                            </span>
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span>로그아웃</span>
                                </button>
                            ) : (
                                <Link
                                    to="/login?type=personal"
                                    className="flex items-center space-x-1 text-gray-600 hover:text-emerald-500 transition-colors"
                                >
                                    <LogIn size={18} />
                                    <span>로그인</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <CartModal />

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">회사 소개</h3>
                        <p className="text-gray-400">{isCompany ? '기업' : '모두'}를 위한 맞춤형 프리미엄 쇼핑 경험을 제공합니다.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">고객 센터</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>문의하기</li>
                            <li>배송 정책</li>
                            <li>반품 및 환불</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">소셜 미디어</h3>
                        <div className="flex space-x-4">
                            {/* Social icons would go here */}
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    © 2024 {isCompany ? 'BizMall Inc.' : 'LifeStyle Shop'}. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
