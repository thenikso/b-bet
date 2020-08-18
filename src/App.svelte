<script>
  import { account, accountBalance } from "./stores/account.js";
  import { contract, contractBalance } from "./stores/contract.js";
  import ConnectMetamask from "./components/ConnectMetamask.svelte";
  import Wallet from "./components/Wallet.svelte";
  import web3 from "./web3.js";
  import confetti from "canvas-confetti";

  let betContract;
  let betAmount;
  let betHead = true;
  let betting = false;
  let resultMessage;

  $: maxBet = Math.min($contractBalance / 2, $accountBalance);

  async function setAccount(e) {
    $account = e.detail.account;
  }

  async function flipCoin() {
    if (typeof betAmount !== "number" || betAmount <= 0 || betAmount > maxBet) {
      return;
    }
    betting = true;
    const value = web3.utils.toWei(String(betAmount), "ether");
    console.log("Begging", value);
    try {
      const result = await $contract.methods
        .flipCoin(betHead ? 1 : 0)
        .send({ value });
      const wonAmount = web3.utils.fromWei(
        result.events.coinFlipped.returnValues.won,
        "ether"
      );
      betAmount = undefined;
      betting = false;
      if (wonAmount !== "0") {
        fireworks();
      } else {
        snow();
      }
    } catch (e) {
      betting = false;
    }
  }

  function fireworks(duration = 3000) {
    resultMessage = "You won!!!";
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        resultMessage = undefined;
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      );
    }, 250);
  }

  function snow(duration = 2000) {
    resultMessage = "You lost :(";
    const animationEnd = Date.now() + duration;
    let skew = 1;

    (function frame() {
      const timeLeft = animationEnd - Date.now();
      const ticks = Math.max(200, 500 * (timeLeft / duration));
      skew = Math.max(0.8, skew - 0.001);

      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks,
        gravity: 0.5,
        origin: {
          x: Math.random(),
          // since particles fall down, skew start toward the top
          y: Math.random() * skew - 0.2
        },
        colors: ["#dddddd"],
        shapes: ["circle"]
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      } else {
        resultMessage = undefined;
      }
    })();
  }
</script>

<style>
  main {
    width: 100%;
    height: 100%;
    background-image: radial-gradient(
      50% 50% at 50% 50%,
      rgba(255, 0, 122, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    background-position: 0px -30vh;
    background-repeat: no-repeat;
  }

  header {
    padding: 10px;
    display: flex;
    flex-flow: row-reverse;
  }

  .title {
    font-family: "Concert One";
    text-align: center;
    color: rgb(230, 0, 110);
    font-size: 60px;
  }

  .bet-form {
    margin: 50px auto;

    position: relative;
    max-width: 420px;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px,
      rgba(0, 0, 0, 0.04) 0px 16px 24px, rgba(0, 0, 0, 0.01) 0px 24px 32px;
    opacity: 1;
    background: rgb(255, 255, 255);
    border-radius: 30px;
    padding: 1rem;
  }

  .input-wrapper {
    background-color: rgb(255, 255, 255);
    border-radius: 20px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(247, 248, 250);
    border-image: initial;
  }

  .input-wrapper label {
    display: block;
    padding: 0.75rem 1rem 0px;
    font-weight: 500;
    font-size: 14px;
    color: rgb(86, 90, 105);
    margin: 0px;
  }

  .input-field {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    flex-flow: row nowrap;
    padding: 0.75rem 0.75rem 0.75rem 1rem;
  }

  .input-field input {
    color: rgb(0, 0, 0);
    width: 0px;
    position: relative;
    font-weight: 500;
    background-color: rgb(255, 255, 255);
    font-size: 24px;
    white-space: nowrap;
    text-overflow: ellipsis;
    appearance: textfield;
    outline: none;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
    flex: 1 1 auto;
    overflow: hidden;
    padding: 0px;
  }

  .input-field .currency {
    font-weight: 500;
    font-size: 24px;
    padding: 0 10px;
  }

  .bet-form button {
    outline: none;
    cursor: pointer;

    border: none;
    border-radius: 6px;
    background-color: rgb(253, 234, 241);
    color: rgb(255, 0, 122);
    padding: 5px;

    text-align: center;
    font-weight: 500;
    font-size: 14px;
  }

  .bet-form button:hover:not(:disabled) {
    background-color: rgb(252, 220, 232);
  }

  .bet-form button:disabled {
    opacity: 0.5;
  }

  .bet-form button.callout {
    width: 100%;
    padding: 18px;
    font-size: 18px;
    border-radius: 18px;
  }

  .bet-form button.outline {
    outline: none;
    cursor: pointer;

    border: 1px solid rgb(255, 0, 122);
    border-radius: 6px;
    background: none;
    color: rgb(255, 0, 122);
    padding: 5px;

    font-weight: 500;
    font-size: 14px;
  }

  .bet-form button.outline:hover {
    border-color: rgb(230, 0, 110);
    color: rgb(230, 0, 110);
  }

  .bet-form button.select {
    flex-grow: 1;
    font-size: 24px;
    border: 1px solid rgb(218, 218, 218);
    border-radius: 12px;
    background: none;
    color: rgb(168, 168, 168);
    padding: 5px;
    margin: 0 5px;
  }

  .bet-form button.select.selected {
    color: white;
    background-color: rgb(218, 218, 218);
  }

  .bet-form .sep {
    padding: 0.5rem 1rem;
  }
</style>

<main>
  <header>
    <ConnectMetamask on:connected={setAccount} let:account>
      <Wallet balance={$accountBalance} {account} />
    </ConnectMetamask>
  </header>
  <h1 class="title">{resultMessage || 'You Bet!'}</h1>
  <div class="bet-form">
    <div class="input-wrapper">
      <label for="amount">Bet amount</label>
      <div class="input-field">
        <input
          id="amount"
          type="number"
          min="0"
          max={maxBet}
          step="0.01"
          inputmode="decimal"
          pattern="^[0-9]*[.,]?[0-9]*$"
          bind:value={betAmount}
          placeholder="0.0"
          spellcheck="false"
          autocorrect="off"
          autocomplete="off" />
        <span class="currency">ETH</span>
        <button
          type="button"
          class="outline"
          on:click={() => {
            betAmount = maxBet;
          }}>
          MAX
        </button>
      </div>
    </div>
    <div class="sep">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#565A69"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    </div>
    <div class="input-wrapper">
      <label for="head">Bet on</label>
      <div class="input-field">
        <button
          type="button"
          class="select"
          class:selected={betHead}
          on:click={() => {
            betHead = true;
          }}>
          HEAD
        </button>
        <button
          type="button"
          class="select"
          class:selected={!betHead}
          on:click={() => {
            betHead = false;
          }}>
          TAIL
        </button>
      </div>
    </div>
    <div class="sep" />
    <button
      type="button"
      class="callout"
      on:click={flipCoin}
      disabled={betting}>
      Place bet
    </button>
  </div>

</main>
