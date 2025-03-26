import { Server, Socket } from 'socket.io';
import Blockchain from '../blockchain/blockchain';
import Block from '../block/block';


class P2PServer {
  private readonly blockchain: Blockchain;
  private readonly sockets: Socket[] = [];
  private readonly io: Server;

  constructor(blockchain: Blockchain, httpServer: any) {
    this.blockchain = blockchain;
    this.io = new Server(httpServer);
    this.setupConnection();
  }

  private setupConnection(): void {
    this.io.on('connection', (socket) => {
      console.log('✅ New peer connected:', socket.id);
      this.sockets.push(socket);
      
      // Enviar la cadena al nuevo nodo
      socket.emit('blockchain', this.blockchain.getChain());

      // Escuchar eventos
      this.setupMessageHandlers(socket);
    });
  }

  private setupMessageHandlers(socket: Socket): void {
    socket.on('blockchain', (chain: Block[]) => {
      // Validar y reemplazar la cadena si es más larga y válida
      if (chain.length > this.blockchain.getChain().length && this.isValidChain(chain)) {
        this.blockchain.replaceChain(chain);
        console.log('🔗 Blockchain replaced via P2P');
      }
    });

    socket.on('disconnect', () => {
      this.sockets.splice(this.sockets.indexOf(socket), 1);
      console.log('❌ Peer disconnected:', socket.id);
    });
  }

  // private isValidChain(chain: Block[]): boolean {
  // }

  public broadcastChain(): void {
    this.sockets.forEach(socket => {
      socket.emit('blockchain', this.blockchain.getChain());
    });
  }

  public connectToPeers(peers: string[]): void {
    peers.forEach(peer => {
      const socket = require('socket.io-client')(peer);
      socket.on('connect', () => {
        this.sockets.push(socket);
        console.log('🔌 Connected to peer:', peer);
      });
    });
  }
}

export default P2PServer;