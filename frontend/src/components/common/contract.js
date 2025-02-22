import { ethers } from "ethers";
import contractABI from "../../util/contractABI.json";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

export const registerFarmer = async (name, location) => {
    if (!window.ethereum) {
        throw new Error("MetaMask not detected. Please install it.");
    }

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        const tx = await contract.registerFarmer(name, location);
        await tx.wait();

        return "Farmer registered successfully!";
    } catch (error) {
        console.error("Error registering farmer:", error);
        throw new Error("Failed to register farmer.");
    }
};
