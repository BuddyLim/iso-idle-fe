import { ClientToServerEvents, ServerToClientEvents } from 'types/Socket.type';
import { Socket } from 'socket.io-client';
import { createContext } from 'react';

export const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents> | undefined>(undefined)
