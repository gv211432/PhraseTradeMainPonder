import { ethers } from 'ethers';
import { isValidEthAddress } from './signature';
import PhraseTradeMain from "../../abi/PhraseTradeMain.json";
import { envs } from '../../loadEnv';


/**
 * Equivalent to OpenZeppelin's ECDSA Library's tryRecover function
 * @param hash String representing the hash of the message
 * @param signature String representing the signature of the message 
 * @returns the recovered address
 */
export async function tryRecover(hash: string, signature: string): Promise<string> {
  if (signature.length === 132) { // 65 bytes * 2 characters per byte
    try {
      // Extract the r, s, and v values from the signature
      const r = `0x${signature.slice(2, 66)}`;
      const s = `0x${signature.slice(66, 130)}`;
      let v = parseInt(signature.slice(130, 132), 16);
      // Adjust v if necessary (Ethereum uses 27 and 28, but ethers.js expects 0 or 1)
      if (v !== 27 && v !== 28) {
        v -= 27;
      }

      // Use ethers.js utilities to recover the address
      const recoveredAddress = ethers.recoverAddress(hash, {
        r,
        s,
        v
      });

      return recoveredAddress;
    } catch (error) {
      return ethers.ZeroAddress;
    }
  } else {
    return ethers.ZeroAddress;
  }
}

/**
 * Equivalent to OpenZeppelin's ECDSA Library's sign function
 * @param hash String representing the hash of the message
 * @param privateKey String representing the private key of the signer
 * @returns the signature of the message
 */
export async function signMessage(hash: string, privateKey: string): Promise<string> {
  // Sign the hash directly using signDigest
  const signingKey = new ethers.SigningKey(privateKey);
  const sign = signingKey.sign(hash);
  // Convert the signature to a hex string
  return `0x${sign.r.slice(2)}${sign.s.slice(2)}${sign.v.toString(16)}`;
}

/**
 * Equivalent 
 * @param tokenURI
 * @param tillTimestamp
 * @param creator 
 * @returns 
 * @notice This function is used to get the struct hash of the minting of an NFT
 */
export const getStructHash = (tokenURI: string, tillTimestamp: number, creator: string): string => {
  const structHash = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ['bytes32', 'string', 'uint256', 'address'],
      [
        ethers.keccak256(ethers.toUtf8Bytes('Mint(string tokenURI,uint256 tillTimestamp,address creator)')),
        tokenURI,
        tillTimestamp,
        creator
      ]
    )
  );
  return structHash;
};

// Function to get the message hash
export const getMessageHash = (domainSeparator: string, structHash: string): string => {
  const messageHash = ethers.keccak256(
    ethers.concat([
      '0x1901',
      domainSeparator,
      structHash
    ])
  );
  return messageHash;
};

export const signMessageECDSA = async (message: string, privateKey: string): Promise<string> => {
  // Create a wallet instance from the private key
  const wallet = new ethers.Wallet(privateKey);

  // Sign the message
  const signature = await wallet.signMessage(ethers.toUtf8Bytes(message));

  // Return the signature as a hex string
  return signature;
};

const domain = {
  name: envs.NAME,
  version: envs.VERSION,
  verifyingContract: envs.VERIFYING_CONTRACT,
  chainId: parseInt(envs.CHAIN_ID ?? ""),
};

/**
 * Function to get the signature of the minting of an NFT
 * @param tokenURI String representing the URI of the NFT
 * @param tillTimestamp Number representing the timestamp until the NFT is mintable
 * @param creatorAddress String representing the address of the creator of the NFT
 * @returns the signature of the minting of the NFT
 * @notice This function is used to sign the minting of an NFT
 */
export const getNftMintSignature = async (tokenURI: string, tillTimestamp: number, creatorAddress: string) => {
  try {
    if (!isValidEthAddress(creatorAddress)) throw new Error("Invalid creator address");
    const domainHash = ethers.TypedDataEncoder.hashDomain(domain);
    const messageHash = getMessageHash(domainHash, getStructHash(tokenURI, tillTimestamp, creatorAddress));
    const signatureECDSA = await signMessage(messageHash, envs.MAIN_CONTROLLER_PK);
    // const recoverECDSA = await tryRecover(messageHash, signatureECDSA);
    return signatureECDSA;
  } catch (error: any) {
    console.log({ error });
    return null;
  }
};


export const generateMintTxData = async (tokenURI: string, tillTimestamp: number, signature: string) => {
  const iface = ethers.Interface.from(PhraseTradeMain);
  const data = iface.encodeFunctionData('verifyAndMint', [tokenURI, tillTimestamp, signature]);
  const value = "0";
  return { data, value };
};
