const Bet = artifacts.require('Bet');

module.exports = async function (deployer, network, accounts) {
  const instance = await Bet.deployed();
  if (instance) {
    await instance.destroy();
  }

  const bet = await deployer.deploy(Bet);
  await bet.addFunds({ value: 1e18 });
};
