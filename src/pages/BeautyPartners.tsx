import { useNavigate, useLocation } from 'react-router-dom';
import { usePartners } from '../context/PartnerContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function BeautyPartners() {
    const { partners } = usePartners();
    const navigate = useNavigate();
    const { userType } = useAuthStore();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryType = searchParams.get('type');
    const isCompanyView = userType === 'company' || queryType === 'company';

    // Specific category filter
    const displayedPartners = partners
        .filter(p => p.category?.trim() === '뷰티 & 성형')
        .sort((a, b) => b.id - a.id);

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Hero */}
                <div className={clsx(
                    "text-white py-16 mb-12 transition-colors duration-300",
                    isCompanyView ? "bg-blue-900" : "bg-gray-900"
                )}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            K-Beauty & Plastic Surgery
                        </h1>
                        <p className={clsx("text-xl max-w-2xl mx-auto", isCompanyView ? "text-blue-200" : "text-gray-300")}>
                            대한민국 최고의 뷰티 및 의료 서비스를 제공하는 파트너사를 소개합니다.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {displayedPartners.map((partner) => (
                            <motion.div
                                key={partner.id}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate(`/partners/${partner.id}${isCompanyView ? '?type=company' : ''}`)}
                                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-100"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={partner.image}
                                        alt={partner.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-xl mb-2 group-hover:text-pink-600 transition-colors">{partner.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{partner.description}</p>
                                    <div className="border-t pt-4 flex justify-between items-center text-sm">
                                        <span className="text-gray-500">진행중인 과정</span>
                                        <span className="font-semibold text-pink-600">{partner.schedules.length}개</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {displayedPartners.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500">등록된 뷰티/병원 파트너가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
