// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "./Ownable.sol";
import "./Destroyable.sol";

contract Oracle is Ownable, Destroyable {
  uint private lastID = 0;

  event requestRandom(uint id, address replyTo, uint value);

  function requestRandomNumber() public payable returns(uint) {
    require(msg.value > 0, 'Need some gas');
    lastID++;
    emit requestRandom(lastID, msg.sender, msg.value);
    return lastID;
  }

  function respondRandomNumber(address replyTo, uint id, uint randomNumber, uint maxGas) external payable ownerOnly {
    (bool ok, ) = replyTo.call{ gas: maxGas }(abi.encodeWithSignature("oracle_receiveRandomNumber(uint256,uint256)", id, randomNumber));
    if (ok == false) {
      // TODO refund value
    }
  }
}
