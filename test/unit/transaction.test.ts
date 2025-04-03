import { ec as EC } from 'elliptic'
import Transaction from '../../src/wallet/transaction'

const ec = new EC('secp256k1')

describe('Transaction', () => {

    it('Should sing and validate transaction', () => {
        const keyPair = ec.genKeyPair();
        const tx = new Transaction(keyPair.getPublic('hex'), 'address2', 100);
        tx.signTransaction(keyPair);
        expect(tx.isValid()).toBe(true);
    });

    it('Should reject unsigned transaction', () => {
        const tx = new Transaction('sender', 'recipient', 100);
        expect(() => tx.isValid()).toThrow('No signature in this transaction'); // Mensaje exacto
    });

    it('Should detect tempered transaction', () => {
        const keyPair = ec.genKeyPair();
        const tx = new Transaction(keyPair.getPublic('hex'), 'recipient', 100);
        tx.signTransaction(keyPair);

        (tx as any).amount = 200;

        expect(tx.isValid()).toBe(false)
    });

});