import { describe } from 'node:test';
import Block from '../../src/block/block';
import Transaction from '../../src/wallet/transaction';

describe('Block', () => {
    const mockTransaction = [new Transaction(null,'address2',100)]

    it('Should calculate valid hash', () => {
        const block = new Block(0,{transactions: mockTransaction, timestamp: Date.now()}, '0',2)
        const hash = block.getHash()
        expect(hash).toMatch(/^[0-9a-f]{64}$/)
    });


    it('Should mine block with valid proof-of-work', () => {
        const block = new Block(1,{transactions: mockTransaction, timestamp: Date.now()}, 'prev-hash', 2)
        block.mineBlock()
        expect(block.getHash().substring(0, 2)).toBe('00')
    })

    it('should detect tampered block', () => {
        // Bloque original
        const originalBlock = new Block(0, { 
          transactions: [], 
          timestamp: Date.now() 
        }, '0', 2);
        const originalHash = originalBlock.getHash();
      
        // Crear nuevo bloque modificado (no alterar el original)
        const tamperedData = {
          transactions: [new Transaction(null, 'address', 999)],
          timestamp: Date.now()
        };
        
        const tamperedBlock = new Block(
          originalBlock.getIndex(),
          tamperedData,
          originalBlock.getPreviousHash(),
          originalBlock.getDifficulty() // Si tu bloque tiene dificultad
        );
        
        expect(tamperedBlock.getHash()).not.toBe(originalHash);
      });
});

