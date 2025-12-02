// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./PharmaLibrary.sol";

contract ProductRegistry is AccessControl {
    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

    // State variables
    mapping(uint256 => PharmaLibrary.Product) private products;
    mapping(string => bool) public batchNumberExists;
    uint256 private _productIdCounter;

    // Events
    event ProductAdded(uint256 indexed productId, string batchNumber);
    event ProductUpdated(uint256 indexed productId, string updateType);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // --- Write Functions (Restricted to Controllers) ---

    function addProduct(PharmaLibrary.Product memory product) external onlyRole(CONTROLLER_ROLE) returns (uint256) {
        require(!batchNumberExists[product.batchNumber], "Batch already exists");
        
        uint256 newId = ++_productIdCounter;
        product.productId = newId;
        product.isValid = true;
        
        products[newId] = product;
        batchNumberExists[product.batchNumber] = true;
        
        emit ProductAdded(newId, product.batchNumber);
        return newId;
    }

    function updateOwner(uint256 _productId, address _newOwner) external onlyRole(CONTROLLER_ROLE) {
        require(products[_productId].isValid, "Product invalid");
        products[_productId].currentOwner = _newOwner;
        emit ProductUpdated(_productId, "Owner");
    }

    // *** THIS IS THE MISSING FUNCTION YOU NEED ***
    function updateStatus(uint256 _productId, PharmaLibrary.ProductStatus _status) external onlyRole(CONTROLLER_ROLE) {
        require(products[_productId].isValid, "Product invalid");
        products[_productId].status = _status;
        emit ProductUpdated(_productId, "Status");
    }

    function setVerified(uint256 _productId, bool _status) external onlyRole(CONTROLLER_ROLE) {
        require(products[_productId].isValid, "Product invalid");
        products[_productId].isVerified = _status;
        emit ProductUpdated(_productId, "Verification");
    }

    // --- Read Functions (Public) ---

    function getProduct(uint256 _productId) external view returns (PharmaLibrary.Product memory) {
        return products[_productId];
    }

    function getProductOwner(uint256 _productId) external view returns (address) {
        return products[_productId].currentOwner;
    }
}