import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useContents } from '../context/ContentContext';
import { motion } from 'framer-motion';

export default function AllPersonalContents() {
    const navigate = useNavigate();
    const { contents } = useContents();

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen py-12 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-emerald-500 pl-4">
                            전체 컨텐츠
                        </h1>
                        <p className="mt-2 text-gray-600 pl-5">
                            다양한 크리에이터들의 프리미엄 컨텐츠를 만나보세요.
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {contents.map((content) => (
                            <motion.div
                                key={content.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
                                onClick={() => navigate(`/contents/${content.id}`)}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={content.thumbnailUrl}
                                        alt={content.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                                        ₩{content.price.toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-4 flex-grow flex flex-col">
                                    <div className="text-xs text-emerald-600 font-semibold mb-1">{content.userName}</div>
                                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{content.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                                        {content.description}
                                    </p>
                                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                                        <span className="text-gray-400">{new Date(content.createdAt).toLocaleDateString()}</span>
                                        <span className="text-emerald-600 font-medium group-hover:underline">다운로드 &rarr;</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {contents.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500 text-lg">등록된 컨텐츠가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
