
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export const checkExtensionAndBrowser = () => {
  if (typeof window !== `undefined`) {
    if (
      window.getOfflineSigner &&
      window.keplr &&
      window.keplr.experimentalSuggestChain
    ) {
      return true;
    } else {
      console.log("Keplr extension not found", window);
      throw(Error("Please use Chrome with Keplr extension."));
    }
  } else {
    console.log("Window is undefined :|", window);
  }
  return false;
};

export const suggestChain = async (chain) => {
  await window.keplr.experimentalSuggestChain({
    chainId: chain.chain_id,
    chainName: chain.name,
    rpc: chain.rpc,
    rest: chain.lcd,
    stakeCurrency: {
      coinDenom: chain.coinDenom,
      coinMinimalDenom: chain.coinMinimalDenom,
      coinDecimals: 6,
    },
    bip44: {
      coinType: chain.coinType ?? 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: chain.prefix,
      bech32PrefixAccPub: chain.prefix + "pub",
      bech32PrefixValAddr: chain.prefix + "valoper",
      bech32PrefixValPub: chain.prefix + "valoperpub",
      bech32PrefixConsAddr: chain.prefix + "valcons",
      bech32PrefixConsPub: chain.prefix + "valconspub",
    },
    currencies: [
      {
        coinDenom: chain.coinDenom,
        coinMinimalDenom: chain.coinMinimalDenom,
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: chain.coinDenom,
        coinMinimalDenom: chain.coinMinimalDenom,
        coinDecimals: 6,
      },
    ],
    coinType: chain.coinType ?? 118,
    gasPriceStep: chain.gasPriceStep ?? {
      low: 0.0,
      average: 0.01,
      high: 0.025,
    },
    features: chain.features ?? ["stargate", "ibc-transfer"],
  });
};

export const connectKeplr = async (chain) => {

  // check browser compatibility
  if (!checkExtensionAndBrowser()) {
    return false;
  }

  // suggest chain and approve network
  let error = false;
  await suggestChain(chain);
  await window.keplr.enable(chain.chain_id).catch((e) => {
      console.log(e);
      error = true;
  });
  
  if (error) {
    return false;
  }

  // Setup signer
  const offlineSigner = await window.getOfflineSignerOnlyAmino(chain.chain_id);
  const accounts = await offlineSigner.getAccounts().catch((e) => console.log(e));

  // Init cosmjs client
  const cosmJS = await SigningCosmWasmClient.connectWithSigner(
    chain.rpc,
    offlineSigner,
    accounts[0].address
  );

   console.log(cosmJS)

   return [cosmJS, accounts];
};