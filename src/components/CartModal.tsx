import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, Trash2, CreditCard, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { PriceDisplay, convertToKrw } from './PriceDisplay';

export default function CartModal() {
    const { isCartOpen, toggleCart, items, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
    const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
    const [isProcessing, setIsProcessing] = useState(false);
    const { isAuthenticated, user } = useAuthStore();
    const navigate = useNavigate();

    // Checkout Form State
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [saveAddress, setSaveAddress] = useState(false);
    const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');

    // Initialize Checkout Data
    useEffect(() => {
        if (isCartOpen && step === 'checkout') {
            // Auto-fill Name from User Profile
            if (user?.name) {
                setFullName(user.name);
            }
            // Auto-fill Address from LocalStorage
            const savedAddr = localStorage.getItem('mall_saved_address');
            if (savedAddr) {
                setAddress(savedAddr);
                setSaveAddress(true); // Assuming if they saved it before, they might want to keep saving it, or just show it's loaded.
            }
        }
    }, [isCartOpen, step, user]);

    // Reset step when closing
    const handleClose = () => {
        toggleCart();
        setTimeout(() => setStep('cart'), 300);
    };

    const handleCheckout = () => {
        setIsProcessing(true);

        // Save Address
        if (saveAddress && address) {
            localStorage.setItem('mall_saved_address', address);
        }

        // Simulate Processing Time
        setTimeout(() => {
            // Create Order Object
            const newOrder = {
                id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
                customerName: fullName || (user?.name || 'Guest'),
                customerEmail: user?.email || 'guest@example.com',
                totalAmount: totalAmount,
                currency: currency,
                paymentAmount: currency === 'KRW' ? convertToKrw(totalAmount) : totalAmount,
                status: 'Pending',
                date: new Date().toISOString(),
                items: items
            };

            // Save to LocalStorage
            const existingOrders = JSON.parse(localStorage.getItem('mall_orders') || '[]');
            localStorage.setItem('mall_orders', JSON.stringify([...existingOrders, newOrder]));

            setIsProcessing(false);
            setStep('success');
            clearCart();
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col h-full"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {step === 'cart' && '장바구니'}
                                {step === 'checkout' && '주문 결제'}
                                {step === 'success' && '주문 완료'}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {step === 'cart' && (
                                <>
                                    {items.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                                <CreditCard size={40} className="text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-medium text-gray-900">장바구니가 비어있습니다</p>
                                                <p className="text-gray-500">아직 담은 상품이 없습니다.</p>
                                            </div>
                                            <button
                                                onClick={handleClose}
                                                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                쇼핑 시작하기
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {items.map((item) => (
                                                <div key={item.id} className="flex gap-4">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                                                            <div className="text-blue-600 font-bold">
                                                                <PriceDisplay amount={item.price} />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg border border-gray-200 p-1">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="p-1 hover:bg-white rounded shadow-sm transition-colors"
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus size={14} />
                                                                </button>
                                                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="p-1 hover:bg-white rounded shadow-sm transition-colors"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {step === 'checkout' && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-medium text-blue-900 mb-2">주문 요약</h4>
                                        <div className="flex justify-between text-sm text-blue-800 mb-1">
                                            <span>소계</span>
                                            <span>
                                                {currency === 'USD'
                                                    ? `$${totalAmount.toLocaleString()}`
                                                    : `₩${convertToKrw(totalAmount).toLocaleString()}`
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-blue-800 mb-1">
                                            <span>배송비</span>
                                            <span>무료</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-blue-900 pt-2 border-t border-blue-200 mt-2">
                                            <span>합계</span>
                                            <span>
                                                {currency === 'USD'
                                                    ? `$${totalAmount.toLocaleString()}`
                                                    : `₩${convertToKrw(totalAmount).toLocaleString()}`
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">결제 통화 선택</h4>
                                        <div className="flex gap-4">
                                            <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${currency === 'USD' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="currency"
                                                    value="USD"
                                                    checked={currency === 'USD'}
                                                    onChange={() => setCurrency('USD')}
                                                    className="hidden"
                                                />
                                                <span className="font-bold">USD ($)</span>
                                            </label>
                                            <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${currency === 'KRW' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="currency"
                                                    value="KRW"
                                                    checked={currency === 'KRW'}
                                                    onChange={() => setCurrency('KRW')}
                                                    className="hidden"
                                                />
                                                <span className="font-bold">KRW (₩)</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">배송 정보</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">성함</label>
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    placeholder="성함을 입력하세요"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">주소</label>
                                                <input
                                                    type="text"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    placeholder="배송지 주소를 입력하세요"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <div className="mt-2 flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="saveAddress"
                                                        checked={saveAddress}
                                                        onChange={(e) => setSaveAddress(e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                                    />
                                                    <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-600 cursor-pointer select-none">
                                                        다음 주문을 위해 주소 저장
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">결제 수단</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-blue-600 bg-blue-50 text-blue-700 rounded-lg font-medium">
                                                <CreditCard size={18} />
                                                <span>신용카드</span>
                                            </button>
                                            <button className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50">
                                                <span>무통장 입금</span>
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-400 text-center">
                                            이 데모에서는 결제 처리가 시뮬레이션됩니다.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 'success' && (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle size={40} className="text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">주문이 완료되었습니다!</h3>
                                        <p className="text-gray-500 max-w-[260px] mx-auto">
                                            구매해 주셔서 감사합니다. 주문이 성공적으로 접수되었습니다.
                                        </p>
                                    </div>
                                    <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>주문 번호</span>
                                            <span className="font-mono font-medium">#ORD-{Math.floor(Math.random() * 10000)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>예상 배송일</span>
                                            <span className="font-medium">2일 이내</span>
                                        </div>
                                        {address && (
                                            <div className="mt-2 pt-2 border-t border-gray-200 text-left">
                                                <p className="text-xs text-gray-500">배송지:</p>
                                                <p className="text-sm font-medium truncate">{address}</p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        쇼핑 계속하기
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {step !== 'success' && items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                {step === 'cart' ? (
                                    <>
                                        <div className="flex justify-between mb-4">
                                            <span className="text-gray-500">합계</span>
                                            <div className="text-xl font-bold text-gray-900">
                                                <PriceDisplay amount={totalAmount} />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!isAuthenticated) {
                                                    // Close cart and redirect
                                                    toggleCart();
                                                    navigate('/login?type=personal');
                                                    return;
                                                }
                                                setStep('checkout');
                                            }}
                                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/30"
                                        >
                                            주문하기
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setStep('cart')}
                                            className="flex-1 py-3 px-4 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                                        >
                                            뒤로
                                        </button>
                                        <button
                                            onClick={handleCheckout}
                                            disabled={isProcessing}
                                            className="flex-[2] py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-500/30 flex items-center justify-center"
                                        >
                                            {isProcessing ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                '결제하기'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
