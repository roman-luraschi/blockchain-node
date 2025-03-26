import express from 'express';
import Blockchain from '../blockchain/blockchain';
import Wallet from '../wallet/wallet';

class BlockchainAPI {
  private app: express.Application;
  private blockchain: Blockchain;
  private wallet: Wallet;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.blockchain = new Blockchain();
    this.wallet = new Wallet();
    this.setupEndpoints();
  }

  private setupEndpoints(): void {
    this.app.get('/blocks', (req, res) => {
      res.json(this.blockchain.getChain());
    });

    this.app.post('/transact', (req, res) => {
      const { toAddress, amount } = req.body;
      const tx = this.wallet.createTransaction(toAddress, amount);
      this.blockchain.addTransaction(tx);
      res.status(201).send('Transaction added to pending');
    });

    this.app.post('/mine', (req, res) => {
      this.blockchain.minePendingTransactions(this.wallet.getAddress());
      res.send('Block mined successfully');
    });
  }

  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Blockchain API running on http://localhost:${port}`);
    });
  }
}

const api = new BlockchainAPI();
api.start(3000);