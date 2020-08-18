const truffleAssert = require('truffle-assertions');
const Bet = artifacts.require('Bet');
const BN = web3.utils.BN;

if (typeof Number.prototype.ether === 'undefined') {
  Object.defineProperties(Number.prototype, {
    gwei: {
      get: function () {
        return web3.utils.toWei(String(this), 'gwei');
      },
    },
    ether: {
      get: function () {
        return web3.utils.toWei(String(this), 'ether');
      },
    },
  });
}

contract('Bet', (accounts) => {
  const owner = accounts[0];
  const guest = accounts[1];

  after(async () => {
    const bet = await Bet.deployed();
    await bet.destroy();
  });

  it('should have 1 ETH when deployed', async () => {
    const bet = await Bet.deployed();
    const balance = await web3.eth.getBalance(bet.address);
    assert.equal(balance, (1).ether, '1 ETH not in the contract balance');
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
    await truffleAssert.passes(bet.addFunds({ value, from: owner }));
    const balance = await web3.eth.getBalance(bet.address);
    assert.equal(balance, new BN(initialBalance).add(new BN(value)));
  });

  it('should NOT flipCoin if no value is sent', async () => {
    const bet = await Bet.deployed();
    await truffleAssert.fails(bet.flipCoin(1, { value: 0, from: guest }));
  });

  it('should NOT flipCoin if value can not be doubled', async () => {
    const bet = await Bet.deployed();
    const balance = await web3.eth.getBalance(bet.address);
    const value = new BN(balance).div(new BN(2)).add(new BN(1)).toString();
    await truffleAssert.fails(bet.flipCoin(1, { value, from: guest }));
  });

  it('should flipCoin and double or zero gets money', async () => {
    const bet = await Bet.deployed();
    const value = (1000).gwei;
    const results = await Promise.all(
      Array.from({ length: 6 }).map((_, i) =>
        bet.flipCoin.call(1, { value, from: accounts[i + 1] }),
      ),
    );
    const zero = new BN(0);
    const won = results.filter((v) => v.gt(zero));
    const lost = results.filter((v) => v.eq(zero));
    assert(won.length > 0, 'Nothing was won!');
    assert(lost.length > 0, 'Nothing was lost!');
  });
});
