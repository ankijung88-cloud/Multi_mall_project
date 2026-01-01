import { motion } from 'framer-motion';
import { products } from '../data/products';
import MainLayout from '../layouts/MainLayout';
import { ShoppingCart } from 'lucide-react';

export default function PersonalHome() {

    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
                        alt="Hero"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
                    >
                        Elevate Your <span className="text-emerald-400">Lifestyle</span>
                    </motion.h1>
                    <motion.p
                        className="text-xl md:text-2xl text-gray-200 mb-10"
                    >
                        Discover a curated collection of premium goods designed for the modern individual.
                    </motion.p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg shadow-emerald-500/30 transition-all"
                    >
                        Shop Collection
                    </motion.button>
                </div>
            </section>

            {/* Product Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold mb-12 text-gray-900 border-l-4 border-emerald-500 pl-4">Featured Products</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-emerald-500 hover:text-white">
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wide">{product.category}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-2xl font-bold text-gray-900">${product.personalPrice}</span>
                                    <span className="text-sm text-gray-400 line-through">${Math.round(product.personalPrice * 1.2)}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </MainLayout>
    );
}
