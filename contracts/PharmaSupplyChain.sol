// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PharmaRoles.sol";
import "./ProductRegistry.sol";
import "./PharmaLibrary.sol";

contract PharmaSupplyChain {
    PharmaRoles public rolesContract;
    ProductRegistry public registryContract;

    constructor(address _roles, address _registry) {
        rolesContract = PharmaRoles(_roles);
        registryContract = ProductRegistry(_registry);
    }

    function registerProduct(
        string memory _name,
        string memory _batchNumber,
        uint256 _expiryDate,
        string memory _ipfsHash
    ) external returns (uint256) {
        require(rolesContract.isManufacturer(msg.sender), "Not a manufacturer");
        require(_expiryDate > block.timestamp, "Expired Date");

        PharmaLibrary.Product memory newProduct = PharmaLibrary.Product({
            productId: 0, 
            name: _name,
            batchNumber: _batchNumber,
            manufacturingDate: block.timestamp,
            expiryDate: _expiryDate,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            status: PharmaLibrary.ProductStatus.Originated,
            ipfsHash: _ipfsHash,
            isValid: true,
            isVerified: false
        });

        return registryContract.addProduct(newProduct);
    }

    // --- NEW FUNCTION: Simulates "Scanning" a QR code to update status ---
    function scanProduct(uint256 _productId, PharmaLibrary.ProductStatus _newStatus) external {
        // 1. Check if the person scanning actually owns the product
        address currentOwner = registryContract.getProductOwner(_productId);
        require(msg.sender == currentOwner, "Only the owner can scan/update status");

        // 2. Update the status in the registry
        registryContract.updateStatus(_productId, _newStatus);
    }

    function transferOwnership(uint256 _productId, address _newOwner) external {
        address currentOwner = registryContract.getProductOwner(_productId);
        require(msg.sender == currentOwner, "Not the owner");
        registryContract.updateOwner(_productId, _newOwner);
    }
}