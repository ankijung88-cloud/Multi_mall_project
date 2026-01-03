import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface AgentSchedule {
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

export interface Agent {
    id: number;
    name: string;
    image: string;
    description: string;
    schedules: AgentSchedule[];
    credentials?: {
        username: string;
        password: string;
    };
}

export interface AgentRequest {
    id: string;
    agentId: number;
    agentName: string;
    userId: string;
    userName: string;
    scheduleId: string;
    scheduleTitle: string;
    scheduleDate: string;
    status: 'pending' | 'approved' | 'sent_to_agent' | 'confirmation_sent';
    timestamp: string;
    paymentStatus?: 'pending' | 'paid';
    paymentAmount?: number;
    paymentDate?: string;
    paymentMethod?: string;
    userType?: 'Personal' | 'Company';
}

interface AgentContextType {
    agents: Agent[];
    requests: AgentRequest[];
    addAgent: (agent: Omit<Agent, 'id'>) => void;
    updateAgent: (id: number, updates: Partial<Omit<Agent, 'id'>>) => void;
    deleteAgent: (id: number) => void;
    getAgent: (id: number) => Agent | undefined;
    addRequest: (request: Omit<AgentRequest, 'id' | 'timestamp' | 'status'>) => void;
    updateRequestStatus: (id: string, status: AgentRequest['status']) => void;
    deleteRequest: (id: string) => void;
    updateRequest: (id: string, updates: Partial<AgentRequest>) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const initialAgents: Agent[] = [
    {
        id: 1,
        name: "Top Agent Kim",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000",
        description: "Professional Real Estate Agent.",
        schedules: [
            { id: 'S1', date: '2026-02-10', time: '10:00', title: 'Consultation', description: 'Real Estate Consultation', maxSlots: 5, currentSlots: 0, pricePersonal: 100000, priceCompany: 150000 }
        ],
        credentials: { username: 'agentkim', password: 'password' }
    }
];

export function AgentProvider({ children }: { children: ReactNode }) {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [requests, setRequests] = useState<AgentRequest[]>([]);

    useEffect(() => {
        const storedAgents = localStorage.getItem('mall_agents');
        if (storedAgents) {
            try {
                const parsed = JSON.parse(storedAgents);
                if (Array.isArray(parsed)) {
                    // Migration: Ensure pricing fields exist
                    const migrated = parsed.map((a: Agent) => ({
                        ...a,
                        schedules: a.schedules.map((s: AgentSchedule) => ({
                            ...s,
                            pricePersonal: s.pricePersonal !== undefined ? s.pricePersonal : 30000,
                            priceCompany: s.priceCompany !== undefined ? s.priceCompany : 50000
                        }))
                    }));
                    setAgents(migrated);
                } else {
                    console.error("Invalid agents data in localStorage, resetting.");
                    setAgents(initialAgents);
                    localStorage.setItem('mall_agents', JSON.stringify(initialAgents));
                }
            } catch (e) {
                console.error("Failed to parse agents data, resetting.", e);
                setAgents(initialAgents);
                localStorage.setItem('mall_agents', JSON.stringify(initialAgents));
            }
        } else {
            setAgents(initialAgents);
            localStorage.setItem('mall_agents', JSON.stringify(initialAgents));
        }

        const storedRequests = localStorage.getItem('mall_agent_requests');
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

    const saveAgents = (newAgents: Agent[]) => {
        setAgents(newAgents);
        localStorage.setItem('mall_agents', JSON.stringify(newAgents));
    };

    const saveRequests = (newRequests: AgentRequest[]) => {
        setRequests(newRequests);
        localStorage.setItem('mall_agent_requests', JSON.stringify(newRequests));
    };

    const addAgent = (agentData: Omit<Agent, 'id'>) => {
        const newId = agents.length > 0 ? Math.max(...agents.map(p => p.id)) + 1 : 1;
        saveAgents([...agents, { ...agentData, id: newId }]);
    };

    const updateAgent = (id: number, updates: Partial<Omit<Agent, 'id'>>) => {
        saveAgents(agents.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteAgent = (id: number) => {
        saveAgents(agents.filter(p => p.id !== id));
    };

    const getAgent = (id: number) => agents.find(p => p.id === id);

    const addRequest = (requestData: Omit<AgentRequest, 'id' | 'timestamp' | 'status'>) => {
        const newRequest: AgentRequest = {
            ...requestData,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        saveRequests([...requests, newRequest]);
    };

    const updateRequestStatus = (id: string, status: AgentRequest['status']) => {
        saveRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    };

    const updateRequest = (id: string, updates: Partial<AgentRequest>) => {
        saveRequests(requests.map(r => r.id === id ? { ...r, ...updates } : r));
    };

    const deleteRequest = (id: string) => {
        saveRequests(requests.filter(r => r.id !== id));
    };

    return (
        <AgentContext.Provider value={{
            agents,
            requests,
            addAgent,
            updateAgent,
            deleteAgent,
            getAgent,
            addRequest,
            updateRequestStatus,
            deleteRequest,
            updateRequest
        }}>
            {children}
        </AgentContext.Provider>
    );
}

export function useAgents() {
    const context = useContext(AgentContext);
    if (context === undefined) {
        throw new Error('useAgents must be used within a AgentProvider');
    }
    return context;
}
