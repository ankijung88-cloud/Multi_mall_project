import { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import type { BoardType, Post } from '../context/BoardContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';
import { Plus, Search, Eye, Calendar, User, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

interface BoardPageProps {
    type: BoardType;
    title: string;
    subtitle?: string;
}

export default function BoardPage({ type, title, subtitle }: BoardPageProps) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';
    const viewMode = isCompany ? 'company' : 'personal';

    const { getPostsByType, addPost, deletePost } = useBoard();
    const { userType } = useAuthStore();
    const posts = getPostsByType(type, viewMode);

    // View Mode: 'list', 'write', 'detail'
    const [view, setView] = useState<'list' | 'write' | 'detail'>('list');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    // Form State
    const [formData, setFormData] = useState({ title: '', content: '' });

    const handleWrite = () => {
        addPost({
            type,
            viewMode,
            title: formData.title,
            content: formData.content,
            author: userType === 'admin' ? 'Admin' : 'User' // Simplified
        });
        setFormData({ title: '', content: '' });
        setView('list');
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this post?')) {
            deletePost(id);
            if (view === 'detail') setView('list');
        }
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Hero Section matching PartnerCategoryPage */}
                <div className={clsx(
                    "py-16 mb-12 transition-colors duration-300",
                    isCompany ? "bg-blue-900 text-white" : "bg-gray-900 text-white"
                )}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
                        {subtitle && <p className={clsx("text-xl max-w-2xl mx-auto", isCompany ? "text-blue-200" : "text-gray-300")}>{subtitle}</p>}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Content */}

                    {view === 'list' && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                </div>
                                {/* Only Admin can write News/Guide usually, but for demo allowing all or just admin based on requirements. 
                            Let's allow everyone for Success stories maybe? 
                            For now, strict to admin for News/Guide, everyone for others? 
                            User request said CRUD functionality, implies creating. let's allow button.
                        */}
                                {userType === 'admin' && (
                                    <button
                                        onClick={() => setView('write')}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                                    >
                                        <Plus size={18} /> Write
                                    </button>
                                )}
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-700 w-20">No</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700">Title</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700 w-32">Author</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700 w-32">Date</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700 w-24 text-center">Views</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {posts.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                    No posts yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            posts.map((post, index) => (
                                                <tr
                                                    key={post.id}
                                                    onClick={() => { setSelectedPost(post); setView('detail'); }}
                                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-gray-500">{posts.length - index}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                                                    <td className="px-6 py-4 text-gray-500">{post.author}</td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">{post.date}</td>
                                                    <td className="px-6 py-4 text-gray-500 text-center">{post.views}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {view === 'write' && (
                        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-xl font-bold mb-6">Write New Post</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="Enter title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg h-64 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="Enter content"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setView('list')}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleWrite}
                                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'detail' && selectedPost && (
                        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-8 border-b border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium mb-4">
                                    <span>{title}</span>
                                    <ChevronRight size={14} />
                                    <span>View</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
                                <div className="flex items-center text-sm text-gray-500 gap-6">
                                    <span className="flex items-center gap-1"><User size={14} /> {selectedPost.author}</span>
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {selectedPost.date}</span>
                                    <span className="flex items-center gap-1"><Eye size={14} /> {selectedPost.views}</span>
                                </div>
                            </div>
                            <div className="p-8 min-h-[300px] prose max-w-none">
                                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{selectedPost.content}</p>
                            </div>
                            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between">
                                <button
                                    onClick={() => setView('list')}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Back to List
                                </button>
                                {(userType === 'admin' || selectedPost.author === 'User') && ( // Simplified permission
                                    <button
                                        onClick={() => handleDelete(selectedPost.id)}
                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
