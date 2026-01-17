
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useAgents } from '../context/AgentContext';
// import { useFreelancers } from '../context/FreelancerContext';
import { useContents } from '../context/ContentContext';

import { PriceDisplay } from '../components/PriceDisplay';
import MainLayout from '../layouts/MainLayout';
import { TrendingDown, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
import { useAuthStore } from '../store/useAuthStore';
import KBeautySection from '../components/sections/KBeautySection';
import KPerformanceSection from '../components/sections/KPerformanceSection';
import KAuditionSection from '../components/sections/KAuditionSection';
import KFashionSection from '../components/sections/KFashionSection';
import KCourseSection from '../components/sections/KCourseSection';

export default function CompanyHome() {
    const { products } = useProducts();
    const { contents } = useContents();

    // const { addToCart } = useCart();
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

    return (
        <div>
            <MainLayout>
                {/* B2B Hero Section */}
                <section className="relative h-[600px] flex items-center justify-center overflow-hidden" style={{
                    background: '#FFFFFF'
                }}>
                    <div className="absolute inset-0 z-0" style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }} />

                    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center space-x-2 rounded-full px-4 py-1 mb-6 font-korean"
                                style={{
                                    background: 'rgba(255, 182, 185, 0.2)',
                                    border: '2px solid rgba(255, 182, 185, 0.4)'
                                }}
                            >
                                <ShieldCheck size={16} style={{ color: '#FF9AA2' }} />
                                <span className="text-sm font-medium" style={{ color: '#4A5568' }}>인증된 기업 파트너</span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-hanbok"
                                style={{ color: '#FFFFFF' }}
                            >
                                기업을 위한 <br /><span style={{ color: '#FFB6B9' }}>특별한 혜택</span>
                            </motion.h1>
                            <p className="text-xl mb-8 max-w-lg font-korean" style={{ color: '#FFFFFF' }}>
                                기업 전용 할인가, 자동 인보이스 발행, 그리고 전담 지원 서비스를 경험하세요.
                            </p>
                            <button
                                onClick={handleViewCatalog}
                                className="font-bold py-3 px-8 rounded-lg transition-all font-korean text-white"
                                style={{
                                    background: 'linear-gradient(135deg, #FFB6B9 0%, #FF9AA2 100%)',
                                    border: '3px solid #FFFFFF'
                                }}
                            >
                                기업 전용 카탈로그 보기
                            </button>
                        </div>

                        {/* Stats/Cards */}
                        <div className="md:w-1/2 mt-10 md:mt-0 flex gap-4 overflow-x-auto md:justify-end pb-4 md:pb-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="p-6 rounded-xl min-w-[200px]"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    border: '2px solid rgba(255, 182, 185, 0.3)'
                                }}
                            >
                                <div className="mb-2 font-korean" style={{ color: '#FF9AA2' }}>파트너 할인</div>
                                <div className="text-4xl font-bold" style={{ color: '#4A5568' }}>20%</div>
                                <div className="text-sm mt-1 font-korean" style={{ color: '#8E9AAF' }}>평균 할인율</div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="p-6 rounded-xl min-w-[200px]"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    border: '2px solid rgba(255, 229, 180, 0.3)'
                                }}
                            >
                                <div className="mb-2 font-korean" style={{ color: '#FFD89B' }}>배송 시간</div>
                                <div className="text-4xl font-bold" style={{ color: '#4A5568' }}>24h</div>
                                <div className="text-sm mt-1 font-korean" style={{ color: '#8E9AAF' }}>익일 배송</div>
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
                            <h2 className="text-3xl font-bold font-hanbok pl-4" style={{
                                color: '#4A5568',
                                borderLeft: '4px solid #8B5CF6'
                            }}>
                                CHOOSE AGENT
                            </h2>
                            <button
                                onClick={() => navigate('/agents?type=company')}
                                className="font-bold font-korean px-6 py-3 transition-all duration-300 rounded-full hover:scale-105"
                                style={{
                                    color: '#8B5CF6',
                                    background: 'rgba(139, 92, 246, 0.15)',
                                    border: '2px solid rgba(139, 92, 246, 0.3)'
                                }}
                            >
                                전체보기
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {useAgents().agents.slice(0, 16).map((agent) => (
                                <div
                                    key={agent.id}
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            navigate('/login?type=company', { state: { from: `/ agents / ${agent.id} ` } });
                                        } else {
                                            navigate(`/ agents / ${agent.id}?type = company`);
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
                            <h2 className="text-3xl font-bold font-hanbok pl-4" style={{
                                color: '#4A5568',
                                borderLeft: '4px solid #F97316'
                            }}>
                                PERSONAL CONTENTS
                            </h2>
                            <button
                                onClick={() => navigate('/contents?type=company')}
                                className="font-bold font-korean px-6 py-3 transition-all duration-300 rounded-full hover:scale-105"
                                style={{
                                    color: '#F97316',
                                    background: 'rgba(249, 115, 22, 0.15)',
                                    border: '2px solid rgba(249, 115, 22, 0.3)'
                                }}
                            >
                                전체보기
                            </button>
                        </div>

                        {/* Grid Container */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {contents.map((content) => (
                                <div
                                    key={content.id}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group flex flex-col"
                                    onClick={() => navigate(`/contents/${content.id}`)}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={content.thumbnailUrl}
                                            alt={content.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                                            ₩{content.price.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-4 flex-grow flex flex-col">
                                        <div className="text-xs text-orange-600 font-semibold mb-1">{content.userName}</div>
                                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{content.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                                            {content.description}
                                        </p>
                                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                                            <span className="text-gray-400">{new Date(content.createdAt).toLocaleDateString()}</span>
                                            <span className="text-orange-600 font-medium group-hover:underline">상세보기 &rarr;</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {contents.length === 0 && (
                            <div className="w-full text-center py-20 bg-white rounded-xl shadow-sm">
                                <p className="text-gray-500 text-lg">등록된 컨텐츠가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Main Content */}
                <section id="corporate-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                        <h2 className="text-2xl font-extrabold font-hanbok" style={{ color: '#4A5568' }}>
                            {isFiltered ? '귀사를 위한 추천 상품' : 'SHOP'}
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
                                onClick={() => navigate('/shop?type=company')}
                                className="font-bold font-korean px-6 py-3 transition-all duration-300 rounded-full hover:scale-105"
                                style={{
                                    color: '#10B981',
                                    background: 'rgba(16, 185, 129, 0.15)',
                                    border: '2px solid rgba(16, 185, 129, 0.3)'
                                }}
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
