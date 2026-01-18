import { useNavigate, useLocation } from 'react-router-dom';
import { usePartners } from '../context/PartnerContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

export default function PerformancePartners() {
    const { partners } = usePartners();
    const navigate = useNavigate();
    const { userType } = useAuthStore();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const isAdmin = userType === 'admin';
    const categoryParam = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);

    useEffect(() => {
        setSelectedCategory(categoryParam);
    }, [categoryParam]);

    // Update URL when dropdown changes
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedCategory(val === 'ALL' ? null : val);
        const newParams = new URLSearchParams(searchParams);
        if (val === 'ALL') {
            newParams.delete('category');
        } else {
            newParams.set('category', val);
        }
        navigate(`${location.pathname}?${newParams.toString()}`);
    };

    // Specific category filter
    const displayedPartners = partners
        .filter(p => {
            const isPerformance = p.category?.trim() === '공연 & 전시';
            if (!selectedCategory) return isPerformance;
            return isPerformance && (
                (p.description && p.description.includes(selectedCategory)) ||
                (p.name && p.name.includes(selectedCategory)) ||
                (p.category && p.category.includes(selectedCategory))
            );
        })
        .sort((a, b) => b.id - a.id);

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Hero */}
                <div className={clsx(
                    "text-white py-16 mb-12 transition-colors duration-300",
                    userType === 'company' ? "bg-blue-900" : "bg-gray-900"
                )}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            K-Performance & Exhibition
                        </h1>
                        <p className={clsx("text-xl max-w-2xl mx-auto", userType === 'company' ? "text-blue-200" : "text-gray-300")}>
                            다채로운 공연과 전시를 기획하고 제공하는 파트너사를 소개합니다.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ADMIN ONLY DROPDOWN */}
                    {isAdmin && (
                        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                            <span className="font-bold text-gray-700">관리자 카테고리 설정:</span>
                            <select
                                value={selectedCategory || 'ALL'}
                                onChange={handleCategoryChange}
                                className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
                            >
                                <option value="ALL">전체 보기</option>
                                <option value="DANCE">댄스</option>
                                <option value="PHOTO">사진</option>
                                <option value="CONCERT">공연</option>
                                <option value="EXHIBITION">전시</option>
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {displayedPartners.map((partner) => (
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
                                    <h3 className="font-bold text-xl mb-2 group-hover:text-indigo-600 transition-colors">{partner.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{partner.description}</p>
                                    <div className="border-t pt-4 flex justify-between items-center text-sm">
                                        <span className="text-gray-500">진행중인 과정</span>
                                        <span className="font-semibold text-indigo-600">{partner.schedules.length}개</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {displayedPartners.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500">등록된 공연/전시 파트너가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
