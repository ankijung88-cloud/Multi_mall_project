import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, DollarSign, Clock, Handshake, Briefcase, MessageCircle, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { usePartners } from '../context/PartnerContext';
import { useAgents } from '../context/AgentContext';
import { useFreelancers } from '../context/FreelancerContext';
import { useBoard } from '../context/BoardContext';
import { Trash } from 'lucide-react';
import clsx from 'clsx';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { adminRole } = useAuthStore();
    const { partners, requests: partnerRequests, deleteRequest: deletePartnerRequest, refreshRequests } = usePartners();
    const { requests: agentRequests } = useAgents();
    const { requests: freelancerRequests, freelancers } = useFreelancers();
    const { posts, deletePost } = useBoard();

    // Stats State
    const [stats, setStats] = useState({
        revenue: 0,
        ordersMonthly: 0,
        ordersDaily: 0,
        users: 0,
        growth: '+12%',
        orderCycleLabel: 'Loading...'
    });

    const [appStats, setAppStats] = useState({
        partner: { total: 0, breakdown: {} as Record<string, number> },
        agent: { total: 0, breakdown: {} as Record<string, number> },
        content: { total: 0, breakdown: {} as Record<string, number> }
    });

    const [dailyOrders, setDailyOrders] = useState<any[]>([]);
    const [newMembers, setNewMembers] = useState<any[]>([]);

    useEffect(() => {
        if (adminRole === 'partner') {
            navigate('/admin/partner-requests', { replace: true });
        } else if (adminRole === 'agent') {
            navigate('/admin/agent-requests', { replace: true });
        }
    }, [adminRole, navigate]);

    // Real-time polling for partner requests
    useEffect(() => {
        const interval = setInterval(() => {
            if (refreshRequests) refreshRequests();
        }, 5000);
        return () => clearInterval(interval);
    }, [refreshRequests]);

    // Data Migration Logic
    const [localCount, setLocalCount] = useState(0);
    const [isMigrating, setIsMigrating] = useState(false);

    useEffect(() => {
        const local = localStorage.getItem('mall_orders');
        if (local) {
            try {
                const parsed = JSON.parse(local);
                if (Array.isArray(parsed)) {
                    setLocalCount(parsed.length);
                }
            } catch (e) {
                console.error("Local data check failed", e);
            }
        }
    }, []);

    const migrateLocalData = async () => {
        if (!confirm(`Found ${localCount} orders in your browser storage. Do you want to upload them to the server? This may take a moment.`)) return;

        setIsMigrating(true);
        const local = localStorage.getItem('mall_orders');
        if (!local) return;

        try {
            const parsed = JSON.parse(local);
            let successCount = 0;
            let failCount = 0;

            for (const order of parsed) {
                try {
                    // Ensure payload matches API expectation
                    const payload = {
                        id: order.id,
                        customerName: order.customerName,
                        customerEmail: order.customerEmail,
                        totalAmount: order.totalAmount,
                        currency: order.currency,
                        paymentMethod: order.paymentMethod,
                        status: order.status,
                        date: order.date,
                        items: Array.isArray(order.items) ? order.items : []
                    };
                    await axios.post('/api/orders', payload);
                    successCount++;
                } catch (err: any) {
                    // Ignore duplicate key errors (409 or 500 with unique constraint)
                    console.warn(`Failed to migrate order ${order.id}:`, err);
                    failCount++;
                }
            }
            alert(`Migration Complete.\nSuccess: ${successCount}\nSkipped/Failed: ${failCount}`);
            loadData(); // Refresh View
        } catch (e) {
            alert("Migration failed critically");
        } finally {
            setIsMigrating(false);
        }
    };

    const loadData = async () => {
        let members: any[] = [];
        try {
            const { data } = await axios.get('/api/auth/admin/members');
            members = Array.isArray(data) ? data : [];
        } catch (e) {
            console.error("Failed to fetch members", e);
        }

        let orders: any[] = [];
        try {
            // Fetch from API
            const { data } = await axios.get('/api/orders');
            orders = Array.isArray(data) ? data : [];
        } catch (e) {
            console.error("Failed to fetch orders from API", e);
        }

        // 1. Calculate Revenue (Total Accumulated)
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

        // Daily Count (Today 00:00 ~ 23:59)
        const cycleStart = new Date(now);
        cycleStart.setHours(0, 0, 0, 0);

        const cycleEnd = new Date(now);
        cycleEnd.setHours(23, 59, 59, 999);

        const dailyFiltered = orders.filter((o: any) => {
            const d = new Date(o.date);
            return d >= cycleStart && d <= cycleEnd;
        });

        const dailyCount = dailyFiltered.length;

        // "Recent Orders" List: User requested to show only "Today's Orders"
        const todaysOrdersSorted = dailyFiltered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setDailyOrders(todaysOrdersSorted);

        const cycleLabel = `Today's Orders (${cycleStart.toLocaleDateString()})`;

        setStats({
            revenue: totalRevenue,
            ordersMonthly: monthlyCount,
            ordersDaily: dailyCount,
            users: members.length,
            growth: '+12%',
            orderCycleLabel: cycleLabel
        });

        // New Members (Top 10 Recently Registered)
        const recentMembers = [...members]
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);

        setNewMembers(recentMembers);
    };

    // Load data on mount and listen for storage changes
    useEffect(() => {
        loadData();

        const handleStorageChange = () => {
            loadData();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('mall_orders_updated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('mall_orders_updated', handleStorageChange);
        };
    }, []);

    // Partner/Agent/Content Context Stats
    useEffect(() => {
        const partnerBreakdown: Record<string, number> = {};
        // Exclude 'Partnership Inquiry' from Partner Apps stats
        partnerRequests
            .filter(req => req.scheduleTitle !== 'Partnership Inquiry')
            .forEach(req => {
                const partner = partners.find(p => p.id === req.partnerId);
                const rawCategory = partner?.category || 'Uncategorized';
                const category = (rawCategory === 'Fashion' || rawCategory === '패션') ? '패션 & 사진' : rawCategory;
                partnerBreakdown[category] = (partnerBreakdown[category] || 0) + 1;
            });

        // Also update the total count for partner apps
        const validPartnerRequests = partnerRequests.filter(req => req.scheduleTitle !== 'Partnership Inquiry');

        const agentBreakdown: Record<string, number> = {};
        agentRequests.forEach(req => {
            const type = req.userType || 'Personal';
            agentBreakdown[type] = (agentBreakdown[type] || 0) + 1;
        });

        const contentBreakdown: Record<string, number> = {};
        freelancerRequests.forEach(req => {
            const freelancer = freelancers.find(f => f.id === req.freelancerId);
            const title = freelancer?.title || 'General';
            contentBreakdown[title] = (contentBreakdown[title] || 0) + 1;
        });

        setAppStats({
            partner: { total: validPartnerRequests.length, breakdown: partnerBreakdown },
            agent: { total: agentRequests.length, breakdown: agentBreakdown },
            content: { total: freelancerRequests.length, breakdown: contentBreakdown }
        });
    }, [partners, partnerRequests, agentRequests, freelancerRequests, freelancers]);



    const statCards = [
        { label: '총 매출 (Revenue)', value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500' },
        {
            label: '총 주문수 (Orders)',
            isMultiLine: true,
            lines: [
                { label: '이번 달 (Monthly)', value: stats.ordersMonthly },
                { label: '오늘 (Daily)', value: stats.ordersDaily, sub: stats.orderCycleLabel }
            ],
            icon: ShoppingBag,
            color: 'bg-blue-500'
        },
        { label: '총 회원수 (Users)', value: stats.users.toLocaleString(), icon: Users, color: 'bg-indigo-500' },
        { label: '성장률 (Growth)', value: stats.growth, icon: TrendingUp, color: 'bg-purple-500' },
    ];

    const appCards = [
        {
            label: '파트너 신청 (Partner Apps)',
            count: appStats.partner.total,
            breakdown: appStats.partner.breakdown,
            icon: Handshake,
            color: 'bg-orange-500',
            textColor: 'text-orange-600'
        },
        {
            label: '에이전시 신청 (Agent Apps)',
            count: appStats.agent.total,
            breakdown: appStats.agent.breakdown,
            icon: Briefcase,
            color: 'bg-teal-500',
            textColor: 'text-teal-600'
        },
        {
            label: '콘텐츠 신청 (Content Apps)',
            count: appStats.content.total,
            breakdown: appStats.content.breakdown,
            icon: MessageCircle,
            color: 'bg-pink-500',
            textColor: 'text-pink-600'
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">대시보드 개요 (Dashboard Overview)</h2>
                    {localCount > 0 && (
                        <button
                            onClick={migrateLocalData}
                            disabled={isMigrating}
                            className="mt-1 text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                            <span>⚠️ Found Legacy Data ({localCount}) - Click to Sync</span>
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            loadData();
                            if (refreshRequests) refreshRequests();
                        }}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200"
                    >
                        강제 새로고침 (Force Refresh)
                    </button>
                    <div className="text-sm text-gray-500">
                        실시간 데이터 자동 갱신
                    </div>
                </div>
            </div>

            {/* Top Stats Grid */}
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

            {/* Daily Orders List (Full Width) */}
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-800">Recent Orders (최근 주문 내역)</h3>
                        <p className="text-xs text-gray-500 mt-1">{stats.orderCycleLabel}</p>
                    </div>
                    <div className="flex gap-2">

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

            {/* Application Status Row (Middle) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {appCards.map((app, index) => (
                    <motion.div
                        key={app.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="text-gray-500 text-sm font-medium mb-1">{app.label}</h4>
                                <div className={`text-2xl font-bold ${app.textColor}`}>{app.count}</div>
                            </div>
                            <div className={`${app.color} p-2 rounded-lg text-white shadow-sm`}>
                                <app.icon size={20} />
                            </div>
                        </div>

                        {/* Breakdown List */}
                        <div className="space-y-1 mt-3 pt-3 border-t border-gray-100">
                            {Object.entries(app.breakdown).length === 0 ? (
                                <p className="text-xs text-gray-400">No applications yet</p>
                            ) : (
                                Object.entries(app.breakdown).map(([key, value]) => (
                                    <div key={key} className="flex justify-between text-xs">
                                        <span className="text-gray-600 font-medium">{key}</span>
                                        <span className="text-gray-800 font-bold bg-gray-100 px-1.5 rounded">{value}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Partnership Inquiries (Full Width) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-800">Partnership Inquiries (제휴 문의)</h3>
                        <span className="bg-red-50 text-red-600 text-xs px-2 py-0.5 rounded-full font-bold">New</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Date</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Type</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Author/Source</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Title</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Contact</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(() => {
                                // 1. Partner Requests (from Detail Page)
                                const partnerInquiries = partnerRequests
                                    .filter(r => r.scheduleTitle === 'Partnership Inquiry')
                                    .map(r => ({
                                        id: r.id,
                                        date: r.timestamp,
                                        author: r.userName,
                                        title: r.inquiryContent || r.scheduleTitle,
                                        contact: r.contact,
                                        status: r.status,
                                        source: 'Partner Detail',
                                        isBoard: false,
                                        inquirerType: r.userType || 'Personal'
                                    }));

                                // 2. Board Inquiries (from K-Culture Menu)
                                const boardInquiries = posts
                                    .filter(p => p.type === 'partner-inquiry')
                                    .map(p => ({
                                        id: p.id,
                                        date: p.date,
                                        author: p.author,
                                        title: p.title,
                                        contact: p.contactInfo,
                                        status: p.status,
                                        source: 'Inquiry Board',
                                        isBoard: true,
                                        inquirerType: p.viewMode === 'company' ? 'Company' : 'Personal'
                                    }));

                                // Merge and Sort
                                const merged = [...partnerInquiries, ...boardInquiries]
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .slice(0, 10);

                                if (merged.length === 0) {
                                    return (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">
                                                신규 문의 내역이 없습니다. (No new inquiries)
                                            </td>
                                        </tr>
                                    )
                                }

                                return merged.map((inq, idx) => (
                                    <tr key={`${inq.id}-${idx}`} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-xs text-gray-500">
                                            {new Date(inq.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={clsx(
                                                "text-[10px] px-2 py-0.5 rounded font-bold border",
                                                inq.inquirerType === 'Company'
                                                    ? "bg-blue-50 text-blue-700 border-blue-100"
                                                    : "bg-gray-50 text-gray-600 border-gray-100"
                                            )}>
                                                {inq.inquirerType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                            {inq.author}
                                            <span className="block text-[10px] text-gray-400">{inq.source}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[200px]">
                                            {inq.title}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{inq.contact || '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className={clsx(
                                                "text-[10px] px-2 py-0.5 rounded font-medium",
                                                inq.status === 'approved' || inq.status === 'Resolved' ? "bg-green-100 text-green-700" :
                                                    "bg-yellow-50 text-yellow-700"
                                            )}>
                                                {inq.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('정말 삭제하시겠습니까?')) {
                                                        if (inq.isBoard) {
                                                            deletePost(inq.id);
                                                        } else {
                                                            deletePartnerRequest(inq.id);
                                                        }
                                                    }
                                                }}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ));
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Members (Full Width) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800">New Members</h3>
                    <Link to="/admin/members" className="text-sm text-blue-600 hover:text-blue-800">View All</Link>
                </div>

                {newMembers.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No members yet.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {newMembers.map((member) => (
                            <div key={member.id} className="flex items-center justify-between border border-gray-100 p-3 rounded-lg hover:shadow-sm transition-shadow">
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
    );
}
