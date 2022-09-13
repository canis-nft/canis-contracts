// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CanisNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 public immutable CAP;
    string public baseTokenUri;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    event Initialized(
        uint256 cap,
        string tokenUri,
        string name,
        string symbol,
        address defaultRoyaltyReceiver,
        uint96 defaultFeeNumerator
    );

    constructor(
        uint256 cap_,
        string memory _baseTokenUri,
        string memory name,
        string memory symbol,
        address defaultRoyaltyReceiver,
        uint96 defaultFeeNumerator
    ) ERC721(name, symbol) {
        require(cap_ > 0, "NFTCapped: cap is 0");
        CAP = cap_;
        baseTokenUri = _baseTokenUri;
        super._setDefaultRoyalty(defaultRoyaltyReceiver, defaultFeeNumerator);
        emit Initialized(CAP, baseTokenUri, name, symbol, defaultRoyaltyReceiver, defaultFeeNumerator);
    }

    /********** GETTERS ***********/

    function _baseURI() internal view override returns (string memory) {
        return baseTokenUri;
    }

    /// @inheritdoc	IERC2981
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        public
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        return super.royaltyInfo(tokenId, salePrice);
    }

    /********** INTERFACE ***********/

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function safeMint() external returns (uint256) {
        require(balanceOf(msg.sender) == 0, "CANISNFT: OWNER CANNOT HAVE MORE THAN ONE NFT");
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < CAP, "NFTCAPPED: cap exceeded");

        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, newTokenId);

        return newTokenId;
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
