import { createConfig } from "@ponder/core";
import { http } from "viem";

import { PhraseTradeMainAbi } from "./abis/PhraseTradeMainAbi";
import { PhraseTradeNFTAbi } from "./abis/PhraseTradeNFTAbi";
import { envs } from "./loadEnv";


export default createConfig({
  database: {
    kind: "postgres",
    // connectionString: "postgresql://user:password@localhost:5432/dbname",
    connectionString: process.env.DATABASE_URL,
    schema: "public", // or your desired schema
    poolConfig: {
      max: 100, // Adjust based on your needs
    },
  },
  // database: {
  //   kind: "sqlite"
  // },
  networks: {
    mainnet: {
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_1),
      pollingInterval: 1000,
    },
    ganache: {
      chainId: 1337,
      transport: http(process.env.PONDER_RPC_URL_1337),
      pollingInterval: 1000,
    },
    arbSepolia: {
      // chainId: 421614,
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_1337),
      pollingInterval: 1000,
    },
  },
  contracts: {
    PhraseTradeMain: {
      network: "arbSepolia",
      abi: PhraseTradeMainAbi,
      address: envs.PHRASE_TRADE_MAIN,
      // startBlock: 0,
      // startBlock: undefined,
    },
    PhraseTradeNFT: {
      network: "arbSepolia",
      abi: PhraseTradeNFTAbi,
      address: envs.PHRASE_TRADE_NFT,
      // startBlock: 0,
      // startBlock: undefined,
    },
  },

});


