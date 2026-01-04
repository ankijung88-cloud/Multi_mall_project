import { useParams, useNavigate } from 'react-router-dom';
import { useFreelancers } from '../context/FreelancerContext';
import { useAuthStore } from '../store/useAuthStore';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function PersonalContentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { freelancers, addRequest, requests } = useFreelancers();
    const { isAuthenticated, user } = useAuthStore();
    const [message, setMessage] = useState('');

    const freelancer = freelancers.find(f => f.id === id);

    if (!freelancer) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Contents Not Found</h2>
                        <button onClick={() => navigate('/personal')} className="mt-4 text-blue-600 hover:underline">Go Back</button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const hasPendingRequest = isAuthenticated && requests.some(r => r.freelancerId === id && r.userId === String(user?.id) && r.status === 'Pending');

    const handleContact = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            if (window.confirm('로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?')) {
                navigate('/login?type=personal', { state: { from: `/contents/${id}` } });
            }
            return;
        }

        if (!message.trim()) {
            alert('메시지를 입력해주세요.');
            return;
        }

        addRequest({
            freelancerId: freelancer.id,
            freelancerName: freelancer.name,
            userId: String(user.id),
            userName: user.name,
            message: message
        });

        alert('참여 신청이 완료되었습니다. 관리자가 확인 후 연락드리겠습니다.');
        setMessage('');
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pb-20">
                {/* Header Image */}
                <div className="relative h-[400px]">
                    <img
                        src={freelancer.image}
                        alt={freelancer.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute top-0 left-0 p-6 z-10 w-full">
                        <button
                            onClick={() => navigate('/personal')}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Home
                        </button>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="max-w-7xl mx-auto">
                            <span className="inline-block px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full mb-3">
                                {freelancer.title}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{freelancer.name}</h1>
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">About the Creator</h2>
                                <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                                    {freelancer.description}
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Portfolio</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {freelancer.portfolioImages.map((img, idx) => (
                                        <div key={idx} className="aspect-video rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                            <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar / Contact Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <MessageCircle className="text-orange-500" />
                                    Contact & Request
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    이 전문가와 함께하고 싶으신가요? 메시지를 남겨주세요.
                                </p>

                                {hasPendingRequest ? (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <MessageCircle size={24} />
                                        </div>
                                        <h4 className="font-bold text-green-800 mb-1">신청 완료!</h4>
                                        <p className="text-sm text-green-600">
                                            이미 참여 신청을 하셨습니다.<br />
                                            관리자 검토 후 연락드리겠습니다.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleContact} className="space-y-4">
                                        {!isAuthenticated && (
                                            <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-sm text-blue-700 mb-2">
                                                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                                <p>로그인 후 신청할 수 있습니다.</p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">메시지</label>
                                            <textarea
                                                required
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none"
                                                placeholder="안녕하세요, 홈 스타일링 견적 문의드립니다..."
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95"
                                        >
                                            신청하기 (Send Request)
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </MainLayout>
    );
}
