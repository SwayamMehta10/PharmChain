import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Truck, RefreshCw, UserCheck } from 'lucide-react';

const SupplyChainActions = () => {
    const { contracts, currentAccount } = useWeb3();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('status'); // 'status' or 'transfer'

    const [statusData, setStatusData] = useState({
        productId: '',
        newStatus: '0' // Default to Created/Originated
    });

    const [transferData, setTransferData] = useState({
        productId: '',
        newOwner: ''
    });

    const STATUS_MAPPING = [
        "Originated",
        "InTransit",
        "Stored",
        "Delivered"
    ];

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        if (!contracts.supplyChain) return;

        try {
            setLoading(true);
            const tx = await contracts.supplyChain.scanProduct(
                statusData.productId,
                statusData.newStatus
            );
            await tx.wait();
            alert("Status updated successfully!");
            setStatusData({ productId: '', newStatus: '0' });
        } catch (error) {
            console.error(error);
            alert("Error updating status: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        if (!contracts.supplyChain) return;

        try {
            setLoading(true);
            const tx = await contracts.supplyChain.transferOwnership(
                transferData.productId,
                transferData.newOwner
            );
            await tx.wait();
            alert("Ownership transferred successfully!");
            setTransferData({ productId: '', newOwner: '' });
        } catch (error) {
            console.error(error);
            alert("Error transferring ownership: " + (error.reason || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Supply Chain Actions</h2>
            </div>

            <div className="flex border-b border-gray-200 mb-6">
                <button
                    className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === 'status'
                            ? 'border-b-2 border-purple-600 text-purple-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('status')}
                >
                    Update Status
                </button>
                <button
                    className={`pb-2 px-4 text-sm font-medium transition-colors ${activeTab === 'transfer'
                            ? 'border-b-2 border-purple-600 text-purple-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('transfer')}
                >
                    Transfer Ownership
                </button>
            </div>

            {activeTab === 'status' ? (
                <form onSubmit={handleStatusUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                        <input
                            type="number"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            value={statusData.productId}
                            onChange={(e) => setStatusData({ ...statusData, productId: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            value={statusData.newStatus}
                            onChange={(e) => setStatusData({ ...statusData, newStatus: e.target.value })}
                        >
                            {STATUS_MAPPING.map((status, index) => (
                                <option key={index} value={index}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !currentAccount}
                        className={`w-full py-3 rounded-lg font-medium text-white transition-all ${loading || !currentAccount
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20'
                            }`}
                    >
                        {loading ? 'Updating...' : 'Update Status'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                        <input
                            type="number"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            value={transferData.productId}
                            onChange={(e) => setTransferData({ ...transferData, productId: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Owner Address</label>
                        <input
                            type="text"
                            required
                            placeholder="0x..."
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            value={transferData.newOwner}
                            onChange={(e) => setTransferData({ ...transferData, newOwner: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !currentAccount}
                        className={`w-full py-3 rounded-lg font-medium text-white transition-all ${loading || !currentAccount
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20'
                            }`}
                    >
                        {loading ? 'Transferring...' : 'Transfer Ownership'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default SupplyChainActions;
