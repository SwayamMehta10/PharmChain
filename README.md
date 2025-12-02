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

### npm Packages (planned)
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

### 5. Run Tests
```bash
npx hardhat test
```

### 6. Deploy to Testnet
```bash
npx hardhat run scripts/deploy.js --network polygonAmoy
```

## How to Use (Tentative)
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

## Smart Contract Components
### 1. PharmaSupplyChain.sol (Main Contract)
- Product registration and management
- Ownership transfer logic
- Status updates and event logging
- Access control implementation

(Below are planned)

### 2. AccessControl.sol

### 3. ProductRegistry.sol

### 4. VerificationService.sol
