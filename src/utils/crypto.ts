import { ec as EC } from 'elliptic';
import { SHA256 } from 'crypto-js';

const ec = new EC('secp256k1');

export const calculateHash = (...inputs: any[]): string => {
  return SHA256(
    inputs
      .map(input => JSON.stringify(input))
      .join('')
  ).toString();
};

export const verifySignature = (
  publicKey: string,
  signature: string,
  data: string
): boolean => {
  const key = ec.keyFromPublic(publicKey, 'hex');
  return key.verify(data, signature);
};