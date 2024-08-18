
/**
 * Checks if a string is a valid Ethereum address.
 * 
 * @param address The Ethereum address to validate.
 * @returns true if the address is valid, false otherwise.
 */
export const isValidEthAddress = (address: string): boolean => {
  // Check if the address is the correct length and format
  const regex = /^0x[a-fA-F0-9]{40}$/;
  return regex.test(address);
};