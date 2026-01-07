import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuthStore } from '../store/useAuthStore';
import { Pencil } from 'lucide-react';
import clsx from 'clsx';

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
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Hero Section */}
                <div className={clsx(
                    "py-16 mb-12 transition-colors duration-300",
                    isCompany ? "bg-blue-900 text-white" : "bg-gray-900 text-white"
                )}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{isCompany ? '기업 소개' : '소개'}</h1>
                        <p className={clsx("text-xl max-w-2xl mx-auto", isCompany ? "text-blue-200" : "text-gray-300")}>
                            {isCompany ? '비즈니스의 성공을 함께 만들어갑니다.' : '고객님의 라이프스타일을 완성합니다.'}
                        </p>
                        {isAdmin && !isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="absolute right-4 bottom-4 bg-white text-black p-2 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center space-x-2 text-sm font-bold"
                            >
                                <Pencil size={16} />
                                <span>수정</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
            </div>
        </MainLayout>
    );
}
