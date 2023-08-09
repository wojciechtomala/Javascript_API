
const messageInput = document.getElementById('message-input');
const messageContainer = document.querySelector('#message-container');
// CLIENT SIDE JS:
const socket = io('http://127.0.0.1:3000');
const name = prompt('What is your name?');
appendMessage('You Joined');
socket.emit('new-user', name);
socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
    console.log(`${name} connected`);
});

socket.on('user-disconnected', name => {
    console.log(`${name} disconnected`);
});

const messageForm = document.querySelector('#send-container');
messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message', message);
    messageInput.value = '';
}); 

// APPENDING MESSAGES TO INDEX FILE:
function appendMessage(message){
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}