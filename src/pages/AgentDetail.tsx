import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAgents } from '../context/AgentContext';
import type { AgentSchedule } from '../context/AgentContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function AgentDetail() {
    const { id } = useParams();
    const { getAgent, addRequest } = useAgents();
    const { user, isAuthenticated, viewMode } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const isCompany = (user?.type === 'Company' || user?.type === 'company') || (!user && viewMode === 'company');

    const agent = getAgent(Number(id));
    const [selectedSchedule, setSelectedSchedule] = useState<AgentSchedule | null>(null);
    const [applicationStep, setApplicationStep] = useState<'idle' | 'checking' | 'confirm' | 'payment' | 'processing' | 'success'>('idle');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'account' | 'cash'>('card');

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        const formatted = value.replace(/(\d{4})(?=\d)/g, '$1-').substr(0, 19);
        setCardNumber(formatted);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            const formatted = value.replace(/(\d{2})(?=\d)/g, '$1/').substr(0, 5);
            setCardExpiry(formatted);
        } else {
            setCardExpiry(value);
        }
    };

    if (!agent) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
                        <button onClick={() => navigate('/agents')} className="text-blue-600 hover:underline">
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
            const redirectType = viewMode === 'company' ? 'company' : 'personal';
            navigate(`/login?type=${redirectType}`, { state: { from: location.pathname } });
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

    const handleProceedToPayment = () => {
        if (!selectedSchedule) return;

        const price = isCompany ? selectedSchedule.priceCompany : selectedSchedule.pricePersonal;

        if (price && price > 0) {
            setApplicationStep('payment');
        } else {
            handleCompleteBooking(0);
        }
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setApplicationStep('processing');

        setTimeout(() => {
            const price = isCompany ? selectedSchedule?.priceCompany : selectedSchedule?.pricePersonal;
            handleCompleteBooking(price || 0);
        }, 1500);
    };

    const handleCompleteBooking = (amout: number) => {
        if (!selectedSchedule || !user) return;

        addRequest({
            agentId: agent.id,
            agentName: agent.name,
            userId: user.id,
            userName: user.name || user.id,
            scheduleId: selectedSchedule.id,
            scheduleTitle: selectedSchedule.title,
            scheduleDate: selectedSchedule.date,
            paymentStatus: amout > 0 ? 'paid' : 'pending',
            paymentAmount: amout,
            paymentDate: new Date().toISOString(),
            paymentMethod: amout > 0 ? (paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'account' ? 'Bank Transfer' : 'On-site Payment') : 'Free',
            userType: isCompany ? 'Company' : 'Personal'
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
            navigate('/agents');
        }
    };

    const handleCloseModal = () => {
        setApplicationStep('idle');
        setSelectedSchedule(null);
    };

    // Sort schedules by date
    const sortedSchedules = [...agent.schedules].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Header Image */}
                <div className="h-[400px] w-full relative">
                    <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{agent.name}</h1>
                            <p className="text-xl opacity-90">{agent.description}</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                    <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
                        <div className="flex items-center space-x-2 mb-6">
                            <Calendar className="text-blue-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-800">상담 및 운영 일정</h2>
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

                                        <div className="mb-4">
                                            {isCompany && schedule.priceCompany ? (
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-blue-500 font-semibold">기업 회원가</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xl font-bold text-blue-700">₩{schedule.priceCompany.toLocaleString()}</span>
                                                        <span className="text-sm text-gray-500">(${(schedule.priceCompany / 1450).toFixed(2)})</span>
                                                    </div>
                                                </div>
                                            ) : !isCompany && schedule.pricePersonal ? (
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-emerald-500 font-semibold">개인 회원가</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-xl font-bold text-emerald-700">₩{schedule.pricePersonal.toLocaleString()}</span>
                                                        <span className="text-sm text-gray-500">(${(schedule.pricePersonal / 1450).toFixed(2)})</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-[3.25rem]"></div>
                                            )}
                                        </div>

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
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">신청 하시겠습니까?</h3>
                                    <p className="text-gray-600 mb-6">
                                        선택하신 <strong>{selectedSchedule?.title}</strong><br />
                                        ({selectedSchedule?.date}) 일정에<br />
                                        참여를 신청합니다.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setApplicationStep('idle')}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            취소
                                        </button>
                                        <button
                                            onClick={handleProceedToPayment}
                                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            다음 (결제)
                                        </button>
                                    </div>
                                </div>
                            )}

                            {applicationStep === 'payment' && (
                                <form onSubmit={handlePaymentSubmit} className="text-left">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">결제 정보 입력</h3>

                                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600">결제 금액</span>
                                            <span className="font-bold text-lg text-blue-600">
                                                ₩{(isCompany ? selectedSchedule?.priceCompany : selectedSchedule?.pricePersonal)?.toLocaleString() || 0}
                                            </span>
                                        </div>
                                        <div className="text-xs text-right text-gray-400">
                                            (${((isCompany ? selectedSchedule?.priceCompany || 0 : selectedSchedule?.pricePersonal || 0) / 1450).toFixed(2)})
                                        </div>
                                    </div>

                                    {/* Payment Method Selection */}
                                    <div className="flex gap-2 mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('card')}
                                            className={clsx(
                                                "flex-1 py-2 text-sm font-medium rounded-lg border transition-all",
                                                paymentMethod === 'card'
                                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            카드 결제
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('account')}
                                            className={clsx(
                                                "flex-1 py-2 text-sm font-medium rounded-lg border transition-all",
                                                paymentMethod === 'account'
                                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            무통장 입금
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('cash')}
                                            className={clsx(
                                                "flex-1 py-2 text-sm font-medium rounded-lg border transition-all",
                                                paymentMethod === 'cash'
                                                    ? "bg-blue-50 border-blue-500 text-blue-700"
                                                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            현장 결제
                                        </button>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="space-y-3 mb-6">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">카드 번호</label>
                                                <input
                                                    type="text"
                                                    placeholder="0000-0000-0000-0000"
                                                    className="w-full border border-gray-300 rounded p-2 text-sm"
                                                    value={cardNumber}
                                                    onChange={handleCardNumberChange}
                                                    maxLength={19}
                                                    required
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">유효기간</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className="w-full border border-gray-300 rounded p-2 text-sm"
                                                        value={cardExpiry}
                                                        onChange={handleExpiryChange}
                                                        maxLength={5}
                                                        required
                                                    />
                                                </div>
                                                <div className="w-1/3">
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">CVC</label>
                                                    <input
                                                        type="text"
                                                        placeholder="123"
                                                        className="w-full border border-gray-300 rounded p-2 text-sm"
                                                        value={cardCVC}
                                                        onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').substr(0, 3))}
                                                        maxLength={3}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'account' && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 text-sm">
                                            <p className="font-bold text-gray-800 mb-1">입금 계좌 안내</p>
                                            <p className="text-gray-600">기업은행 123-456-789012</p>
                                            <p className="text-gray-600">예금주: (주)멀티몰</p>
                                            <div className="mt-3 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                                * 입금자명과 신청자명이 동일해야 확인이 가능합니다.
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'cash' && (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 text-sm">
                                            <p className="font-bold text-gray-800 mb-1">현장 결제 안내</p>
                                            <p className="text-gray-600">상담 당일 현장에서 카드 또는 현금으로 결제해 주세요.</p>
                                            <div className="mt-3 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                                                * 노쇼 방지를 위해 사전 연락 없이 불참 시 추후 신청이 제한될 수 있습니다.
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setApplicationStep('idle')}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                                        >
                                            취소
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            {paymentMethod === 'card' ? '결제하기' : '신청하기'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {applicationStep === 'processing' && (
                                <div className="py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-lg font-medium text-gray-700">결제 진행 중...</p>
                                    <p className="text-sm text-gray-500 mt-2">잠시만 기다려 주세요.</p>
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
