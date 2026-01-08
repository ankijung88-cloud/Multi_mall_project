import { useState, useEffect } from 'react';
import { useBoard } from '../context/BoardContext';
import type { Post, BoardType } from '../context/BoardContext';
import MainLayout from '../layouts/MainLayout';
import { Plus, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import clsx from 'clsx';

interface CommunityBoardProps {
    category: 'reservation' | 'info' | 'center';
}

export default function CommunityBoard({ category }: CommunityBoardProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';
    const viewMode = isCompany ? 'company' : 'personal';
    const { isAuthenticated, user, userType } = useAuthStore();
    const { getPostsByType, addPost, deletePost } = useBoard();

    // Map category to BoardType and Display Title
    const boardConfig = {
        reservation: {
            type: 'reservation-support' as BoardType,
            title: '예약 및 일정 서포트',
            desc: '전문가의 도움으로 완벽한 일정을 계획하세요.',
            writePermission: true // anyone can write? or maybe restrict? Assuming all logged in users.
        },
        info: {
            type: 'info-sharing' as BoardType,
            title: '정보 공유',
            desc: '유용한 여행 및 비즈니스 정보를 공유하는 공간입니다.',
            writePermission: true
        },
        center: {
            type: 'customer-center' as BoardType,
            title: '고객 센터',
            desc: '궁금한 점이 있으신가요? 친절하게 답변해 드립니다.',
            writePermission: true // Usually users ask questions here.
        }
    };

    const config = boardConfig[category];
    const posts = getPostsByType(config.type, viewMode);

    const [view, setView] = useState<'list' | 'write' | 'detail'>('list');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({ title: '', content: '', isSecret: false });

    // Ensure view resets when category changes (if same component instance is reused)
    useEffect(() => {
        setView('list');
        setSelectedPost(null);
        setFormData({ title: '', content: '', isSecret: false });
    }, [category]);

    const handleWriteClick = () => {
        if (!isAuthenticated) {
            if (confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?')) {
                navigate(`/login?type=${viewMode}`);
            }
            return;
        }
        setView('write');
    };

    const handleSubmit = () => {
        if (!formData.title.trim() || !formData.content.trim()) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        addPost({
            type: config.type,
            viewMode,
            title: formData.title,
            content: formData.content,
            author: user?.name || 'Anonymous',
            contactInfo: user?.email,
            isSecret: formData.isSecret,
            status: 'Pending'
        });
        setFormData({ title: '', content: '', isSecret: false });
        setView('list');
    };

    const handleDelete = (id: string) => {
        if (confirm('정말로 삭제하시겠습니까?')) {
            deletePost(id);
            if (view === 'detail') setView('list');
        }
    };

    return (
        <MainLayout>
            {/* Header Section */}
            <div className={clsx(
                "py-12 mb-8 transition-colors duration-300",
                isCompany ? "bg-blue-900 text-white" : "bg-emerald-900 text-white"
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{config.title}</h1>
                    <p className={clsx("text-lg", isCompany ? "text-blue-200" : "text-emerald-200")}>{config.desc}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {view === 'list' && (
                    <>
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={handleWriteClick}
                                className={clsx(
                                    "px-5 py-2 rounded-lg flex items-center gap-2 text-white shadow-sm transition-colors",
                                    isCompany ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
                                )}
                            >
                                <Plus size={18} /> 글쓰기
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-gray-700 w-20">No</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700">제목</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 w-32">작성자</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 w-32">날짜</th>
                                        <th className="px-6 py-4 font-semibold text-gray-700 w-24">조회</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {posts.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <AlertCircle size={32} className="text-gray-300" />
                                                    <p>등록된 게시글이 없습니다. 첫 번째 글을 작성해보세요!</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        posts.map((post, index) => {
                                            const isSecret = post.isSecret;
                                            // Admin or Author can view secret posts
                                            const canView = !isSecret || userType === 'admin' || (user && user.name === post.author);

                                            return (
                                                <tr
                                                    key={post.id}
                                                    onClick={() => {
                                                        if (canView) {
                                                            setSelectedPost(post);
                                                            setView('detail');
                                                        } else {
                                                            alert('비밀글은 작성자와 관리자만 볼 수 있습니다.');
                                                        }
                                                    }}
                                                    className={clsx(
                                                        "transition-colors",
                                                        canView ? "hover:bg-gray-50 cursor-pointer" : "cursor-not-allowed opacity-70"
                                                    )}
                                                >
                                                    <td className="px-6 py-4 text-gray-500">{posts.length - index}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        <div className="flex items-center gap-2">
                                                            {isSecret && <span className="text-xs border border-gray-300 px-1 rounded text-gray-500">비밀</span>}
                                                            <span className="truncate max-w-md">{post.title}</span>
                                                            {/* New Badge for recent posts could go here */}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">{post.author}</td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">{post.date}</td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">{post.views || 0}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {view === 'write' && (
                    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">글 작성하기</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow"
                                    placeholder="제목을 입력해주세요"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg h-60 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow"
                                    placeholder="내용을 자유롭게 작성해주세요"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isSecret"
                                    checked={formData.isSecret}
                                    onChange={e => setFormData({ ...formData, isSecret: e.target.checked })}
                                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label htmlFor="isSecret" className="text-sm text-gray-600">비밀글로 작성 (관리자와 본인만 확인 가능)</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={() => setView('list')}
                                    className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className={clsx(
                                        "px-6 py-2 text-white rounded-lg transition-colors shadow-sm",
                                        isCompany ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
                                    )}
                                >
                                    등록하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'detail' && selectedPost && (
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-8 border-b bg-gray-50/50">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPost.title}</h2>
                            <div className="flex items-center text-sm text-gray-500 gap-6">
                                <span>작성자: <span className="font-medium text-gray-700">{selectedPost.author}</span></span>
                                <span>날짜: {selectedPost.date}</span>
                                <span>조회: {selectedPost.views || 0}</span>
                            </div>
                        </div>
                        <div className="p-8 min-h-[300px] whitespace-pre-wrap">
                            {selectedPost.content}
                        </div>
                        <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
                            <button
                                onClick={() => setView('list')}
                                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                목록으로
                            </button>
                            {(userType === 'admin' || (user && user.name === selectedPost.author)) && (
                                <button
                                    onClick={() => handleDelete(selectedPost.id)}
                                    className="px-5 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
