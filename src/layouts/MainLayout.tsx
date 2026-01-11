import { useState, useEffect, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, LogOut, ShoppingCart, LogIn, ClipboardList, LayoutDashboard, Menu, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/useAuthStore';
import { useCart } from '../context/CartContext';
import CartModal from '../components/CartModal';

interface MainLayoutProps {
    children: ReactNode;
    hideFooter?: boolean;
}

export default function MainLayout({ children, hideFooter = false }: MainLayoutProps) {
    const { userType, logout, isAuthenticated, viewMode } = useAuthStore();
    const navigate = useNavigate();
    const { toggleCart, totalItems } = useCart();

    // Determine current view mode: prioritize userType (if logged in), otherwise viewMode (set by Landing Pages)
    // Default to 'personal' if neither is set
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryType = searchParams.get('type');

    const activeType = (location.pathname === '/company' || queryType === 'company')
        ? 'company'
        : (userType || viewMode || 'personal');
    const isCompany = activeType === 'company';


    const navItems = [
        {
            name: '홈',
            path: isCompany ? '/company' : '/personal',
            subMenus: isCompany
                ? [
                    { name: '소개', path: '/intro?type=company' },
                    { name: '공지사항', path: '/notice?type=company' },
                    { name: '이벤트', path: '/event?type=company' }
                ]
                : [
                    { name: '소개', path: '/intro' },
                    { name: '공지사항', path: '/notice' },
                    { name: '이벤트', path: '/event' },
                    { name: '채용', path: '/recruit' }
                ]
        },
        {
            name: 'K-Culture',
            path: isCompany ? '/partners?type=company' : '/partners',
            subMenus: [
                { name: 'K-코스', path: isCompany ? '/partners/course?type=company' : '/partners/course' },
                { name: '뷰티 & 병원', path: isCompany ? '/partners/beauty?type=company' : '/partners/beauty' },
                { name: '공연 & 전시', path: isCompany ? '/partners/performance?type=company' : '/partners/performance' },
                { name: '오디션', path: isCompany ? '/partners/audition?type=company' : '/partners/audition' },
                { name: '패션', path: isCompany ? '/partners/fashion?type=company' : '/partners/fashion' },
                { name: '맛집', path: isCompany ? '/partners/travel?type=company' : '/partners/travel' },
                { name: '가이드', path: isCompany ? '/partners/guide?type=company' : '/partners/guide' },
                // Specific Items for Company Only
                ...(isCompany ? [
                    { name: '제휴 문의', path: '/partners/inquiry?type=company' },
                    { name: '파트너 뉴스', path: '/partners/news?type=company' },
                    { name: '성공 사례', path: '/partners/success?type=company' }
                ] : [])
            ]
        },
        {
            name: '에이전트',
            path: isCompany ? '/agents?type=company' : '/agents',
            subMenus: [
                { name: '이용 가이드', path: isCompany ? '/agents/guide?type=company' : '/agents/guide' },
                { name: '수수료 안내', path: isCompany ? '/agents/fee?type=company' : '/agents/fee' },
                { name: '후기', path: isCompany ? '/agents/reviews?type=company' : '/agents/reviews' }
            ]
        },
        {
            name: 'Personal',
            path: isCompany ? '/contents?type=company' : '/contents',
            subMenus: isCompany
                ? [
                    { name: '등록컨텐츠', path: '/contents?type=company' }
                ]
                : [
                    { name: '등록컨텐츠', path: '/contents' },
                    { name: '나의 컨텐츠', path: '/contents/my' }
                ]
        },
        {
            name: '커뮤니티',
            path: '#',
            subMenus: [
                { name: '정보공유', path: isCompany ? '/community/info?type=company' : '/community/info' },
                { name: '항공사링크', path: isCompany ? '/community/airline?type=company' : '/community/airline' },
                { name: '호텔링크', path: isCompany ? '/community/hotel?type=company' : '/community/hotel' },
                { name: '교통링크', path: isCompany ? '/community/transport?type=company' : '/community/transport' },
                { name: '고객센터', path: isCompany ? '/community/center?type=company' : '/community/center' }
            ]
        },
        {
            name: '쇼핑',
            path: isCompany ? '/shop?type=company' : '/shop',
            subMenus: isCompany
                ? [
                    { name: '추천', path: '/shop?type=company#recommended' },
                    { name: '신상품', path: '/shop?type=company#new' },
                    { name: '브랜드', path: '/shop?type=company#brand' },
                    { name: '세일', path: '/shop?type=company#sale' }
                ]
                : [
                    { name: '추천', path: '/shop#recommended' },
                    { name: '신상품', path: '/shop#new' },
                    { name: '브랜드', path: '/shop#brand' },
                    { name: '세일', path: '/shop#sale' }
                ]
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
    const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);
    const [activeAllMenuCategory, setActiveAllMenuCategory] = useState<string | null>(null);

    // Close menus when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setExpandedMobileMenu(null);
        setIsAllMenuOpen(false);
        setActiveAllMenuCategory(null);
    }, [location.pathname]);

    // Set default active category when all menu opens
    useEffect(() => {
        if (isAllMenuOpen && navItems.length > 0 && !activeAllMenuCategory) {
            setActiveAllMenuCategory(navItems[0].name);
        }
    }, [isAllMenuOpen, navItems, activeAllMenuCategory]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${isCompany ? 'company' : 'personal'}`);
        }
    };


    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) {
            navigate(`/login?type=${isCompany ? 'company' : 'personal'}`);
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
                    {/* Top Bar: Logo and Auth/Cart (Desktop: Split, Mobile: Combined) */}
                    <div className="flex justify-between h-16 items-center border-b border-gray-100 relative">
                        <div className="flex items-center space-x-2 md:space-x-8">

                            <Link to={isCompany ? '/company' : '/personal'} className="flex items-center space-x-2">
                                <div className={clsx(
                                    "p-2 rounded-lg text-white",
                                    isCompany ? "bg-blue-600" : "bg-emerald-500"
                                )}>
                                    <ShoppingBag size={24} />
                                </div>
                                <span className="text-xl font-bold text-gray-800 hidden sm:block">
                                    {isCompany ? 'BizMall' : 'LifeStyle'}
                                </span>
                                <span className="text-xl font-bold text-gray-800 sm:hidden">
                                    {isCompany ? 'Biz' : 'LS'}
                                </span>
                            </Link>

                            {/* Search Bar - Added next to Logo */}
                            <div className="relative hidden sm:block ml-4 flex-grow max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="상품 검색"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors duration-200"
                                />
                            </div>
                        </div>

                        {/* Right Side: Auth & Cart */}
                        <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-500 hidden sm:block">
                                {userType === 'admin' ? '슈퍼 관리자' : (isCompany ? '기업 회원' : '개인 회원')}
                            </span>
                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors hidden sm:flex"
                                >
                                    <LogOut size={18} />
                                    <span>로그아웃</span>
                                </button>
                            ) : (
                                <Link
                                    to={`/login?type=${isCompany ? 'company' : 'personal'}`}
                                    className="flex items-center space-x-1 text-gray-600 hover:text-emerald-500 transition-colors hidden sm:flex"
                                >
                                    <LogIn size={18} />
                                    <span>로그인</span>
                                </Link>
                            )}

                            {/* Mobile Menu Button - Right on mobile */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors ml-2"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Second Bar: Navigation Links (Desktop Only) */}
                <div className="hidden md:block border-t border-gray-100 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center h-16">
                            {/* View All Menu Button - Leftmost */}
                            <div className="h-full flex items-center mr-8">
                                <button
                                    onClick={() => setIsAllMenuOpen(!isAllMenuOpen)}
                                    className={clsx(
                                        "flex items-center space-x-2 font-bold px-4 h-full border-b-2 transition-all",
                                        isAllMenuOpen ? "border-gray-900 text-gray-900" : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-900"
                                    )}
                                >
                                    <Menu size={20} />
                                    <span>전체보기</span>
                                </button>
                            </div>

                            {/* Separator */}
                            <div className="h-6 w-px bg-gray-300 mr-8"></div>

                            <div className="flex space-x-8 whitespace-nowrap items-center h-full">
                                {navItems.map((item) => (
                                    <div key={item.name} className="relative group flex items-center h-full">
                                        <Link
                                            to={item.path}
                                            onClick={(e) => item.path === '#' && e.preventDefault()}
                                            className={clsx(
                                                "text-base font-medium transition-colors border-b-2 border-transparent pb-1 block",
                                                "text-gray-600 hover:text-gray-900",
                                                isCompany
                                                    ? "group-hover:text-blue-600 group-hover:border-blue-600"
                                                    : "group-hover:text-emerald-500 group-hover:border-emerald-500",
                                                item.name === 'Personal' && (isCompany ? "text-blue-600" : "text-emerald-500")
                                            )}
                                        >
                                            {item.name}
                                        </Link>

                                        {/* Traditional Dropdown Menu (optional, keeping for consistent UX if "All Menu" is not used) */}
                                        <div className="absolute left-1/2 transform -translate-x-1/2 mt-0 w-48 bg-white border border-gray-100 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 top-full">
                                            <div className={clsx("h-1 w-full rounded-t-lg", isCompany ? "bg-blue-600" : "bg-emerald-500")}></div>
                                            <div className="py-2">
                                                {item.subMenus.map((subItem, idx) => {
                                                    const subName = typeof subItem === 'string' ? subItem : subItem.name;
                                                    const subPath = typeof subItem === 'string' ? '#' : subItem.path;
                                                    return (
                                                        <Link
                                                            key={idx}
                                                            to={subPath}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 whitespace-pre-line text-left leading-normal"
                                                        >
                                                            {subName}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>

                            {/* Order History & Cart Buttons - Far right of the nav bar (optional, or kept here as per previous request? Previous request said 'next to Home', but user said 'Left Align Bottom Nav'. Flex row with nav items usually takes space.
                            Left align implies Nav items start from left. 
                            Let's keep the Order/Cart icons inside the right side of this bar as per previous instruction to move them to bottom bar?
                            Wait, previous instruction was to move them to bottom bar.
                            Let's add them via `ml-auto` to push them to the right, or keep them close if that's preferred.
                            "Left Align" usually means the menu items are on the left.
                            Let's put the cart/order on the right side of this bottom bar to balance it out.
                            */}
                            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 ml-auto">
                                <button
                                    onClick={() => handleAuthAction(() => navigate('/order-history'))}
                                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
                                    title="Order History"
                                >
                                    <ClipboardList size={20} />
                                    <span className="text-sm font-medium">주문내역</span>
                                </button>

                                <button
                                    onClick={() => handleAuthAction(toggleCart)}
                                    className="relative text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
                                >
                                    <ShoppingCart size={20} />
                                    <span className="text-sm font-medium">장바구니</span>
                                    {totalItems > 0 && (
                                        <span className={clsx(
                                            "ml-1 text-xs font-bold text-white px-1.5 py-0.5 rounded-full",
                                            isCompany ? "bg-blue-600" : "bg-emerald-500"
                                        )}>
                                            {totalItems}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={clsx(
                        "md:hidden bg-white border-t overflow-hidden transition-all duration-300 ease-in-out",
                        isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                    )}
                >

                    <div className="h-[calc(100vh-64px)] overflow-y-auto">
                        {/* Mobile User Section */}
                        <div className="bg-gray-50 px-4 py-6 border-b border-gray-200">
                            {isAuthenticated ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-900 text-lg">
                                            {userType === 'admin' ? '슈퍼 관리자' : (isCompany ? '기업 회원' : '개인 회원')}님
                                        </span>
                                        <button
                                            onClick={handleLogout}
                                            className="text-sm text-gray-500 hover:text-red-500 underline"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => {
                                                navigate('/order-history');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center justify-center space-x-2 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
                                        >
                                            <ClipboardList size={20} className="text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">주문내역</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                toggleCart();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center justify-center space-x-2 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors relative"
                                        >
                                            <ShoppingCart size={20} className="text-gray-600" />
                                            <span className="text-sm font-medium text-gray-700">장바구니</span>
                                            {totalItems > 0 && (
                                                <span className={clsx(
                                                    "absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs font-bold text-white rounded-full",
                                                    isCompany ? "bg-blue-600" : "bg-emerald-500"
                                                )}>
                                                    {totalItems}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-gray-500 mb-4 text-sm">로그인이 필요합니다.</p>
                                    <Link
                                        to={`/login?type=${isCompany ? 'company' : 'personal'}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={clsx(
                                            "w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-white font-bold shadow-md transition-transform active:scale-95",
                                            isCompany ? "bg-blue-600" : "bg-emerald-500"
                                        )}
                                    >
                                        <LogIn size={20} />
                                        <span>로그인 / 회원가입</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-2 space-y-1">
                            {navItems.map((item) => (
                                <div key={item.name} className="border-b border-gray-100 last:border-0">
                                    <button
                                        onClick={() => {
                                            if (item.subMenus && item.subMenus.length > 0) {
                                                setExpandedMobileMenu(expandedMobileMenu === item.name ? null : item.name);
                                            } else {
                                                navigate(item.path);
                                                setIsMobileMenuOpen(false);
                                            }
                                        }}
                                        className="w-full flex justify-between items-center py-4 text-left text-base font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        <span>{item.name}</span>
                                        {item.subMenus && item.subMenus.length > 0 && (
                                            expandedMobileMenu === item.name ? <ChevronUp size={20} /> : <ChevronDown size={20} />
                                        )}
                                    </button>

                                    <div
                                        className={clsx(
                                            "bg-gray-50 space-y-1 overflow-hidden transition-all duration-300",
                                            expandedMobileMenu === item.name ? "max-h-[500px] py-2" : "max-h-0"
                                        )}
                                    >
                                        {item.subMenus.map((sub, idx) => {
                                            // Reuse logic from Custom Link handling if needed, but simplified here
                                            // As per desktop code, subItems can be string or objects
                                            // Let's assume standard object structure or fix previous inconsistent typing if present.
                                            // Checking previous code, it handled string | object.
                                            let subName = '';
                                            let subPath = '#';

                                            if (typeof sub === 'string') {
                                                subName = sub;
                                            } else {
                                                subName = sub.name;
                                                subPath = sub.path;
                                            }

                                            return (
                                                <Link
                                                    key={idx}
                                                    to={subPath}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block px-6 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                                                >
                                                    {subName}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Desktop All Menu Overlay - Re-designed */}
                {isAllMenuOpen && (
                    <div
                        className="hidden md:block absolute top-[132px] left-0 w-full bg-white z-50 shadow-xl border-t border-gray-100 border-b-4 border-gray-100 animate-in fade-in slide-in-from-top-1"
                        style={{ minHeight: '400px' }}
                    >
                        <div className="max-w-7xl mx-auto flex h-full min-h-[400px]">
                            {/* Overlay Sidebar */}
                            <div className="w-1/4 bg-gray-50 border-r border-gray-100 py-8">
                                <ul className="space-y-1 px-4">
                                    {navItems.map((item) => (
                                        <li key={item.name}>
                                            <button
                                                onMouseEnter={() => setActiveAllMenuCategory(item.name)}
                                                onClick={() => navigate(item.path)}
                                                className={clsx(
                                                    "w-full text-left px-6 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-between",
                                                    activeAllMenuCategory === item.name
                                                        ? (isCompany ? "bg-white text-blue-600 shadow-sm" : "bg-white text-emerald-600 shadow-sm")
                                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                                )}
                                            >
                                                <span>{item.name}</span>
                                                {activeAllMenuCategory === item.name && (
                                                    <ChevronDown size={20} className="-rotate-90 transform" />
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Overlay Content Area */}
                            <div className="w-3/4 p-12 bg-white flex flex-col">
                                {activeAllMenuCategory && (
                                    <div className="animate-in fade-in duration-300">
                                        <h3 className="text-2xl font-bold mb-8 text-gray-800 pb-4 border-b border-gray-100">
                                            {activeAllMenuCategory}
                                        </h3>
                                        <div className="grid grid-cols-3 gap-8">
                                            {navItems.find(i => i.name === activeAllMenuCategory)?.subMenus.map((sub, idx) => {
                                                const subName = typeof sub === 'string' ? sub : sub.name;
                                                const subPath = typeof sub === 'string' ? '#' : sub.path;

                                                return (
                                                    <Link
                                                        key={idx}
                                                        to={subPath}
                                                        onClick={() => setIsAllMenuOpen(false)}
                                                        className="group flex flex-col space-y-1 hover:bg-gray-50 p-4 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                                                    >
                                                        <span className="font-medium text-gray-700 group-hover:text-black">
                                                            {subName.split('\n')[0]}
                                                        </span>
                                                        {subName.includes('\n') && (
                                                            <span className="text-xs text-gray-400">
                                                                {subName.split('\n')[1]}
                                                            </span>
                                                        )}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* Backdrop */}
                {isAllMenuOpen && (
                    <div
                        className="fixed inset-0 top-[132px] -z-10 bg-black/30 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsAllMenuOpen(false)}
                    ></div>
                )}
            </nav>

            {userType === 'admin' && (
                <button
                    onClick={() => navigate('/admin')}
                    className="fixed top-4 right-4 z-[100] px-4 py-2 bg-red-600 text-white rounded-full shadow-xl flex items-center space-x-2 hover:bg-red-700 transition-all hover:scale-105 border-2 border-white ring-2 ring-red-200"
                    title="Return to Admin Dashboard"
                >
                    <LayoutDashboard size={20} />
                    <span className="font-bold">관리자 페이지</span>
                </button>
            )}

            <CartModal />

            <main className="flex-grow">
                {children}
            </main>

            {
                !hideFooter && (
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
                )
            }
        </div >
    );
}
