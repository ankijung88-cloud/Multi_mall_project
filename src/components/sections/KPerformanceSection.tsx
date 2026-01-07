import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePartners } from '../../context/PartnerContext';

export default function KPerformanceSection() {
    const navigate = useNavigate();
    const location = useLocation();
    const { partners } = usePartners();

    const isCompany = location.pathname.startsWith('/company') || location.search.includes('type=company');
    const linkParams = isCompany ? '?type=company' : '';

    // Filter partners for this section
    const sectionPartners = partners.filter(p => p.category === '공연 & 전시').slice(0, 3);

    return (
        <section className="bg-white py-20 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-indigo-600 pl-4">
                        K-Performance & Exhibition
                    </h2>
                    <button
                        onClick={() => navigate('/partners/performance' + linkParams)}
                        className="text-gray-500 hover:text-indigo-600 text-sm font-medium transition-colors"
                    >
                        전체 보기
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {sectionPartners.map((partner) => (
                        <Link
                            key={partner.id}
                            to={`/partners/${partner.id}${linkParams}`}
                            className="block cursor-pointer group text-center"
                        >
                            <motion.div
                                whileHover={{ y: -5 }}
                            >
                                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 group-hover:border-indigo-500 transition-all mb-3 shadow-sm">
                                    <img
                                        src={partner.image}
                                        alt={partner.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-600 truncate px-1">
                                    {partner.name}
                                </h3>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
