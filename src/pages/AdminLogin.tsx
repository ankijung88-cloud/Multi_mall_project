import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { Lock, Shield, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function AdminLogin() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API check (Hardcoded for demo)
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (username === 'admin' && password === 'admin123') {
            login('admin');
            navigate('/admin');
        } else {
            alert('Invalid Admin Credentials');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-700"
            >
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-red-600/10 rounded-full mb-4">
                        <Shield className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Admin Portal</h2>
                    <p className="text-gray-400 mt-2">Restricted Access Only</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Admin ID</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute right-3 top-3.5 w-5 h-5 text-gray-500" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={clsx(
                            "w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center",
                            isLoading && "opacity-70 cursor-not-allowed"
                        )}
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Access Dashboard"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
