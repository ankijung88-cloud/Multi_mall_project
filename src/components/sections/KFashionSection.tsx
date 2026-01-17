import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePartners } from '../../context/PartnerContext';

export default function KFashionSection() {
    const navigate = useNavigate();
    const location = useLocation();
    const { partners } = usePartners();

    const isCompany = location.pathname.startsWith('/company') || location.search.includes('type=company');
    const linkParams = isCompany ? '?type=company' : '';

    // Filter partners for this section
    const sectionPartners = partners.filter(p => p.category === '패션').slice(0, 3);

    return (
        <section className="py-20 border-b" style={{
            background: 'linear-gradient(135deg, rgba(168, 216, 234, 0.2) 0%, rgba(255, 182, 185, 0.2) 100%)',
            borderColor: '#CBD5E0'
        }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-hanbok pl-4" style={{
                        color: '#4A5568',
                        borderLeft: '4px solid transparent',
                        borderImage: 'linear-gradient(135deg, #A8D8EA 0%, #FFB6B9 100%) 1'
                    }}>
                        K-FASHION
                    </h2>
                    <button
                        onClick={() => navigate('/partners/fashion' + linkParams)}
                        className="font-bold font-korean px-6 py-3 transition-all duration-300 rounded-full hover:scale-105"
                        style={{
                            color: '#7AC5DC',
                            background: 'linear-gradient(135deg, rgba(168, 216, 234, 0.15) 0%, rgba(255, 182, 185, 0.15) 100%)',
                            border: '2px solid rgba(168, 216, 234, 0.3)'
                        }}
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
                                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 group-hover:border-rose-500 transition-all mb-3 shadow-sm">
                                    <img
                                        src={partner.image}
                                        alt={partner.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 group-hover:text-rose-600 truncate px-1">
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
