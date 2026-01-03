import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, Calendar, Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { usePartners } from '../context/PartnerContext';
import { useAgents } from '../context/AgentContext';
import MainLayout from '../layouts/MainLayout';
import clsx from 'clsx';

interface Order {
    id: string;
    customerEmail: string;
    items: any[];
    totalAmount: number;
    status: string;
    date: string;
    trackingNumber?: string;
    returnStatus?: string;
    refundStatus?: string;
}

export default function OrderHistory() {
    const { user } = useAuthStore();
    const { requests: partnerRequests } = usePartners();
    const { requests: agentRequests } = useAgents();
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [pastOrders, setPastOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (!user) return;

        const stored = localStorage.getItem('mall_orders');
        if (stored) {
            try {
                const allOrders: Order[] = JSON.parse(stored);
                // Filter by logged-in user
                // Assuming user.email matches customerEmail in orders for now, or user.id
                // In a real app we'd match ID. Here we'll try to match email if available, or just show all for demo if needed.
                // The current order creation logic stores 'customerEmail'.
                const userOrders = allOrders.filter(o => o.customerEmail === user.email);

                // Sort by date desc
                userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                // Split orders
                // Active: Pending, Shipped, Receiving (Return in progress)
                // Past: Delivered, Cancelled, Completed (Return completed)

                const active = userOrders.filter(o =>
                    ['Pending', 'Shipped'].includes(o.status) ||
                    (o.returnStatus && o.returnStatus !== 'Completed')
                );

                const past = userOrders.filter(o =>
                    ['Delivered', 'Cancelled'].includes(o.status) ||
                    o.returnStatus === 'Completed'
                );

                setActiveOrders(active);
                setPastOrders(past);
            } catch (error) {
                console.error("Failed to load orders", error);
            }
        }
    }, [user]);

    const OrderCard = ({ order, isPast }: { order: Order, isPast: boolean }) => (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 mb-4 ${isPast ? 'opacity-75 hover:opacity-100 transition-opacity' : ''}`}>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-gray-900">Order #{order.id}</span>
                    <span className="text-xs text-gray-500">• {new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div className="space-y-1">
                    {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-sm text-gray-700 flex justify-between">
                            <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 font-bold text-gray-900">
                    Total: ${order.totalAmount.toLocaleString()}
                </div>
            </div>

            <div className="md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                    {order.status === 'Pending' && <Clock className="text-orange-500" size={20} />}
                    {order.status === 'Shipped' && <Truck className="text-blue-500" size={20} />}
                    {order.status === 'Delivered' && <CheckCircle className="text-green-500" size={20} />}
                    {(order.status === 'Cancelled' || order.returnStatus) && <Package className="text-gray-500" size={20} />}

                    <span className={`font-semibold ${order.status === 'Shipped' ? 'text-blue-600' :
                        order.status === 'Delivered' ? 'text-green-600' :
                            order.status === 'Pending' ? 'text-orange-600' :
                                'text-gray-600'
                        }`}>
                        {order.returnStatus ? `Return: ${order.returnStatus}` : order.status}
                    </span>
                </div>

                {order.trackingNumber && (
                    <div className="text-sm text-gray-500 mb-2">
                        Tracking: <span className="font-mono text-gray-700">{order.trackingNumber}</span>
                    </div>
                )}

                {order.refundStatus === 'Completed' && (
                    <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded inline-block text-center mt-1">
                        Refunded
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                <section className="mb-12">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Truck className="text-blue-600" />
                        In Progress (진행중인 주문)
                    </h2>
                    {activeOrders.length > 0 ? (
                        activeOrders.map(order => <OrderCard key={order.id} order={order} isPast={false} />)
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-500">
                            No active orders.
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CheckCircle className="text-green-600" />
                        Past Orders (지난 주문 내역)
                    </h2>
                    {pastOrders.length > 0 ? (
                        pastOrders.map(order => <OrderCard key={order.id} order={order} isPast={true} />)
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-500">
                            No past orders.
                        </div>
                    )}
                </section>

                {/* K-Culture Partner Requests */}
                <section className="mt-12 border-t pt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="text-purple-600" />
                        K-Culture Course Applications (참여 신청 내역)
                    </h2>
                    {partnerRequests.filter(r => r.userId === user?.id).length > 0 ? (
                        <div className="space-y-4">
                            {partnerRequests.filter(r => r.userId === user?.id).reverse().map(req => (
                                <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900">{req.partnerName}</span>
                                            <span className="text-xs text-gray-500">• {new Date(req.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-gray-700 font-medium">{req.scheduleTitle}</div>
                                        <div className="text-sm text-gray-500">Scheduled: {req.scheduleDate}</div>
                                    </div>
                                    <div>
                                        <span className={clsx(
                                            "px-3 py-1 rounded-full text-xs font-semibold",
                                            req.status === 'approved' ? "bg-green-100 text-green-800" :
                                                req.status === 'sent_to_partner' ? "bg-blue-100 text-blue-800" :
                                                    "bg-yellow-100 text-yellow-800"
                                        )}>
                                            {req.status === 'sent_to_partner' ? '전송됨' :
                                                req.status === 'approved' ? '승인됨' : '대기중'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-500">
                            신청 내역이 없습니다.
                        </div>
                    )}
                </section>

                {/* Agent Schedule Requests */}
                <section className="mt-12 border-t pt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Users className="text-indigo-600" />
                        Agent Schedule Applications (에이전트 상담 신청 내역)
                    </h2>
                    {agentRequests.filter(r => r.userId === user?.id).length > 0 ? (
                        <div className="space-y-4">
                            {agentRequests.filter(r => r.userId === user?.id).reverse().map(req => (
                                <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900">{req.agentName}</span>
                                            <span className="text-xs text-gray-500">• {new Date(req.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-gray-700 font-medium">{req.scheduleTitle}</div>
                                        <div className="text-sm text-gray-500">Scheduled: {req.scheduleDate}</div>
                                    </div>
                                    <div>
                                        <span className={clsx(
                                            "px-3 py-1 rounded-full text-xs font-semibold",
                                            req.status === 'approved' ? "bg-green-100 text-green-800" :
                                                req.status === 'sent_to_agent' ? "bg-blue-100 text-blue-800" :
                                                    "bg-yellow-100 text-yellow-800"
                                        )}>
                                            {req.status === 'sent_to_agent' ? '전송됨' :
                                                req.status === 'approved' ? '승인됨' : '대기중'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl text-gray-500">
                            신청 내역이 없습니다.
                        </div>
                    )}
                </section>
            </div>
        </MainLayout>
    );
}
