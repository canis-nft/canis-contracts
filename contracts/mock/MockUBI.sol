// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MockUBI is ERC20Burnable {
    constructor(uint256 supply) ERC20("UBI Token", "UBI") {
        _mint(msg.sender, supply);
    }
}
