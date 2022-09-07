// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CanisNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 public CAP;
    string public baseTokenUri;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    event Initialized(uint256 cap, string tokenUri, string name, string symbol);
    event CAPUpdated(uint256 oldCap, uint256 newCap);

    constructor(
        uint256 cap_,
        string memory _baseTokenUri,
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        require(cap_ > 0, "NFTCapped: cap is 0");
        CAP = cap_;
        baseTokenUri = _baseTokenUri;
        emit Initialized(CAP, baseTokenUri, name, symbol);
    }

    /********** GETTERS ***********/

    function _baseURI() internal view override returns (string memory) {
        return baseTokenUri;
    }

    /********** SETTERS ***********/
    function setCap(uint256 _newCap) public onlyOwner {
        uint256 oldCap = CAP;
        require(CAP > 0, "NFTCapped: cap is 0");
        CAP = _newCap;
        emit CAPUpdated(oldCap, _newCap);
    }

    /********** INTERFACE ***********/

    function safeMint() external returns (uint256) {
        require(balanceOf(msg.sender) == 0, "OWNER CANNOT HAVE MORE THAN ONCE NFT");
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < CAP, "NFTCAPPED: cap exceeded");

        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, newTokenId);

        return newTokenId;
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
