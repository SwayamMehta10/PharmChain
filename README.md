# PharmaChain

A Blockchain-Based Pharmaceutical Supply Chain Management System developed as part of CSE 540: Engineering Blockchain Applications course at ASU.

**Group 13**

---

## Project Overview

A blockchain-powered supply chain provenance system designed to ensure transparency, traceability, and trust in the pharmaceutical industry. This system addresses the critical challenge of counterfeit drugs by leveraging Ethereum blockchain technology to track pharmaceutical products from manufacturers to end consumers.

---

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
   - Verify product authenticity by Product ID
   - Access product history

### Core Features

1. **Drug Serialization**: Unique digital identifier for each drug package
2. **Smart Contracts**: Solidity-based contracts for automated validation and transparency
3. **Verification Interface**: Web application with MetaMask integration
4. **Role-Based Access Control**: Manufacturer, Distributor, Retailer, and Regulator roles
5. **Product Tracking**: Real-time status updates through the supply chain
6. **Regulatory Verification**: Dedicated dashboard for regulators to verify products

---

## Technology Stack

### Blockchain Platform
- **Ethereum** - Primary blockchain platform
- **Polygon Amoy Testnet** - Testing environment for cost-effective deployment

### Smart Contract Development
- **Solidity** - Smart contract programming language
- **Hardhat** - Ethereum development framework

### Frontend
- **Ethers.js** - Blockchain integration library
- **MetaMask** - Wallet integration for transaction management
- **React.js** - User interface framework
- **React Router** - Client-side routing
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

---

## Dependencies

### Required Software
```
Node.js (v16 or higher)
npm (v8 or higher)
MetaMask browser extension
Git
```

### npm Packages (Root)
```json
{
  "dependencies": {
    "@openzeppelin/contracts": "^5.4.0",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "hardhat": "^2.27.0",
    "@nomicfoundation/hardhat-toolbox": "^6.1.0"
  }
}
```

### Frontend Packages
```json
{
  "dependencies": {
    "ethers": "^6.15.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.10.0",
    "framer-motion": "^12.23.25",
    "lucide-react": "^0.555.0"
  },
  "devDependencies": {
    "vite": "^4.5.0",
    "tailwindcss": "^3.4.17",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

---

## PharmChain UI Features

We have successfully built the frontend User Interface for the PharmChain application.

### 1. Modern UI with Tailwind CSS
- Clean, responsive design using Tailwind CSS
- Navigation bar with wallet connection status

### 2. Web3 Integration
- **Wallet Connection**: Connects to MetaMask
- **Contract Integration**: Interacts with PharmaSupplyChain, PharmaRoles, and ProductRegistry contracts
- **Context Provider**: Manages state across the application

### 3. Manufacturer Dashboard
- **Product Registration**: Form to register new products on the blockchain
- **Input Fields**: Name, Batch Number, Expiry Date, Document Hash

### 4. Supply Chain Actions
- **Update Status**: Update product status (Originated → InTransit → Stored → Delivered)
- **Transfer Ownership**: Transfer product ownership to another address (Distributor/Retailer)

### 5. Consumer View (Product History)
- **Track Product**: Search by Product ID
- **Verification**: Displays product details, current owner, and verification status
- **Timeline**: Visual progress of the product through the supply chain

### 6. Regulator Dashboard
- **Product Verification**: Interface for regulators to verify registered products
- **Role-Based Access**: Only accessible to accounts with REGULATOR_ROLE

---
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

```env
PRIVATE_KEY=your_wallet_private_key_here
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key_here
REPORT_GAS=false
```

### 4. Compile Smart Contracts

```bash
npx hardhat compile
```

### 5. Testing Guide

Follow these steps to deploy the contracts and test the frontend application.

#### Step 1: Start Local Blockchain

Open a terminal in the root directory and start the local Hardhat node:

```bash
npx hardhat node
```

Keep this terminal running.

#### Step 2: Deploy Contracts

Open a new terminal in the root directory and run the deployment script:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

This will deploy the contracts and print their addresses. It also grants the MANUFACTURER_ROLE and REGULATOR_ROLE to the first account (Account #0).

#### Step 3: Update Frontend Configuration

Copy the addresses from the deployment output and update `frontend/src/utils/constants.js`:

```javascript
export const CONTRACT_ADDRESSES = {
  PharmaSupplyChain: "0x...", 
  PharmaRoles: "0x...",       
  ProductRegistry: "0x...",
  VerificationService: "0x..."
};
```

#### Step 4: Start Frontend

In the frontend directory, start the React app:

```bash
cd frontend
npm run dev
```

Open the URL (usually http://localhost:5173) in your browser.

#### Step 5: Configure MetaMask

- **Network**: Add a custom network for Localhost 8545 (Chain ID: 31337, RPC: http://127.0.0.1:8545)
- **Import Account**: Import Account #0 from the `npx hardhat node` output using its private key. This account has both Manufacturer and Regulator roles
- **Connect**: Connect this account to the website

#### Step 6: Test Scenarios

**Scenario A: Manufacturer Registration**
- Go to the Dashboard
- Fill in the "Register New Product" form:
  - Name: "Aspirin"
  - Batch: "BATCH001"
  - Expiry: Select a future date
  - Document Hash: "QmTest..." (any string)
- Click Register Product
- Confirm the transaction in MetaMask
- Wait for the alert "Product registered successfully!"

**Scenario B: Supply Chain Updates**
- In the Dashboard, look at the "Supply Chain Actions" section
- Update Status:
  - Enter Product ID: 1 (IDs start at 1)
  - Select Status: "In Transit"
- Click Update Status and confirm
- Transfer Ownership:
  - Enter Product ID: 1
  - Enter New Owner Address (you can use another account from hardhat node)
- Click Transfer Ownership and confirm

**Scenario C: Regulator Verification**
- Go to the Regulator page (click "Regulator" in navbar)
- Enter Product ID: 1
- Click Verify Product
- Confirm the transaction in MetaMask
- You should see a success message

**Scenario D: Consumer Verification**
- Go to the Scan Product page (or click "Scan Product" in navbar)
- Enter Product ID: 1
- Click Verify Product
- You should see the product details
- Check the Verification Status: It should now say "Verified" (Green) instead of "Pending Verification"

#### Step 7: Managing Roles (Optional)

By default, the deployment script gives Account #0 both Manufacturer and Regulator roles. If you want to give the Regulator role to a different account (e.g., Account #1):

1. Open `scripts/grant-role.js`
2. Update `PHARMA_ROLES_ADDRESS` with your deployed address (from `constants.js`)
3. Update `targetAddress` with the address you want to grant the role to
4. Run the script:

```bash
npx hardhat run scripts/grant-role.js --network localhost
```


---

## How to Use

### For Manufacturers

1. Connect MetaMask wallet with MANUFACTURER_ROLE
2. Navigate to Dashboard
3. Register new drug products with name, batch number, expiry date, and document hash
4. Update product status through supply chain stages
5. Transfer ownership to distributors/retailers

### For Distributors/Retailers

1. Connect wallet (requires appropriate role)
2. Receive product ownership transfers
3. Update product status
4. Transfer ownership to next stakeholder in the chain

### For Consumers

1. Navigate to "Scan Product" page
2. Enter Product ID to view details
3. View complete product history and verification status
4. Wallet connection required (uses read functions)

### For Regulators

1. Connect wallet with REGULATOR_ROLE
2. Access Regulator Dashboard
3. Enter Product ID to verify
4. Approve products to mark them as verified on blockchain

---
