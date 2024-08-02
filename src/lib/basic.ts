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
