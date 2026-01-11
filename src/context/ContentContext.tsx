import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import type { ReactNode } from 'react';

export interface Content {
    id: string;
    userId: string;
    userName: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    contentUrl: string;
    detailImages?: string; // JSON string
    price: number;
    createdAt: string;
    purchases?: ContentPurchase[];
}

export interface ContentPurchase {
    id: string;
    userId: string;
    contentId: string;
    purchaseDate: string;
    amount: number;
}

interface ContentContextType {
    contents: Content[];
    uploadContent: (data: Omit<Content, 'id' | 'createdAt' | 'purchases'>) => Promise<Content>;
    updateContent: (id: string, data: Partial<Content>) => Promise<Content>;
    deleteContent: (id: string) => Promise<void>;
    uploadFile: (file: File) => Promise<string>;
    uploadFiles: (files: File[]) => Promise<string[]>;
    purchaseContent: (contentId: string, userId: string, amount: number) => Promise<void>;
    getContent: (id: string) => Content | undefined;
    refreshContents: () => void;
    likedContentIds: string[];
    toggleLike: (contentId: string, userId: string) => Promise<void>;
    fetchLikes: (userId: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
    const [contents, setContents] = useState<Content[]>([]);
    const [likedContentIds, setLikedContentIds] = useState<string[]>([]);

    const fetchContents = () => {
        axios.get('/api/contents')
            .then(res => setContents(res.data))
            .catch(err => console.error("Failed to fetch contents:", err));
    };

    useEffect(() => {
        fetchContents();
    }, []);

    const uploadContent = async (data: Omit<Content, 'id' | 'createdAt' | 'purchases'>) => {
        const res = await axios.post('/api/contents', data);
        setContents([res.data, ...contents]);
        return res.data;
    };

    const updateContent = async (id: string, data: Partial<Content>) => {
        const res = await axios.put(`/api/contents/${id}`, data);
        setContents(contents.map(c => c.id === id ? res.data : c));
        return res.data;
    };

    const deleteContent = async (id: string) => {
        await axios.delete(`/api/contents/${id}`);
        setContents(contents.filter(c => c.id !== id));
    };

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await axios.post('/api/contents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data.url;
    };

    const uploadFiles = async (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        const res = await axios.post('/api/contents/upload-multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data.urls;
    };

    const purchaseContent = async (contentId: string, userId: string, amount: number) => {
        await axios.post(`/api/contents/${contentId}/purchase`, { userId, amount });
        fetchContents();
    };

    // Fetch user likes
    const fetchLikes = async (userId: string) => {
        if (!userId) {
            setLikedContentIds([]);
            return;
        }
        try {
            const res = await axios.get(`/api/contents/user/${userId}/likes`);
            setLikedContentIds(res.data);
        } catch (e) {
            console.error("Failed to fetch likes:", e);
        }
    };

    // Toggle Like
    const toggleLike = async (contentId: string, userId: string) => {
        try {
            const res = await axios.post(`/api/contents/${contentId}/like`, { userId });
            if (res.data.liked) {
                setLikedContentIds(prev => [...prev, contentId]);
            } else {
                setLikedContentIds(prev => prev.filter(id => id !== contentId));
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    };

    const getContent = (id: string) => contents.find(c => c.id === id);

    return (
        <ContentContext.Provider value={{
            contents,
            uploadContent,
            updateContent,
            deleteContent,
            uploadFile,
            uploadFiles,
            purchaseContent,
            getContent,
            refreshContents: fetchContents,
            likedContentIds,
            toggleLike,
            fetchLikes
        }}>
            {children}
        </ContentContext.Provider>
    );
}

export function useContents() {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContents must be used within a ContentProvider');
    }
    return context;
}
