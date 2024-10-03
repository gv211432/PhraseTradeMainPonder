import { existsSync } from "fs";
import { config } from "dotenv";

// if file `/tmp/.env.brownie` exists, load it as environment variables
if (existsSync("/tmp/.env.brownie")) config({ path: "/tmp/.env.brownie" });

export const envs = {
  PROTOCOL_START_BLOCK: Number(process.env.PROTOCOL_START_BLOCK),

  PHRASE_TRADE_MAIN: process.env.PHRASE_TRADE_MAIN as `0x${string}`,
  PHRASE_TRADE_NFT: process.env.PHRASE_TRADE_NFT as `0x${string}`,

  PROTOCOL_CHAIN_ID: process.env.PROTOCOL_CHAIN_ID as string,

  PROTOCOL_FEE_PERCENT: parseFloat(process.env.PROTOCOL_FEE_PERCENT ?? "0") as number,
  OWNER_FEE_PERCENT: parseFloat(process.env.OWNER_FEE_PERCENT ?? "0") as number,
  CREATOR_FEE_PERCENT: parseFloat(process.env.CREATOR_FEE_PERCENT ?? "0") as number,
  REWARD_FEE_PERCENT: parseFloat(process.env.REWARD_FEE_PERCENT ?? "0") as number,
  REFLECTION_FEE_PERCENT: parseFloat(process.env.REFLECTION_FEE_PERCENT ?? "0") as number,
  MIN_FEES_CLAIM_THRESHOLD: parseFloat(process.env.MIN_FEES_CLAIM_THRESHOLD ?? "0") as number
};