const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    // Get the address of the deployed PharmaRoles contract
    // You might need to update this if you redeploy!
    const PHARMA_ROLES_ADDRESS = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

    const pharmaRoles = await hre.ethers.getContractAt("PharmaRoles", PHARMA_ROLES_ADDRESS);

    // The address you want to grant the role to
    // Change this to the address you want to give the role to
    const targetAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Account #1 from Hardhat

    // Grant Regulator Role
    console.log(`Granting REGULATOR_ROLE to ${targetAddress}...`);
    await pharmaRoles.grantRegulator(targetAddress);

    console.log("Role granted successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
