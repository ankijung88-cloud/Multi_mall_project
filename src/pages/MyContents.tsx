import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useFreelancers } from '../context/FreelancerContext';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function MyContents() {
    const navigate = useNavigate();
    const { freelancers, deleteFreelancer } = useFreelancers();
    const { user } = useAuthStore();

    // Filter contents for current user, OR show all if implementing the Company view logic described (but this is 'My Contents' so sticking to Author).
    // Actually, user asked for: "Personal's registered content is visible on Company page in same format".
    // That means the Company Page view (AllPersonalContents) shows everything.
    // THIS page is "My Contents" -> Show only mine.
    const myContents = freelancers.filter(f => f.authorId === String(user?.id));

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('정말 삭제하시겠습니까?')) {
            deleteFreelancer(id);
        }
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">Personal Space</span>
                            <h1 className="text-3xl font-bold text-gray-900 mt-2">나의 컨텐츠</h1>
                        </div>
                        <button
                            onClick={() => navigate('/contents/register')}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-sm"
                        >
                            <Plus size={18} /> 컨텐츠 등록
                        </button>
                    </div>

                    {myContents.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-gray-500 mb-4">등록된 컨텐츠가 없습니다.</p>
                            <button
                                onClick={() => navigate('/contents/register')}
                                className="text-emerald-600 hover:underline font-medium"
                            >
                                첫 번째 컨텐츠를 등록해보세요!
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {myContents.map((content, index) => (
                                <motion.div
                                    key={content.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col"
                                    onClick={() => navigate(`/contents/${content.id}`)}
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={content.image}
                                            alt={content.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button
                                                className="bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-600 hover:text-emerald-600 shadow-sm"
                                                onClick={(e) => { e.stopPropagation(); /* Handle Edit */ }}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                className="bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-600 hover:text-red-500 shadow-sm"
                                                onClick={(e) => handleDelete(content.id, e)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-grow">
                                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-xs font-semibold mb-2">
                                            {content.title}
                                        </span>
                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{content.name}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2">{content.description}</p>
                                    </div>
                                    <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
                                        <span>등록일: Today</span>
                                        <span className="group-hover:text-emerald-600 transition-colors">상세보기 →</span>
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
