import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, DollarSign, Clock, FileSpreadsheet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { adminRole } = useAuthStore();

    useEffect(() => {
        if (adminRole === 'partner') {
            navigate('/admin/partner-requests', { replace: true });
        } else if (adminRole === 'agent') {
            navigate('/admin/agent-requests', { replace: true });
        }
    }, [adminRole, navigate]);

    const [stats, setStats] = useState({
        revenue: 0,
        ordersMonthly: 0,
        ordersDaily: 0,
        users: 0,
        growth: '+12%'
    });
    const [dailyOrders, setDailyOrders] = useState<any[]>([]);
    const [newMembers, setNewMembers] = useState<any[]>([]);

    useEffect(() => {
        const storedMembers = localStorage.getItem('mall_members');
        const storedOrders = localStorage.getItem('mall_orders');

        let members: any[] = [];
        try {
            const parsed = storedMembers ? JSON.parse(storedMembers) : [];
            members = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse members", e);
            members = [];
        }

        let orders: any[] = [];
        try {
            const parsed = storedOrders ? JSON.parse(storedOrders) : [];
            orders = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse orders", e);
            orders = [];
        }

        // 1. Calculate Revenue
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + (Number(order.totalAmount) || 0), 0);

        // 2. Count Orders (Monthly vs Daily)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // Monthly Count
        const monthlyCount = orders.filter((o: any) => {
            const d = new Date(o.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        }).length;

        // Daily Count (Yesterday 12:01 PM ~ Today 12:00 PM OR Today 12:01 ~ Tomorrow 12:00)
        // Logic: "Daily" implies the CURRENT generic shift.
        // If now is 2 PM (14:00), we want orders from Today 12:01 PM onwards.
        // If now is 10 AM (10:00), we want orders from Yesterday 12:01 PM to Today 12:00 PM.

        const cycleStart = new Date(now);
        if (now.getHours() >= 12 && now.getMinutes() >= 1) {
            // Cycle: Today 12:01 PM ~ Tomorrow 12:00 PM
            cycleStart.setHours(12, 1, 0, 0);
        } else {
            // Cycle: Yesterday 12:01 PM ~ Today 12:00 PM
            cycleStart.setDate(cycleStart.getDate() - 1);
            cycleStart.setHours(12, 1, 0, 0);
        }

        const cycleEnd = new Date(cycleStart);
        cycleEnd.setDate(cycleEnd.getDate() + 1);

        const dailyFiltered = orders.filter((o: any) => {
            const d = new Date(o.date);
            return d >= cycleStart && d < cycleEnd;
        });

        // Sort daily orders by date descending
        const dailySorted = dailyFiltered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setStats({
            revenue: totalRevenue,
            ordersMonthly: monthlyCount,
            ordersDaily: dailyFiltered.length,
            users: members.length,
            growth: '+12%'
        });

        setDailyOrders(dailySorted);
        setNewMembers([...members].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5));

    }, []);

    const downloadCSV = () => {
        if (dailyOrders.length === 0) {
            alert("No orders to export for this period.");
            return;
        }

        // CSV Header
        const headers = ["Order ID", "Date", "Customer Name", "Email", "Items", "Total Amount", "Status"];

        // CSV Rows
        const rows = dailyOrders.map(order => [
            order.id,
            new Date(order.date).toLocaleString(),
            `"${order.customerName}"`, // Quote strings to handle commas
            order.customerEmail,
            `"${order.items.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}"`,
            order.totalAmount,
            order.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `daily_orders_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const statCards = [
        { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
        {
            label: 'Total Orders',
            isMultiLine: true,
            lines: [
                { label: 'This Month (월)', value: stats.ordersMonthly },
                { label: 'Today (일)', value: stats.ordersDaily, sub: '12:01PM~' }
            ],
            icon: ShoppingBag,
            color: 'bg-blue-500'
        },
        { label: 'Total Users', value: stats.users.toLocaleString(), icon: Users, color: 'bg-indigo-500' },
        { label: 'Growth', value: stats.growth, icon: TrendingUp, color: 'bg-purple-500' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <div className="text-sm text-gray-500">
                    Auto-refreshing live data
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat: any, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">{stat.label}</p>
                                {stat.isMultiLine ? (
                                    <div className="space-y-2">
                                        <div className="flex items-baseline justify-between gap-4">
                                            <span className="text-xs text-gray-500 font-medium">Monthly</span>
                                            <span className="text-xl font-bold text-gray-800">{stat.lines[0].value}</span>
                                        </div>
                                        <div className="flex items-baseline justify-between gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-blue-600 font-bold">Daily</span>
                                                <span className="text-[10px] text-gray-400">{stat.lines[1].sub}</span>
                                            </div>
                                            <span className="text-xl font-bold text-blue-600">{stat.lines[1].value}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                                )}
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg text-white shadow-lg shadow-gray-200 mt-1`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Orders List (Span 2 Cols) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-800">Daily Order List (금일 주문 집계)</h3>
                            <p className="text-xs text-gray-500 mt-1">From 12:01 PM ~ To 12:00 PM</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={downloadCSV}
                                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors shadow-sm"
                            >
                                <FileSpreadsheet size={16} />
                                <span>Download CSV</span>
                            </button>
                            <Link to="/admin/orders" className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors">
                                View All
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto max-h-[400px]">
                        {dailyOrders.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                                <ShoppingBag size={48} className="mb-3 opacity-20" />
                                <p>No orders in this time slot yet.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500">Order ID</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500">Time</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500">Customer</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500">Items</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {dailyOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-3 text-sm font-medium text-blue-600">{order.id}</td>
                                            <td className="px-6 py-3 text-xs text-gray-500">
                                                {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-800">
                                                {order.customerName}
                                                <div className="text-[10px] text-gray-400">{order.customerEmail}</div>
                                            </td>
                                            <td className="px-6 py-3 text-sm text-gray-600 truncate max-w-[150px]" title={order.items.map((i: any) => i.name).join(', ')}>
                                                {order.items.length} items
                                            </td>
                                            <td className="px-6 py-3 text-sm font-bold text-gray-900 text-right">
                                                ${Number(order.totalAmount).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* New Members (Span 1 Col) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">New Members</h3>
                        <Link to="/admin/members" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
                    </div>

                    {newMembers.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">No members yet.</div>
                    ) : (
                        <div className="space-y-4">
                            {newMembers.map((member) => (
                                <div key={member.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-sm">{member.name}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                <Clock size={10} /> {member.date}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${member.type === 'Company' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                                        }`}>
                                        {member.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
