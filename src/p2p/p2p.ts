import { Server, Socket } from 'socket.io';
import Blockchain from '../blockchain/blockchain';
import Block from '../block/block';
import Transaction from '../wallet/transaction';

class P2PServer {
  private readonly blockchain: Blockchain;
  private readonly sockets: Socket[] = [];
  private readonly io: Server;

  constructor(blockchain: Blockchain, httpServer: any) {
    this.blockchain = blockchain;
    this.io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    this.setupConnection();
  }

  private setupConnection(): void {
    this.io.on('connection', (socket) => {
      console.log('✅ New peer connected:', socket.id);
      this.sockets.push(socket);
      
      // Enviar la cadena al nuevo nodo
      this.sendChain(socket);

      // Escuchar eventos
      this.setupMessageHandlers(socket);
      this.handleError(socket);
    });
  }

  private setupMessageHandlers(socket: Socket): void {
    socket.on('blockchain', (chain: Block[]) => {
      try {
        console.log('Received new chain via P2P');
        this.handleReceivedChain(chain);
      } catch (error) {
        console.error('Error processing received chain:', error);
      }
    });

    socket.on('new-transaction', (transaction: Transaction) => {
      try {
        this.blockchain.addTransaction(transaction);
        console.log('New transaction added via P2P');
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error adding transaction:', error.message);
        } else {
          console.error('Error adding transaction:', error);
        }
      }
    });

    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  private handleReceivedChain(chain: Block[]): void {
    try {
      // replaceChain ya incluye la validación internamente
      this.blockchain.replaceChain(chain);
      console.log('🔗 Chain replacement attempted');
      this.broadcastChain();
    } catch (error) {
      if (error instanceof Error) {
        console.log('Chain replacement failed:', error.message);
      } else {
        console.log('Chain replacement failed:', error);
      }
    }
  }

  private handleDisconnect(socket: Socket): void {
    const index = this.sockets.indexOf(socket);
    if (index !== -1) {
      this.sockets.splice(index, 1);
      console.log('❌ Peer disconnected:', socket.id);
    }
  }

  private handleError(socket: Socket): void {
    socket.on('error', (error) => {
      console.error('Socket error:', error.message);
      this.handleDisconnect(socket);
    });
  }

  private sendChain(socket: Socket): void {
    socket.emit('blockchain', this.blockchain.getChain());
  }

  public broadcastChain(): void {
    console.log('Broadcasting chain to all peers...');
    this.sockets.forEach(socket => {
      this.sendChain(socket);
    });
  }

  public broadcastTransaction(transaction: Transaction): void {
    this.sockets.forEach(socket => {
      socket.emit('new-transaction', transaction);
    });
  }

  public getConnectedPeers(): string[] {
    // Obtener información útil de los peers
    return this.sockets.map(socket => {
      return socket.id || socket.handshake.address; // ID del socket o dirección IP
    });
  }


  public getChain():Block[] {
    return this.blockchain.getChain() as Block[]
  }

  public connectToPeers(peers: string[]): void {
    peers.forEach(peer => {
      const socket = require('socket.io-client')(peer, {
        reconnectionAttempts: 5,
        timeout: 10000
      });

      socket.on('connect', () => {
        console.log('🔌 Connected to peer:', peer);
        this.sockets.push(socket);
        this.setupMessageHandlers(socket);
      });

      socket.on('connect_error', (error: { message: any; }) => {
        console.error(`Connection error to peer ${peer}:`, error.message);
      });
    });
  }
}

export default P2PServer;