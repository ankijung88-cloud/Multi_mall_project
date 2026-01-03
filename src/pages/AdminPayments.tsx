import { useState, useEffect } from 'react';
import { DollarSign, Calendar, TrendingUp, CreditCard, ArrowDown, ArrowUp } from 'lucide-react';

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: string;
    date: string;
}

interface MonthlyStats {
    month: string; // YYYY-MM
    revenue: number;
    count: number;
}

export default function AdminPayments() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const stored = localStorage.getItem('mall_orders');
        if (stored) {
            try {
                const allOrders: Order[] = JSON.parse(stored);
                if (Array.isArray(allOrders)) {
                    // Sort by Date Descending
                    const sortedOrders = allOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setOrders(sortedOrders);

                    // Calculate Total Revenue
                    const total = sortedOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
                    setTotalRevenue(total);

                    // Calculate Monthly Stats
                    const statsMap = new Map<string, MonthlyStats>();

                    sortedOrders.forEach(order => {
                        const date = new Date(order.date);
                        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                        const current = statsMap.get(monthKey) || { month: monthKey, revenue: 0, count: 0 };
                        current.revenue += Number(order.totalAmount) || 0;
                        current.count += 1;
                        statsMap.set(monthKey, current);
                    });

                    // Convert to array and sort by month descending
                    const statsArray = Array.from(statsMap.values()).sort((a, b) => b.month.localeCompare(a.month));
                    setMonthlyStats(statsArray);
                }
            } catch (error) {
                console.error("Failed to load orders", error);
            }
        }
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <CreditCard className="text-blue-600" />
                        Payments & Revenue
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Overview of all payment transactions and monthly revenue.</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100 flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full text-green-700">
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-green-600 font-semibold uppercase tracking-wide">Total Revenue</div>
                        <div className="text-xl font-bold text-green-800">${totalRevenue.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            {/* Top Section: Monthly Revenue Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" size={20} />
                    <h3 className="font-bold text-gray-900">Monthly Revenue Status (월별 매출현황)</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {monthlyStats.length === 0 ? (
                            <div className="col-span-full text-center py-8 text-gray-400">No revenue data available yet.</div>
                        ) : (
                            monthlyStats.map((stat) => (
                                <div key={stat.month} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2 text-gray-600 font-medium">
                                            <Calendar size={16} />
                                            {stat.month}
                                        </div>
                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-50 text-blue-700">{stat.count} Orders</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 mt-2">
                                        ${stat.revenue.toLocaleString()}
                                    </div>
                                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                        <div
                                            className="bg-indigo-500 h-full rounded-full"
                                            style={{ width: `${Math.min((stat.revenue / (totalRevenue || 1)) * 100 * 5, 100)}%` }} // Visual scaling
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Section: All Order Payments Sheet */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <DollarSign className="text-gray-600" size={20} />
                        All Payment Transactions (전체 결제 내역)
                    </h3>
                    <div className="text-sm text-gray-500">
                        {orders.length} transaction{orders.length !== 1 ? 's' : ''} found
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        No transaction history found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.date).toLocaleDateString()}
                                            <div className="text-xs text-gray-400">{new Date(order.date).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{order.customerName}</div>
                                            <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                            ${Number(order.totalAmount).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
