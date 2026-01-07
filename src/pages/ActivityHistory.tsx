import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { motion } from 'framer-motion';
import { X, FileText, User } from 'lucide-react';

// Mock Data for "Activity History" (Resumes)
const mockHistories = [
    {
        id: 1,
        name: '안기정',
        role: 'UX Designer',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        summary: '사용자 경험을 최우선으로 생각하는 5년차 UX 디자이너입니다.',
        details: '경력:\n- A사 UX 디자이너 (2020~2024)\n- B사 인턴 (2019)\n\n기술:\n- Figma, Protopie, Adobe CC'
    },
    {
        id: 2,
        name: '김철수',
        role: 'Frontend Dev',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
        summary: 'React와 Vue를 다루는 프론트엔드 개발자입니다.',
        details: '경력:\n- C사 프론트엔드 리드 (2021~Present)\n\n기술:\n- React, Next.js, TailwindCSS'
    },
    // Add more dummies to test grid wrap
    { id: 3, name: '이영희', role: 'Marketer', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', summary: '데이터 기반 퍼포먼스 마케터', details: '...' },
    { id: 4, name: '박준형', role: 'Video Editor', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', summary: '감각적인 영상 편집자', details: '...' },
    { id: 5, name: '최수민', role: 'Content Writer', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', summary: '스토리텔링이 강점인 작가', details: '...' },
];


export default function ActivityHistory() {
    const [selectedHistory, setSelectedHistory] = useState<typeof mockHistories[0] | null>(null);

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-purple-600 font-semibold tracking-wide uppercase text-sm">Activities</span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-2">활동 내역</h1>
                        <p className="text-gray-500 mt-2">나의 활동 이력과 프로필을 관리합니다.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {mockHistories.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-visible mt-8 border border-gray-100 relative group"
                                onClick={() => setSelectedHistory(item)}
                            >
                                {/* Circular Profile Frame */}
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                                    <div className="w-24 h-24 rounded-full p-1 bg-white shadow-md group-hover:scale-110 transition-transform duration-300">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full rounded-full object-cover border-2 border-purple-100"
                                        />
                                    </div>
                                </div>

                                <div className="pt-16 pb-6 px-6 text-center">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                                    <p className="text-purple-600 text-sm font-medium mb-4">{item.role}</p>
                                    <p className="text-gray-500 text-sm line-clamp-2">{item.summary}</p>

                                    <div className="mt-6 pt-4 border-t border-gray-100">
                                        <button className="text-gray-400 text-sm group-hover:text-purple-600 transition-colors flex items-center justify-center gap-1 mx-auto">
                                            <FileText size={16} /> 이력서 보기
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Resume Modal */}
                {selectedHistory && (
                    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setSelectedHistory(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="bg-purple-600 p-6 text-white relative">
                                <button
                                    onClick={() => setSelectedHistory(null)}
                                    className="absolute top-4 right-4 text-white/80 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={selectedHistory.image}
                                        alt={selectedHistory.name}
                                        className="w-16 h-16 rounded-full border-2 border-white/30"
                                    />
                                    <div>
                                        <h2 className="text-2xl font-bold">{selectedHistory.name}</h2>
                                        <p className="text-purple-200">{selectedHistory.role}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="mb-6">
                                    <h3 className="text-gray-900 font-bold mb-2 flex items-center gap-2">
                                        <User size={18} className="text-purple-600" />
                                        자기 소개
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                        {selectedHistory.summary}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-gray-900 font-bold mb-2 flex items-center gap-2">
                                        <FileText size={18} className="text-purple-600" />
                                        상세 이력
                                    </h3>
                                    <div className="text-gray-600 text-sm whitespace-pre-line leading-relaxed border-l-2 border-purple-200 pl-4">
                                        {selectedHistory.details}
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t flex justify-end">
                                    <button
                                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                        onClick={() => setSelectedHistory(null)}
                                    >
                                        닫기
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
