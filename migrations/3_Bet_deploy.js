const Bet = artifacts.require('Bet');
const Oracle = artifacts.require('Oracle');

module.exports = async function (deployer, network, accounts) {
  const instance = await Bet.deployed().catch(() => null);
  if (instance) {
    await instance.destroy();
  }

  const oracle = await Oracle.deployed();

  const bet = await deployer.deploy(Bet);
  await bet.oracle_setAddress(oracle.address);
  await bet.addFunds({ value: 1e18 });
};
