<script>
  import { account, balance } from "./stores/account.js";
  import ConnectMetamask from "./components/ConnectMetamask.svelte";

  let flip = false;

  function setAccount(e) {
    $account = e.detail.account;
  }
</script>

<style>
  main {
    width: 100%;
    height: 100%;
    color: white;
    background: rgb(32, 14, 49);
    background: linear-gradient(
      135deg,
      rgba(32, 14, 49, 1) 0%,
      rgba(58, 10, 79, 1) 50%,
      rgba(32, 14, 49, 1) 100%
    );
  }
</style>

<main
  on:click={() => {
    flip = !flip;
  }}>
  <ConnectMetamask on:connected={setAccount} let:account>
    ciao {account} you have {$balance} ETH
  </ConnectMetamask>
  {#if flip}
    <img src="/coin_flip.gif" alt="" style="width: 100%" />
  {/if}
</main>
