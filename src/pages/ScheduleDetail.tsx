import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePartners } from '../context/PartnerContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';
import { Calendar, Clock, CheckCircle, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function ScheduleDetail() {
    const { partnerId, scheduleId } = useParams();
    const { getPartner, addRequest } = usePartners();
    const { user, isAuthenticated, viewMode } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const queryType = searchParams.get('type');
    const isCompany = (user?.type === 'Company' || user?.type === 'company') || (viewMode === 'company' || queryType === 'company');

    const partner = getPartner(Number(partnerId));
    const selectedSchedule = partner?.schedules.find(s => s.id === scheduleId) || null;

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

    const handleCloseModal = () => {
        setApplicationStep('idle');
        // Stay on page or navigate? Usually stay to show success state or user chooses to leave
        // If success auto-close, maybe just close modal
    };

    // Auto-redirect on success
    useEffect(() => {
        if (applicationStep === 'success') {
            const timer = setTimeout(() => {
                handleCloseModal();
                navigate(-1); // Go back to partner page or list
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [applicationStep, navigate]);

    if (!partner || !selectedSchedule) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Schedule Not Found</h2>
                        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
                            Go Back
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const handleInitialApply = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.\n(로그인 페이지로 이동합니다)');
            const redirectType = viewMode === 'company' ? 'company' : 'personal';
            navigate(`/login?type=${redirectType}`, { state: { from: location.pathname } });
            return;
        }

        if (!selectedSchedule) return;

        setApplicationStep('checking');

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
        const price = isCompany ? selectedSchedule.companyPrice : selectedSchedule.personalPrice;
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
            const price = isCompany ? selectedSchedule?.companyPrice : selectedSchedule?.personalPrice;
            handleCompleteBooking(price || 0);
        }, 1500);
    };

    const handleCompleteBooking = (amount: number) => {
        if (!selectedSchedule || !user) {
            setApplicationStep('idle');
            return;
        }

        try {
            addRequest({
                partnerId: partner.id,
                partnerName: partner.name,
                userId: user.id,
                userName: user.name || user.id,
                scheduleId: selectedSchedule.id,
                scheduleTitle: selectedSchedule.title,
                scheduleDate: selectedSchedule.date,
                paymentStatus: amount > 0 ? 'paid' : 'pending',
                paymentAmount: amount,
                paymentDate: new Date().toISOString(),
                paymentMethod: amount > 0 ? (paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'account' ? 'Bank Transfer' : 'On-site Payment') : 'Free',
                userType: isCompany ? 'Company' : 'Personal'
            });
            setApplicationStep('success');
        } catch (error) {
            console.error("Booking Error:", error);
            alert('신청 처리 중 오류가 발생했습니다.');
            setApplicationStep('idle');
        }
    };

    return (
        <MainLayout hideFooter={true}>
            <div className="bg-gray-50 min-h-screen pb-20 pt-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors"
                        >
                            <ChevronLeft size={20} className="mr-1" />
                            목록으로 돌아가기
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedSchedule.title}</h1>
                        <div className="flex items-center text-gray-500 gap-4 text-sm bg-white p-3 rounded-lg border border-gray-200 inline-flex">
                            <div className="flex items-center"><Calendar size={16} className="mr-1" /> {selectedSchedule.date}</div>
                            <div className="flex items-center"><Clock size={16} className="mr-1" /> {selectedSchedule.time}</div>
                            <div className="flex items-center"><span className="font-semibold text-gray-700 mr-1">주최:</span> {partner.name}</div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 mb-8">
                        <div className="w-full space-y-4">
                            {(() => {
                                let images: string[] = [];

                                // Check Schedule Detail Image first
                                if (selectedSchedule.detailImage) {
                                    images.push(selectedSchedule.detailImage);
                                }

                                // Check Partner Detail Images
                                try {
                                    const parsed = JSON.parse(partner.detailImage || '[]');
                                    if (Array.isArray(parsed)) {
                                        images = [...images, ...parsed];
                                    } else if (partner.detailImage) {
                                        images.push(partner.detailImage);
                                    }
                                } catch {
                                    if (partner.detailImage && partner.detailImage !== selectedSchedule.detailImage) {
                                        images.push(partner.detailImage);
                                    }
                                }

                                // Fallback to main image only if nothing else found
                                if (images.length === 0 && partner.image) {
                                    images = [partner.image];
                                }

                                if (images.length === 0) {
                                    return (
                                        <div className="w-full py-20 bg-gray-100 text-gray-400 text-center flex flex-col items-center justify-center">
                                            <span className="text-6xl mb-4">🖼️</span>
                                            <p>상세 이미지가 등록되지 않았습니다.</p>
                                        </div>
                                    );
                                }

                                return images.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Detail ${idx + 1}`}
                                        className="w-full h-auto"
                                    />
                                ));
                            })()}
                        </div>

                        <div className="p-8 border-t border-gray-100">
                            <h3 className="text-xl font-bold mb-4">상세 설명</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {selectedSchedule.description || "상세 설명이 없습니다."}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40 safe-area-bottom">
                        <div className="max-w-4xl mx-auto flex items-center justify-between">
                            <div className="hidden md:block">
                                <div className="text-sm text-gray-500">참가비</div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {isCompany
                                        ? (selectedSchedule.companyPrice ? `₩${selectedSchedule.companyPrice.toLocaleString()}` : '무료')
                                        : (selectedSchedule.personalPrice ? `₩${selectedSchedule.personalPrice.toLocaleString()}` : '무료')
                                    }
                                </div>
                            </div>

                            <button
                                onClick={handleInitialApply}
                                disabled={selectedSchedule.currentSlots >= selectedSchedule.maxSlots}
                                className={clsx(
                                    "w-full md:w-auto px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-md",
                                    (selectedSchedule.currentSlots < selectedSchedule.maxSlots)
                                        ? "bg-black text-white hover:bg-gray-800"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                )}
                            >
                                {selectedSchedule.currentSlots >= selectedSchedule.maxSlots ? '마감됨' : '참여 신청하기'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Modal (Reused Logic) */}
            {applicationStep !== 'idle' && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">

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
                                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left text-sm">
                                    <p><span className="text-gray-500">일정:</span> {selectedSchedule.title}</p>
                                    <p><span className="text-gray-500">일시:</span> {selectedSchedule.date} {selectedSchedule.time}</p>
                                    <p><span className="text-gray-500">금액:</span> {isCompany
                                        ? (selectedSchedule.companyPrice ? `₩${selectedSchedule.companyPrice.toLocaleString()}` : '무료')
                                        : (selectedSchedule.personalPrice ? `₩${selectedSchedule.personalPrice.toLocaleString()}` : '무료')
                                    }</p>
                                </div>
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

                                <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
                                    <p className="text-sm text-blue-800 font-medium mb-1">총 결제 금액</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        ₩{(isCompany ? selectedSchedule?.companyPrice : selectedSchedule?.personalPrice)?.toLocaleString() || 0}
                                    </p>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {['card', 'account', 'cash'].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setPaymentMethod(method as any)}
                                            className={clsx(
                                                "flex-1 py-2 text-xs font-medium rounded-lg border transition-all center",
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
                                    <div className="space-y-3 mb-6">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="카드 번호 (0000-0000-0000-0000)"
                                                className="w-full border border-gray-300 rounded p-3 text-sm"
                                                value={cardNumber}
                                                onChange={handleCardNumberChange}
                                                maxLength={19}
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                className="w-full border border-gray-300 rounded p-3 text-sm"
                                                value={cardExpiry}
                                                onChange={handleExpiryChange}
                                                maxLength={5}
                                                required
                                            />
                                            <input
                                                type="text"
                                                placeholder="CVC"
                                                className="w-full border border-gray-300 rounded p-3 text-sm"
                                                value={cardCVC}
                                                onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').substr(0, 3))}
                                                maxLength={3}
                                                required
                                            />
                                        </div>
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
                        )}

                        {applicationStep === 'processing' && (
                            <div className="py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-lg font-medium text-gray-700">처리 중입니다...</p>
                            </div>
                        )}

                        {applicationStep === 'success' && (
                            <div>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-green-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">신청 완료!</h3>
                                <p className="text-gray-600 mb-6">
                                    잠시 후 이전 페이지로 이동합니다.
                                </p>
                                <button
                                    onClick={() => {
                                        handleCloseModal();
                                        navigate(-1);
                                    }}
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
                                >
                                    확인
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
