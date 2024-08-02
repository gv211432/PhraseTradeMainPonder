import { createConfig } from "@ponder/core";
import { http } from "viem";
import { existsSync } from "fs";
import { config } from "dotenv";

import { PhraseTradeMainAbi } from "./abis/PhraseTradeMainAbi";
import { PhraseTradeNFTAbi } from "./abis/PhraseTradeNFTAbi";

// if file `/tmp/.env.brownie` exists, load it as environment variables
if (existsSync("/tmp/.env.brownie")) config({ path: "/tmp/.env.brownie" });

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
      address: process.env.PHRASE_TRADE_MAIN as `0x${string}`,
      startBlock: 0,
    },
    PhraseTradeNFT: {
      network: "arbSepolia",
      abi: PhraseTradeNFTAbi,
      address: process.env.PHRASE_TRADE_NFT as `0x${string}`,
      startBlock: 0,
    },
  },
});


