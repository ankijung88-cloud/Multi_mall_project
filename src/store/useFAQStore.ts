import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
}

interface FAQStore {
    faqs: FAQ[];
    addFAQ: (faq: Omit<FAQ, 'id'>) => void;
    deleteFAQ: (id: string) => void;
}

export const useFAQStore = create<FAQStore>()(
    persist(
        (set) => ({
            faqs: [
                {
                    id: '1',
                    category: 'General',
                    question: 'How do I sign up?',
                    answer: 'You can sign up by clicking the "Sign Up" button in the top right corner.'
                },
                {
                    id: '2',
                    category: 'Account',
                    question: 'I forgot my password.',
                    answer: 'Click "Login" and then "Forgot Password" to reset it via email.'
                }
            ],
            addFAQ: (faq) => set((state) => ({
                faqs: [...state.faqs, { ...faq, id: Math.random().toString(36).substring(7) }]
            })),
            deleteFAQ: (id) => set((state) => ({
                faqs: state.faqs.filter((f) => f.id !== id)
            }))
        }),
        {
            name: 'faq-storage',
        }
    )
);
