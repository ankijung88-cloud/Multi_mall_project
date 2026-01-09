import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
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

    // Load products from API
    useEffect(() => {
        axios.get('/api/products')
            .then(res => setProducts(res.data))
            .catch(err => {
                console.error("Failed to load products:", err);
                setProducts(initialProducts); // Fallback
            });
    }, []);

    const addProduct = async (productData: Omit<Product, 'id'>) => {
        try {
            const res = await axios.post('/api/products', productData);
            setProducts([...products, res.data]);
        } catch (err) {
            console.error("Failed to add product:", err);
            alert("Failed to save product to server.");
        }
    };

    const updateProduct = async (id: number, updates: Partial<Omit<Product, 'id'>>) => {
        try {
            const res = await axios.put(`/api/products/${id}`, updates);
            setProducts(products.map(p => p.id === id ? res.data : p)); // Use returned data
        } catch (err) {
            console.error("Failed to update product:", err);
            alert("Failed to update product on server.");
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            await axios.delete(`/api/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to delete product:", err);
            alert("Failed to delete product on server.");
        }
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
