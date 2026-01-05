import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePartners } from '../context/PartnerContext';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Search, Star } from 'lucide-react';

export default function CoursePartners() {
    const { partners } = usePartners();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter for '코스' category
    const category = '코스';

    // Sort by ID descending (newest first)
    const displayedPartners = partners
        .filter(p => p.category?.trim() === category)
        .sort((a, b) => b.id - a.id);

    const filteredPartners = displayedPartners.filter(partner => {
        const nameMatch = partner.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        const descMatch = partner.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
        return nameMatch || descMatch;
    });

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen">
                {/* Hero Section */}
                <div className="bg-emerald-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 opacity-90" />
                        <img
                            src="https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&q=80&w=2000"
                            alt="Korea Travel"
                            className="w-full h-full object-cover mix-blend-overlay"
                        />
                    </div>
                    <div className="max-w-7xl mx-auto relative z-10 text-center">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            K-Course
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-emerald-100 max-w-2xl mx-auto"
                        >
                            특별한 한국 여행 코스와 체험을 만나보세요.
                        </motion.p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="코스 또는 파트너 검색..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Partners Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {filteredPartners.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-gray-400 mb-4">
                                <Search size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">검색 결과가 없습니다</h3>
                            <p className="text-gray-500 mt-2">다른 검색어로 다시 시도해보세요.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPartners.map((partner, index) => (
                                <motion.div
                                    key={partner.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={`/partners/${partner.id}`}
                                        className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100"
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={partner.image}
                                                alt={partner.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-600 shadow-sm">
                                                {partner.category}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                                {partner.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                                                {partner.description}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <Star className="text-yellow-400 fill-current w-4 h-4 mr-1" />
                                                    <span className="font-bold text-gray-900">4.9</span>
                                                    <span className="mx-1">·</span>
                                                    <span>(120+)</span>
                                                </div>
                                                <span className="text-emerald-600 font-medium group-hover:underline">
                                                    상세보기 →
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
