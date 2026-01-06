import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';
import MainLayout from '../../layouts/MainLayout';

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    hits: number;
}

interface PostBoardProps {
    title: string;
    storageKey: string;
}

export default function PostBoard({ title, storageKey }: PostBoardProps) {
    const { userType, user, adminRole } = useAuthStore();
    // Admin check: userType 'admin' AND role 'super'
    const isAdmin = userType === 'admin' && adminRole === 'super';

    const [posts, setPosts] = useState<Post[]>([]);
    const [view, setView] = useState<'list' | 'detail' | 'form'>('list');
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Reset selection when view changes or search changes
    useEffect(() => {
        setSelectedIds([]);
    }, [view, searchTerm]);

    const handleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredPosts.map(p => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (window.confirm(`${selectedIds.length}개의 게시물을 정말 삭제하시겠습니까?`)) {
            const updated = posts.filter(p => !selectedIds.includes(p.id));
            savePosts(updated);
            setSelectedIds([]);
        }
    };

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formContent, setFormContent] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            setPosts(JSON.parse(stored));
        } else {
            // Seed sample data if empty
            if (storageKey === 'board_notice') {
                const sample: Post[] = [
                    { id: 1, title: 'Welcome to our generic mall!', content: 'This is the first notice.', author: 'Admin', date: '2024-01-01', hits: 120 },
                    { id: 2, title: 'Maintenance Schedule', content: 'Server maintenance at midnight.', author: 'Admin', date: '2024-01-15', hits: 45 }
                ];
                setPosts(sample);
                localStorage.setItem(storageKey, JSON.stringify(sample));
            }
        }
    }, [storageKey]);

    const savePosts = (newPosts: Post[]) => {
        setPosts(newPosts);
        localStorage.setItem(storageKey, JSON.stringify(newPosts));
    };

    const handleCreate = () => {
        if (!isAdmin) return;
        setCurrentPost(null);
        setFormTitle('');
        setFormContent('');
        setView('form');
    };

    const handleEdit = (post: Post) => {
        if (!isAdmin) return;
        setCurrentPost(post);
        setFormTitle(post.title);
        setFormContent(post.content);
        setView('form');
    };

    const handleDelete = (id: number) => {
        if (!isAdmin) return;
        if (window.confirm('Are you sure you want to delete this post?')) {
            const updated = posts.filter(p => p.id !== id);
            savePosts(updated);
            if (view === 'detail') setView('list');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;

        const newPost: Post = {
            id: currentPost ? currentPost.id : Date.now(),
            title: formTitle,
            content: formContent,
            author: currentPost ? currentPost.author : (user?.name || 'Admin'),
            date: currentPost ? currentPost.date : new Date().toISOString().split('T')[0],
            hits: currentPost ? currentPost.hits : 0
        };

        if (currentPost) {
            // Update
            const updated = posts.map(p => p.id === currentPost.id ? newPost : p);
            savePosts(updated);
        } else {
            // Create
            savePosts([newPost, ...posts]);
        }
        setView('list');
    };

    const handleViewDetail = (post: Post) => {
        // Increment hits
        const updated = posts.map(p => p.id === post.id ? { ...p, hits: p.hits + 1 } : p);
        savePosts(updated);

        // Find the updated post to show
        const viewedPost = updated.find(p => p.id === post.id);
        setCurrentPost(viewedPost || post);
        setView('detail');
    };

    const filteredPosts = posts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                    {isAdmin && view === 'list' && (
                        <div className="flex space-x-2">
                            {selectedIds.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <Trash2 size={20} />
                                    <span>선택 삭제 ({selectedIds.length})</span>
                                </button>
                            )}
                            <button
                                onClick={handleCreate}
                                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Plus size={20} />
                                <span>글쓰기</span>
                            </button>
                        </div>
                    )}
                </div>

                {view === 'list' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-100 flex justify-end">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="검색어를 입력하세요..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                                    <tr>
                                        {isAdmin && (
                                            <th className="px-6 py-4 font-medium w-16 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={filteredPosts.length > 0 && selectedIds.length === filteredPosts.length}
                                                    onChange={handleSelectAll}
                                                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                                />
                                            </th>
                                        )}
                                        <th className="px-6 py-4 font-medium w-20 text-center">No.</th>
                                        <th className="px-6 py-4 font-medium">제목</th>
                                        <th className="px-6 py-4 font-medium w-32 text-center">작성자</th>
                                        <th className="px-6 py-4 font-medium w-32 text-center">날짜</th>
                                        <th className="px-6 py-4 font-medium w-20 text-center">조회</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredPosts.length === 0 ? (
                                        <tr>
                                            <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                                                등록된 게시물이 없습니다.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPosts.map((post, idx) => (
                                            <tr key={post.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => handleViewDetail(post)}>
                                                {isAdmin && (
                                                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(post.id)}
                                                            onChange={() => handleSelect(post.id)}
                                                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                                        />
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-center text-gray-500 text-sm">
                                                    {filteredPosts.length - idx}
                                                </td>
                                                <td className="px-6 py-4 text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                                                    {post.title}
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-500 text-sm">
                                                    {post.author}
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-500 text-sm">
                                                    {post.date}
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-500 text-sm">
                                                    {post.hits}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {view === 'detail' && currentPost && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8">
                        <div className="border-b border-gray-200 pb-6 mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">{currentPost.title}</h2>
                                {isAdmin && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(currentPost); }}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="수정"
                                        >
                                            <Pencil size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(currentPost.id); }}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="삭제"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                                <span>By {currentPost.author}</span>
                                <span>•</span>
                                <span>{currentPost.date}</span>
                                <span>•</span>
                                <span>조회 {currentPost.hits}</span>
                            </div>
                        </div>

                        <div className="prose max-w-none text-gray-800 whitespace-pre-line min-h-[200px]">
                            {currentPost.content}
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-200 flex justify-center">
                            <button
                                onClick={() => setView('list')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                                목록으로
                            </button>
                        </div>
                    </div>
                )}

                {view === 'form' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-8 max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">{currentPost ? '글 수정' : '새 글 작성'}</h2>
                            <button onClick={() => setView('list')} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                                <input
                                    type="text"
                                    required
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                                    placeholder="제목을 입력하세요"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">내용</label>
                                <textarea
                                    required
                                    value={formContent}
                                    onChange={(e) => setFormContent(e.target.value)}
                                    rows={15}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                                    placeholder="내용을 입력하세요"
                                />
                            </div>

                            <div className="flex justify-end space-x-4pt-4">
                                <button
                                    type="button"
                                    onClick={() => setView('list')}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                >
                                    {currentPost ? '수정 완료' : '작성 완료'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
