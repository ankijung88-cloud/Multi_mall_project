import { motion } from 'framer-motion';
import { products } from '../data/products';
import MainLayout from '../layouts/MainLayout';
import { ShoppingBag, TrendingDown, ShieldCheck } from 'lucide-react';

export default function CompanyHome() {

    return (
        <MainLayout>
            {/* B2B Hero Section */}
            <section className="relative h-[500px] flex items-center bg-blue-900 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/90 to-blue-800/50 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                        alt="Office"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 text-white">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center space-x-2 bg-blue-800/50 rounded-full px-4 py-1 mb-6 border border-blue-700"
                        >
                            <ShieldCheck size={16} className="text-blue-300" />
                            <span className="text-sm font-medium text-blue-100">Verified Corporate Partner</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                        >
                            Procurement <br />Made <span className="text-blue-400">Simple</span>
                        </motion.h1>
                        <p className="text-xl text-blue-200 mb-8 max-w-lg">
                            Access exclusive wholesale pricing, automated invoicing, and dedicated support for your enterprise needs.
                        </p>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-500/30 transition-all">
                            View Corporate Catalog
                        </button>
                    </div>

                    {/* Stats/Cards */}
                    <div className="md:w-1/2 mt-10 md:mt-0 flex gap-4 overflow-x-auto md:justify-end pb-4 md:pb-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl min-w-[200px]"
                        >
                            <div className="text-blue-300 mb-2">Partner Savings</div>
                            <div className="text-4xl font-bold text-white">20%</div>
                            <div className="text-sm text-blue-200 mt-1">Average Discount</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl min-w-[200px]"
                        >
                            <div className="text-blue-300 mb-2">Delivery Time</div>
                            <div className="text-4xl font-bold text-white">24h</div>
                            <div className="text-sm text-blue-200 mt-1">Express Shipping</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-extrabold text-gray-900">Recommended for Your Business</h2>
                    <button className="text-blue-600 font-semibold hover:text-blue-800">View All Categories &rarr;</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 p-4"
                        >
                            <div className="h-48 rounded-lg overflow-hidden bg-gray-100 mb-4 relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover mix-blend-multiply"
                                />
                                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                                    B2B SAVINGS
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-xs text-gray-500 font-medium border border-gray-200 rounded px-2 py-0.5">{product.category}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{product.name}</h3>

                            <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4">
                                <div>
                                    <div className="text-xs text-gray-500">Corporate Price</div>
                                    <div className="text-xl font-bold text-blue-700">${product.companyPrice}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400">Retail: <span className="line-through">${product.personalPrice}</span></div>
                                    <div className="text-xs text-emerald-600 font-bold flex items-center">
                                        <TrendingDown size={12} className="mr-1" />
                                        {Math.round(((product.personalPrice - product.companyPrice) / product.personalPrice) * 100)}% OFF
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center">
                                <ShoppingBag size={16} className="mr-2" />
                                Add to Bulk Order
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>
        </MainLayout>
    );
}
