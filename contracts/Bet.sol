// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "./Ownable.sol";
import "./Destroyable.sol";

contract Bet is Ownable, Destroyable {
  function addFunds() public payable ownerOnly returns(uint) {
    return address(this).balance;
  }

  uint private nonce = 0;

  function flipCoin() public payable returns(uint) {
    require(msg.value > 0, "Needs an ETH amount to bet");
    uint maxBet = (address(this).balance - msg.value) / 2;
    require(msg.value <= maxBet, "Not enought funds to accept bet");
    // TODO make this actual random
    uint flip = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % 2;
    if (flip == 1) {
      uint wonBet = msg.value * 2;
      msg.sender.transfer(wonBet);
      return wonBet;
    }
    return 0;
  }
}
