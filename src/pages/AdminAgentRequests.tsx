import { useAgents } from '../context/AgentContext';
import { useAuthStore } from '../store/useAuthStore';
import { Send, CheckCircle, Trash, Edit, X, Save } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import type { AgentRequest } from '../context/AgentContext';

export default function AdminAgentRequests() {
    const { requests, updateRequestStatus, deleteRequest, updateRequest } = useAgents();
    const adminRole = useAuthStore(state => state.adminRole);
    const adminTargetId = useAuthStore(state => state.adminTargetId);
    const [editingRequest, setEditingRequest] = useState<AgentRequest | null>(null);

    // Filter displayed requests
    const filteredRequests = Array.isArray(requests) && (adminRole === 'agent' && adminTargetId)
        ? requests.filter(r => r.agentId === adminTargetId)
        : Array.isArray(requests) ? requests : [];

    // Sort requests by timestamp descending (newest first)
    const sortedRequests = [...filteredRequests].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const handleSendToAgent = (id: string, agentName: string) => {
        if (window.confirm(`${agentName}님에게 이 요청 상세 내용을 전송하시겠습니까?`)) {
            updateRequestStatus(id, 'sent_to_agent');
            alert(`${agentName}님에게 요청이 성공적으로 전송되었습니다.`);
        }
    };

    const handleApprove = (id: string) => {
        updateRequestStatus(id, 'approved');
    };

    const handleDelete = (id: string) => {
        if (window.confirm("정말로 이 요청을 삭제하시겠습니까?")) {
            deleteRequest(id);
        }
    };

    const openEditModal = (request: AgentRequest) => {
        setEditingRequest(request);
    };

    const handleSaveEdit = () => {
        if (editingRequest) {
            updateRequest(editingRequest.id, editingRequest);
            setEditingRequest(null);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">에이전트 참여 요청 관리</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청일시</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청자</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">에이전트</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청 일정</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedRequests.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    {Array.isArray(requests) ? "참여 신청 내역이 없습니다." : "데이터 로딩 중..."}
                                </td>
                            </tr>
                        ) : (
                            sortedRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(request.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                                        <div className="text-sm text-gray-500">{request.userId}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {request.agentName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{request.scheduleTitle}</div>
                                        <div className="text-sm text-gray-500">{request.scheduleDate}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={clsx(
                                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                            request.status === 'approved' ? "bg-green-100 text-green-800" :
                                                request.status === 'sent_to_agent' ? "bg-blue-100 text-blue-800" :
                                                    "bg-yellow-100 text-yellow-800"
                                        )}>
                                            {request.status === 'sent_to_agent' ? '전송 완료' :
                                                request.status === 'approved' ? '승인됨' : '대기중'}
                                        </span>
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
                                                    {adminRole !== 'agent' && (
                                                        <button
                                                            onClick={() => handleSendToAgent(request.id, request.agentName)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="에이전트 전송"
                                                        >
                                                            <Send size={18} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            {request.status === 'approved' && adminRole !== 'agent' && (
                                                <button
                                                    onClick={() => handleSendToAgent(request.id, request.agentName)}
                                                    className="text-blue-600 hover:text-blue-900 flex items-center"
                                                    title="에이전트 전송"
                                                >
                                                    <Send size={16} className="mr-1" />
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
                            <div className="grid grid-cols-2 gap-4">
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
                                        <option value="sent_to_agent">에이전트 전송됨 (Sent)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">상태 (Status)</label>
                                {/* Duplicate simplified for quick fix, assume user wants robust file */}
                            </div>

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
                </div>
            )}
        </div>
    );
}
