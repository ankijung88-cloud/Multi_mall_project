import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useFreelancers } from '../context/FreelancerContext';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';

export default function AssociatedContents() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';

    const { freelancers, isFavorite } = useFreelancers();
    const { user } = useAuthStore();

    // Filter "Interested" contents based on user favorites
    const interestedContents = freelancers.filter(f => user && isFavorite(String(user.id), f.id));

    // Theme Config
    const themeColor = isCompany ? 'text-blue-600' : 'text-pink-600';
    const bgBadge = isCompany ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600';
    const hoverText = isCompany ? 'group-hover:text-blue-600' : 'group-hover:text-pink-600';

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className={`${themeColor} font-semibold tracking-wide uppercase text-sm`}>Favorites (관심 목록)</span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-2">관심 컨텐츠</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto mt-2">
                            내가 찜한 전문가와 컨텐츠를 모아보세요.
                        </p>
                    </div>

                    {interestedContents.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-gray-500 mb-4">아직 관심 등록한 컨텐츠가 없습니다.</p>
                            <button
                                onClick={() => navigate(isCompany ? '/contents?type=company' : '/contents')}
                                className={`${themeColor} hover:underline font-medium`}
                            >
                                컨텐츠 둘러보기
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {interestedContents.map((content, index) => (
                                <motion.div
                                    key={content.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                                    onClick={() => navigate(`/contents/${content.id}${isCompany ? '?type=company' : ''}`)}
                                >
                                    <div className="h-56 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                        <img
                                            src={content.image}
                                            alt={content.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className={`absolute top-4 right-4 ${bgBadge} p-2 rounded-full z-20 shadow-sm`}>
                                            ♥
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className={`font-bold text-lg text-gray-900 ${hoverText} transition-colors mb-2`}>
                                            {content.name}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2">
                                            {content.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
