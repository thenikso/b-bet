// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

abstract contract Ownable {
  address internal owner = msg.sender;

  modifier ownerOnly() {
    require(msg.sender == owner);
    _;
  }

  function transferOwnership(address newOwner) public ownerOnly {
    owner = newOwner;
  }
}
