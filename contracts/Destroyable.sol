// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "./Ownable.sol";

abstract contract Destroyable is Ownable {
  function destroy() public ownerOnly {
    selfdestruct(msg.sender);
  }
}
