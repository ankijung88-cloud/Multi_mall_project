import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

export interface Freelancer {
    id: string;
    name: string;
    title: string;
    image: string;
    description: string;
    portfolioImages: string[];
    authorId?: string; // ID of the user who created this content
    credentials?: {
        username: string;
        password: string;
    };
}

export interface ContentRequest {
    id: string;
    freelancerId: string;
    freelancerName: string;
    userId: string | 'guest'; // specific user or guest
    userName?: string;
    contactInfo?: string; // Phone or Email
    message: string;
    requesterType: 'personal' | 'company' | 'admin' | 'guest'; // Type of user making request
    status: 'Pending' | 'Approved' | 'Rejected' | 'Paid';
    date: string;
}

interface Favorite {
    userId: string;
    contentId: string;
}

interface FreelancerContextType {
    freelancers: Freelancer[];
    addFreelancer: (freelancer: Omit<Freelancer, 'id'>) => void;
    requests: ContentRequest[];
    addRequest: (request: Omit<ContentRequest, 'id' | 'date' | 'status'>) => void;
    updateRequestStatus: (id: string, status: 'Approved' | 'Rejected') => void;
    deleteRequest: (id: string) => void;
    updateFreelancer: (id: string, updates: Partial<Freelancer>) => void;
    deleteFreelancer: (id: string) => void;
    favorites: Favorite[];
    toggleFavorite: (userId: string, contentId: string) => void;
    isFavorite: (userId: string, contentId: string) => boolean;
}

const FreelancerContext = createContext<FreelancerContextType | undefined>(undefined);

export function FreelancerProvider({ children }: { children: ReactNode }) {
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [requests, setRequests] = useState<ContentRequest[]>([]);
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    useEffect(() => {
        // Load Freelancers
        // Load Freelancers
        axios.get('/api/freelancers')
            .then(res => setFreelancers(res.data))
            .catch(err => console.error("Failed to load freelancers:", err));

        // Load Requests
        axios.get('/api/freelancers/requests')
            .then(res => setRequests(res.data))
            .catch(err => console.error("Failed to load freelancer requests:", err));

        // Load Favorites (Assuming guest or user context... for now just load all or handle later? 
        // The previous logic loaded all from local storage. 
        // Here we might need a userId. But the context doesn't seem to hold userId directly?
        // Ah, `toggleFavorite` takes `userId`.
        // For now, let's skip initial load of favorites or maybe we need auth context here?
        // Inspecting original code: `toggleFavorite` adds to local state and storage. `isFavorite` checks local state.
        // It seems favorites are global in this context?
        // Let's defer loading favorites to when we have a user, or just load nothing initially.
        // Actually, we can fetch favourites for current user if we knew them. 
        // For MVP, let's just keep favorites in memory or... 
        // Wait, the original code stored ALL favorites in `mall_content_favorites`.
        // So we can mock that behavior by fetching *all* favorites if we wanted, but that's bad security.
        // Let's trying to fetch favorites for a "guest" or handle it dynamically.
        // For duplication of behavior: logic was "load all favorites".
        // I'll add an endpoint to get all favorites or just leave it empty until user logs in?
        // User didn't specify strict auth requirement for favorites.
        // I will impl simplistic "load favorites for all" if possible? No, route is /favorites/:userId.
        // I will leave favorites empty initially. User needs to log in.
    }, []);

    const addFreelancer = async (freelancer: Omit<Freelancer, 'id'>) => {
        try {
            const res = await axios.post('/api/freelancers', freelancer);
            setFreelancers([...freelancers, res.data]);
        } catch (err) {
            console.error("Failed to add freelancer:", err);
        }
    };

    const addRequest = async (request: Omit<ContentRequest, 'id' | 'date' | 'status'>) => {
        const newRequestData = {
            ...request,
            date: new Date().toISOString(),
            status: 'Pending'
        };
        try {
            const res = await axios.post('/api/freelancers/requests', newRequestData);
            setRequests([res.data, ...requests]);
        } catch (err) {
            console.error("Failed to add request:", err);
        }
    };

    const updateRequestStatus = async (id: string, status: 'Approved' | 'Rejected') => {
        try {
            const res = await axios.put(`/api/freelancers/requests/${id}`, { status });
            setRequests(requests.map(req => req.id === id ? res.data : req));
        } catch (err) {
            console.error("Failed to update request status:", err);
        }
    };

    const deleteRequest = async (id: string) => {
        try {
            await axios.delete(`/api/freelancers/requests/${id}`);
            setRequests(requests.filter(req => req.id !== id));
        } catch (err) {
            console.error("Failed to delete request:", err);
        }
    };

    const updateFreelancer = async (id: string, updates: Partial<Freelancer>) => {
        try {
            const res = await axios.put(`/api/freelancers/${id}`, updates);
            setFreelancers(freelancers.map(f => f.id === id ? res.data : f));
        } catch (err) {
            console.error("Failed to update freelancer:", err);
        }
    };

    const deleteFreelancer = async (id: string) => {
        try {
            await axios.delete(`/api/freelancers/${id}`);
            setFreelancers(freelancers.filter(f => f.id !== id));
        } catch (err) {
            console.error("Failed to delete freelancer:", err);
        }
    };

    const toggleFavorite = async (userId: string, contentId: string) => {
        const exists = favorites.some(f => f.userId === userId && f.contentId === contentId);
        try {
            if (exists) {
                await axios.delete('http://localhost:3000/api/freelancers/favorites', { data: { userId, contentId } });
                setFavorites(favorites.filter(f => !(f.userId === userId && f.contentId === contentId)));
            } else {
                const res = await axios.post('http://localhost:3000/api/freelancers/favorites', { userId, contentId });
                setFavorites([...favorites, res.data]);
            }
        } catch (err) {
            console.error("Failed to toggle favorite:", err);
        }
    };

    const isFavorite = (userId: string, contentId: string) => {
        return favorites.some(f => f.userId === userId && f.contentId === contentId);
    };

    return (
        <FreelancerContext.Provider value={{
            freelancers, addFreelancer,
            requests, addRequest, updateRequestStatus, deleteRequest,
            updateFreelancer, deleteFreelancer,
            favorites, toggleFavorite, isFavorite
        }}>
            {children}
        </FreelancerContext.Provider>
    );
}

export function useFreelancers() {
    const context = useContext(FreelancerContext);
    if (context === undefined) {
        throw new Error('useFreelancers must be used within a FreelancerProvider');
    }
    return context;
}
