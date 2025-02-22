const hre = require("hardhat");

async function main() {
    const AgriChain = await hre.ethers.getContractFactory("AgriChain");
    const agriChain = await AgriChain.deploy();
    await agriChain.waitForDeployment();
    console.log("AgriChain deployed to:", await agriChain.getAddress());

    // Deploy the second contract (renamed to AgriChainFarmerReg)
    const AgriChainFarmerReg = await hre.ethers.getContractFactory("AgriChainFarmerReg");
    const agriChainFarmerReg = await AgriChainFarmerReg.deploy();
    await agriChainFarmerReg.waitForDeployment();
    console.log("AgriChainFarmerReg deployed to:", await agriChainFarmerReg.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
