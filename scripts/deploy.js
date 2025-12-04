const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // 1. Deploy PharmaRoles
    const PharmaRoles = await hre.ethers.getContractFactory("PharmaRoles");
    const pharmaRoles = await PharmaRoles.deploy();
    await pharmaRoles.waitForDeployment();
    const rolesAddress = await pharmaRoles.getAddress();
    console.log("PharmaRoles deployed to:", rolesAddress);

    // 2. Deploy ProductRegistry
    const ProductRegistry = await hre.ethers.getContractFactory("ProductRegistry");
    const productRegistry = await ProductRegistry.deploy();
    await productRegistry.waitForDeployment();
    const registryAddress = await productRegistry.getAddress();
    console.log("ProductRegistry deployed to:", registryAddress);

    // 3. Deploy PharmaSupplyChain
    const PharmaSupplyChain = await hre.ethers.getContractFactory("PharmaSupplyChain");
    const pharmaSupplyChain = await PharmaSupplyChain.deploy(rolesAddress, registryAddress);
    await pharmaSupplyChain.waitForDeployment();
    const supplyChainAddress = await pharmaSupplyChain.getAddress();
    console.log("PharmaSupplyChain deployed to:", supplyChainAddress);

    // 4. Deploy VerificationService
    const VerificationService = await hre.ethers.getContractFactory("VerificationService");
    const verificationService = await VerificationService.deploy(rolesAddress, registryAddress);
    await verificationService.waitForDeployment();
    const verificationAddress = await verificationService.getAddress();
    console.log("VerificationService deployed to:", verificationAddress);

    // 5. Setup Roles and Permissions
    console.log("Setting up roles...");

    // Grant CONTROLLER_ROLE to PharmaSupplyChain in ProductRegistry
    const CONTROLLER_ROLE = await productRegistry.CONTROLLER_ROLE();
    await productRegistry.grantRole(CONTROLLER_ROLE, supplyChainAddress);
    console.log("Granted CONTROLLER_ROLE to PharmaSupplyChain");

    // Grant CONTROLLER_ROLE to VerificationService in ProductRegistry
    await productRegistry.grantRole(CONTROLLER_ROLE, verificationAddress);
    console.log("Granted CONTROLLER_ROLE to VerificationService");

    // Grant MANUFACTURER_ROLE to deployer for testing
    await pharmaRoles.grantManufacturer(deployer.address);
    console.log("Granted MANUFACTURER_ROLE to deployer");

    // Grant REGULATOR_ROLE to deployer for testing
    await pharmaRoles.grantRegulator(deployer.address);
    console.log("Granted REGULATOR_ROLE to deployer");

    console.log("\nDeployment Complete!");
    console.log("----------------------------------------------------");
    console.log("Update frontend/src/utils/constants.js with these addresses:");
    console.log("PharmaRoles:", rolesAddress);
    console.log("ProductRegistry:", registryAddress);
    console.log("PharmaSupplyChain:", supplyChainAddress);
    console.log("VerificationService:", verificationAddress);
    console.log("----------------------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
