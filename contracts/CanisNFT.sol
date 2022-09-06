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
        return "https://bafybeia4wkas27dxzaqa65fey46m2iuantfxikqhjmlmxui7ii6se7aslq.ipfs.nftstorage.link/metadata/";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        require(balanceOf(to) == 0, "OWNER CANNOT HAVE MORE THAN ONCE NFT");
        uint256 tokenId = _tokenIdCounter.current();
        require((tokenId + 1) <= _cap, "NFTCAPPED: cap exceeded");
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
