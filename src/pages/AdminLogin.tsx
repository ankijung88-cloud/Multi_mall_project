import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usePartners } from '../context/PartnerContext';
import { useAgents } from '../context/AgentContext';
import { motion } from 'framer-motion';
import { Lock, Shield, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function AdminLogin() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const { partners } = usePartners();
    const { agents } = useAgents();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Initialize default admin if not exists
    useEffect(() => {
        const stored = localStorage.getItem('mall_admin_creds');
        if (!stored) {
            localStorage.setItem('mall_admin_creds', JSON.stringify({
                id: 'admin',
                password: 'admin123',
                name: 'Administrator'
            }));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API check
        await new Promise(resolve => setTimeout(resolve, 1000));

        const stored = localStorage.getItem('mall_admin_creds');
        const creds = stored ? JSON.parse(stored) : { id: 'admin', password: 'admin123' };

        // 1. Check Super Admin
        if (username === creds.id && password === creds.password) {
            login('admin', { name: creds.name }, 'super');
            navigate('/admin');
            setIsLoading(false);
            return;
        }

        // 2. Check Partners (Safely)
        if (Array.isArray(partners)) {
            const partner = partners.find(p => p.credentials?.username === username && p.credentials?.password === password);
            if (partner) {
                // Ensure id is passed as number explicitly
                login('admin', { name: partner.name, id: partner.id }, 'partner', partner.id);
                navigate('/admin/partner-requests');
                setIsLoading(false);
                return;
            }
        }

        // 3. Check Agents (Safely)
        if (Array.isArray(agents)) {
            const agent = agents.find(a => a.credentials?.username === username && a.credentials?.password === password);
            if (agent) {
                // Ensure id is passed as number explicitly
                login('admin', { name: agent.name, id: agent.id }, 'agent', agent.id);
                navigate('/admin/agent-requests');
                setIsLoading(false);
                return;
            }
        }

        // 4. Fail
        alert('관리자 정보가 올바르지 않습니다');
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
                    <h2 className="text-3xl font-bold text-white">관리자 포털</h2>
                    <p className="text-gray-400 mt-2">접근 제한 구역</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">관리자 아이디</label>
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
                        <label className="block text-sm font-medium text-gray-400 mb-2">비밀번호</label>
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
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "대시보드 접속"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
