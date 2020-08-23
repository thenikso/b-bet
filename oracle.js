const Web3 = require('web3');
const contract = require('./build/contracts/Oracle.json');

async function main(argv) {
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider('ws://' + argv.network),
  );
  const BN = web3.utils.BN;
  const owner = web3.eth.accounts.privateKeyToAccount(argv.account);
  const oracle = new web3.eth.Contract(contract.abi, argv.contract, {
    from: owner.address,
  });

  console.log('Oracle listening to', argv.contract);

  oracle.events
    .requestRandom({ fromBlock: 'latest' })
    .on('data', async (event) => {
      const { id, replyTo, value } = event.returnValues;
      const randomNumber = web3.utils.toBN(Math.round(Math.random() * 1e16));
      await oracle.methods
        .respondRandomNumber(replyTo, id, randomNumber, value)
        .send();
      console.log(`Random number (${randomNumber}) sent to ${replyTo} [${id}]`);
    });

  return closeOnCtrlC();
}

async function closeOnCtrlC() {
  process.stdin.setRawMode(true);
  let safetyOff = false;
  return new Promise((resolve) =>
    process.stdin.on('data', (data) => {
      const byteArray = [...data];
      if (byteArray.length > 0 && byteArray[0] === 3) {
        if (safetyOff) {
          process.stdin.setRawMode(false);
          resolve();
        } else {
          console.log('(To exit, press ^C again)');
          safetyOff = true;
        }
      } else {
        safetyOff = 0;
      }
    }),
  );
}

main(
  require('yargs')
    .scriptName('oracle')
    .usage('$0 <options>')
    .option('c', {
      alias: 'contract',
      type: 'string',
      describe: 'The oracle contract address',
      demandOption: true,
    })
    .option('a', {
      alias: 'account',
      type: 'string',
      describe:
        'The private key of the account to use to drive the oracle contract',
      // TODO do not expose private account key. this is a local, test only key
      default:
        '6370b091acadcd14d3d6a3c83e075ca6634139a3cba97351e92bbaee36d19476',
    })
    .option('n', {
      alias: 'network',
      default: '127.0.0.1:7545',
      type: 'string',
      describe: 'The Ethereum network to connect to',
    })
    .help()
    .alias('help', 'h').argv,
)
  .then(() => {
    console.log('Bye');
    process.exit(1);
  })
  .catch((e) => {
    console.error(e);
  });
