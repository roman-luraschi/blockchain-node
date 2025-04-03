import express from 'express';
import http from 'http';
import Blockchain from '../blockchain/blockchain';
import P2PServer from '../p2p/p2p';

const app = express();
const server = http.createServer(app);
const blockchain = new Blockchain();
const p2pServer = new P2PServer(blockchain, server);

app.use(express.json())
// Endpoint para minar bloques
// ✅ Versión corregida
app.post('/mine', (req, res) => {
  try {
    const { minerAddress } = req.body;

    if (!minerAddress) {
      throw new Error('Miner address is required');
    }

    blockchain.minePendingTransactions(minerAddress);
    p2pServer.broadcastChain();

    res.status(200).json({
      message: 'New block mined successfully'
    });

  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Mining failed'
    });
  }
});


// Endpoint para conectar peers
app.post('/peers', (req, res) => {
  try {
    const { peers } = req.body;
    p2pServer.connectToPeers(peers);
    res.status(200).json({ message: 'Connecting to peers' });
  } catch (error) {
    res.status(400).json({error: error instanceof Error ? error.message : 'invalid-peer-format'})
  }

});

// src/api/api.ts
app.get('/blocks', (req, res) => {
  try {
    const chain = blockchain.getChain();
    
    if (!chain || chain.length === 0) {
      throw new Error('Blockchain not initialized');
    }

    res.status(200).json({
      chain: chain,
      length: chain.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve blockchain',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET: Transacciones pendientes
app.get('/transactions/pending', (req, res) => {
  res.json(blockchain.getPendingTransactions());
});

// GET: Balance de una dirección
app.get('/balance/:address', (req, res) => {
  try {
    const balance = blockchain.getBalance(req.params.address);
    res.json({ address: req.params.address, balance });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
});

// GET: Información del nodo
app.get('/info', (req, res) => {
  res.json({
    nodeId: process.env.NODE_ID || 'local',
    version: '1.0.0',
    peers: p2pServer.getConnectedPeers()
  });
});


// Inicialización (solo si no estamos en modo test)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.HTTP_PORT || 3000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    p2pServer.connectToPeers(process.env.PEERS?.split(',') || []);
  });
}
export { app, server };