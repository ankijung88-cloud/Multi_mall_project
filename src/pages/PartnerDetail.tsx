import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePartners } from '../context/PartnerContext';
import type { Schedule } from '../context/PartnerContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function PartnerDetail() {
    const { id } = useParams();
    const { getPartner, addRequest } = usePartners();
    const { user, isAuthenticated } = useAuthStore(); // Assuming user object has id/name
    const navigate = useNavigate();
    const location = useLocation();

    const partner = getPartner(Number(id));
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [applicationStep, setApplicationStep] = useState<'idle' | 'checking' | 'confirm' | 'success'>('idle');

    if (!partner) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Partner Not Found</h2>
                        <button onClick={() => navigate('/partners')} className="text-blue-600 hover:underline">
                            Return to List
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const handleInitialApply = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated || !user) {
            navigate('/login?type=personal', { state: { from: location.pathname } });
            return;
        }


        if (!selectedSchedule) return;

        // Start flow
        setApplicationStep('checking');

        // Simulate API check delay
        setTimeout(() => {
            if (selectedSchedule.currentSlots >= selectedSchedule.maxSlots) {
                alert("신청 가능한 정원이 가득 찼습니다.");
                setApplicationStep('idle');
            } else {
                setApplicationStep('confirm');
            }
        }, 600);
    };

    const handleFinalApply = () => {
        if (!selectedSchedule || !user) return;

        addRequest({
            partnerId: partner.id,
            partnerName: partner.name,
            userId: user.id,
            userName: user.name || user.id,
            scheduleId: selectedSchedule.id,
            scheduleTitle: selectedSchedule.title,
            scheduleDate: selectedSchedule.date
        });
        setApplicationStep('success');
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAuthenticated) {
            if (user?.type === 'company') navigate('/company');
            else navigate('/personal');
        } else {
            navigate('/partners');
        }
    };

    const handleCloseModal = () => {
        setApplicationStep('idle');
        setSelectedSchedule(null);
    };

    // Sort schedules by date
    const sortedSchedules = [...partner.schedules].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Header Image */}
                <div className="h-[400px] w-full relative">
                    <img
                        src={partner.image}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{partner.name}</h1>
                            <p className="text-xl opacity-90">{partner.description}</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                    <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
                        <div className="flex items-center space-x-2 mb-6">
                            <Calendar className="text-blue-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-800">교육 및 운영 일정</h2>
                        </div>

                        {sortedSchedules.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-500">
                                현재 등록된 일정이 없습니다.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedSchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        onClick={() => setSelectedSchedule(schedule)}
                                        className={clsx(
                                            "border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md",
                                            selectedSchedule?.id === schedule.id
                                                ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                                                : "border-gray-200 bg-white hover:border-blue-300"
                                        )}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-gray-100 rounded px-2 py-1 text-sm font-semibold flex items-center text-gray-700">
                                                <Clock size={14} className="mr-1" />
                                                {schedule.date}
                                            </div>
                                            {selectedSchedule?.id === schedule.id && (
                                                <CheckCircle className="text-blue-600" size={20} />
                                            )}
                                        </div>
                                        <h3 className="font-bold text-lg mb-2">{schedule.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{schedule.description}</p>

                                        <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-100">
                                            <div className="flex items-center text-gray-600">
                                                <Users size={16} className="mr-1" />
                                                <span>정원 {schedule.maxSlots}명</span>
                                            </div>
                                            <div className={clsx(
                                                "font-medium",
                                                schedule.currentSlots >= schedule.maxSlots ? "text-red-500" : "text-green-600"
                                            )}>
                                                {schedule.currentSlots >= schedule.maxSlots ? "마감" : "신청 가능"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-8 flex justify-end border-t pt-6 gap-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={handleInitialApply}
                                disabled={!selectedSchedule || (selectedSchedule && selectedSchedule.currentSlots >= selectedSchedule.maxSlots)}
                                className={clsx(
                                    "px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-lg",
                                    (selectedSchedule && selectedSchedule.currentSlots < selectedSchedule.maxSlots)
                                        ? "bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-1"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                참여 신청하기
                            </button>
                        </div>
                    </div>
                </div>

                {/* Application Steps Modal */}
                {applicationStep !== 'idle' && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">

                            {applicationStep === 'checking' && (
                                <div className="py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-lg font-medium text-gray-700">신청 가능 여부 확인 중...</p>
                                </div>
                            )}

                            {applicationStep === 'confirm' && (
                                <div>
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="text-blue-600" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">신청 가능합니다!</h3>
                                    <p className="text-gray-600 mb-6">
                                        선택하신 <strong>{selectedSchedule?.title}</strong><br />
                                        ({selectedSchedule?.date}) 일정에<br />
                                        참여 신청을 완료하시겠습니까?
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setApplicationStep('idle')}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            취소
                                        </button>
                                        <button
                                            onClick={handleFinalApply}
                                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            신청완료
                                        </button>
                                    </div>
                                </div>
                            )}

                            {applicationStep === 'success' && (
                                <div>
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="text-green-600" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">신청 완료!</h3>
                                    <p className="text-gray-600 mb-6 whitespace-pre-line">
                                        참여 신청이 성공적으로 접수되었습니다.<br />
                                        관리자 승인 후 안내 문자가 발송됩니다.
                                    </p>
                                    <button
                                        onClick={handleCloseModal}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        확인
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
