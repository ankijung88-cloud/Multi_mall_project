import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type BoardType = 'inquiry' | 'news' | 'success' | 'guide';

export interface Post {
    id: string;
    type: BoardType;
    viewMode?: 'personal' | 'company'; // Added to distinguish context
    title: string;
    author: string;
    content: string;
    date: string;
    views: number;
    // Inquiry specific
    status?: 'Pending' | 'In Progress' | 'Resolved';
    contactInfo?: string;
    isSecret?: boolean;
    password?: string;
}

interface BoardContextType {
    posts: Post[];
    addPost: (post: Omit<Post, 'id' | 'date' | 'views'>) => void;
    updatePost: (id: string, updates: Partial<Post>) => void;
    deletePost: (id: string) => void;
    getPostsByType: (type: BoardType, viewMode: 'personal' | 'company') => Post[];
    getPost: (id: string) => Post | undefined;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const storedPosts = localStorage.getItem('mall_board_posts');
        if (storedPosts) {
            try {
                setPosts(JSON.parse(storedPosts));
            } catch (e) {
                console.error("Failed to parse board posts", e);
                setPosts([]);
            }
        } else {
            // Initial Dummy Data
            const dummyData: Post[] = [
                {
                    id: 'n1', type: 'news', viewMode: 'personal', title: 'Global Partnership Expanded', author: 'Admin',
                    content: 'We represent K-Culture to the world.', date: '2024-03-15', views: 120
                },
                {
                    id: 's1', type: 'success', viewMode: 'personal', title: 'Top Auditor K-Pop Star', author: 'Admin',
                    content: 'Success story of our audition partner.', date: '2024-02-10', views: 450
                },
                {
                    id: 'g1', type: 'guide', viewMode: 'personal', title: 'How to apply for partnership', author: 'Support',
                    content: 'Step by step guide...', date: '2024-01-05', views: 89
                },
                // Company Dummy Data
                {
                    id: 'cn1', type: 'news', viewMode: 'company', title: 'B2B Partnership Benefits', author: 'BizAdmin',
                    content: 'Exclusive benefits for company partners.', date: '2024-03-20', views: 50
                }
            ];
            setPosts(dummyData);
            localStorage.setItem('mall_board_posts', JSON.stringify(dummyData));
        }
    }, []);

    const savePosts = (newPosts: Post[]) => {
        setPosts(newPosts);
        localStorage.setItem('mall_board_posts', JSON.stringify(newPosts));
    };

    const addPost = (postData: Omit<Post, 'id' | 'date' | 'views'>) => {
        const newPost: Post = {
            ...postData,
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            date: new Date().toISOString().split('T')[0],
            views: 0
        };
        savePosts([newPost, ...posts]);
    };

    const updatePost = (id: string, updates: Partial<Post>) => {
        savePosts(posts.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePost = (id: string) => {
        savePosts(posts.filter(p => p.id !== id));
    };

    const getPostsByType = (type: BoardType, viewMode: 'personal' | 'company' = 'personal') => {
        // Filter by type AND viewMode (defaulting to personal for backward compatibility or explicit)
        // If viewMode is not strictly set in old data, assume personal? 
        // Or better: filter p.type === type && (p.viewMode === viewMode || (!p.viewMode && viewMode === 'personal'))
        return posts.filter(p => p.type === type && (p.viewMode === viewMode || (!p.viewMode && viewMode === 'personal')));
    };

    const getPost = (id: string) => {
        return posts.find(p => p.id === id);
    };

    return (
        <BoardContext.Provider value={{
            posts,
            addPost,
            updatePost,
            deletePost,
            getPostsByType,
            getPost
        }}>
            {children}
        </BoardContext.Provider>
    );
}

export function useBoard() {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error('useBoard must be used within a BoardProvider');
    }
    return context;
}
