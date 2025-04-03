import { ec as EC } from 'elliptic';
import { SHA256 } from 'crypto-js';

const ec = new EC('secp256k1');

class Transaction {
  
  private readonly fromAddress: string | null;
  private readonly toAddress: string;
  private readonly amount: number;
  private signature: string;
  private readonly timestamp: number;

  constructor(fromAddress: string | null, toAddress: string, amount: number) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
    this.signature = '';
  }

  public getFromAddress(): string | null {
    return this.fromAddress;
  }

  public getToAddress(): string {
    return this.toAddress;
  }

  public getAmount(): number {
    return this.amount;
  }

  public calculateHash(): string {
    return SHA256(
      `${this.fromAddress}${this.toAddress}${this.amount}${this.timestamp}`
    ).toString();
  }

  public signTransaction(signingKey: EC.KeyPair): void {
    if (this.fromAddress && signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!');
    }
    this.signature = signingKey.sign(this.calculateHash(), 'base64').toDER('hex');
  }

  public isValid(): boolean {
    if (this.fromAddress === null) return true; 

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress!, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

export default Transaction;