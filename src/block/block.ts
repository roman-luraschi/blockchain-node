import { SHA256 } from 'crypto-js';
import Transaction from '../wallet/transaction';

interface BlockData {
  readonly transactions: Transaction[];
  readonly timestamp: number;
}

class Block {
  private readonly index: number;
  private readonly timestamp: number;
  private readonly data: BlockData;
  private readonly previousHash: string;
  private hash: string;
  private nonce: number;
  private readonly difficulty: number;

  constructor(index: number, data: BlockData, previousHash: string, difficulty: number) {
    this.index = index;
    this.timestamp = Date.now();
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.difficulty = difficulty;
    this.hash = this.calculateHash();
  }

  public getHash(): string {
    return this.hash;
  }

  public getDifficulty(): number {
    return this.difficulty;
  }

  public getPreviousHash(): string {
    return this.previousHash;
  }

  public getData(): Readonly<BlockData> {
    return this.data;
  }

  public getIndex(): number {
    return this.index;
  }

  private calculateHash(): string {
    return SHA256(
      `${this.index}${this.previousHash}${this.timestamp}${JSON.stringify(this.data)}${this.nonce}`
    ).toString();
  }

  public isValid(): boolean {
    return this.hash === this.calculateHash() && this.getHash().startsWith('0'.repeat(this.difficulty)); 
}

  public mineBlock(): void {
    while (this.hash.substring(0, this.difficulty) !== '0'.repeat(this.difficulty)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

export default Block;