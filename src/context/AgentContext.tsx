import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { ReactNode } from 'react';

export interface AgentSchedule {
    id: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    title: string;
    description: string;
    maxSlots: number;
    currentSlots: number;
    personalPrice?: number;
    companyPrice?: number;
    isAvailable?: boolean;
}

export interface Agent {
    id: number;
    name: string;
    image: string;
    detailImages?: string[]; // Parsed from JSON
    description: string;
    schedules: AgentSchedule[];
    defaultPersonalPrice?: number;
    defaultCompanyPrice?: number;
    credentials?: {
        username: string;
        password: string;
    };
}

export interface AgentRequest {
    id: string;
    agentId: number;
    agentName?: string; // Optional (frontend convenience)
    userId: string;
    userName: string;
    date: string;       // YYYY-MM-DD
    time: string;       // HH:MM
    flightInfo?: string;
    content?: string;
    status: 'pending' | 'approved' | 'sent_to_agent' | 'confirmation_sent' | 'paid' | 'confirmed';
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

export function AgentProvider({ children }: { children: ReactNode }) {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [requests, setRequests] = useState<AgentRequest[]>([]);

    useEffect(() => {
        // Load Agents
        // Load Agents
        axios.get('/api/agents')
            .then(res => setAgents(res.data))
            .catch(err => console.error("Failed to load agents:", err));

        // Load Requests & Poll
        const fetchRequests = () => {
            axios.get('/api/agents/requests')
                .then(res => setRequests(res.data))
                .catch(err => console.error("Failed to load agent requests:", err));
        };

        fetchRequests(); // Initial fetch
        const intervalId = setInterval(fetchRequests, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId); // Cleanup
    }, []);


    const addAgent = async (agentData: Omit<Agent, 'id'>) => {
        try {
            const res = await axios.post('/api/agents', agentData);
            setAgents([...agents, res.data]);
        } catch (err) {
            console.error("Failed to add agent:", err);
        }
    };

    const updateAgent = async (id: number, updates: Partial<Omit<Agent, 'id'>>) => {
        try {
            const res = await axios.put(`/api/agents/${id}`, updates);
            setAgents(agents.map(p => p.id === id ? res.data : p));
        } catch (err) {
            console.error("Failed to update agent:", err);
        }
    };

    const deleteAgent = async (id: number) => {
        try {
            await axios.delete(`/api/agents/${id}`);
            setAgents(agents.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to delete agent:", err);
        }
    };

    const getAgent = (id: number) => agents.find(p => p.id === id);

    const addRequest = async (requestData: Omit<AgentRequest, 'id' | 'timestamp' | 'status'>) => {
        const newRequestData = {
            ...requestData,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        try {
            const res = await axios.post('/api/agents/requests', newRequestData);
            setRequests([...requests, res.data]);
        } catch (err) {
            console.error("Failed to add request:", err);
            throw err;
        }
    };

    const updateRequestStatus = async (id: string, status: AgentRequest['status']) => {
        try {
            const res = await axios.put(`/api/agents/requests/${id}`, { status });
            setRequests(requests.map(r => r.id === id ? res.data : r));
        } catch (err) {
            console.error("Failed to update request status:", err);
        }
    };

    const updateRequest = async (id: string, updates: Partial<AgentRequest>) => {
        try {
            const res = await axios.put(`/api/agents/requests/${id}`, updates);
            setRequests(requests.map(r => r.id === id ? res.data : r));
        } catch (err) {
            console.error("Failed to update request:", err);
        }
    };

    const deleteRequest = async (id: string) => {
        try {
            await axios.delete(`/api/agents/requests/${id}`);
            setRequests(requests.filter(r => r.id !== id));
        } catch (err) {
            console.error("Failed to delete request:", err);
        }
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
