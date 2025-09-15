import { Server as SocketIOServer } from 'socket.io';
import { logger, logWebSocketEvent } from '../utils/logger';

export const initializeWebSocket = (io: SocketIOServer): void => {
  logger.info('Initializing WebSocket server...');
  
  io.on('connection', (socket) => {
    logWebSocketEvent('USER_CONNECTED', socket.id, { 
      socketId: socket.id,
      userAgent: socket.request.headers['user-agent']
    });

    // Handle user joining a room
    socket.on('join_room', (data: { roomId: string }) => {
      logWebSocketEvent('JOIN_ROOM', socket.id, { roomId: data.roomId });
      socket.join(data.roomId);
      socket.emit('joined_room', { roomId: data.roomId });
    });

    // Handle sending messages
    socket.on('send_message', (data: { roomId: string; content: string }) => {
      logWebSocketEvent('SEND_MESSAGE', socket.id, { 
        roomId: data.roomId, 
        messageLength: data.content.length 
      });
      
      // For now, just echo the message back
      io.to(data.roomId).emit('message_received', {
        roomId: data.roomId,
        message: {
          id: `msg_${Date.now()}`,
          content: data.content,
          sender: 'DemoUser',
          timestamp: new Date().toISOString()
        }
      });
    });

    // Handle location updates
    socket.on('update_location', (data: { latitude: number; longitude: number; accuracy: number }) => {
      logWebSocketEvent('LOCATION_UPDATE', socket.id, { 
        coordinates: [data.longitude, data.latitude],
        accuracy: data.accuracy 
      });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logWebSocketEvent('USER_DISCONNECTED', socket.id, { 
        reason,
        socketId: socket.id 
      });
    });
  });

  logger.info('WebSocket server initialized successfully');
};