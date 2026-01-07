import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePartners } from '../context/PartnerContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Plus, Trash, Edit, Save, X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Partner, Schedule } from '../context/PartnerContext';

interface PartnerCategoryPageProps {
    categoryName: string;
    title: string;
    description: string;
    heroImageClass?: string;
    isCompanyView?: boolean;
}

export default function PartnerCategoryPage({ categoryName, title, description, isCompanyView = false }: PartnerCategoryPageProps) {
    const { partners, addPartner, updatePartner, deletePartner } = usePartners();
    const navigate = useNavigate();
    const { userType, adminRole } = useAuthStore();
    const isSuperAdmin = userType === 'admin' && adminRole === 'super';

    // Filter displayed partners
    const displayedPartners = useMemo(() => {
        return partners
            .filter(p => p.category?.trim() === categoryName)
            .sort((a, b) => b.id - a.id);
    }, [partners, categoryName]);

    // Modal & Form State for Admin
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

    const [formName, setFormName] = useState('');
    const [formImage, setFormImage] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formSchedules, setFormSchedules] = useState<Schedule[]>([]);
    const [formCredentials, setFormCredentials] = useState<{ username: string, password: string }>({ username: '', password: '' });

    // Calendar/Sheet State
    const [bulkDate, setBulkDate] = useState('');
    const [browseDate, setBrowseDate] = useState(new Date());

    const openModal = (partner?: Partner) => {
        if (partner) {
            setEditingPartner(partner);
            setFormName(partner.name);
            setFormImage(partner.image);
            setFormDescription(partner.description);
            setFormSchedules(partner.schedules);
            setFormCredentials(partner.credentials || { username: '', password: '' });
        } else {
            setEditingPartner(null);
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
        setEditingPartner(null);
    };

    const handleSave = () => {
        if (!formName) {
            alert("업체명은 필수입니다.");
            return;
        }

        const partnerData = {
            name: formName,
            image: formImage,
            description: formDescription,
            category: categoryName,
            schedules: formSchedules,
            credentials: (formCredentials.username && formCredentials.password) ? formCredentials : undefined
        };

        if (editingPartner) {
            updatePartner(editingPartner.id, partnerData);
        } else {
            addPartner(partnerData);
        }
        closeModal();
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("정말 삭제하시겠습니까?")) {
            deletePartner(id);
        }
    };

    const handleEditClick = (partner: Partner, e: React.MouseEvent) => {
        e.stopPropagation();
        openModal(partner);
    };

    // Schedule Sheet Logic (Simplified copy from AdminPartners)
    const handleSheetChange = (time: string, subIndex: number, field: keyof Schedule, value: any) => {
        if (!bulkDate) return;
        const schedulesAtTime = formSchedules.filter(s => s.date === bulkDate && s.time === time);
        const targetSchedule = schedulesAtTime[subIndex];

        if (targetSchedule) {
            const realIndex = formSchedules.findIndex(s => s.id === targetSchedule.id);
            if (realIndex >= 0) {
                const updated = [...formSchedules];
                updated[realIndex] = { ...updated[realIndex], [field]: value };
                setFormSchedules(updated);
            }
        } else {
            const newSchedule: Schedule = {
                id: crypto.randomUUID(),
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Hero */}
                <div className={clsx(
                    "text-white py-16 mb-12 transition-colors duration-300",
                    isCompanyView ? "bg-blue-900" : "bg-gray-900"
                )}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {title}
                        </h1>
                        <p className={clsx("text-xl max-w-2xl mx-auto", isCompanyView ? "text-blue-200" : "text-gray-300")}>
                            {description}
                        </p>

                        {isSuperAdmin && (
                            <button
                                onClick={() => openModal()}
                                className="absolute right-4 bottom-4 md:right-8 md:bottom-8 bg-white text-black p-3 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center space-x-2"
                                title="Add Partner"
                            >
                                <Plus size={24} />
                                <span className="font-bold hidden md:inline">추가</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {displayedPartners.map((partner) => (
                            <motion.div
                                key={partner.id}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate(`/partners/${partner.id}`)}
                                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100 relative"
                            >
                                <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {partner.image?.startsWith('data:application/pdf') ? (
                                        <div className="text-center text-gray-500">
                                            <span className="text-4xl block mb-2">📄</span>
                                            <span className="text-sm font-semibold">PDF Document</span>
                                        </div>
                                    ) : (
                                        <img
                                            src={partner.image || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80"}
                                            alt={partner.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    )}
                                </div>
                                <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">{partner.name}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{partner.description}</p>
                                <div className="border-t pt-4 flex justify-between items-center text-sm">
                                    <span className="text-gray-600">
                                        {partner.image?.startsWith('data:application/pdf') ? '📄 PDF 자료' : '관련 컨텐츠'}
                                    </span>
                                    <span className="font-semibold text-blue-600">{partner.schedules ? partner.schedules.length : 0}개</span>
                                </div>


                                {/* Admin Actions Overlay */}
                                {isSuperAdmin && (
                                    <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleEditClick(partner, e)}
                                            className="p-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(partner.id, e)}
                                            className="p-2 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {displayedPartners.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500">등록된 항목이 없습니다.</p>
                            {isSuperAdmin && (
                                <button
                                    onClick={() => openModal()}
                                    className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    첫 번째 항목 추가하기
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Edit/Add Modal */}
                {/* Reusing the modal logic roughly. For brevity, I will simplify the Calendar part if possible, but user wants same capability. */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                                <h3 className="text-xl font-bold">{editingPartner ? '항목 수정' : '새 항목 등록'}</h3>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-200 rounded-full"><X size={24} /></button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">제목 (업체명)</label>
                                        <input
                                            type="text"
                                            value={formName}
                                            onChange={e => setFormName(e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="이름을 입력하세요"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">이미지 또는 PDF 파일</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={handleFileChange}
                                                className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                            />
                                        </div>
                                        <input
                                            type="text"
                                            value={formImage}
                                            onChange={e => setFormImage(e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-400"
                                            placeholder="직접 URL을 입력하거나 위에서 파일을 선택하세요"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">파일 선택 시 자동으로 URL 입력칸이 채워집니다.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                                    <textarea
                                        value={formDescription}
                                        onChange={e => setFormDescription(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                        placeholder="상세 설명을 입력하세요"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3 sticky bottom-0 z-10">
                                <button
                                    onClick={closeModal}
                                    className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center shadow-sm"
                                >
                                    <Save size={18} className="mr-2" />
                                    저장
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout >
    );
}
