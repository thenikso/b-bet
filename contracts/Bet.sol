// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "./Ownable.sol";
import "./Destroyable.sol";

contract Bet is Ownable, Destroyable {
  function addFunds() public payable ownerOnly returns(uint) {
    return address(this).balance;
  }

  uint private nonce = 0;

  event coinFlipped(uint won);

  function flipCoin(uint betOn) public payable returns(uint) {
    require(betOn <= 1, "You can bet on 1 or 0");
    require(msg.value > 0, "Needs an ETH amount to bet");
    uint maxBet = (address(this).balance - msg.value) / 2;
    require(msg.value <= maxBet, "Not enought funds to accept bet");
    // TODO make this actual random
    uint flip = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % 2;
    uint wonBet = 0;
    if (flip == betOn) {
      wonBet = msg.value * 2;
      msg.sender.transfer(wonBet);
    }
    emit coinFlipped(wonBet);
    return wonBet;
  }
}
