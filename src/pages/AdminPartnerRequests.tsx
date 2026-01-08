import { usePartners } from '../context/PartnerContext';
import { useAuthStore } from '../store/useAuthStore';
import { Send, CheckCircle, Trash, Edit, X, Save, FileCheck } from 'lucide-react';
import clsx from 'clsx';
import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { PartnerRequest } from '../context/PartnerContext';
import UserDetailModal from '../components/UserDetailModal';

const CATEGORY_MAP: Record<string, string> = {
    course: '코스',
    beauty: '뷰티 & 성형',
    performance: '공연 & 전시',
    audition: '오디션',
    fashion: '패션'
};

const REVERSE_CATEGORY_MAP: Record<string, string> = {
    '코스': 'Course',
    '뷰티 & 성형': 'Beauty & Plastic Surgery',
    '공연 & 전시': 'Performance & Exhibition',
    '오디션': 'Audition',
    '패션': 'Fashion'
};

export default function AdminPartnerRequests() {
    const { partners, requests, updateRequestStatus, deleteRequest, updateRequest } = usePartners();
    const adminRole = useAuthStore(state => state.adminRole);
    const adminTargetId = useAuthStore(state => state.adminTargetId);
    const { category } = useParams<{ category: string }>();
    const currentCategoryName = category ? CATEGORY_MAP[category] : undefined;

    const [editingRequest, setEditingRequest] = useState<PartnerRequest | null>(null);

    // User Detail Modal State
    const [detailUser, setDetailUser] = useState<{ id: string, type: string } | null>(null);

    const displayedRequests = useMemo(() => {
        if (!currentCategoryName) return [];

        // 1. Filter partners by category
        const categoryPartnerIds = partners
            .filter(p => {
                if (!p.category) return false;
                return p.category.trim() === currentCategoryName.trim();
            })
            .map(p => p.id);

        // 2. Filter requests belonging to those partners
        let filtered = requests.filter(r => categoryPartnerIds.includes(r.partnerId));

        // 3. Apply Role Filtering (if Partner Admin)
        if (adminRole === 'partner' && adminTargetId) {
            filtered = filtered.filter(r => r.partnerId === adminTargetId);
        }

        return filtered;
    }, [requests, partners, currentCategoryName, adminRole, adminTargetId]);

    const handleSendToPartner = (id: string, partnerName: string) => {
        if (window.confirm(`Send this request detailed to ${partnerName}?`)) {
            updateRequestStatus(id, 'sent_to_partner');
            alert(`Request sent to ${partnerName} successfully.`);
        }
    };

    const handleApprove = (id: string) => {
        updateRequestStatus(id, 'approved');
    };

    const handleSendConfirmation = (id: string, userName: string) => {
        if (window.confirm(`Send reservation confirmation to ${userName}?`)) {
            updateRequestStatus(id, 'confirmation_sent');
            alert(`Reservation confirmation sent to ${userName}.`);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("정말로 이 요청을 삭제하시겠습니까?")) {
            deleteRequest(id);
        }
    };

    const openEditModal = (request: PartnerRequest) => {
        setEditingRequest(request);
    };

    const handleSaveEdit = () => {
        if (editingRequest) {
            updateRequest(editingRequest.id, editingRequest);
            setEditingRequest(null);
        }
    };

    // Helper to open user detail
    const handleUserClick = (userId: string, userType: any) => {
        if (adminRole === 'super') {
            setDetailUser({ id: userId, type: userType });
        }
    };

    if (!currentCategoryName) {
        return <div className="p-6">Invalid Category</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">제휴 업체 참여 요청 관리</h2>
            <p className="text-gray-500 mb-6">{REVERSE_CATEGORY_MAP[currentCategoryName] || currentCategoryName}</p>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayedRequests.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                    이 카테고리의 참여 요청 내역이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            displayedRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(request.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {adminRole === 'super' ? (
                                                <button
                                                    onClick={() => handleUserClick(request.userId, request.userType)}
                                                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                                    title="클릭하여 상세정보 확인"
                                                >
                                                    {request.userName}
                                                </button>
                                            ) : (
                                                request.userName
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">{request.userId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={clsx(
                                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full border",
                                            request.userType === 'Company'
                                                ? "bg-sky-100 text-sky-800 border-sky-200"
                                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        )}>
                                            {request.userType === 'Company' ? 'company' : 'personal'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {request.partnerName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {request.inquiryContent ? <span className="text-purple-600 font-bold">[문의] 1:1 상담</span> : request.scheduleTitle}
                                        </div>
                                        <div className="text-sm text-gray-500">{request.scheduleDate}</div>
                                        {request.inquiryContent && (
                                            <div className="text-xs text-gray-500 truncate w-32">{request.inquiryContent}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={clsx(
                                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                            request.status === 'approved' ? "bg-green-100 text-green-800" :
                                                request.status === 'sent_to_partner' ? "bg-blue-100 text-blue-800" :
                                                    request.status === 'confirmation_sent' ? "bg-purple-100 text-purple-800" :
                                                        "bg-yellow-100 text-yellow-800"
                                        )}>
                                            {request.status === 'sent_to_partner' ? 'Sent to Partner' :
                                                request.status === 'confirmation_sent' ? '확정서 전송옴' :
                                                    request.status === 'approved' ? '승인됨' : '대기중'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-gray-900">
                                        {request.paymentAmount ? `₩${request.paymentAmount.toLocaleString()}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center space-x-2">
                                            {request.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(request.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="승인"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    {adminRole !== 'partner' && (
                                                        <button
                                                            onClick={() => handleSendToPartner(request.id, request.partnerName)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="업체 전송"
                                                        >
                                                            <Send size={18} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            {request.status === 'approved' && adminRole !== 'partner' && (
                                                <button
                                                    onClick={() => handleSendToPartner(request.id, request.partnerName)}
                                                    className="text-blue-600 hover:text-blue-900 flex items-center"
                                                    title="업체 전송"
                                                >
                                                    <Send size={16} className="mr-1" />
                                                </button>
                                            )}

                                            {/* Reservation Confirmation - Visible to Partner/Super */}
                                            {(adminRole === 'partner' || adminRole === 'super') && request.status !== 'pending' && (
                                                <button
                                                    onClick={() => handleSendConfirmation(request.id, request.userName)}
                                                    className="text-purple-600 hover:text-purple-900"
                                                    title="예약확정서 전송"
                                                >
                                                    <FileCheck size={18} />
                                                </button>
                                            )}

                                            <div className="h-4 w-px bg-gray-300 mx-2"></div>
                                            <button
                                                onClick={() => openEditModal(request)}
                                                className="text-gray-600 hover:text-blue-600"
                                                title="수정"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(request.id)}
                                                className="text-gray-600 hover:text-red-600"
                                                title="삭제"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingRequest && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">요청 수정</h3>
                            <button onClick={() => setEditingRequest(null)}><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">신청자명</label>
                                <input
                                    type="text"
                                    value={editingRequest.userName}
                                    onChange={(e) => setEditingRequest({ ...editingRequest, userName: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">상태 (Status)</label>
                                <select
                                    value={editingRequest.status}
                                    onChange={(e) => setEditingRequest({ ...editingRequest, status: e.target.value as any })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="pending">대기 (Pending)</option>
                                    <option value="approved">승인 (Approved)</option>
                                    <option value="sent_to_partner">업체 전송됨 (Sent)</option>
                                </select>
                            </div>


                            {editingRequest.inquiryContent && (
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
                                    <div className="w-full border rounded px-3 py-2 bg-gray-50 text-sm h-32 overflow-y-auto whitespace-pre-wrap">
                                        {editingRequest.inquiryContent}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setEditingRequest(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
                            >
                                <Save size={18} className="mr-2" />
                                저장
                            </button>
                        </div>
                    </div>
                </div >
            )
            }

            {/* User Detail Modal */}
            {
                detailUser && (
                    <UserDetailModal
                        isOpen={!!detailUser}
                        onClose={() => setDetailUser(null)}
                        userId={detailUser.id}
                        userType={detailUser.type as any}
                    />
                )
            }
        </div >
    );
}
