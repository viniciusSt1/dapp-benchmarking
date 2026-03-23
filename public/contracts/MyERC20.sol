// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {

    constructor() ERC20("MeuToken", "MTK") {
        uint256 supply = 1_000_000 * 10 ** decimals();
        _mint(msg.sender, supply);
    }
}