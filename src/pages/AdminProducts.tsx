import { useState, useRef } from 'react';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../data/products';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EXCHANGE_RATE = 1450;

export default function AdminProducts() {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [activeTab, setActiveTab] = useState<'personal' | 'company'>('personal');

    const openModal = (product?: Product) => {
        setEditingProduct(product || null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setEditingProduct(null);
        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const toggleRecommendation = (id: number, type: 'personal' | 'company') => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        const updates = type === 'personal'
            ? { isRecommendedPersonal: !product.isRecommendedPersonal }
            : { isRecommendedCompany: !product.isRecommendedCompany };

        updateProduct(id, updates);
    };

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm w-full sm:w-auto justify-center"
                >
                    <Plus size={20} />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('personal')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'personal'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Personal Market
                </button>
                <button
                    onClick={() => setActiveTab('company')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'company'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Company Market
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {activeTab === 'personal' ? 'Personal Price' : 'Corporate Price'}
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                                            <img
                                                className="h-full w-full object-contain p-0.5" // object-contain ensures it fits nicely
                                                src={product.image}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {activeTab === 'personal' ? (
                                        <div>
                                            <span>${product.personalPrice.toLocaleString()}</span>
                                            <span className="text-xs text-gray-500 ml-1">
                                                (₩{(product.personalPrice * EXCHANGE_RATE).toLocaleString()})
                                            </span>
                                        </div>
                                    ) : (
                                        <div>
                                            <span>${product.companyPrice.toLocaleString()}</span>
                                            <span className="text-xs text-gray-500 ml-1">
                                                (₩{(product.companyPrice * EXCHANGE_RATE).toLocaleString()})
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <input
                                        type="checkbox"
                                        checked={activeTab === 'personal' ? !!product.isRecommendedPersonal : !!product.isRecommendedCompany}
                                        onChange={() => toggleRecommendation(product.id, activeTab)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => openModal(product)}
                                        className="text-indigo-600 hover:text-indigo-900 mx-2 p-1 hover:bg-indigo-50 rounded"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 hover:text-red-900 mx-2 p-1 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No products found. Start by adding a new product.
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                product={editingProduct}
                onSubmit={(data: Omit<Product, 'id'>) => {
                    if (editingProduct) {
                        updateProduct(editingProduct.id, data);
                    } else {
                        addProduct(data);
                    }
                    closeModal();
                }}
            />
        </div>
    );
}


function ProductForm({ product, onSubmit, onCancel }: { product: Product | null, onSubmit: (data: Omit<Product, 'id'>) => void, onCancel: () => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const detailInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: product?.name || '',
        description: product?.description || '',
        image: product?.image || '', // Start empty if new
        personalPrice: product?.personalPrice || 0,
        companyPrice: product?.companyPrice || 0,
        category: product?.category || 'General',
        detailImages: product?.detailImages || []
    });

    // Local state for KRW input
    const [pricesKRW, setPricesKRW] = useState({
        personal: Math.round((product?.personalPrice || 0) * EXCHANGE_RATE),
        company: Math.round((product?.companyPrice || 0) * EXCHANGE_RATE)
    });

    const handlePriceChange = (type: 'personal' | 'company', valueStr: string) => {
        const value = Number(valueStr);
        setPricesKRW(prev => ({ ...prev, [type]: value }));

        // Convert to USD for storage (rounded)
        const usdValue = Math.round(value / EXCHANGE_RATE);
        setFormData(prev => ({
            ...prev,
            [type === 'personal' ? 'personalPrice' : 'companyPrice']: usdValue
        }));
    };



    const categories = ['Furniture', 'Electronics', 'Accessories', 'Appliances', 'Other'];

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
            let processedCount = 0;

            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newImages.push(reader.result as string);
                    processedCount++;
                    if (processedCount === files.length) {
                        setFormData(prev => ({
                            ...prev,
                            detailImages: [...(prev.detailImages || []), ...newImages]
                        }));
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeDetailImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            detailImages: prev.detailImages?.filter((_, i) => i !== index)
        }));
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(formData);
            }}
            className="space-y-4"
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleMainImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                            <Upload size={16} /> Choose Image
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Image Preview Area */}
            {formData.image && (
                <div className="relative w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center group">
                    <img
                        src={formData.image}
                        alt="Preview"
                        // Auto-adjust styling as requested: 'contain' shows full image within box
                        className="w-full h-full object-contain"
                    />
                    <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, image: '' }))}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detail Images (상세설명 포함)</label>
                <div className="flex flex-col gap-2">
                    <input
                        type="file"
                        ref={detailInputRef}
                        onChange={handleDetailImagesChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => detailInputRef.current?.click()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Add Detail Images
                    </button>
                </div>

                {/* Detail Images Preview Grid */}
                {formData.detailImages && formData.detailImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {formData.detailImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                                <img src={img} alt={`Detail ${idx}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeDetailImage(idx)}
                                    className="absolute top-1 right-1 bg-black/50 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personal Price (₩)</label>
                    <div className="space-y-1">
                        <input
                            required
                            type="number"
                            min="0"
                            value={pricesKRW.personal}
                            onChange={e => handlePriceChange('personal', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 text-right">
                            Converted: ${formData.personalPrice.toLocaleString()} (USD)
                        </p>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Corporate Price (₩)</label>
                    <div className="space-y-1">
                        <input
                            required
                            type="number"
                            min="0"
                            value={pricesKRW.company}
                            onChange={e => handlePriceChange('company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 text-right">
                            Converted: ${formData.companyPrice.toLocaleString()} (USD)
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                >
                    {product ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
}

function ProductFormModal({ isOpen, onClose, product, onSubmit }: any) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                    />
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-lg pointer-events-auto flex flex-col max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center p-5 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {product ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-5 overflow-y-auto">
                                <ProductForm product={product} onSubmit={onSubmit} onCancel={onClose} />
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
