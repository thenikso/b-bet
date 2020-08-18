import App from './App.svelte';

const app = new App({
  target: document.body,
});

window.app = app;

export default app;

if (typeof window.ethereum !== 'undefined') {
  ethereum.on('chainChanged', (chainId) => {
    // NOTE chainId == '0x1' is the ethereum mainnet
    // Handle the new chain.
    // Correctly handling chain changes can be complicated.
    // We recommend reloading the page unless you have a very good reason not to.
    window.location.reload();
  });
}
