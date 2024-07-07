import { createConfig } from "@ponder/core";
import { http } from "viem";

import { config } from "dotenv";
// if file `/tmp/.env.brownie` exists, load it as environment variables
config({ path: "/tmp/.env.brownie" });

import { PhraseTradeMainAbi } from "./abis/PhraseTradeMainAbi";
import { PhraseTradeNFTAbi } from "./abis/PhraseTradeNFTAbi";

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
  },
  contracts: {
    PhraseTradeMain: {
      network: "ganache",
      abi: PhraseTradeMainAbi,
      address: process.env.PHRASE_TRADE_MAIN as `0x${string}`,
      startBlock: 0,
    },
    PhraseTradeNFT: {
      network: "ganache",
      abi: PhraseTradeNFTAbi,
      address: process.env.PHRASE_TRADE_NFT as `0x${string}`,
      startBlock: 0,
    },
  },
});


