import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { ReactNode } from 'react';

export interface Schedule {
    id: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    title: string;
    description: string;
    maxSlots: number;
    currentSlots: number;
    personalPrice?: number;
    companyPrice?: number;
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
    addRequest: (request: Omit<PartnerRequest, 'id' | 'timestamp' | 'status'> & { scheduleId?: string, scheduleTitle?: string, scheduleDate?: string }) => Promise<void>;
    updateRequestStatus: (id: string, status: PartnerRequest['status']) => void;
    deleteRequest: (id: string) => void;
    updateRequest: (id: string, updates: Partial<PartnerRequest>) => void;
    refreshRequests: () => Promise<void>;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);



export function PartnerProvider({ children }: { children: ReactNode }) {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [requests, setRequests] = useState<PartnerRequest[]>([]);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/api/partners/requests');
            setRequests(res.data);
        } catch (err) {
            console.error("Failed to load partner requests:", err);
        }
    };

    useEffect(() => {
        // Load Partners
        axios.get('/api/partners')
            .then(res => setPartners(res.data))
            .catch(err => console.error("Failed to load partners:", err));

        // Load Requests
        fetchRequests();
    }, []);

    const refreshRequests = async () => {
        await fetchRequests();
    };

    const addPartner = async (partnerData: Omit<Partner, 'id'>) => {
        try {
            const res = await axios.post('/api/partners', partnerData);
            setPartners([...partners, res.data]);
        } catch (err) {
            console.error("Failed to add partner:", err);
        }
    };

    const updatePartner = async (id: number, updates: Partial<Omit<Partner, 'id'>>) => {
        try {
            const res = await axios.put(`/api/partners/${id}`, updates);
            setPartners(partners.map(p => p.id === id ? res.data : p));
        } catch (err) {
            console.error("Failed to update partner:", err);
        }
    };

    const deletePartner = async (id: number) => {
        try {
            await axios.delete(`/api/partners/${id}`);
            setPartners(partners.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to delete partner:", err);
        }
    };

    const getPartner = (id: number) => partners.find(p => p.id === id);

    // Updated type definition to allow optional schedule fields for Inquiries
    const addRequest = async (requestData: Omit<PartnerRequest, 'id' | 'timestamp' | 'status'> & { scheduleId?: string, scheduleTitle?: string, scheduleDate?: string }) => {
        const { scheduleId, scheduleTitle, scheduleDate, ...rest } = requestData;

        const newRequestData = {
            scheduleId: scheduleId || '',
            scheduleTitle: scheduleTitle || 'Inquiry',
            scheduleDate: scheduleDate || new Date().toISOString().split('T')[0],
            ...rest,
            partnerId: Number(rest.partnerId), // Ensure partnerId is a Number
            userId: String(rest.userId), // Ensure userId is a String (Schema expects String)
            timestamp: new Date().toISOString(),
            status: 'pending',
        };

        try {
            const res = await axios.post('/api/partners/requests', newRequestData);
            setRequests([...requests, res.data]);
        } catch (err) {
            console.error("Failed to add request:", err);
            throw err; // Re-throw to let compopnent handle UI feedback
        }
    };

    const updateRequestStatus = async (id: string, status: PartnerRequest['status']) => {
        try {
            const res = await axios.put(`/api/partners/requests/${id}`, { status });
            setRequests(requests.map(r => r.id === id ? res.data : r));
        } catch (err) {
            console.error("Failed to update request status:", err);
        }
    };

    const updateRequest = async (id: string, updates: Partial<PartnerRequest>) => {
        try {
            const res = await axios.put(`/api/partners/requests/${id}`, updates);
            setRequests(requests.map(r => r.id === id ? res.data : r));
        } catch (err) {
            console.error("Failed to update request:", err);
        }
    };

    const deleteRequest = async (id: string) => {
        try {
            await axios.delete(`/api/partners/requests/${id}`);
            setRequests(requests.filter(r => r.id !== id));
        } catch (err) {
            console.error("Failed to delete request:", err);
        }
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
            updateRequest,
            refreshRequests
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
