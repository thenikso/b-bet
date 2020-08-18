import { derived, readable } from 'svelte/store';
import web3 from '../web3.js';
import { account } from './account.js';

export const contract = derived(account, async ($account, set) => {
  const { abi, networks } = await fetch('/contracts/Bet.json').then((res) =>
    res.json(),
  );
  let address;
  if (
    !address &&
    networks &&
    typeof window.ethereum !== 'undefined' &&
    window.ethereum.networkVersion &&
    networks[window.ethereum.networkVersion]
  ) {
    address = networks[window.ethereum.networkVersion].address;
  }
  const options = {};
  if ($account) {
    options.from = $account;
  }
  set(new web3.eth.Contract(abi, address, options));
});

export const contractBalance = derived(
  contract,
  async ($contract, set) => {
    if (!$contract) {
      return set(0);
    }
    const contractAddress = $contract._address;
    const updateBalance = async () => {
      const wei = await web3.eth.getBalance(contractAddress);
      set(wei / 1e18);
    };
    const sub = web3.eth.subscribe('newBlockHeaders', updateBalance);
    updateBalance();
    return () => {
      sub.unsubscribe();
    };
  },
  0,
);
