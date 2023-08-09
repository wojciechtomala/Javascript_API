const express = require('express');
// APP VARIABLE TO CONFIGURE SERVER:
// CREATING SERVER USING SOCKET IO:
const io = require('socket.io')(3000, {
    cors: {
      origin: '*',
    }
  });
// EVERY TIME USER LOADS UP WEBSITE IT CALL THIS FUNCTION:

const users = {}

io.on('connection', socket => {
    console.log('New user entered the chat-app');
    socket.emit('chat-message', 'Hello!');
    socket.on('new-user', name => { 
        users[socket.id] = name;
    });
    socket.on('send-chat-message', message => {
        console.log("User message:" + message);
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id];
    });
});
