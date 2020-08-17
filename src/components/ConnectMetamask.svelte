<script>
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  const hasMetaMask = typeof window.ethereum !== "undefined";

  let account;

  onMount(() => {
    if (!hasMetaMask) return;

    if (window.ethereum.selectedAddress) {
      account = window.ethereum.selectedAddress;
      dispatchConnected(account);
    }

    ethereum.on("accountsChanged", setAccount);
  });

  //
  // Dispatchers
  //

  const dispatch = createEventDispatcher();

  function dispatchConnected(account) {
    dispatch("connected", { account });
  }

  //
  // Functions
  //

  async function connectMetamask() {
    let accounts;
    if (typeof window.ethereum.request === "function") {
      accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
    } else {
      accounts = await window.ethereum.enable();
    }
    setAccount(accounts);
  }

  function setAccount(accounts) {
    if (accounts[0] && accounts[0] !== account) {
      account = accounts[0];
      dispatchConnected(account);
    }
  }
</script>

{#if account}
  <slot {account}>connected</slot>
{:else if hasMetaMask}
  <button type="button" on:click={connectMetamask}>Connect to Wallet</button>
{:else}
  <a href="https://metamask.io/" target="_blank">Install MetaMask</a>
{/if}
