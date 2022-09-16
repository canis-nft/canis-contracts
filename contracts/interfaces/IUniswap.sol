//SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.9;

/**
 * @title UniswapV2
 * @dev Simpler version of Uniswap v2 and v3 protocol interface
 */
interface IUniswapV2 {
    //Uniswap V2

    function WETH() external pure returns (address);

    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
    function getAmountsOut(uint256 amountIn, address[] memory path) external view returns (uint256[] memory amounts);

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);
}
