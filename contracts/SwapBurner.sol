// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IUniswap.sol";
import "./interfaces/IUBI.sol";
import "hardhat/console.sol";

/// @title Canis Swap and Burn
/// @notice contract that swaps native currency for UBI and burns it
/// @author Think and Dev
contract SwapBurner is Ownable {
    /// @dev address of the uniswap router
    address public Uniswap;
    /// @dev address of the UBI token
    address public immutable UBI;
    /// @dev deadline to make the swap in UniSwap
    uint256 public swapDeadline;

    event Initialized(address indexed uniswapRouter, address indexed ubiToken, uint256 swapDeadline);
    event UniswapApproved(uint256 amount);
    event UniswapAllowanceUpdated(uint256 oldAmount, uint256 newAmount);
    event SwapDeadLineUpdated(uint256 oldDeadline, uint256 newDeadline);
    event SwapAndBurn(address indexed sender, uint256 nativeAmount, uint256 UBIBurnedAmount);

    /**
     * @notice Modifier to check address is valid
     * @dev _address : Address to be checked not to be the zero address.
     * @dev message: Message to show on failure.
     */
    modifier isValidAddress(address _address, string memory message) {
        require(_address != address(0), message);
        _;
    }

    /// @notice Init contract
    /// @param _uniswapRouter address of Uniswap Router
    /// @param _ubiToken address of UBI token
    /// @param _swapDeadline deadline for swaps
    constructor(
        address _uniswapRouter,
        address _ubiToken,
        uint256 _swapDeadline
    )
        isValidAddress(_uniswapRouter, "Uniswap address can not be null")
        isValidAddress(_ubiToken, "UBI address can not be null")
    {
        Uniswap = _uniswapRouter;
        UBI = _ubiToken;
        swapDeadline = _swapDeadline;
        emit Initialized(Uniswap, UBI, swapDeadline);
    }

    /********** GETTERS ***********/

    /********** SETTERS ***********/

    /// @notice Approve UniswapRouter to take tokens
    /// @param amount amount of tokens to approve to Uniswap
    function approveUniSwap(uint256 amount) external onlyOwner {
        IUBI(UBI).approve(Uniswap, amount);
        emit UniswapApproved(amount);
    }

    /// @notice Increase amount of approved tokens to UniswapRouter
    /// @param amount amount of tokens to approve to Uniswap
    function increaseUniswapAllowance(uint256 amount) external onlyOwner {
        uint256 oldAllowance = IUBI(UBI).allowance(address(this), Uniswap);
        require(IUBI(UBI).increaseAllowance(Uniswap, amount) == true, "UBI INCREAS ALLOWANCE WENT WRONG");
        emit UniswapAllowanceUpdated(oldAllowance, amount);
    }

    /// @notice Decrease amount of approved tokens to UniswapRouter
    /// @param amount amount of tokens to approve to Uniswap
    function decreaseUniswapAllowance(uint256 amount) external onlyOwner {
        uint256 oldAllowance = IUBI(UBI).allowance(address(this), Uniswap);
        require(IUBI(UBI).decreaseAllowance(Uniswap, amount) == true, "UBI DECREASE ALLOWANCE WENT WRONG");
        emit UniswapAllowanceUpdated(oldAllowance, amount);
    }

    /// @notice Modifiy deadline for swaps in swapRouter
    /// @param newDeadline new deadline for swaps
    function setSwapDeadline(uint256 newDeadline) external onlyOwner {
        uint256 oldDeadline = swapDeadline;
        swapDeadline = newDeadline;
        emit SwapDeadLineUpdated(oldDeadline, newDeadline);
    }

    /********** INTERFACE ***********/

    /// @notice Given a value of ETH, know the amount of UBI it is equal to
    /// @param ethAmount eth amount to be converted to UBI
    function getEstimatedUBIforETH(uint256 ethAmount) internal view returns (uint256[] memory) {
        address[] memory path = new address[](2);
        path[0] = IUniswapV2(Uniswap).WETH();
        path[1] = UBI;

        return IUniswapV2(Uniswap).getAmountsOut(ethAmount, path);
    }

    /// @notice Swap ETH for UBI and Burn it
    function receiveSwapAndBurn() external payable returns (uint256[] memory amounts) {
        address[] memory path = new address[](2);
        path[0] = IUniswapV2(Uniswap).WETH();
        path[1] = UBI;

        uint256 initialNativeBalance = address(this).balance;
        uint256 ubiInitialBalance = IUBI(UBI).balanceOf(address(this));
        uint256 ubiAmount = (getEstimatedUBIforETH(msg.value))[0];
        amounts = IUniswapV2(Uniswap).swapETHForExactTokens{value: msg.value}(
            ubiAmount,
            path,
            address(this),
            swapDeadline
        );
        uint256 ubiFinalBalace = IUBI(UBI).balanceOf(address(this));

        require(ubiFinalBalace > ubiInitialBalance, "CanisSwap: SWAP FAILED");
        IUBI(UBI).burn(ubiFinalBalace - ubiInitialBalance);

        //Transfer Native dust from swap
        (bool sent, ) = payable(msg.sender).call{value: (msg.value) - (initialNativeBalance)}("");
        require(sent, "Failed to send Native currency dust");

        emit SwapAndBurn(msg.sender, msg.value, ubiFinalBalace - ubiInitialBalance);
    }

    /**
     * @notice Receive function to allow to UniswapRouter to transfer dust eth and be recieved by contract.
     */
    receive() external payable {}
}
