# PharmaChain
A Blockchain-Based Pharmaceutical Supply Chain Management System developed as part of CSE 540: Engineering Blockchain Applications course at ASU.

Group 13

## Project Overview
A blockchain-powered supply chain provenance system designed to ensure transparency, traceability, and trust in the pharmaceutical industry. This system addresses the critical challenge of counterfeit drugs by leveraging Ethereum blockchain technology to track pharmaceutical products from manufacturers to end consumers.

## Architecture
### Network Participants
1. **Pharmaceutical Manufacturers**
   - Create and register products on blockchain
   - Assign unique digital identifiers
   - Initiate provenance records

2. **Distributors/Wholesalers**
   - Handle logistics and shipment
   - Update custody transfer information
   - Record transport details

3. **Pharmacies/Hospitals**
   - Receive and verify products
   - Update product availability
   - Confirm storage conditions

4. **Regulatory Authorities**
   - Oversee compliance
   - Audit on-chain records
   - Issue certifications

5. **End Consumers**
   - Verify product authenticity via QR codes
   - Access product history (read-only)

### Core Features
1. **Drug Serialization**: Unique digital identifier for each drug package with QR codes
2. **Smart Contracts**: Solidity-based contracts for automated validation and transparency
3. **Verification Interface**: Web/mobile application using MetaMask
4. **IPFS Integration**: Decentralized storage for product documentation

## Technology Stack
### Blockchain Platform
- **Ethereum** - Primary blockchain platform
- **Polygon Amoy Testnet** - Testing environment for cost-effective deployment

### Smart Contract Development
- **Solidity** - Smart contract programming language
- **Hardhat** - Ethereum development framework

### Frontend
- **Web3.js** - Blockchain integration library
- **MetaMask** - Wallet integration for transaction management
- **React.js** - User interface framework (planned)

### Storage
- **IPFS** - Decentralized storage for product certificates and documentation (Tentative)

## Dependencies
### Required Software
```
Node.js (v16 or higher)
npm (v8 or higher)
MetaMask browser extension
Git
```

### npm Packages
```json
{
  "dependencies": {
    "web3": "^4.0.0",
    "ethers": "^6.0.0",
    "@openzeppelin/contracts": "^5.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "hardhat": "^2.19.0",
    "@nomicfoundation/hardhat-toolbox": "^4.0.0"
  }
}
```
### PharmChain UI Walkthrough
```We have successfully built the frontend User Interface for the PharmChain application.

Features Implemented
1.⁠ ⁠Modern UI with Tailwind CSS
Clean, responsive design using Tailwind CSS.
Navigation bar with wallet connection status.

2.⁠ ⁠Web3 Integration
Wallet Connection: Connects to MetaMask.
Contract Integration: Interacts with PharmaSupplyChain, PharmaRoles, and ProductRegistry contracts.
Context Provider: Manages state across the application.

3.⁠ ⁠Manufacturer Dashboard
Product Registration: Form to register new products on the blockchain.
Input Fields: Name, Batch Number, Expiry Date, IPFS Hash.

4.⁠ ⁠Supply Chain Actions
Update Status: Scan product (simulate) and update status (Originated -> In Transit -> Stored -> Delivered).
Transfer Ownership: Transfer product ownership to another address (Distributor/Retailer).

5.⁠ ⁠Consumer View (Product History)
Track Product: Search by Product ID.
Verification: Displays product details, current owner, and verification status.
Timeline: Visual progress of the product through the supply chain.

6.⁠ ⁠Regulator Dashboard
Product Verification: Interface for regulators to verify registered products.
Role-Based Access: Only accessible to accounts with REGULATOR_ROLE.

## Setup Instructions
### 1. Clone the Repository
```bash
git clone https://github.com/SwayamMehta10/PharmChain
```

### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment Variables
Create a `.env` file in the root directory and copy the template from `.env.example`:

```
PRIVATE_KEY=your_wallet_private_key
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
REPORT_GAS=false
IPFS_PROJECT_ID=your_ipfs_project_id
IPFS_PROJECT_SECRET=your_ipfs_project_secret
```

### 4. Compile Smart Contracts
```bash
npx hardhat compile
```

### 5. Testing Guide
Follow these steps to deploy the contracts and test the frontend application.

1.⁠ ⁠Start Local Blockchain
Open a terminal in the root directory (PharmChain) and start the local Hardhat node:

npx hardhat node

Keep this terminal running.

2.⁠ ⁠Deploy Contracts
Open a new terminal in the root directory and run the deployment script:

npx hardhat run scripts/deploy.js --network localhost

This will deploy the contracts and print their addresses. It also grants the MANUFACTURER_ROLE and REGULATOR_ROLE to the first account (Account #0).

3.⁠ ⁠Update Frontend Configuration
Copy the addresses from the deployment output and update 
frontend/src/utils/constants.js
:

export const CONTRACT_ADDRESSES = {
  PharmaSupplyChain: "0x...", 
  PharmaRoles: "0x...",       
  ProductRegistry: "0x...",
  VerificationService: "0x..."
};

4.⁠ ⁠Start Frontend
In the frontend directory, start the React app:

cd frontend
npm run dev
Open the URL (usually http://localhost:5173) in your browser.

5.⁠ ⁠Configure MetaMask
Network: Add a custom network for Localhost 8545 (Chain ID: 31337, RPC: http://127.0.0.1:8545).
Import Account: Import Account #0 from the npx hardhat node output using its private key. This account has both Manufacturer and Regulator roles.
Connect: Connect this account to the website.

6.⁠ ⁠Test Scenarios
Scenario A: Manufacturer Registration
-Go to the Dashboard.
-Fill in the "Register New Product" form:
  Name: "Aspirin"
  Batch: "BATCH001"
  Expiry: Select a future date.
  IPFS Hash: "QmTest..." (any string works for now).
-Click Register Product.
-Confirm the transaction in MetaMask.
-Wait for the alert "Product registered successfully!".

Scenario B: Supply Chain Updates
-In the Dashboard, look at the "Supply Chain Actions" section.
-Update Status:
  Enter Product ID: 1 (IDs start at 1).
  Select Status: "In Transit".
-Click Update Status and confirm.
-Transfer Ownership:
  Enter Product ID: 1.
  Enter New Owner Address (you can use another account from hardhat node).
-Click Transfer Ownership and confirm.

Scenario C: Regulator Verification
-Go to the Regulator page (click "Regulator" in navbar).
-Enter Product ID: 1.
-Click Verify Product.
-Confirm the transaction in MetaMask.
-You should see a success message.

Scenario D: Consumer Verification
-Go to the Scan Product page (or click "Scan Product" in navbar).
-Enter Product ID: 1.
-Click Verify Product.
-You should see the product details.
-Check the Verification Status: It should now say "Verified" (Green) instead of "Pending Verification".

7.⁠ ⁠Managing Roles (Optional)
By default, the deployment script gives Account #0 both Manufacturer and Regulator roles. If you want to give the Regulator role to a different account (e.g., Account #1):

Open 
scripts/grant-role.js
.
Update PHARMA_ROLES_ADDRESS with your deployed address (from 
constants.js
).
Update targetAddress with the address you want to grant the role to.
Run the script:
npx hardhat run scripts/grant-role.js --network localhost
```

### How to Use (Tentative)
### For Manufacturers
1. Connect MetaMask wallet
2. Register new drug products with unique identifiers
3. Upload product certificates to IPFS
4. Initiate product journey on blockchain

### For Distributors/Retailers
1. Connect wallet and authenticate role
2. Scan QR code to update product custody
3. Record shipment and storage information
4. Transfer ownership to next stakeholder

### For Consumers
1. Scan QR code on drug package
2. View complete product history
3. Verify authenticity against blockchain records
4. No wallet required (read-only access)

### For Regulators
1. Access analytics dashboard
2. Audit supply chain transactions
3. Verify compliance records
4. Issue digital certifications

