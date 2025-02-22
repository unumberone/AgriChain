import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useWallet = () => {
    const [account, setAccount] = useState(null);

    // Check if MetaMask is installed
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: "eth_accounts" })
                .then(accounts => {
                    if (accounts.length > 0) {
                        setAccount(accounts[0]);
                    }
                });
        }
    }, []);

    // Connect MetaMask
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask not detected. Please install it.");
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
        } catch (error) {
            console.error("Wallet connection failed", error);
        }
    };

    return { account, connectWallet };
};

export default useWallet;
