import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import { MapPin, Clock, Star, Navigation, Filter, Search } from 'lucide-react';
import clsx from 'clsx';

interface Restaurant {
    id: number;
    name: string;
    region: string;
    address: string;
    hours: string;
    description: string;
    image: string;
    rating: number;
}

const REGIONS = ['All', 'Seoul', 'Busan', 'Jeju', 'Incheon'];

const REGION_LABELS: Record<string, string> = {
    'All': '전체',
    'Seoul': '서울',
    'Busan': '부산',
    'Jeju': '제주',
    'Incheon': '인천'
};

export default function Travel() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async (region: string, keyword: string = '') => {
        setIsLoading(true);
        try {
            const params: any = {};
            if (keyword) {
                params.keyword = keyword;
            } else {
                params.region = region;
            }

            const { data } = await axios.get('/api/partners/travel/restaurants', { params });
            setRestaurants(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch travel data", error);
        } finally {
            setIsLoading(false);
        }
    };

    // UseEffect for Region changes (clears search)
    useEffect(() => {
        if (!searchQuery) {
            fetchData(selectedRegion);
        }
    }, [selectedRegion, searchQuery]); // Added searchQuery to dependency to re-fetch if it becomes empty

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        // When searching, we search ALL regions, so distinct from region filter
        // We might want to visually select 'All' or keep it neutral.
        // Let's set selectedRegion to 'All' to reflect "All Regions" search?
        // Or just fire the search request.
        fetchData('All', searchQuery);
        setSelectedRegion('All'); // Reset region filter to All
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };



    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Hero Section */}
                <div className="relative h-[40vh] min-h-[400px] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&q=80&w=2000"
                        alt="Korea Travel"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-4xl md:text-5xl font-bold mb-4"
                            >
                                여행 & 맛집 (Travel & Gourmet)
                            </motion.h1>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
                            >
                                대한민국 방방곡곡의 숨겨진 명소와 최고의 맛집을 발견해보세요.
                            </motion.p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                    {/* Filter & Search Bar */}
                    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                            {/* Left: Search Input */}
                            <div className="relative w-full md:w-96 group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="지역, 맛집 검색..." // "Search restaurants, cafes..."
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-inner"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="absolute inset-y-1 right-1 px-4 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    검색
                                </button>
                            </div>

                            {/* Right: Region Filter */}
                            <div className="flex flex-row items-center gap-4 w-full md:w-auto">
                                <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm font-medium shrink-0">
                                    <Filter size={14} />
                                    <span>지역별 필터</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {REGIONS.map(region => (
                                        <button
                                            key={region}
                                            onClick={() => {
                                                setSearchQuery('');
                                                setSelectedRegion(region);
                                            }}
                                            className={clsx(
                                                "px-4 py-2 rounded-full font-medium transition-all duration-300 text-sm whitespace-nowrap",
                                                selectedRegion === region && !searchQuery
                                                    ? "bg-blue-600 text-white shadow-md transform scale-105"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                            )}
                                        >
                                            {REGION_LABELS[region] || region}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Content Grid */}
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {restaurants.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                                >
                                    {/* Image */}
                                    <div className="h-56 overflow-hidden relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-blue-800 shadow-sm">
                                            {item.region}
                                        </div>
                                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-2 py-1 rounded-lg text-white text-sm font-bold flex items-center">
                                            <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                                            {item.rating}
                                        </div>
                                    </div>

                                    {/* Info Body */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {item.name}
                                        </h3>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-start text-gray-600">
                                                <MapPin size={18} className="mr-2 mt-0.5 text-red-500 shrink-0" />
                                                <span className="text-sm">{item.address}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock size={18} className="mr-2 text-blue-500 shrink-0" />
                                                <span className="text-sm font-medium">{item.hours}</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>

                                        <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2">
                                            <Navigation size={16} />
                                            상세 보기
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!isLoading && restaurants.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            검색된 결과가 없습니다. {searchQuery && `다른 검색어로 시도해보세요.`}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
