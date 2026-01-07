import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation, NavLink, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    CreditCard,
    RotateCcw,
    Users,
    Settings,
    LogOut,
    Archive,
    FileText,
    Handshake,
    Calendar,
    Briefcase,
    ExternalLink,
    ChevronDown,
    ChevronRight,
    MessageCircle
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { logout, adminRole } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    // Sub-menu structure definition
    const partnerSubItems = [
        { path: '/admin/partners/course', label: 'Course (코스)' },
        { path: '/admin/partners/beauty', label: 'Beauty (뷰티/성형)' },
        { path: '/admin/partners/performance', label: 'Performance (공연/전시)' },
        { path: '/admin/partners/audition', label: 'Audition (오디션)' },
        { path: '/admin/partners/fashion', label: 'Fashion (패션)' },
        { path: '/admin/partners/travel-company', label: 'Travel Corp (여행-기업)' },
        { path: '/admin/partners/food-company', label: 'Food Corp (음식-기업)' },
    ];

    const requestSubItems = [
        { path: '/admin/partner-requests/course', label: 'Course Requests' },
        { path: '/admin/partner-requests/beauty', label: 'Beauty Requests' },
        { path: '/admin/partner-requests/performance', label: 'Performance Requests' },
        { path: '/admin/partner-requests/audition', label: 'Audition Requests' },
        { path: '/admin/partner-requests/fashion', label: 'Fashion Requests' },
        { path: '/admin/partner-requests/travel-company', label: 'Travel Corp Requests' },
        { path: '/admin/partner-requests/food-company', label: 'Food Corp Requests' },
    ];

    // State for toggling menus
    const [isPartnersOpen, setIsPartnersOpen] = useState(true);
    const [isRequestsOpen, setIsRequestsOpen] = useState(true);

    const allNavItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/admin/products', icon: Archive, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/shipping', icon: Package, label: 'Shipping' },
        { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
        { path: '/admin/invoices', icon: FileText, label: 'Invoices' },

        // Partner Management with Sub-menu
        {
            key: 'partners',
            icon: Handshake,
            label: '제휴 업체 관리',
            isSubMenu: true,
            isOpen: isPartnersOpen,
            toggle: () => setIsPartnersOpen(!isPartnersOpen),
            subItems: partnerSubItems
        },

        // Request Management with Sub-menu
        {
            key: 'requests',
            icon: Calendar,
            label: '참여 요청 관리',
            isSubMenu: true,
            isOpen: isRequestsOpen,
            toggle: () => setIsRequestsOpen(!isRequestsOpen),
            subItems: requestSubItems
        },

        { path: '/admin/agents', icon: Briefcase, label: '에이전트 관리' },
        { path: '/admin/agent-requests', icon: Calendar, label: '에이전트 신청 관리' },

        // Freelancer Section
        { path: '/admin/content-requests', icon: MessageCircle, label: '개인 컨텐츠 참여 관리', section: 'Freelancer' },

        { path: '/admin/returns', icon: RotateCcw, label: 'Returns' },
        { path: '/admin/members', icon: Users, label: 'Members' },
        { path: '/admin/settings', icon: Settings, label: '정보수정' },
    ];

    const siteShortcuts = [
        { path: '/', label: 'Main Home' },
        { path: '/personal', label: 'Personal Home' },
        { path: '/company', label: 'Company Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/partners', label: 'Partners' },
        { path: '/agents', label: 'Agents' },
        { path: '/contents', label: 'All Personal Contents' },
    ];

    const navItems = allNavItems.filter(item => {
        if (!adminRole) return false;
        if (adminRole === 'super') return true;
        if (adminRole === 'partner') {
            if (item.key === 'partners' || item.key === 'requests') return true;
            return ['/admin/settings'].includes(item.path || '');
        }
        if (adminRole === 'agent') {
            return ['/admin/agent-requests', '/admin/agents', '/admin/settings'].includes(item.path || '');
        }
        if (adminRole === 'freelancer') {
            return ['/admin/content-requests', '/admin/settings'].includes(item.path || '');
        }
        return false;
    });

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-30">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-red-500">ADMIN</span> Panel
                    </h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item: any, index: number) => {
                        const showSectionTitle = item.section && (index === 0 || (navItems[index - 1] as any).section !== item.section);

                        return (
                            <div key={item.path || item.key}>
                                {showSectionTitle && (
                                    <p className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {item.section}
                                    </p>
                                )}

                                {item.isSubMenu ? (
                                    <div className="mb-2">
                                        <button
                                            onClick={item.toggle}
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors font-medium text-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon size={20} />
                                                <span>{item.label}</span>
                                            </div>
                                            {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                        </button>

                                        {item.isOpen && (
                                            <div className="ml-8 mt-1 space-y-1 border-l border-gray-800 pl-2">
                                                {item.subItems.map((sub: any) => (
                                                    <NavLink
                                                        key={sub.path}
                                                        to={sub.path}
                                                        className={({ isActive }) => clsx(
                                                            "block px-4 py-2 rounded-lg transition-colors text-sm",
                                                            isActive
                                                                ? "text-white font-semibold bg-gray-800"
                                                                : "text-gray-500 hover:text-gray-300"
                                                        )}
                                                    >
                                                        {sub.label}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <NavLink
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) => clsx(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm",
                                            isActive
                                                ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                                                : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                        )}
                                    >
                                        <item.icon size={20} />
                                        {item.label}
                                    </NavLink>
                                )}
                            </div>
                        );
                    })}

                    <div className="pt-6 mt-6 border-t border-gray-800">
                        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Site Shortcuts
                        </p>
                        {siteShortcuts.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors text-sm"
                            >
                                <ExternalLink size={16} />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-full">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
