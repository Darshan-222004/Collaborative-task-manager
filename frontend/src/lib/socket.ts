import { io, Socket } from 'socket.io-client';

/**
 * Singleton instance of the Socket.io client.
 * Initialized lazily when getSocket() is called.
 */
let socket: Socket | null = null;

/**
 * Helper to get or initialize the Socket.io client.
 * Connects to the backend URL and passes the JWT token for authentication.
 * @returns {Socket} The active Socket.io client instance
 */
export const getSocket = (): Socket => {
  if (!socket) {
    const token = localStorage.getItem('token');

    socket = io('http://localhost:5000', {
      auth: {
        token,
      },
      autoConnect: false, // Wait for manual connection
    });
  }
  return socket;
};

/**
 * Disconnects the Socket.io client and resets the instance.
 * Should be called on user logout or application unmount.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
