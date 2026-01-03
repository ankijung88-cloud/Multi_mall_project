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
    const { partners, addPartner } = usePartners();
    const { agents, addAgent } = useAgents();
    const [isLoading, setIsLoading] = useState(false);

    // Login State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Register State
    const [isRegistering, setIsRegistering] = useState(false);
    const [regType, setRegType] = useState<'partner' | 'agent'>('partner');
    const [regName, setRegName] = useState('');
    const [regId, setRegId] = useState('');
    const [regPw, setRegPw] = useState('');
    const [regConfirmPw, setRegConfirmPw] = useState('');

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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API check
        await new Promise(resolve => setTimeout(resolve, 800));

        const stored = localStorage.getItem('mall_admin_creds');
        const creds = stored ? JSON.parse(stored) : { id: 'admin', password: 'admin123' };

        // 1. Check Super Admin
        if (username === creds.id && password === creds.password) {
            login('admin', { name: creds.name }, 'super');
            navigate('/admin');
            setIsLoading(false);
            return;
        }

        // 2. Check Partners
        if (Array.isArray(partners)) {
            const partner = partners.find(p => p.credentials?.username === username && p.credentials?.password === password);
            if (partner) {
                login('admin', { name: partner.name, id: partner.id }, 'partner', partner.id);
                navigate('/admin/partner-requests');
                setIsLoading(false);
                return;
            }
        }

        // 3. Check Agents
        if (Array.isArray(agents)) {
            const agent = agents.find(a => a.credentials?.username === username && a.credentials?.password === password);
            if (agent) {
                login('admin', { name: agent.name, id: agent.id }, 'agent', agent.id);
                navigate('/admin/agent-requests');
                setIsLoading(false);
                return;
            }
        }

        alert('관리자 정보가 올바르지 않습니다');
        setIsLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (regPw !== regConfirmPw) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (regPw.length < 4) {
            alert("비밀번호는 4자 이상이어야 합니다.");
            return;
        }

        // Check ID uniqueness
        const idExists =
            (partners.some(p => p.credentials?.username === regId)) ||
            (agents.some(a => a.credentials?.username === regId)) ||
            (regId === 'admin');

        if (idExists) {
            alert("이미 존재하는 ID입니다.");
            return;
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const newCreds = { username: regId, password: regPw };

        if (regType === 'partner') {
            addPartner({
                name: regName,
                image: "https://via.placeholder.com/150",
                description: "New Partner",
                schedules: [],
                credentials: newCreds
            });
        } else {
            addAgent({
                name: regName,
                image: "https://via.placeholder.com/150",
                description: "New Agent",
                schedules: [],
                credentials: newCreds
            });
        }

        alert("관리자 등록이 완료되었습니다. 로그인해주세요.");
        setIsRegistering(false);
        setIsLoading(false);
        // Reset form
        setRegName(''); setRegId(''); setRegPw(''); setRegConfirmPw('');
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
                    <p className="text-gray-400 mt-2">{isRegistering ? '관리자 등록 (Sign Up)' : '접근 제한 구역'}</p>
                </div>

                {!isRegistering ? (
                    /* Login Form */
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">관리자 아이디</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                                placeholder="ID"
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
                                    placeholder="Password"
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

                        <div className="text-center pt-4 border-t border-gray-700">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(true)}
                                className="text-sm text-gray-400 hover:text-white underline"
                            >
                                파트너/에이전트 관리자 등록
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Register Form */
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="flex gap-4 mb-2">
                            <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={regType === 'partner'}
                                    onChange={() => setRegType('partner')}
                                    className="text-red-500 focus:ring-red-500"
                                />
                                <span>제휴 파트너</span>
                            </label>
                            <label className="flex items-center space-x-2 text-gray-300 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={regType === 'agent'}
                                    onChange={() => setRegType('agent')}
                                    className="text-red-500 focus:ring-red-500"
                                />
                                <span>에이전트</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">업체/이름 (Display Name)</label>
                            <input
                                type="text"
                                required
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">로그인 ID</label>
                            <input
                                type="text"
                                required
                                value={regId}
                                onChange={(e) => setRegId(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">비밀번호</label>
                            <input
                                type="password"
                                required
                                value={regPw}
                                onChange={(e) => setRegPw(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">비밀번호 확인</label>
                            <input
                                type="password"
                                required
                                value={regConfirmPw}
                                onChange={(e) => setRegConfirmPw(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-red-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={clsx(
                                "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center mt-4",
                                isLoading && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "등록 완료 (Register)"}
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(false)}
                                className="text-sm text-gray-400 hover:text-white underline"
                            >
                                로그인으로 돌아가기
                            </button>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );

}
