import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Package, Calendar, FileText, Hash } from 'lucide-react';

const ProductRegistration = () => {
    const { contracts, currentAccount } = useWeb3();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        batchNumber: '',
        expiryDate: '',
        ipfsHash: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contracts.supplyChain) return alert("Contracts not loaded");

        try {
            setLoading(true);
            // Convert date to timestamp
            const expiryTimestamp = Math.floor(new Date(formData.expiryDate).getTime() / 1000);

            const tx = await contracts.supplyChain.registerProduct(
                formData.name,
                formData.batchNumber,
                expiryTimestamp,
                formData.ipfsHash
            );

            await tx.wait();
            alert("Product registered successfully!");
            setFormData({ name: '', batchNumber: '', expiryDate: '', ipfsHash: '' });
        } catch (error) {
            console.error(error);
            alert("Error registering product: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Register New Product</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <div className="relative">
                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            name="batchNumber"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={formData.batchNumber}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="date"
                            name="expiryDate"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={formData.expiryDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IPFS Hash (Certificate)</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            name="ipfsHash"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            value={formData.ipfsHash}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !currentAccount}
                    className={`w-full py-3 rounded-lg font-medium text-white transition-all ${loading || !currentAccount
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                        }`}
                >
                    {loading ? 'Registering...' : 'Register Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductRegistration;
