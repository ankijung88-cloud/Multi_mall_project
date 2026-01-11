import { useParams, useNavigate } from 'react-router-dom';
import { useContents } from '../context/ContentContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';
import { ArrowLeft, Download, CreditCard, Lock, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

export default function PersonalContentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { contents, purchaseContent } = useContents();
    const { isAuthenticated, user } = useAuthStore();

    // State Declarations
    const [hasPaid, setHasPaid] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'idle' | 'checking' | 'confirm' | 'payment' | 'processing' | 'success'>('idle');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVC, setCardCVC] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'account' | 'cash'>('card');

    // Find content
    const content = contents.find(c => c.id === id);

    // Initial check for purchase status (DB based + local session based)
    const isPurchased = (isAuthenticated && content?.purchases?.some(p => p.userId === String(user?.id))) || content?.userId === String(user?.id);

    if (!content) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">컨텐츠를 찾을 수 없습니다</h2>
                        <button onClick={() => navigate('/contents')} className="mt-4 text-emerald-600 hover:underline">목록으로 돌아가기</button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Parse detail images/portfolio
    let detailImages: string[] = [];
    try {
        detailImages = JSON.parse(content.detailImages || '[]');
    } catch {
        detailImages = [];
    }

    // Helper to force download
    const forceDownload = (url: string) => {
        try {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', '');
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (e) {
            console.error("Download failed", e);
            alert("다운로드 시작 중 오류 발생");
        }
    };

    // Handlers
    const handlePurchase = () => {
        if (!isAuthenticated || !user) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login?type=personal');
            }
            return;
        }

        // Repurchase Confirmation
        if (isPurchased) {
            if (!window.confirm('이미 구매하신 컨텐츠입니다. 추가로 구매하시겠습니까?\n(구매 시 거래 내역이 새로 생성됩니다.)')) {
                return;
            }
        }

        setPaymentStep('confirm');
    };

    const handleProceedToPayment = () => {
        setPaymentStep('payment');
    };

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

    const handleCompleteBooking = async (amount: number) => {
        try {
            await purchaseContent(content.id, String(user?.id), amount);
            setHasPaid(true); // Enable download button
            setPaymentStep('success'); // Show download modal
            alert("결제가 완료되었습니다. 다운로드 버튼이 활성화되었습니다.");
        } catch (error) {
            console.error(error);
            alert('결제에 실패했습니다.');
            setPaymentStep('idle');
        }
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentStep('processing');
        setTimeout(() => {
            handleCompleteBooking(content.price);
        }, 1500);
    };

    const handleCloseModal = () => {
        setPaymentStep('idle');
        setHasPaid(false); // Reset payment status to force re-purchase
    };

    const handleBottomButtonClick = () => {
        if (hasPaid) {
            setPaymentStep('success');
        } else {
            handlePurchase();
        }
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-32">
                {/* Header Image */}
                <div className="relative h-[500px]">
                    <img
                        src={content.thumbnailUrl}
                        alt={content.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                    <div className="absolute top-0 left-0 p-6 z-10 w-full">
                        <button
                            onClick={() => navigate('/contents')}
                            className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-white/10"
                        >
                            <ArrowLeft size={20} />
                            목록으로
                        </button>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                    PREMIUM CONTENT
                                </span>
                                <span className="text-gray-300 text-sm">
                                    by {content.userName}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight shadow-sm">
                                {content.title}
                            </h1>
                            <div className="text-2xl font-bold text-emerald-400">
                                ₩{content.price.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">상세 설명</h2>
                                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line mb-8">
                                    {content.description}
                                </p>

                                {/* Portfolio Images Grid */}
                                {detailImages.length > 0 && (
                                    <>
                                        <h3 className="text-lg font-bold text-gray-800 mb-4">포트폴리오</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {detailImages.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-gray-100 bg-gray-50 group relative"
                                                    onClick={() => setPreviewImage(img)}
                                                >
                                                    <img src={img} alt={`Detail ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                        <span className="text-white opacity-0 group-hover:opacity-100 font-bold text-sm">🔍</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4">컨텐츠 정보</h3>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex justify-between">
                                        <span>등록일</span>
                                        <span className="font-medium">{new Date(content.createdAt).toLocaleDateString()}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>파일 형식</span>
                                        <span className="font-medium">Digital Download</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>가격</span>
                                        <span className="font-medium text-emerald-600">₩{content.price.toLocaleString()}</span>
                                    </li>
                                </ul>
                            </div>

                            {!isPurchased && (
                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-blue-800">
                                    <div className="flex items-center gap-2 mb-2 font-bold">
                                        <Lock size={18} />
                                        구매 후 다운로드 가능
                                    </div>
                                    <p className="text-sm opacity-80">
                                        이 컨텐츠는 구매한 사용자만 다운로드할 수 있습니다. 안심하고 결제하세요.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fixed Bottom Bar */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-lg z-50">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="hidden md:block">
                            <div className="text-xs text-gray-500">Total Price</div>
                            <div className="text-2xl font-bold text-gray-900">₩{content.price.toLocaleString()}</div>
                        </div>

                        <div className="flex gap-3 ml-auto">
                            <button
                                onClick={() => setPreviewImage(content.thumbnailUrl)}
                                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                🔍 미리보기
                            </button>



                            <button
                                onClick={handleBottomButtonClick}
                                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg min-w-[200px] transition-all transform hover:scale-105 shadow-lg ${hasPaid
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                                    }`}
                            >
                                {hasPaid ? (
                                    <>
                                        <Download size={20} />
                                        다운로드 (Download)
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        결제하기 (Purchase)
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal (Lightbox) */}
            {previewImage && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setPreviewImage(null)}>
                    <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Payment Modal */}
            {paymentStep !== 'idle' && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn">

                        {paymentStep === 'checking' && (
                            <div className="py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-lg font-medium text-gray-700">확인 중...</p>
                            </div>
                        )}

                        {paymentStep === 'confirm' && (
                            <div>
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-blue-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">구매 하시겠습니까?</h3>
                                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left text-sm">
                                    <p><span className="text-gray-500">상품:</span> {content.title}</p>
                                    <p><span className="text-gray-500">금액:</span> ₩{content.price.toLocaleString()}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setPaymentStep('idle')}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleProceedToPayment}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        결제 진행
                                    </button>
                                </div>
                            </div>
                        )}

                        {paymentStep === 'payment' && (
                            <form onSubmit={handlePaymentSubmit} className="text-left">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">결제 정보 입력</h3>

                                <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
                                    <p className="text-sm text-blue-800 font-medium mb-1">총 결제 금액</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        ₩{content.price.toLocaleString()}
                                    </p>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {['card', 'account'].map((method) => (
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
                                            {method === 'card' ? '카드' : '계좌이체'}
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

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentStep('idle')}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
                                    >
                                        결제하기
                                    </button>
                                </div>
                            </form>
                        )}

                        {paymentStep === 'processing' && (
                            <div className="py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-lg font-medium text-gray-700">결제 처리 중입니다...</p>
                            </div>
                        )}

                        {paymentStep === 'success' && (
                            <div>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-green-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">구매 완료!</h3>
                                <p className="text-gray-600 mb-6">
                                    아래 버튼을 눌러 파일을 다운로드하세요.
                                </p>

                                {(() => {
                                    let urls: string[] = [];
                                    try {
                                        if (content.contentUrl.startsWith('[')) {
                                            urls = JSON.parse(content.contentUrl);
                                        } else {
                                            urls = [content.contentUrl];
                                        }
                                    } catch {
                                        urls = [content.contentUrl];
                                    }

                                    return (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto p-2">
                                                {urls.map((url, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => forceDownload(url)}
                                                        className="aspect-square relative rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all group"
                                                        title={`파일 ${idx + 1} 다운로드`}
                                                    >
                                                        <img
                                                            src={url}
                                                            alt={`File ${idx}`}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=File'; // Fallback
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Download className="text-white" size={24} />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                이미지를 클릭하여 개별 다운로드하세요.
                                            </div>
                                            <button
                                                onClick={handleCloseModal}
                                                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 mt-2"
                                            >
                                                닫기
                                            </button>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
