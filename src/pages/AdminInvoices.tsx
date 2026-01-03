import { useState, useEffect } from 'react';
import { FileText, CheckCircle, Printer, Search } from 'lucide-react';

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status: string;
    date: string;
    invoiceStatus?: 'Pending' | 'Issued' | 'Cancelled';
    invoiceNumber?: string;
    invoiceDate?: string;
}

export default function AdminInvoices() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const stored = localStorage.getItem('mall_orders');
        if (stored) {
            try {
                const allOrders: Order[] = JSON.parse(stored);
                // Filter only Shipped or Delivered for invoice issuance eligibility
                const eligible = allOrders.filter(o =>
                    ['Shipped', 'Delivered', 'Completed'].includes(o.status)
                );
                // Sort by Date Descending
                eligible.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setOrders(eligible);
            } catch (error) {
                console.error("Failed to load orders", error);
            }
        }
    };

    const handleIssueInvoice = (orderId: string) => {
        if (window.confirm('Issue invoice for this order?')) {
            const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${orderId.slice(-4)}`;
            const invoiceDate = new Date().toISOString();

            updateOrderStatus(orderId, { invoiceStatus: 'Issued', invoiceNumber, invoiceDate });
        }
    };

    const handleCancelPending = (orderId: string) => {
        if (window.confirm('Do you want to cancel/hide this invoice request? It will be removed from the To Issue list.')) {
            updateOrderStatus(orderId, { invoiceStatus: 'Cancelled' });
        }
    };

    const handleRevokeIssued = (orderId: string) => {
        if (window.confirm('Revoke this invoice? It will move back to the To Issue list.')) {
            updateOrderStatus(orderId, { invoiceStatus: 'Pending', invoiceNumber: undefined, invoiceDate: undefined });
        }
    };

    const updateOrderStatus = (orderId: string, updates: Partial<Order>) => {
        const allOrders = JSON.parse(localStorage.getItem('mall_orders') || '[]');
        const updatedAllOrders = allOrders.map((o: any) =>
            o.id === orderId ? { ...o, ...updates } : o
        );

        localStorage.setItem('mall_orders', JSON.stringify(updatedAllOrders));
        loadData();
    };

    const filteredOrders = orders.filter(o =>
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.invoiceNumber && o.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const pendingInvoices = filteredOrders.filter(o => !o.invoiceStatus || o.invoiceStatus === 'Pending');
    const issuedInvoices = filteredOrders.filter(o => o.invoiceStatus === 'Issued');

    const InvoiceTable = ({ title, data, icon: Icon, colorClass, isIssued }: {
        title: string,
        data: Order[],
        icon: any,
        colorClass: string,
        isIssued?: boolean
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
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            {isIssued && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>}
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={isIssued ? 6 : 5} className="px-6 py-8 text-center text-gray-400">
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            data.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {order.customerName}
                                        <div className="text-xs text-gray-400">{order.customerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">${order.totalAmount.toLocaleString()}</td>
                                    {isIssued && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                                            {order.invoiceNumber}
                                            <div className="text-xs text-gray-400">{new Date(order.invoiceDate!).toLocaleDateString()}</div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {isIssued ? (
                                            <div className="flex items-center justify-end gap-2 w-full">
                                                <button
                                                    onClick={() => handleRevokeIssued(order.id)}
                                                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                                                >
                                                    Cancel Issue
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-600 cursor-not-allowed flex items-center gap-1">
                                                    <Printer size={16} /> Print
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleCancelPending(order.id)}
                                                    className="text-gray-400 hover:text-gray-600 text-xs font-medium"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleIssueInvoice(order.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-200"
                                                >
                                                    Issue Invoice
                                                </button>
                                            </div>
                                        )}
                                    </td>
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="text-indigo-600" />
                    Invoice Management
                </h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                </div>
            </div>

            <InvoiceTable
                title="To Issue (발행 대기)"
                data={pendingInvoices}
                icon={FileText}
                colorClass="text-orange-600"
                isIssued={false}
            />

            <InvoiceTable
                title="Issued (발행 완료)"
                data={issuedInvoices}
                icon={CheckCircle}
                colorClass="text-green-600"
                isIssued={true}
            />
        </div>
    );
}
