import { useState } from 'react';
import { useFreelancers } from '../context/FreelancerContext';
import { useAuthStore } from '../store/useAuthStore';
import { Check, X, Trash2, Search, MessageSquare } from 'lucide-react';
import UserDetailModal from '../components/UserDetailModal';

export default function AdminContentRequests() {
    const { requests, updateRequestStatus, deleteRequest } = useFreelancers();
    const { adminRole, adminTargetId } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [detailUser, setDetailUser] = useState<{ id: string, type: string } | null>(null);

    // Filter requests based on role
    const filteredRequests = requests.filter(req => {
        // 1. Role Filter
        if (adminRole === 'freelancer') {
            if (req.freelancerId !== String(adminTargetId)) return false;
        }

        // 2. Search Filter
        const search = searchTerm.toLowerCase();
        return (
            req.userName?.toLowerCase().includes(search) ||
            req.freelancerName.toLowerCase().includes(search) ||
            req.message.toLowerCase().includes(search)
        );
    });

    // Sort by Date Descending
    filteredRequests.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleApprove = (id: string) => {
        if (window.confirm('승인하시겠습니까?')) {
            updateRequestStatus(id, 'Approved');
        }
    };

    const handleReject = (id: string) => {
        if (window.confirm('거절하시겠습니까?')) {
            updateRequestStatus(id, 'Rejected');
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('영구적으로 삭제하시겠습니까?')) {
            deleteRequest(id);
        }
    };

    const handleUserClick = (userId: string) => {
        if (adminRole === 'super') {
            // Content requests are typically from Personal users in this context
            setDetailUser({ id: userId, type: 'Personal' });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">개인 컨텐츠 참여 관리</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {adminRole === 'super' ? '전체 프리랜서 참여 요청 내역' : '나의 컨텐츠 참여 요청 내역'}
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="검색 (신청자, 전문가, 메시지)..."
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">신청 날짜</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">신청자 정보</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">대상 전문가</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">메시지</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                    <MessageSquare size={48} className="mb-3 opacity-20" />
                                    <p>참여 요청 내역이 없습니다.</p>
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(req.date).toLocaleDateString()}
                                        <div className="text-xs text-gray-400">
                                            {new Date(req.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    req.status === 'Paid' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="font-medium flex items-center gap-2">
                                            {adminRole === 'super' ? (
                                                <button
                                                    onClick={() => handleUserClick(req.userId)}
                                                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                                    title="클릭하여 상세정보 확인"
                                                >
                                                    {req.userName || 'Guest'}
                                                </button>
                                            ) : (
                                                req.userName || 'Guest'
                                            )}
                                            {req.requesterType && (
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${req.requesterType === 'company'
                                                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    }`}>
                                                    {req.requesterType === 'company' ? 'Company' : 'Personal'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">{req.contactInfo}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {req.freelancerName}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={req.message}>
                                        {req.message}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            {(req.status === 'Pending') && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(req.id)}
                                                        className="text-green-600 hover:text-green-900 p-1 bg-green-50 rounded"
                                                        title="승인"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(req.id)}
                                                        className="text-red-400 hover:text-red-600 p-1 bg-red-50 rounded"
                                                        title="거절"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {req.status === 'Paid' && (
                                                <span className="text-xs text-blue-600 font-bold px-2">Completed</span>
                                            )}
                                            {adminRole === 'super' && (
                                                <button
                                                    onClick={() => handleDelete(req.id)}
                                                    className="text-gray-400 hover:text-red-600 p-1 ml-2"
                                                    title="영구 삭제"
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

            {/* User Detail Modal */}
            {detailUser && (
                <UserDetailModal
                    isOpen={!!detailUser}
                    onClose={() => setDetailUser(null)}
                    userId={detailUser.id}
                    userType={detailUser.type as any}
                />
            )}
        </div>
    );
}
