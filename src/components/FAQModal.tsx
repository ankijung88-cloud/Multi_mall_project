import { useState } from 'react';
import { X, Plus, ChevronDown, ChevronUp, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFAQStore } from '../store/useFAQStore';
import { useAuthStore } from '../store/useAuthStore';

interface FAQModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FAQModal({ isOpen, onClose }: FAQModalProps) {
    const { faqs, addFAQ, deleteFAQ } = useFAQStore();
    const { userType } = useAuthStore();
    const isAdmin = userType === 'admin';

    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', category: 'General' });

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addFAQ(newFAQ);
        setIsAdding(false);
        setNewFAQ({ question: '', answer: '', category: 'General' });
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
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col pointer-events-auto"
                >
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <h2 className="text-xl font-bold font-korean text-gray-800">자주 묻는 질문 (FAQ)</h2>
                        <div className="flex gap-2">
                            {isAdmin && (
                                <button
                                    onClick={() => setIsAdding(!isAdding)}
                                    className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full font-bold hover:bg-blue-100 transition-colors"
                                >
                                    <Plus size={14} /> Admin Add
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {isAdding && (
                            <motion.form
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="bg-gray-50 p-4 rounded-xl border border-blue-100 mb-6 space-y-3"
                                onSubmit={handleAdd}
                            >
                                <input
                                    placeholder="질문 (Question)"
                                    required
                                    value={newFAQ.question}
                                    onChange={e => setNewFAQ({ ...newFAQ, question: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                />
                                <textarea
                                    placeholder="답변 (Answer)"
                                    required
                                    rows={3}
                                    value={newFAQ.answer}
                                    onChange={e => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsAdding(false)}
                                        className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white text-xs px-4 py-1.5 rounded-lg font-bold hover:bg-blue-700"
                                    >
                                        Save FAQ
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {faqs.length === 0 ? (
                            <p className="text-center text-gray-400 py-10">등록된 FAQ가 없습니다.</p>
                        ) : (
                            faqs.map((faq) => (
                                <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === faq.id ? null : faq.id)}
                                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <span className="font-bold text-gray-800 text-sm">
                                            <span className="text-hanbok-jade mr-2">Q.</span>
                                            {faq.question}
                                        </span>
                                        {openIndex === faq.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {openIndex === faq.id && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden bg-gray-50"
                                            >
                                                <div className="p-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 flex justify-between gap-4">
                                                    <div>
                                                        <span className="font-bold text-gray-400 mr-2">A.</span>
                                                        {faq.answer}
                                                    </div>
                                                    {isAdmin && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm('Delete this FAQ?')) deleteFAQ(faq.id);
                                                            }}
                                                            className="text-gray-300 hover:text-red-500 self-start"
                                                        >
                                                            <Trash size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
