import { createConfig } from "@ponder/core";
import { http } from "viem";

import { PhraseTradeMainAbi } from "./abis/PhraseTradeMainAbi";
import { PhraseTradeNFTAbi } from "./abis/PhraseTradeNFTAbi";
import { envs } from "./loadEnv";


export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
    ganache: {
      chainId: 1337,
      transport: http(process.env.PONDER_RPC_URL_1337),
    },
    arbSepolia: {
      // chainId: 421614,
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_1337),
    },
  },
  contracts: {
    PhraseTradeMain: {
      network: "arbSepolia",
      abi: PhraseTradeMainAbi,
      address: envs.PHRASE_TRADE_MAIN,
      startBlock: 0,
    },
    PhraseTradeNFT: {
      network: "arbSepolia",
      abi: PhraseTradeNFTAbi,
      address: envs.PHRASE_TRADE_NFT,
      startBlock: 0,
    },
  },
});


