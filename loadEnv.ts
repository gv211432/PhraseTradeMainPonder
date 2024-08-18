import { existsSync } from "fs";
import { config } from "dotenv";

// if file `/tmp/.env.brownie` exists, load it as environment variables
if (existsSync("/tmp/.env.brownie")) config({ path: "/tmp/.env.brownie" });

export const envs = {
  PHRASE_TRADE_EIP712: process.env.PHRASE_TRADE_EIP712 as `0x${string}`,
  PHRASE_TRADE_MAIN: process.env.PHRASE_TRADE_MAIN as `0x${string}`,
  PHRASE_TRADE_STORAGE: process.env.PHRASE_TRADE_STORAGE as `0x${string}`,
  PHRASE_TRADE_NFT: process.env.PHRASE_TRADE_NFT as `0x${string}`,
  PROTOCOL_OWNER: process.env.PROTOCOL_OWNER as `0x${string}`,
  MAIN_CONTROLLER: process.env.MAIN_CONTROLLER as `0x${string}`,
  NFT_CONTROLLER: process.env.NFT_CONTROLLER as `0x${string}`,
  STORAGE_CONTROLLER: process.env.STORAGE_CONTROLLER as `0x${string}`,
  STORAGE_ADMIN: process.env.STORAGE_ADMIN as `0x${string}`,
  PROTOCOL_BENEFIARY: process.env.PROTOCOL_BENEFIARY as `0x${string}`,
  ADDRESS_9: process.env.ADDRESS_9 as `0x${string}`,
  ADDRESS_10: process.env.ADDRESS_10 as `0x${string}`,

  MAIN_CONTROLLER_PK: process.env.MAIN_CONTROLLER_PK as `0x${string}`,
  PRIVATE_KEY_9: process.env.PRIVATE_KEY_9 as `0x${string}`,
  PRIVATE_KEY_10: process.env.PRIVATE_KEY_10 as `0x${string}`,

  NAME: process.env.NAME as string,
  VERSION: process.env.VERSION as string,
  VERIFYING_CONTRACT: process.env.VERIFYING_CONTRACT as `0x${string}`,
  CHAIN_ID: process.env.CHAIN_ID as string,
  DOMAIN_SEPARATOR: process.env.DOMAIN_SEPARATOR as `0x${string}`,

  PROTOCOL_FEE_PERCENT: parseFloat(process.env.PROTOCOL_FEE_PERCENT ?? "0") as number,
  OWNER_FEE_PERCENT: parseFloat(process.env.OWNER_FEE_PERCENT ?? "0") as number,
  CREATOR_FEE_PERCENT: parseFloat(process.env.CREATOR_FEE_PERCENT ?? "0") as number,
  REWARD_FEE_PERCENT: parseFloat(process.env.REWARD_FEE_PERCENT ?? "0") as number,
  REFLECTION_FEE_PERCENT: parseFloat(process.env.REFLECTION_FEE_PERCENT ?? "0") as number,
  MIN_FEES_CLAIM_THRESHOLD: parseFloat(process.env.MIN_FEES_CLAIM_THRESHOLD ?? "0") as number
};