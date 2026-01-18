import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useContents } from '../context/ContentContext';
import { useAgents } from '../context/AgentContext';
import { PriceDisplay } from '../components/PriceDisplay';
import MainLayout from '../layouts/MainLayout';
// import { ShoppingCart } from 'lucide-react';
// import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import KBeautySection from '../components/sections/KBeautySection';
import KPerformanceSection from '../components/sections/KPerformanceSection';
import KAuditionSection from '../components/sections/KAuditionSection';
import KFashionSection from '../components/sections/KFashionSection';
import KCourseSection from '../components/sections/KCourseSection';

export default function PersonalHome() {
    const { products } = useProducts();
    // const { addToCart } = useCart();
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
        : products).slice(0, 8);

    const handleShopCollection = () => {
        setIsFiltered(true);
        setTimeout(() => {
            document.getElementById('recommended-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    // const handleAddToCart = (e: React.MouseEvent, product: any) => {
    //     e.stopPropagation(); // Stop bubbling to prevent parent clicks
    //
    //     if (!isAuthenticated) {
    //         // Redirect to login with specific type query param
    //         navigate('/login?type=personal');
    //         return;
    //     }
    //
    //     addToCart({
    //         id: product.id,
    //         name: product.name,
    //         price: product.personalPrice,
    //         image: product.image
    //     });
    // };

    return (
        <div>
            <MainLayout>
                {/* Hero Section */}
                <section className="relative h-[600px] flex items-center justify-center overflow-hidden" style={{
                    background: '#FFFFFF'
                }}>
                    <div className="absolute inset-0 z-0" style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=2000)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }} />

                    {/* Dark Overlay with Gradient */}
                    <div className="absolute inset-0 z-0" style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))'
                    }} />

                    <div className="relative z-10 text-center px-4 max-w-7xl mx-auto">
                        <div
                            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight font-hanbok"
                            style={{
                                color: '#FFFFFF',
                                textShadow: '0 2px 4px rgba(255, 255, 255, 0.4)'
                            }}
                        >
                            한국 문화의 <span style={{ color: '#A8D8EA', textShadow: '0 2px 4px rgba(255, 255, 255, 0.4)' }}>특별한 경험</span>
                        </div>
                        <p
                            className="text-xl md:text-2xl mb-10 font-korean"
                            style={{
                                color: '#FFFFFF',
                                textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)'
                            }}
                        >
                            K-Culture의 모든 것, 당신만을 위한 프리미엄 여정
                        </p>
                        <button
                            onClick={handleShopCollection}
                            className="font-bold py-4 px-10 rounded-full text-lg font-korean transition-all text-white hover-effect-on-air"
                            style={{
                                background: 'linear-gradient(135deg, #A8D8EA 0%, #7AC5DC 100%)',
                                border: '3px solid #FFFFFF'
                            }}
                        >
                            시작하기

                        </button>
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
                            <h2 className="text-3xl font-bold font-hanbok pl-4" style={{
                                color: '#4A5568',
                                borderLeft: '4px solid #8B5CF6'
                            }}>
                                에이전트 찾기
                            </h2>
                            <button
                                onClick={() => navigate('/agents')}
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
                            <h2 className="text-3xl font-bold font-hanbok pl-4" style={{
                                color: '#4A5568',
                                borderLeft: '4px solid #F97316'
                            }}>
                                PERSONAL CONTENTS
                            </h2>
                            <div className="flex gap-4">

                                <button
                                    onClick={() => navigate('/contents')}
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
                        </div>

                        {/* Grid Container */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {useContents().contents.slice(0, 8).map((content) => (
                                <motion.div
                                    key={content.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => navigate(`/contents/${content.id}`)}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={content.thumbnailUrl}
                                            alt={content.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-xs font-medium text-orange-200 mb-1">{content.userName}</p>
                                            <h3 className="font-bold text-lg line-clamp-1">{content.title}</h3>
                                        </div>
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold">
                                            ₩{content.price.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                            {content.description}
                                        </p>
                                        <div className="flex items-center text-xs text-orange-500 font-medium">
                                            <span>상세보기</span>
                                            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {useContents().contents.length === 0 && (
                                <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-xl">
                                    등록된 컨텐츠가 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section id="recommended-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-4">
                        <h2 className="text-3xl font-bold font-hanbok pl-4" style={{
                            color: '#4A5568',
                            borderLeft: '4px solid #10B981'
                        }}>
                            {isFiltered ? '고객님을 위한 추천 상품' : 'SHOP'}
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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

                                        {/* Buttons removed as requested */}
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
        </div >
    );
}
