import { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle, Truck } from 'lucide-react';

interface Order {
    id: string;
    customerName: string;
    items: any[];
    totalAmount: number;
    status: string;
    returnStatus?: 'Requested' | 'Receiving' | 'Completed';
    refundStatus?: 'Pending' | 'Completed';
    date: string;
}

export default function AdminReturns() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const stored = localStorage.getItem('mall_orders');
        if (stored) {
            try {
                const allOrders: Order[] = JSON.parse(stored);
                // Filter only orders with returnStatus or set some for testing if none exist (simulate for now as we don't have return flow yet)
                // In real app, we only show those with returnStatus.
                // For demo purposes, we might need to manually set some statuses in localStorage if none exist, 
                // but here we just read.
                setOrders(allOrders);
            } catch (error) {
                console.error("Failed to load orders", error);
            }
        }
    };

    const updateReturnStatus = (orderId: string, newStatus: 'Receiving' | 'Completed') => {
        if (window.confirm(`Update return status to ${newStatus}?`)) {
            const updatedOrders = orders.map(o =>
                o.id === orderId ? { ...o, returnStatus: newStatus } : o
            );
            setOrders(updatedOrders);
            localStorage.setItem('mall_orders', JSON.stringify(updatedOrders));
        }
    };

    const handleRefund = (orderId: string, amount: number) => {
        if (window.confirm(`Process refund of $${amount.toLocaleString()} for Order #${orderId}?`)) {
            const updatedOrders = orders.map(o =>
                o.id === orderId ? { ...o, refundStatus: 'Completed' as const } : o
            );
            setOrders(updatedOrders);
            localStorage.setItem('mall_orders', JSON.stringify(updatedOrders));
        }
    };

    // Filter into three categories
    const requestedReturns = orders.filter(o => o.returnStatus === 'Requested');
    const receivingReturns = orders.filter(o => o.returnStatus === 'Receiving');
    const completedReturns = orders.filter(o => o.returnStatus === 'Completed');

    const ReturnTable = ({ title, data, icon: Icon, colorClass, actionButton }: {
        title: string,
        data: Order[],
        icon: any,
        colorClass: string,
        actionButton?: (order: Order) => React.ReactNode
    }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className={`p-4 border-b border-gray-100 ${colorClass} bg-opacity-10 flex items-center gap-2`}>
                <Icon className={colorClass} size={20} />
                <h3 className={`font-bold ${colorClass}`}>{title}</h3>
                <span className="ml-auto text-xs font-semibold px-2 py-1 bg-white rounded-full text-gray-600 border border-gray-200">
                    {data.length}
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Order Amount (주문금액)</th>
                            {actionButton && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={actionButton ? 6 : 5} className="px-6 py-8 text-center text-gray-400">
                                    No orders in this status.
                                </td>
                            </tr>
                        ) : (
                            data.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{order.items.map(i => i.name).join(', ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">${order.totalAmount.toLocaleString()}</td>
                                    {actionButton && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {actionButton(order)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <RotateCcw className="text-red-600" />
                Returns Management
            </h2>

            <ReturnTable
                title="Return Requested (반품요청건)"
                data={requestedReturns}
                icon={RotateCcw}
                colorClass="text-red-600"
                actionButton={(order) => (
                    <button
                        onClick={() => updateReturnStatus(order.id, 'Receiving')}
                        className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-3 py-1 rounded-full border border-blue-200"
                    >
                        Accept & Receive
                    </button>
                )}
            />

            <ReturnTable
                title="Return Receiving (반품수령중)"
                data={receivingReturns}
                icon={Truck}
                colorClass="text-orange-600"
                actionButton={(order) => (
                    <button
                        onClick={() => updateReturnStatus(order.id, 'Completed')}
                        className="text-green-600 hover:text-green-900 text-xs bg-green-50 px-3 py-1 rounded-full border border-green-200"
                    >
                        Complete Return
                    </button>
                )}
            />

            <ReturnTable
                title="Return Completed (반품완료)"
                data={completedReturns}
                icon={CheckCircle}
                colorClass="text-green-600"
                actionButton={(order) => (
                    <div className="flex flex-col items-end gap-1">
                        <div className="text-xs text-gray-500 mb-1">
                            Refund Amount: <span className="font-bold text-gray-900">${order.totalAmount.toLocaleString()}</span>
                        </div>
                        {order.refundStatus === 'Completed' ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                Refunded (환불완료)
                            </span>
                        ) : (
                            <button
                                onClick={() => handleRefund(order.id, order.totalAmount)}
                                className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-3 py-1 rounded-full border border-red-200"
                            >
                                Process Refund (환불처리)
                            </button>
                        )}
                    </div>
                )}
            />
        </div>
    );
}

