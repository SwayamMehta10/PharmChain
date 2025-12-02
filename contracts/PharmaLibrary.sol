// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library PharmaLibrary {
    enum ProductStatus { Originated, Shipped, Received, InStorage, Delivered, Recalled }

    struct Product {
        uint256 productId;
        string name;
        string batchNumber;
        uint256 manufacturingDate;
        uint256 expiryDate;
        address manufacturer;
        address currentOwner;
        ProductStatus status;
        string ipfsHash;
        bool isValid;
        bool isVerified;
    }
}