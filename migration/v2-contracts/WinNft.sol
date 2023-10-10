// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WinNft is ERC721 {
    string public constant TOKEN_URI =
        "ipfs://QmYbuN73rMQJqo7ZhEt9jxtbCk64tQUzGEHFQoXbyaiQwN/?filename=WinNft.json";
    uint256 private s_tokenCounter;

    constructor() ERC721("Match won", "Mw") {
        s_tokenCounter = 0;
    }

    function mintNft(address _receiver) public {
        _safeMint(_receiver, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function tokenURI(
        uint256 /* tokenId */
    ) public pure override returns (string memory) {
        // Original version is cooler
        // require(_exists(tokenId))
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
