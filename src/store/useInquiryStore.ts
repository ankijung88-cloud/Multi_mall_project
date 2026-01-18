import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Inquiry {
    id: string;
    type: 'General' | 'Partnership' | 'Account' | 'Other';
    author: string; // Name
    email: string;
    content: string;
    date: string;
    status: 'Pending' | 'Answered';
    userType: 'Personal' | 'Company';
}

interface InquiryStore {
    inquiries: Inquiry[];
    addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => void;
    deleteInquiry: (id: string) => void;
    updateStatus: (id: string, status: 'Pending' | 'Answered') => void;
}

export const useInquiryStore = create<InquiryStore>()(
    persist(
        (set) => ({
            inquiries: [],
            addInquiry: (inquiry) => set((state) => ({
                inquiries: [
                    {
                        ...inquiry,
                        id: Math.random().toString(36).substring(7),
                        date: new Date().toISOString(),
                        status: 'Pending'
                    },
                    ...state.inquiries
                ]
            })),
            deleteInquiry: (id) => set((state) => ({
                inquiries: state.inquiries.filter((i) => i.id !== id)
            })),
            updateStatus: (id, status) => set((state) => ({
                inquiries: state.inquiries.map((i) =>
                    i.id === id ? { ...i, status } : i
                )
            }))
        }),
        {
            name: 'inquiry-storage',
        }
    )
);
