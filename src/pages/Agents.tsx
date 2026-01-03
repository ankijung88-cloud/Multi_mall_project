import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAgents } from '../context/AgentContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';

export default function Agents() {
    const { agents } = useAgents();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();

    return (
        <MainLayout>
            <div className="bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                            Professional Agents
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Meet our expert agents ready to assist slightly you with your journey.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {agents.map((agent, index) => (
                            <motion.div
                                key={agent.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        navigate(`/login?type=personal`, { state: { from: `/agents/${agent.id}` } });
                                    } else {
                                        navigate(`/agents/${agent.id}`);
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
