const Oracle = artifacts.require('Oracle');

module.exports = async function (deployer, network, accounts) {
  const from = accounts[3];

  const instance = await Oracle.deployed().catch(() => null);
  if (instance) {
    await instance.destroy({ from });
  }

  return deployer.deploy(Oracle, { from });
};
