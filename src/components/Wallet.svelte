<script>
  import Avatars from "@dicebear/avatars";
  import sprites from "@dicebear/avatars-human-sprites";

  const avatars = new Avatars(sprites, { mood: ["happy"] });

  export let account;
  export let balance = 0;

  $: roundedBalance = Math.round(balance * 100) / 100;

  $: shortAccount = account
    ? `${account.substr(0, 6)}...${account.substr(40 - 2)}`
    : "No account";

  $: accountAvatarSvg = (account && avatars.create(account)) || "";
</script>

<style>
  .wallet-container {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    color: #333;
    display: flex;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    background-color: rgb(237, 238, 242);
    white-space: nowrap;
    width: 100%;
    border-radius: 12px;

    max-width: 250px;
  }

  .wallet-balance {
    box-sizing: border-box;
    padding-left: 0.75rem;
    padding-right: 0.5rem;
    font-weight: 500;
    margin: 0px;
  }

  .wallet-account {
    text-align: center;
    -webkit-box-pack: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    font-size: 16px;
    display: flex;
    width: 100%;
    -webkit-box-align: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    background-color: rgb(247, 248, 250);
    color: rgb(0, 0, 0);
    font-weight: 500;
    outline: none;
    text-decoration: none;
    flex-flow: row nowrap;
    padding: 0.5rem;
    border-radius: 12px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(237, 238, 242);
    border-image: initial;
  }

  .wallet-account:hover {
    background-color: rgb(255, 255, 255);
  }

  .wallet-account-address {
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1rem;
    width: fit-content;
    font-weight: 500;
    flex: 1 1 auto;
    overflow: hidden;
    margin: 0px 0.5rem 0px 0.25rem;
  }

  .wallet-account-avatar {
    height: 1rem;
    width: 1rem;
    background-color: rgb(206, 208, 217);
    border-radius: 1.125rem;
  }
</style>

<div class="wallet-container">
  <div class="wallet-balance">{roundedBalance} ETH</div>
  <button type="button" class="wallet-account">
    <p class="wallet-account-address">{shortAccount}</p>
    <div class="wallet-account-avatar">
      {@html accountAvatarSvg}
    </div>
  </button>
</div>
