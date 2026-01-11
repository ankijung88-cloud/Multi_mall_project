import { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, FileSpreadsheet, Truck, CheckSquare, Square, RotateCcw } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    date: string;
    items: OrderItem[];
}

export default function AdminOrders() {

    const [dailyBatch, setDailyBatch] = useState<Order[]>([]);
    const [unshippedBacklog, setUnshippedBacklog] = useState<Order[]>([]);


    // Refresh Data
    const loadOrders = async () => {
        try {
            const { data } = await axios.get('/api/orders');
            const allOrders: Order[] = Array.isArray(data) ? data : [];

            // 1. "Recent Orders" - Just show the latest 50 orders
            const batch = allOrders
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 50);

            // 2. Unshipped Backlog (ALL Pending/Processing)
            // Assuming "Unshipped" means not Shipped, Delivered, or Cancelled?
            // User likely means "Pending" or "Processing" or "Paid".
            // Let's explicitly include 'Pending' and 'Processing' (and 'Paid' if used). 
            // Exclude 'Shipped', 'Delivered', 'Cancelled'.
            const backlog = allOrders.filter(o =>
                o.status !== 'Shipped' &&
                o.status !== 'Delivered' &&
                o.status !== 'Cancelled'
            ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


            setDailyBatch(batch);
            setUnshippedBacklog(backlog);
        } catch (error) {
            console.error("Failed to load orders:", error);
        }
    };


    useEffect(() => {
        loadOrders();
    }, []);

    const toggleStatus = async (order: Order) => {
        const newStatus = (order.status === 'Pending' || order.status === 'Processing') ? 'Shipped' : 'Pending';

        try {
            await axios.put(`/api/orders/${order.id}/status`, { status: newStatus });
            loadOrders(); // Refresh lists
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status");
        }
    };

    const downloadUnshippedCSV = () => {
        if (unshippedBacklog.length === 0) return;

        const headers = ["Order ID", "Date", "Customer", "Address (Mock)", "Items", "Total"];
        const rows = unshippedBacklog.map(o => [
            o.id,
            new Date(o.date).toLocaleString(),
            `"${o.customerName}"`,
            "Details in Order", // Mock address or pull from storage if linked
            `"${o.items.map(i => `${i.name} (${i.quantity})`).join(', ')}"`,
            o.totalAmount
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `unshipped_orders_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const StatusCheckbox = ({ order }: { order: Order }) => {
        const isShipped = order.status === 'Shipped' || order.status === 'Delivered';
        return (
            <button
                onClick={(e) => { e.stopPropagation(); toggleStatus(order); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isShipped
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
            >
                {isShipped ? <CheckSquare size={16} /> : <Square size={16} />}
                {isShipped ? 'Sent (발송완료)' : 'Unsent (미발송)'}
            </button>
        );
    };

    return (
        <div className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Order Processing</h2>
                    <p className="text-gray-500 text-sm">Manage shipping and view order status.</p>
                </div>
                <Link
                    to="/admin/shipped"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                >
                    <Truck size={18} />
                    View Shipped History
                </Link>
            </div>

            {/* 1. Daily Batch Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-blue-50/50">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                        <Calendar className="text-blue-600" size={20} />
                        Recent Orders (최근 주문 내역)
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Displaying latest 50 orders
                    </p>
                </div>
                <div className="overflow-x-auto max-h-[400px]">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dailyBatch.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-8 text-center text-gray-400">
                                        No orders in this window.
                                    </td>
                                </tr>
                            ) : (
                                dailyBatch.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{order.id}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(order.date).toLocaleString()} • {order.customerName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusCheckbox order={order} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 2. Unshipped Backlog Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <RotateCcw className="text-orange-500" size={20} />
                            Unshipped Orders (미발송 내역 전체)
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Pending orders waiting for shipment.</p>
                    </div>
                    <button
                        onClick={downloadUnshippedCSV}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm shadow-sm"
                    >
                        <FileSpreadsheet size={16} />
                        Download CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {unshippedBacklog.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                        All caught up! No pending orders.
                                    </td>
                                </tr>
                            ) : (
                                unshippedBacklog.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.date).toLocaleDateString()}
                                            <div className="text-xs">{new Date(order.date).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                            <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">
                                            {order.items.map(i => i.name).join(', ')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            ${order.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusCheckbox order={order} />
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
