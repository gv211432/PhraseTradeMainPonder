import { envs } from "../../loadEnv";

export const E18 = BigInt(1e18);

/**
 * Get the price of a token based on the supply and quantity
 * @param supply The current supply of the token
 * @param qty The quantity of the token
 * @returns The price of the token
 * @example
 * ```ts
 * const supply = BigInt(1000000000000000000);
 * const qty = BigInt(1000000000000000000);
 * const price = getPrice(supply, qty);
 * console.log(price); // 1000000000000000000n
 * ```
 */
export function getPrice(supply: bigint, qty: bigint) {
  console.log('Supply: ', supply, 'Qty: ', qty);
  const sum1 =
    supply === BigInt(0)
      ? BigInt(0)
      : ((supply - E18) * supply * (BigInt(2) * (supply - E18) + E18)) /
      (BigInt(6) * E18);
  const sum2 =
    supply === BigInt(0) && qty === E18
      ? BigInt(0)
      : ((supply - E18 + qty) *
        (supply + qty) *
        (BigInt(2) * (supply - E18 + qty) + E18)) /
      (BigInt(6) * E18);
  const summation = (sum2 - sum1) / E18;
  return summation / BigInt(16_000);
}

// calculates the NFTs next price instantly
export function getBuyPriceAfterFees(price: bigint) {
  const priceNum = Number(price);
  const protocolFee = (priceNum * envs.PROTOCOL_FEE_PERCENT);
  const ownerFee = (priceNum * envs.OWNER_FEE_PERCENT);
  const creatorFee = (priceNum * envs.CREATOR_FEE_PERCENT);
  const rewardFee = (priceNum * envs.REFLECTION_FEE_PERCENT);
  const reflectionFee = (priceNum * envs.REFLECTION_FEE_PERCENT);

  return priceNum +
    protocolFee +
    ownerFee +
    creatorFee +
    rewardFee +
    reflectionFee;

}