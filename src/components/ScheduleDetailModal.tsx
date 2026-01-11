import { useState, useEffect } from 'react';
import { usePartners } from '../context/PartnerContext';
import type { Partner, Schedule } from '../context/PartnerContext';
import { useAuthStore } from '../store/useAuthStore';
import { Calendar, Clock, CheckCircle, X } from 'lucide-react';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';

interface ScheduleDetailModalProps {
    partner: Partner;
    schedule: Schedule;
    isOpen: boolean;
    onClose: () => void;
}

export default function ScheduleDetailModal({ partner, schedule, isOpen, onClose }: ScheduleDetailModalProps) {
    const { addRequest } = usePartners();
    const { user, isAuthenticated, viewMode } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const queryType = searchParams.get('type');
    const isCompany = (user?.type === 'Company' || user?.type === 'company') || (!user && (viewMode === 'company' || queryType === 'company'));

    const [applicationStep, setApplicationStep] = useState<'idle' | 'checking' | 'confirm' | 'payment' | 'processing' | 'success'>('idle');
    // const [cardNumber, setCardNumber] = useState('');
    // const [cardExpiry, setCardExpiry] = useState('');
    // const [cardCVC, setCardCVC] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'account' | 'cash'>('card');

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setApplicationStep('idle');
            setPaymentMethod('card');
        }
    }, [isOpen]);

    // const handleCardNumberChange...
    // const handleExpiryChange...

    const handleInitialApply = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.\n(로그인 페이지로 이동합니다)');
            const redirectType = viewMode === 'company' ? 'company' : 'personal';
            navigate(`/login?type=${redirectType}`, { state: { from: location.pathname } });
            return;
        }

        setApplicationStep('checking');

        setTimeout(() => {
            if (schedule.currentSlots >= schedule.maxSlots) {
                alert("신청 가능한 정원이 가득 찼습니다.");
                setApplicationStep('idle');
            } else {
                setApplicationStep('confirm');
            }
        }, 600);
    };

    const handleProceedToPayment = () => {
        const price = isCompany ? schedule.companyPrice : schedule.personalPrice;
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
            IMP.init('imp43046522');

            const merchantUid = `SCH-M-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
            const amount = isCompany ? schedule.companyPrice : schedule.personalPrice;

            const data = {
                pg: 'html5_inicis',
                pay_method: 'card',
                merchant_uid: merchantUid,
                name: schedule.title || 'Schedule Booking',
                amount: amount || 0,
                buyer_email: 'guest@example.com',
                buyer_name: 'Guest',
                buyer_tel: '010-0000-0000',
            };

            IMP.request_pay(data, (rsp: any) => {
                if (rsp.success) {
                    setApplicationStep('processing');
                    setTimeout(() => {
                        handleCompleteBooking(amount || 0, rsp.imp_uid, rsp.merchant_uid);
                    }, 1500);
                } else {
                    alert(`결제 실패: ${rsp.error_msg}`);
                }
            });
            return;
        }

        setApplicationStep('processing');
        setTimeout(() => {
            const price = isCompany ? schedule.companyPrice : schedule.personalPrice;
            handleCompleteBooking(price || 0);
        }, 1500);
    };

    const handleCompleteBooking = async (amount: number, _paymentId?: string, _merchantUid?: string) => {
        if (!user) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            await addRequest({
                partnerId: partner.id,
                partnerName: partner.name,
                userId: user.id,
                userName: user.name || user.id,
                scheduleId: schedule.id,
                scheduleTitle: schedule.title,
                scheduleDate: schedule.date,
                paymentStatus: amount > 0 ? 'paid' : 'pending',
                paymentAmount: amount,
                paymentDate: new Date().toISOString(),
                paymentMethod: amount > 0 ? (paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'account' ? 'Bank Transfer' : 'On-site Payment') : 'Free',
                userType: isCompany ? 'Company' : 'Personal'
                // paymentId: paymentId // TODO: Add to interface if needed
            });
            setApplicationStep('success');
        } catch (error) {
            console.error("Booking Error:", error);
            alert("예약 처리 중 오류가 발생했습니다.");
            setApplicationStep('idle');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Modal Content - Scrollable Area */}
                <div className="overflow-y-auto flex-1">
                    {/* Header Image */}
                    {(schedule.detailImage || partner.detailImage || partner.image) ? (
                        <img
                            src={schedule.detailImage || partner.detailImage || partner.image}
                            alt="Detail"
                            className="w-full h-auto object-cover"
                        />
                    ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                            <span className="text-4xl">🖼️</span>
                        </div>
                    )}

                    <div className="p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{schedule.title}</h2>
                            <div className="flex items-center text-gray-500 gap-4 text-sm">
                                <div className="flex items-center"><Calendar size={16} className="mr-1" /> {schedule.date}</div>
                                <div className="flex items-center"><Clock size={16} className="mr-1" /> {schedule.time}</div>
                                <div className="flex items-center"><span className="font-semibold text-gray-700 mr-1">주최:</span> {partner.name}</div>
                            </div>
                        </div>

                        <div className="mb-8">
                            {/* Detail Images */}
                            <div className="w-full space-y-4 mb-6">
                                {(() => {
                                    let images: string[] = [];
                                    try {
                                        const parsed = JSON.parse(partner.detailImage || '[]');
                                        if (Array.isArray(parsed)) images = parsed;
                                        else if (partner.detailImage) images = [partner.detailImage];
                                    } catch {
                                        if (partner.detailImage) images = [partner.detailImage];
                                    }

                                    return images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`Detail ${idx + 1}`}
                                            className="w-full h-auto rounded-lg shadow-sm"
                                        />
                                    ));
                                })()}
                            </div>

                            <h3 className="text-lg font-bold mb-3">상세 설명</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                                {schedule.description || "상세 설명이 없습니다."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Action Bar (Sticky) */}
                <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                    <div>
                        <span className="text-xs text-gray-500 block">참가비</span>
                        <span className="text-xl font-bold text-gray-900">
                            {isCompany
                                ? (schedule.companyPrice ? `₩${schedule.companyPrice.toLocaleString()}` : '무료')
                                : (schedule.personalPrice ? `₩${schedule.personalPrice.toLocaleString()}` : '무료')
                            }
                        </span>
                    </div>
                    <button
                        onClick={handleInitialApply}
                        disabled={schedule.currentSlots >= schedule.maxSlots}
                        className={clsx(
                            "px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-md",
                            (schedule.currentSlots < schedule.maxSlots)
                                ? "bg-black text-white hover:bg-gray-800"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        )}
                    >
                        {schedule.currentSlots >= schedule.maxSlots ? '마감됨' : '참여 신청하기'}
                    </button>
                </div>
            </div>

            {/* Application Steps Overlay - reusing logic/ui */}
            {applicationStep !== 'idle' && (
                <div className="absolute inset-0 bg-white/95 z-50 flex items-center justify-center flex-col p-8 rounded-xl animate-fadeIn m-4 md:m-0 max-w-2xl h-full md:h-auto md:max-h-[90vh]">
                    {/* Close within overlay if needed, or rely on outer close? 
                         Let's keep it simple: no close button during process unless explicit cancel 
                     */}

                    {applicationStep === 'checking' && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-xl font-medium text-gray-700">신청 가능 여부 확인 중...</p>
                        </div>
                    )}

                    {applicationStep === 'confirm' && (
                        <div className="text-center w-full max-w-sm">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">신청 하시겠습니까?</h3>
                            <div className="bg-gray-50 p-4 rounded-lg mb-8 text-left text-sm w-full">
                                <p><span className="text-gray-500">일정:</span> {schedule.title}</p>
                                <p><span className="text-gray-500">일시:</span> {schedule.date} {schedule.time}</p>
                                <p><span className="text-gray-500">금액:</span> {isCompany
                                    ? (schedule.companyPrice ? `₩${schedule.companyPrice.toLocaleString()}` : '무료')
                                    : (schedule.personalPrice ? `₩${schedule.personalPrice.toLocaleString()}` : '무료')
                                }</p>
                            </div>
                            <div className="flex gap-4">
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
                                    {(partner.category?.includes('Audition') || partner.category?.includes('오디션') || partner.id === 4) ? '신청' : '다음 (결제)'}
                                </button>
                            </div>
                        </div>
                    )}

                    {applicationStep === 'payment' && (
                        <div className="w-full max-w-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">결제 정보 입력</h3>
                            <form onSubmit={handlePaymentSubmit}>
                                <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
                                    <p className="text-sm text-blue-800 font-medium mb-1">총 결제 금액</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        ₩{(isCompany ? schedule.companyPrice : schedule.personalPrice)?.toLocaleString() || 0}
                                    </p>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {['card', 'account', 'cash'].map(method => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setPaymentMethod(method as any)}
                                            className={clsx(
                                                "flex-1 py-2 text-xs font-medium rounded-lg border transition-all",
                                                paymentMethod === method
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                                            )}
                                        >
                                            {method === 'card' ? '카드' : method === 'account' ? '계좌이체' : '현장결제'}
                                        </button>
                                    ))}
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="flex items-center gap-3 text-sm text-gray-600">
                                            <CheckCircle size={16} className="text-blue-600" />
                                            <span>PG사 보안 결제창이 호출됩니다.</span>
                                        </div>
                                        <p className="text-xs text-blue-500 pl-7">
                                            * KG이니시스(또는 설정된 PG사)를 통해 안전하게 결제됩니다.<br />
                                            * 팝업 차단을 해제해 주세요.
                                        </p>
                                    </div>
                                )}

                                {paymentMethod === 'account' && (
                                    <div className="text-sm bg-gray-50 p-4 rounded mb-6 text-gray-600">
                                        기업은행 123-456-789012<br />(주)멀티몰
                                    </div>
                                )}

                                {paymentMethod === 'cash' && (
                                    <div className="text-sm bg-gray-50 p-4 rounded mb-6 text-gray-600">
                                        현장에서 결제해주세요.
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setApplicationStep('idle')}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
                                    >
                                        {paymentMethod === 'card' ? '결제하기' : '신청하기'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {applicationStep === 'processing' && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-xl font-medium text-gray-700">처리 중입니다...</p>
                        </div>
                    )}

                    {applicationStep === 'success' && (
                        <div className="text-center w-full max-w-sm">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">신청 완료!</h3>
                            <button
                                onClick={() => {
                                    setApplicationStep('idle');
                                    onClose(); // Close modal on success confirm
                                }}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors mt-6"
                            >
                                확인
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
