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
}

export interface Partner {
    id: number;
    name: string;
    image: string;
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

const initialPartners: Partner[] = [];

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
