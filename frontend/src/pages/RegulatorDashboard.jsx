import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { ShieldCheck, Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const RegulatorDashboard = () => {
    const { contracts, currentAccount } = useWeb3();
    const [productId, setProductId] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [message, setMessage] = useState('');

    const handleVerify = async () => {
        if (!contracts.verification || !productId) return;

        try {
            setLoading(true);
            setStatus(null);
            setMessage('');

            // Call verifyProduct on the smart contract
            const tx = await contracts.verification.verifyProduct(productId);
            await tx.wait();

            setStatus('success');
            setMessage(`Product ID ${productId} has been successfully verified.`);
            setProductId('');
        } catch (err) {
            console.error(err);
            setStatus('error');
            // Extract error message if possible
            if (err.reason) {
                setMessage(err.reason);
            } else if (err.message && err.message.includes("Caller is not a regulator")) {
                setMessage("Access Denied: You do not have the Regulator role.");
            } else {
                setMessage("Failed to verify product. Check console for details.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
                    <ShieldCheck className="h-8 w-8 text-purple-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Regulator Dashboard</h1>
                <p className="text-gray-500 mt-2">Verify registered products on the blockchain.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
                            Product ID to Verify
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="number"
                                id="productId"
                                placeholder="Enter Product ID"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                value={productId}
                                onChange={(e) => setProductId(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={loading || !productId}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="h-5 w-5" />
                                Verify Product
                            </>
                        )}
                    </button>
                </div>
            </div>

            {status && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {status === 'success' ? (
                        <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                        <h3 className="font-medium">{status === 'success' ? 'Verification Successful' : 'Verification Failed'}</h3>
                        <p className="text-sm mt-1 opacity-90">{message}</p>
                    </div>
                </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-500">
                <p><strong>Note:</strong> Only accounts with the <code>REGULATOR_ROLE</code> can perform this action.</p>
                <p className="mt-1">Current Account: <span className="font-mono text-xs">{currentAccount}</span></p>
            </div>
        </div>
    );
};

export default RegulatorDashboard;
