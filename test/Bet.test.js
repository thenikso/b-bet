const truffleAssert = require('truffle-assertions');
const Bet = artifacts.require('Bet');
const BN = web3.utils.BN;

contract('Bet', (accounts) => {
  after(async () => {
    const bet = await Bet.deployed();
    await bet.destroy();
  });

  it('should have 1 ETH when deployed', async () => {
    const bet = await Bet.deployed();
    const balance = await web3.eth.getBalance(bet.address);
    assert.equal(
      balance,
      web3.utils.toWei('1', 'ether'),
      '1 ETH not in the contract balance',
    );
  });

  it('should not addFunds as non owner', async () => {
    const bet = await Bet.deployed();
    await truffleAssert.fails(
      bet.addFunds({ value: 10000, from: accounts[1] }),
    );
  });

  it('should be able to add funds as owner', async () => {
    const bet = await Bet.deployed();
    const initialBalance = await web3.eth.getBalance(bet.address);
    const value = 10000;
    await truffleAssert.passes(bet.addFunds({ value, from: accounts[0] }));
    const balance = await web3.eth.getBalance(bet.address);
    assert.equal(balance, new BN(initialBalance).add(new BN(value)));
  });
});
