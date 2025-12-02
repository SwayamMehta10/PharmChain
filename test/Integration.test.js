const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PharmaChain Complete Lifecycle", function () {
  let roles, registry, verifyService, supplyChain;
  let admin, manufacturer, distributor, retailer, regulator, hacker;

  // Status Enums (matching Solidity: 0=Originated, 1=Shipped, 2=Received, etc.)
  const STATUS = {
    ORIGINATED: 0,
    SHIPPED: 1,
    RECEIVED: 2,
    IN_STORAGE: 3,
    DELIVERED: 4
  };

  beforeEach(async function () {
    [admin, manufacturer, distributor, retailer, regulator, hacker] = await ethers.getSigners();

    // 1. DEPLOYMENT
    roles = await (await ethers.getContractFactory("PharmaRoles")).deploy();
    registry = await (await ethers.getContractFactory("ProductRegistry")).deploy();
    
    verifyService = await (await ethers.getContractFactory("VerificationService"))
      .deploy(roles.target, registry.target);
      
    supplyChain = await (await ethers.getContractFactory("PharmaSupplyChain"))
      .deploy(roles.target, registry.target);

    // 2. WIRING (Permissions)
    const CONTROLLER_ROLE = await registry.CONTROLLER_ROLE();
    await registry.grantRole(CONTROLLER_ROLE, supplyChain.target);
    await registry.grantRole(CONTROLLER_ROLE, verifyService.target);

    // 3. USER SETUP
    await roles.grantManufacturer(manufacturer.address);
    await roles.grantRegulator(regulator.address);
    // We manually grant distributor/retailer roles for this test
    const DISTRIBUTOR_ROLE = await roles.DISTRIBUTOR_ROLE();
    await roles.grantRole(DISTRIBUTOR_ROLE, distributor.address);
  });

  it("Should execute the full 'Life of a Pill' scenario", async function () {
    console.log("\n--- STARTING SUPPLY CHAIN SIMULATION ---\n");

    // STEP 1: Manufacturer Creates Product
    console.log("1. Manufacturer registers 'Aspirin'...");
    const expiry = Math.floor(Date.now() / 1000) + 50000;
    await supplyChain.connect(manufacturer).registerProduct("Aspirin", "BATCH-001", expiry, "QmHash");
    
    let product = await registry.getProduct(1);
    expect(product.name).to.equal("Aspirin");
    expect(product.status).to.equal(STATUS.ORIGINATED);
    console.log("   > Product Registered with ID: 1");

    // STEP 2: Manufacturer Scans it as 'Shipped'
    console.log("2. Manufacturer scans product as SHIPPED...");
    await supplyChain.connect(manufacturer).scanProduct(1, STATUS.SHIPPED);
    
    product = await registry.getProduct(1);
    expect(product.status).to.equal(STATUS.SHIPPED);
    console.log("   > Status updated to SHIPPED");

    // STEP 3: Manufacturer Transfers to Distributor
    console.log("3. Handing over to Distributor...");
    await supplyChain.connect(manufacturer).transferOwnership(1, distributor.address);
    
    product = await registry.getProduct(1);
    expect(product.currentOwner).to.equal(distributor.address);
    console.log("   > Ownership transferred to Distributor");

    // STEP 4: Distributor Scans as 'Received'
    console.log("4. Distributor scans product as RECEIVED...");
    await supplyChain.connect(distributor).scanProduct(1, STATUS.RECEIVED);
    
    product = await registry.getProduct(1);
    expect(product.status).to.equal(STATUS.RECEIVED);
    console.log("   > Status updated to RECEIVED");

    // STEP 5: Regulator Audits the Product
    console.log("5. Regulator performs a random audit...");
    await verifyService.connect(regulator).verifyProduct(1);
    
    product = await registry.getProduct(1);
    expect(product.isVerified).to.be.true;
    console.log("   > Product marked as VERIFIED by Regulator");

    console.log("\n--- SIMULATION COMPLETE: SUCCESS ---");
  });

  it("Security Check: A hacker cannot scan the product", async function () {
    // Manufacturer makes a product
    const expiry = Math.floor(Date.now() / 1000) + 50000;
    await supplyChain.connect(manufacturer).registerProduct("Opioid", "BATCH-666", expiry, "QmHash");

    // Hacker tries to scan it to fake the status
    console.log("\n--- SECURITY TEST: HACKER ATTACK ---");
    console.log("Hacker attempting to change status...");
    
    await expect(
      supplyChain.connect(hacker).scanProduct(1, STATUS.DELIVERED)
    ).to.be.revertedWith("Only the owner can scan/update status");
    
    console.log("   > Attack Blocked: Transaction Reverted");
  });
});