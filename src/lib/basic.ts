// Custom replacer function to handle BigInt serialization
export const bigintParser = (key: string, value: any) => {
  if (typeof value === 'bigint') { // Check if the value is a BigInt
    return value.toString(); // Convert BigInt to string
  } else {
    return value; // Return the value unchanged if not a BigInt
  }
};

export const convertBigIntToString = (obj: any): any => {
  const replacer = (key: string, value: any) => typeof value === 'bigint' ? value.toString() : value;
  return JSON.parse(JSON.stringify(obj, replacer));
};

/**
 * Checks if the given Ethereum address is the zero address.
 * @param address - The Ethereum address to check.
 * @returns `true` if the address is the zero address, `false` otherwise.
 */
export function isZeroAddress(address: string): boolean {
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  return address.toLowerCase() === zeroAddress;
}
