import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    CreditCard,
    RotateCcw,
    Users,
    Settings,
    LogOut
} from 'lucide-react';
import clsx from 'clsx';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/shipping', icon: Package, label: 'Shipping' },
        { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
        { path: '/admin/returns', icon: RotateCcw, label: 'Returns' },
        { path: '/admin/members', icon: Users, label: 'Members' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-30">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <span className="text-red-500">ADMIN</span> Panel
                    </h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
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
                    ))}
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
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
