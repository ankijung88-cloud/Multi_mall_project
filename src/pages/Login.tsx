import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function Login() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') as 'personal' | 'company' | null;
    const navigate = useNavigate();
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
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (type) {
            login(type);
            navigate(type === 'company' ? '/company' : '/personal');
        }
        setIsLoading(false);
    };

    const isCompany = type === 'company';

    return (
        <AuthLayout>
            <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
                <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                    <h2 className={clsx("mt-2 text-center text-3xl font-extrabold tracking-tight", isCompany ? "text-blue-900" : "text-emerald-900")}>
                        {isCompany ? 'Business Portal' : 'Member Login'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Sign in to access your {isCompany ? 'corporate' : 'personal'} account
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
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
                            Password
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
                                Remember me
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
                                'Sign in'
                            )}
                        </motion.button>
                    </div>

                    {/* Additional Options */}
                    <div className="mt-6 grid grid-cols-2 gap-3 text-center text-sm">
                        <Link
                            to={`/find-account?type=${type || 'personal'}`}
                            className="font-medium text-gray-600 hover:text-gray-900"
                        >
                            Find ID / Password
                        </Link>
                        <Link
                            to={`/signup?type=${type || 'personal'}`}
                            className={clsx("font-bold hover:underline", isCompany ? "text-blue-600" : "text-emerald-600")}
                        >
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div >
        </AuthLayout >
    );
}
