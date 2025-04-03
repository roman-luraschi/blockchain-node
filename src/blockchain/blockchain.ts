import Block from '../block/block';
import Transaction from '../wallet/transaction';

class Blockchain {
  private chain: Block[];
  private pendingTransactions: Transaction[];
  private readonly difficulty: number;
  private readonly miningReward: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.difficulty = 2;
    this.miningReward = 100;
  }

  // Getters
  public getChain(): Block[] {
    return [...this.chain];
  }

  public getDifficulty(): number {
    return this.difficulty;
  }

  public getPendingTransactions(): Readonly<Transaction[]> {
    return [...this.pendingTransactions];
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  private createGenesisBlock(): Block {
    return new Block(0, { transactions: [], timestamp: Date.now() }, '0', 0);
  }

  public addTransaction(transaction: Transaction): void {
    if (!transaction.isValid()) {
      throw new Error('Invalid transaction');
    }
    this.pendingTransactions.push(transaction);
  }

  // En src/blockchain/blockchain.ts
  public replaceChain(newChain: Block[]): boolean {
    if (newChain.length <= this.chain.length) {
      console.log("Received chain is not longer");
      return false;
    }

    if (!this.isValidChain(newChain)) {
      console.log("Received chain is invalid");
      return false;
    }

    this.chain = newChain;
    console.log("Chain replaced successfully");
    return true;
  }

  private isValidChain(chain: Block[]): boolean {
    // Comparar con el génesis REAL de la cadena actual, no crear uno nuevo
    if (JSON.stringify(chain[0]) !== JSON.stringify(this.chain[0])) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      if (!currentBlock.isValid() ||
        currentBlock.getPreviousHash() !== previousBlock.getHash() ||
        !currentBlock.getHash().startsWith('0'.repeat(currentBlock.getDifficulty()))) {
        return false;
      }
    }

    return true;
  }

  private isValidAddress(address: string): boolean {
    return typeof address === 'string' && address.length > 0
  }

  public getBalance(address: string): number {
    if (!this.isValidAddress(address)) { throw new Error('Invalid address') }
    let balance: number
    balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.getData().transactions) {
        if (transaction.getFromAddress() === address) {
          balance -= transaction.getAmount()
        }
        if (transaction.getToAddress() === address) {
          balance += transaction.getAmount()
        }
      }
    }
    return balance;
  }

  public minePendingTransactions(miningRewardAddress: string): void {
    const rewardTx = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    );
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      this.chain.length,
      {
        transactions: this.pendingTransactions,
        timestamp: Date.now()
      },
      this.getLatestBlock().getHash(),
      this.difficulty
    );
    block.mineBlock();

    this.chain.push(block);
    this.pendingTransactions = [];
  }
}

export default Blockchain;