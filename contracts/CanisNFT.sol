// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CanisNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 public immutable CAP;
    uint256 public startGiftingIndex;
    uint256 public endGiftingIndex;
    string public baseTokenUri;
    string public contractUri;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _tokenIdClaimedCounter;

    event Initialized(
        uint256 cap,
        string tokenUri,
        string name,
        string symbol,
        address defaultRoyaltyReceiver,
        uint96 defaultFeeNumerator,
        uint256 startGiftingIndex,
        uint256 endGiftingIndex
    );
    event DefaultRoyaltyUpdated(address indexed royaltyReceiver, uint96 feeNumerator);
    event TokenRoyaltyUpdated(uint256 indexed tokenId, address indexed receiver, uint96 feeNumerator);
    event TokenRoyaltyReseted(uint256 indexed tokenId);
    event ContractURIUpdated(string indexed contractUri);
    event GiftingIndexesUpdated(uint256 startGiftingIndex, uint256 endGiftingIndex);
    event Claim(address indexed to, uint256 tokenId);

    constructor(
        uint256 cap_,
        string memory _baseTokenUri,
        string memory name,
        string memory symbol,
        address defaultRoyaltyReceiver,
        uint96 defaultFeeNumerator,
        uint256 _startGiftingIndex,
        uint256 _endGiftingIndex
    ) ERC721(name, symbol) {
        require(cap_ > 0, "NFTCapped: cap is 0");
        CAP = cap_;
        baseTokenUri = _baseTokenUri;
        startGiftingIndex = _startGiftingIndex;
        endGiftingIndex = _endGiftingIndex;
        super._setDefaultRoyalty(defaultRoyaltyReceiver, defaultFeeNumerator);
        emit Initialized(
            CAP,
            baseTokenUri,
            name,
            symbol,
            defaultRoyaltyReceiver,
            defaultFeeNumerator,
            startGiftingIndex,
            endGiftingIndex
        );
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
        require(tokenId < CAP, "CANISNFT: TOKEN ID DOES NOT EXIST");
        return super.royaltyInfo(tokenId, salePrice);
    }

    /********** GETTERS ***********/

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) external onlyOwner {
        super._setDefaultRoyalty(receiver, feeNumerator);
        emit DefaultRoyaltyUpdated(receiver, feeNumerator);
    }

    function setGiftingIndexes(uint256 startIndex, uint256 endIndex) external onlyOwner {
        startGiftingIndex = startIndex;
        endGiftingIndex = endIndex;
        emit GiftingIndexesUpdated(startIndex, endIndex);
    }

    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 feeNumerator
    ) external onlyOwner {
        require(tokenId < CAP, "CANISNFT: TOKEN ID DOES NOT EXIST");
        super._setTokenRoyalty(tokenId, receiver, feeNumerator);
        emit TokenRoyaltyUpdated(tokenId, receiver, feeNumerator);
    }

    function resetTokenRoyalty(uint256 tokenId) external onlyOwner {
        require(tokenId < CAP, "CANISNFT: TOKEN ID DOES NOT EXIST");
        super._resetTokenRoyalty(tokenId);
        emit TokenRoyaltyReseted(tokenId);
    }

    /********** INTERFACE ***********/

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function safeMint() external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < CAP, "NFTCAPPED: cap exceeded");
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        require(newTokenId < startGiftingIndex && newTokenId > endGiftingIndex, "CANISNFT: CANNOT MINT GIFTABLE NFT");
        _safeMint(this.owner(), newTokenId);
        return newTokenId;
    }

    function giftNFT(address to) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        require(tokenId < CAP, "NFTCAPPED: cap exceeded");
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        require(
            newTokenId >= startGiftingIndex && newTokenId <= endGiftingIndex,
            "CANISNFT: CANNOT MINT NON GIFTABLE NFT"
        );
        _safeMint(to, newTokenId);
        return newTokenId;
    }

    function claim() external returns (bool) {
        require(balanceOf(msg.sender) == 0, "CANISNFT: OWNER CANNOT HAVE MORE THAN ONE NFT");
        uint256 tokenId = _tokenIdClaimedCounter.current();
        require(tokenId < CAP, "NFTCAPPED: no more NFTs left to claim");
        _tokenIdClaimedCounter.increment();
        uint256 newTokenId = _tokenIdClaimedCounter.current();
        if (this.ownerOf(newTokenId) == address(this)) {
            _tokenIdClaimedCounter.increment();
            return false;
        } else {
            this.safeTransferFrom(address(this), msg.sender, newTokenId);
            emit Claim(msg.sender, newTokenId);
            return true;
        }
    }

    // The following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    //openSea integration royalty. See https://docs.opensea.io/docs/contract-level-metadata
    function contractURI() public view returns (string memory) {
        return contractUri;
    }

    function setContractURI(string memory uri) public {
        contractUri = uri;
        emit ContractURIUpdated(contractUri);
    }
}
