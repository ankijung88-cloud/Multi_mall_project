import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useFreelancers } from '../context/FreelancerContext';
import { motion } from 'framer-motion';

export default function AllPersonalContents() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';
    const { freelancers } = useFreelancers();

    const themeColor = isCompany ? 'text-blue-600' : 'text-orange-600';
    const arrowColor = isCompany ? 'text-blue-500' : 'text-orange-500';
    const groupHoverColor = isCompany ? 'group-hover:text-blue-600' : 'group-hover:text-orange-600';

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className={`${themeColor} font-semibold tracking-wide uppercase text-sm`}>
                            {isCompany ? 'Registered Contents' : 'Personal Contents'}
                        </span>
                        <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
                            {isCompany ? '등록된 전문가 프로필' : '새로운 영감을 주는 크리에이터'}
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            {isCompany
                                ? '프로젝트를 위한 재능 있는 전문가를 찾아보세요.'
                                : '홈 스타일링, 피트니스, 쿠킹 등 다양한 분야의 전문가를 만나보세요.'
                            }
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {freelancers.map((freelancer, index) => (
                            <motion.div
                                key={freelancer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                                onClick={() => navigate(`/contents/${freelancer.id}${isCompany ? '?type=company' : ''}`)}
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                    <img
                                        src={freelancer.image}
                                        alt={freelancer.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 z-20 shadow-sm">
                                        {freelancer.title}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className={`font-bold text-xl text-gray-900 ${groupHoverColor} transition-colors mb-2`}>
                                        {freelancer.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                        {freelancer.description}
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                                        <span className="text-gray-400">View Details</span>
                                        <span className={`${arrowColor} font-medium group-hover:translate-x-1 transition-transform`}>→</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {freelancers.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            No creators found.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
