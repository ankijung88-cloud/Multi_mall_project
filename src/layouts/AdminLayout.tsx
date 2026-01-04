import type { ReactNode } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
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
    Truck,
    ShoppingBag,
    MessageCircle
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { logout, adminRole, user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;


    // Redirect logic removed to prevent infinite loops. 
    // Role-based access control is handled by sidebar filtering and leaf-node checks.

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const allNavItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/admin/products', icon: Archive, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/shipping', icon: Package, label: 'Shipping' },
        { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
        { path: '/admin/invoices', icon: FileText, label: 'Invoices' },
        { path: '/admin/partners', icon: Handshake, label: '제휴 업체 관리' },
        { path: '/admin/partner-requests', icon: Calendar, label: '참여 요청 관리' },
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

        // Super Admin sees everything logic
        if (adminRole === 'super') return true;

        if (adminRole === 'partner') {
            return ['/admin/partner-requests', '/admin/partners', '/admin/settings'].includes(item.path);
        }
        if (adminRole === 'agent') {
            return ['/admin/agent-requests', '/admin/agents', '/admin/settings'].includes(item.path);
        }
        if (adminRole === 'freelancer') {
            return ['/admin/content-requests', '/admin/settings'].includes(item.path);
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
                    {navItems.map((item, index) => {
                        const showSectionTitle = item.section && (index === 0 || navItems[index - 1].section !== item.section);

                        return (
                            <div key={item.path}>
                                {showSectionTitle && (
                                    <p className="px-4 mt-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {item.section}
                                    </p>
                                )}
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
                            </div>
                        );
                    })}

                    {/* Always visible Site Shortcuts */}
                    <div className="pt-6 mt-6 border-t border-gray-800">
                        <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Site Shortcuts
                        </p>
                        {siteShortcuts.map((item) => (
                            <a
                                key={item.path}
                                href={item.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors text-sm"
                            >
                                <ExternalLink size={16} />
                                {item.label}
                            </a>
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
