import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { label: 'Total Revenue', value: '$12,345', icon: DollarSign, color: 'bg-green-500' },
        { label: 'Total Orders', value: '156', icon: ShoppingBag, color: 'bg-blue-500' },
        { label: 'Total Users', value: '2,300', icon: Users, color: 'bg-indigo-500' },
        { label: 'Growth', value: '+12%', icon: TrendingUp, color: 'bg-purple-500' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg text-white shadow-lg shadow-gray-200`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4">Recent Orders</h3>
                    {/* Placeholder Chart or List */}
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                        Chart Area
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4">New Members</h3>
                    {/* Placeholder List */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                    <div>
                                        <div className="font-medium text-sm">New User {i + 1}</div>
                                        <div className="text-xs text-gray-500">2 mins ago</div>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
