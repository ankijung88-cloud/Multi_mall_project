import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';
import { Mail, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function FindAccount() {
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'personal';
    const [activeTab, setActiveTab] = useState<'id' | 'password'>('id');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        // Simulate API call
    };

    const isCompany = type === 'company';
    const activeColor = isCompany ? 'text-blue-600 border-blue-600' : 'text-emerald-600 border-emerald-600';
    const buttonColor = isCompany ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700';

    return (
        <AuthLayout>
            <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
                <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
                    <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-gray-900">
                        Account Recovery
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Find your ID or reset your password
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'id' ? activeColor : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        onClick={() => { setActiveTab('id'); setIsSubmitted(false); }}
                    >
                        Find ID
                    </button>
                    <button
                        className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors ${activeTab === 'password' ? activeColor : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        onClick={() => { setActiveTab('password'); setIsSubmitted(false); }}
                    >
                        Reset Password
                    </button>
                </div>

                {!isSubmitted ? (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Registration Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {activeTab === 'password' && (
                            <div>
                                <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                                    User ID
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        id="id"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Your ID"
                                    />
                                </div>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all ${buttonColor}`}
                        >
                            {activeTab === 'id' ? 'Find My ID' : 'Send Reset Link'}
                        </motion.button>
                    </form>
                ) : (
                    <div className="text-center py-10">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">
                            {activeTab === 'id' ? 'ID Found!' : 'Check your email'}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 mb-8">
                            {activeTab === 'id'
                                ? 'Your ID has been sent to your email address.'
                                : 'We have sent a password reset link to your email.'}
                        </p>
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                            Try again
                        </button>
                    </div>
                )}

                <div className="mt-6 flex justify-center">
                    <Link to={`/login?type=${type}`} className="font-medium text-gray-600 hover:text-gray-900 inline-flex items-center text-sm">
                        <ArrowRight size={16} className="mr-1 rotate-180" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
