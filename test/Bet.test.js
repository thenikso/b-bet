const truffleAssert = require('truffle-assertions');
const Bet = artifacts.require('Bet');
const Oracle = artifacts.require('Oracle');
const BN = web3.utils.BN;
const { spawn } = require('child_process');

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

  let oracle;
  let oracleProcess;

  before(async () => {
    const bet = await Bet.deployed();
    console.log('Bet contract address', bet.address);
    oracle = await Oracle.deployed();
    const { promise, resolve } = deferred();
    oracleProcess = spawn('node', ['oracle.js', '-c', oracle.address]);
    oracleProcess.stdout.on('data', (data) => {
      console.log(`oracle: ${data}`);
      resolve();
    });
    await promise;
  });

  after(async () => {
    oracleProcess.kill();
    const bet = await Bet.deployed();
    bet.destroy();
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

  it('should accept a bet', async () => {
    const bet = await Bet.deployed();
    const value = (0.1).ether;
    const { promise: betResolvedEvent, resolve } = deferred();
    bet.betResolved().on('data', (event) => {
      resolve(event);
    });
    const place = await bet.flipCoin(1, { value, from: guest });
    const betPlaced = place.logs[0].args;
    const res = await Promise.race([betResolvedEvent, timeout(5000, true)]);
    const betResolved = res.returnValues;
    assert.equal(betPlaced.betId, betResolved.betId);
    assert.equal(betPlaced.player, betResolved.player);
    assert.equal(betPlaced.amount, betResolved.amount);
  });
});

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function timeout(ms, rejectInstead) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      rejectInstead ? reject('timeout') : resolve();
    }, ms);
  });
}
