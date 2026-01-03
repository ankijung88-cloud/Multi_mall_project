import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Eye, Calendar, DollarSign, User, FileSpreadsheet, Truck, CheckSquare, Square, ArrowRight, RotateCcw } from 'lucide-react';
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
    const [orders, setOrders] = useState<Order[]>([]);
    const [dailyBatch, setDailyBatch] = useState<Order[]>([]);
    const [unshippedBacklog, setUnshippedBacklog] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Refresh Data
    const loadOrders = () => {
        const stored = localStorage.getItem('mall_orders');
        if (stored) {
            let allOrders: Order[] = [];
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    allOrders = parsed;
                } else {
                    console.error("Orders data is not an array:", parsed);
                }
            } catch (error) {
                console.error("Failed to parse orders data:", error);
            }

            // 1. Calculate Daily Batch Window (Yesterday 12:01 PM ~ Today 12:00 PM)
            // Note: User asked for "Day before yesterday 12:01 ~ Today 12:00" in text, but seemingly implies the standard 24h window?
            // "전전날 오후12시01분 부터 다음날 오후12시00분까지" -> That is a 48 hour window basically?
            // Let's implement a wider window to be safe: [Now - 2 days (approx)] ~ [Now].
            // To be precise based on request: (Yesterday - 1 day) 12:01 PM ~ (Today) 12:00 PM.
            // Let's set the "Cycle End" as Today 12:00 PM (or Tomorrow 12:00 if currently PM).

            const now = new Date();
            let cycleEnd = new Date(now);
            if (now.getHours() >= 12 && now.getMinutes() >= 1) {
                // Current cycle ends Tomorrow 12:00 PM
                cycleEnd.setDate(cycleEnd.getDate() + 1);
                cycleEnd.setHours(12, 0, 0, 0);
            } else {
                // Current cycle ends Today 12:00 PM
                cycleEnd.setHours(12, 0, 0, 0);
            }

            // Start date: "전전날" -> 2 days before the 'End'? 
            // Usually "Daily" = 24h. "전전날" implies 48h or 72h window.
            // Let's set start = End - 48 Hours. (Covering "Yesterday" and "Day before Yesterday").
            const cycleStart = new Date(cycleEnd);
            cycleStart.setDate(cycleStart.getDate() - 2);
            cycleStart.setMinutes(1); // 12:01 PM roughly

            // Filter Daily Batch
            const batch = allOrders.filter(o => {
                const d = new Date(o.date);
                return d >= cycleStart && d <= cycleEnd;
            }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // 2. Unshipped Backlog (ALL Pending/Processing, regardless of date)
            const backlog = allOrders.filter(o => o.status === 'Pending' || o.status === 'Processing')
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Oldest first?

            setOrders(allOrders);
            setDailyBatch(batch);
            setUnshippedBacklog(backlog);
        }
    };


    useEffect(() => {
        loadOrders();
    }, []);

    const toggleStatus = (order: Order) => {
        const newStatus = (order.status === 'Pending' || order.status === 'Processing') ? 'Shipped' : 'Pending';

        // Update LocalStorage
        const updatedOrders = orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o);
        localStorage.setItem('mall_orders', JSON.stringify(updatedOrders));

        loadOrders(); // Refresh lists
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
                        Processing Window (주문 집계)
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Orders from <span className="font-semibold text-gray-700">Day before Yesterday 12:01 PM</span> to <span className="font-semibold text-gray-700">Today 12:00 PM</span>
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
