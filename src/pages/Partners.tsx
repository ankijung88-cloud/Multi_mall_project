import { useNavigate } from 'react-router-dom';
import { usePartners } from '../context/PartnerContext';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';

export default function Partners() {
    const { partners } = usePartners();
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Hero */}
                <div className="bg-gray-900 text-white py-16 mb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">K-Culture Partners</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            대한민국 최고의 문화 체험 및 교육 프로그램을 제공하는 파트너사를 소개합니다.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {partners.map((partner) => (
                            <motion.div
                                key={partner.id}
                                whileHover={{ y: -5 }}
                                onClick={() => navigate(`/partners/${partner.id}`)}
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
                                    <h3 className="font-bold text-xl mb-2 group-hover:text-blue-600 transition-colors">{partner.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{partner.description}</p>
                                    <div className="border-t pt-4 flex justify-between items-center text-sm">
                                        <span className="text-gray-500">진행중인 과정</span>
                                        <span className="font-semibold text-blue-600">{partner.schedules.length}개</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {partners.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500">등록된 제휴 업체가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
