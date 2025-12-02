//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract PharmaRoles is AccessControl {
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");
    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function isManufacturer(address account) external view returns (bool) { return hasRole(MANUFACTURER_ROLE, account); }
    function isDistributor(address account) external view returns (bool) { return hasRole(DISTRIBUTOR_ROLE, account); }
    function isRetailer(address account) external view returns (bool) { return hasRole(RETAILER_ROLE, account); }
    function isRegulator(address account) external view returns (bool) { return hasRole(REGULATOR_ROLE, account); }
    
    // Helper to grant roles easily for testing
    function grantManufacturer(address account) external onlyRole(DEFAULT_ADMIN_ROLE) { _grantRole(MANUFACTURER_ROLE, account); }
    function grantRegulator(address account) external onlyRole(DEFAULT_ADMIN_ROLE) { _grantRole(REGULATOR_ROLE, account); }
}