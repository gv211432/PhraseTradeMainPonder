import { createConfig } from "@ponder/core";
import { http } from "viem";

import { PhraseTradeMainAbi } from "./abis/PhraseTradeMainAbi";
import { PhraseTradeNFTAbi } from "./abis/PhraseTradeNFTAbi";
import { envs } from "./loadEnv";

console.log({
  PROTOCOL_FEE_PERCENT: envs.PROTOCOL_FEE_PERCENT,
  OWNER_FEE_PERCENT: envs.OWNER_FEE_PERCENT,
  CREATOR_FEE_PERCENT: envs.CREATOR_FEE_PERCENT,
  REWAREWARD_FEE_PERCENT: envs.REWARD_FEE_PERCENT,
  REFLECTION_FEE_PERCENT: envs.REFLECTION_FEE_PERCENT,
});

export default createConfig({
  database: {
    kind: "postgres",
    connectionString: process.env.DATABASE_URL,
    schema: "public", // or your desired schema
    publishSchema: "publish",
    poolConfig: {
      max: 100, // Adjust based on your needs
    },
  },
  // database: {
  //   kind: "sqlite"
  // },
  networks: {
    // mainnet: {
    //   chainId: 1,
    //   transport: http(process.env.PONDER_RPC_URL_1),
    //   pollingInterval: 1000,
    // },
    // ganache: {
    //   chainId: 1337,
    //   transport: http(process.env.PONDER_RPC_URL_1337),
    //   pollingInterval: 1000,
    // },
    arbSepolia: {
      chainId: Number(envs.PROTOCOL_CHAIN_ID),
      transport: http(process.env.ARBITRUM_RPC),
      pollingInterval: 1000,
    },
  },
  contracts: {
    PhraseTradeMain: {
      network: "arbSepolia",
      abi: PhraseTradeMainAbi,
      address: envs.PHRASE_TRADE_MAIN,
      startBlock: envs.PROTOCOL_START_BLOCK,
    },
    PhraseTradeNFT: {
      network: "arbSepolia",
      abi: PhraseTradeNFTAbi,
      address: envs.PHRASE_TRADE_NFT,
      startBlock: envs.PROTOCOL_START_BLOCK,
    },
  },

});


