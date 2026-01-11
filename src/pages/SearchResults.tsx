import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { usePartners } from '../context/PartnerContext';
import { useBoard } from '../context/BoardContext';
import MainLayout from '../layouts/MainLayout';
import { PriceDisplay } from '../components/PriceDisplay';

export default function SearchResults() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';
    const viewType = (searchParams.get('type') === 'company') ? 'company' : 'personal';

    const { products } = useProducts();
    const { partners } = usePartners();
    const { posts } = useBoard();

    // Filter Logic
    const searchResults = useMemo(() => {
        if (!query) return { products: [], partners: [], posts: [] };
        const lowerQuery = query.toLowerCase();

        const filteredProducts = products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );

        const filteredPartners = partners.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            (p.category && p.category.toLowerCase().includes(lowerQuery))
        );

        const filteredPosts = posts.filter(p =>
            p.title.toLowerCase().includes(lowerQuery) ||
            p.content.toLowerCase().includes(lowerQuery)
        );

        return {
            products: filteredProducts,
            partners: filteredPartners,
            posts: filteredPosts
        };
    }, [query, products, partners, posts]);

    const hasResults = searchResults.products.length > 0 || searchResults.partners.length > 0 || searchResults.posts.length > 0;

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-8 text-gray-900">
                        "{query}" 검색 결과
                    </h1>

                    {!hasResults ? (
                        <div className="bg-white p-12 rounded-xl shadow-sm text-center text-gray-500">
                            검색 결과가 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Products Section */}
                            {searchResults.products.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        <span className="w-2 h-8 mr-3 rounded-full bg-emerald-500"></span>
                                        상품 ({searchResults.products.length})
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {searchResults.products.map(product => (
                                            <div key={product.id} onClick={() => navigate(`/product/${product.id}`)} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-100 group">
                                                <div className="h-48 overflow-hidden relative">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                </div>
                                                <div className="p-4">
                                                    <div className="text-xs font-bold text-gray-500 mb-1">{product.category}</div>
                                                    <h3 className="font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
                                                    <div className="font-bold text-lg text-gray-900">
                                                        <PriceDisplay amount={viewType === 'company' ? product.companyPrice : product.personalPrice} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Partners Section */}
                            {searchResults.partners.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        <span className="w-2 h-8 mr-3 rounded-full bg-blue-500"></span>
                                        파트너 ({searchResults.partners.length})
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {searchResults.partners.map(partner => (
                                            <div key={partner.id} onClick={() => navigate(`/partners/${partner.id}`)} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border border-gray-100 flex items-start space-x-4">
                                                <img src={partner.image} alt={partner.name} className="w-20 h-20 rounded-lg object-cover" />
                                                <div>
                                                    <div className="text-xs font-bold text-blue-600 mb-1">{partner.category}</div>
                                                    <h3 className="font-bold text-lg text-gray-900 mb-1">{partner.name}</h3>
                                                    <p className="text-sm text-gray-500 line-clamp-2">{partner.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Board Posts Section */}
                            {searchResults.posts.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        <span className="w-2 h-8 mr-3 rounded-full bg-purple-500"></span>
                                        게시글 ({searchResults.posts.length})
                                    </h2>
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                                        {searchResults.posts.map(post => (
                                            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg text-gray-900">{post.title}</h3>
                                                    <span className="text-xs text-gray-500">{post.date}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
                                                <div className="mt-2 text-xs font-bold text-purple-600 bg-purple-50 inline-block px-2 py-1 rounded">
                                                    {post.type}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
