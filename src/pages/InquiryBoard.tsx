import { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import type { Post } from '../context/BoardContext';
import MainLayout from '../layouts/MainLayout';
import { Plus, Lock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';

export default function InquiryBoard() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';
    const viewMode = isCompany ? 'company' : 'personal';

    const { getPostsByType, addPost } = useBoard();
    const posts = getPostsByType('inquiry', viewMode);

    const [view, setView] = useState<'list' | 'write' | 'detail'>('list');
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [formData, setFormData] = useState({ title: '', content: '', author: '', contactInfo: '', isSecret: true });

    const handleSubmit = () => {
        addPost({
            type: 'inquiry',
            viewMode,
            title: formData.title,
            content: formData.content,
            author: formData.author || 'Anonymous',
            contactInfo: formData.contactInfo,
            isSecret: formData.isSecret,
            status: 'Pending'
        });
        setFormData({ title: '', content: '', author: '', contactInfo: '', isSecret: true });
        setView('list');
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Hero Section */}
                <div className={clsx(
                    "py-16 mb-12 transition-colors duration-300",
                    isCompany ? "bg-blue-900 text-white" : "bg-gray-900 text-white"
                )}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">제휴 문의</h1>
                        <p className={clsx("text-xl max-w-2xl mx-auto", isCompany ? "text-blue-200" : "text-gray-300")}>성공적인 비즈니스를 위한 파트너십을 제안해주세요.</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {view === 'list' && (
                        <>
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={() => setView('write')}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-sm"
                                >
                                    <Plus size={18} /> 문의하기
                                </button>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-700 w-20">No</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700">제목</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700 w-32">작성자</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700 w-32">상태</th>
                                            <th className="px-6 py-4 font-semibold text-gray-700 w-32">작성일</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {posts.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                                    등록된 문의가 없습니다.
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
                                                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                                        {post.isSecret && <Lock size={14} className="text-gray-400" />}
                                                        {post.title}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">{post.author}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${post.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                                            post.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {post.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500 text-sm">{post.date}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {view === 'write' && (
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                            <h2 className="text-xl font-bold mb-6">제휴 문의 작성</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">작성자 / 업체명</label>
                                        <input
                                            type="text"
                                            value={formData.author}
                                            onChange={e => setFormData({ ...formData, author: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">연락처 (이메일/전화번호)</label>
                                        <input
                                            type="text"
                                            value={formData.contactInfo}
                                            onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 border rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="secret"
                                        checked={formData.isSecret}
                                        onChange={e => setFormData({ ...formData, isSecret: e.target.checked })}
                                        className="mr-2"
                                    />
                                    <label htmlFor="secret" className="text-sm text-gray-600">비밀글 설정 (관리자와 작성자만 볼 수 있습니다)</label>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setView('list')}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        문의 등록
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'detail' && selectedPost && (
                        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold mb-4">{selectedPost.title}</h2>
                            <div className="flex gap-4 text-sm text-gray-500 mb-8 pb-4 border-b">
                                <span>작성자: {selectedPost.author}</span>
                                <span>날짜: {selectedPost.date}</span>
                                <span>상태: {selectedPost.status}</span>
                            </div>
                            <div className="whitespace-pre-wrap min-h-[200px]">
                                {selectedPost.content}
                            </div>
                            <div className="mt-8 pt-6 border-t flex justify-end">
                                <button
                                    onClick={() => setView('list')}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                                >
                                    목록으로
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
