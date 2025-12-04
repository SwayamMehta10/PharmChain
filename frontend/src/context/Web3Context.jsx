import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from '../utils/constants';
import PharmaSupplyChainABI from '../utils/abis/PharmaSupplyChain.json';
import PharmaRolesABI from '../utils/abis/PharmaRoles.json';
import ProductRegistryABI from '../utils/abis/ProductRegistry.json';
import VerificationServiceABI from '../utils/abis/VerificationService.json';

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [contracts, setContracts] = useState({
        supplyChain: null,
        roles: null,
        registry: null,
        verification: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) return alert("Please install MetaMask.");

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.error(error);
            setError("Failed to connect wallet.");
        }
    };

    const checkIfWalletIsConnected = async () => {
        try {
            if (!window.ethereum) return;
            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    useEffect(() => {
        const initContracts = async () => {
            if (currentAccount && window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();

                    const supplyChain = new ethers.Contract(
                        CONTRACT_ADDRESSES.PharmaSupplyChain,
                        PharmaSupplyChainABI.abi,
                        signer
                    );

                    const roles = new ethers.Contract(
                        CONTRACT_ADDRESSES.PharmaRoles,
                        PharmaRolesABI.abi,
                        signer
                    );

                    const registry = new ethers.Contract(
                        CONTRACT_ADDRESSES.ProductRegistry,
                        ProductRegistryABI.abi,
                        signer
                    );

                    const verification = new ethers.Contract(
                        CONTRACT_ADDRESSES.VerificationService,
                        VerificationServiceABI.abi,
                        signer
                    );

                    setContracts({ supplyChain, roles, registry, verification });
                    setLoading(false);
                } catch (err) {
                    console.error("Error initializing contracts:", err);
                    setError("Failed to load contracts. Check console.");
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        initContracts();
    }, [currentAccount]);

    return (
        <Web3Context.Provider value={{ connectWallet, currentAccount, contracts, loading, error }}>
            {children}
        </Web3Context.Provider>
    );
};
