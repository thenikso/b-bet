// SPDX-License-Identifier: MIT
pragma solidity 0.7.0;

import "./Ownable.sol";

abstract contract usingOracle is Ownable {
  address private customOracleAddress;

  uint internal lastRandomNumber;

  function oracle_setAddress(address oracleAddress) public ownerOnly {
    customOracleAddress = oracleAddress;
  }

  function oracle_address() internal view returns(address) {
    return customOracleAddress;
  }

  modifier onlyFromOracle {
    require(msg.sender == oracle_address());
    _;
  }

  function oracle_requestRandomNumber(uint value) internal returns(uint) {
    (bool ok, bytes memory returnData) = oracle_address().call{ value: value }(abi.encodeWithSignature("requestRandomNumber()"));
    require(ok, "Could not call oracle contract");
    (uint id) = abi.decode(returnData, (uint));
    return id;
  }

  function oracle_receiveRandomNumber(uint id, uint randomNumber) public virtual onlyFromOracle {
    lastRandomNumber = randomNumber;
  }
}
