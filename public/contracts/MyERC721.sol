// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyERC721 is ERC721 {
    constructor() ERC721("MyNFT", "MNFT") {
        // Hardcoded number of tokens to mint for the contract creator upon deployment
        uint256 numberOfTokensToMint = 100;
        for (uint256 i = 1; i <= numberOfTokensToMint; i++) {
            mint(msg.sender, i);
        }
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}