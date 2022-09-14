// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Royalty is Ownable {
    address public royaltyReceiver;

    event Initialized(address indexed royaltyReceiver);
    event RoyaltyReceiverUpdated(address indexed royaltyReceiver);
    event RoyaltyReceived(address indexed sender, uint256 indexed amount);
    event ShareoutExecuted(uint256 indexed amount);

    constructor(address _royaltyReceiver) {
        royaltyReceiver = _royaltyReceiver;
        emit Initialized(royaltyReceiver);
    }

    function setRoyaltyReceiver(address _royaltyReceiver) external onlyOwner {
        royaltyReceiver = _royaltyReceiver;
        emit RoyaltyReceiverUpdated(royaltyReceiver);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function shareout() public onlyOwner {
        require(address(this).balance > 0, "There is not available founds to transfer");
        uint256 balance = address(this).balance;
        (bool sent, ) = royaltyReceiver.call{value: balance}("");
        require(sent, "Failed to send Ether");
        emit ShareoutExecuted(balance);
    }

    receive() external payable {
        emit RoyaltyReceived(msg.sender, msg.value);
    }
}
