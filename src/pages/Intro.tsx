import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuthStore } from '../store/useAuthStore';
import { Pencil } from 'lucide-react';

export default function Intro() {
    const { userType, adminRole } = useAuthStore();
    const isAdmin = userType === 'admin' && adminRole === 'super';

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';
    const storageKey = isCompany ? 'board_intro_company' : 'board_intro';

    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            setContent(stored);
        } else {
            setContent(isCompany
                ? "# 기업 소개\n\n기업 고객님을 위한 최고의 비즈니스 파트너가 되겠습니다."
                : "# 환영합니다!\n\n저희 쇼핑몰을 방문해주셔서 감사합니다.\n고객님께 최고의 쇼핑 경험을 제공하기 위해 최선을 다하겠습니다.\n\n### 우리의 미션\n가장 좋은 품질의 상품을 합리적인 가격에 제공하는 것입니다.");
        }
    }, [storageKey, isCompany]);

    const handleSave = () => {
        localStorage.setItem(storageKey, content);
        setIsEditing(false);
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{isCompany ? '기업 소개' : '소개'}</h1>
                    {isAdmin && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <Pencil size={20} />
                            <span>수정</span>
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-4">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={20}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="prose max-w-none text-gray-800 whitespace-pre-line bg-white p-8 rounded-xl shadow-sm">
                        {content}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
