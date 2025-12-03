import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Search, Package, Calendar, User, CheckCircle, AlertCircle, Clock } from 'lucide-react';

const ProductView = () => {
    const { contracts } = useWeb3();
    const [productId, setProductId] = useState('');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const STATUS_MAPPING = [
        "Originated",
        "In Transit",
        "Stored",
        "Delivered"
    ];

    const handleSearch = async () => {
        if (!contracts.registry || !productId) return;

        try {
            setLoading(true);
            setError('');
            setProduct(null);

            const productData = await contracts.registry.getProduct(productId);
            const owner = await contracts.registry.getProductOwner(productId);

            // Check if product exists (assuming ID 0 is invalid or checking isValid flag)
            if (!productData.isValid) {
                setError("Product not found.");
                return;
            }

            setProduct({
                id: productData.productId.toString(),
                name: productData.name,
                batchNumber: productData.batchNumber,
                manufacturingDate: new Date(Number(productData.manufacturingDate) * 1000).toLocaleDateString(),
                expiryDate: new Date(Number(productData.expiryDate) * 1000).toLocaleDateString(),
                manufacturer: productData.manufacturer,
                currentOwner: owner,
                status: STATUS_MAPPING[Number(productData.status)],
                ipfsHash: productData.ipfsHash,
                isVerified: productData.isVerified
            });

        } catch (err) {
            console.error(err);
            setError("Error fetching product details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">Track Product</h1>
                <p className="text-gray-500 mt-2">Enter a product ID to verify its authenticity and journey.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="number"
                        placeholder="Enter Product ID (e.g., 1)"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:bg-gray-400"
                >
                    {loading ? 'Verifying...' : 'Verify Product'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    {error}
                </div>
            )}

            {product && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                            <p className="text-gray-500">Batch: {product.batchNumber}</p>
                        </div>
                        <div className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${product.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {product.isVerified ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                            {product.isVerified ? 'Verified' : 'Pending Verification'}
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Manufacturing Date</p>
                                    <p className="font-medium text-gray-900">{product.manufacturingDate}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Expiry Date</p>
                                    <p className="font-medium text-gray-900">{product.expiryDate}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Manufacturer</p>
                                    <p className="font-medium text-gray-900 break-all text-xs">{product.manufacturer}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-gray-500">Current Owner</p>
                                    <p className="font-medium text-gray-900 break-all text-xs">{product.currentOwner}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-4">Supply Chain Status</h3>
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                            {STATUS_MAPPING.map((status, index) => {
                                const currentStatusIndex = STATUS_MAPPING.indexOf(product.status);
                                const isCompleted = index <= currentStatusIndex;

                                return (
                                    <div key={index} className="flex flex-col items-center bg-gray-50 px-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-blue-600' : 'text-gray-400'
                                            }`}>{status}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductView;
