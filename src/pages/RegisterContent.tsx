import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useFreelancers } from '../context/FreelancerContext';
import { useAuthStore } from '../store/useAuthStore';

export default function RegisterContent() {
    const navigate = useNavigate();
    const { addFreelancer } = useFreelancers();
    const { user } = useAuthStore();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        title: '',
        description: '',
        image: '',
        portfolioImages: ['', '']
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.title || !formData.description) {
            alert('필수 정보를 입력해주세요.');
            return;
        }

        addFreelancer({
            name: formData.name,
            title: formData.title,
            description: formData.description,
            image: formData.image || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=1000', // Default placeholder
            portfolioImages: formData.portfolioImages.filter(img => img !== ''),
            authorId: String(user?.id)
        });

        alert('컨텐츠가 등록되었습니다.');
        navigate('/contents/my');
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h1 className="text-2xl font-bold mb-6">컨텐츠 등록</h1>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Author Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">작성자 이름 (활동명)</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">컨텐츠 제목 (전문 분야)</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="예: 홈 스타일링 전문가, 퍼스널 트레이너"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">소개 / 설명</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={5}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="본인의 서비스나 컨텐츠에 대해 자세히 소개해주세요."
                                />
                            </div>

                            {/* Main Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지 URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="https://"
                                />
                                <p className="text-xs text-gray-500 mt-1">프로필이나 대표 이미지를 입력하세요.</p>
                            </div>

                            {/* Portfolio Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">포트폴리오 이미지 URL (선택)</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={formData.portfolioImages[0]}
                                        onChange={e => {
                                            const newImages = [...formData.portfolioImages];
                                            newImages[0] = e.target.value;
                                            setFormData({ ...formData, portfolioImages: newImages });
                                        }}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="Image URL 1"
                                    />
                                    <input
                                        type="text"
                                        value={formData.portfolioImages[1]}
                                        onChange={e => {
                                            const newImages = [...formData.portfolioImages];
                                            newImages[1] = e.target.value;
                                            setFormData({ ...formData, portfolioImages: newImages });
                                        }}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="Image URL 2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md"
                                >
                                    등록하기
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
