<script>
  import { account, accountBalance } from "./stores/account.js";
  import { contract, contractBalance } from "./stores/contract.js";
  import ConnectMetamask from "./components/ConnectMetamask.svelte";
  import Wallet from "./components/Wallet.svelte";
  import web3 from "./web3.js";

  let betContract;
  let betAmount = 0;
  let betHead = true;

  $: maxBet = Math.min($contractBalance / 2, $accountBalance);

  async function setAccount(e) {
    $account = e.detail.account;
  }

  async function flipCoin() {
    // TODO validate inputs
    const value = web3.utils.toWei(String(betAmount), "ether");
    console.log("Begging", value);
    const result = await $contract.methods
      .flipCoin(betHead ? 1 : 0)
      .send({ value });
    console.log("win:", result.events.coinFlipped.returnValues.won !== "0");
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

  header {
    padding: 10px;
    display: flex;
    flex-flow: row-reverse;
  }

  .title {
    text-align: center;
    color: #c443a8;
    font-size: 60px;
  }
</style>

<main>
  <header>
    <ConnectMetamask on:connected={setAccount} let:account>
      <Wallet balance={$accountBalance} {account} />
    </ConnectMetamask>
  </header>
  <h1 class="title">You Bet!</h1>
  <input type="number" max={maxBet} step="0.1" bind:value={betAmount} />
  <input type="checkbox" bind:checked={betHead} />
  <button type="button" on:click={flipCoin}>Flip!</button>

</main>
