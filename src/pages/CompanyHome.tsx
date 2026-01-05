import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useAgents } from '../context/AgentContext';
import { useFreelancers } from '../context/FreelancerContext';
import { PriceDisplay } from '../components/PriceDisplay';
import MainLayout from '../layouts/MainLayout';
import { ShoppingBag, TrendingDown, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuthStore } from '../store/useAuthStore';
import KBeautySection from '../components/sections/KBeautySection';
import KPerformanceSection from '../components/sections/KPerformanceSection';
import KAuditionSection from '../components/sections/KAuditionSection';
import KFashionSection from '../components/sections/KFashionSection';
import KCourseSection from '../components/sections/KCourseSection';

export default function CompanyHome() {
    const { products } = useProducts();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const { isAuthenticated, setViewMode } = useAuthStore();

    const location = useLocation();

    useEffect(() => {
        setViewMode('company');
        if (location.state?.scrollTo === 'personal-contents') {
            setTimeout(() => {
                document.getElementById('personal-contents')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [setViewMode, location]);
    const [isFiltered, setIsFiltered] = useState(false);

    const displayedProducts = (isFiltered
        ? products.filter(p => p.isRecommendedCompany)
        : products).slice(0, 6);

    const handleViewCatalog = () => {
        setIsFiltered(true);
        setTimeout(() => {
            document.getElementById('corporate-catalog')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            // Redirect to login with specific type query param
            navigate('/login?type=company');
            return;
        }
        addToCart({
            id: product.id,
            name: product.name,
            price: product.companyPrice,
            image: product.image
        });
    };

    return (
        <div>
            <MainLayout>
                {/* B2B Hero Section */}
                <section className="relative h-[500px] flex items-center bg-blue-900 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/90 to-blue-800/50 z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                            alt="Office"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 text-white">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center space-x-2 bg-blue-800/50 rounded-full px-4 py-1 mb-6 border border-blue-700"
                            >
                                <ShieldCheck size={16} className="text-blue-300" />
                                <span className="text-sm font-medium text-blue-100">인증된 기업 파트너</span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                            >
                                구매를 <br />더 <span className="text-blue-400">간편하게</span>
                            </motion.h1>
                            <p className="text-xl text-blue-200 mb-8 max-w-lg">
                                기업 전용 할인가, 자동 인보이스 발행, 그리고 전담 지원 서비스를 경험하세요.
                            </p>
                            <button
                                onClick={handleViewCatalog}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/30 transition-all">
                                기업 전용 카탈로그 보기
                            </button>
                        </div>

                        {/* Stats/Cards */}
                        <div className="md:w-1/2 mt-10 md:mt-0 flex gap-4 overflow-x-auto md:justify-end pb-4 md:pb-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl min-w-[200px]"
                            >
                                <div className="text-blue-300 mb-2">파트너 할인</div>
                                <div className="text-4xl font-bold text-white">20%</div>
                                <div className="text-sm text-blue-200 mt-1">평균 할인율</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl min-w-[200px]"
                            >
                                <div className="text-blue-300 mb-2">배송 시간</div>
                                <div className="text-4xl font-bold text-white">24h</div>
                                <div className="text-sm text-blue-200 mt-1">익일 배송</div>
                            </motion.div>
                        </div>
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
                <section className="bg-white py-20 border-b border-gray-200">
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
                                            navigate('/login?type=company', { state: { from: `/agents/${agent.id}` } });
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
                <section id="personal-contents" className="bg-gray-50 py-20 border-b border-gray-200">
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

                {/* Main Content */}
                <section id="corporate-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-extrabold text-gray-900">
                            {isFiltered ? '귀사를 위한 추천 상품' : '전체 기업 카탈로그'}
                        </h2>
                        <div className="flex gap-4">
                            {isFiltered && (
                                <button
                                    onClick={() => setIsFiltered(false)}
                                    className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                                >
                                    전체 상품 보기 &rarr;
                                </button>
                            )}
                            <button
                                onClick={() => navigate('/shop')}
                                className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                            >
                                상품보기
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayedProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 p-4 cursor-pointer group flex flex-col h-full"
                            >
                                <div className="h-48 rounded-lg overflow-hidden bg-gray-100 mb-4 relative flex-shrink-0">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        B2B 할인
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <span className="text-xs text-gray-500 font-medium border border-gray-200 rounded px-2 py-0.5">{product.category}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                                <p className="text-xs text-gray-500 mt-2 mb-4 line-clamp-2 flex-grow">{product.description}</p>

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex items-end justify-between mb-4">
                                        <div>
                                            <div className="text-xs text-gray-500">기업 공급가</div>
                                            <div className="text-xl font-bold text-blue-700">
                                                <PriceDisplay amount={product.companyPrice} />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-emerald-600 font-bold flex items-center">
                                                <TrendingDown size={12} className="mr-1" />
                                                {Math.round(((product.personalPrice - product.companyPrice) / product.personalPrice) * 100)}%
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors shadow-sm"
                                        >
                                            샘플 주문
                                        </button>
                                        <button
                                            onClick={(e) => handleAddToCart(e, product)}
                                            className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center"
                                        >
                                            <ShoppingBag size={16} className="mr-1" />
                                            대량 추가
                                        </button>
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
