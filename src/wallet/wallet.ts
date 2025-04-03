import { ec as EC } from 'elliptic';
import Transaction from './transaction';

const ec = new EC('secp256k1');

class Wallet {
  private readonly keyPair: EC.KeyPair;
  private readonly publicKey: string;

  constructor() {
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic('hex');
  }

  public getAddress(): string {
    return this.publicKey;
  }

  public createTransaction(toAddress: string, amount: number): Transaction {
    const tx = new Transaction(this.publicKey, toAddress, amount);
    tx.signTransaction(this.keyPair);
    return tx;
  }
}

export default Wallet;