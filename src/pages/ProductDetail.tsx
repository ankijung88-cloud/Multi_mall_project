import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuthStore } from '../store/useAuthStore';
import { useCart } from '../context/CartContext';
import MainLayout from '../layouts/MainLayout';
import { ShoppingBag, ShoppingCart, ArrowLeft, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { PriceDisplay } from '../components/PriceDisplay';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { getProduct } = useProducts();
    const { userType, isAuthenticated } = useAuthStore();
    const { addToCart, openCheckout } = useCart();

    const product = getProduct(Number(id));

    if (!product) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">상품을 찾을 수 없습니다</h2>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-blue-600 hover:underline"
                        >
                            돌아가기
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const searchParams = new URLSearchParams(location.search);
    const isCompany = userType === 'company' || searchParams.get('type') === 'company';
    const currentPrice = isCompany ? product.companyPrice : product.personalPrice;

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    상품 목록으로
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image Section */}
                        <div className="h-96 md:h-[600px] relative bg-gray-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {isCompany && (
                                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    B2B 전용
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="mb-2">
                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${isCompany ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                    {product.category}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="border-t border-b border-gray-100 py-6 mb-8">
                                <div className="flex items-end gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{isCompany ? '기업 회원가' : '판매가'}</p>
                                        <div className={`text-4xl font-bold ${isCompany ? 'text-blue-600' : 'text-gray-900'}`}>
                                            <PriceDisplay amount={currentPrice} />
                                        </div>
                                    </div>
                                    {isCompany && (
                                        <div className="mb-2">
                                            <p className="text-sm text-gray-400 line-through">${product.personalPrice.toLocaleString()}</p>
                                            <p className="text-sm text-emerald-600 font-bold flex items-center">
                                                <TrendingDown size={14} className="mr-1" />
                                                {Math.round(((product.personalPrice - product.companyPrice) / product.personalPrice) * 100)}% 할인
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            navigate(`/login?type=${isCompany ? 'company' : 'personal'}`);
                                            return;
                                        }
                                        addToCart({
                                            id: product.id,
                                            name: product.name,
                                            price: currentPrice,
                                            image: product.image
                                        });
                                    }}
                                    className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition-all ${isCompany
                                        ? 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50'
                                        : 'bg-white text-emerald-600 border-2 border-emerald-500 hover:bg-emerald-50'
                                        }`}
                                >
                                    {isCompany ? <ShoppingBag className="mr-2" /> : <ShoppingCart className="mr-2" />}
                                    {isCompany ? '대량 주문 담기' : '장바구니 담기'}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            navigate(`/login?type=${isCompany ? 'company' : 'personal'}`);
                                            return;
                                        }
                                        addToCart({
                                            id: product.id,
                                            name: product.name,
                                            price: currentPrice,
                                            image: product.image
                                        });
                                        openCheckout();
                                    }}
                                    className={`flex-1 py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center transition-all ${isCompany
                                        ? 'bg-gray-900 hover:bg-gray-800 shadow-gray-200'
                                        : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                                        }`}
                                >
                                    <span>바로 주문하기</span>
                                </motion.button>
                            </div>

                            <div className="mt-2 text-center text-xs text-red-500 font-medium">
                                * 결제시 결제하려는 화폐를 선택하세요
                            </div>

                            <div className="mt-8 text-center text-sm text-gray-400">
                                {isCompany
                                    ? '결제 시 세금 계산서 발행이 가능합니다.'
                                    : '5만원 이상 구매 시 무료 배송. 30일 이내 반품 가능.'
                                }
                            </div>

                        </div>
                    </div>

                    {/* Full Width Detail Images */}
                    {product.detailImages && product.detailImages.length > 0 && (
                        <div className="border-t border-gray-100 p-8 md:p-12 bg-white">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">상세 정보</h3>
                            <div className="max-w-4xl mx-auto space-y-4">
                                {product.detailImages.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Detail ${idx + 1}`}
                                        className="w-full h-auto rounded-xl shadow-sm"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
