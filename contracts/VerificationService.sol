//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./PharmaRoles.sol";
import "./ProductRegistry.sol";
import "./PharmaLibrary.sol";

contract VerificationService {
    PharmaRoles public rolesContract;
    ProductRegistry public registryContract;

    constructor(address _roles, address _registry) {
        rolesContract = PharmaRoles(_roles);
        registryContract = ProductRegistry(_registry);
    }

    function verifyProduct(uint256 _productId) external {
        // 1. Check Role
        require(rolesContract.isRegulator(msg.sender), "Caller is not a regulator");

        // 2. Check Product Exists
        PharmaLibrary.Product memory p = registryContract.getProduct(_productId);
        require(p.isValid, "Product does not exist");

        // 3. Write to Registry
        registryContract.setVerified(_productId, true);
    }
}