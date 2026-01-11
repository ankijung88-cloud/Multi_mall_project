import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
// import { useCart } from '../context/CartContext';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { PriceDisplay } from '../components/PriceDisplay';
// Removed duplicate PriceDisplay import
import clsx from 'clsx';

export default function Shop() {
    const { products } = useProducts();
    // const { addToCart, openCheckout } = useCart();
    const { userType: authUserType } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine view mode based on URL or Auth
    const searchParams = new URLSearchParams(location.search);
    const viewType = (searchParams.get('type') === 'company' || authUserType === 'company') ? 'company' : 'personal';

    // Scroll to section logic
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    }, [location]);

    const getPrice = (product: any) => {
        // Show price based on viewType even if not authenticated
        return viewType === 'company' ? product.companyPrice : product.personalPrice;
    };

    // Filter Logic
    const recommendedProducts = useMemo(() =>
        products.filter(p => viewType === 'company' ? p.isRecommendedCompany : p.isRecommendedPersonal),
        [products, viewType]);

    const newProducts = useMemo(() =>
        products.filter(p => viewType === 'company' ? p.isNewCompany : p.isNewPersonal),
        [products, viewType]);

    const brandProducts = useMemo(() =>
        products.filter(p => viewType === 'company' ? p.isBrandCompany : p.isBrandPersonal),
        [products, viewType]);

    const saleProducts = useMemo(() =>
        products.filter(p => viewType === 'company' ? p.isSaleCompany : p.isSalePersonal),
        [products, viewType]);

    const ProductGrid = ({ title, id, items }: { title: string, id: string, items: any[] }) => (
        <section id={id} className="py-16 border-b border-gray-100 last:border-0 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center">
                    <span className={clsx("w-2 h-8 mr-3 rounded-full", viewType === 'company' ? "bg-blue-600" : "bg-emerald-500")}></span>
                    {title}
                </h2>
                {items.length === 0 ? (
                    <div className="text-gray-400 py-10 text-center">등록된 상품이 없습니다.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {items.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                onClick={() => navigate(`/product/${product.id}${viewType === 'company' ? '?type=company' : ''}`)}
                                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer flex flex-col h-full"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-sm">
                                        {product.category}
                                    </div>
                                </div>
                                <div className="p-5 flex-grow flex flex-col">
                                    <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-emerald-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div>
                                            <div className="text-xl font-bold text-gray-900">
                                                <PriceDisplay amount={getPrice(product)} />
                                            </div>
                                            {viewType === 'company' && (
                                                <span className="text-xs text-blue-500 font-medium">기업 전용가</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section >
    );

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen">
                <div className={clsx(
                    "text-white py-16 mb-0 transition-colors duration-300",
                    viewType === 'company' ? "bg-blue-900" : "bg-gray-900"
                )}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-5xl font-bold mb-6">
                            {viewType === 'company' ? 'B2B Corporate Mall' : 'Premium Shop'}
                        </h1>
                        <p className={clsx("text-xl max-w-2xl mx-auto", viewType === 'company' ? "text-blue-200" : "text-gray-400")}>
                            {viewType === 'company'
                                ? '기업 회원을 위한 전용 혜택과 합리적인 가격'
                                : '당신의 라이프스타일을 완성하는 프리미엄 컬렉션'}
                        </p>
                    </div>
                </div>

                <div className="bg-white">
                    {searchParams.get('search') ? (
                        <ProductGrid
                            title={`'${searchParams.get('search')}' 검색 결과`}
                            id="search-results"
                            items={products.filter(p => {
                                const query = searchParams.get('search')?.toLowerCase() || '';
                                const matchesSearch = p.name.toLowerCase().includes(query);
                                const matchesViewType = viewType === 'company' ? p.companyPrice : p.personalPrice;
                                return matchesSearch && matchesViewType;
                            })}
                        />
                    ) : (
                        <>
                            <ProductGrid title="추천 상품" id="recommended" items={recommendedProducts} />
                            <ProductGrid title="신상품" id="new" items={newProducts} />
                            <ProductGrid title="브랜드 컬렉션" id="brand" items={brandProducts} />
                            <ProductGrid title="세일 & 특가" id="sale" items={saleProducts} />
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
