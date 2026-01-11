import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useContents } from '../context/ContentContext';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function MyContents() {
    const navigate = useNavigate();
    const { contents, deleteContent } = useContents();
    const { user, userType, adminRole } = useAuthStore();

    // Filter contents for current user
    const myContents = contents.filter(c => c.userId === String(user?.id));

    // Only Personal users (authors) or Super Admins can register content
    const canRegister = userType === 'personal' || adminRole === 'super';

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('정말 삭제하시겠습니까?')) {
            try {
                await deleteContent(id);
                alert('컨텐츠가 삭제되었습니다.');
            } catch (error) {
                console.error("Delete failed", error);
                alert("삭제에 실패했습니다.");
            }
        }
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <span className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">Personal Space</span>
                            <h1 className="text-3xl font-bold text-gray-900 mt-2">나의 컨텐츠 (등록한 작품)</h1>
                        </div>
                        {canRegister && (
                            <button
                                onClick={() => navigate('/contents/register')}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-sm"
                            >
                                <Plus size={18} /> 컨텐츠 등록
                            </button>
                        )}
                    </div>

                    {myContents.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-gray-500 mb-4">등록된 컨텐츠가 없습니다.</p>
                            {canRegister && (
                                <button
                                    onClick={() => navigate('/contents/register')}
                                    className="text-emerald-600 hover:underline font-medium"
                                >
                                    첫 번째 컨텐츠를 등록해보세요!
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {myContents.map((content, index) => (
                                <motion.div
                                    key={content.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
                                    onClick={() => navigate(`/contents/${content.id}`)}
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={content.thumbnailUrl}
                                            alt={content.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button
                                                className="bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-600 hover:text-emerald-600 shadow-sm transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/contents/edit/${content.id}`);
                                                }}
                                                title="수정"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-600 hover:text-red-500 shadow-sm transition-colors"
                                                onClick={(e) => handleDelete(content.id, e)}
                                                title="삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-grow">
                                        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{content.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-2">{content.description}</p>
                                        <div className="flex justify-between items-center mt-auto">
                                            <span className="font-bold text-emerald-600">₩{content.price.toLocaleString()}</span>
                                            <span className="text-xs text-gray-400">{new Date(content.createdAt).toLocaleDateString()}</span>
                                        </div>
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
