import { useState, useEffect } from 'react';
import { Package, Truck, Search, Save, ExternalLink, CheckCircle, Trash2 } from 'lucide-react';

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
    trackingNumber?: string; // Opt-in tracking number
}

export default function AdminShipping() {
    const [shippedOrders, setShippedOrders] = useState<Order[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [trackingInputs, setTrackingInputs] = useState<{ [key: string]: string }>({});
    const [activeTab, setActiveTab] = useState<'all' | 'no_tracking' | 'has_tracking'>('all');

    useEffect(() => {
        loadShippedOrders();
    }, []);

    const loadShippedOrders = () => {
        const stored = localStorage.getItem('mall_orders');
        if (stored) {
            try {
                const allOrders: Order[] = JSON.parse(stored);
                if (Array.isArray(allOrders)) {
                    // Filter only Shipped or Delivered
                    const shipped = allOrders.filter(o => o.status === 'Shipped' || o.status === 'Delivered')
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    setShippedOrders(shipped);

                    // Initialize inputs with existing tracking numbers
                    const inputs: { [key: string]: string } = {};
                    shipped.forEach(o => {
                        if (o.trackingNumber) inputs[o.id] = o.trackingNumber;
                    });
                    setTrackingInputs(inputs);
                }
            } catch (error) {
                console.error("Failed to load orders", error);
            }
        }
    };

    const handleTrackingChange = (orderId: string, value: string) => {
        setTrackingInputs(prev => ({ ...prev, [orderId]: value }));
    };

    const saveTrackingNumber = (orderId: string) => {
        const stored = localStorage.getItem('mall_orders');
        if (stored) {
            try {
                const allOrders: Order[] = JSON.parse(stored);
                const trackingNum = trackingInputs[orderId] || '';

                const updatedOrders = allOrders.map(o => {
                    if (o.id === orderId) {
                        return { ...o, trackingNumber: trackingNum };
                    }
                    return o;
                });

                localStorage.setItem('mall_orders', JSON.stringify(updatedOrders));

                // Update local state to reflect 'saved' status visually if needed, 
                // but reloading ensures sync.
                loadShippedOrders();
                alert(`Tracking number saved for Order #${orderId}`);
            } catch (error) {
                console.error("Failed to save", error);
            }
        }
    };

    const deleteTrackingNumber = (orderId: string) => {
        if (!confirm("Are you sure you want to delete this order's tracking number?")) return;

        const stored = localStorage.getItem('mall_orders');
        if (stored) {
            try {
                const allOrders: Order[] = JSON.parse(stored);
                const updatedOrders = allOrders.map(o => {
                    if (o.id === orderId) {
                        const { trackingNumber, ...rest } = o;
                        return rest;
                    }
                    return o;
                });

                localStorage.setItem('mall_orders', JSON.stringify(updatedOrders));

                // Clear input
                setTrackingInputs(prev => {
                    const next = { ...prev };
                    delete next[orderId];
                    return next;
                });

                loadShippedOrders();
            } catch (error) {
                console.error("Failed to delete", error);
            }
        }
    };

    const filteredOrders = shippedOrders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (activeTab === 'no_tracking') return !order.trackingNumber;
        if (activeTab === 'has_tracking') return !!order.trackingNumber;
        return true;
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Truck className="text-blue-600" />
                        Shipping Management
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage tracking numbers for shipped orders.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'all' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    All Shipped Orders
                    {activeTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
                </button>
                <button
                    onClick={() => setActiveTab('no_tracking')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'no_tracking' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Need Tracking (미입력)
                    {activeTab === 'no_tracking' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600" />}
                </button>
                <button
                    onClick={() => setActiveTab('has_tracking')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === 'has_tracking' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Tracking Saved (기입완료)
                    {activeTab === 'has_tracking' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />}
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex items-center gap-4">
                <Search className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by Order ID or Customer Name..."
                    className="flex-1 outline-none text-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Order Info</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Items (상품명)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Shipping Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase w-1/3">Tracking Number (운송장 번호)</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                        <Package size={48} className="mx-auto mb-3 opacity-20" />
                                        <p>No shipped orders found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">#{order.id}</div>
                                            <div className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                                            <div className="text-xs text-gray-500">{order.customerEmail}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 max-w-[200px] truncate" title={order.items.map(i => i.name).join(', ')}>
                                                {order.items.map(i => i.name).join(', ')}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {order.items.length} items
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                <Truck size={12} />
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={trackingInputs[order.id] || ''}
                                                    onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                                                    placeholder="Enter tracking number"
                                                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                />
                                                {order.trackingNumber && order.trackingNumber === trackingInputs[order.id] && (
                                                    <CheckCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => saveTrackingNumber(order.id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                                >
                                                    <Save size={16} />
                                                    Save
                                                </button>
                                                {order.trackingNumber && (
                                                    <button
                                                        onClick={() => deleteTrackingNumber(order.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors shadow-sm"
                                                        title="Delete Tracking Number"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
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
