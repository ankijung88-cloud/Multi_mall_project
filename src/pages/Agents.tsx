import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAgents } from '../context/AgentContext';
import { useAuthStore } from '../store/useAuthStore';
import clsx from 'clsx';
import MainLayout from '../layouts/MainLayout';

export default function Agents() {
    const { agents } = useAgents();
    const navigate = useNavigate();
    const { isAuthenticated, userType } = useAuthStore();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryType = searchParams.get('type');

    const isCompanyView = userType === 'company' || queryType === 'company';

    const [searchTerm, setSearchTerm] = useState('');

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
            <div className={clsx(
                "min-h-screen text-white transition-colors duration-500",
                isCompanyView
                    ? "bg-gradient-to-b from-blue-900 via-indigo-900 to-gray-900"
                    : "bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900"
            )}>
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className={clsx(
                            "text-5xl font-bold mb-6 bg-clip-text text-transparent",
                            isCompanyView
                                ? "bg-gradient-to-r from-blue-400 to-teal-300"
                                : "bg-gradient-to-r from-purple-400 to-pink-400"
                        )}>
                            {isCompanyView ? 'Corporate Agents' : 'Professional Agents'}
                        </h1>
                        <p className={clsx("text-xl max-w-2xl mx-auto", isCompanyView ? "text-blue-200" : "text-gray-300")}>
                            {isCompanyView
                                ? '기업 컨설팅 및 전문 서비스를 제공하는 최정예 에이전트 그룹입니다.'
                                : 'Meet our expert agents ready to assist you with your journey.'}
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <div className="flex justify-end mb-8">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search agents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm transition-all"
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredAgents.map((agent, index) => (
                            <motion.div
                                key={agent.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        navigate(isCompanyView ? '/login?type=company' : '/login?type=personal', { state: { from: `/agents/${agent.id}` } });
                                    } else {
                                        navigate(isCompanyView ? `/agents/${agent.id}?type=company` : `/agents/${agent.id}`);
                                    }
                                }}
                                className="bg-gray-800 rounded-2xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-purple-500 transition-all duration-300"
                            >
                                <div className="aspect-[3/4] overflow-hidden">
                                    <img
                                        src={agent.image}
                                        alt={agent.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-400 transition-colors">
                                        {agent.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                        {agent.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {agents.length === 0 && (
                        <div className="text-center py-20 text-gray-400">
                            <p>No agents currently available.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
