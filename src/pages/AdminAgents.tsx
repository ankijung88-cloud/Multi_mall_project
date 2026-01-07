import { useState } from 'react';
import { useAgents } from '../context/AgentContext';
import { useAuthStore } from '../store/useAuthStore';
import clsx from 'clsx';
import { Plus, Trash, Edit, Save, X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Agent, AgentSchedule } from '../context/AgentContext';

export default function AdminAgents() {
    const { agents, requests, addAgent, updateAgent, deleteAgent } = useAgents();
    const adminRole = useAuthStore(state => state.adminRole);
    const adminTargetId = useAuthStore(state => state.adminTargetId);

    // Filter displayed agents
    const displayedAgents = Array.isArray(agents) && (adminRole === 'agent' && adminTargetId)
        ? agents.filter(a => a.id === adminTargetId)
        : Array.isArray(agents) ? agents : [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
    const [viewingRequestsAgent, setViewingRequestsAgent] = useState<Agent | null>(null);

    // Form State
    const [formName, setFormName] = useState('');
    const [formImage, setFormImage] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formSchedules, setFormSchedules] = useState<AgentSchedule[]>([]);
    const [formCredentials, setFormCredentials] = useState<{ username: string, password: string }>({ username: '', password: '' });
    const [bulkDate, setBulkDate] = useState('');
    const [browseDate, setBrowseDate] = useState(new Date());


    const openModal = (agent?: Agent) => {
        if (agent) {
            setEditingAgent(agent);
            setFormName(agent.name);
            setFormImage(agent.image);
            setFormDescription(agent.description);
            setFormSchedules(agent.schedules);
            setFormCredentials(agent.credentials || { username: '', password: '' });
        } else {
            setEditingAgent(null);
            setFormName('');
            setFormImage('');
            setFormDescription('');
            setFormSchedules([]);
            setFormCredentials({ username: '', password: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAgent(null);
    };

    const handleSave = () => {
        if (!formName) {
            alert("에이전트명은 필수입니다.");
            return;
        }

        const agentData = {
            name: formName,
            image: formImage,
            description: formDescription,
            schedules: formSchedules,
            credentials: (formCredentials.username && formCredentials.password) ? formCredentials : undefined
        };

        if (editingAgent) {
            updateAgent(editingAgent.id, agentData);
        } else {
            addAgent(agentData);
        }
        closeModal();
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (adminRole !== 'super') return;
        if (window.confirm("정말로 이 에이전트를 삭제하시겠습니까? (Are you sure you want to delete this agent?)")) {
            deleteAgent(id);
        }
    };

    const handleEditClick = (agent: Agent, e: React.MouseEvent) => {
        e.stopPropagation();
        openModal(agent);
    };


    const handleSheetChange = (time: string, subIndex: number, field: keyof AgentSchedule, value: any) => {
        if (!bulkDate) return;

        // Find all schedules for this time slot
        const schedulesAtTime = formSchedules.filter(s => s.date === bulkDate && s.time === time);
        const targetSchedule = schedulesAtTime[subIndex];

        if (targetSchedule) {
            // Update existing schedule
            const realIndex = formSchedules.findIndex(s => s.id === targetSchedule.id);
            if (realIndex >= 0) {
                const updated = [...formSchedules];
                updated[realIndex] = { ...updated[realIndex], [field]: value };
                setFormSchedules(updated);
            }
        } else {
            // Create new schedule
            const newSchedule: AgentSchedule = {
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                date: bulkDate,
                time: time,
                title: field === 'title' ? value : '',
                description: field === 'description' ? value : '',
                maxSlots: field === 'maxSlots' ? Number(value) : 10,
                pricePersonal: field === 'pricePersonal' ? Number(value) : undefined,
                priceCompany: field === 'priceCompany' ? Number(value) : undefined,
                currentSlots: 0
            };
            setFormSchedules([...formSchedules, newSchedule]);
        }
    };


    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">에이전트 관리 (Agents)</h2>
                {adminRole === 'super' && (
                    <button
                        onClick={() => openModal()}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        <Plus size={20} />
                        <span>에이전트 추가</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!Array.isArray(displayedAgents) || displayedAgents.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">표시할 에이전트가 없습니다.</p>
                    </div>
                ) : (
                    displayedAgents.map(agent => (
                        <div
                            key={agent.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setViewingRequestsAgent(agent)}
                        >
                            <div className="h-48 overflow-hidden">
                                <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2">{agent.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{agent.description}</p>
                                <div className="flex justify-between items-center border-t pt-4">
                                    <span className="text-sm text-gray-500">일정 {agent.schedules ? agent.schedules.length : 0}개</span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={(e) => handleEditClick(agent, e)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        {adminRole === 'super' && (
                                            <button
                                                onClick={(e) => handleDelete(agent.id, e)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Requests View Modal */}
            {viewingRequestsAgent && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{viewingRequestsAgent.name} 신청 목록</h3>
                                <p className="text-sm text-gray-500">이 에이전트에 대한 모든 사용자 신청 내역입니다.</p>
                            </div>
                            <button onClick={() => setViewingRequestsAgent(null)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청일</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청자</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">신청 일정</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {!requests || requests.filter(r => r.agentId === viewingRequestsAgent.id).length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                신청 내역이 없습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        requests.filter(r => r.agentId === viewingRequestsAgent.id).map(request => (
                                            <tr key={request.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(request.timestamp).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                                                    <div className="text-sm text-gray-500">{request.userId}</div>
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
                                                        {request.status === 'sent_to_agent' ? '전송됨' :
                                                            request.status === 'approved' ? '승인됨' : '대기중'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">{editingAgent ? '에이전트 수정' : '새 에이전트 등록'}</h3>
                            <button onClick={closeModal}><X size={24} /></button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">에이전트명</label>
                                    <input
                                        type="text"
                                        value={formName}
                                        onChange={e => setFormName(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL</label>
                                    <input
                                        type="text"
                                        value={formImage}
                                        onChange={e => setFormImage(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                                <textarea
                                    value={formDescription}
                                    onChange={e => setFormDescription(e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2 h-24"
                                />
                            </div>

                            {/* Credentials Section for Super Admin */}
                            {adminRole === 'super' && (
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                    <h4 className="font-bold text-yellow-800 mb-2">관리자 계정 설정 (Admin Credentials)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Username (ID)</label>
                                            <input
                                                type="text"
                                                value={formCredentials.username}
                                                onChange={e => setFormCredentials({ ...formCredentials, username: e.target.value })}
                                                className="w-full border rounded-lg px-3 py-2"
                                                placeholder="admin_id"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <input
                                                type="text"
                                                value={formCredentials.password}
                                                onChange={e => setFormCredentials({ ...formCredentials, password: e.target.value })}
                                                className="w-full border rounded-lg px-3 py-2"
                                                placeholder="password"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-yellow-600 mt-2">
                                        * 이 계정으로 해당 에이전트 관리자 페이지에 로그인할 수 있습니다.
                                    </p>
                                </div>
                            )}

                            {/* Schedule Section */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold flex items-center"><Calendar size={18} className="mr-2" /> 일정 관리 (Daily Sheet)</h4>
                                </div>

                                {/* Calendar View vs Daily Sheet View */}
                                {!bulkDate ? (
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                        {/* Calendar Header */}
                                        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
                                            <button
                                                onClick={() => setBrowseDate(new Date(browseDate.getFullYear(), browseDate.getMonth() - 1, 1))}
                                                className="p-2 hover:bg-white rounded-full transition-colors"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <h3 className="text-lg font-bold text-gray-800">
                                                {browseDate.getFullYear()}년 {browseDate.getMonth() + 1}월
                                            </h3>
                                            <button
                                                onClick={() => setBrowseDate(new Date(browseDate.getFullYear(), browseDate.getMonth() + 1, 1))}
                                                className="p-2 hover:bg-white rounded-full transition-colors"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>

                                        {/* Calendar Grid */}
                                        <div className="p-4">
                                            <div className="grid grid-cols-7 mb-2 text-center text-xs font-semibold text-gray-500">
                                                <div className="text-red-500">Sun</div>
                                                <div>Mon</div>
                                                <div>Tue</div>
                                                <div>Wed</div>
                                                <div>Thu</div>
                                                <div>Fri</div>
                                                <div className="text-blue-500">Sat</div>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1">
                                                {/* Empty cells for start padding */}
                                                {Array.from({ length: new Date(browseDate.getFullYear(), browseDate.getMonth(), 1).getDay() }).map((_, i) => (
                                                    <div key={`empty-${i}`} className="h-24 bg-gray-50/50 rounded-lg"></div>
                                                ))}

                                                {/* Days */}
                                                {Array.from({ length: new Date(browseDate.getFullYear(), browseDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                                    const day = i + 1;
                                                    const dateStr = `${browseDate.getFullYear()}-${String(browseDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                    const hasSchedule = formSchedules.filter(s => s.date === dateStr).length;

                                                    return (
                                                        <div
                                                            key={day}
                                                            onClick={() => setBulkDate(dateStr)}
                                                            className="h-24 border rounded-lg p-2 cursor-pointer hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all flex flex-col justify-between bg-white"
                                                        >
                                                            <span className={clsx(
                                                                "text-sm font-medium",
                                                                new Date(browseDate.getFullYear(), browseDate.getMonth(), day).getDay() === 0 ? "text-red-500" :
                                                                    new Date(browseDate.getFullYear(), browseDate.getMonth(), day).getDay() === 6 ? "text-blue-500" : "text-gray-700"
                                                            )}>
                                                                {day}
                                                            </span>

                                                            {hasSchedule > 0 && (
                                                                <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md font-semibold text-center">
                                                                    {hasSchedule}개 일정
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-blue-50 p-4 rounded-lg mb-4 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => setBulkDate('')}
                                                    className="mr-3 p-1 hover:bg-blue-100 rounded text-blue-600"
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <h3 className="text-xl font-bold text-blue-900">{bulkDate} 일정 관리</h3>
                                            </div>
                                            <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                                총 {formSchedules.filter(s => s.date === bulkDate).length}개
                                            </span>
                                        </div>

                                        <div className="overflow-x-auto border rounded-lg shadow-sm">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Time</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Personal Price</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Company Price</th>
                                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Max Slots</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(time => {
                                                        const schedulesAtTime = formSchedules.filter(s => s.date === bulkDate && s.time === time);

                                                        return Array(5).fill(null).map((_, subIndex) => {
                                                            const schedule = schedulesAtTime[subIndex];
                                                            const isFirst = subIndex === 0;

                                                            return (
                                                                <tr key={`${time}-${subIndex}`} className={schedule ? "bg-blue-50/30" : ""}>
                                                                    {isFirst && (
                                                                        <td rowSpan={5} className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-700 align-top bg-gray-50 border-r">
                                                                            {time}
                                                                        </td>
                                                                    )}
                                                                    <td className="px-4 py-1">
                                                                        <input
                                                                            type="text"
                                                                            value={schedule?.title || ''}
                                                                            onChange={(e) => handleSheetChange(time, subIndex, 'title', e.target.value)}
                                                                            placeholder={subIndex === 0 ? "메인 일정 제목" : "추가 일정 제목"}
                                                                            className="w-full border-gray-200 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-1">
                                                                        <input
                                                                            type="text"
                                                                            value={schedule?.description || ''}
                                                                            onChange={(e) => handleSheetChange(time, subIndex, 'description', e.target.value)}
                                                                            placeholder="설명"
                                                                            className="w-full border-gray-200 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-1">
                                                                        <input
                                                                            type="number"
                                                                            value={schedule?.pricePersonal || ''}
                                                                            onChange={(e) => handleSheetChange(time, subIndex, 'pricePersonal', e.target.value)}
                                                                            placeholder="₩ (개인)"
                                                                            className="w-full border-gray-200 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-1">
                                                                        <input
                                                                            type="number"
                                                                            value={schedule?.priceCompany || ''}
                                                                            onChange={(e) => handleSheetChange(time, subIndex, 'priceCompany', e.target.value)}
                                                                            placeholder="₩ (기업)"
                                                                            className="w-full border-gray-200 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-1">
                                                                        <input
                                                                            type="number"
                                                                            value={schedule ? schedule.maxSlots : 10}
                                                                            onChange={(e) => handleSheetChange(time, subIndex, 'maxSlots', e.target.value)}
                                                                            className="w-full border-gray-200 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        });
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                                {formSchedules.length > 0 && !bulkDate && (
                                    <div className="mt-4 text-center text-gray-500 text-sm">
                                        * 날짜를 선택하여 일정을 수정하거나 추가하세요. (현재 {formSchedules.length}개의 일정이 있습니다)
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
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
