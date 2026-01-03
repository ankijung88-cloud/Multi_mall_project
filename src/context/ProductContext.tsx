import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { products as initialProducts } from '../data/products';
import type { Product } from '../data/products';

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (id: number, updates: Partial<Omit<Product, 'id'>>) => void;
    deleteProduct: (id: number) => void;
    getProduct: (id: number) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>([]);

    // Load from localStorage or use initial data
    useEffect(() => {
        try {
            const storedProducts = localStorage.getItem('mall_products');
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            } else {
                setProducts(initialProducts);
                localStorage.setItem('mall_products', JSON.stringify(initialProducts));
            }
        } catch (error) {
            console.error("Failed to load products from localStorage:", error);
            // Fallback to initial products if storage is corrupted
            setProducts(initialProducts);
            localStorage.setItem('mall_products', JSON.stringify(initialProducts));
        }
    }, []);

    // Save to localStorage whenever products change
    const saveToStorage = (newProducts: Product[]) => {
        setProducts(newProducts);
        localStorage.setItem('mall_products', JSON.stringify(newProducts));
    };

    const addProduct = (productData: Omit<Product, 'id'>) => {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = { ...productData, id: newId };
        saveToStorage([...products, newProduct]);
    };

    const updateProduct = (id: number, updates: Partial<Omit<Product, 'id'>>) => {
        saveToStorage(products.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id: number) => {
        saveToStorage(products.filter(p => p.id !== id));
    };

    const getProduct = (id: number) => {
        return products.find(p => p.id === id);
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}
