import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Schedule {
    id: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    title: string;
    description: string;
    maxSlots: number;
    currentSlots: number;
    pricePersonal?: number;
    priceCompany?: number;
    detailImage?: string; // Detailed image for the schedule page
}

export interface Partner {
    id: number;
    name: string;
    image: string;
    detailImage?: string; // New: Partner specific detail/intro image
    description: string;
    category?: string;
    schedules: Schedule[];
    credentials?: {
        username: string;
        password: string;
    };
}

export interface PartnerRequest {
    id: string;
    partnerId: number;
    partnerName: string;
    userId: string;
    userName: string;
    scheduleId: string;
    scheduleTitle: string;
    scheduleDate: string;
    status: 'pending' | 'approved' | 'sent_to_partner' | 'confirmation_sent';
    timestamp: string;
    paymentStatus?: 'pending' | 'paid';
    paymentAmount?: number;
    paymentDate?: string;
    paymentMethod?: string;
    userType?: 'Personal' | 'Company';
    inquiryContent?: string; // New field for inquiry
    contact?: string; // New field for user contact
}

interface PartnerContextType {
    partners: Partner[];
    requests: PartnerRequest[];
    addPartner: (partner: Omit<Partner, 'id'>) => void;
    updatePartner: (id: number, updates: Partial<Omit<Partner, 'id'>>) => void;
    deletePartner: (id: number) => void;
    getPartner: (id: number) => Partner | undefined;
    addRequest: (request: Omit<PartnerRequest, 'id' | 'timestamp' | 'status'> & { scheduleId?: string, scheduleTitle?: string, scheduleDate?: string }) => void;
    updateRequestStatus: (id: string, status: PartnerRequest['status']) => void;
    deleteRequest: (id: string) => void;
    updateRequest: (id: string, updates: Partial<PartnerRequest>) => void;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

const initialPartners: Partner[] = [
    {
        id: 101,
        name: 'Gagnam Beauty Center',
        image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd4788?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        description: 'Premium K-Beauty & Plastic Surgery Consultation Center. Experience the best of Korean beauty services with our expert team.',
        category: '뷰티 & 성형',
        schedules: [
            {
                id: 's1',
                date: '2024-03-20',
                time: '14:00',
                title: 'VIP Consultation',
                description: '1:1 Private Consultation with Chief Surgeon',
                maxSlots: 5,
                currentSlots: 2,
                pricePersonal: 50000,
                priceCompany: 100000
            }
        ]
    }
];

export function PartnerProvider({ children }: { children: ReactNode }) {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [requests, setRequests] = useState<PartnerRequest[]>([]);

    useEffect(() => {
        const storedPartners = localStorage.getItem('mall_partners');
        let currentPartners: Partner[] = [];

        if (storedPartners) {
            try {
                const parsed = JSON.parse(storedPartners);
                if (Array.isArray(parsed)) {
                    currentPartners = parsed;
                }
            } catch (e) {
                console.error("Failed to parse partners, resetting.");
            }
        }

        // Merge logic: ensure initialPartners exist and have up-to-date static data (like category)
        const updatedPartners = [...currentPartners];
        let hasChanges = false;

        initialPartners.forEach(initP => {
            const index = updatedPartners.findIndex(p => p.id === initP.id);
            if (index !== -1) {
                // Partner exists, check if category is missing or different
                if (updatedPartners[index].category !== initP.category) {
                    updatedPartners[index] = { ...updatedPartners[index], category: initP.category };
                    hasChanges = true;
                }
            } else {
                // Partner missing, add it
                updatedPartners.push(initP);
                hasChanges = true;
            }
        });

        // Ensure pricing fields migration and category trimming
        const migrated = updatedPartners.map((p: Partner) => ({
            ...p,
            category: p.category ? p.category.trim() : undefined,
            schedules: p.schedules.map((s: Schedule) => ({
                ...s,
                pricePersonal: s.pricePersonal !== undefined ? s.pricePersonal : 30000,
                priceCompany: s.priceCompany !== undefined ? s.priceCompany : 50000
            }))
        }));

        if (JSON.stringify(migrated) !== JSON.stringify(updatedPartners)) {
            hasChanges = true;
        }

        if (currentPartners.length === 0 || hasChanges) {
            setPartners(migrated);
            localStorage.setItem('mall_partners', JSON.stringify(migrated));
        } else {
            setPartners(currentPartners);
        }


        const storedRequests = localStorage.getItem('mall_partner_requests');
        if (storedRequests) {
            try {
                const parsed = JSON.parse(storedRequests);
                if (Array.isArray(parsed)) {
                    setRequests(parsed);
                } else {
                    setRequests([]);
                }
            } catch (e) {
                setRequests([]);
            }
        }
    }, []);

    const savePartners = (newPartners: Partner[]) => {
        setPartners(newPartners);
        localStorage.setItem('mall_partners', JSON.stringify(newPartners));
    };

    const saveRequests = (newRequests: PartnerRequest[]) => {
        setRequests(newRequests);
        localStorage.setItem('mall_partner_requests', JSON.stringify(newRequests));
    };

    const addPartner = (partnerData: Omit<Partner, 'id'>) => {
        const newId = partners.length > 0 ? Math.max(...partners.map(p => p.id)) + 1 : 1;
        savePartners([...partners, { ...partnerData, id: newId }]);
    };

    const updatePartner = (id: number, updates: Partial<Omit<Partner, 'id'>>) => {
        savePartners(partners.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePartner = (id: number) => {
        savePartners(partners.filter(p => p.id !== id));
    };

    const getPartner = (id: number) => partners.find(p => p.id === id);

    // Updated type definition to allow optional schedule fields for Inquiries
    const addRequest = (requestData: Omit<PartnerRequest, 'id' | 'timestamp' | 'status'> & { scheduleId?: string, scheduleTitle?: string, scheduleDate?: string }) => {
        const { scheduleId, scheduleTitle, scheduleDate, ...rest } = requestData;

        const newRequest: PartnerRequest = {
            scheduleId: scheduleId || '',
            scheduleTitle: scheduleTitle || 'Inquiry',
            scheduleDate: scheduleDate || new Date().toISOString().split('T')[0],
            ...rest,
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            timestamp: new Date().toISOString(),
            status: 'pending',
        } as PartnerRequest;
        saveRequests([...requests, newRequest]);
    };

    const updateRequestStatus = (id: string, status: PartnerRequest['status']) => {
        saveRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    };

    const updateRequest = (id: string, updates: Partial<PartnerRequest>) => {
        saveRequests(requests.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const deleteRequest = (id: string) => {
        saveRequests(requests.filter(r => r.id !== id));
    };

    return (
        <PartnerContext.Provider value={{
            partners,
            requests,
            addPartner,
            updatePartner,
            deletePartner,
            getPartner,
            addRequest,
            updateRequestStatus,
            deleteRequest,
            updateRequest
        }}>
            {children}
        </PartnerContext.Provider>
    );
}

export function usePartners() {
    const context = useContext(PartnerContext);
    if (context === undefined) {
        throw new Error('usePartners must be used within a PartnerProvider');
    }
    return context;
}
