// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "./Ownable.sol";
import "./Destroyable.sol";

contract Bet is Ownable, Destroyable {
  function addFunds() public payable ownerOnly returns(uint) {
    return address(this).balance;
  }
}
