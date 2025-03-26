# 🧱 Blockchain Node

Implementación de una blockchain descentralizada con Node.js, TypeScript y arquitectura P2P. Incluye minería, transacciones firmadas criptográficamente y consenso distribuido.

## 🚀 Características Principales

- **Cadena de bloques inmutable** con Proof-of-Work
- **Transacciones seguras** usando criptografía ECDSA (Elliptic)
- **Red P2P** con WebSocket (socket.io)
- **API REST** para interactuar con el nodo
- **Wallet digital** con generación de claves
- **100% TypeScript** con tipado estricto

## 📦 Estructura del Proyecto

```bash
.
├── src/                # Código fuente
│   ├── block/          # Lógica de bloques
│   ├── blockchain/     # Cadena y consenso
│   ├── wallet/         # Billeteras y transacciones
│   ├── p2p/            # Comunicación entre nodos
│   └── api/            # API HTTP
├── tests/              # Pruebas unitarias
└── dist/               # Código compilado (JS)
