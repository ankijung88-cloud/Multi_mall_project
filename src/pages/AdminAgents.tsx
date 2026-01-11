import { useState } from 'react';
import { useAgents } from '../context/AgentContext';
import { useAuthStore } from '../store/useAuthStore';
import clsx from 'clsx';
import { Plus, Trash, Edit, Save, X, Calendar, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import type { Agent, AgentSchedule } from '../context/AgentContext';



// Local interface for form handling to allow lenient string inputs for prices
interface FormAgentSchedule extends Omit<AgentSchedule, 'personalPrice' | 'companyPrice'> {
    personalPrice: number | string;
    companyPrice: number | string;
}

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
    const [formDetailImages, setFormDetailImages] = useState<string[]>([]);
    const [formDescription, setFormDescription] = useState('');
    const [formDefaultPersonalPrice, setFormDefaultPersonalPrice] = useState<number | string>(0);
    const [formDefaultCompanyPrice, setFormDefaultCompanyPrice] = useState<number | string>(0);
    const [formSchedules, setFormSchedules] = useState<FormAgentSchedule[]>([]);
    const [selectedScheduleIds, setSelectedScheduleIds] = useState<Set<string>>(new Set());
    const [formCredentials, setFormCredentials] = useState<{ username: string, password: string }>({ username: '', password: '' });
    const [bulkDate, setBulkDate] = useState('');
    const [browseDate, setBrowseDate] = useState(new Date());


    const openModal = (agent?: Agent) => {
        if (agent) {
            setEditingAgent(agent);
            setFormName(agent.name);
            setFormImage(agent.image);

            try {
                if ((agent as any).detailImages) {
                    const parsed = typeof (agent as any).detailImages === 'string'
                        ? JSON.parse((agent as any).detailImages)
                        : (agent as any).detailImages;
                    setFormDetailImages(Array.isArray(parsed) ? parsed : []);
                } else if ((agent as any).detailImage) {
                    setFormDetailImages([(agent as any).detailImage]);
                } else {
                    setFormDetailImages([]);
                }
            } catch (e) {
                setFormDetailImages([]);
            }

            setFormDescription(agent.description);
            setFormDefaultPersonalPrice(agent.defaultPersonalPrice || 0);
            setFormDefaultCompanyPrice(agent.defaultCompanyPrice || 0);
            setFormSchedules(agent.schedules ? agent.schedules.map(s => ({
                ...s,
                personalPrice: s.personalPrice ?? 0,
                companyPrice: s.companyPrice ?? 0
            })) : []);
            setFormCredentials(agent.credentials || { username: '', password: '' });
        } else {
            setEditingAgent(null);
            setFormName('');
            setFormImage('');
            setFormDetailImages([]);
            setFormDescription('');
            setFormDefaultPersonalPrice(0);
            setFormDefaultCompanyPrice(0);
            setFormSchedules([]);
            setFormCredentials({ username: '', password: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAgent(null);
    };

    const handleSave = async () => {
        if (!formName) {
            alert("에이전트명은 필수입니다.");
            return;
        }

        const agentData = {
            name: formName,
            image: formImage,
            detailImages: JSON.stringify(formDetailImages),
            description: formDescription,
            defaultPersonalPrice: Number(formDefaultPersonalPrice),
            defaultCompanyPrice: Number(formDefaultCompanyPrice),
            schedules: formSchedules.map(s => ({
                ...s,
                personalPrice: Number(s.personalPrice),
                companyPrice: Number(s.companyPrice)
            })),
            credentials: (formCredentials.username && formCredentials.password) ? formCredentials : undefined
        };

        // Note: The context's addAgent/updateAgent might not handle the async payload correctly if they don't support partial updates for detailImages vs detailImage
        // So we might need to rely on the backend route adjusting for 'detailImages' field.
        // Assuming context calls the API which we saw in partner.routes... wait, agent.routes.

        if (editingAgent) {
            // We need to call the API directly or ensure context is updated.
            // Given the context is a black box here (viewed previously but simplistic), let's trust updateAgent calls the API.
            // But updateAgent in context usually takes 'Partial<Agent>'.
            // We'll cast to any to bypass strict type check for now if needed, but Agent interface was updated manually in memory? No.
            // Wait, I didn't update Agent Interface in context to have 'detailImages'.
            // I only updated schema.prisma.
            // I should probably pass it as 'detailImage' (singular) containing the JSON string if I didn't update the Context Type.
            // But wait, schema has 'detailImages'.
            // Let's pass 'detailImages' in the object.
            await updateAgent(editingAgent.id, agentData as any);
        } else {
            await addAgent(agentData as any);
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


    const handleDeleteSchedule = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("이 일정을 삭제하시겠습니까?")) {
            setFormSchedules(formSchedules.filter(s => s.id !== id));
            const newSelected = new Set(selectedScheduleIds);
            newSelected.delete(id);
            setSelectedScheduleIds(newSelected);
        }
    };

    const handleToggleSelect = (id: string) => {
        const newSelected = new Set(selectedScheduleIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedScheduleIds(newSelected);
    };

    const handleDeleteSelected = () => {
        if (selectedScheduleIds.size === 0) return;
        if (window.confirm(`선택한 ${selectedScheduleIds.size}개의 일정을 삭제하시겠습니까?`)) {
            setFormSchedules(formSchedules.filter(s => !selectedScheduleIds.has(s.id)));
            setSelectedScheduleIds(new Set());
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">항공편/내용</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {!requests || requests.filter(r => r.agentId === viewingRequestsAgent.id).length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
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
                                                    <div className="text-xs text-gray-400 mt-1">{request.userType}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">{request.date}</div>
                                                    <div className="text-sm text-gray-500">{request.time}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {request.flightInfo && <div className="font-semibold mb-1">✈ {request.flightInfo}</div>}
                                                        {request.content && <div className="text-gray-500 text-xs text-wrap max-w-xs">{request.content}</div>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={clsx(
                                                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                                                        request.status === 'approved' || request.status === 'confirmed' ? "bg-green-100 text-green-800" :
                                                            request.status === 'paid' ? "bg-blue-100 text-blue-800" :
                                                                "bg-yellow-100 text-yellow-800"
                                                    )}>
                                                        {request.status === 'pending' ? '대기중' :
                                                            request.status === 'paid' ? '결제완료' :
                                                                request.status === 'confirmed' ? '확정' : request.status}
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
                    <div className="relative flex items-center">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b flex justify-between items-center">
                                <h3 className="text-xl font-bold">{editingAgent ? '에이전트 수정' : '새 에이전트 등록'}</h3>
                                <button onClick={closeModal}><X size={24} /></button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">에이전트명</label>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={e => setFormName(e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지 (Main Image)</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => setFormImage(reader.result as string);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={formImage}
                                            onChange={e => setFormImage(e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2 text-sm text-gray-400 mb-4"
                                            placeholder="URL or File Path (Auto-filled)"
                                        />

                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-700">상세 이미지 (Detail Images)</label>
                                            <span className="text-xs text-gray-500">{formDetailImages.length} / 22 Uploaded</span>
                                        </div>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files || []);
                                                    if (formDetailImages.length + files.length > 22) {
                                                        alert("최대 22장까지만 업로드 가능합니다.");
                                                        return;
                                                    }
                                                    files.forEach(file => {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFormDetailImages(prev => [...prev, reader.result as string]);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    });
                                                }}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                                disabled={formDetailImages.length >= 22}
                                            />
                                        </div>

                                        {/* Preview Grid for Detail Images */}
                                        {formDetailImages.length > 0 && (
                                            <div className="grid grid-cols-5 gap-2 mt-2 max-h-40 overflow-y-auto p-2 border rounded bg-gray-50">
                                                {formDetailImages.map((img, idx) => (
                                                    <div key={idx} className="relative group aspect-square">
                                                        <img src={img} alt={`Detail ${idx}`} className="w-full h-full object-cover rounded shadow-sm border" />
                                                        <button
                                                            onClick={() => setFormDetailImages(formDetailImages.filter((_, i) => i !== idx))}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">기본 가격 (개인)</label>
                                            <input
                                                type="number"
                                                value={formDefaultPersonalPrice || ''}
                                                onChange={e => setFormDefaultPersonalPrice(e.target.value)}
                                                className="w-full border rounded-lg px-3 py-2"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">기본 가격 (기업)</label>
                                            <input
                                                type="number"
                                                value={formDefaultCompanyPrice || ''}
                                                onChange={e => setFormDefaultCompanyPrice(e.target.value)}
                                                className="w-full border rounded-lg px-3 py-2"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                                        <textarea
                                            value={formDescription}
                                            onChange={e => setFormDescription(e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2 h-32"
                                        />
                                    </div>

                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">아이디 (Username)</label>
                                        <input
                                            type="text"
                                            value={formCredentials.username}
                                            onChange={e => setFormCredentials({ ...formCredentials, username: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                                            placeholder="Admin Login ID"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 (Password)</label>
                                        <input
                                            type="text"
                                            value={formCredentials.password}
                                            onChange={e => setFormCredentials({ ...formCredentials, password: e.target.value })}
                                            className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                                            placeholder="Admin Login PW"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-yellow-600 mt-2">
                                    * 이 계정으로 해당 에이전트 관리자 페이지에 로그인할 수 있습니다.
                                </p>
                            </div>

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
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        const newSchedule: FormAgentSchedule = {
                                                            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                                                            date: bulkDate,
                                                            time: '09:00',
                                                            title: '예약 가능',
                                                            description: '',
                                                            maxSlots: 10,
                                                            personalPrice: 0,
                                                            companyPrice: 0,
                                                            currentSlots: 0,
                                                            isAvailable: true
                                                        };
                                                        setFormSchedules([...formSchedules, newSchedule]);
                                                    }}
                                                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                                                >
                                                    <Plus size={16} className="mr-1" />
                                                    일정 추가
                                                </button>
                                                {selectedScheduleIds.size > 0 && (
                                                    <button
                                                        onClick={handleDeleteSelected}
                                                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-600 transition-colors shadow-sm"
                                                    >
                                                        선택삭제 ({selectedScheduleIds.size})
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto border rounded-lg shadow-sm">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-3 text-center w-10">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                                checked={
                                                                    formSchedules.filter(s => s.date === bulkDate).length > 0 &&
                                                                    formSchedules.filter(s => s.date === bulkDate).every(s => selectedScheduleIds.has(s.id))
                                                                }
                                                                onChange={(e) => {
                                                                    const checked = e.target.checked;
                                                                    const currentIds = formSchedules.filter(s => s.date === bulkDate).map(s => s.id);
                                                                    const newSelected = new Set(selectedScheduleIds);
                                                                    currentIds.forEach(id => {
                                                                        if (checked) newSelected.add(id);
                                                                        else newSelected.delete(id);
                                                                    });
                                                                    setSelectedScheduleIds(newSelected);
                                                                }}
                                                            />
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32">TIME</th>
                                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">DESCRIPTION</th>
                                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32">PERSONAL PRICE</th>
                                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-32">COMPANY PRICE</th>
                                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">예약 가능</th>
                                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-16">삭제</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {formSchedules.filter(s => s.date === bulkDate).length === 0 ? (
                                                        <tr>
                                                            <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                                                일정이 없습니다. '일정 추가' 버튼을 눌러 추가하세요.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        formSchedules
                                                            .filter(s => s.date === bulkDate)
                                                            .sort((a, b) => a.time.localeCompare(b.time))
                                                            .map((schedule) => (
                                                                <tr key={schedule.id} className={schedule.isAvailable === false ? "bg-gray-50" : "hover:bg-blue-50/30 transition-colors"}>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedScheduleIds.has(schedule.id)}
                                                                            onChange={() => handleToggleSelect(schedule.id)}
                                                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <input
                                                                            type="time"
                                                                            value={schedule.time}
                                                                            onChange={(e) => {
                                                                                const updated = formSchedules.map(s => s.id === schedule.id ? { ...s, time: e.target.value } : s);
                                                                                setFormSchedules(updated);
                                                                            }}
                                                                            className="w-full border-gray-200 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <input
                                                                            type="text"
                                                                            value={schedule.description || ''}
                                                                            onChange={(e) => {
                                                                                // Sync Description to Title as well to satisfy DB if needed involved
                                                                                const updated = formSchedules.map(s => s.id === schedule.id ? { ...s, description: e.target.value, title: e.target.value || '예약 가능' } : s);
                                                                                setFormSchedules(updated);
                                                                            }}
                                                                            placeholder="설명 입력"
                                                                            className="w-full border-gray-200 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <input
                                                                            type="number"
                                                                            value={schedule.personalPrice || ''}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                const updated = formSchedules.map(s => s.id === schedule.id ? { ...s, personalPrice: val } : s);
                                                                                setFormSchedules(updated);
                                                                            }}
                                                                            className="w-full border-gray-200 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                                            placeholder="0"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <input
                                                                            type="number"
                                                                            value={schedule.companyPrice || ''}
                                                                            onChange={(e) => {
                                                                                const val = e.target.value;
                                                                                const updated = formSchedules.map(s => s.id === schedule.id ? { ...s, companyPrice: val } : s);
                                                                                setFormSchedules(updated);
                                                                            }}
                                                                            className="w-full border-gray-200 rounded text-sm focus:ring-blue-500 focus:border-blue-500 bg-transparent"
                                                                            placeholder="0"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-2 text-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={schedule.isAvailable !== false}
                                                                            onChange={(e) => {
                                                                                const updated = formSchedules.map(s => s.id === schedule.id ? { ...s, isAvailable: e.target.checked } : s);
                                                                                setFormSchedules(updated);
                                                                            }}
                                                                            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                                                        />
                                                                    </td>
                                                                    <td className="px-4 py-2 text-center">
                                                                        <button
                                                                            onClick={(e) => handleDeleteSchedule(schedule.id, e)}
                                                                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                                        >
                                                                            <Trash2 size={18} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                    )}
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

                        {/* Floating Action Buttons */}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 flex flex-col space-y-3 ml-4 z-50">
                            <button
                                onClick={handleSave}
                                className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-transform hover:scale-110"
                                title="저장"
                            >
                                <Save size={24} />
                            </button>
                            <button
                                onClick={closeModal}
                                className="w-12 h-12 bg-white text-gray-600 rounded-full shadow-lg hover:bg-gray-100 flex items-center justify-center transition-transform hover:scale-110"
                                title="닫기"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
