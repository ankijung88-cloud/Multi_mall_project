import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAgents } from '../context/AgentContext';
import type { AgentSchedule } from '../context/AgentContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';
import { Calendar, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function AgentDetail() {
    const { id } = useParams();
    const { getAgent, addRequest } = useAgents();
    const { user, isAuthenticated, viewMode } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryType = searchParams.get('type');

    // Mofidied: queryType === 'company' takes precedence or is inclusive to ensure company view
    const isCompany = queryType === 'company' || (user?.type === 'Company' || user?.type === 'company') || (!user && viewMode === 'company');

    const agent = getAgent(Number(id));
    const [selectedSchedule, setSelectedSchedule] = useState<AgentSchedule | null>(null);
    const [applicationStep, setApplicationStep] = useState<'idle' | 'checking' | 'confirm' | 'payment' | 'processing' | 'success'>('idle');
    // const [cardNumber, setCardNumber] = useState('');
    // const [cardExpiry, setCardExpiry] = useState('');
    // const [cardCVC, setCardCVC] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'account' | 'cash'>('card');

    // Calendar State
    const [browseDate, setBrowseDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [customTime, setCustomTime] = useState('09:00');
    const [customFlightInfo, setCustomFlightInfo] = useState('');
    const [customContent, setCustomContent] = useState('');

    // const handleCardNumberChange...
    // const handleExpiryChange...

    if (!agent) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
                        <button onClick={() => navigate(isCompany ? '/agents?type=company' : '/agents')} className="text-blue-600 hover:underline">
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
            const redirectType = isCompany ? 'company' : 'personal';
            navigate(`/login?type=${redirectType}`, { state: { from: location.pathname + location.search } });
            return;
        }

        // Validate
        if (selectedSchedule) {
            // Existing schedule validation
            if (selectedSchedule.currentSlots >= selectedSchedule.maxSlots) {
                alert("신청 가능한 정원이 가득 찼습니다.");
                return;
            }
        } else {
            // Custom request validation
            if (!selectedDate || !customTime) {
                alert("날짜와 시간을 선택해주세요.");
                return;
            }
            // Enforce all fields for custom request
            if (!customFlightInfo || customFlightInfo.trim() === '') {
                alert("항공편명을 입력해주세요.");
                return;
            }
            if (!customContent || customContent.trim() === '') {
                alert("문의/요청 사항을 입력해주세요.");
                return;
            }
        }

        setApplicationStep('checking');

        // Simulate API check delay
        setTimeout(() => {
            if (selectedSchedule && selectedSchedule.currentSlots >= selectedSchedule.maxSlots) {
                alert("신청 가능한 정원이 가득 찼습니다.");
                setApplicationStep('idle');
            } else {
                setApplicationStep('confirm');
            }
        }, 600);
    };

    const handleProceedToPayment = () => {
        const price = selectedSchedule
            ? (isCompany ? selectedSchedule.companyPrice : selectedSchedule.personalPrice)
            : (isCompany ? agent.defaultCompanyPrice : agent.defaultPersonalPrice);

        if (price && price > 0) {
            setApplicationStep('payment');
        } else {
            handleCompleteBooking(0);
        }
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        if (paymentMethod === 'card') {
            const { IMP } = window;
            IMP.init('imp43046522'); // Replace with your actual PortOne 'imp_uid'

            const merchantUid = `AGT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

            // Re-calculate price
            const price = selectedSchedule
                ? (isCompany ? selectedSchedule.companyPrice : selectedSchedule.personalPrice)
                : (isCompany ? agent.defaultCompanyPrice : agent.defaultPersonalPrice);
            const amount = price || 0;

            const data = {
                pg: 'html5_inicis', // Or 'kcp', 'nice', etc.
                pay_method: 'card',
                merchant_uid: merchantUid,
                name: `Agent Booking: ${agent.name}`,
                amount: amount,
                buyer_email: user?.email || 'guest@example.com',
                buyer_name: user?.name || 'Guest',
                buyer_tel: user?.phone || '010-0000-0000',
            };

            IMP.request_pay(data, (rsp: any) => {
                if (rsp.success) {
                    setApplicationStep('processing');
                    setTimeout(() => {
                        handleCompleteBooking(amount, rsp.imp_uid, rsp.merchant_uid);
                    }, 1500);
                } else {
                    alert(`결제 실패: ${rsp.error_msg}`);
                    setApplicationStep('payment');
                }
            });
            return;
        }

        setApplicationStep('processing');
        setTimeout(() => {
            const price = selectedSchedule
                ? (isCompany ? selectedSchedule.companyPrice : selectedSchedule.personalPrice)
                : (isCompany ? agent.defaultCompanyPrice : agent.defaultPersonalPrice);
            handleCompleteBooking(price || 0);
        }, 1500);
    };

    const handleCompleteBooking = async (amount: number, paymentId?: string, merchantUid?: string) => {
        if (!user) return;

        const requestData = {
            agentId: agent.id,
            userId: String(user.id),
            userName: user.name || String(user.id),
            date: selectedSchedule ? selectedSchedule.date : selectedDate!,
            time: selectedSchedule ? selectedSchedule.time : customTime,
            flightInfo: selectedSchedule ? undefined : customFlightInfo,
            content: selectedSchedule ? selectedSchedule.description : customContent,
            status: 'pending',
            paymentStatus: (amount > 0 ? 'paid' : 'pending') as 'paid' | 'pending',
            paymentAmount: amount,
            paymentMethod: amount > 0 ? (paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'account' ? 'Bank Transfer' : 'On-site Payment') : 'Free',
            paymentId: paymentId, // Add paymentId from PortOne
            merchantUid: merchantUid, // Add merchantUid from PortOne
            timestamp: new Date().toISOString(),
            userType: (isCompany ? 'Company' : 'Personal') as 'Company' | 'Personal'
        };

        try {
            await addRequest(requestData);
            setApplicationStep('success');
        } catch (error: any) {
            console.error("Booking Error:", error);
            alert("신청 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
            setApplicationStep('idle');
        }
    };

    const handleCloseModal = () => {
        setApplicationStep('idle');
        setSelectedSchedule(null);
        setCustomTime('09:00');
        setCustomFlightInfo('');
        setCustomContent('');
        // setQuote({ amount: null }); // Removed undefined setQuote
    };



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
                        {/* Detail Intro Image */}
                        {/* Detail Intro Images */}
                        {(() => {
                            let images: string[] = [];
                            try {
                                if (agent.detailImages) {
                                    const parsed = typeof agent.detailImages === 'string'
                                        ? JSON.parse(agent.detailImages)
                                        : agent.detailImages;
                                    images = Array.isArray(parsed) ? parsed : [];
                                } else if ((agent as any).detailImage) {
                                    images = [(agent as any).detailImage];
                                }
                            } catch (e) {
                                console.error("Failed to parse detail images", e);
                                images = [];
                            }

                            return images.map((img: string, idx: number) => (
                                <div key={idx} className="mb-8 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                    <img src={img} alt={`Details ${idx}`} className="w-full h-auto" />
                                </div>
                            ));
                        })()}

                        <div className="flex items-center space-x-2 mb-6">
                            <Calendar className="text-blue-600" size={24} />
                            <h2 className="text-2xl font-bold text-gray-800">예약 및 일정 (Reservation)</h2>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Calendar Side */}
                            <div className="w-full md:w-1/2">
                                <div className="bg-white border rounded-xl overflow-hidden">
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
                                                <div key={`empty-${i}`} className="h-10 md:h-14 bg-gray-50/50 rounded-lg"></div>
                                            ))}

                                            {/* Days */}
                                            {Array.from({ length: new Date(browseDate.getFullYear(), browseDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                                const day = i + 1;
                                                const dateStr = `${browseDate.getFullYear()}-${String(browseDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const schedulesOnDay = (agent.schedules || []).filter(s => s.date === dateStr);
                                                const hasSchedule = schedulesOnDay.length > 0;
                                                const isSelected = selectedDate === dateStr;

                                                return (
                                                    <div
                                                        key={day}
                                                        onClick={() => {
                                                            setSelectedDate(dateStr);
                                                            setSelectedSchedule(null);
                                                            setCustomTime('09:00'); // Reset custom time
                                                        }}
                                                        className={clsx(
                                                            "h-10 md:h-14 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all relative",
                                                            isSelected ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50" : "border-gray-100 hover:border-gray-300",
                                                        )}
                                                    >
                                                        <span className={clsx(
                                                            "text-sm font-medium",
                                                            !hasSchedule ? "text-gray-300" :
                                                                new Date(browseDate.getFullYear(), browseDate.getMonth(), day).getDay() === 0 ? "text-red-500" :
                                                                    new Date(browseDate.getFullYear(), browseDate.getMonth(), day).getDay() === 6 ? "text-blue-500" : "text-gray-700"
                                                        )}>
                                                            {day}
                                                        </span>
                                                        {hasSchedule && (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"></div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Time Slots Side */}
                            <div className="w-full md:w-1/2">
                                <h3 className="font-bold text-lg mb-4 flex items-center">
                                    <Clock size={20} className="mr-2 text-gray-400" />
                                    {selectedDate ? `${selectedDate} 예약 가능 시간` : '날짜를 선택해주세요'}
                                </h3>

                                {!selectedDate ? (
                                    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 h-64 flex items-center justify-center text-gray-400">
                                        왼쪽 달력에서 날짜를 선택하세요
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                        {(agent.schedules || []).filter(s => s.date === selectedDate).length === 0 ? (
                                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                                <h4 className="font-bold text-gray-800 mb-4">예약 신청 정보 입력</h4>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">희망 시간</label>
                                                        <input
                                                            type="time"
                                                            value={customTime}
                                                            onChange={(e) => setCustomTime(e.target.value)}
                                                            className="w-full border rounded-lg px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">항공편명 (Flight No.)</label>
                                                        <input
                                                            type="text"
                                                            value={customFlightInfo}
                                                            onChange={(e) => setCustomFlightInfo(e.target.value)}
                                                            placeholder="예: KE123 / 7C2204"
                                                            className="w-full border rounded-lg px-3 py-2"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">문의/요청 사항</label>
                                                        <textarea
                                                            value={customContent}
                                                            onChange={(e) => setCustomContent(e.target.value)}
                                                            placeholder="추가 요청사항을 입력해주세요."
                                                            className="w-full border rounded-lg px-3 py-2 h-24 resize-none"
                                                        />
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-2">
                                                        <span className="text-sm font-bold text-gray-600">예상 비용</span>
                                                        <div className="text-lg font-bold text-blue-600">
                                                            {isCompany
                                                                ? (agent.defaultCompanyPrice ? `₩${agent.defaultCompanyPrice.toLocaleString()}` : '문의 필요')
                                                                : (agent.defaultPersonalPrice ? `₩${agent.defaultPersonalPrice.toLocaleString()}` : '문의 필요')
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            (agent.schedules || [])
                                                .filter(s => s.date === selectedDate)
                                                .sort((a, b) => a.time.localeCompare(b.time))
                                                .map(schedule => (
                                                    <div
                                                        key={schedule.id}
                                                        onClick={() => {
                                                            if (schedule.isAvailable === false) return;
                                                            if (schedule.currentSlots >= schedule.maxSlots) return;
                                                            setSelectedSchedule(schedule);
                                                        }}
                                                        className={clsx(
                                                            "p-4 border rounded-xl transition-all cursor-pointer relative overflow-hidden",
                                                            selectedSchedule?.id === schedule.id
                                                                ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                                                                : schedule.isAvailable === false
                                                                    ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                                                                    : schedule.currentSlots >= schedule.maxSlots
                                                                        ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                                                                        : "border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm"
                                                        )}
                                                    >
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-lg text-gray-800">{schedule.time}</span>
                                                            <span className={clsx(
                                                                "text-xs font-bold px-2 py-0.5 rounded-full",
                                                                schedule.isAvailable === false ? "bg-gray-200 text-gray-500" :
                                                                    schedule.currentSlots >= schedule.maxSlots ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                            )}>
                                                                {schedule.isAvailable === false ? "예약 불가" :
                                                                    schedule.currentSlots >= schedule.maxSlots ? "마감" : `${schedule.maxSlots - schedule.currentSlots}자리 남음`}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600 mb-2">{schedule.description || schedule.title}</div>
                                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                                            <span className="text-xs text-gray-500">참가비</span>
                                                            <div className="text-sm font-bold text-blue-600">
                                                                {isCompany
                                                                    ? (schedule.companyPrice ? `₩${schedule.companyPrice.toLocaleString()}` : '무료')
                                                                    : (schedule.personalPrice ? `₩${schedule.personalPrice.toLocaleString()}` : '무료')
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                )}

                                <div className="mt-6 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={handleInitialApply}
                                        disabled={!selectedDate}
                                        className={clsx(
                                            "w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center",
                                            selectedDate
                                                ? "bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-1"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        )}
                                    >
                                        <span>예약 신청하기</span>
                                        {selectedSchedule && <ChevronRight size={20} className="ml-2" />}
                                    </button>
                                </div>
                            </div>
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
                                        {selectedSchedule ? (
                                            <>
                                                선택하신 <strong>{selectedSchedule.title || '일정'}</strong><br />
                                                ({selectedSchedule.date} {selectedSchedule.time}) 일정에<br />
                                            </>
                                        ) : (
                                            <>
                                                선택하신 <strong>{selectedDate} {customTime}</strong><br />
                                                일정에<br />
                                            </>
                                        )}
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
                                                {selectedSchedule
                                                    ? `₩${(isCompany ? selectedSchedule.companyPrice : selectedSchedule.personalPrice)?.toLocaleString() || 0}`
                                                    : `₩${(isCompany ? agent.defaultCompanyPrice : agent.defaultPersonalPrice)?.toLocaleString() || 0}`
                                                }
                                            </span>
                                        </div>
                                        <div className="text-xs text-right text-gray-400">
                                            (${selectedSchedule
                                                ? ((isCompany ? selectedSchedule.companyPrice || 0 : selectedSchedule.personalPrice || 0) / 1450).toFixed(2)
                                                : ((isCompany ? agent.defaultCompanyPrice || 0 : agent.defaultPersonalPrice || 0) / 1450).toFixed(2)
                                            })
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
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6 text-sm text-blue-700">
                                            <p className="font-bold mb-1">카드 결제 안내</p>
                                            <p>아래 '결제하기' 버튼을 누르시면 안전한 결제창으로 이동합니다.</p>
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
