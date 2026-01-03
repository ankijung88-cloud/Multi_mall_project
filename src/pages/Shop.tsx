import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { PriceDisplay } from '../components/PriceDisplay';
import { Search, ShoppingCart, Filter, X } from 'lucide-react';
import clsx from 'clsx';

export default function Shop() {
    const { products } = useProducts();
    const { addToCart } = useCart();
    const { isAuthenticated, userType } = useAuthStore();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return ['All', ...Array.from(cats)];
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            // If not logged in, default to personal login or let them choose.
            // Since we don't know if they are company or personal, maybe just personal for now.
            // Or we could have a "Please Login" modal.
            // For now, redirect to personal login as default fallback.
            navigate('/login?type=personal');
            return;
        }

        const price = userType === 'company' ? product.companyPrice : product.personalPrice;

        addToCart({
            id: product.id,
            name: product.name,
            price: price,
            image: product.image
        });
    };

    const getPrice = (product: any) => {
        if (!isAuthenticated) return product.personalPrice; // Default to personal price
        return userType === 'company' ? product.companyPrice : product.personalPrice;
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen">
                {/* Header Banner */}
                <div className="bg-gray-900 text-white py-12 mb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold mb-4">Shop</h1>
                        <p className="text-gray-400">모든 프리미엄 상품을 한곳에서 만나보세요.</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm w-full justify-between"
                            >
                                <span className="flex items-center font-medium"><Filter size={18} className="mr-2" /> 카테고리 필터</span>
                                {isMobileFilterOpen ? <X size={18} /> : null}
                            </button>
                        </div>

                        {/* Sidebar */}
                        <aside className={clsx(
                            "lg:w-64 flex-shrink-0 bg-white lg:bg-transparent rounded-lg p-4 lg:p-0 shadow-lg lg:shadow-none mb-6 lg:mb-0 transition-all duration-300",
                            isMobileFilterOpen ? "block" : "hidden lg:block"
                        )}>
                            <div className="sticky top-24">
                                <h3 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2">카테고리</h3>
                                <ul className="space-y-2">
                                    {categories.map(category => (
                                        <li key={category}>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setIsMobileFilterOpen(false);
                                                }}
                                                className={clsx(
                                                    "w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                                                    selectedCategory === category
                                                        ? "bg-gray-900 text-white"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                )}
                                            >
                                                {category}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="flex-1">
                            {/* Search Bar */}
                            <div className="mb-6 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="상품 검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm"
                                />
                            </div>

                            {/* Product Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer flex flex-col h-full"
                                    >
                                        <div className="h-64 overflow-hidden relative">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {/* Category Tag */}
                                            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 shadow-sm">
                                                {product.category}
                                            </div>
                                        </div>

                                        <div className="p-5 flex-grow flex flex-col">
                                            <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-emerald-600 transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

                                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <div>
                                                    <div className="text-xl font-bold text-gray-900">
                                                        <PriceDisplay amount={getPrice(product)} />
                                                    </div>
                                                    {userType === 'company' && (
                                                        <span className="text-xs text-blue-500 font-medium">기업 전용가</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className={clsx(
                                                        "p-3 rounded-lg text-white transition-colors shadow-sm",
                                                        userType === 'company' ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"
                                                    )}
                                                >
                                                    <ShoppingCart size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="text-gray-400 mb-4">상품을 찾을 수 없습니다.</div>
                                    <button
                                        onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                        className="text-emerald-600 font-medium hover:underline"
                                    >
                                        필터 초기화
                                    </button>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
