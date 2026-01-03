import { useState, useEffect } from 'react';
import { Search, RotateCcw, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminShippedOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('mall_orders');
        if (stored) {
            const allOrders = JSON.parse(stored);
            // Filter only Shipped/Delivered
            const shipped = allOrders.filter((o: any) => o.status === 'Shipped' || o.status === 'Delivered');
            // Sort by Date Descending
            shipped.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setOrders(shipped);
        }
    }, []);

    const handleRevertStatus = (orderId: string) => {
        if (window.confirm('Mark this order as Pending (Unshipped)?')) {
            const allOrders = JSON.parse(localStorage.getItem('mall_orders') || '[]');
            const updated = allOrders.map((o: any) =>
                o.id === orderId ? { ...o, status: 'Pending' } : o
            );
            localStorage.setItem('mall_orders', JSON.stringify(updated));

            // Update local state
            setOrders(updated.filter((o: any) => o.status === 'Shipped' || o.status === 'Delivered').sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <Link to="/admin/orders" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        ← Back
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Truck className="text-blue-600" />
                        Shipped Orders History
                    </h2>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search shipped orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Shipped (Order Date)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                    No shipped orders found.
                                </td>
                            </tr>
                        ) : (
                            filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{order.items.map((i: any) => i.name).join(', ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleRevertStatus(order.id)}
                                            className="text-orange-600 hover:text-orange-900 flex items-center justify-end gap-1 w-full"
                                            title="Mark as Unshipped"
                                        >
                                            <RotateCcw size={16} /> Revert
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
