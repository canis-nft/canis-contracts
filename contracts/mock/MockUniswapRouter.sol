// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUniswapRouter is Ownable {
    using SafeERC20 for IERC20;
    address private WETHToken;
    address public UBIToken;
    uint256 public mulFactor;

    constructor(
        address _weth,
        address _ubiToken,
        uint256 _mulFactor
    ) {
        require(_weth != address(0), "WETH ADDRESS CANNOT BE ZERO");
        WETHToken = _weth;
        UBIToken = _ubiToken;
        mulFactor = _mulFactor;
    }

    function setMulFactor(uint256 _mulFactor) public onlyOwner {
        mulFactor = _mulFactor;
    }

    function WETH() public view returns (address) {
        return WETHToken;
    }

    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts) {
        require(IERC20(UBIToken).balanceOf(address(this)) > 0, "NO MORE UBIS LEFT TO GIVE");
        IERC20(UBIToken).transfer(msg.sender, amountOut * mulFactor);
    }
}
