import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Link } from 'react-router-dom';
import { Pill, Box, Search, Truck } from 'lucide-react';

const Navbar = () => {
    const { connectWallet, currentAccount } = useWeb3();

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Pill className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                PharmChain
                            </span>
                        </Link>
                        <div className="hidden md:flex ml-10 space-x-8">
                            <Link to="/" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/scan" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Scan Product
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {currentAccount ? (
                            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-blue-700">
                                    {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                                </span>
                            </div>
                        ) : (
                            <button
                                onClick={connectWallet}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
