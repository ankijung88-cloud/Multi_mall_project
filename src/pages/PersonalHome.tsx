import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useAgents } from '../context/AgentContext';
import { useFreelancers } from '../context/FreelancerContext';
import { PriceDisplay } from '../components/PriceDisplay';
import MainLayout from '../layouts/MainLayout';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import KBeautySection from '../components/sections/KBeautySection';
import KPerformanceSection from '../components/sections/KPerformanceSection';
import KAuditionSection from '../components/sections/KAuditionSection';
import KFashionSection from '../components/sections/KFashionSection';
import KCourseSection from '../components/sections/KCourseSection';

export default function PersonalHome() {
    const { products } = useProducts();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { isAuthenticated, setViewMode } = useAuthStore();

    const location = useLocation();

    useEffect(() => {
        setViewMode('personal');
        if (location.state?.scrollTo === 'personal-contents') {
            setTimeout(() => {
                document.getElementById('personal-contents')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [setViewMode, location]);
    const [isFiltered, setIsFiltered] = useState(false);

    const displayedProducts = (isFiltered
        ? products.filter(p => p.isRecommendedPersonal)
        : products).slice(0, 6);

    const handleShopCollection = () => {
        setIsFiltered(true);
        setTimeout(() => {
            document.getElementById('recommended-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.stopPropagation(); // Stop bubbling to prevent parent clicks

        if (!isAuthenticated) {
            // Redirect to login with specific type query param
            navigate('/login?type=personal');
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.personalPrice,
            image: product.image
        });
    };

    return (
        <div>
            <MainLayout>
                {/* Hero Section */}
                <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
                            alt="Hero"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                    </div>

                    <div className="relative z-10 text-center text-white px-4 max-w-7xl mx-auto">
                        <motion.h1
                            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                        >
                            당신의 <span className="text-emerald-400">라이프스타일</span>을 높이세요
                        </motion.h1>
                        <motion.p
                            className="text-xl md:text-2xl text-gray-200 mb-10"
                        >
                            현대인을 위한 엄선된 프리미엄 상품을 만나보세요.
                        </motion.p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleShopCollection}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-emerald-500/30 transition-all"
                        >
                            컬렉션 입기
                        </motion.button>
                    </div>
                </section>

                {/* K-Culture Course Partners Section */}
                <KCourseSection />

                {/* K-Beauty & Plastic Surgery Section */}
                <KBeautySection />

                {/* K-Performance & Exhibition Section */}
                <KPerformanceSection />

                {/* K-Audition Section */}
                <KAuditionSection />

                {/* K-Fashion Section */}
                <KFashionSection />

                {/* Choose Agent Section */}
                <section className="bg-white py-20 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-purple-600 pl-4">
                                Choose Agent
                            </h2>
                            <button
                                onClick={() => navigate('/agents')}
                                className="text-gray-500 hover:text-purple-600 text-sm font-medium transition-colors"
                            >
                                전체 에이전트 보기
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {useAgents().agents.slice(0, 16).map((agent) => (
                                <div
                                    key={agent.id}
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            navigate('/login?type=personal', { state: { from: `/agents/${agent.id}` } });
                                        } else {
                                            navigate(`/agents/${agent.id}`);
                                        }
                                    }}
                                    className="block cursor-pointer group text-center"
                                >
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 group-hover:border-purple-500 transition-all mb-3 shadow-sm">
                                            <img
                                                src={agent.image}
                                                alt={agent.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-600 truncate px-1">
                                            {agent.name}
                                        </h3>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Personal Contents Section */}
                <section id="personal-contents" className="bg-gray-50 py-20 border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-orange-500 pl-4">
                                Personal Contents
                            </h2>
                            <button
                                onClick={() => navigate('/contents')}
                                className="text-gray-500 hover:text-orange-600 text-sm font-medium transition-colors"
                            >
                                전체 컨텐츠 보기 (View All)
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {useFreelancers().freelancers.slice(0, 8).map((freelancer) => (
                                <motion.div
                                    key={freelancer.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                    onClick={() => navigate(`/contents/${freelancer.id}`)}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={freelancer.image}
                                            alt={freelancer.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-xs font-medium text-orange-200 mb-1">{freelancer.title}</p>
                                            <h3 className="font-bold text-lg">{freelancer.name}</h3>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {freelancer.description}
                                        </p>
                                        <div className="flex items-center text-xs text-orange-500 font-medium">
                                            <span>상세보기</span>
                                            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section id="recommended-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-4">
                        <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">
                            {isFiltered ? '고객님을 위한 추천 상품' : '전체 상품'}
                        </h2>
                        <div className="flex gap-4">
                            {isFiltered && (
                                <button
                                    onClick={() => setIsFiltered(false)}
                                    className="text-gray-500 hover:text-emerald-600 text-sm font-medium transition-colors"
                                >
                                    추천 상품 보기
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/shop')}
                                className="text-gray-500 hover:text-emerald-600 text-sm font-medium transition-colors"
                            >
                                상품보기
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {displayedProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer flex flex-col h-full"
                            >
                                <div className="h-64 overflow-hidden relative flex-shrink-0">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wide">{product.category}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>

                                    <div className="mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    <PriceDisplay amount={product.personalPrice} />
                                                </div>
                                                <span className="ml-2 text-sm text-gray-400 line-through">${Math.round(product.personalPrice * 1.2)}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors shadow-sm"
                                            >
                                                주문하기
                                            </button>
                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                className="p-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                                                title="Add to Cart"
                                            >
                                                <ShoppingCart size={24} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {displayedProducts.length === 0 && (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                상품이 없습니다.
                            </div>
                        )}
                    </div>
                </section>
            </MainLayout>
        </div>
    );
}
