import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  withCredentials: true,
});

socket.on('connect', () => {
  console.log('Admin connected:', socket.id);
  socket.emit('admin-login');
});

socket.on('chat-request', (data) => {
  console.log('Chat request received:', data);
  // Simulate admin accepting the chat
  socket.emit('accept-chat', {
    userId: data.userId,
    userSocketId: data.socketId,
  });

  // Simulate admin sending a message
  setTimeout(() => {
    socket.emit('admin-message', {
      userId: data.userId,
      message: 'Hello! How can I assist you today?',
    });
  }, 1000);
});

socket.on('message', (data) => {
  console.log('Message from user:', data);
});