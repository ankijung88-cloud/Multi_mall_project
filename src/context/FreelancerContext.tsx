import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface Freelancer {
    id: string;
    name: string;
    title: string;
    image: string;
    description: string;
    portfolioImages: string[];
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
    status: 'Pending' | 'Approved' | 'Rejected';
    date: string;
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
}

const FreelancerContext = createContext<FreelancerContextType | undefined>(undefined);

export function FreelancerProvider({ children }: { children: ReactNode }) {
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [requests, setRequests] = useState<ContentRequest[]>([]);

    useEffect(() => {
        // Load Freelancers
        const storedFreelancers = localStorage.getItem('mall_freelancers');
        if (storedFreelancers) {
            setFreelancers(JSON.parse(storedFreelancers));
        } else {
            // Initial Dummy Data
            const initialLast: Freelancer[] = [
                {
                    id: 'f1',
                    name: 'Ji-Min Kim',
                    title: 'Home Styling Expert',
                    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1000',
                    description: 'Specializing in modern minimalist home styling tailored for single households.',
                    portfolioImages: [
                        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000',
                        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1000'
                    ]
                },
                {
                    id: 'f2',
                    name: 'Alex Park',
                    title: 'Personal Fitness Coach',
                    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1000',
                    description: 'Customized fitness plans and diet consulting for busy professionals.',
                    portfolioImages: [
                        'https://images.unsplash.com/photo-1542766788-a2f588f447ee?auto=format&fit=crop&q=80&w=1000',
                        'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000'
                    ]
                },
                {
                    id: 'f3',
                    name: 'Sarah Lee',
                    title: 'Organic Cooking Instructor',
                    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=1000',
                    description: 'Learn to cook healthy, organic meals with easy-to-follow recipes.',
                    portfolioImages: [
                        'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1000',
                        'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80&w=1000'
                    ]
                },
                {
                    id: 'f4',
                    name: 'David Choi',
                    title: 'Tech Gadget Reviewer',
                    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1000',
                    description: 'In-depth reviews and guides for the latest smart home devices.',
                    portfolioImages: [
                        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=1000',
                        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=1000'
                    ]
                }
            ];
            setFreelancers(initialLast);
            localStorage.setItem('mall_freelancers', JSON.stringify(initialLast));
        }

        // Load Requests
        const storedRequests = localStorage.getItem('mall_content_requests');
        if (storedRequests) {
            setRequests(JSON.parse(storedRequests));
        }
    }, []);

    const addFreelancer = (freelancer: Omit<Freelancer, 'id'>) => {
        const newFreelancer = {
            ...freelancer,
            id: `f${Date.now()}`
        };
        const updated = [...freelancers, newFreelancer];
        setFreelancers(updated);
        localStorage.setItem('mall_freelancers', JSON.stringify(updated));
    };

    const addRequest = (request: Omit<ContentRequest, 'id' | 'date' | 'status'>) => {
        const newRequest: ContentRequest = {
            ...request,
            id: `req_${Date.now()}`,
            date: new Date().toISOString(),
            status: 'Pending'
        };
        const updated = [newRequest, ...requests];
        setRequests(updated);
        localStorage.setItem('mall_content_requests', JSON.stringify(updated));
    };

    const updateRequestStatus = (id: string, status: 'Approved' | 'Rejected') => {
        const updated = requests.map(req =>
            req.id === id ? { ...req, status } : req
        );
        setRequests(updated);
        localStorage.setItem('mall_content_requests', JSON.stringify(updated));
    };

    const deleteRequest = (id: string) => {
        const updated = requests.filter(req => req.id !== id);
        setRequests(updated);
        localStorage.setItem('mall_content_requests', JSON.stringify(updated));
    };

    const updateFreelancer = (id: string, updates: Partial<Freelancer>) => {
        const updated = freelancers.map(f =>
            f.id === id ? { ...f, ...updates } : f
        );
        setFreelancers(updated);
        localStorage.setItem('mall_freelancers', JSON.stringify(updated));
    };

    const deleteFreelancer = (id: string) => {
        const updated = freelancers.filter(f => f.id !== id);
        setFreelancers(updated);
        localStorage.setItem('mall_freelancers', JSON.stringify(updated));
    };

    return (
        <FreelancerContext.Provider value={{ freelancers, addFreelancer, requests, addRequest, updateRequestStatus, deleteRequest, updateFreelancer, deleteFreelancer }}>
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
