import Block from '../../src/block/block';
import Blockchain from '../../src/blockchain/blockchain';
import Transaction from '../../src/wallet/transaction';
import Wallet from '../../src/wallet/wallet';

describe('Blockchain', () => {
    let blockchain: Blockchain;
    let wallet: Wallet;

    beforeEach(() => {
        blockchain = new Blockchain();
        wallet = new Wallet();
    })

    it('Should create genesis block', () => {
        const chain = blockchain.getChain();
        expect(chain).toHaveLength(1);
        expect(chain[0].getPreviousHash()).toBe('0');
    });

    it('Should add valid transaction', () => {
        const tx = wallet.createTransaction('address2', 100);
        blockchain.addTransaction(tx);
        expect(blockchain.getPendingTransactions()).toContain(tx);
    });

    it('should reject invalid transaction', () => {
        // Transacción SIN FIRMAR (inválida)
        const invalidTx = new Transaction("origen-falso", "destino", 100); 
        
        expect(() => blockchain.addTransaction(invalidTx)).toThrow('Invalid transaction');
    });

    // En test/unit/blockchain.test.ts
it('Should replace chain with valid longer chain', () => {
    // Obtener cadena actual
    const currentChain = blockchain.getChain();
    
    // Crear nuevo bloque válido
    const newBlock = new Block(
      currentChain.length, // Índice correcto
      { transactions: [], timestamp: Date.now() },
      currentChain[currentChain.length - 1].getHash(), // PreviousHash correcto
      2 // Dificultad correcta
    );
    
    // Minar el bloque
    newBlock.mineBlock();
  
    // Crear nueva cadena
    const newChain = [...currentChain, newBlock];
  
    // Reemplazar cadena
    const result = blockchain.replaceChain(newChain);
    
    expect(result).toBe(true);
    expect(blockchain.getChain()).toEqual(newChain);
  });

    it('Should reject shorter chain', () => {
        const result = blockchain.replaceChain([blockchain.getChain()[0]]);
        expect(result).toBe(false);
    });

});