import { useState, useEffect, type ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, ClipboardList, LayoutDashboard, Menu, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../store/useAuthStore';
import { useCart } from '../context/CartContext';
import CartModal from '../components/CartModal';
import PrivacyModal from '../components/PrivacyModal';
import InquiryModal from '../components/InquiryModal';
import FAQModal from '../components/FAQModal';

interface MainLayoutProps {
    children: ReactNode;
    hideFooter?: boolean;
}

export default function MainLayout({ children, hideFooter = false }: MainLayoutProps) {
    const { userType, logout, isAuthenticated, viewMode } = useAuthStore();
    const navigate = useNavigate();
    const { toggleCart, totalItems } = useCart();

    // Modal State
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showInquiryModal, setShowInquiryModal] = useState(false);
    const [showFAQModal, setShowFAQModal] = useState(false);

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
                    { name: '이벤트', path: '/event?type=company' },
                    { name: '오시는 길', path: '/location?type=company' },
                    { name: '사이트맵', path: '/sitemap?type=company' }
                ]
                : [
                    { name: '소개', path: '/intro' },
                    { name: '공지사항', path: '/notice' },
                    { name: '이벤트', path: '/event' },
                    { name: '채용', path: '/recruit' },
                    { name: '오시는 길', path: '/location' }
                ]
        },
        {
            name: 'K-컬처',
            path: isCompany ? '/partners?type=company' : '/partners',
            subMenus: [
                { name: 'K-COURSE', path: isCompany ? '/partners/course?type=company' : '/partners/course' },
                {
                    name: 'K-BEAUTY',
                    path: isCompany ? '/partners/beauty?type=company' : '/partners/beauty',
                    subMenus: [
                        { name: 'COLOR', path: '#' },
                        { name: 'PLASTIC SURGERY', path: '#' },
                        { name: 'SKIN', path: '#' },
                        { name: 'HAIR', path: '#' }
                    ]
                },
                {
                    name: 'K-PERFORMANCE',
                    path: isCompany ? '/partners/performance?type=company' : '/partners/performance',
                    subMenus: [
                        { name: '댄스', path: '#' },
                        { name: '사진', path: '#' },
                        { name: '공연', path: '#' },
                        { name: '전시', path: '#' }
                    ]
                },
                { name: 'K-AUDITION', path: isCompany ? '/partners/audition?type=company' : '/partners/audition' },
                { name: 'K-FASHION', path: isCompany ? '/partners/fashion?type=company' : '/partners/fashion' },
                { name: 'K-FOOD', path: isCompany ? '/partners/travel?type=company' : '/partners/travel' },
                { name: 'K-GUIDE', path: isCompany ? '/partners/guide?type=company' : '/partners/guide' }
            ]
        },
        {
            name: '에이전트',
            path: isCompany ? '/agents?type=company' : '/agents',
            subMenus: [
                { name: '이용 가이드', path: isCompany ? '/agents/guide?type=company' : '/agents/guide' },
                { name: '수수료 안내', path: isCompany ? '/agents/fee?type=company' : '/agents/fee' },
                { name: '후기', path: isCompany ? '/agents/reviews?type=company' : '/agents/reviews' },
                { name: '혜택 안내', path: isCompany ? '/agents/benefits?type=company' : '/agents/benefits' },
                { name: '자주 묻는 질문', path: isCompany ? '/agents/faq?type=company' : '/agents/faq' }
            ]
        },
        {
            name: '퍼스널',
            path: isCompany ? '/contents?type=company' : '/contents',
            subMenus: isCompany
                ? [
                    { name: '등록컨텐츠', path: '/contents?type=company' },
                    { name: '통계', path: '/contents/stats?type=company' },
                    { name: '설정', path: '/contents/settings?type=company' },
                    { name: '알림', path: '/contents/notifications?type=company' },
                    { name: '고객지원', path: '/contents/support?type=company' }
                ]
                : [
                    { name: '등록컨텐츠', path: '/contents' },
                    { name: '나의 컨텐츠', path: '/contents/my' },
                    { name: '관심 목록', path: '/contents/wishlist' },
                    { name: '활동 내역', path: '/contents/history' },
                    { name: '설정', path: '/contents/settings' }
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
                    { name: '세일', path: '/shop?type=company#sale' },
                    { name: '베스트', path: '/shop?type=company#best' }
                ]
                : [
                    { name: '추천', path: '/shop#recommended' },
                    { name: '신상품', path: '/shop#new' },
                    { name: '브랜드', path: '/shop#brand' },
                    { name: '세일', path: '/shop#sale' },
                    { name: '베스트', path: '/shop#best' }
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
            const firstCat = navItems[0];
            setActiveAllMenuCategory(firstCat.name);
        }
    }, [isAllMenuOpen, activeAllMenuCategory]);

    const handleAuthAction = (action: () => void) => {
        if (!isAuthenticated) {
            navigate(`/login?type=${isCompany ? 'company' : 'personal'}`);
        } else {
            action();
        }
    };

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

    return (
        <div className="flex flex-col min-h-screen font-sans" style={{
            background: 'linear-gradient(180deg, rgba(255, 248, 240, 1) 0%, rgba(255, 255, 255, 1) 100%)'
        }}>
            {/* Navigation Header */}
            <nav className={clsx(
                "sticky top-0 z-50 transition-colors duration-300",
                isCompany ? "" : ""
            )} style={{
                background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 100%)',
                borderBottom: isCompany ? '2px solid #FFB6B9' : '2px solid #A8D8EA'
            }}>
                {/* Merged Header (Logo + Search + Utilities) */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        {/* Left: Logo & Search */}
                        <div className="flex items-center gap-8">
                            {/* Logo */}
                            <Link to={isCompany ? '/company' : '/personal'} className="flex items-center space-x-2 group flex-shrink-0">
                                <div className="p-2 rounded-lg" style={{
                                    background: isCompany
                                        ? 'linear-gradient(135deg, #FFB6B9 0%, #FF9AA2 100%)'
                                        : 'linear-gradient(135deg, #A8D8EA 0%, #7AC5DC 100%)'
                                }}>
                                    <ShoppingBag size={24} className="text-white" />
                                </div>
                                <span className={clsx(
                                    "text-2xl md:text-3xl font-bold font-korean tracking-tight transition-colors duration-300",
                                    isCompany ? "text-hanbok-royal" : "text-hanbok-jade group-hover:text-hanbok-sea"
                                )}>
                                    {isCompany ? 'BizMall' : 'K-Mall'}
                                </span>
                            </Link>

                            {/* Desktop Search Bar (Hidden on Mobile/Tablet) */}
                            <div className="hidden xl:block relative" style={{ width: '400px' }}>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={18} style={{ color: '#8E9AAF' }} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="검색어를 입력하세요..."
                                    className="block w-full pl-10 pr-4 py-2 rounded-xl leading-5 placeholder-gray-400 focus:outline-none sm:text-sm transition-all duration-200 font-korean"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    style={{
                                        background: 'rgba(255, 248, 240, 0.5)',
                                        border: '2px solid rgba(203, 213, 224, 0.6)',
                                        color: '#4A5568',
                                        borderRadius: '0.75rem',
                                        paddingLeft: '2.5rem' // matched with icon padding
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.background = '#FFFFFF';
                                        e.currentTarget.style.borderColor = '#A8D8EA';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 248, 240, 0.5)';
                                        e.currentTarget.style.borderColor = 'rgba(203, 213, 224, 0.6)';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Right: Utilities & Mobile Toggle */}
                        <div className="flex items-center space-x-4 md:space-x-6">
                            {/* Utility Links (Desktop Only) */}
                            <div className="hidden lg:flex items-center space-x-4 text-xs font-medium text-gray-500 font-korean">
                                {isAuthenticated ? (
                                    <>
                                        <span className="text-gray-700">
                                            {userType === 'admin' ? '관리자' : (isCompany ? '기업회원' : '개인회원')}님
                                        </span>
                                        <button onClick={handleLogout} className="hover:text-hanbok-red transition-colors">로그아웃</button>
                                    </>
                                ) : (
                                    <>
                                        <Link to={`/login?type=${isCompany ? 'company' : 'personal'}`} className="hover:text-hanbok-jade transition-colors">로그인</Link>
                                        <span className="text-gray-300">|</span>
                                        <Link to={`/register?type=${isCompany ? 'company' : 'personal'}`} className="hover:text-hanbok-jade transition-colors">회원가입</Link>
                                    </>
                                )}
                                <span className="text-gray-300">|</span>
                                <button className="hover:text-hanbok-jade transition-colors">고객센터</button>
                                {(userType === 'admin' || userType === 'company') && (
                                    <>
                                        <span className="text-gray-300">|</span>
                                        <Link to="/partners/inquiry" className="hover:text-hanbok-jade transition-colors">제휴문의</Link>
                                    </>
                                )}
                            </div>

                            {/* Admin Dashboard Button (Desktop) */}
                            {userType === 'admin' && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="hidden md:flex px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-xs items-center gap-1"
                                >
                                    <LayoutDashboard size={14} /> 관리자
                                </button>
                            )}

                            {/* Mobile Search Icon (When search bar is hidden) */}
                            <button className="xl:hidden text-gray-500 hover:text-hanbok-jade">
                                <Search size={24} />
                            </button>

                            {/* Mobile Menu Button */}
                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-hanbok-jade focus:outline-none transition-colors"
                                >
                                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Secondary Navigation Bar (The "Bottom Navigation") */}
                <div className="hidden md:block border-t relative" style={{
                    background: 'linear-gradient(135deg, rgba(255, 248, 240, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%)',
                    borderColor: 'rgba(203, 213, 224, 0.5)'
                }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center h-14">
                            {/* All Menu Button */}
                            <div className="relative group mr-8">
                                <button
                                    onClick={() => setIsAllMenuOpen(!isAllMenuOpen)}
                                    className={clsx(
                                        "flex items-center space-x-2 font-bold text-base transition-colors py-4",
                                        isAllMenuOpen ? "text-hanbok-jade" : "text-gray-800 hover:text-hanbok-jade"
                                    )}
                                >
                                    <Menu size={20} />
                                    <span>전체보기</span>
                                </button>
                            </div>

                            {/* Main Categories (Horizontal) */}
                            <div className="flex h-full items-stretch space-x-1 flex-1">
                                {navItems.map((item) => (
                                    <div key={item.name} className="relative group px-1 h-full flex items-center">
                                        <div className="group flex flex-col items-center h-full justify-center relative">
                                            <Link
                                                to={item.path}
                                                className={clsx(
                                                    "px-4 flex items-center h-full text-base font-bold transition-colors relative z-10",
                                                    location.pathname === item.path
                                                        ? (isCompany ? "text-hanbok-royal" : "text-hanbok-jade")
                                                        : "text-gray-700 group-hover:text-hanbok-jade"
                                                )}
                                            >
                                                {item.name}
                                            </Link>

                                            {/* Dropdown Menu */}
                                            {item.subMenus && item.subMenus.length > 0 && (
                                                <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-b-lg overflow-hidden hidden group-hover:block z-50 transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                                                    style={{ borderTop: isCompany ? '2px solid #FFB6B9' : '2px solid #A8D8EA' }}>
                                                    <div className="py-2">
                                                        {item.subMenus.map((subItem) => (
                                                            <Link
                                                                key={subItem.name}
                                                                to={subItem.path}
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-hanbok-jade transition-colors font-medium"
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order History & Cart Buttons */}
                            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 ml-auto">
                                <button
                                    onClick={() => handleAuthAction(() => navigate('/order-history'))}
                                    className="text-hanbok-charcoal hover:text-hanbok-jade transition-colors flex items-center space-x-2 px-4 py-2"
                                    title="Order History"
                                >
                                    <ClipboardList size={20} />
                                    <span className="text-sm font-medium">MYPAGE</span>
                                </button>

                                <button
                                    onClick={() => handleAuthAction(toggleCart)}
                                    className="relative text-hanbok-charcoal hover:text-hanbok-jade transition-colors flex items-center space-x-2 px-4 py-2"
                                >
                                    <ShoppingCart size={20} />
                                    <span className="text-sm font-medium">CART</span>
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
                                            expandedMobileMenu === item.name ? "max-h-[800px] py-2" : "max-h-0"
                                        )}
                                    >
                                        {/* Mobile Submenu render */}
                                        {item.subMenus.map((sub, idx) => {
                                            const subName = typeof sub === 'string' ? sub : sub.name;
                                            return (
                                                <div key={idx}>
                                                    <div className="px-6 py-2 text-sm text-gray-600 font-bold">{subName}</div>
                                                    {/* Render Sub-Sub items for mobile */}
                                                    {typeof sub !== 'string' && 'subMenus' in sub && (sub as any).subMenus.map((subSub: any, sIdx: number) => (
                                                        <Link
                                                            key={sIdx}
                                                            to={subSub.path}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block px-8 py-2 text-xs text-gray-500 hover:text-gray-900"
                                                        >
                                                            - {subSub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                {/* Desktop All Menu Overlay (Side Drawer) */}
                <div
                    className={clsx(
                        "hidden md:block fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out",
                        isAllMenuOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsAllMenuOpen(false)}></div>
                    <div className="absolute top-0 right-0 w-[600px] h-full bg-white shadow-2xl flex flex-col">

                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-2xl font-bold font-korean text-gray-800">
                                    {isCompany ? 'BizMall' : 'K-Mall'}
                                    <span className="text-hanbok-jade ml-2">전체메뉴</span>
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">원하시는 서비스를 쉽고 빠르게 찾아보세요.</p>
                            </div>
                            <button
                                onClick={() => setIsAllMenuOpen(false)}
                                className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-red-500"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Drawer Content - Split Pane */}
                        <div className="flex-1 overflow-hidden flex">
                            {/* Left Pane: Main Categories (30%) */}
                            <div className="w-[35%] bg-gray-50 h-full overflow-y-auto border-r border-gray-100 py-4">
                                {navItems.map((item) => {
                                    const isActive = activeAllMenuCategory === item.name;
                                    return (
                                        <button
                                            key={item.name}
                                            onMouseEnter={() => setActiveAllMenuCategory(item.name)}
                                            className={clsx(
                                                "w-full text-left px-6 py-4 font-bold text-lg transition-all flex items-center justify-between group relative",
                                                isActive
                                                    ? "bg-white text-hanbok-jade shadow-sm"
                                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                            )}
                                        >
                                            {isActive && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-hanbok-jade"></div>
                                            )}
                                            <span>{item.name}</span>
                                            {item.subMenus && item.subMenus.length > 0 && (
                                                <ChevronDown size={16} className={clsx("transform transition-transform -rotate-90", isActive ? "opacity-100 text-hanbok-jade" : "opacity-30")} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Right Pane: 2nd & 3rd Level (70%) */}
                            <div className="w-[65%] bg-white h-full overflow-y-auto">
                                <div className="p-8">
                                    {activeAllMenuCategory && (
                                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                            <h3 className="text-xl font-bold mb-6 pb-2 border-b border-gray-100 text-gray-800 flex items-center">
                                                {activeAllMenuCategory}
                                                <span className="ml-auto text-xs font-normal text-gray-400">Total {navItems.find(i => i.name === activeAllMenuCategory)?.subMenus.length} items</span>
                                            </h3>

                                            <div className="space-y-8">
                                                {navItems.find(i => i.name === activeAllMenuCategory)?.subMenus.map((sub, idx) => {
                                                    const subName = typeof sub === 'string' ? sub : sub.name;
                                                    const hasSubSub = typeof sub !== 'string' && 'subMenus' in sub && (sub as any).subMenus && (sub as any).subMenus.length > 0;

                                                    return (
                                                        <div key={idx} className="group">
                                                            {/* 2nd Level Title */}
                                                            <div className="flex items-center mb-3">
                                                                <Link
                                                                    to={typeof sub === 'string' ? '#' : sub.path}
                                                                    onClick={() => setIsAllMenuOpen(false)}
                                                                    className="text-lg font-bold text-gray-700 group-hover:text-hanbok-jade transition-colors flex items-center gap-2"
                                                                >
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-hanbok-jade transition-colors"></div>
                                                                    {subName}
                                                                </Link>
                                                            </div>

                                                            {/* 3rd Level List */}
                                                            {hasSubSub && (
                                                                <div className="ml-4 pl-4 border-l border-gray-100 grid grid-cols-2 gap-y-2 gap-x-4">
                                                                    {(sub as any).subMenus.map((subSub: any, sIdx: number) => (
                                                                        <Link
                                                                            key={sIdx}
                                                                            to={subSub.path}
                                                                            onClick={() => setIsAllMenuOpen(false)}
                                                                            className="text-sm text-gray-500 hover:text-hanbok-jade hover:underline transition-all block py-1"
                                                                        >
                                                                            {subSub.name}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Promo Card inside Drawer */}
                                            <div className="mt-12 bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                <h4 className="font-bold text-gray-800 mb-2">Notice</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    새로워진 {isCompany ? 'BizMall' : 'K-Mall'}의 전체 메뉴를 통해<br />
                                                    원하시는 서비스를 더 빠르게 찾아보세요.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Backdrop Layer (Removed, integrated into drawer structure above) */}

            </nav>

            {/* Main Content */}
            <main className="flex-grow bg-gray-50">
                {children}
            </main>

            {/* Footer */}
            {!hideFooter && (
                <footer className="bg-white border-t border-gray-200 mt-auto">
                    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-2">
                                <span className={clsx(
                                    "text-2xl font-bold font-korean tracking-tight",
                                    isCompany ? "text-hanbok-royal" : "text-hanbok-jade"
                                )}>
                                    {isCompany ? 'BizMall' : 'K-Mall'}
                                </span>
                                <p className="mt-4 text-gray-500 text-sm">
                                    대한민국의 문화를 세계로 알리는<br />
                                    프리미엄 K-Culture 플랫폼입니다.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">고객센터</h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <button
                                            onClick={() => setShowInquiryModal(true)}
                                            className="text-base text-gray-500 hover:text-gray-900"
                                        >
                                            1:1 문의
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setShowFAQModal(true)}
                                            className="text-base text-gray-500 hover:text-gray-900"
                                        >
                                            자주 묻는 질문
                                        </button>
                                    </li>
                                    <li>
                                        <Link to="/notice" className="text-base text-gray-500 hover:text-gray-900">
                                            공지사항
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">회사소개</h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <Link
                                            to={isCompany ? "/intro?type=company" : "/intro"}
                                            className="text-base text-gray-500 hover:text-gray-900 cursor-pointer"
                                        >
                                            회사소개
                                        </Link>
                                    </li>
                                    <li>
                                        <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                                            이용약관
                                        </a>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setShowPrivacyModal(true)}
                                            className="text-base text-gray-500 hover:text-gray-900 font-bold"
                                        >
                                            개인정보처리방침
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-8 border-t border-gray-200 pt-8">
                            <p className="text-base text-gray-400 text-center">
                                &copy; 2024 {isCompany ? 'BizMall' : 'K-Mall'}. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            )}

            <CartModal />
            <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
            <InquiryModal isOpen={showInquiryModal} onClose={() => setShowInquiryModal(false)} />
            <FAQModal isOpen={showFAQModal} onClose={() => setShowFAQModal(false)} />
        </div>
    );
}
