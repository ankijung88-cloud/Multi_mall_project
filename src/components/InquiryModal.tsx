import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInquiryStore } from '../store/useInquiryStore';

interface InquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
    const { addInquiry } = useInquiryStore();
    const [formData, setFormData] = useState<{
        author: string;
        email: string;
        type: 'General' | 'Partnership' | 'Account' | 'Other';
        content: string;
        userType: 'Personal' | 'Company';
    }>({
        author: '',
        email: '',
        type: 'General',
        content: '',
        userType: 'Personal'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addInquiry(formData);
        alert('문의가 접수되었습니다. (Inquiry Submitted)');
        setFormData({ author: '', email: '', type: 'General', content: '', userType: 'Personal' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col pointer-events-auto"
                >
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <h2 className="text-xl font-bold font-korean text-gray-800">1:1 문의하기</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">이름 (Name)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.author}
                                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hanbok-jade focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">유형 (Type)</label>
                                <select
                                    value={formData.userType}
                                    onChange={e => setFormData({ ...formData, userType: e.target.value as 'Personal' | 'Company' })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hanbok-jade"
                                >
                                    <option value="Personal">개인 (Personal)</option>
                                    <option value="Company">기업 (Company)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">이메일 (Email)</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hanbok-jade focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">문의 제목 (Subject)</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hanbok-jade"
                            >
                                <option value="General">일반 문의 (General)</option>
                                <option value="Partnership">제휴 문의 (Partnership)</option>
                                <option value="Account">계정 문의 (Account)</option>
                                <option value="Other">기타 (Other)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">문의 내용 (Content)</label>
                            <textarea
                                required
                                rows={5}
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-hanbok-jade focus:border-transparent resize-none"
                                placeholder="문의하실 내용을 자세히 적어주세요."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            문의 접수 (Submit)
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
