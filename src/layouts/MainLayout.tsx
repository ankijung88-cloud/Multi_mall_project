import type { ReactNode } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut } from 'lucide-react';
import clsx from 'clsx';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { userType, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className={clsx(
                "bg-white shadow-sm sticky top-0 z-50 transition-colors duration-300",
                userType === 'company' ? "border-b-4 border-blue-600" : "border-b-4 border-emerald-500"
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to={userType === 'company' ? '/company' : '/personal'} className="flex items-center space-x-2">
                            <div className={clsx(
                                "p-2 rounded-lg text-white",
                                userType === 'company' ? "bg-blue-600" : "bg-emerald-500"
                            )}>
                                <ShoppingBag size={24} />
                            </div>
                            <span className="text-xl font-bold text-gray-800">
                                {userType === 'company' ? 'BizMall' : 'LifeStyle'}
                            </span>
                        </Link>

                        <div className="flex items-center space-x-6">
                            <span className="text-sm font-medium text-gray-500">
                                {userType === 'company' ? 'Corporate Account' : 'Personal Account'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">About Us</h3>
                        <p className="text-gray-400">Premium shopping experience tailored for {userType === 'company' ? 'enterprises' : 'everyone'}.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Customer Service</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>Contact Support</li>
                            <li>Shipping Policy</li>
                            <li>Returns & Refunds</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            {/* Social icons would go here */}
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    © 2024 {userType === 'company' ? 'BizMall Inc.' : 'LifeStyle Shop'}. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
