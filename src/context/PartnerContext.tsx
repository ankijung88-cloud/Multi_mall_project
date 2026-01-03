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
}

export interface Partner {
    id: number;
    name: string;
    image: string;
    description: string;
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
    status: 'pending' | 'approved' | 'sent_to_partner';
    timestamp: string;
}

interface PartnerContextType {
    partners: Partner[];
    requests: PartnerRequest[];
    addPartner: (partner: Omit<Partner, 'id'>) => void;
    updatePartner: (id: number, updates: Partial<Omit<Partner, 'id'>>) => void;
    deletePartner: (id: number) => void;
    getPartner: (id: number) => Partner | undefined;
    addRequest: (request: Omit<PartnerRequest, 'id' | 'timestamp' | 'status'>) => void;
    updateRequestStatus: (id: string, status: PartnerRequest['status']) => void;
    deleteRequest: (id: string) => void;
    updateRequest: (id: string, updates: Partial<PartnerRequest>) => void;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

const initialPartners: Partner[] = [
    {
        id: 1,
        name: "K-Food Academy",
        image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1000",
        description: "Experience authentic Korean cooking classes.",
        schedules: [
            { id: 'S1', date: '2026-02-10', time: '10:00', title: 'Kimchi Making Class', description: 'Learn to make Kimchi', maxSlots: 10, currentSlots: 0 },
            { id: 'S2', date: '2026-02-15', time: '14:00', title: 'Bibimbap Workshop', description: 'Healthy Bibimbap', maxSlots: 15, currentSlots: 2 }
        ],
        credentials: { username: 'kfood', password: 'password' }
    },
    {
        id: 2,
        name: "Hanbok Studio",
        image: "https://images.unsplash.com/photo-1610660471578-8ba943513db3?auto=format&fit=crop&q=80&w=1000",
        description: "Traditional Korean clothing experience and photoshoot.",
        schedules: [],
        credentials: { username: 'hanbok', password: 'password' }
    }
];

export function PartnerProvider({ children }: { children: ReactNode }) {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [requests, setRequests] = useState<PartnerRequest[]>([]);

    useEffect(() => {
        const storedPartners = localStorage.getItem('mall_partners');
        if (storedPartners) {
            try {
                const parsed = JSON.parse(storedPartners);
                if (Array.isArray(parsed)) {
                    setPartners(parsed);
                } else {
                    console.error("Invalid partners data in localStorage, resetting.");
                    setPartners(initialPartners);
                    localStorage.setItem('mall_partners', JSON.stringify(initialPartners));
                }
            } catch (e) {
                console.error("Failed to parse partners data, resetting.", e);
                setPartners(initialPartners);
                localStorage.setItem('mall_partners', JSON.stringify(initialPartners));
            }
        } else {
            setPartners(initialPartners);
            localStorage.setItem('mall_partners', JSON.stringify(initialPartners));
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

    const addRequest = (requestData: Omit<PartnerRequest, 'id' | 'timestamp' | 'status'>) => {
        const newRequest: PartnerRequest = {
            ...requestData,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
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
