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
  public getChain(): Readonly<Block[]> {
    return [...this.chain];
  }

  public getPendingTransactions(): Readonly<Transaction[]> {
    return [...this.pendingTransactions];
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  private createGenesisBlock(): Block {
    return new Block(0, { transactions: [], timestamp: Date.now() }, '0');
  }

  public addTransaction(transaction: Transaction): void {
    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain');
    }
    this.pendingTransactions.push(transaction);
  }

  public replaceChain(newChain: Block[]): void {
    if (newChain.length <= this.chain.length) {
      console.log("Received chain is not longer than current chain");
      return;
    }

    if (!this.isValidChain(newChain)) {
      console.log("Received chain is invalid");
      return;
    }

    console.log("Replacing blockchain with new valid chain");
    this.chain = newChain;
  }

  private isValidChain(chain: Block[]): boolean {
    const genesis = JSON.stringify(chain[0]);
    const correctGenesis = JSON.stringify(this.createGenesisBlock());
    if (genesis !== correctGenesis) return false;
    for (let i = 1; i<chain.length; i++) {
        const currentBlock = chain[i];
        const previousBlock = chain[i-1];

        if(!currentBlock.isValid()) return false;
        if(currentBlock.getPreviousHash() !== previousBlock.getHash()) return false;
    }
    return true;
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