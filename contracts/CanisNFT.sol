// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CanisNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 public immutable _cap;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(uint256 cap_) ERC721("Canis", "CAN") {
        require(cap_ > 0, "NFTCapped: cap is 0");
        _cap = cap_;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://bafybeiahsj6so2jofeadwprofvphxo6g5d662xwzolztg6xgs3g4qa4vvi.ipfs.nftstorage.link/metadata/";
    }

    /**
     * It starts from one.
     */
    function safeMint(address to) public onlyOwner returns (uint256) {
        require(balanceOf(to) == 0, "OWNER CANNOT HAVE MORE THAN ONCE NFT");
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId <= _cap, "NFTCAPPED: cap exceeded");

        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(to, newTokenId);

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
