// server.js

const WebSocket = require('ws');
const express=require('express');
const app=express();
// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 3000 });

// Event listener for new client connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send a welcome message to the newly connected client
  ws.send('Welcome to the WebSocket server!');

  // Handle messages received from the client
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    
    // Broadcast the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:3000');
app.listen(3001,()=>{
    console.log("Server run on port 3001");
})