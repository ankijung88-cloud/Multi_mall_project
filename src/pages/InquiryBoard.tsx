import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { usePartners } from '../context/PartnerContext';

const InquiryBoard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('alliance'); // alliance, marketing, other

    const { addRequest } = usePartners(); // Import addRequest

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login?type=company');
            return;
        }

        try {
            await addRequest({
                partnerId: 0, // 0 for System/General Inquiry
                partnerName: 'System (Inquiry)',
                userId: String(user.id),
                userName: user.name || user.email || 'Anonymous',
                scheduleId: `inquiry-${Date.now()}`,
                scheduleTitle: 'Partnership Inquiry', // Key tagging for filtering
                scheduleDate: new Date().toISOString().split('T')[0],
                inquiryContent: `[${category}] ${title}\n\n${content}`,
                contact: user.email,
                paymentStatus: 'pending',
                paymentAmount: 0,
                userType: 'Company'
            });
            alert('제휴 문의가 접수되었습니다.\n담당자 검토 후 연락드리겠습니다.');
            setTitle('');
            setContent('');
            setCategory('alliance');
            navigate('/'); // Redirect to home or stay? User usually expects redirect or clear. Stay is fine with alert.
        } catch (error) {
            console.error('Inquiry Error:', error);
            alert('문의 접수 중 오류가 발생했습니다.');
        }
    };

    return (
        <MainLayout>
            <div className="bg-white min-h-screen py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">제휴 문의</h1>
                        <p className="text-gray-600">
                            K-Culture 파트너스와 함께 성장할 기업을 찾습니다.<br />
                            비즈니스 제휴, 마케팅 협력 등 다양한 제안을 기다립니다.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 shadow-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    문의 유형
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                >
                                    <option value="alliance">비즈니스 제휴</option>
                                    <option value="marketing">마케팅 협력</option>
                                    <option value="store">입점 문의</option>
                                    <option value="other">기타</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    제목
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="제안서 제목을 입력해주세요"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    문의 내용
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="구체적인 제안 내용을 작성해주세요"
                                    rows={10}
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md"
                                >
                                    문의하기
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-blue-50 rounded-xl">
                            <div className="text-2xl mb-2">📞</div>
                            <h3 className="font-bold text-gray-900 mb-1">전화 문의</h3>
                            <p className="text-gray-600 text-sm">02-1234-5678</p>
                            <p className="text-gray-500 text-xs mt-1">(평일 09:00 - 18:00)</p>
                        </div>
                        <div className="text-center p-6 bg-blue-50 rounded-xl">
                            <div className="text-2xl mb-2">📧</div>
                            <h3 className="font-bold text-gray-900 mb-1">이메일 문의</h3>
                            <p className="text-gray-600 text-sm">partnership@multimall.com</p>
                        </div>
                        <div className="text-center p-6 bg-blue-50 rounded-xl">
                            <div className="text-2xl mb-2">🏢</div>
                            <h3 className="font-bold text-gray-900 mb-1">방문 상담</h3>
                            <p className="text-gray-600 text-sm">서울시 강남구 테헤란로 123</p>
                            <p className="text-gray-500 text-xs mt-1">(사전 예약 필수)</p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default InquiryBoard;
