import dotenv from 'dotenv';
dotenv.config();

export default {
    PORT: process.env.PORT || 3000,
    DIFFICULTY: parseInt(process.env.DIFFICULTY || '2', 10),
    MINING_REWARD: parseInt(process.env.MINING_REWARD || '100', 10),
    PEERS: (process.env.PEERS || '').split(',')
};