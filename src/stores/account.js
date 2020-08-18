import { writable, derived } from 'svelte/store';
import web3 from '../web3.js';

export const account = writable(null);

export const accountBalance = derived(
  [account],
  ([$account], set) => {
    if (!web3.utils.isAddress($account)) {
      return set(0);
    }
    const updateBalance = async () => {
      const wei = await web3.eth.getBalance($account);
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
