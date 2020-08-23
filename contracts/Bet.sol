// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "./Ownable.sol";
import "./Destroyable.sol";
import "./usingOracle.sol";

contract Bet is Ownable, Destroyable, usingOracle {
  function addFunds() public payable ownerOnly returns(uint) {
    freeBalance += msg.value;
    return address(this).balance;
  }

  // We store the contract balance that can be used for bets. If a bet is in
  // progress, it might be a winning one so we assume so until we know the outcome.
  uint private freeBalance = 0;

  struct PlacedBet {
    address payable player;
    uint betOn;
    uint amount;
  }

  mapping(uint => PlacedBet) private bets;

  event betPlaced(uint betId, address player, uint betOn, uint amount);
  event betResolved(uint betId, address player, uint betOn, uint amount, uint winAmount);

  function flipCoin(uint betOn) public payable returns(uint) {
    require(betOn <= 1, "You can bet on 1 or 0");
    require(msg.value > 0, "Needs an ETH amount to bet");

    freeBalance -= msg.value;
    require(freeBalance >= msg.value, "Not enought funds to accept bet");


    uint betId = oracle_requestRandomNumber(30000 gwei);
    bets[betId] = PlacedBet(msg.sender, betOn, msg.value);

    emit betPlaced(betId, msg.sender, betOn, msg.value);

    return betId;
  }

  function oracle_receiveRandomNumber(uint id, uint randomNumber) public override onlyFromOracle {
    PlacedBet memory placedBet = bets[id];

    uint flip = randomNumber % 2;

    uint wonBet = 0;
    if (flip == placedBet.betOn) {
      wonBet = placedBet.amount * 2;
      placedBet.player.transfer(wonBet);
    } else {
      freeBalance += placedBet.amount * 2;
    }

    emit betResolved(id, placedBet.player, placedBet.betOn, placedBet.amount, wonBet);

    delete bets[id];
  }
}
